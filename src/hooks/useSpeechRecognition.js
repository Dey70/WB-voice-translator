import { useState, useRef, useCallback } from 'react'

const LANG_CODES = {
  bn: 'bn-BD',
  ne: 'ne-NP',
  hi: 'hi-IN',
}

// Hindi needs longer silence timeout because names/compound words
// can have micro-pauses that trigger early finalization
const SILENCE_TIMEOUTS = {
  bn: 1500,
  ne: 1500,
  hi: 2500,
}

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
      setError('Please use Chrome browser for voice features.')
      return
    }

    currentLangRef.current = langCode
    accumulatedRef.current = ''
    isRunningRef.current = true

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.lang = LANG_CODES[langCode] || langCode
    recognition.continuous = true
    recognition.interimResults = true
    recognition.maxAlternatives = 5

    recognition.onstart = () => {
      console.log('[KothaSetu] Recognition started:', LANG_CODES[langCode])
      setIsListening(true)
      setError(null)
      setTranscript('')
      setInterimText('')
    }

    recognition.onresult = (event) => {
      // Clear any pending silence timer — user is still speaking
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
        silenceTimerRef.current = null
      }

      let interim = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]

        if (result.isFinal) {
          // Pick highest confidence from all alternatives
          let bestText = result[0].transcript
          let bestConf = result[0].confidence || 0
          for (let j = 1; j < result.length; j++) {
            const conf = result[j].confidence || 0
            if (conf > bestConf) {
              bestText = result[j].transcript
              bestConf = conf
            }
          }

          const word = bestText.trim()
          console.log('[KothaSetu] Final chunk:', JSON.stringify(word), 'conf:', bestConf.toFixed(2))

          // Append to accumulated — this handles "Subham" + "ika" as two chunks
          accumulatedRef.current = (accumulatedRef.current + ' ' + word).trim()
          setTranscript(accumulatedRef.current)
          setInterimText('')

          // Set silence timer — stop after N ms of no new input
          const timeout = SILENCE_TIMEOUTS[langCode] || 1500
          silenceTimerRef.current = setTimeout(() => {
            console.log('[KothaSetu] Silence timeout — stopping. Full transcript:', accumulatedRef.current)
            if (recognitionRef.current && isRunningRef.current) {
              recognitionRef.current.stop()
            }
          }, timeout)

        } else {
          interim += result[0].transcript
        }
      }

      if (interim) {
        setInterimText(interim)
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
        // Manual stop — not an error
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
