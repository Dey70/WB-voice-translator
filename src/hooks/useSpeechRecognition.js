import { useState, useRef, useCallback } from 'react'

// BCP-47 tags required by Apple WebKit (iOS Safari / WKWebView).
// Standard two-letter codes like 'bn' cause an immediate crash on iOS.
const LANG_CODES = {
  bn: 'bn-IN',
  ne: 'ne-NP',
  hi: 'hi-IN',
  en: 'en-US',
}

// Hindi needs a longer silence timeout because compound words and names
// can have micro-pauses that trigger early finalization.
const SILENCE_TIMEOUTS = {
  bn: 1500,
  ne: 1500,
  hi: 2500,
}

// iOS (Safari / WKWebView) requires continuous = false.
// Forcing continuous = true causes an immediate recognition error on iOS.
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)

export function useSpeechRecognition() {
  const [transcript, setTranscript] = useState('')
  const [interimText, setInterimText] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState(null)
  const recognitionRef = useRef(null)
  const accumulatedRef = useRef('')
  const silenceTimerRef = useRef(null)
  const currentLangRef = useRef('hi')
  const isRunningRef = useRef(false)

  const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window

  const startListening = useCallback((langCode) => {
    if (!isSupported) {
      setError('Please use Chrome or Safari for voice features.')
      return
    }

    currentLangRef.current = langCode
    accumulatedRef.current = ''
    isRunningRef.current = true

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    // iOS WebKit requires a proper BCP-47 tag or it crashes immediately.
    recognition.lang = LANG_CODES[langCode] || langCode + '-IN'

    // iOS crashes with continuous = true — disable it on iOS only.
    recognition.continuous = !isIOS

    recognition.interimResults = true
    recognition.maxAlternatives = 5

    recognition.onstart = () => {
      console.log('[KothaSetu] Recognition started:', recognition.lang, '| iOS:', isIOS)
      setIsListening(true)
      setError(null)
      setTranscript('')
      setInterimText('')
    }

    recognition.onresult = (event) => {
      // Clear any pending silence timer — user is still speaking.
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
        silenceTimerRef.current = null
      }

      // ── Rebuild transcript correctly ──────────────────────────────────────
      // Android Chrome fires onresult with overlapping interim/final chunks.
      // The old approach of appending deltas caused severe text duplication.
      //
      // Correct approach:
      //   • Walk ALL results from 0 to event.results.length.
      //   • Collect every *final* result into a "committed" string.
      //   • Collect every *interim* result into a separate preview string.
      //   • The committed string is the authoritative source of truth.
      // ─────────────────────────────────────────────────────────────────────
      let committed = ''
      let interim = ''

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i]

        if (result.isFinal) {
          // Pick the highest-confidence alternative.
          let bestText = result[0].transcript
          let bestConf = result[0].confidence || 0
          for (let j = 1; j < result.length; j++) {
            const conf = result[j].confidence || 0
            if (conf > bestConf) {
              bestText = result[j].transcript
              bestConf = conf
            }
          }
          committed += bestText
        } else {
          // Only the first (highest-ranked) alternative for interim.
          interim += result[0].transcript
        }
      }

      // Keep accumulatedRef in sync with every final chunk so stopListening
      // and the onend handler can read the definitive transcript.
      if (committed) {
        accumulatedRef.current = committed.trim()
        setTranscript(accumulatedRef.current)
        setInterimText('')
        console.log('[KothaSetu] Final committed:', JSON.stringify(accumulatedRef.current))

        // Set silence timer — auto-stop after N ms of no new input.
        const timeout = SILENCE_TIMEOUTS[langCode] || 1500
        silenceTimerRef.current = setTimeout(() => {
          console.log('[KothaSetu] Silence timeout — stopping. Full transcript:', accumulatedRef.current)
          if (recognitionRef.current && isRunningRef.current) {
            recognitionRef.current.stop()
          }
        }, timeout)
      }

      if (interim) {
        setInterimText(interim.trim())
      }
    }

    recognition.onerror = (event) => {
      console.error('[KothaSetu] Recognition error:', event.error)
      if (event.error === 'no-speech') {
        setError('No speech detected. Speak closer to the mic and try again.')
      } else if (event.error === 'not-allowed') {
        setError('Microphone blocked. Allow mic access in browser settings.')
      } else if (event.error === 'network') {
        setError('Network error. Check your internet connection.')
      } else if (event.error === 'aborted') {
        // Manual stop via stopListening() — not a real error.
        return
      } else {
        setError('Could not recognize speech. Please try again.')
      }
      isRunningRef.current = false
      setIsListening(false)
    }

    recognition.onend = () => {
      console.log('[KothaSetu] Recognition ended. Accumulated:', accumulatedRef.current)
      isRunningRef.current = false
      setIsListening(false)
      setInterimText('')
      if (accumulatedRef.current) {
        setTranscript(accumulatedRef.current)
      }
    }

    recognitionRef.current = recognition

    try {
      recognition.start()
    } catch (e) {
      console.error('[KothaSetu] Could not start recognition:', e)
      setError('Could not start mic. Please try again.')
      setIsListening(false)
      isRunningRef.current = false
    }
  }, [isSupported])

  const stopListening = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
    isRunningRef.current = false
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
  }, [])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setInterimText('')
    accumulatedRef.current = ''
  }, [])

  return {
    transcript,
    interimText,
    isListening,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    setTranscript,
  }
}
