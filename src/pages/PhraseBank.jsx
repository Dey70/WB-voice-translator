import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeftRight, BedDouble, CircleHelp, Landmark, Languages,
  MessageCircle, Search, ShieldAlert, ShoppingBag, TrainFront,
  UtensilsCrossed, Volume2, VolumeX, X,
} from 'lucide-react'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'
import VaultGuideHeader from '../components/layout/VaultGuideHeader'
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

export default function PhraseBank() {
  const [fromLang, setFromLang]         = useState('hi')
  const [toLang, setToLang]             = useState('bn')
  const [openCategory, setOpenCategory] = useState(null)
  const [query, setQuery]               = useState('')
  const [showSearch, setShowSearch]     = useState(false)
  const [activePhrase, setActivePhrase] = useState(null)
  const searchRef                        = useRef(null)
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
      <button
        className={`pb-phrase-card ${playing ? 'playing' : ''}`}
        onClick={() => playPhrase(phrase)}
        aria-label={`${playing ? 'Stop' : 'Speak'} ${phrase.title} in ${to.name}`}
      >
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
        <VaultGuideHeader backTo="/" searchLabel="Search phrases" onSearch={() => { setShowSearch(true); setTimeout(() => searchRef.current?.focus(), 0) }} />

        {/* ── Hero ── */}
        <h1 className="pb-heading">Phrasebook</h1>
        <p className="pb-stats">One tap, any phrase · works offline</p>

        {/* ── Compact language selector ── */}
        <div className="pb-language-row">
          <button className="pb-language-pill" onClick={cycleFrom} aria-label={`From: ${from.name}`}><span>{from.label}</span> {from.name}<small>▾</small></button>
          <button className="pb-language-swap" onClick={swapLanguages} aria-label="Swap languages"><ArrowLeftRight size={17} /></button>
          <button className="pb-language-pill" onClick={cycleTo} aria-label={`To: ${to.name}`}><span>{to.label}</span> {to.name}<small>▾</small></button>
        </div>

        {/* ── Search bar, opened from the header ── */}
        {showSearch && !openCategory && (
          <label className="pb-search pb-main-search">
            <Search size={15} />
            <input ref={searchRef} value={query} onChange={e => setQuery(e.target.value)} placeholder="Search all phrases…" aria-label="Search phrases" />
            {query && <button onClick={() => setQuery('')} aria-label="Clear" className="pb-search-clear">×</button>}
          </label>
        )}

        {!query && <div className="pb-category-grid" role="list" aria-label="Phrase categories">
          {PHRASE_CATEGORIES.filter(item => item.id !== 'emergency').map(item => {
            const Icon = CATEGORY_ICONS[item.id] || Languages
            const count = queryPhrases({ category:item.id, query:'' }).length
            return (
              <button
                key={item.id}
                role="listitem"
                aria-expanded={openCategory === item.id}
                className="pb-category-card"
                onClick={() => toggleCategory(item.id)}
              >
                <span className="pb-category-icon"><Icon size={20} /></span>
                <strong>{item.name}</strong>
                <small>{count} phrases</small>
              </button>
            )
          })}
        </div>}

        {/* ── Emergency quick access ── */}
        {!openCategory && !query && (
          <button className="pb-emergency-row" onClick={() => toggleCategory('emergency')}>
            <span className="pb-emergency-icon"><ShieldAlert size={20} /></span>
            <div><strong>Emergency phrases &amp; helplines</strong><span>Police · Hospital · Tourist assistance</span></div>
          </button>
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
