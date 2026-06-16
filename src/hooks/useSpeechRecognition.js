import { useState, useRef, useCallback } from 'react'

const LANG_CODES = {
  bn: ['bn-BD', 'bn-IN'],
  ne: ['ne-NP'],
  hi: ['hi-IN'],
}

export function useSpeechRecognition() {
  const [transcript, setTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState(null)
  const [interimText, setInterimText] = useState('')
  const recognitionRef = useRef(null)
  const finalRef = useRef('')

  const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window

  const startListening = useCallback((langCode) => {
    if (!isSupported) {
      setError('Please use Chrome browser for voice features.')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    
    const codes = LANG_CODES[langCode] || [langCode]
    recognition.lang = codes[0]
    recognition.continuous = false
    recognition.interimResults = true
    recognition.maxAlternatives = 3

    finalRef.current = ''

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
      setTranscript('')
      setInterimText('')
    }

    recognition.onresult = (event) => {
      let interim = ''
      let final = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          // Pick the best alternative (highest confidence)
          let best = result[0].transcript
          let bestConf = result[0].confidence || 0
          for (let j = 1; j < result.length; j++) {
            if ((result[j].confidence || 0) > bestConf) {
              best = result[j].transcript
              bestConf = result[j].confidence
            }
          }
          final += best
        } else {
          interim += result[0].transcript
        }
      }

      if (interim) setInterimText(interim)
      if (final) {
        finalRef.current += final
        setTranscript(finalRef.current)
        setInterimText('')
      }
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      if (event.error === 'no-speech') {
        setError('No speech detected. Please try again.')
      } else if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone in browser settings.')
      } else if (event.error === 'network') {
        setError('Network error. Please check your connection.')
      } else {
        setError('Could not recognize speech. Please try again.')
      }
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
      setInterimText('')
      if (finalRef.current) {
        setTranscript(finalRef.current)
      }
    }

    recognitionRef.current = recognition
    try {
      recognition.start()
    } catch (e) {
      setError('Could not start microphone. Please try again.')
      setIsListening(false)
    }
  }, [isSupported])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
  }, [])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setInterimText('')
    finalRef.current = ''
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
