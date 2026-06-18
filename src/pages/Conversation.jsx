import { useState, useRef, useEffect, useCallback } from 'react'
import { Mic, Volume2, Trash2 } from 'lucide-react'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'
import { translateText } from '../services/translation'
import LanguageSelector from '../components/translation/LanguageSelector'
import Waveform from '../components/translation/Waveform'
import { getLanguage } from '../utils/constants'

export default function Conversation() {
  const [langA, setLangA] = useState('bn')
  const [langB, setLangB] = useState('hi')
  const [activeSpeaker, setActiveSpeaker] = useState(null)
  const [messages, setMessages] = useState([])
  const [isTranslating, setIsTranslating] = useState(false)
  const activeSpeakerRef = useRef(null)
  const messagesEndRef = useRef(null)

  const { transcript, interimText, isListening, startListening, stopListening, resetTranscript, isSupported, error: speechError } = useSpeechRecognition()
  const { speak, isSpeaking, stop } = useSpeechSynthesis()

  const langAData = getLanguage(langA)
  const langBData = getLanguage(langB)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSpeak = (speaker) => {
    if (isListening || isTranslating) {
      stopListening()
      return
    }
    const fromLang = speaker === 'A' ? langA : langB
    activeSpeakerRef.current = speaker
    setActiveSpeaker(speaker)
    resetTranscript()
    startListening(fromLang)
  }

  useEffect(() => {
    if (!isListening && transcript && activeSpeakerRef.current) {
      const speaker = activeSpeakerRef.current
      activeSpeakerRef.current = null
      processMessage(transcript, speaker)
    }
  }, [isListening])

  const processMessage = async (text, speaker) => {
    if (!text.trim()) { setActiveSpeaker(null); return }

    const fromLang = speaker === 'A' ? langA : langB
    const toLang = speaker === 'A' ? langB : langA
    const fromData = getLanguage(fromLang)
    const toData = getLanguage(toLang)

    const msgId = Date.now()
    setMessages((prev) => [...prev, {
      id: msgId, speaker, fromLang, toLang,
      originalText: text, translatedText: null,
      timestamp: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }),
      translating: true,
    }])

    setIsTranslating(true)

    try {
      const translated = await translateText(text, fromLang, toLang)
      setMessages((prev) => prev.map((m) => m.id === msgId
        ? { ...m, translatedText: translated, translating: false } : m
      ))
      setTimeout(() => speak(translated, toLang), 300)
    } catch {
      setMessages((prev) => prev.map((m) => m.id === msgId
        ? { ...m, translatedText: 'Translation failed - check internet', translating: false } : m
      ))
    } finally {
      setIsTranslating(false)
      setActiveSpeaker(null)
    }
  }

  const replayMessage = (msg) => {
    if (msg.translatedText) { stop(); setTimeout(() => speak(msg.translatedText, msg.toLang), 100) }
  }

  const clearConversation = () => setMessages([])

  const isButtonDisabled = (speaker) =>
    isTranslating || (isListening && activeSpeaker !== speaker)

  const MicButton = ({ speaker, langData }) => {
    const active = isListening && activeSpeaker === speaker
    const disabled = isButtonDisabled(speaker)
    // Person A = saffron/marigold side, Person B = teal/pine side
    const idleGradient = speaker === 'A'
      ? 'linear-gradient(145deg,#C8560A 0%,#E8872A 60%,#C8960C 100%)'
      : 'linear-gradient(145deg,#0D7377 0%,#14A98A 60%,#2D6A4F 100%)'
    const petalColorA = speaker === 'A' ? '#C8560A' : '#0D7377'
    const petalColorB = speaker === 'A' ? '#C8960C' : '#2D6A4F'

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Rangoli petal ring — idle only */}
          {!active && !disabled && (
            <svg width="136" height="136" viewBox="0 0 136 136"
              style={{ position: 'absolute', pointerEvents: 'none', opacity: 0.5 }} aria-hidden="true">
              {[0,45,90,135,180,225,270,315].map((deg, i) => (
                <ellipse key={i} cx="68" cy="68" rx="7" ry="18"
                  fill="none"
                  stroke={i % 2 === 0 ? petalColorA : petalColorB}
                  strokeWidth="1.4"
                  transform={`rotate(${deg} 68 68) translate(0 -32)`}
                />
              ))}
              <circle cx="68" cy="68" r="36" fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 4"/>
            </svg>
          )}
          {/* Active ripple rings */}
          {active && [1,2,3].map(n => (
            <span key={n} style={{
              position: 'absolute',
              width: 76 + n * 24, height: 76 + n * 24, borderRadius: '50%',
              border: `${3 - n + 1}px solid rgba(192,57,43,${0.3 - n * 0.08})`,
              animation: `micRipple ${0.9 + n * 0.28}s ease-out infinite`,
              animationDelay: `${n * 0.18}s`, pointerEvents: 'none',
            }}/>
          ))}
          <button
            onClick={() => handleSpeak(speaker)}
            disabled={disabled}
            style={{
              position: 'relative', zIndex: 1,
              width: 76, height: 76, borderRadius: '50%',
              background: active ? 'linear-gradient(135deg,#C0392B,#E8872A)' : idleGradient,
              border: active ? '3px solid rgba(192,57,43,0.35)' : `3px solid ${petalColorB}55`,
              cursor: disabled ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2,
              opacity: disabled ? 0.35 : 1,
              transition: 'all 0.3s cubic-bezier(.34,1.56,.64,1)',
              boxShadow: active
                ? '0 0 0 4px rgba(192,57,43,0.18),0 8px 28px rgba(192,57,43,0.4)'
                : `0 0 0 4px ${petalColorB}18,0 6px 22px ${petalColorA}45`,
              transform: active ? 'scale(1.07)' : 'scale(1)',
            }}
          >
            <Mic size={26} color="white" strokeWidth={2} />
            <div style={{ display: 'flex', gap: 3 }}>
              {[0,1,2].map(i => <div key={i} style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }}/>)}
            </div>
          </button>
          {/* Bindi dot */}
          <div style={{
            position: 'absolute', bottom: -12, left: '50%', transform: 'translateX(-50%)',
            width: 7, height: 7, borderRadius: '50%',
            background: active ? '#C0392B' : petalColorB,
            boxShadow: `0 0 7px ${active ? 'rgba(192,57,43,0.7)' : petalColorB + '99'}`,
            transition: 'all 0.3s',
          }}/>
        </div>

        <div style={{ textAlign: 'center', marginTop: 6 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: langData.color, fontFamily: "'Hind',sans-serif" }}>
            Person {speaker}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            {active ? 'Tap to stop' : langData.nativeName}
          </div>
          {active && (
            <div style={{ marginTop: 6, display: 'flex', justifyContent: 'center' }}>
              <Waveform active color={langData.color} />
            </div>
          )}
        </div>
        <style>{`@keyframes micRipple{0%{transform:scale(1);opacity:1}100%{transform:scale(1.6);opacity:0}}`}</style>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 20px', display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 64px)' }}>

      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>
          <span className="gradient-text">Conversation</span> Mode
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Two people, two languages - speak naturally
        </p>
      </div>

      <div className="glass" style={{ borderRadius: 16, padding: 20, marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Person A speaks</div>
          <LanguageSelector value={langA} onChange={setLangA} />
        </div>
        <div style={{ fontSize: 24, color: 'var(--text-muted)' }}>vs</div>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Person B speaks</div>
          <LanguageSelector value={langB} onChange={setLangB} />
        </div>
      </div>

      {speechError && (
        <div style={{ marginBottom: 12, padding: '10px 16px', background: 'rgba(248,113,113,0.1)', borderRadius: 10, color: '#f87171', fontSize: 13 }}>
          {speechError}
        </div>
      )}

      <div className="glass" style={{
        borderRadius: 16, flex: 1, minHeight: 300, maxHeight: 420,
        overflowY: 'auto', padding: 20, marginBottom: 20,
        display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', margin: 'auto', padding: 40 }}>
            <div style={{ fontSize: 16, marginBottom: 6 }}>Start the conversation</div>
            <div style={{ fontSize: 13 }}>Person A or B taps their mic button below</div>
          </div>
        ) : messages.map((msg) => {
          const fromData = getLanguage(msg.fromLang)
          const toData = getLanguage(msg.toLang)
          const isA = msg.speaker === 'A'
          const accentColor = isA ? langAData.color : langBData.color

          return (
            <div key={msg.id} className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: isA ? 'flex-start' : 'flex-end' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, paddingLeft: isA ? 4 : 0, paddingRight: isA ? 0 : 4 }}>
                {'Person ' + (isA ? 'A' : 'B') + ' · ' + fromData.flag + ' ' + fromData.nativeName + ' · ' + msg.timestamp}
              </div>
              <div style={{
                maxWidth: '85%',
                background: isA ? 'rgba(108,99,255,0.10)' : 'rgba(45,212,191,0.08)',
                border: '1px solid ' + (isA ? 'rgba(108,99,255,0.25)' : 'rgba(45,212,191,0.2)'),
                borderRadius: isA ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                padding: '14px 18px',
              }}>
                <div style={{ fontSize: 16, color: 'var(--text-primary)', marginBottom: 10, lineHeight: 1.5 }}>
                  {msg.originalText}
                </div>
                <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }} />
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ fontSize: 14, flexShrink: 0 }}>{toData.flag}</span>
                  <div style={{ flex: 1 }}>
                    {msg.translating ? (
                      <div style={{ color: 'var(--text-muted)', fontSize: 14, fontStyle: 'italic' }}>
                        Translating to {toData.name}...
                      </div>
                    ) : (
                      <div style={{ fontSize: 15, color: accentColor, lineHeight: 1.5 }}>
                        {msg.translatedText}
                      </div>
                    )}
                  </div>
                  {msg.translatedText && !msg.translating && (
                    <button onClick={() => replayMessage(msg)} style={{
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

        {isListening && interimText && (
          <div style={{
            padding: '10px 16px',
            background: 'rgba(108,99,255,0.05)',
            border: '1px dashed var(--border)',
            borderRadius: 10, color: 'var(--text-muted)',
            fontSize: 14, fontStyle: 'italic',
            alignSelf: activeSpeaker === 'A' ? 'flex-start' : 'flex-end',
            maxWidth: '80%',
          }}>
            {interimText}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {!isSupported ? (
        <div style={{ textAlign: 'center', color: '#f87171', padding: 16, fontSize: 13 }}>
          Voice requires Chrome or Edge on desktop.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'center' }}>
          <MicButton speaker="A" langData={langAData} />
          <button onClick={clearConversation} title="Clear conversation" style={{
            width: 44, height: 44, borderRadius: 22,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            color: 'var(--text-muted)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Trash2 size={16} />
          </button>
          <MicButton speaker="B" langData={langBData} />
        </div>
      )}

      {isSpeaking && (
        <div style={{ textAlign: 'center', marginTop: 16, color: 'var(--accent-secondary)', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Waveform active color="var(--accent-secondary)" />
          Speaking translation...
          <button onClick={stop} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 12 }}>
            Stop
          </button>
        </div>
      )}
    </div>
  )
}
