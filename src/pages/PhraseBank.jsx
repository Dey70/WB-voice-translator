import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeftRight, BedDouble, ChevronDown, CircleHelp, Landmark, Languages,
  MessageCircle, Search, ShieldAlert, ShoppingBag, TrainFront,
  UtensilsCrossed, Volume2, VolumeX, WifiOff, X,
} from 'lucide-react'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'
import { getLanguage, LANGUAGES } from '../utils/constants'
import { PHRASE_CATEGORIES, queryPhrases } from '../data/repositories/phraseRepository'
import kolkataImg from '../assets/kolkata-heritage.jpg'

const CATEGORY_ICONS = {
  greetings:   MessageCircle,
  food:        UtensilsCrossed,
  transport:   TrainFront,
  stays:       BedDouble,
  sightseeing: Landmark,
  shopping:    ShoppingBag,
  essentials:  CircleHelp,
  emergency:   ShieldAlert,
}

/* Single native letter inside each language circle */
const CIRCLE_SCRIPT = { bn: 'ব', hi: 'ह', ne: 'न', en: 'EN' }

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

export default function PhraseBank() {
  const [fromLang, setFromLang]         = useState('hi')
  const [toLang, setToLang]             = useState('bn')
  const [openCategory, setOpenCategory] = useState(null)
  const [query, setQuery]               = useState('')
  const [activePhrase, setActivePhrase] = useState(null)
  const { speak, stop, isSpeaking, isPreparing, noVoiceAvailable } = useSpeechSynthesis()

  const from = getLanguage(fromLang)
  const to   = getLanguage(toLang)

  /* Phrases for the open popup (or search across all) */
  const popupPhrases  = useMemo(
    () => openCategory ? queryPhrases({ category: openCategory, query }) : [],
    [openCategory, query]
  )
  const searchResults = useMemo(
    () => query && !openCategory ? queryPhrases({ category: '', query }) : [],
    [query, openCategory]
  )

  const openCategoryData = PHRASE_CATEGORIES.find(c => c.id === openCategory)
  const OpenIcon = openCategoryData ? (CATEGORY_ICONS[openCategoryData.id] || Languages) : null

  useEffect(() => {
    document.body.classList.add('phrases-page-active')
    return () => document.body.classList.remove('phrases-page-active')
  }, [])

  /* Close popup on back gesture / escape */
  useEffect(() => {
    if (!openCategory) return
    const handler = (e) => { if (e.key === 'Escape') setOpenCategory(null) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [openCategory])

  const swapLanguages = () => {
    setFromLang(toLang); setToLang(fromLang)
    setActivePhrase(null); stop()
  }

  const tapCircle = (code) => {
    if (code === fromLang) return
    if (code === toLang) { swapLanguages(); return }
    setFromLang(code)
    setActivePhrase(null); stop()
  }

  const toggleCategory = (id) => {
    setQuery('')
    setOpenCategory(prev => prev === id ? null : id)
    setActivePhrase(null); stop()
  }

  const playPhrase = (phrase) => {
    if ((isSpeaking || isPreparing) && activePhrase === phrase.id) {
      stop(); setActivePhrase(null); return
    }
    setActivePhrase(phrase.id)
    speak(phrase.translations[toLang], toLang)
  }

  const PhraseCard = ({ phrase }) => {
    const playing = (isSpeaking || isPreparing) && activePhrase === phrase.id
    return (
      <button className={`pb-phrase-card ${playing ? 'playing' : ''}`} onClick={() => playPhrase(phrase)}>
        <div className="pb-phrase-top">
          <span className="pb-phrase-title">{phrase.title}</span>
          <span className="pb-phrase-icon" aria-hidden="true">
            {playing ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </span>
        </div>
        <div className="pb-phrase-row">
          <span className="pb-lang-badge" style={{ background: from.color + '22', color: from.color, borderColor: from.color + '55' }}>{from.label}</span>
          <p lang={fromLang}>{phrase.translations[fromLang]}</p>
        </div>
        <div className="pb-phrase-divider" aria-hidden="true" />
        <div className="pb-phrase-row">
          <span className="pb-lang-badge" style={{ background: to.color + '22', color: to.color, borderColor: to.color + '55' }}>{to.label}</span>
          <p lang={toLang}>{phrase.translations[toLang]}</p>
        </div>
      </button>
    )
  }

  return (
    <main className="pb-page">

      <div className="pb-bg" aria-hidden="true">
        <img src={kolkataImg} alt="" />
        <div className="pb-bg-overlay" />
      </div>

      <div className="pb-content">

        {/* ── Header ── */}
        <div className="bh-header">
          <Link to="/" className="bh-brand-block" style={{ textDecoration: 'none' }}>
            <span className="bh-brand">কথাসেতু</span>
            <AlpanaBar />
          </Link>
          <Link to="/discover" className="bh-search-btn" aria-label="Search">
            <Search size={19} />
          </Link>
        </div>

        {/* ── Hero ── */}
        <div className="pb-offline-badge"><WifiOff size={11} /> WORKS OFFLINE</div>
        <h1 className="pb-heading"><em>Tourist</em> phrase bank</h1>
        <p className="pb-stats">400 curated phrases · 4 languages</p>

        {/* ── Language panel — FROM | swap | TO ── */}
        <div className="pb-lang-panel">
          <div className="pb-lang-circles-row">
            {/* FROM circle */}
            <div className="pb-lang-circle-item">
              <button
                className="pb-lang-circle is-from"
                style={{ '--lc': from.color }}
                onClick={cycleFrom}
                aria-label={`Translating from ${from.name} — tap to change`}
              >
                <div className="pb-lc-inner-ring" aria-hidden="true" />
                <span className="pb-lc-script">{CIRCLE_SCRIPT[fromLang] || from.label}</span>
              </button>
              <span className="pb-lc-name" style={{ color: from.color }}>{from.name}</span>
            </div>

            {/* Swap */}
            <button className="pb-lang-swap" onClick={swapLanguages} aria-label="Swap languages">
              <ArrowLeftRight size={16} />
            </button>

            {/* TO circle */}
            <div className="pb-lang-circle-item">
              <button
                className="pb-lang-circle is-to"
                style={{ '--lc': to.color }}
                onClick={cycleTo}
                aria-label={`Translating to ${to.name} — tap to change`}
              >
                <div className="pb-lc-inner-ring" aria-hidden="true" />
                <span className="pb-lc-script">{CIRCLE_SCRIPT[toLang] || to.label}</span>
              </button>
              <span className="pb-lc-name" style={{ color: to.color }}>{to.name}</span>
            </div>
          </div>
          <p className="pb-lang-hint-center">Tap a circle to change language</p>
        </div>

        {/* ── Category guidance ── */}
        <div className="pb-cat-guidance">
          <ChevronDown size={12} />
          <span>Pick a category to explore phrases</span>
        </div>

        <div className="pb-categories" role="list" aria-label="Phrase categories">
          {PHRASE_CATEGORIES.map(item => {
            const Icon = CATEGORY_ICONS[item.id] || Languages
            const isOpen = openCategory === item.id
            return (
              <button
                key={item.id}
                role="listitem"
                aria-expanded={isOpen}
                className={`pb-cat-pill ${isOpen ? 'active' : ''}`}
                onClick={() => toggleCategory(item.id)}
              >
                <Icon size={13} />
                {item.name}
                {isOpen && <X size={10} className="pb-cat-pill-x" />}
              </button>
            )
          })}
        </div>

        {/* ── Search bar (shown when no popup is open) ── */}
        {!openCategory && (
          <>
            <label className="pb-search">
              <Search size={15} />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search across all phrases…"
                aria-label="Search phrases"
              />
              {query && <button onClick={() => setQuery('')} aria-label="Clear" className="pb-search-clear">×</button>}
            </label>
            <button className="pb-emergency-row" onClick={() => toggleCategory('emergency')}>
              <ShieldAlert size={15} />
              <div>
                <strong>Emergency phrases</strong>
                <span>SOS · Police · Medical · Lost &amp; found</span>
              </div>
              <ChevronDown size={13} className="pb-emergency-chevron" />
            </button>
          </>
        )}

        {/* ── Inline search results (no popup open) ── */}
        {searchResults.length > 0 && (
          <section className="pb-phrase-list" aria-live="polite" aria-label="Search results">
            {searchResults.map(phrase => <PhraseCard key={phrase.id} phrase={phrase} />)}
          </section>
        )}
        {query && !openCategory && searchResults.length === 0 && (
          <p className="pb-empty">No phrases match "{query}"</p>
        )}

        {noVoiceAvailable && (
          <p className="pb-voice-warn" role="alert">
            Voice unavailable for {to.name} on this device.
          </p>
        )}

      </div>

      {/* ── Category popup (bottom sheet) ── */}
      {openCategory && openCategoryData && (
        <div className="pb-popup-backdrop" onClick={() => setOpenCategory(null)} aria-modal="true" role="dialog">
          <div className="pb-popup" onClick={e => e.stopPropagation()}>

            {/* Popup header */}
            <div className="pb-popup-handle" aria-hidden="true" />
            <div className="pb-popup-header">
              <div className="pb-popup-title">
                {OpenIcon && <OpenIcon size={16} />}
                <span>{openCategoryData.name}</span>
                <span className="pb-popup-count">{popupPhrases.length}</span>
              </div>
              <button className="pb-popup-close" onClick={() => setOpenCategory(null)} aria-label="Close">
                <X size={16} />
              </button>
            </div>

            {/* Search within popup */}
            <label className="pb-search pb-popup-search">
              <Search size={14} />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={`Search ${openCategoryData.name.toLowerCase()}…`}
                aria-label={`Search ${openCategoryData.name} phrases`}
              />
              {query && <button onClick={() => setQuery('')} aria-label="Clear" className="pb-search-clear">×</button>}
            </label>

            {/* Phrases */}
            <div className="pb-popup-body">
              {popupPhrases.length > 0
                ? popupPhrases.map(phrase => <PhraseCard key={phrase.id} phrase={phrase} />)
                : <p className="pb-empty">No matching phrases.</p>
              }
            </div>

          </div>
        </div>
      )}

    </main>
  )

  /* Cycle helpers — stay within non-conflict options */
  function cycleFrom() {
    const options = LANGUAGES.filter(l => l.code !== toLang)
    const idx = options.findIndex(l => l.code === fromLang)
    setFromLang(options[(idx + 1) % options.length].code)
    setActivePhrase(null); stop()
  }
  function cycleTo() {
    const options = LANGUAGES.filter(l => l.code !== fromLang)
    const idx = options.findIndex(l => l.code === toLang)
    setToLang(options[(idx + 1) % options.length].code)
    setActivePhrase(null); stop()
  }
}
