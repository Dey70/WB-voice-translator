import { useState, useRef, useCallback, useEffect } from 'react'

const LANG_CODES = {
  bn: 'bn-IN',
  ne: 'ne-NP',
  hi: 'hi-IN',
  en: 'en-IN',
}

const getIsIOS = () => typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent)

const getSpeechRecognition = () => {
  if (typeof window === 'undefined') return null
  return window.SpeechRecognition || window.webkitSpeechRecognition || null
}

const getErrorMessage = (error) => {
  if (error === 'no-speech') return 'No speech detected. Move closer to the microphone and try again.'
  if (error === 'audio-capture') return 'No microphone was found. Check your device microphone.'
  if (error === 'not-allowed' || error === 'service-not-allowed') return 'Microphone access is blocked. Allow microphone access in your browser settings.'
  if (error === 'network') return 'Speech recognition needs a stable connection on this device.'
  if (error === 'language-not-supported') return 'This spoken language is not supported on your device.'
  return 'Speech could not be recognized. Please try again or type the message.'
}

export function useSpeechRecognition() {
  const [transcript, setTranscript] = useState('')
  const [interimText, setInterimText] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState(null)

  const recognitionRef = useRef(null)
  const startTimerRef = useRef(null)
  const sessionRef = useRef(0)
  const manualStopRef = useRef(false)
  const finalResultsRef = useRef(new Map())
  const interimRef = useRef('')
  const callbackRef = useRef(null)
  const lastDeliveredRef = useRef('')
  const recognitionErrorRef = useRef(false)
  const mountedRef = useRef(true)

  const SpeechRecognition = getSpeechRecognition()
  const isSupported = Boolean(SpeechRecognition)
  const isIOS = getIsIOS()

  const clearStartTimer = useCallback(() => {
    if (startTimerRef.current) {
      clearTimeout(startTimerRef.current)
      startTimerRef.current = null
    }
  }, [])

  const disposeRecognition = useCallback((method = 'abort') => {
    clearStartTimer()
    const recognition = recognitionRef.current
    recognitionRef.current = null
    if (!recognition) return

    recognition.onstart = null
    recognition.onresult = null
    recognition.onerror = null
    recognition.onend = null
    try { recognition[method]?.() } catch { /* Browser already stopped the session. */ }
  }, [clearStartTimer])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setInterimText('')
    finalResultsRef.current = new Map()
    interimRef.current = ''
  }, [])

  const stopListening = useCallback(() => {
    manualStopRef.current = true
    clearStartTimer()
    const recognition = recognitionRef.current
    if (recognition) {
      try { recognition.stop() } catch { disposeRecognition() }
    }
    if (mountedRef.current) setIsListening(false)
  }, [clearStartTimer, disposeRecognition])

  const startListening = useCallback((langCode, onResultCallback) => {
    if (!SpeechRecognition) {
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

    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition
    recognition.lang = LANG_CODES[langCode] || langCode
    recognition.continuous = false
    recognition.interimResults = !isIOS
    recognition.maxAlternatives = isIOS ? 1 : 3

    const isCurrentSession = () => mountedRef.current && sessionRef.current === sessionId
    const compileFinalText = () => [...finalResultsRef.current.entries()]
      .sort(([left], [right]) => left - right)
      .map(([, value]) => value)
      .join(' ')
      .trim()
    const deliverText = (text) => {
      if (!text || text === lastDeliveredRef.current) return
      lastDeliveredRef.current = text
      setTranscript(text)
      callbackRef.current?.(text)
    }

    recognition.onstart = () => {
      if (!isCurrentSession()) return
      setIsListening(true)
      setError(null)
    }

    recognition.onresult = (event) => {
      if (!isCurrentSession()) return
      const interimParts = []

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index]
        const bestAlternative = [...result].reduce((best, alternative) =>
          (alternative.confidence || 0) > (best.confidence || 0) ? alternative : best
        , result[0])
        const text = bestAlternative.transcript.trim()
        if (!text) continue

        if (result.isFinal) finalResultsRef.current.set(index, text)
        else interimParts.push(text)
      }

      const finalText = compileFinalText()
      const interim = interimParts.join(' ').trim()
      interimRef.current = interim
      setInterimText(interim)

      if (finalText) {
        deliverText(finalText)
      }
    }

    recognition.onerror = (event) => {
      if (!isCurrentSession() || event.error === 'aborted') return
      recognitionErrorRef.current = true
      setError(getErrorMessage(event.error))
      setIsListening(false)
    }

    recognition.onend = () => {
      if (!isCurrentSession()) return
      recognitionRef.current = null

      let finalText = compileFinalText()
      if (!finalText && interimRef.current && !manualStopRef.current) finalText = interimRef.current.trim()

      if (finalText) {
        deliverText(finalText)
      } else if (!manualStopRef.current && !recognitionErrorRef.current) {
        setError('No speech was captured. Tap the microphone and try again.')
      }

      interimRef.current = ''
      setInterimText('')
      setIsListening(false)
    }

    startTimerRef.current = setTimeout(() => {
      startTimerRef.current = null
      if (!isCurrentSession() || manualStopRef.current) return
      try {
        recognition.start()
      } catch {
        recognitionRef.current = null
        setError('The microphone is busy. Wait a moment and tap again.')
        setIsListening(false)
      }
    }, isIOS ? 180 : 0)

    return true
  }, [SpeechRecognition, disposeRecognition, isIOS, resetTranscript])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      sessionRef.current += 1
      disposeRecognition()
    }
  }, [disposeRecognition])

  return {
    transcript,
    interimText,
    isListening,
    error,
    isSupported,
    isIOS,
    startListening,
    stopListening,
    resetTranscript,
  }
}
