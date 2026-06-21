import { useState, useEffect, useCallback, useRef } from 'react'
import { Trash2, Volume2 } from 'lucide-react'
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition'
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis'
import { translateText } from '../../services/translation'
import { getLanguage } from '../../utils/constants'

/* ── Default languages — Bengali ↔ Hindi ── */
const LANG_A_DEFAULT = 'bn'
const LANG_B_DEFAULT = 'hi'


/* Alpana petal ring drawn in SVG — ethnic mic decoration */
function AlpanaPetals({ color1, color2, size = 120 }) {
  const c = size / 2
  const r = size * 0.28
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
      style={{ position: 'absolute', pointerEvents: 'none', opacity: 0.55 }}
      aria-hidden="true">
      {[0,45,90,135,180,225,270,315].map((deg, i) => (
        <ellipse key={i} cx={c} cy={c} rx={size * 0.055} ry={size * 0.14}
          fill="none"
          stroke={i % 2 === 0 ? color1 : color2}
          strokeWidth="1.4"
          transform={`rotate(${deg} ${c} ${c}) translate(0 ${-r})`} />
      ))}
      <circle cx={c} cy={c} r={r - 2}
        fill="none" stroke={color1} strokeWidth="0.8" strokeDasharray="3 4" strokeOpacity="0.4" />
    </svg>
  )
}

export default function ConversationMode({ langA: langAProp, langB: langBProp }) {
  const langA = langAProp || LANG_A_DEFAULT
  const langB = langBProp || LANG_B_DEFAULT

  const [activeSpeaker, setActiveSpeaker] = useState(null)
  const [messages, setMessages]           = useState([])
  const [isTranslating, setIsTranslating] = useState(false)
  const [speechError, setSpeechError]     = useState(null)
  const messagesEndRef = useRef(null)

  const { isListening, startListening, stopListening, resetTranscript, isSupported } = useSpeechRecognition()
  const { speak, stop } = useSpeechSynthesis()

  const langAData = getLanguage(langA)
  const langBData = getLanguage(langB)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    setMessages([])
    stop()
  }, [langA, langB, stop])

  const processMessage = useCallback(async (text, speaker) => {
    if (!text.trim()) return
    const from = speaker === 'A' ? langA : langB
    const to   = speaker === 'A' ? langB : langA
    const msgId = Date.now()

    setMessages(prev => [...prev, {
      id: msgId, speaker, fromLang: from, toLang: to,
      originalText: text, translatedText: null,
      timestamp: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }),
      translating: true,
    }])
    setIsTranslating(true)
    try {
      const translated = await translateText(text, from, to)
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, translatedText: translated, translating: false } : m))
      setTimeout(() => speak(translated, to), 300)
    } catch {
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, translatedText: 'Translation failed — check internet', translating: false } : m))
    } finally {
      setIsTranslating(false)
    }
  }, [speak, langA, langB])

  /* ── Fix Mic B: pass callback directly to startListening instead of watching transcript state ── */
  const handleSpeak = (speaker) => {
    setSpeechError(null)
    if (isListening || isTranslating) return

    const fromLang = speaker === 'A' ? langA : langB
    setActiveSpeaker(speaker)
    resetTranscript()

    startListening(fromLang, (text) => {
      setActiveSpeaker(null)
      if (text?.trim()) processMessage(text, speaker)
      else setSpeechError('No speech captured. Tap mic and try again.')
    })
  }

  const replayMessage = (msg) => {
    if (msg.translatedText) { stop(); setTimeout(() => speak(msg.translatedText, msg.toLang), 100) }
  }

  const isDisabled = (speaker) => isTranslating || (isListening && activeSpeaker !== speaker)

  /* ── Ethnic mic button — alpana petal ring + solid button ── */
  const MicButton = ({ speaker }) => {
    const langData  = speaker === 'A' ? langAData : langBData
    const isActive  = isListening && activeSpeaker === speaker
    const disabled  = isDisabled(speaker)
    /* A = terracotta, B = deep teal */
    const baseColor = speaker === 'A' ? '#C8560A' : '#0E7C7B'
    const accentCol = speaker === 'A' ? '#C8960C' : '#2D8A70'

    return (
      <div className="cv-mic-wrap">
        <div className="cv-mic-ring-wrap">
          {/* Alpana petals — shown only when idle */}
          {!isActive && !disabled && (
            <AlpanaPetals color1={baseColor} color2={accentCol} size={120} />
          )}

          {/* Ripple rings — shown when listening */}
          {isActive && [1,2,3].map(n => (
            <span key={n} className="cv-ripple" style={{
              width: 68 + n * 26, height: 68 + n * 26,
              borderColor: baseColor,
              animationDelay: `${n * 0.2}s`,
              opacity: 0.4 - n * 0.1,
            }} />
          ))}

          {/* Main button */}
          <button
            className={`cv-mic-btn ${isActive ? 'active' : ''}`}
            style={{
              '--mc': baseColor,
              opacity: disabled ? 0.32 : 1,
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
            onClick={() => isActive ? stopListening() : handleSpeak(speaker)}
            disabled={disabled}
            aria-label={isActive ? 'Stop listening' : `Person ${speaker} — tap to speak`}
          >
            {/* Alpana inner ring */}
            <span className="cv-mic-inner" aria-hidden="true" />
            {/* Mic SVG — hand-drawn ethnic feel */}
            <svg width="26" height="32" viewBox="0 0 26 32" fill="none" aria-hidden="true">
              <rect x="8" y="1" width="10" height="16" rx="5" fill="white" fillOpacity="0.92" />
              <path d="M3 14C3 20.627 8.373 26 13 26C17.627 26 23 20.627 23 14"
                stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" strokeOpacity="0.9" />
              <line x1="13" y1="26" x2="13" y2="31" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.8" />
              <line x1="8" y1="31" x2="18" y2="31" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.8" />
              <circle cx="13" cy="9" r="2" fill={baseColor} />
            </svg>
            {/* Bindi dot at bottom */}
            <span className="cv-mic-bindi" style={{ background: isActive ? '#fff' : accentCol }} />
          </button>
        </div>

        <div className="cv-mic-label">
          <span style={{ color: langData.color }}>{langData.nativeName}</span>
          <span>{isActive ? 'Tap to stop' : `Person ${speaker}`}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="cv-root">

      {/* ── Chat box ── */}
      <div className="tr-card cv-chat-box">
        {messages.length === 0 ? (
          <div className="cv-empty">
            <p>Tap a mic below to begin</p>
          </div>
        ) : (
          messages.map(msg => {
            const fromData  = getLanguage(msg.fromLang)
            const toData    = getLanguage(msg.toLang)
            const isA       = msg.speaker === 'A'
            const mainColor = isA ? langAData.color : langBData.color
            return (
              <div key={msg.id} className={`cv-msg ${isA ? 'msg-a' : 'msg-b'} fade-in`}>
                <span className="cv-msg-meta">
                  {`Person ${msg.speaker} · ${fromData.nativeName} · ${msg.timestamp}`}
                </span>
                <div className="cv-msg-bubble" style={{ borderColor: mainColor + '44' }}>
                  {/* Original */}
                  <p className="cv-msg-original" lang={msg.fromLang}>{msg.originalText}</p>
                  <div className="cv-msg-divider" />
                  {/* Translation */}
                  <div className="cv-msg-translation">
                    <span className="pb-lang-badge" style={{ background: toData.color + '22', color: toData.color, borderColor: toData.color + '55' }}>
                      {toData.label}
                    </span>
                    {msg.translating
                      ? <span className="cv-translating">Translating…</span>
                      : <p className="cv-msg-translated" lang={msg.toLang} style={{ color: mainColor }}>{msg.translatedText}</p>
                    }
                    {msg.translatedText && !msg.translating && (
                      <button className="cv-replay" onClick={() => replayMessage(msg)} aria-label="Replay">
                        <Volume2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}

        {/* Interim transcript bubble */}
        {isListening && activeSpeaker && (
          <div className={`cv-interim ${activeSpeaker === 'A' ? 'msg-a' : 'msg-b'}`}>
            <span className="cv-interim-dots">
              <span /><span /><span />
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Speech error */}
      {speechError && (
        <p className="tr-mic-warn" style={{ textAlign: 'center', marginBottom: 6 }}>{speechError}</p>
      )}

      {!isSupported && (
        <p className="tr-mic-warn" style={{ textAlign: 'center' }}>Voice requires Chrome or Edge on desktop.</p>
      )}

      {/* ── Mic row ── */}
      {isSupported && (
        <div className="cv-mic-row">
          <MicButton speaker="A" />
          <button className="cv-clear" onClick={() => { setMessages([]); stop() }} aria-label="Clear conversation">
            <Trash2 size={15} />
          </button>
          <MicButton speaker="B" />
        </div>
      )}

      <style>{`
        @keyframes cvRipple { 0%{transform:scale(1);opacity:1} 100%{transform:scale(1.7);opacity:0} }
        @keyframes cvDot    { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }
      `}</style>
    </div>
  )
}
