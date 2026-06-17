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
  const [mode, setMode] = useState('voice-voice')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState(null)

  const { transcript, interimText, isListening, startListening, stopListening, resetTranscript, isSupported, error: speechError } = useSpeechRecognition()
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  const { speak, isSpeaking, stop } = useSpeechSynthesis()
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

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <h1 style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 700, marginBottom: 6 }}>
          <span className="gradient-text">Voice & Text</span> Translator
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(13px, 2vw, 16px)' }}>
          Speak or type in Bengali, Nepali, or Hindi
        </p>
      </div>

      {/* Mode selector */}
      <div className="mode-buttons" style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { id: 'voice-voice', label: 'Voice to Voice' },
          { id: 'text-text', label: 'Text to Text' },
          { id: 'voice-text', label: 'Voice to Text' },
          { id: 'text-voice', label: 'Text to Speak' },
        ].map((m) => (
          <button key={m.id} onClick={() => setMode(m.id)} style={{
            padding: '7px 14px', borderRadius: 20,
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

      {/* Language selectors */}
      <div className="lang-selector-row" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>From</div>
          <LanguageSelector value={fromLang} onChange={(v) => { setFromLang(v); if (v === toLang) setToLang(fromLang) }} />
        </div>
        <button className="swap-btn" onClick={handleSwap} style={{
          marginTop: 20, width: 40, height: 40, borderRadius: 20,
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          color: 'var(--text-secondary)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, transition: 'all 0.2s',
        }}>
          <ArrowLeftRight size={16} />
        </button>
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>To</div>
          <LanguageSelector value={toLang} onChange={(v) => { setToLang(v); if (v === fromLang) setFromLang(toLang) }} exclude={fromLang} />
        </div>
      </div>

      {/* Translation panels */}
      <div className="translation-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>

        {/* Input */}
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
              resize: 'vertical', color: 'var(--text-primary)',
              fontSize: 'clamp(15px, 2vw, 18px)', lineHeight: 1.6, fontFamily: 'inherit',
            }}
          />

          {speechError && (
            <div style={{ marginTop: 8, padding: '8px 12px', background: 'rgba(248,113,113,0.1)', borderRadius: 8, color: '#f87171', fontSize: 12 }}>
              {speechError}
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

        {/* Output */}
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
              padding: '6px 11px', borderRadius: 8,
              background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              color: copied ? '#2dd4bf' : 'var(--text-secondary)',
              cursor: outputText ? 'pointer' : 'not-allowed', fontSize: 12,
            }}>
              {copied ? <CheckCheck size={13} /> : <Copy size={13} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button onClick={() => isSpeaking ? stop() : speak(outputText, toLang)} disabled={!outputText} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '6px 11px', borderRadius: 8,
              background: isSpeaking ? 'rgba(108,99,255,0.2)' : 'var(--bg-secondary)',
              border: '1px solid ' + (isSpeaking ? 'var(--accent-primary)' : 'var(--border)'),
              color: isSpeaking ? 'var(--accent-secondary)' : 'var(--text-secondary)',
              cursor: outputText ? 'pointer' : 'not-allowed', fontSize: 12,
            }}>
              {isSpeaking ? <VolumeX size={13} /> : <Volume2 size={13} />}
              {isSpeaking ? 'Stop' : 'Speak'}
            </button>
            {isSpeaking && <Waveform active={true} color={toLangData.color} />}
          </div>
        </div>
      </div>

      {/* Mic button */}
      {(mode === 'voice-voice' || mode === 'voice-text') && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          {(!isSupported || isMobile) && (
            <div style={{ color: '#f87171', fontSize: 13, textAlign: 'center', padding: '12px 16px', background: 'rgba(248,113,113,0.08)', borderRadius: 10, border: '1px solid rgba(248,113,113,0.2)', maxWidth: 340 }}>
              Voice input requires Chrome on desktop. On mobile, please use the text input below.
            </div>
          )}
          <button
            onClick={handleMicClick}
            disabled={!isSupported}
            className={isListening ? 'pulse-record' : ''}
            style={{
              width: 72, height: 72, borderRadius: 36,
              background: isListening
                ? 'linear-gradient(135deg, #f87171, #fb923c)'
                : 'linear-gradient(135deg, #6c63ff, #a78bfa)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.3s',
              boxShadow: isListening ? '0 0 40px rgba(248,113,113,0.4)' : '0 0 30px rgba(108,99,255,0.3)',
            }}
          >
            {isListening ? <MicOff size={28} color="white" /> : <Mic size={28} color="white" />}
          </button>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, textAlign: 'center' }}>
            {isListening
              ? 'Listening in ' + fromLangData.name + '... tap to stop'
              : 'Tap to speak in ' + fromLangData.name}
          </p>
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
