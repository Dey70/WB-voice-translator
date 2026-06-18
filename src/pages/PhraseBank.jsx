import { useMemo, useState } from 'react'
import { ArrowLeftRight, Search, Volume2, VolumeX, WifiOff } from 'lucide-react'
import LanguageSelector from '../components/translation/LanguageSelector'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'
import { getLanguage } from '../utils/constants'
import { PHRASE_CATEGORIES, TOURIST_PHRASES } from '../data/touristPhrases'

export default function PhraseBank() {
  const [fromLang, setFromLang] = useState('hi')
  const [toLang, setToLang] = useState('bn')
  const [category, setCategory] = useState('greetings')
  const [query, setQuery] = useState('')
  const [activePhrase, setActivePhrase] = useState(null)
  const { speak, stop, isSpeaking } = useSpeechSynthesis()

  const from = getLanguage(fromLang)
  const to = getLanguage(toLang)
  const phrases = useMemo(() => {
    const search = query.trim().toLocaleLowerCase()
    return TOURIST_PHRASES.filter((phrase) => {
      const inCategory = phrase.category === category
      const matchesSearch = !search || [phrase.title, ...Object.values(phrase.translations)]
        .some((text) => text.toLocaleLowerCase().includes(search))
      return inCategory && matchesSearch
    })
  }, [category, query])

  const swapLanguages = () => {
    setFromLang(toLang)
    setToLang(fromLang)
    setActivePhrase(null)
    stop()
  }

  const playPhrase = (phrase) => {
    if (isSpeaking && activePhrase === phrase.id) {
      stop()
      setActivePhrase(null)
      return
    }
    setActivePhrase(phrase.id)
    speak(phrase.translations[toLang], toLang)
  }

  return (
    <main className="phrase-bank-page">
      <header className="phrase-bank-hero">
        <div className="phrase-bank-offline"><WifiOff size={14} /> Works offline</div>
        <h1><span className="gradient-text">Tourist</span> Phrase Bank</h1>
        <p>Tap a phrase to translate it and speak it aloud.</p>
      </header>

      <section className="phrase-bank-controls glass" aria-label="Phrase languages">
        <div className="phrase-language">
          <span>From</span>
          <LanguageSelector value={fromLang} onChange={(value) => {
            setFromLang(value)
            if (value === toLang) setToLang(fromLang)
          }} />
        </div>
        <button className="phrase-swap" onClick={swapLanguages} aria-label="Swap languages">
          <ArrowLeftRight size={17} />
        </button>
        <div className="phrase-language">
          <span>To</span>
          <LanguageSelector value={toLang} onChange={(value) => setToLang(value)} exclude={fromLang} />
        </div>
      </section>

      <div className="phrase-toolbar">
        <div className="phrase-categories" role="tablist" aria-label="Phrase categories">
          {PHRASE_CATEGORIES.map((item) => (
            <button
              key={item.id}
              role="tab"
              aria-selected={category === item.id}
              className={category === item.id ? 'active' : ''}
              onClick={() => setCategory(item.id)}
            >
              {item.name}
            </button>
          ))}
        </div>
        <label className="phrase-search">
          <Search size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search phrases"
            aria-label="Search phrases"
          />
        </label>
      </div>

      <div className="phrase-summary">
        <span>{phrases.length} phrases</span>
        <span>{from.name} to {to.name}</span>
      </div>

      <section className="phrase-grid" aria-live="polite">
        {phrases.map((phrase) => {
          const playing = isSpeaking && activePhrase === phrase.id
          return (
            <button
              key={phrase.id}
              className={`phrase-card glass${playing ? ' playing' : ''}`}
              onClick={() => playPhrase(phrase)}
            >
              <div className="phrase-card-top">
                <span className="phrase-title">{phrase.title}</span>
                <span className="phrase-speak" aria-hidden="true">
                  {playing ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </span>
              </div>
              <div className="phrase-original">
                <span style={{ color: from.color }}>{from.label}</span>
                <p>{phrase.translations[fromLang]}</p>
              </div>
              <div className="phrase-translation">
                <span style={{ color: to.color }}>{to.label}</span>
                <p>{phrase.translations[toLang]}</p>
              </div>
            </button>
          )
        })}
      </section>

      {phrases.length === 0 && (
        <div className="phrase-empty">No matching phrases in this category.</div>
      )}
    </main>
  )
}
