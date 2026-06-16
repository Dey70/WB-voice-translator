import { useState, useCallback } from 'react'
import { getLanguage } from '../utils/constants'

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false)

  const speak = useCallback((text, langCode) => {
    if (!text || !window.speechSynthesis) return

    window.speechSynthesis.cancel()

    const lang = getLanguage(langCode)
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang?.speechCode || langCode
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 1

    // Try to find a matching voice
    const voices = window.speechSynthesis.getVoices()
    const matchingVoice = voices.find((v) => v.lang.startsWith(langCode))
    if (matchingVoice) utterance.voice = matchingVoice

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }, [])

  const stop = useCallback(() => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [])

  return { speak, stop, isSpeaking }
}

