import { useState, useCallback, useEffect, useRef } from 'react'

const LANG_SPEECH_CODES = {
  bn: ['bn-IN', 'bn-BD', 'bn'],
  ne: ['ne-NP', 'ne', 'hi-IN'],
  hi: ['hi-IN', 'hi'],
  en: ['en-IN', 'en-GB', 'en-US', 'en'],
}

let voiceCache = []
let voiceLoadPromise = null

function loadVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return Promise.resolve([])

  const available = window.speechSynthesis.getVoices()
  if (available.length) {
    voiceCache = available
    return Promise.resolve(available)
  }
  if (voiceLoadPromise) return voiceLoadPromise

  voiceLoadPromise = new Promise((resolve) => {
    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      window.speechSynthesis.removeEventListener?.('voiceschanged', handleVoicesChanged)
      voiceCache = window.speechSynthesis.getVoices()
      resolve(voiceCache)
      voiceLoadPromise = null
    }
    const handleVoicesChanged = () => {
      if (window.speechSynthesis.getVoices().length) finish()
    }

    window.speechSynthesis.addEventListener?.('voiceschanged', handleVoicesChanged, { once: true })
    setTimeout(finish, 1800)
  })

  return voiceLoadPromise
}

function findVoice(langCode, voices) {
  const codes = LANG_SPEECH_CODES[langCode] || [langCode]
  for (const code of codes) {
    const exact = voices.find((voice) => voice.lang.toLowerCase() === code.toLowerCase())
    if (exact) return { voice: exact, lang: exact.lang }
  }

  const baseLanguage = codes[0].split('-')[0].toLowerCase()
  const partial = voices.find((voice) => voice.lang.toLowerCase().split('-')[0] === baseLanguage)
  return { voice: partial || null, lang: partial?.lang || codes[0] }
}

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPreparing, setIsPreparing] = useState(false)
  const [noVoiceAvailable, setNoVoiceAvailable] = useState(false)
  const requestRef = useRef(0)
  const utteranceRef = useRef(null)
  const startTimeoutRef = useRef(null)
  const keepAliveRef = useRef(null)
  const mountedRef = useRef(true)

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window

  const clearTimers = useCallback(() => {
    if (startTimeoutRef.current) clearTimeout(startTimeoutRef.current)
    if (keepAliveRef.current) clearInterval(keepAliveRef.current)
    startTimeoutRef.current = null
    keepAliveRef.current = null
  }, [])

  const stop = useCallback(() => {
    requestRef.current += 1
    clearTimers()
    utteranceRef.current = null
    if (isSupported) window.speechSynthesis.cancel()
    if (mountedRef.current) {
      setIsSpeaking(false)
      setIsPreparing(false)
      setNoVoiceAvailable(false)
    }
  }, [clearTimers, isSupported])

  const speak = useCallback(async (text, langCode) => {
    const content = text?.trim()
    if (!content || !isSupported) {
      if (!isSupported && mountedRef.current) setNoVoiceAvailable(true)
      return false
    }

    requestRef.current += 1
    const requestId = requestRef.current
    clearTimers()
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
    setIsPreparing(true)
    setNoVoiceAvailable(false)

    await new Promise((resolve) => setTimeout(resolve, 120))
    if (!mountedRef.current || requestRef.current !== requestId) return false

    const voices = voiceCache.length ? voiceCache : await loadVoices()
    if (!mountedRef.current || requestRef.current !== requestId) return false
    const { voice, lang } = findVoice(langCode, voices)

    const utterance = new SpeechSynthesisUtterance(content)
    utteranceRef.current = utterance
    utterance.lang = lang
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 1
    if (voice) utterance.voice = voice

    const isCurrentRequest = () => mountedRef.current && requestRef.current === requestId
    utterance.onstart = () => {
      if (!isCurrentRequest()) return
      clearTimeout(startTimeoutRef.current)
      startTimeoutRef.current = null
      setIsPreparing(false)
      setIsSpeaking(true)
    }
    utterance.onend = () => {
      if (!isCurrentRequest()) return
      clearTimers()
      utteranceRef.current = null
      setIsSpeaking(false)
      setIsPreparing(false)
    }
    utterance.onerror = (event) => {
      if (!isCurrentRequest() || event.error === 'interrupted' || event.error === 'canceled') return
      clearTimers()
      utteranceRef.current = null
      setIsSpeaking(false)
      setIsPreparing(false)
      setNoVoiceAvailable(true)
    }

    keepAliveRef.current = setInterval(() => {
      if (!isCurrentRequest()) return clearTimers()
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause()
        window.speechSynthesis.resume()
      }
    }, 10000)

    startTimeoutRef.current = setTimeout(() => {
      if (!isCurrentRequest() || window.speechSynthesis.speaking) return
      clearTimers()
      setIsPreparing(false)
      setIsSpeaking(false)
      setNoVoiceAvailable(true)
    }, 3500)

    window.speechSynthesis.speak(utterance)
    return true
  }, [clearTimers, isSupported])

  useEffect(() => {
    mountedRef.current = true
    if (isSupported) loadVoices()
    return () => {
      mountedRef.current = false
      requestRef.current += 1
      clearTimers()
      window.speechSynthesis?.cancel()
    }
  }, [clearTimers, isSupported])

  return { speak, stop, isSpeaking, isPreparing, noVoiceAvailable, isSupported }
}
