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
  // Android deduplication: track the last final string we accepted so we
  // can drop exact re-emissions before they reach state.
  const lastFinalTextRef = useRef('')

  const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window

  const startListening = useCallback((langCode) => {
    if (!isSupported) {
      setError('Please use Chrome or Safari for voice features.')
      return
    }

    currentLangRef.current = langCode
    accumulatedRef.current = ''
    lastFinalTextRef.current = ''
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

      // ── Android-safe onresult strategy ───────────────────────────────────
      // Android Chrome grows event.results cumulatively across firings.
      // Walking from index 0 every time re-processes old finals and inflates
      // the string. Walking only from event.resultIndex gives us the truly
      // *new* chunks delivered in this specific callback.
      //
      // Spacing: results[i].transcript has no trailing space, so we join
      // with an explicit ' ' to prevent characters from mashing together.
      //
      // Deduplication: Android sometimes re-emits the exact same final
      // string in back-to-back events. We track the last accepted string
      // in lastFinalTextRef and silently drop identical re-emissions.
      // ─────────────────────────────────────────────────────────────────────
      let interim = ''
      let gotNewFinal = false

      for (let i = event.resultIndex; i < event.results.length; i++) {
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

          const chunk = bestText.trim()
          if (!chunk) continue

          // ── Deduplication gate ──────────────────────────────────────────
          // Drop the chunk if it is identical to the last one we accepted,
          // or if the running transcript already ends with it (Android
          // sometimes re-fires the same segment as a new "final" result).
          const isDuplicate =
            chunk === lastFinalTextRef.current ||
            accumulatedRef.current.endsWith(chunk)

          if (isDuplicate) {
            console.log('[KothaSetu] Duplicate final dropped:', JSON.stringify(chunk))
            continue
          }

          lastFinalTextRef.current = chunk

          // Join with an explicit space so words never mash together.
          accumulatedRef.current = accumulatedRef.current
            ? accumulatedRef.current + ' ' + chunk
            : chunk

          gotNewFinal = true
          console.log('[KothaSetu] Final accepted:', JSON.stringify(chunk), '→', JSON.stringify(accumulatedRef.current))
        } else {
          // Only the first (highest-ranked) alternative for the live preview.
          interim += result[0].transcript
        }
      }

      if (gotNewFinal) {
        setTranscript(accumulatedRef.current)
        setInterimText('')

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
