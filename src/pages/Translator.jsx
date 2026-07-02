import { useEffect, useState } from 'react'
import {
  ArrowLeftRight, CheckCheck, Copy,
  Loader, RotateCcw, Volume2, VolumeX,
} from 'lucide-react'
import VaultGuideHeader from '../components/layout/VaultGuideHeader'
import ConversationMode from '../components/translation/ConversationMode'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'
import { translateText } from '../services/translation'
import { useAppStore } from '../store/appStore'
import { getLanguage, LANGUAGES } from '../utils/constants'
import { platformServices } from '../services/platform/platformAdapter'
import trainBg from '../assets/train.jpg'

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

/* Five-bar animated waveform */
function WaveformBars({ active }) {
  return (
    <div className="tr-waveform" aria-hidden="true">
      {[0,1,2,3,4].map(i => (
        <span key={i} className={`tr-bar ${active ? 'active' : ''}`} style={{ animationDelay: `${i * 0.1}s` }} />
      ))}
    </div>
  )
}

export default function Translator() {
  const [fromLang, setFromLang]     = useState('bn')
  const [toLang, setToLang]         = useState('hi')
  const [inputText, setInputText]   = useState('')
  const [outputText, setOutputText] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)
  const [mode, setMode]   = useState('voice')
  const [copied, setCopied] = useState(false)
  const [error, setError]   = useState(null)

  const { interimText, isListening, startListening, stopListening, resetTranscript, isSupported, isIOS, error: speechError } = useSpeechRecognition()
  const { speak, isSpeaking, isPreparing, stop, noVoiceAvailable } = useSpeechSynthesis()
  const { addToHistory } = useAppStore()

  const from = getLanguage(fromLang)
  const to   = getLanguage(toLang)

  useEffect(() => {
    document.body.classList.add('translator-page-active')
    return () => document.body.classList.remove('translator-page-active')
  }, [])

  const handleTranslate = async () => {
    const text = inputText.trim()
    if (!text) return
    setIsTranslating(true); setError(null)
    try {
      const result = await translateText(text, fromLang, toLang)
      setOutputText(result)
      addToHistory({ fromLang, toLang, originalText: text, translatedText: result, fromLangName: from.name, toLangName: to.name })
    } catch (err) {
      setError(err.message || 'Translation failed. Check your connection.')
    } finally {
      setIsTranslating(false)
    }
  }

  const handleMicClick = () => {
    if (isListening) { stopListening() }
    else {
      resetTranscript(); setInputText(''); setOutputText(''); setError(null)
      startListening(fromLang, setInputText)
    }
  }

  const handleSwap = () => {
    const pf = fromLang, pt = toLang, pi = inputText, po = outputText
    setFromLang(pt); setToLang(pf)
    setInputText(po); setOutputText(po ? pi : '')
    setError(null)
  }

  const cycleFrom = () => {
    const opts = LANGUAGES.filter(l => l.code !== toLang)
    const idx = opts.findIndex(l => l.code === fromLang)
    setFromLang(opts[(idx + 1) % opts.length].code)
    setOutputText(''); setError(null)
  }

  const cycleTo = () => {
    const opts = LANGUAGES.filter(l => l.code !== fromLang)
    const idx = opts.findIndex(l => l.code === toLang)
    setToLang(opts[(idx + 1) % opts.length].code)
    setOutputText(''); setError(null)
  }

  const handleCopy = async () => {
    try {
      await platformServices.clipboard.writeText(outputText)
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    } catch {
      setError('Could not copy. Please select the text manually.')
    }
  }

  const clearAll = () => {
    stopListening(); resetTranscript()
    setInputText(''); setOutputText(''); setError(null)
  }

  const canTranslate = inputText.trim() && !isTranslating && !outputText

  return (
    <main className="tr-page">

      {/* Background */}
      <div className="pb-bg" aria-hidden="true">
        <img src={trainBg} alt="" />
        <div className="pb-bg-overlay pb-bg-overlay--overcast" />
      </div>

      <div className="tr-content">

        {/* ── Header ── */}
        <VaultGuideHeader backTo="/" />

        {/* ── Language selector ── */}
        <div className="tr-language-row">
          <button className="tr-language-pill" onClick={cycleFrom} aria-label={`From: ${from.name}`}>
            <span>{from.label}</span> {from.name}<small>▾</small>
          </button>
          <button className="tr-language-swap" onClick={handleSwap} aria-label="Swap languages">
            <ArrowLeftRight size={18} />
          </button>
          <button className="tr-language-pill" onClick={cycleTo} aria-label={`To: ${to.name}`}>
            <span>{to.label}</span> {to.name}<small>▾</small>
          </button>
        </div>

        {mode === 'convo' ? (
          <ConversationMode langA={fromLang} langB={toLang} />
        ) : (<>

          {/* ── Mic panel (voice mode) ── */}
          {mode === 'voice' && (
            <div className="tr-mic-panel">
              {/* Mic ring container */}
              <div className="tr-mic-rings-wrap">
                {/* Ethnic alpana petals — shown when idle */}
                {!isListening && isSupported && (
                  <AlpanaPetals color1="#C8560A" color2="#C8960C" size={140} />
                )}

                {/* Ripple rings when listening */}
                {isListening && [1,2,3].map(n => (
                  <span key={n} className="tr-ripple" style={{
                    width: 76 + n * 28, height: 76 + n * 28,
                    animationDelay: `${n * 0.22}s`,
                    opacity: 0.35 - n * 0.08,
                  }} />
                ))}

                {/* Ethnic mic button */}
                <button className={`cv-mic-btn ${isListening ? 'active' : ''}`}
                  style={{ '--mc': '#C8560A', width: 76, height: 76, opacity: !isSupported ? 0.45 : 1, cursor: !isSupported ? 'not-allowed' : 'pointer' }}
                  onClick={handleMicClick} disabled={!isSupported}
                  aria-label={isListening ? 'Stop listening' : 'Start voice input'}>
                  <span className="cv-mic-inner" aria-hidden="true" />
                  <svg width="26" height="32" viewBox="0 0 26 32" fill="none" aria-hidden="true">
                    <rect x="8" y="1" width="10" height="16" rx="5" fill="white" fillOpacity="0.92" />
                    <path d="M3 14C3 20.627 8.373 26 13 26C17.627 26 23 20.627 23 14"
                      stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" strokeOpacity="0.9" />
                    <line x1="13" y1="26" x2="13" y2="31" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.8" />
                    <line x1="8" y1="31" x2="18" y2="31" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.8" />
                    <circle cx="13" cy="9" r="2" fill="#C8560A" />
                  </svg>
                  <span className="cv-mic-bindi" style={{ background: isListening ? '#fff' : '#C8960C' }} />
                </button>
              </div>

              {/* Waveform bars */}
              <WaveformBars active={isListening} />

              <p className="tr-mic-label">
                {isListening
                  ? `Listening in ${from.name}… tap to stop`
                  : `Tap to speak in ${from.name}`}
              </p>

              {!isSupported && (
                <p className="tr-mic-warn">Voice input requires Chrome or Edge on desktop.</p>
              )}
              {isSupported && isIOS && (
                <p className="tr-mic-warn" style={{ color: 'rgba(251,191,36,.8)' }}>
                  Voice on iPhone may be limited — type if it fails.
                </p>
              )}
              {isListening && interimText && (
                <div className="tr-interim">{interimText}</div>
              )}
            </div>
          )}

          {/* ── Source card ── */}
          <div className="tr-card">
            <div className="tr-card-badge" style={{ background: from.color + '22', color: from.color, borderColor: from.color + '55' }}>
              {mode === 'voice' ? 'You said' : 'Type'} · {from.name}
            </div>
            <textarea
              className="tr-textarea"
              lang={fromLang}
              maxLength={500}
              value={isListening && interimText && !inputText ? interimText : inputText}
              onChange={e => { setInputText(e.target.value); setOutputText(''); setError(null) }}
              placeholder={`Type or speak in ${from.name}…`}
              style={{ color: isListening && interimText && !inputText ? 'rgba(255,255,255,.4)' : undefined }}
            />
            {speechError && (
              <div className="tr-speech-error">
                <span>{speechError}</span>
                <button onClick={handleMicClick}>Try again</button>
              </div>
            )}
            <div className="tr-card-footer">
              <span>{isListening ? 'Listening…' : `${inputText.length} chars`}</span>
              <button onClick={clearAll} disabled={!inputText && !outputText} className="tr-clear-btn">Clear</button>
            </div>
          </div>

          {/* ── Result card ── */}
          <div className={`tr-card tr-result-card ${outputText ? 'has-result' : ''}`}>
            <div className="tr-card-badge" style={{ background: to.color + '22', color: to.color, borderColor: to.color + '55' }}>
              Translated · {to.name}
            </div>
            <div className="tr-result-text" lang={toLang}
              style={{ fontStyle: outputText ? 'normal' : 'italic', color: outputText ? '#F4EDE1' : 'rgba(255,255,255,.35)' }}>
              {outputText || (isTranslating ? 'Translating…' : 'Translation will appear here')}
              {isTranslating && <Loader size={14} className="tr-result-loader" />}
            </div>

            {error && (
              <div className="tr-error" role="alert">
                <span>{error}</span>
                {error.includes('failed') && (
                  <button onClick={handleTranslate} disabled={!inputText.trim() || isTranslating}>
                    <RotateCcw size={12} /> Retry
                  </button>
                )}
              </div>
            )}

            <div className="tr-card-footer tr-result-footer">
              <button className={`tr-action-btn ${copied ? 'success' : ''}`}
                onClick={handleCopy} disabled={!outputText}>
                {copied ? <CheckCheck size={13} /> : <Copy size={13} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button className={`tr-action-btn ${isSpeaking ? 'active' : ''}`}
                onClick={() => (isSpeaking || isPreparing) ? stop() : speak(outputText, toLang)}
                disabled={!outputText}>
                {isSpeaking || isPreparing ? <VolumeX size={13} /> : <Volume2 size={13} />}
                {isPreparing ? 'Preparing…' : isSpeaking ? 'Stop' : 'Speak'}
              </button>
              {noVoiceAvailable && (
                <span className="tr-no-voice">No voice for {to.name}</span>
              )}
            </div>
          </div>

          {/* ── CTA ── */}
          <button className="tr-cta" onClick={handleTranslate}
            disabled={!canTranslate}>
            {isTranslating
              ? <><Loader size={17} className="tr-spinner" /> Translating…</>
              : outputText
              ? <><CheckCheck size={17} /> Translation ready</>
              : `Translate to ${to.name}`}
          </button>

        </>)}

        {/* ── Mode tabs ── */}
        <div className="tr-mode-tabs" role="tablist">
          {[
            { id:'voice', label:'Voice' },
            { id:'text', label:'Text' },
            { id:'convo', label:'Conversation' },
          ].map(({ id, label }) => (
            <button key={id} role="tab" aria-selected={mode === id}
              className={`tr-mode-tab ${mode === id ? 'active' : ''}`}
              onClick={() => { setMode(id); if (isListening) stopListening() }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes trRipple { 0%{transform:scale(1);opacity:1} 100%{transform:scale(1.6);opacity:0} }
        @keyframes trBarBounce { 0%,100%{height:6px} 50%{height:18px} }
        @keyframes trSpin { to{transform:rotate(360deg)} }
      `}</style>
    </main>
  )
}
