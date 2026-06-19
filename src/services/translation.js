import { platformServices } from './platform/platformAdapter'

// In web PWA: relative URL works (same-origin Vite/Vercel handler).
// In Android APK: VITE_API_BASE_URL must be set to the deployed API origin
// e.g. https://kothasetu.vercel.app  or  http://192.168.x.x:5173 for local dev.
const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')
const TRANSLATION_ENDPOINT = `${API_BASE}/api/translate`
const SUPPORTED_LANGUAGES = new Set(['bn', 'hi', 'ne', 'en'])
const MAX_TEXT_LENGTH = 500

export async function translateText(text, fromLang, toLang) {
  const content = text?.trim()
  if (!content) return ''
  if (fromLang === toLang) return content
  if (!await platformServices.connectivity.isOnline()) throw new Error('Live translation is unavailable offline. Use the Phrasebook or SOS phrases.')
  if (content.length > MAX_TEXT_LENGTH) throw new Error(`Text must be ${MAX_TEXT_LENGTH} characters or fewer.`)
  if (!SUPPORTED_LANGUAGES.has(fromLang) || !SUPPORTED_LANGUAGES.has(toLang)) throw new Error('Unsupported language selection.')

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 12_000)
  try {
    const response = await fetch(TRANSLATION_ENDPOINT, {
      method: 'POST',
      signal: controller.signal,
      credentials: API_BASE ? 'omit' : 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: content, fromLang, toLang }),
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(data.error || 'Translation failed. Please try again.')
    if (typeof data.translation !== 'string' || !data.translation.trim()) throw new Error('Translation returned an invalid response.')
    return data.translation
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('Translation timed out. Please try again.', { cause: error })
    throw new Error(error.message || 'Translation failed. Please check your connection.', { cause: error })
  } finally {
    clearTimeout(timeout)
  }
}
