import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Mic, Volume2, VolumeX, Copy, ArrowLeftRight, Loader, CheckCheck, History } from 'lucide-react'
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
  const [mode, setMode] = useState('voice-voice')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState(null)

  const { transcript, interimText, isListening, startListening, stopListening, resetTranscript, isSupported, isIOS, error: speechError } = useSpeechRecognition()
  const { speak, isSpeaking, stop, noVoiceAvailable } = useSpeechSynthesis()
  const { addToHistory } = useAppStore()

  const fromLangData = getLanguage(fromLang)
  const toLangData = getLanguage(toLang)

  useEffect(() => { if (transcript) setInputText(transcript) }, [transcript])

  useEffect(() => {
    if (!inputText.trim()) { setOutputText(''); return }
    const timer = setTimeout(() => handleTranslate(inputText), 900)
    return () => clearTimeout(timer)
  }, [inputText, fromLang, toLang])

  const handleTranslate = async (text) => {
    if (!text.trim()) return
    setIsTranslating(true)
    setError(null)
    try {
      const result = await translateText(text, fromLang, toLang)
      setOutputText(result)
      addToHistory({ fromLang, toLang, originalText: text, translatedText: result, fromLangName: fromLangData.name, toLangName: toLangData.name })
      if (mode === 'voice-voice' || mode === 'text-voice') speak(result, toLang)
    } catch (err) {
      setError('Translation failed. Check your internet connection.')
    } finally {
      setIsTranslating(false)
    }
  }

  const handleMicClick = () => {
    if (isListening) { stopListening() }
    else { resetTranscript(); setInputText(''); setOutputText(''); startListening(fromLang) }
  }

  const handleSwap = () => {
    const pf = fromLang, pt = toLang
    setFromLang(pt); setToLang(pf)
    setInputText(outputText); setOutputText('')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px' }}>

      <div className="translator-heading">
        <h1 style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 700, marginBottom: 6 }}>
          <span className="gradient-text">Voice & Text</span> Translator
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(13px, 2vw, 16px)' }}>
          Speak or type in Bengali, Nepali, or Hindi
        </p>
        <Link to="/history" className="translator-history-link">
          <History size={16} /> Translation history
        </Link>
      </div>

      <div className="mode-buttons" style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { id: 'voice-voice', label: 'Voice → Voice' },
          { id: 'text-text',   label: 'Text → Text'   },
          { id: 'voice-text',  label: 'Voice → Text'  },
          { id: 'text-voice',  label: 'Text → Speak'  },
        ].map((m) => (
          <button key={m.id} onClick={() => setMode(m.id)} style={{
            padding: '7px 16px', borderRadius: 999,
            border: mode === m.id ? '2px solid var(--accent-primary)' : '1px solid var(--border)',
            background: mode === m.id
              ? 'linear-gradient(135deg,rgba(200,86,10,0.18),rgba(232,135,42,0.12))'
              : 'var(--bg-card)',
            color: mode === m.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
            cursor: 'pointer', fontSize: 12, fontWeight: mode === m.id ? 700 : 400,
            transition: 'all 0.2s',
            boxShadow: mode === m.id ? '0 2px 10px rgba(200,86,10,0.2)' : 'none',
          }}>
            {m.label}
          </button>
        ))}
      </div>

      <div className="lang-selector-row" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>From</div>
          <LanguageSelector value={fromLang} onChange={(v) => { setFromLang(v); if (v === toLang) setToLang(fromLang) }} />
        </div>
        <button className="swap-btn" onClick={handleSwap} title="Swap languages" style={{
          marginTop: 20, width: 42, height: 42, borderRadius: 21,
          background: 'linear-gradient(135deg,#C8560A,#E8872A)',
          border: 'none',
          color: 'white', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, transition: 'all 0.25s cubic-bezier(.34,1.56,.64,1)',
          boxShadow: '0 3px 12px rgba(200,86,10,0.4)',
        }}
          onMouseEnter={e => e.currentTarget.style.transform = 'rotate(180deg) scale(1.1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'rotate(0deg) scale(1)'}
        >
          <ArrowLeftRight size={16} />
        </button>
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>To</div>
          <LanguageSelector value={toLang} onChange={(v) => { setToLang(v); if (v === fromLang) setFromLang(toLang) }} exclude={fromLang} />
        </div>
      </div>

      <div className="translation-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
        <div className="glass" style={{ borderRadius: 14, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 26, height: 26, borderRadius: 7,
                background: fromLangData.color + '25',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700, color: fromLangData.color,
              }}>{fromLangData.label || fromLang.toUpperCase()}</div>
              <span style={{ fontWeight: 600, color: fromLangData.color, fontSize: 14 }}>{fromLangData.nativeName}</span>
            </div>
            {isListening && <Waveform active={true} color={fromLangData.color} />}
          </div>

          <textarea
            value={isListening && interimText && !inputText ? interimText : inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={"Type or speak in " + fromLangData.name + "..."}
            style={{
              width: '100%', minHeight: 'clamp(120px, 20vw, 160px)',
              background: 'transparent', border: 'none', outline: 'none',
              resize: 'vertical', color: isListening && interimText && !inputText ? 'var(--text-muted)' : 'var(--text-primary)',
              fontSize: 'clamp(15px, 2vw, 18px)', lineHeight: 1.6, fontFamily: 'inherit',
            }}
          />

          {speechError && (
            <div style={{ marginTop: 8, padding: '8px 12px', background: 'rgba(248,113,113,0.1)', borderRadius: 8, color: '#f87171', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <span>{speechError}</span>
              <button onClick={handleMicClick} style={{
                background: 'rgba(248,113,113,0.2)', border: '1px solid rgba(248,113,113,0.4)',
                borderRadius: 6, color: '#f87171', cursor: 'pointer', fontSize: 12,
                padding: '4px 10px', flexShrink: 0, fontWeight: 600,
              }}>Try again</button>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {isListening ? 'Listening...' : inputText.length + ' chars'}
            </span>
            <button onClick={() => { setInputText(''); setOutputText('') }} style={{
              background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 12,
            }}>Clear</button>
          </div>
        </div>

        <div className="glass" style={{ borderRadius: 14, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 26, height: 26, borderRadius: 7,
                background: toLangData.color + '25',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700, color: toLangData.color,
              }}>{toLangData.label || toLang.toUpperCase()}</div>
              <span style={{ fontWeight: 600, color: toLangData.color, fontSize: 14 }}>{toLangData.nativeName}</span>
            </div>
            {isTranslating && <Loader size={14} style={{ color: 'var(--accent-primary)' }} />}
          </div>

          <div style={{
            minHeight: 'clamp(120px, 20vw, 160px)',
            fontSize: 'clamp(15px, 2vw, 18px)', lineHeight: 1.6,
            color: outputText ? 'var(--text-primary)' : 'var(--text-muted)',
            fontStyle: outputText ? 'normal' : 'italic',
          }}>
            {outputText || (isTranslating ? 'Translating...' : 'Translation will appear here')}
          </div>

          {error && (
            <div style={{ marginTop: 8, padding: '8px 12px', background: 'rgba(248,113,113,0.1)', borderRadius: 8, color: '#f87171', fontSize: 12 }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 6, marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
            <button onClick={handleCopy} disabled={!outputText} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '6px 13px', borderRadius: 8,
              background: copied
                ? 'linear-gradient(135deg,rgba(45,106,79,0.18),rgba(45,106,79,0.08))'
                : 'var(--bg-secondary)',
              border: `1px solid ${copied ? '#2D6A4F' : 'var(--border)'}`,
              color: copied ? '#2D6A4F' : 'var(--text-secondary)',
              cursor: outputText ? 'pointer' : 'not-allowed', fontSize: 12, fontWeight: copied ? 600 : 400,
              transition: 'all 0.2s',
            }}>
              {copied ? <CheckCheck size={13} /> : <Copy size={13} />}
              {copied ? '✓ Copied' : 'Copy'}
            </button>
            <button onClick={() => isSpeaking ? stop() : speak(outputText, toLang)} disabled={!outputText} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '6px 13px', borderRadius: 8,
              background: isSpeaking
                ? 'linear-gradient(135deg,rgba(200,86,10,0.2),rgba(232,135,42,0.1))'
                : 'var(--bg-secondary)',
              border: `1px solid ${isSpeaking ? 'var(--accent-primary)' : 'var(--border)'}`,
              color: isSpeaking ? 'var(--accent-primary)' : 'var(--text-secondary)',
              cursor: outputText ? 'pointer' : 'not-allowed', fontSize: 12, fontWeight: isSpeaking ? 600 : 400,
              transition: 'all 0.2s',
            }}>
              {isSpeaking ? <VolumeX size={13} /> : <Volume2 size={13} />}
              {isSpeaking ? 'Stop' : 'Speak'}
            </button>
            {isSpeaking && <Waveform active={true} color={toLangData.color} />}
          </div>

        </div>
      </div>

      {(mode === 'voice-voice' || mode === 'voice-text') && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          {!isSupported && (
            <div style={{ color: '#f87171', fontSize: 13, textAlign: 'center', padding: '12px 16px', background: 'rgba(248,113,113,0.08)', borderRadius: 10, border: '1px solid rgba(248,113,113,0.2)', maxWidth: 340 }}>
              Voice input requires Chrome or Edge browser on desktop.
            </div>
          )}
          {isSupported && isIOS && (
            <div style={{ color: '#fbbf24', fontSize: 12, textAlign: 'center', padding: '8px 14px', background: 'rgba(251,191,36,0.08)', borderRadius: 8, border: '1px solid rgba(251,191,36,0.2)', maxWidth: 340 }}>
              Voice on iPhone may be limited. If it fails, please type in the box above.
            </div>
          )}
          {/* Indian-touch mic button */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

            {/* Rangoli petal ring — 8 petals, visible only when idle */}
            {!isListening && isSupported && (
              <svg width="160" height="160" viewBox="0 0 160 160"
                style={{ position: 'absolute', pointerEvents: 'none', opacity: 0.55 }}
                aria-hidden="true">
                {[0,45,90,135,180,225,270,315].map((deg, i) => (
                  <ellipse key={i}
                    cx="80" cy="80" rx="9" ry="22"
                    fill="none"
                    stroke={i % 2 === 0 ? '#C8560A' : '#C8960C'}
                    strokeWidth="1.5"
                    transform={`rotate(${deg} 80 80) translate(0 -38)`}
                  />
                ))}
                <circle cx="80" cy="80" r="42" fill="none" stroke="#E8D5B7" strokeWidth="1" strokeDasharray="4 5"/>
              </svg>
            )}

            {/* Listening state: animated concentric ripple rings */}
            {isListening && (
              <>
                {[1,2,3].map(n => (
                  <span key={n} style={{
                    position: 'absolute',
                    width: 72 + n * 28, height: 72 + n * 28,
                    borderRadius: '50%',
                    border: `${4 - n}px solid rgba(192,57,43,${0.28 - n * 0.07})`,
                    animation: `micRipple ${0.9 + n * 0.3}s ease-out infinite`,
                    animationDelay: `${n * 0.2}s`,
                    pointerEvents: 'none',
                  }}/>
                ))}
              </>
            )}

            {/* Main button — lotus-shaped border via clip-path */}
            <button
              onClick={handleMicClick}
              disabled={!isSupported}
              style={{
                position: 'relative', zIndex: 1,
                width: 80, height: 80,
                borderRadius: '50%',
                background: isListening
                  ? 'linear-gradient(135deg, #C0392B, #E8872A)'
                  : 'linear-gradient(145deg, #C8560A 0%, #E8872A 55%, #C8960C 100%)',
                border: isListening ? '3px solid rgba(192,57,43,0.4)' : '3px solid rgba(200,150,12,0.5)',
                cursor: isSupported ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', gap: 2,
                transition: 'all 0.3s cubic-bezier(.34,1.56,.64,1)',
                boxShadow: isListening
                  ? '0 0 0 4px rgba(192,57,43,0.2), 0 8px 32px rgba(192,57,43,0.45)'
                  : '0 0 0 4px rgba(200,150,12,0.15), 0 8px 28px rgba(200,86,10,0.4)',
                transform: isListening ? 'scale(1.08)' : 'scale(1)',
              }}
            >
              <Mic size={26} color="white" strokeWidth={2} />
              {/* Small decorative dot row beneath mic icon */}
              <div style={{ display: 'flex', gap: 3, marginTop: 1 }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.55)' }}/>
                ))}
              </div>
            </button>

            {/* Bottom bindi dot */}
            <div style={{
              position: 'absolute', bottom: -14, left: '50%', transform: 'translateX(-50%)',
              width: 8, height: 8, borderRadius: '50%',
              background: isListening ? '#C0392B' : '#C8960C',
              boxShadow: `0 0 8px ${isListening ? 'rgba(192,57,43,0.7)' : 'rgba(200,150,12,0.7)'}`,
              transition: 'all 0.3s',
            }}/>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: 13, textAlign: 'center', marginTop: 20, fontFamily: "'Hind', sans-serif" }}>
            {isListening
              ? 'Listening in ' + fromLangData.name + '... tap to stop'
              : 'Tap to speak in ' + fromLangData.name}
          </p>

          <style>{`
            @keyframes micRipple {
              0%   { transform: scale(1);    opacity: 1; }
              100% { transform: scale(1.55); opacity: 0; }
            }
          `}</style>
          {isListening && interimText && (
            <div style={{
              padding: '10px 18px', background: 'var(--bg-card)',
              borderRadius: 10, border: '1px solid var(--border)',
              color: 'var(--text-muted)', fontSize: 14,
              maxWidth: '90%', textAlign: 'center',
            }}>
              {interimText}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

