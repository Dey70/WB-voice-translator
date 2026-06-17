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

// Both iOS and Android struggle with continuous = true:
// iOS crashes outright; Android emits progressive refinements of the same
// phrase as multiple isFinal results, which snowballs into duplication.
const isMobile = /iPad|iPhone|iPod|Android/i.test(navigator.userAgent)

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
  // lastFinalRef mirrors the final transcript so onend can read it
  // without touching React state synchronously.
  const lastFinalRef = useRef('')

  const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window

  const startListening = useCallback((langCode) => {
    if (!isSupported) {
      setError('Please use Chrome or Safari for voice features.')
      return
    }

    currentLangRef.current = langCode
    accumulatedRef.current = ''
    lastFinalRef.current = ''
    isRunningRef.current = true

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    // iOS WebKit requires a proper BCP-47 tag or it crashes immediately.
    recognition.lang = LANG_CODES[langCode] || langCode + '-IN'

    // Mobile browsers (iOS + Android) mis-behave with continuous = true:
    // iOS crashes, Android snowballs progressive refinements as duplicate finals.
    recognition.continuous = !isMobile

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

      // ── Android deduplication strategy ────────────────────────────────────
      // Android Chrome (especially with continuous=true, but sometimes even
      // without it) stores multiple isFinal results in event.results that are
      // progressive refinements of the same utterance, e.g.:
      //   [0] "Amar"            isFinal
      //   [1] "Amar naam"       isFinal
      //   [2] "Amar naam Rajdeep" isFinal
      //
      // Naively concatenating all three produces "AmarAmar naamAmar naam Rajdeep".
      //
      // Fix: collect all final strings, then drop any string that is fully
      // contained inside a longer sibling. Only the survivors are joined
      // (with explicit spaces) to form the clean transcript.
      // ─────────────────────────────────────────────────────────────────────
      const finals = []
      let interimTranscript = ''

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i]
        const text = result[0].transcript.trim()
        if (!text) continue

        if (result.isFinal) {
          finals.push(text)
        } else {
          interimTranscript += result[0].transcript
        }
      }

      // Remove any final that is a substring of any other (longer) final.
      // This eliminates the progressive-refinement snowball without touching
      // genuinely distinct phrases the user spoke one after another.
      const deduped = finals.filter((candidate, i) =>
        !finals.some((other, j) => j !== i && other.length > candidate.length && other.includes(candidate))
      )

      const finalTranscript = deduped.join(' ').trim()
      interimTranscript = interimTranscript.trim()

      console.log(
        '[KothaSetu] onresult — raw finals:', JSON.stringify(finals),
        '| deduped:', JSON.stringify(deduped),
        '| interim:', JSON.stringify(interimTranscript)
      )

      if (finalTranscript) {
        lastFinalRef.current = finalTranscript
        accumulatedRef.current = finalTranscript

        setTranscript(finalTranscript)
        setInterimText('')

        // Restart the silence timer each time new finals arrive.
        const timeout = SILENCE_TIMEOUTS[langCode] || 1500
        silenceTimerRef.current = setTimeout(() => {
          console.log('[KothaSetu] Silence timeout — stopping. Transcript:', lastFinalRef.current)
          if (recognitionRef.current && isRunningRef.current) {
            recognitionRef.current.stop()
          }
        }, timeout)
      } else if (interimTranscript) {
        setInterimText(interimTranscript)
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
      console.log('[KothaSetu] Recognition ended. Final transcript:', lastFinalRef.current)
      isRunningRef.current = false
      setIsListening(false)
      setInterimText('')
      // Ensure state reflects the last known final even if onresult fired
      // just before onend (race condition on some browsers).
      if (lastFinalRef.current) {
        setTranscript(lastFinalRef.current)
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
