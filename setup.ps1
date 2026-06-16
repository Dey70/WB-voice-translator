# KothaSetu - Full Setup Script
# Run this from inside C:\Users\akima\WB-voice-translator

Write-Host "Creating folders..." -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path "src" | Out-Null
New-Item -ItemType Directory -Force -Path "src\components\layout" | Out-Null
New-Item -ItemType Directory -Force -Path "src\components\translation" | Out-Null
New-Item -ItemType Directory -Force -Path "src\hooks" | Out-Null
New-Item -ItemType Directory -Force -Path "src\pages" | Out-Null
New-Item -ItemType Directory -Force -Path "src\services" | Out-Null
New-Item -ItemType Directory -Force -Path "src\store" | Out-Null
New-Item -ItemType Directory -Force -Path "src\utils" | Out-Null

Write-Host "Writing files..." -ForegroundColor Cyan

Write-Host "  Writing vite.config.js" -ForegroundColor Gray
@'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})

'@ | Set-Content -Path 'vite.config.js' -Encoding UTF8

Write-Host "  Writing vercel.json" -ForegroundColor Gray
@'
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}

'@ | Set-Content -Path 'vercel.json' -Encoding UTF8

Write-Host "  Writing src/index.css" -ForegroundColor Gray
@'
@import "tailwindcss";

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+Bengali:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap');

:root {
  --bg-primary: #0a0a0f;
  --bg-secondary: #12121a;
  --bg-card: #1a1a26;
  --bg-card-hover: #1f1f2e;
  --accent-primary: #6c63ff;
  --accent-secondary: #a78bfa;
  --accent-teal: #2dd4bf;
  --accent-coral: #f87171;
  --text-primary: #f1f0ff;
  --text-secondary: #a09cb8;
  --text-muted: #5a5670;
  --border: #2a2840;
  --border-light: #3a3758;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: 'Inter', 'Noto Sans Bengali', 'Noto Sans Devanagari', sans-serif;
  min-height: 100vh;
  overflow-x: hidden;
}

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg-primary); }
::-webkit-scrollbar-thumb { background: var(--border-light); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--accent-primary); }

/* Glass card */
.glass {
  background: rgba(26, 26, 38, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border);
}

/* Glow effects */
.glow-purple {
  box-shadow: 0 0 30px rgba(108, 99, 255, 0.2);
}

.glow-teal {
  box-shadow: 0 0 30px rgba(45, 212, 191, 0.2);
}

/* Pulse animation for recording */
@keyframes pulse-ring {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(108, 99, 255, 0.5); }
  70% { transform: scale(1); box-shadow: 0 0 0 20px rgba(108, 99, 255, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(108, 99, 255, 0); }
}

.pulse-record {
  animation: pulse-ring 1.5s ease-in-out infinite;
}

/* Waveform animation */
@keyframes wave {
  0%, 100% { height: 4px; }
  50% { height: 100%; }
}

.wave-bar {
  animation: wave 1s ease-in-out infinite;
}

.wave-bar:nth-child(2) { animation-delay: 0.1s; }
.wave-bar:nth-child(3) { animation-delay: 0.2s; }
.wave-bar:nth-child(4) { animation-delay: 0.3s; }
.wave-bar:nth-child(5) { animation-delay: 0.4s; }
.wave-bar:nth-child(6) { animation-delay: 0.3s; }
.wave-bar:nth-child(7) { animation-delay: 0.2s; }
.wave-bar:nth-child(8) { animation-delay: 0.1s; }

/* Gradient text */
.gradient-text {
  background: linear-gradient(135deg, #6c63ff, #2dd4bf);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}

/* Slide in from bottom */
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.slide-up {
  animation: slideUp 0.4s ease-out;
}

/* Active mic button */
.mic-active {
  background: linear-gradient(135deg, #6c63ff, #a78bfa);
  box-shadow: 0 0 0 0 rgba(108, 99, 255, 0.7);
}

/* Gradient background orbs */
.orb {
  position: fixed;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
  pointer-events: none;
  z-index: 0;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: #6c63ff;
  top: -100px;
  left: -100px;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: #2dd4bf;
  bottom: 100px;
  right: -50px;
}

.orb-3 {
  width: 200px;
  height: 200px;
  background: #a78bfa;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

'@ | Set-Content -Path 'src\index.css' -Encoding UTF8

Write-Host "  Writing src/main.jsx" -ForegroundColor Gray
@'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

'@ | Set-Content -Path 'src\main.jsx' -Encoding UTF8

Write-Host "  Writing src/App.jsx" -ForegroundColor Gray
@'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Translator from './pages/Translator'
import Conversation from './pages/Conversation'
import History from './pages/History'
import Favorites from './pages/Favorites'

export default function App() {
  return (
    <BrowserRouter>
      {/* Background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Translator />} />
          <Route path="/conversation" element={<Conversation />} />
          <Route path="/history" element={<History />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

'@ | Set-Content -Path 'src\App.jsx' -Encoding UTF8

Write-Host "  Writing src/utils/constants.js" -ForegroundColor Gray
@'
export const LANGUAGES = [
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    speechCode: 'bn-BD',
    flag: '🇧🇩',
    color: '#2dd4bf',
  },
  {
    code: 'ne',
    name: 'Nepali',
    nativeName: 'नेपाली',
    speechCode: 'ne-NP',
    flag: '🇳🇵',
    color: '#6c63ff',
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    speechCode: 'hi-IN',
    flag: '🇮🇳',
    color: '#f87171',
  },
]

export const getLanguage = (code) =>
  LANGUAGES.find((l) => l.code === code) || LANGUAGES[0]

export const getOtherLanguages = (code) =>
  LANGUAGES.filter((l) => l.code !== code)

export const TRANSLATION_MODES = [
  { id: 'voice-voice', label: 'Voice → Voice', icon: '🎙️' },
  { id: 'voice-text', label: 'Voice → Text', icon: '🎙️➡️📝' },
  { id: 'text-voice', label: 'Text → Voice', icon: '📝➡️🔊' },
  { id: 'text-text', label: 'Text → Text', icon: '📝' },
]

'@ | Set-Content -Path 'src\utils\constants.js' -Encoding UTF8

Write-Host "  Writing src/services/translation.js" -ForegroundColor Gray
@'
// MyMemory API — free, no key needed for basic use (1000 req/day)
const MYMEMORY_URL = 'https://api.mymemory.translated.net/get'

export async function translateText(text, fromLang, toLang) {
  if (!text || !text.trim()) return ''
  if (fromLang === toLang) return text

  try {
    const langPair = ``${fromLang}|${toLang}``
    const url = ``${MYMEMORY_URL}?q=${encodeURIComponent(text)}&langpair=${langPair}``
    const res = await fetch(url)
    const data = await res.json()

    if (data.responseStatus === 200) {
      return data.responseData.translatedText
    }
    throw new Error(data.responseDetails || 'Translation failed')
  } catch (err) {
    console.error('Translation error:', err)
    throw err
  }
}

'@ | Set-Content -Path 'src\services\translation.js' -Encoding UTF8

Write-Host "  Writing src/store/appStore.js" -ForegroundColor Gray
@'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAppStore = create(
  persist(
    (set, get) => ({
      // Theme
      darkMode: true,
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),

      // History
      history: [],
      addToHistory: (entry) => {
        const newEntry = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          ...entry,
        }
        set((s) => ({ history: [newEntry, ...s.history].slice(0, 100) }))
      },
      deleteFromHistory: (id) =>
        set((s) => ({ history: s.history.filter((h) => h.id !== id) })),
      clearHistory: () => set({ history: [] }),

      // Favorites
      favorites: [],
      toggleFavorite: (id) => {
        const { history, favorites } = get()
        const item = history.find((h) => h.id === id)
        if (!item) return
        const exists = favorites.find((f) => f.id === id)
        if (exists) {
          set((s) => ({ favorites: s.favorites.filter((f) => f.id !== id) }))
        } else {
          set((s) => ({ favorites: [item, ...s.favorites] }))
        }
      },
      isFavorite: (id) => get().favorites.some((f) => f.id === id),
    }),
    {
      name: 'kothasetu-storage',
      partialize: (state) => ({
        history: state.history,
        favorites: state.favorites,
        darkMode: state.darkMode,
      }),
    }
  )
)

'@ | Set-Content -Path 'src\store\appStore.js' -Encoding UTF8

Write-Host "  Writing src/hooks/useSpeechRecognition.js" -ForegroundColor Gray
@'
import { useState, useRef, useCallback } from 'react'

export function useSpeechRecognition() {
  const [transcript, setTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState(null)
  const recognitionRef = useRef(null)

  const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window

  const startListening = useCallback((langCode) => {
    if (!isSupported) {
      setError('Speech recognition not supported in this browser. Please use Chrome.')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.lang = langCode
    recognition.continuous = false
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
      setTranscript('')
    }

    recognition.onresult = (event) => {
      let finalTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript
        }
      }
      if (finalTranscript) setTranscript(finalTranscript)
    }

    recognition.onerror = (event) => {
      setError(``Microphone error: ${event.error}``)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition
    recognition.start()
  }, [isSupported])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
  }, [])

  const resetTranscript = useCallback(() => setTranscript(''), [])

  return {
    transcript,
    isListening,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    setTranscript,
  }
}

'@ | Set-Content -Path 'src\hooks\useSpeechRecognition.js' -Encoding UTF8

Write-Host "  Writing src/hooks/useSpeechSynthesis.js" -ForegroundColor Gray
@'
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

'@ | Set-Content -Path 'src\hooks\useSpeechSynthesis.js' -Encoding UTF8

Write-Host "  Writing src/components/layout/Navbar.jsx" -ForegroundColor Gray
@'
import { Link, useLocation } from 'react-router-dom'
import { MessageSquare, Mic, History, Star, Settings, Moon, Sun } from 'lucide-react'
import { useAppStore } from '../../store/appStore'

const navItems = [
  { to: '/', icon: Mic, label: 'Translate' },
  { to: '/conversation', icon: MessageSquare, label: 'Conversation' },
  { to: '/history', icon: History, label: 'History' },
  { to: '/favorites', icon: Star, label: 'Favorites' },
]

export default function Navbar() {
  const location = useLocation()
  const { darkMode, toggleDarkMode } = useAppStore()

  return (
    <nav style={{
      background: 'rgba(10, 10, 15, 0.9)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', height: 64 }}>
        
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, marginRight: 40 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #6c63ff, #2dd4bf)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>🌉</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
              কথাসেতু
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: 1 }}>KOTHASETU</div>
          </div>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 4, flex: 1 }}>
          {navItems.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to
            return (
              <Link key={to} to={to} style={{
                textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 8,
                fontSize: 14, fontWeight: active ? 600 : 400,
                color: active ? 'var(--accent-secondary)' : 'var(--text-secondary)',
                background: active ? 'rgba(108, 99, 255, 0.1)' : 'transparent',
                transition: 'all 0.2s',
              }}>
                <Icon size={16} />
                <span>{label}</span>
              </Link>
            )
          })}
        </div>

        {/* Theme toggle */}
        <button onClick={toggleDarkMode} style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 8, padding: '8px', cursor: 'pointer',
          color: 'var(--text-secondary)', display: 'flex', alignItems: 'center',
        }}>
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>

      {/* Mobile bottom nav */}
      <div style={{
        display: 'none',
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'rgba(10, 10, 15, 0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border)',
        padding: '8px 0',
        zIndex: 50,
      }} className="mobile-nav">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to
          return (
            <Link key={to} to={to} style={{
              textDecoration: 'none', flex: 1,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              padding: '6px 0',
              color: active ? 'var(--accent-secondary)' : 'var(--text-muted)',
              fontSize: 10,
            }}>
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

'@ | Set-Content -Path 'src\components\layout\Navbar.jsx' -Encoding UTF8

Write-Host "  Writing src/components/translation/LanguageSelector.jsx" -ForegroundColor Gray
@'
import { LANGUAGES } from '../../utils/constants'

export default function LanguageSelector({ value, onChange, exclude }) {
  const options = exclude ? LANGUAGES.filter((l) => l.code !== exclude) : LANGUAGES

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {options.map((lang) => {
        const selected = value === lang.code
        return (
          <button
            key={lang.code}
            onClick={() => onChange(lang.code)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 16px', borderRadius: 10,
              border: selected ? ``1px solid ${lang.color}`` : '1px solid var(--border)',
              background: selected ? ``${lang.color}18`` : 'var(--bg-card)',
              color: selected ? lang.color : 'var(--text-secondary)',
              cursor: 'pointer', fontSize: 14, fontWeight: selected ? 600 : 400,
              transition: 'all 0.2s',
              boxShadow: selected ? ``0 0 12px ${lang.color}30`` : 'none',
            }}
          >
            <span style={{ fontSize: 18 }}>{lang.flag}</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{lang.nativeName}</div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>{lang.name}</div>
            </div>
          </button>
        )
      })}
    </div>
  )
}

'@ | Set-Content -Path 'src\components\translation\LanguageSelector.jsx' -Encoding UTF8

Write-Host "  Writing src/components/translation/Waveform.jsx" -ForegroundColor Gray
@'
export default function Waveform({ active, color = '#6c63ff' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3, height: 32 }}>
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className={active ? 'wave-bar' : ''}
          style={{
            width: 3,
            height: active ? undefined : 4,
            minHeight: 4,
            maxHeight: 28,
            background: color,
            borderRadius: 2,
            transition: 'height 0.1s',
            animationDelay: ``${i * 0.1}s``,
            opacity: active ? 1 : 0.4,
          }}
        />
      ))}
    </div>
  )
}

'@ | Set-Content -Path 'src\components\translation\Waveform.jsx' -Encoding UTF8

Write-Host "  Writing src/pages/Translator.jsx" -ForegroundColor Gray
@'
import { useState, useEffect } from 'react'
import { Mic, MicOff, Volume2, VolumeX, Copy, ArrowLeftRight, Loader, CheckCheck } from 'lucide-react'
import LanguageSelector from '../components/translation/LanguageSelector'
import Waveform from '../components/translation/Waveform'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'
import { translateText } from '../services/translation'
import { useAppStore } from '../store/appStore'
import { getLanguage } from '../utils/constants'

export default function Translator() {
  const [fromLang, setFromLang] = useState('bn')
  const [toLang, setToLang] = useState('hi')
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)
  const [mode, setMode] = useState('voice-voice') // voice-voice | text-text
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState(null)

  const { transcript, isListening, startListening, stopListening, resetTranscript, isSupported } = useSpeechRecognition()
  const { speak, isSpeaking, stop } = useSpeechSynthesis()
  const { addToHistory } = useAppStore()

  const fromLangData = getLanguage(fromLang)
  const toLangData = getLanguage(toLang)

  // When speech transcript arrives, put it in input
  useEffect(() => {
    if (transcript) setInputText(transcript)
  }, [transcript])

  // Auto-translate when input changes (debounced)
  useEffect(() => {
    if (!inputText.trim()) { setOutputText(''); return }
    const timer = setTimeout(() => handleTranslate(inputText), 800)
    return () => clearTimeout(timer)
  }, [inputText, fromLang, toLang])

  const handleTranslate = async (text) => {
    if (!text.trim()) return
    setIsTranslating(true)
    setError(null)
    try {
      const result = await translateText(text, fromLang, toLang)
      setOutputText(result)
      addToHistory({ fromLang, toLang, originalText: text, translatedText: result })

      // Auto-speak if in voice mode
      if (mode === 'voice-voice' || mode === 'text-voice') {
        speak(result, toLang)
      }
    } catch (err) {
      setError('Translation failed. Check your internet connection.')
    } finally {
      setIsTranslating(false)
    }
  }

  const handleMicClick = () => {
    if (isListening) {
      stopListening()
    } else {
      resetTranscript()
      setInputText('')
      setOutputText('')
      startListening(fromLangData.speechCode)
    }
  }

  const handleSwapLanguages = () => {
    setFromLang(toLang)
    setToLang(fromLang)
    setInputText(outputText)
    setOutputText('')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 8 }}>
          <span className="gradient-text">Voice & Text</span> Translator
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>
          Speak or type in Bengali, Nepali, or Hindi — get instant translation
        </p>
      </div>

      {/* Mode selector */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
        {[
          { id: 'voice-voice', label: '🎙️ Voice → Voice' },
          { id: 'text-text', label: '📝 Text → Text' },
          { id: 'voice-text', label: '🎙️ Voice → Text' },
          { id: 'text-voice', label: '📝 → 🔊 Speak' },
        ].map((m) => (
          <button key={m.id} onClick={() => setMode(m.id)} style={{
            padding: '8px 16px', borderRadius: 20,
            border: mode === m.id ? '1px solid var(--accent-primary)' : '1px solid var(--border)',
            background: mode === m.id ? 'rgba(108,99,255,0.15)' : 'var(--bg-card)',
            color: mode === m.id ? 'var(--accent-secondary)' : 'var(--text-secondary)',
            cursor: 'pointer', fontSize: 13, fontWeight: mode === m.id ? 600 : 400,
            transition: 'all 0.2s',
          }}>
            {m.label}
          </button>
        ))}
      </div>

      {/* Language selectors + swap */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>From</div>
          <LanguageSelector value={fromLang} onChange={(v) => { setFromLang(v); if (v === toLang) setToLang(fromLang) }} />
        </div>

        <button onClick={handleSwapLanguages} style={{
          marginTop: 24,
          width: 44, height: 44, borderRadius: 22,
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          color: 'var(--text-secondary)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s', flexShrink: 0,
        }}>
          <ArrowLeftRight size={18} />
        </button>

        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>To</div>
          <LanguageSelector value={toLang} onChange={(v) => { setToLang(v); if (v === fromLang) setFromLang(toLang) }} exclude={fromLang} />
        </div>
      </div>

      {/* Translation panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>

        {/* Input panel */}
        <div className="glass" style={{ borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>{fromLangData.flag}</span>
              <span style={{ fontWeight: 600, color: fromLangData.color }}>{fromLangData.nativeName}</span>
            </div>
            {isListening && <Waveform active={true} color={fromLangData.color} />}
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={``Type or speak in ${fromLangData.name}...``}
            style={{
              width: '100%', minHeight: 160, background: 'transparent',
              border: 'none', outline: 'none', resize: 'vertical',
              color: 'var(--text-primary)', fontSize: 18, lineHeight: 1.6,
              fontFamily: 'inherit',
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{inputText.length} characters</span>
            <button onClick={() => { setInputText(''); setOutputText('') }} style={{
              background: 'none', border: 'none', color: 'var(--text-muted)',
              cursor: 'pointer', fontSize: 12,
            }}>Clear</button>
          </div>
        </div>

        {/* Output panel */}
        <div className="glass" style={{ borderRadius: 16, padding: 24, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>{toLangData.flag}</span>
              <span style={{ fontWeight: 600, color: toLangData.color }}>{toLangData.nativeName}</span>
            </div>
            {isTranslating && <Loader size={16} style={{ color: 'var(--accent-primary)', animation: 'spin 1s linear infinite' }} />}
          </div>

          <div style={{
            minHeight: 160, fontSize: 18, lineHeight: 1.6,
            color: outputText ? 'var(--text-primary)' : 'var(--text-muted)',
            fontStyle: outputText ? 'normal' : 'italic',
          }}>
            {outputText || (isTranslating ? 'Translating...' : 'Translation will appear here')}
          </div>

          {error && (
            <div style={{ marginTop: 8, padding: '8px 12px', background: 'rgba(248,113,113,0.1)', borderRadius: 8, color: '#f87171', fontSize: 13 }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
            <button onClick={handleCopy} disabled={!outputText} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 8,
              background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              color: copied ? '#2dd4bf' : 'var(--text-secondary)',
              cursor: outputText ? 'pointer' : 'not-allowed', fontSize: 13,
            }}>
              {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button onClick={() => isSpeaking ? stop() : speak(outputText, toLang)} disabled={!outputText} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 8,
              background: isSpeaking ? 'rgba(108,99,255,0.2)' : 'var(--bg-secondary)',
              border: ``1px solid ${isSpeaking ? 'var(--accent-primary)' : 'var(--border)'}``,
              color: isSpeaking ? 'var(--accent-secondary)' : 'var(--text-secondary)',
              cursor: outputText ? 'pointer' : 'not-allowed', fontSize: 13,
            }}>
              {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
              {isSpeaking ? 'Stop' : 'Speak'}
            </button>
          </div>
        </div>
      </div>

      {/* Mic button */}
      {(mode === 'voice-voice' || mode === 'voice-text') && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          {!isSupported && (
            <div style={{ color: '#f87171', fontSize: 14, textAlign: 'center' }}>
              ⚠️ Please use Chrome browser for voice features
            </div>
          )}
          <button
            onClick={handleMicClick}
            disabled={!isSupported}
            className={isListening ? 'pulse-record' : ''}
            style={{
              width: 80, height: 80, borderRadius: 40,
              background: isListening
                ? 'linear-gradient(135deg, #f87171, #fb923c)'
                : 'linear-gradient(135deg, #6c63ff, #a78bfa)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.3s',
              boxShadow: isListening
                ? '0 0 40px rgba(248,113,113,0.4)'
                : '0 0 30px rgba(108,99,255,0.3)',
            }}
          >
            {isListening ? <MicOff size={32} color="white" /> : <Mic size={32} color="white" />}
          </button>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            {isListening ? ``Listening in ${fromLangData.name}... tap to stop`` : ``Tap to speak in ${fromLangData.name}``}
          </p>
        </div>
      )}
    </div>
  )
}

'@ | Set-Content -Path 'src\pages\Translator.jsx' -Encoding UTF8

Write-Host "  Writing src/pages/Conversation.jsx" -ForegroundColor Gray
@'
import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Volume2, RotateCcw, Trash2 } from 'lucide-react'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'
import { translateText } from '../services/translation'
import LanguageSelector from '../components/translation/LanguageSelector'
import Waveform from '../components/translation/Waveform'
import { getLanguage } from '../utils/constants'

export default function Conversation() {
  const [langA, setLangA] = useState('bn')
  const [langB, setLangB] = useState('hi')
  const [activeSpeaker, setActiveSpeaker] = useState(null) // 'A' | 'B' | null
  const [messages, setMessages] = useState([])
  const [isTranslating, setIsTranslating] = useState(false)
  const messagesEndRef = useRef(null)

  const { transcript, isListening, startListening, stopListening, resetTranscript, isSupported } = useSpeechRecognition()
  const { speak, isSpeaking } = useSpeechSynthesis()

  const langAData = getLanguage(langA)
  const langBData = getLanguage(langB)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSpeak = async (speaker) => {
    if (isListening) {
      stopListening()
      return
    }

    const fromLang = speaker === 'A' ? langA : langB
    const fromLangData = getLanguage(fromLang)
    setActiveSpeaker(speaker)
    resetTranscript()
    startListening(fromLangData.speechCode)
  }

  // When listening stops and we have a transcript, translate it
  useEffect(() => {
    if (!isListening && transcript && activeSpeaker) {
      processMessage(transcript, activeSpeaker)
    }
  }, [isListening])

  const processMessage = async (text, speaker) => {
    if (!text.trim()) { setActiveSpeaker(null); return }

    const fromLang = speaker === 'A' ? langA : langB
    const toLang = speaker === 'A' ? langB : langA
    const fromData = getLanguage(fromLang)
    const toData = getLanguage(toLang)

    // Add original message immediately
    const msgId = Date.now()
    setMessages((prev) => [...prev, {
      id: msgId,
      speaker,
      fromLang,
      toLang,
      originalText: text,
      translatedText: null,
      timestamp: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }),
      translating: true,
    }])

    setIsTranslating(true)

    try {
      const translated = await translateText(text, fromLang, toLang)
      setMessages((prev) => prev.map((m) => m.id === msgId
        ? { ...m, translatedText: translated, translating: false }
        : m
      ))
      // Auto speak translated
      speak(translated, toLang)
    } catch {
      setMessages((prev) => prev.map((m) => m.id === msgId
        ? { ...m, translatedText: 'Translation failed', translating: false }
        : m
      ))
    } finally {
      setIsTranslating(false)
      setActiveSpeaker(null)
    }
  }

  const clearConversation = () => setMessages([])

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 20px', display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 64px)' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>
          <span className="gradient-text">Conversation</span> Mode
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Two people, two languages — speak naturally
        </p>
      </div>

      {/* Language pickers */}
      <div className="glass" style={{ borderRadius: 16, padding: 20, marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Person A speaks</div>
          <LanguageSelector value={langA} onChange={setLangA} />
        </div>
        <div style={{ fontSize: 24 }}>⇄</div>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Person B speaks</div>
          <LanguageSelector value={langB} onChange={setLangB} />
        </div>
      </div>

      {/* Chat messages */}
      <div className="glass" style={{
        borderRadius: 16, flex: 1, minHeight: 300, maxHeight: 400,
        overflowY: 'auto', padding: 20, marginBottom: 20,
        display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', margin: 'auto', padding: 40 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
            <div style={{ fontSize: 16, marginBottom: 6 }}>Start the conversation</div>
            <div style={{ fontSize: 13 }}>Person A or B taps their mic button below to speak</div>
          </div>
        ) : messages.map((msg) => {
          const fromData = getLanguage(msg.fromLang)
          const toData = getLanguage(msg.toLang)
          const isA = msg.speaker === 'A'

          return (
            <div key={msg.id} className="fade-in" style={{
              display: 'flex', flexDirection: 'column',
              alignItems: isA ? 'flex-start' : 'flex-end',
            }}>
              {/* Speaker label */}
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, paddingLeft: isA ? 4 : 0, paddingRight: isA ? 0 : 4 }}>
                {isA ? ``Person A · ${fromData.flag} ${fromData.nativeName}`` : ``Person B · ${fromData.flag} ${fromData.nativeName}``} · {msg.timestamp}
              </div>

              {/* Message bubble */}
              <div style={{
                maxWidth: '80%',
                background: isA ? 'rgba(108,99,255,0.12)' : 'rgba(45,212,191,0.10)',
                border: ``1px solid ${isA ? 'rgba(108,99,255,0.3)' : 'rgba(45,212,191,0.25)'}``,
                borderRadius: isA ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                padding: '14px 18px',
              }}>
                {/* Original */}
                <div style={{ fontSize: 16, color: 'var(--text-primary)', marginBottom: 10, lineHeight: 1.5 }}>
                  {msg.originalText}
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }} />

                {/* Translation */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ fontSize: 14 }}>{toData.flag}</span>
                  <div style={{ flex: 1 }}>
                    {msg.translating ? (
                      <div style={{ color: 'var(--text-muted)', fontSize: 14, fontStyle: 'italic' }}>Translating...</div>
                    ) : (
                      <div style={{ fontSize: 15, color: isA ? '#a78bfa' : '#2dd4bf', lineHeight: 1.5 }}>
                        {msg.translatedText}
                      </div>
                    )}
                  </div>
                  {msg.translatedText && !msg.translating && (
                    <button onClick={() => speak(msg.translatedText, msg.toLang)} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--text-muted)', padding: 2, flexShrink: 0,
                    }}>
                      <Volume2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Mic buttons */}
      {!isSupported ? (
        <div style={{ textAlign: 'center', color: '#f87171', padding: 16 }}>
          ⚠️ Please use Chrome for voice features
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'center' }}>

          {/* Person A button */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => handleSpeak('A')}
              disabled={isTranslating || (isListening && activeSpeaker !== 'A')}
              className={isListening && activeSpeaker === 'A' ? 'pulse-record' : ''}
              style={{
                width: 72, height: 72, borderRadius: 36,
                background: isListening && activeSpeaker === 'A'
                  ? 'linear-gradient(135deg, #f87171, #fb923c)'
                  : ``linear-gradient(135deg, ${langAData.color}, #6c63ff)``,
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: (isTranslating || (isListening && activeSpeaker !== 'A')) ? 0.4 : 1,
                transition: 'all 0.3s',
                boxShadow: isListening && activeSpeaker === 'A' ? '0 0 30px rgba(248,113,113,0.4)' : ``0 0 20px ${langAData.color}40``,
              }}
            >
              {isListening && activeSpeaker === 'A' ? <MicOff size={28} color="white" /> : <Mic size={28} color="white" />}
            </button>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: langAData.color }}>
                {langAData.flag} Person A
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{langAData.nativeName}</div>
              {isListening && activeSpeaker === 'A' && (
                <div style={{ marginTop: 4, display: 'flex', justifyContent: 'center' }}>
                  <Waveform active color={langAData.color} />
                </div>
              )}
            </div>
          </div>

          {/* Clear button */}
          <button onClick={clearConversation} style={{
            width: 44, height: 44, borderRadius: 22,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            color: 'var(--text-muted)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Trash2 size={16} />
          </button>

          {/* Person B button */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => handleSpeak('B')}
              disabled={isTranslating || (isListening && activeSpeaker !== 'B')}
              className={isListening && activeSpeaker === 'B' ? 'pulse-record' : ''}
              style={{
                width: 72, height: 72, borderRadius: 36,
                background: isListening && activeSpeaker === 'B'
                  ? 'linear-gradient(135deg, #f87171, #fb923c)'
                  : ``linear-gradient(135deg, ${langBData.color}, #2dd4bf)``,
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: (isTranslating || (isListening && activeSpeaker !== 'B')) ? 0.4 : 1,
                transition: 'all 0.3s',
                boxShadow: isListening && activeSpeaker === 'B' ? '0 0 30px rgba(248,113,113,0.4)' : ``0 0 20px ${langBData.color}40``,
              }}
            >
              {isListening && activeSpeaker === 'B' ? <MicOff size={28} color="white" /> : <Mic size={28} color="white" />}
            </button>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: langBData.color }}>
                {langBData.flag} Person B
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{langBData.nativeName}</div>
              {isListening && activeSpeaker === 'B' && (
                <div style={{ marginTop: 4, display: 'flex', justifyContent: 'center' }}>
                  <Waveform active color={langBData.color} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

'@ | Set-Content -Path 'src\pages\Conversation.jsx' -Encoding UTF8

Write-Host "  Writing src/pages/History.jsx" -ForegroundColor Gray
@'
import { useState } from 'react'
import { Trash2, Star, Search, Volume2, Download } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { getLanguage } from '../utils/constants'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'

export default function History() {
  const { history, deleteFromHistory, clearHistory, toggleFavorite, isFavorite } = useAppStore()
  const { speak } = useSpeechSynthesis()
  const [search, setSearch] = useState('')

  const filtered = history.filter((h) =>
    h.originalText?.toLowerCase().includes(search.toLowerCase()) ||
    h.translatedText?.toLowerCase().includes(search.toLowerCase())
  )

  const exportHistory = () => {
    const data = JSON.stringify(history, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'kothasetu-history.json'
    a.click()
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700 }}>Translation <span className="gradient-text">History</span></h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>{history.length} translations saved</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={exportHistory} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 8,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 13,
          }}>
            <Download size={14} /> Export
          </button>
          <button onClick={clearHistory} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 8,
            background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)',
            color: '#f87171', cursor: 'pointer', fontSize: 13,
          }}>
            <Trash2 size={14} /> Clear All
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 24 }}>
        <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search translations..."
          style={{
            width: '100%', padding: '12px 16px 12px 42px',
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 10, color: 'var(--text-primary)', fontSize: 14, outline: 'none',
          }}
        />
      </div>

      {/* History list */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📜</div>
          <div>{search ? 'No results found' : 'No translations yet — start translating!'}</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((item) => {
            const from = getLanguage(item.fromLang)
            const to = getLanguage(item.toLang)
            const fav = isFavorite(item.id)
            return (
              <div key={item.id} className="glass fade-in" style={{ borderRadius: 12, padding: 18 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    {/* Languages */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <span style={{ fontSize: 13, color: from.color, fontWeight: 600 }}>{from.flag} {from.nativeName}</span>
                      <span style={{ color: 'var(--text-muted)' }}>→</span>
                      <span style={{ fontSize: 13, color: to.color, fontWeight: 600 }}>{to.flag} {to.nativeName}</span>
                      <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)' }}>
                        {new Date(item.timestamp).toLocaleDateString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Texts */}
                    <div style={{ fontSize: 15, color: 'var(--text-primary)', marginBottom: 6 }}>{item.originalText}</div>
                    <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{item.translatedText}</div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <button onClick={() => toggleFavorite(item.id)} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: fav ? '#fbbf24' : 'var(--text-muted)', padding: 4,
                    }}>
                      <Star size={16} fill={fav ? '#fbbf24' : 'none'} />
                    </button>
                    <button onClick={() => speak(item.translatedText, item.toLang)} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--text-muted)', padding: 4,
                    }}>
                      <Volume2 size={16} />
                    </button>
                    <button onClick={() => deleteFromHistory(item.id)} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--text-muted)', padding: 4,
                    }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

'@ | Set-Content -Path 'src\pages\History.jsx' -Encoding UTF8

Write-Host "  Writing src/pages/Favorites.jsx" -ForegroundColor Gray
@'
import { Star, Volume2 } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { getLanguage } from '../utils/constants'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'

export default function Favorites() {
  const { favorites, toggleFavorite } = useAppStore()
  const { speak } = useSpeechSynthesis()

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 20px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>⭐ <span className="gradient-text">Favorites</span></h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>{favorites.length} saved translations</p>
      </div>

      {favorites.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⭐</div>
          <div style={{ fontSize: 16, marginBottom: 6 }}>No favorites yet</div>
          <div style={{ fontSize: 13 }}>Tap the star icon on any translation in History to save it here</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {favorites.map((item) => {
            const from = getLanguage(item.fromLang)
            const to = getLanguage(item.toLang)
            return (
              <div key={item.id} className="glass fade-in" style={{ borderRadius: 12, padding: 18 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <span style={{ fontSize: 13, color: from.color, fontWeight: 600 }}>{from.flag} {from.nativeName}</span>
                      <span style={{ color: 'var(--text-muted)' }}>→</span>
                      <span style={{ fontSize: 13, color: to.color, fontWeight: 600 }}>{to.flag} {to.nativeName}</span>
                    </div>
                    <div style={{ fontSize: 15, color: 'var(--text-primary)', marginBottom: 6 }}>{item.originalText}</div>
                    <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{item.translatedText}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <button onClick={() => toggleFavorite(item.id)} style={{
                      background: 'none', border: 'none', cursor: 'pointer', color: '#fbbf24', padding: 4,
                    }}>
                      <Star size={16} fill="#fbbf24" />
                    </button>
                    <button onClick={() => speak(item.translatedText, item.toLang)} style={{
                      background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4,
                    }}>
                      <Volume2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

'@ | Set-Content -Path 'src\pages\Favorites.jsx' -Encoding UTF8

Write-Host ""
Write-Host "All files written!" -ForegroundColor Green
Write-Host "Now run: npm run dev" -ForegroundColor Yellow