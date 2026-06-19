import { useState, useRef, useCallback } from 'react'

const LANG_CODES = {
  bn: 'bn-IN',
  ne: 'ne-NP',
  hi: 'hi-IN',
}

const SILENCE_TIMEOUTS = {
  bn: 1500,
  ne: 1500,
  hi: 2500,
}

const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
const isAndroid = () => /Android/.test(navigator.userAgent)

export function useSpeechRecognition() {
  const [transcript, setTranscript] = useState('')
  const [interimText, setInterimText] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState(null)
  const recognitionRef = useRef(null)
  const accumulatedRef = useRef('')
  const interimRef = useRef('')
  const silenceTimerRef = useRef(null)
  const isRunningRef = useRef(false)
  const androidChunksRef = useRef([])
  const retryCountRef = useRef(0)

  const isSupported = typeof window !== 'undefined' &&
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)

  const doStart = useCallback((langCode, onResultCallback) => {
    const ios = isIOS()
    const android = isAndroid()

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.lang = LANG_CODES[langCode] || langCode
    recognition.continuous = false          // iOS requires false — crashes with true
    recognition.interimResults = !ios       // iOS WebKit crashes with interimResults=true on some versions
    recognition.maxAlternatives = ios ? 1 : 5

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
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
            const isSubset = androidChunksRef.current.some(existing =>
              existing.includes(chunk) || chunk.includes(existing)
            )
            if (!isSubset) {
              androidChunksRef.current.push(chunk)
              accumulatedRef.current = androidChunksRef.current.join(' ')
            } else {
              androidChunksRef.current = androidChunksRef.current.map(existing =>
                chunk.includes(existing) ? chunk : existing
              )
              accumulatedRef.current = androidChunksRef.current.join(' ')
            }
          } else {
            accumulatedRef.current = (accumulatedRef.current + ' ' + chunk).trim()
          }

          setTranscript(accumulatedRef.current)
          onResultCallback?.(accumulatedRef.current)
          setInterimText('')
          interimRef.current = ''
          retryCountRef.current = 0 // successful result — reset retry counter

          if (!ios) {
            // On desktop: set silence timer to auto-stop
            const timeout = SILENCE_TIMEOUTS[langCode] || 1500
            silenceTimerRef.current = setTimeout(() => {
              if (recognitionRef.current && isRunningRef.current) {
                recognitionRef.current.stop()
              }
            }, timeout)
          }

        } else {
          interim += result[0].transcript
        }
      }

      if (interim && !ios) {
        interimRef.current = interim
        setInterimText(interim)
      }
    }

    recognition.onerror = (event) => {
      console.log('[KothaSetu] Speech error:', event.error)

      if (event.error === 'aborted') return // manual stop

      // iOS often fires "not-allowed" or "service-not-allowed" the FIRST time
      // due to WebKit's permission timing — retry once silently
      if (ios && retryCountRef.current < 1 &&
          (event.error === 'not-allowed' || event.error === 'service-not-allowed' || event.error === 'network')) {
        retryCountRef.current++
        console.log('[KothaSetu] iOS error, retrying once...')
        setTimeout(() => {
          if (isRunningRef.current) {
            try { doStart(langCode, onResultCallback) } catch(e) {}
          }
        }, 500)
        return
      }

      if (event.error === 'no-speech') {
        setError('No speech detected. Please try again.')
      } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setError('Microphone access denied. Allow mic in your browser settings.')
      } else if (event.error === 'network') {
        setError('Network error. Check your connection.')
      } else if (event.error === 'language-not-supported') {
        setError('This language is not supported on your device.')
      } else {
        setError('Could not recognize speech. Please try again.')
      }

      isRunningRef.current = false
      setIsListening(false)
    }

    recognition.onend = () => {
      console.log('[KothaSetu] onend. accumulated:', accumulatedRef.current, 'interim:', interimRef.current)

      // Bug 6: Race condition — if final never fired but we have interim, use it
      if (!accumulatedRef.current && interimRef.current) {
        accumulatedRef.current = interimRef.current
        onResultCallback?.(accumulatedRef.current)
      }

      setInterimText('')
      interimRef.current = ''

      if (accumulatedRef.current) {
        setTranscript(accumulatedRef.current)
        isRunningRef.current = false
        setIsListening(false)
      } else if (ios && isRunningRef.current && retryCountRef.current < 1) {
        // iOS sometimes fires onend immediately with no result — retry once
        retryCountRef.current++
        console.log('[KothaSetu] iOS empty result, retrying once...')
        setTimeout(() => {
          if (isRunningRef.current) {
            try {
              const r2 = new (window.SpeechRecognition || window.webkitSpeechRecognition)()
              r2.lang = LANG_CODES[langCode] || langCode
              r2.continuous = false
              r2.interimResults = false
              r2.maxAlternatives = 1
              r2.onresult = recognition.onresult
              r2.onerror = recognition.onerror
              r2.onend = () => {
                isRunningRef.current = false
                setIsListening(false)
                if (accumulatedRef.current) setTranscript(accumulatedRef.current)
              }
              recognitionRef.current = r2
              r2.start()
            } catch(e) {
              isRunningRef.current = false
              setIsListening(false)
            }
          }
        }, 300)
      } else {
        isRunningRef.current = false
        setIsListening(false)
      }
    }

    recognitionRef.current = recognition

    // iOS needs a brief delay before start() after any previous session
    const delay = ios ? 150 : 0
    setTimeout(() => {
      try {
        recognition.start()
      } catch (e) {
        console.error('[KothaSetu] start() failed:', e)
        setError('Could not start mic. Please tap the button again.')
        setIsListening(false)
        isRunningRef.current = false
      }
    }, delay)

    return recognition
  }, [])

  const startListening = useCallback((langCode, onResultCallback) => {
    if (!isSupported) {
      setError('Voice not supported in this browser. Please use Chrome on desktop.')
      return
    }

    accumulatedRef.current = ''
    interimRef.current = ''
    androidChunksRef.current = []
    retryCountRef.current = 0
    isRunningRef.current = true

    setTranscript('')
    setInterimText('')
    setError(null)

    doStart(langCode, onResultCallback)
  }, [isSupported, doStart])

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
    retryCountRef.current = 0
  }, [])

  return {
    transcript,
    interimText,
    isListening,
    error,
    isSupported,
    isIOS: isIOS(),
    startListening,
    stopListening,
    resetTranscript,
    setTranscript,
  }
}
