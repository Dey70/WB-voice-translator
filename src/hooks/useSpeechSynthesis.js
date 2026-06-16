import { useState, useCallback, useEffect, useRef } from 'react'

// Wait for voices to load - browsers load them async
function getVoices() {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices()
    if (voices.length > 0) {
      resolve(voices)
      return
    }
    window.speechSynthesis.onvoiceschanged = () => {
      resolve(window.speechSynthesis.getVoices())
    }
    // Fallback after 2 seconds
    setTimeout(() => resolve(window.speechSynthesis.getVoices()), 2000)
  })
}

// Language code fallbacks - try multiple codes to find a working voice
const LANG_FALLBACKS = {
  bn: ['bn-BD', 'bn-IN', 'bn'],
  ne: ['ne-NP', 'ne', 'hi-IN', 'hi'],  // Nepali often falls back to Hindi voice
  hi: ['hi-IN', 'hi'],
}

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [availableVoices, setAvailableVoices] = useState([])

  // Load voices on mount
  useEffect(() => {
    getVoices().then((voices) => {
      setAvailableVoices(voices)
      console.log('Available voices:', voices.map(v => v.lang + ' - ' + v.name))
    })
  }, [])

  const findBestVoice = useCallback((langCode, voices) => {
    const fallbacks = LANG_FALLBACKS[langCode] || [langCode]
    
    for (const code of fallbacks) {
      // Try exact match first
      const exact = voices.find((v) => v.lang === code)
      if (exact) return { voice: exact, lang: code }
      
      // Try starts-with match
      const partial = voices.find((v) => v.lang.startsWith(code.split('-')[0]))
      if (partial) return { voice: partial, lang: partial.lang }
    }
    
    return { voice: null, lang: fallbacks[0] }
  }, [])

  const speak = useCallback(async (text, langCode) => {
    if (!text || !window.speechSynthesis) return

    window.speechSynthesis.cancel()

    // Make sure voices are loaded
    const voices = availableVoices.length > 0 
      ? availableVoices 
      : await getVoices()

    const { voice, lang } = findBestVoice(langCode, voices)
    
    console.log('Speaking in', langCode, '-> using voice:', voice ? voice.name : 'default', 'lang:', lang)

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.85
    utterance.pitch = 1
    utterance.volume = 1

    if (voice) utterance.voice = voice

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = (e) => {
      console.error('Speech error:', e.error)
      setIsSpeaking(false)
    }

    // Small delay helps some browsers
    setTimeout(() => {
      window.speechSynthesis.speak(utterance)
    }, 100)
  }, [availableVoices, findBestVoice])

  const stop = useCallback(() => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [])

  return { speak, stop, isSpeaking }
}
