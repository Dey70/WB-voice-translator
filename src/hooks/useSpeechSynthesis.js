import { useState, useCallback, useEffect, useRef } from 'react'

// Language codes in priority order for speech synthesis
const LANG_SPEECH_CODES = {
  bn: ['bn-BD', 'bn-IN', 'bn'],
  ne: ['ne-NP', 'ne', 'hi-IN', 'hi'],
  hi: ['hi-IN', 'hi'],
}

let voiceCache = []
let voicesLoaded = false

function loadVoices() {
  return new Promise((resolve) => {
    if (voicesLoaded && voiceCache.length > 0) {
      resolve(voiceCache)
      return
    }
    const tryLoad = () => {
      const v = window.speechSynthesis.getVoices()
      if (v.length > 0) {
        voiceCache = v
        voicesLoaded = true
        console.log('[KothaSetu] Voices loaded:', v.length)
        v.forEach(voice => {
          if (['bn', 'hi', 'ne', 'en'].some(l => voice.lang.startsWith(l))) {
            console.log('[KothaSetu] Voice:', voice.lang, '-', voice.name, voice.localService ? '(local)' : '(remote)')
          }
        })
        resolve(v)
      }
    }
    tryLoad()
    window.speechSynthesis.onvoiceschanged = () => { tryLoad(); resolve(voiceCache) }
    setTimeout(() => resolve(voiceCache), 3000)
  })
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  loadVoices()
}

function findVoice(langCode, voices) {
  const codes = LANG_SPEECH_CODES[langCode] || [langCode]

  for (const code of codes) {
    const base = code.split('-')[0]

    // Exact match
    const exact = voices.find(v => v.lang.toLowerCase() === code.toLowerCase())
    if (exact) {
      console.log('[KothaSetu] Exact voice:', exact.name, exact.lang)
      return { voice: exact, lang: code, hasVoice: true }
    }

    // Starts-with match (e.g. bn-BD matches bn)
    const partial = voices.find(v => v.lang.toLowerCase().startsWith(base))
    if (partial) {
      console.log('[KothaSetu] Partial voice:', partial.name, partial.lang)
      return { voice: partial, lang: partial.lang, hasVoice: true }
    }
  }

  // No local voice found — return null voice but with correct lang code
  // Chrome will attempt to use a remote/cloud voice if available
  // This is the key fix for Bengali: DON'T assign voice=null explicitly,
  // just set the lang and let the browser try its cloud voice
  console.log('[KothaSetu] No local voice for', langCode, '— trying cloud fallback with lang:', codes[0])
  return { voice: null, lang: codes[0], hasVoice: false }
}

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [noVoiceAvailable, setNoVoiceAvailable] = useState(false)

  const speak = useCallback(async (text, langCode) => {
    if (!text || !text.trim()) return
    if (!window.speechSynthesis) return

    setNoVoiceAvailable(false)
    window.speechSynthesis.cancel()
    await new Promise(r => setTimeout(r, 150))

    const voices = await loadVoices()
    const { voice, lang, hasVoice } = findVoice(langCode, voices)

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.88
    utterance.pitch = 1.0
    utterance.volume = 1.0

    // Only assign voice if we found a real match
    // For Bengali: do NOT assign voice — let browser use cloud TTS
    if (voice) utterance.voice = voice

    utterance.onstart = () => {
      console.log('[KothaSetu] Speaking:', langCode, lang, hasVoice ? 'local' : 'cloud')
      setIsSpeaking(true)
      setNoVoiceAvailable(false)
    }

    utterance.onend = () => {
      setIsSpeaking(false)
    }

    utterance.onerror = (e) => {
      console.error('[KothaSetu] Speech error:', e.error, 'lang:', lang)
      setIsSpeaking(false)

      if (e.error === 'interrupted') return

      // If synthesis-failed, the browser has no voice at all for this language
      if (e.error === 'synthesis-failed' || e.error === 'language-unavailable') {
        setNoVoiceAvailable(true)
        return
      }

      // Retry once without specific voice (cloud fallback)
      setTimeout(() => {
        const u2 = new SpeechSynthesisUtterance(text)
        u2.lang = lang
        u2.rate = 0.88
        u2.onerror = () => setNoVoiceAvailable(true)
        window.speechSynthesis.speak(u2)
      }, 500)
    }

    // Chrome keep-alive for long text
    const keepAlive = setInterval(() => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause()
        window.speechSynthesis.resume()
      } else {
        clearInterval(keepAlive)
      }
    }, 10000)

    window.speechSynthesis.speak(utterance)

    // If nothing starts within 3 seconds, browser has no voice
    setTimeout(() => {
      if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
        console.log('[KothaSetu] No speech started — voice unavailable for', langCode)
        setIsSpeaking(false)
        setNoVoiceAvailable(true)
      }
    }, 3000)

  }, [])

  const stop = useCallback(() => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
    setNoVoiceAvailable(false)
  }, [])

  return { speak, stop, isSpeaking, noVoiceAvailable }
}
