import { useState, useCallback, useEffect, useRef } from 'react'
import { Capacitor } from '@capacitor/core'
import { TextToSpeech } from '@capacitor-community/text-to-speech'
import { platformServices } from '../services/platform/platformAdapter'

const LANG_SPEECH_CODES = {
  bn: ['bn-IN', 'bn-BD', 'bn'],
  ne: ['ne-NP', 'ne', 'hi-IN'],
  hi: ['hi-IN', 'hi'],
  en: ['en-IN', 'en-GB', 'en-US', 'en'],
}

const isNative = () => Capacitor.isNativePlatform()

// ─── Native (Capacitor TextToSpeech) ─────────────────────────────────────────

function useNativeSpeechSynthesis() {
  const [isSpeaking,      setIsSpeaking]      = useState(false)
  const [isPreparing,     setIsPreparing]      = useState(false)
  const [noVoiceAvailable, setNoVoiceAvailable] = useState(false)

  const requestRef  = useRef(0)
  const mountedRef  = useRef(true)

  const stop = useCallback(async () => {
    requestRef.current += 1
    await TextToSpeech.stop().catch(() => {})
    if (mountedRef.current) {
      setIsSpeaking(false)
      setIsPreparing(false)
      setNoVoiceAvailable(false)
    }
  }, [])

  const speak = useCallback(async (text, langCode) => {
    const content = text?.trim()
    if (!content) return false

    requestRef.current += 1
    const requestId = requestRef.current

    await TextToSpeech.stop().catch(() => {})
    if (!mountedRef.current || requestRef.current !== requestId) return false

    setIsPreparing(true)
    setIsSpeaking(false)
    setNoVoiceAvailable(false)

    const lang = LANG_SPEECH_CODES[langCode]?.[0] ?? langCode

    try {
      // speak() resolves when the utterance finishes
      setIsPreparing(false)
      setIsSpeaking(true)
      try {
        await TextToSpeech.speak({ text: content, lang, rate: 0.9, pitch: 1.0, volume: 1.0, category: 'ambient' })
      } catch {
        // Language engine may not be installed — retry with device default voice
        await TextToSpeech.speak({ text: content, rate: 0.9, pitch: 1.0, volume: 1.0, category: 'ambient' }).catch(() => {})
      }
    } catch {
      // outer catch for interrupted/cancelled
    } finally {
      if (mountedRef.current && requestRef.current === requestId) {
        setIsSpeaking(false)
        setIsPreparing(false)
      }
    }

    return true
  }, [])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      requestRef.current += 1
      TextToSpeech.stop().catch(() => {})
    }
  }, [])

  useEffect(() => platformServices.lifecycle.subscribe(({ active }) => {
    if (!active) stop()
  }), [stop])

  return { speak, stop, isSpeaking, isPreparing, noVoiceAvailable, isSupported: true }
}

// ─── Web (browser SpeechSynthesis) ───────────────────────────────────────────

let voiceCache = []
let voiceLoadPromise = null

function loadVoices() {
  const engine = platformServices.speechSynthesis.getEngine()
  if (!engine) return Promise.resolve([])

  const available = engine.getVoices()
  // Browsers can expose voices in stages. Always prefer the latest complete
  // snapshot instead of permanently keeping the first (often partial) list.
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
      engine.removeEventListener?.('voiceschanged', onChanged)
      voiceCache = engine.getVoices()
      resolve(voiceCache)
      voiceLoadPromise = null
    }
    const onChanged = () => { if (engine.getVoices().length) finish() }
    engine.addEventListener?.('voiceschanged', onChanged, { once: true })
    setTimeout(finish, 1800)
  })

  return voiceLoadPromise
}

function findVoice(langCode, voices) {
  const codes = LANG_SPEECH_CODES[langCode] || [langCode]
  for (const code of codes) {
    const exact = voices.find((v) => v.lang.toLowerCase() === code.toLowerCase())
    if (exact) return { voice: exact, lang: exact.lang }
  }
  const base    = codes[0].split('-')[0].toLowerCase()
  const partial = voices.find((v) => v.lang.toLowerCase().split('-')[0] === base)
  if (partial) return { voice: partial, lang: partial.lang }
  // Do not force an unrelated voice. Leaving `voice` unset while preserving
  // the requested language lets the browser/OS choose its own suitable voice.
  return { voice: null, lang: codes[0] }
}

function useWebSpeechSynthesis() {
  const [isSpeaking,       setIsSpeaking]       = useState(false)
  const [isPreparing,      setIsPreparing]       = useState(false)
  const [noVoiceAvailable, setNoVoiceAvailable]  = useState(false)

  const requestRef     = useRef(0)
  const utteranceRef   = useRef(null)
  const startToRef     = useRef(null)
  const keepAliveRef   = useRef(null)
  const mountedRef     = useRef(true)

  const isSupported = Boolean(
    platformServices.speechSynthesis.getEngine() &&
    platformServices.speechSynthesis.createUtterance('')
  )

  const clearTimers = useCallback(() => {
    if (startToRef.current)   clearTimeout(startToRef.current)
    if (keepAliveRef.current) clearInterval(keepAliveRef.current)
    startToRef.current = keepAliveRef.current = null
  }, [])

  const stop = useCallback(() => {
    requestRef.current += 1
    clearTimers()
    utteranceRef.current = null
    if (isSupported) platformServices.speechSynthesis.getEngine()?.cancel()
    if (mountedRef.current) { setIsSpeaking(false); setIsPreparing(false); setNoVoiceAvailable(false) }
  }, [clearTimers, isSupported])

  const speak = useCallback((text, langCode) => {
    const content = text?.trim()
    if (!content || !isSupported) {
      if (!isSupported && mountedRef.current) setNoVoiceAvailable(true)
      return false
    }

    requestRef.current += 1
    const requestId = requestRef.current
    clearTimers()
    const engine = platformServices.speechSynthesis.getEngine()
    engine.cancel()
    setIsSpeaking(false); setIsPreparing(true); setNoVoiceAvailable(false)

    // Keep speak() inside the original tap event. Mobile Safari can reject
    // speech started after an async delay because user activation has expired.
    // getVoices() is synchronous; if it is temporarily empty, preserve the
    // requested language and let the browser choose its native voice.
    const available = engine.getVoices()
    if (available.length) voiceCache = available
    const voices = available.length ? available : voiceCache
    const { voice, lang }   = findVoice(langCode, voices)

    const utterance = platformServices.speechSynthesis.createUtterance(content)
    if (!utterance) { setIsPreparing(false); setNoVoiceAvailable(true); return false }

    utteranceRef.current = utterance
    utterance.lang    = lang
    utterance.rate    = 0.9
    utterance.pitch   = 1
    utterance.volume  = 1
    if (voice) utterance.voice = voice

    const isCurrent = () => mountedRef.current && requestRef.current === requestId
    utterance.onstart = () => {
      if (!isCurrent()) return
      clearTimeout(startToRef.current); startToRef.current = null
      setIsPreparing(false); setIsSpeaking(true)
    }
    utterance.onend = () => {
      if (!isCurrent()) return
      clearTimers(); utteranceRef.current = null
      setIsSpeaking(false); setIsPreparing(false)
    }
    utterance.onerror = (e) => {
      if (!isCurrent() || e.error === 'interrupted' || e.error === 'canceled') return
      clearTimers(); utteranceRef.current = null
      setIsSpeaking(false); setIsPreparing(false); setNoVoiceAvailable(true)
    }

    // Keep-alive for Android Chrome bug where synthesis pauses silently
    keepAliveRef.current = setInterval(() => {
      if (!isCurrent()) return clearTimers()
      if (engine.speaking && !engine.paused) { engine.pause(); engine.resume() }
    }, 10000)

    startToRef.current = setTimeout(() => {
      if (!isCurrent() || engine.speaking) return
      clearTimers(); setIsPreparing(false); setIsSpeaking(false); setNoVoiceAvailable(true)
    }, 3500)

    engine.speak(utterance)
    return true
  }, [clearTimers, isSupported])

  useEffect(() => {
    mountedRef.current = true
    if (isSupported) loadVoices()
    return () => {
      mountedRef.current = false; requestRef.current += 1; clearTimers()
      platformServices.speechSynthesis.getEngine()?.cancel()
    }
  }, [clearTimers, isSupported])

  useEffect(() => platformServices.lifecycle.subscribe(({ active }) => {
    if (!active) stop()
  }), [stop])

  return { speak, stop, isSpeaking, isPreparing, noVoiceAvailable, isSupported }
}

// ─── Public hook ──────────────────────────────────────────────────────────────

export function useSpeechSynthesis() {
  const native = useNativeSpeechSynthesis()
  const web    = useWebSpeechSynthesis()
  return isNative() ? native : web
}
