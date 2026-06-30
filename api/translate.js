import { randomUUID } from 'node:crypto'
import { Buffer } from 'node:buffer'
import process from 'node:process'

const AZURE_ENDPOINT = 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0'
const SUPPORTED_LANGUAGES = new Set(['bn', 'hi', 'ne', 'en'])
const MAX_TEXT_LENGTH = 500
const MAX_BODY_BYTES = 8 * 1024
const REQUESTS_PER_MINUTE = 30
const requestBuckets = new Map()

const sendJson = (response, status, body) => {
  response.statusCode = status
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Cache-Control', 'no-store, max-age=0')
  response.setHeader('X-Content-Type-Options', 'nosniff')
  response.end(JSON.stringify(body))
}

const readBody = async (request) => {
  if (request.body && typeof request.body === 'object') return request.body
  if (typeof request.body === 'string') return JSON.parse(request.body)

  let size = 0
  const chunks = []
  for await (const chunk of request) {
    size += chunk.length
    if (size > MAX_BODY_BYTES) {
      const error = new Error('Payload too large')
      error.status = 413
      throw error
    }
    chunks.push(chunk)
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')
}

const getClientAddress = (request) => {
  const forwarded = request.headers['x-forwarded-for']
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim()
  return request.socket?.remoteAddress || 'unknown'
}

const isRateLimited = (request) => {
  const now = Date.now()
  const address = getClientAddress(request)
  const current = requestBuckets.get(address)
  if (requestBuckets.size > 1000) {
    for (const [key, bucket] of requestBuckets) {
      if (bucket.resetAt <= now) requestBuckets.delete(key)
    }
  }
  if (!current || current.resetAt <= now) {
    requestBuckets.set(address, { count: 1, resetAt: now + 60_000 })
    return false
  }
  current.count += 1
  return current.count > REQUESTS_PER_MINUTE
}

const validateRequest = ({ text, fromLang, toLang } = {}) => {
  if (typeof text !== 'string' || !text.trim()) return 'Enter text to translate.'
  if (text.trim().length > MAX_TEXT_LENGTH) return `Text must be ${MAX_TEXT_LENGTH} characters or fewer.`
  if (!SUPPORTED_LANGUAGES.has(fromLang) || !SUPPORTED_LANGUAGES.has(toLang)) return 'Unsupported language selection.'
  return null
}

export default async function handler(request, response) {
  const origin = request.headers.origin || ''
  const isCapacitorOrigin = /^capacitor:\/\/localhost$/.test(origin) || /^https?:\/\/localhost(?::\d+)?$/.test(origin)
  if (isCapacitorOrigin) {
    response.setHeader('Access-Control-Allow-Origin', origin)
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    response.setHeader('Vary', 'Origin')
  }
  if (request.method === 'OPTIONS') {
    return isCapacitorOrigin
      ? sendJson(response, 204, {})
      : sendJson(response, 403, { error: 'Cross-site requests are not allowed.' })
  }
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return sendJson(response, 405, { error: 'Method not allowed.' })
  }
  // Block hostile cross-site browser requests. Capacitor WebViews use the
  // capacitor://localhost origin, which browsers classify as cross-site —
  // so we allow it explicitly alongside same-origin/same-site/none.
  const fetchSite = request.headers['sec-fetch-site']
  if (fetchSite === 'cross-site' && !isCapacitorOrigin) {
    return sendJson(response, 403, { error: 'Cross-site requests are not allowed.' })
  }
  if (!request.headers['content-type']?.toLowerCase().startsWith('application/json')) {
    return sendJson(response, 415, { error: 'Content-Type must be application/json.' })
  }
  if (isRateLimited(request)) {
    response.setHeader('Retry-After', '60')
    return sendJson(response, 429, { error: 'Too many translation requests. Please wait a minute.' })
  }

  let body
  try {
    body = await readBody(request)
  } catch (error) {
    return sendJson(response, error.status || 400, { error: 'Invalid request body.' })
  }

  const validationError = validateRequest(body)
  if (validationError) return sendJson(response, 400, { error: validationError })

  const text = body.text.trim()
  const { fromLang, toLang } = body
  if (fromLang === toLang) return sendJson(response, 200, { translation: text })

  const key = process.env.AZURE_TRANSLATOR_KEY
  const region = process.env.AZURE_TRANSLATOR_REGION
  if (!key || !region) {
    console.error('[KothaSetu] Server translation credentials are not configured.')
    return sendJson(response, 503, { error: 'Translation is temporarily unavailable.' })
  }

  const controller = new AbortController()
  // Mobile requests can arrive after a Vercel cold start; give Azure enough
  // time to respond while retaining a firm upstream deadline.
  const timeout = setTimeout(() => controller.abort(), 20_000)
  const query = new URLSearchParams({ from: fromLang, to: toLang, textType: 'plain' })

  try {
    const upstream = await fetch(`${AZURE_ENDPOINT}&${query}`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': key,
        'Ocp-Apim-Subscription-Region': region,
        'X-ClientTraceId': randomUUID(),
      },
      body: JSON.stringify([{ text }]),
    })

    if (!upstream.ok) {
      console.error('[KothaSetu] Azure Translator request failed:', upstream.status)
      return sendJson(response, 502, { error: 'Translation provider could not complete the request.' })
    }

    const data = await upstream.json()
    const translation = data[0]?.translations?.[0]?.text
    if (typeof translation !== 'string' || !translation.trim()) return sendJson(response, 502, { error: 'Translation provider returned an invalid response.' })
    return sendJson(response, 200, { translation })
  } catch (error) {
    if (error.name === 'AbortError') return sendJson(response, 504, { error: 'Translation timed out. Please try again.' })
    console.error('[KothaSetu] Translation provider is unreachable:', error.message)
    return sendJson(response, 502, { error: 'Translation service could not be reached.' })
  } finally {
    clearTimeout(timeout)
  }
}
