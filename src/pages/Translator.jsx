import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeftRight, CheckCheck, Copy, History, Keyboard,
  Loader, MessageSquare, Mic, RotateCcw, Volume2, VolumeX,
} from 'lucide-react'
import ConversationMode from '../components/translation/ConversationMode'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'
import { translateText } from '../services/translation'
import { useAppStore } from '../store/appStore'
import { getLanguage, LANGUAGES } from '../utils/constants'
import { platformServices } from '../services/platform/platformAdapter'
import kolkataImg from '../assets/kolkata-heritage.jpg'

/* Native letter for each language circle */
const CIRCLE_SCRIPT = { bn: 'ব', hi: 'ह', ne: 'न', en: 'EN' }

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

function AlpanaBar() {
  return (
    <svg className="bh-alpana" viewBox="0 0 240 18" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="9" x2="88" y2="9" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.5" />
      <circle cx="96"  cy="9" r="2"   fill="currentColor" fillOpacity="0.7" />
      <circle cx="108" cy="9" r="4"   fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.7" />
      <circle cx="108" cy="9" r="1.5" fill="currentColor" fillOpacity="0.8" />
      <polygon points="120,4 123,9 120,14 117,9" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.8" />
      <circle cx="132" cy="9" r="4"   fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.7" />
      <circle cx="132" cy="9" r="1.5" fill="currentColor" fillOpacity="0.8" />
      <circle cx="144" cy="9" r="2"   fill="currentColor" fillOpacity="0.7" />
      <line x1="152" y1="9" x2="240" y2="9" stroke="currentColor" strokeOpacity="0.5" strokeWidth="0.8" />
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

/* Alpana wavy decoration for mic panel top */
function AlpanaWave() {
  return (
    <svg className="tr-alpana-wave" viewBox="0 0 280 20" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path d="M0,10 Q35,0 70,10 Q105,20 140,10 Q175,0 210,10 Q245,20 280,10"
        fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
      <path d="M0,14 Q35,4 70,14 Q105,24 140,14 Q175,4 210,14 Q245,24 280,14"
        fill="none" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.15" />
    </svg>
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

  const tapCircle = (code) => {
    if (code === fromLang) return
    if (code === toLang) { handleSwap(); return }
    setFromLang(code)
    setOutputText(''); setError(null)
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
        <img src={kolkataImg} alt="" />
        <div className="pb-bg-overlay" />
      </div>

      <div className="tr-content">

        {/* ── Header ── */}
        <div className="bh-header">
          <Link to="/" className="bh-brand-block" style={{ textDecoration: 'none' }}>
            <span className="bh-brand">কথাসেতু</span>
            <AlpanaBar />
          </Link>
          <Link to="/history" className="tr-history-btn" aria-label="History">
            <History size={15} />
            <span>History</span>
          </Link>
        </div>

        {/* ── Hero ── */}
        <h1 className="tr-heading"><em>Voice &amp; text</em> translator</h1>
        <p className="tr-sub">Speak or type in Bengali, Nepali or Hindi.</p>

        {/* ── Language circles ── */}
        <div className="pb-lang-panel tr-lang-panel">
          <div className="pb-lang-circles-row">
            <div className="pb-lang-circle-item">
              <button className="pb-lang-circle is-from" style={{ '--lc': from.color }}
                onClick={cycleFrom} aria-label={`From: ${from.name}`}>
                <div className="pb-lc-inner-ring" aria-hidden="true" />
                <span className="pb-lc-script">{CIRCLE_SCRIPT[fromLang] || from.label}</span>
              </button>
              <span className="pb-lc-name" style={{ color: from.color }}>{from.name}</span>
            </div>

            <button className="pb-lang-swap" onClick={handleSwap} aria-label="Swap languages">
              <ArrowLeftRight size={16} />
            </button>

            <div className="pb-lang-circle-item">
              <button className="pb-lang-circle is-to" style={{ '--lc': to.color }}
                onClick={cycleTo} aria-label={`To: ${to.name}`}>
                <div className="pb-lc-inner-ring" aria-hidden="true" />
                <span className="pb-lc-script">{CIRCLE_SCRIPT[toLang] || to.label}</span>
              </button>
              <span className="pb-lc-name" style={{ color: to.color }}>{to.name}</span>
            </div>
          </div>
          <p className="pb-lang-hint-center">Tap a circle to change language</p>
        </div>

        {/* ── Mode tabs ── */}
        <div className="tr-mode-tabs" role="tablist">
          {[
            { id: 'text',  label: 'Type',  Icon: Keyboard },
            { id: 'voice', label: 'Speak', Icon: Mic },
            { id: 'convo', label: 'Convo', Icon: MessageSquare },
          ].map(({ id, label, Icon }) => (
            <button key={id} role="tab" aria-selected={mode === id}
              className={`tr-mode-tab ${mode === id ? 'active' : ''}`}
              onClick={() => { setMode(id); if (isListening) stopListening() }}>
              <Icon size={13} />{label}
            </button>
          ))}
        </div>

        {mode === 'convo' ? (
          <ConversationMode langA={fromLang} langB={toLang} />
        ) : (<>

          {/* ── Mic panel (voice mode) ── */}
          {mode === 'voice' && (
            <div className="tr-mic-panel">
              <AlpanaWave />

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
              {from.label} <span>{from.nativeName}</span>
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
              {to.label} <span>{to.nativeName}</span>
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
      </div>

      <style>{`
        @keyframes trRipple { 0%{transform:scale(1);opacity:1} 100%{transform:scale(1.6);opacity:0} }
        @keyframes trBarBounce { 0%,100%{height:6px} 50%{height:18px} }
        @keyframes trSpin { to{transform:rotate(360deg)} }
      `}</style>
    </main>
  )
}
