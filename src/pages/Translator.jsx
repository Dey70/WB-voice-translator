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
  const { speak, isSpeaking, stop } = useSpeechSynthesis()
  const { addToHistory } = useAppStore()

  const fromLangData = getLanguage(fromLang)
  const toLangData = getLanguage(toLang)

  useEffect(() => {
    if (transcript) setInputText(transcript)
  }, [transcript])

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
      addToHistory({
        fromLang,
        toLang,
        originalText: text,
        translatedText: result,
        fromLangName: fromLangData.name,
        toLangName: toLangData.name,
      })
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
      startListening(fromLang)
    }
  }

  const handleSwapLanguages = () => {
    const prevFrom = fromLang
    const prevTo = toLang
    setFromLang(prevTo)
    setToLang(prevFrom)
    setInputText(outputText)
    setOutputText('')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const displayInput = inputText || (isListening && interimText ? interimText : '')

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>

      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 8 }}>
          <span className="gradient-text">Voice & Text</span> Translator
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>
          Speak or type in Bengali, Nepali, or Hindi - get instant translation
        </p>
      </div>

      {/* Mode selector */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
        {[
          { id: 'voice-voice', label: 'Voice to Voice' },
          { id: 'text-text', label: 'Text to Text' },
          { id: 'voice-text', label: 'Voice to Text' },
          { id: 'text-voice', label: 'Text to Speak' },
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

      {/* Language selectors */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>From</div>
          <LanguageSelector value={fromLang} onChange={(v) => { setFromLang(v); if (v === toLang) setToLang(fromLang) }} />
        </div>

        <button onClick={handleSwapLanguages} style={{
          marginTop: 24, width: 44, height: 44, borderRadius: 22,
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
            value={isListening && interimText && !inputText ? interimText : inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={"Type or speak in " + fromLangData.name + "..."}
            style={{
              width: '100%', minHeight: 160, background: 'transparent',
              border: 'none', outline: 'none', resize: 'vertical',
              color: isListening && interimText && !inputText ? 'var(--text-muted)' : 'var(--text-primary)',
              fontSize: 18, lineHeight: 1.6, fontFamily: 'inherit',
            }}
          />

          {speechError && (
            <div style={{ marginTop: 8, padding: '8px 12px', background: 'rgba(248,113,113,0.1)', borderRadius: 8, color: '#f87171', fontSize: 13 }}>
              {speechError}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {isListening ? 'Listening...' : inputText.length + ' characters'}
            </span>
            <button onClick={() => { setInputText(''); setOutputText('') }} style={{
              background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 12,
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
            {isTranslating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent-primary)', fontSize: 13 }}>
                <Loader size={14} className="spin" />
                Translating...
              </div>
            )}
          </div>

          <div style={{
            minHeight: 160, fontSize: 18, lineHeight: 1.6,
            color: outputText ? 'var(--text-primary)' : 'var(--text-muted)',
            fontStyle: outputText ? 'normal' : 'italic',
          }}>
            {outputText || (isTranslating ? '' : 'Translation will appear here')}
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
              border: '1px solid ' + (isSpeaking ? 'var(--accent-primary)' : 'var(--border)'),
              color: isSpeaking ? 'var(--accent-secondary)' : 'var(--text-secondary)',
              cursor: outputText ? 'pointer' : 'not-allowed', fontSize: 13,
            }}>
              {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
              {isSpeaking ? 'Stop' : 'Speak'}
            </button>
            {isSpeaking && (
              <div style={{ display: 'flex', alignItems: 'center', marginLeft: 4 }}>
                <Waveform active={true} color={toLangData.color} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mic button */}
      {(mode === 'voice-voice' || mode === 'voice-text') && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          {!isSupported && (
            <div style={{ color: '#f87171', fontSize: 14, textAlign: 'center' }}>
              Please use Chrome browser for voice features
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
              boxShadow: isListening ? '0 0 40px rgba(248,113,113,0.4)' : '0 0 30px rgba(108,99,255,0.3)',
            }}
          >
            {isListening ? <MicOff size={32} color="white" /> : <Mic size={32} color="white" />}
          </button>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            {isListening
              ? 'Listening in ' + fromLangData.name + '... tap to stop'
              : 'Tap to speak in ' + fromLangData.name}
          </p>
          {isListening && interimText && (
            <div style={{
              padding: '10px 20px', background: 'var(--bg-card)',
              borderRadius: 10, border: '1px solid var(--border)',
              color: 'var(--text-muted)', fontSize: 15, maxWidth: 500, textAlign: 'center',
            }}>
              {interimText}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
