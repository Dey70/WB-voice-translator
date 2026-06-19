import { useState, useRef, useCallback, useEffect } from 'react'
import { Capacitor } from '@capacitor/core'
import { SpeechRecognition } from '@capacitor-community/speech-recognition'
import { platformServices } from '../services/platform/platformAdapter'

const LANG_CODES = {
  bn: 'bn-IN',
  ne: 'ne-NP',
  hi: 'hi-IN',
  en: 'en-IN',
}

const isNative = () => Capacitor.isNativePlatform()

const getErrorMessage = (error) => {
  if (error === 'no-speech')                        return 'No speech detected. Move closer to the microphone and try again.'
  if (error === 'audio-capture')                    return 'No microphone was found. Check your device microphone.'
  if (error === 'not-allowed' ||
      error === 'service-not-allowed' ||
      error === 'denied')                           return 'Microphone access is blocked. Go to Settings → App Permissions → KothaSetu → Microphone and allow access.'
  if (error === 'network')                          return 'Speech recognition needs a stable connection on this device.'
  if (error === 'language-not-supported')           return 'This spoken language is not supported on your device.'
  return 'Speech could not be recognized. Please try again or type the message.'
}

// ─── Native (Capacitor) implementation ────────────────────────────────────────

function useNativeSpeechRecognition() {
  const [interimText,  setInterimText]  = useState('')
  const [isListening,  setIsListening]  = useState(false)
  const [error,        setError]        = useState(null)

  const listenerRef   = useRef(null)
  const mountedRef    = useRef(true)
  const sessionRef    = useRef(0)
  const callbackRef   = useRef(null)

  const removeListener = useCallback(() => {
    listenerRef.current?.remove()
    listenerRef.current = null
  }, [])

  const resetTranscript = useCallback(() => setInterimText(''), [])

  const stopListening = useCallback(async () => {
    sessionRef.current += 1
    removeListener()
    await SpeechRecognition.stop().catch(() => {})
    if (mountedRef.current) {
      setIsListening(false)
      setInterimText('')
    }
  }, [removeListener])

  const startListening = useCallback(async (langCode, onResultCallback) => {
    if (!mountedRef.current) return false

    // Ensure we have permission
    const { speechRecognition: perm } = await SpeechRecognition.requestPermissions().catch(() => ({ speechRecognition: 'denied' }))
    if (perm !== 'granted') {
      setError('Microphone access is blocked. Go to Settings → App Permissions → KothaSetu → Microphone and allow access.')
      return false
    }

    sessionRef.current += 1
    const sessionId = sessionRef.current
    callbackRef.current = onResultCallback || null
    const isCurrentSession = () => mountedRef.current && sessionRef.current === sessionId

    removeListener()
    setError(null)
    setInterimText('')

    // Subscribe to partial results before starting
    listenerRef.current = await SpeechRecognition.addListener('partialResults', ({ matches }) => {
      if (!isCurrentSession()) return
      const text = matches?.[0] ?? ''
      setInterimText(text)
    })

    try {
      await SpeechRecognition.start({
        language:       LANG_CODES[langCode] ?? langCode,
        maxResults:     3,
        partialResults: true,
        popup:          false,
      })
    } catch (err) {
      if (isCurrentSession()) {
        setError(getErrorMessage(err?.message ?? ''))
        setIsListening(false)
      }
      return false
    }

    if (!isCurrentSession()) return false
    setIsListening(true)

    // Poll listening state — the plugin fires a 'listeningState' event but we
    // also need to catch the case where Android stops recognition silently.
    const stateHandle = await SpeechRecognition.addListener('listeningState', ({ status, matches }) => {
      if (!isCurrentSession()) return
      if (status === 'stopped') {
        stateHandle.remove()
        removeListener()
        const final = matches?.[0] ?? interimText
        if (final && callbackRef.current) callbackRef.current(final)
        if (mountedRef.current) {
          setInterimText('')
          setIsListening(false)
        }
      }
    })

    return true
  }, [interimText, removeListener])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      sessionRef.current += 1
      removeListener()
      SpeechRecognition.stop().catch(() => {})
    }
  }, [removeListener])

  useEffect(() => platformServices.lifecycle.subscribe(({ active }) => {
    if (!active) stopListening()
  }), [stopListening])

  return {
    transcript:    interimText,
    interimText,
    isListening,
    error,
    isSupported:   true,
    isIOS:         Capacitor.getPlatform() === 'ios',
    startListening,
    stopListening,
    resetTranscript,
  }
}

// ─── Web (browser) implementation ─────────────────────────────────────────────

const getIsIOS = () => /iPad|iPhone|iPod/.test(platformServices.runtime.getUserAgent())

function useWebSpeechRecognition() {
  const [transcript,  setTranscript]  = useState('')
  const [interimText, setInterimText] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [error,       setError]       = useState(null)

  const recognitionRef      = useRef(null)
  const startTimerRef       = useRef(null)
  const sessionRef          = useRef(0)
  const manualStopRef       = useRef(false)
  const finalResultsRef     = useRef(new Map())
  const interimRef          = useRef('')
  const callbackRef         = useRef(null)
  const lastDeliveredRef    = useRef('')
  const recognitionErrorRef = useRef(false)
  const mountedRef          = useRef(true)

  const WebSpeechRecognition = platformServices.speechRecognition.getConstructor()
  const isSupported          = Boolean(WebSpeechRecognition)
  const isIOS                = getIsIOS()

  const clearStartTimer = useCallback(() => {
    if (startTimerRef.current) { clearTimeout(startTimerRef.current); startTimerRef.current = null }
  }, [])

  const disposeRecognition = useCallback((method = 'abort') => {
    clearStartTimer()
    const r = recognitionRef.current
    recognitionRef.current = null
    if (!r) return
    r.onstart = null; r.onresult = null; r.onerror = null; r.onend = null
    try { r[method]?.() } catch { /* already stopped */ }
  }, [clearStartTimer])

  const resetTranscript = useCallback(() => {
    setTranscript(''); setInterimText('')
    finalResultsRef.current = new Map(); interimRef.current = ''
  }, [])

  const stopListening = useCallback(() => {
    manualStopRef.current = true
    clearStartTimer()
    const r = recognitionRef.current
    if (r) { try { r.stop() } catch { disposeRecognition() } }
    if (mountedRef.current) setIsListening(false)
  }, [clearStartTimer, disposeRecognition])

  const startListening = useCallback((langCode, onResultCallback) => {
    if (!WebSpeechRecognition) {
      setError('Voice input is unavailable here. Use Chrome on Android or type the message.')
      return false
    }

    sessionRef.current += 1
    const sessionId = sessionRef.current
    manualStopRef.current = false
    callbackRef.current = onResultCallback || null
    lastDeliveredRef.current = ''
    recognitionErrorRef.current = false
    disposeRecognition()
    resetTranscript()
    setError(null)

    const r = new WebSpeechRecognition()
    recognitionRef.current = r
    r.lang            = LANG_CODES[langCode] || langCode
    r.continuous      = false
    r.interimResults  = !isIOS
    r.maxAlternatives = isIOS ? 1 : 3

    const isCurrent      = () => mountedRef.current && sessionRef.current === sessionId
    const compileFinal   = () =>
      [...finalResultsRef.current.entries()].sort(([a], [b]) => a - b).map(([, v]) => v).join(' ').trim()
    const deliverText    = (text) => {
      if (!text || text === lastDeliveredRef.current) return
      lastDeliveredRef.current = text
      setTranscript(text)
      callbackRef.current?.(text)
    }

    r.onstart  = () => { if (!isCurrent()) return; setIsListening(true); setError(null) }
    r.onresult = (event) => {
      if (!isCurrent()) return
      const parts = []
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res  = event.results[i]
        const best = [...res].reduce((b, a) => (a.confidence || 0) > (b.confidence || 0) ? a : b, res[0])
        const text = best.transcript.trim()
        if (!text) continue
        if (res.isFinal) finalResultsRef.current.set(i, text)
        else             parts.push(text)
      }
      const finalText = compileFinal()
      const interim   = parts.join(' ').trim()
      interimRef.current = interim
      setInterimText(interim)
      if (finalText) deliverText(finalText)
    }
    r.onerror  = (event) => {
      if (!isCurrent() || event.error === 'aborted') return
      recognitionErrorRef.current = true
      setError(getErrorMessage(event.error))
      setIsListening(false)
    }
    r.onend    = () => {
      if (!isCurrent()) return
      recognitionRef.current = null
      let finalText = compileFinal()
      if (!finalText && interimRef.current && !manualStopRef.current) finalText = interimRef.current.trim()
      if (finalText) deliverText(finalText)
      else if (!manualStopRef.current && !recognitionErrorRef.current)
        setError('No speech was captured. Tap the microphone and try again.')
      interimRef.current = ''
      setInterimText('')
      setIsListening(false)
    }

    startTimerRef.current = setTimeout(() => {
      startTimerRef.current = null
      if (!isCurrent() || manualStopRef.current) return
      try { r.start() } catch {
        recognitionRef.current = null
        setError('The microphone is busy. Wait a moment and tap again.')
        setIsListening(false)
      }
    }, isIOS ? 180 : 0)

    return true
  }, [WebSpeechRecognition, disposeRecognition, isIOS, resetTranscript])

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false; sessionRef.current += 1; disposeRecognition() }
  }, [disposeRecognition])

  useEffect(() => platformServices.lifecycle.subscribe(({ active }) => {
    if (!active) stopListening()
  }), [stopListening])

  return { transcript, interimText, isListening, error, isSupported, isIOS, startListening, stopListening, resetTranscript }
}

// ─── Public hook — picks implementation at runtime ────────────────────────────

export function useSpeechRecognition() {
  const native = useNativeSpeechRecognition()
  const web    = useWebSpeechRecognition()
  return isNative() ? native : web
}
