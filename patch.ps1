# KothaSetu - Patch Script (fixes 2 files)

Write-Host "Patching src\pages\Translator.jsx" -ForegroundColor Cyan
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
            placeholder={"Type or speak in " + fromLangData.name + "..."}
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

Write-Host "Patching src\pages\Conversation.jsx" -ForegroundColor Cyan
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
                {isA ? "Person A · " + fromData.flag + " " + fromData.nativeName : "Person B · " + fromData.flag + " " + fromData.nativeName} · {msg.timestamp}
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

Write-Host "Patch done! Run: npm run dev" -ForegroundColor Green