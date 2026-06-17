import { useState, useRef, useCallback } from 'react'

// Strict BCP-47 codes required by iOS WebKit
const LANG_CODES = {
  bn: 'bn-IN',   // bn-BD crashes on iOS; bn-IN is more universally supported
  ne: 'ne-NP',
  hi: 'hi-IN',
}

const SILENCE_TIMEOUTS = {
  bn: 1500,
  ne: 1500,
  hi: 2500,
}

// Detect iOS — iOS requires continuous=false or it crashes instantly
const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent)
// Detect Android — Android speech engine produces overlapping duplicate chunks
const isAndroid = () => /Android/.test(navigator.userAgent)

export function useSpeechRecognition() {
  const [transcript, setTranscript] = useState('')
  const [interimText, setInterimText] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState(null)
  const recognitionRef = useRef(null)
  const accumulatedRef = useRef('')
  const interimRef = useRef('')       // Bug 6: save interim to ref so onend can use it
  const silenceTimerRef = useRef(null)
  const isRunningRef = useRef(false)
  const androidChunksRef = useRef([]) // Bug 4: track all chunks for subset filtering

  // Bug 1: Check actual API support, not user-agent
  const isSupported = typeof window !== 'undefined' &&
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)

  const startListening = useCallback((langCode) => {
    if (!isSupported) {
      setError('Voice not supported in this browser. Please use Chrome on desktop.')
      return
    }

    const ios = isIOS()
    const android = isAndroid()

    accumulatedRef.current = ''
    interimRef.current = ''
    androidChunksRef.current = []
    isRunningRef.current = true

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    // Bug 3: iOS needs strict BCP-47 and continuous=false
    recognition.lang = LANG_CODES[langCode] || langCode
    recognition.continuous = ios ? false : true   // Bug 3: iOS crashes with continuous=true
    recognition.interimResults = true
    recognition.maxAlternatives = ios ? 1 : 5     // Bug 3: iOS is strict about alternatives too

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
      setTranscript('')
      setInterimText('')
      interimRef.current = ''
    }

    recognition.onresult = (event) => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
        silenceTimerRef.current = null
      }

      let interim = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]

        if (result.isFinal) {
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

          if (android) {
            // Bug 4: Android sends overlapping progressive chunks like:
            // "hello" → "hello world" → "hello world how"
            // We need to detect and skip chunks that are subsets of existing ones
            const isSubset = androidChunksRef.current.some(existing =>
              existing.includes(chunk) || chunk.includes(existing)
            )
            if (!isSubset) {
              androidChunksRef.current.push(chunk)
              // Bug 4: Force join with space to avoid mashing
              accumulatedRef.current = androidChunksRef.current.join(' ')
            } else {
              // Replace with the longer version
              androidChunksRef.current = androidChunksRef.current.map(existing =>
                chunk.includes(existing) ? chunk : existing
              )
              accumulatedRef.current = androidChunksRef.current.join(' ')
            }
          } else {
            accumulatedRef.current = (accumulatedRef.current + ' ' + chunk).trim()
          }

          setTranscript(accumulatedRef.current)
          setInterimText('')
          interimRef.current = ''

          const timeout = SILENCE_TIMEOUTS[langCode] || 1500
          silenceTimerRef.current = setTimeout(() => {
            if (recognitionRef.current && isRunningRef.current) {
              recognitionRef.current.stop()
            }
          }, timeout)

        } else {
          interim += result[0].transcript
        }
      }

      if (interim) {
        interimRef.current = interim  // Bug 6: save to ref
        setInterimText(interim)
      }
    }

    recognition.onerror = (event) => {
      if (event.error === 'aborted') return // manual stop, not an error

      if (event.error === 'no-speech') {
        setError('No speech detected. Please try again.')
      } else if (event.error === 'not-allowed') {
        setError('Microphone blocked. Allow mic access in browser settings.')
      } else if (event.error === 'network') {
        setError('Network error. Check your internet connection.')
      } else {
        setError('Could not recognize speech. Please try again.')
      }
      isRunningRef.current = false
      setIsListening(false)
    }

    recognition.onend = () => {
      isRunningRef.current = false
      setIsListening(false)

      // Bug 6: Race condition fix — if we have interim text but no final,
      // use the interim as the final result (happens when mic cuts off fast on mobile)
      if (!accumulatedRef.current && interimRef.current) {
        accumulatedRef.current = interimRef.current
      }

      setInterimText('')
      interimRef.current = ''

      if (accumulatedRef.current) {
        setTranscript(accumulatedRef.current)
      }
    }

    recognitionRef.current = recognition

    try {
      recognition.start()
    } catch (e) {
      console.error('[KothaSetu] Could not start:', e)
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
      try { recognitionRef.current.stop() } catch (e) {}
    }
    setIsListening(false)
  }, [])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setInterimText('')
    accumulatedRef.current = ''
    interimRef.current = ''
    androidChunksRef.current = []
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
