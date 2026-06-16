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
          Two people, two languages â€” speak naturally
        </p>
      </div>

      {/* Language pickers */}
      <div className="glass" style={{ borderRadius: 16, padding: 20, marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Person A speaks</div>
          <LanguageSelector value={langA} onChange={setLangA} />
        </div>
        <div style={{ fontSize: 24 }}>â‡„</div>
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
            <div style={{ fontSize: 40, marginBottom: 12 }}>ðŸ’¬</div>
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
                {isA ? "Person A Â· " + fromData.flag + " " + fromData.nativeName : "Person B Â· " + fromData.flag + " " + fromData.nativeName} Â· {msg.timestamp}
              </div>

              {/* Message bubble */}
              <div style={{
                maxWidth: '80%',
                background: isA ? 'rgba(108,99,255,0.12)' : 'rgba(45,212,191,0.10)',
                border: '1px solid ' + (isA ? 'rgba(108,99,255,0.3)' : 'rgba(45,212,191,0.25)'),
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
          âš ï¸ Please use Chrome for voice features
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
                  : 'linear-gradient(135deg, ' + langAData.color + ', #6c63ff)',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: (isTranslating || (isListening && activeSpeaker !== 'A')) ? 0.4 : 1,
                transition: 'all 0.3s',
                boxShadow: isListening && activeSpeaker === 'A' ? '0 0 30px rgba(248,113,113,0.4)' : '0 0 20px ' + langAData.color + '40',
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
                  : 'linear-gradient(135deg, ' + langBData.color + ', #2dd4bf)',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: (isTranslating || (isListening && activeSpeaker !== 'B')) ? 0.4 : 1,
                transition: 'all 0.3s',
                boxShadow: isListening && activeSpeaker === 'B' ? '0 0 30px rgba(248,113,113,0.4)' : '0 0 20px ' + langBData.color + '40',
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

