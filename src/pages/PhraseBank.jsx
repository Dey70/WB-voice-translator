import { useMemo, useState } from 'react'
import { ArrowLeftRight, LocateFixed, MapPin, Search, Volume2, VolumeX, WifiOff } from 'lucide-react'
import LanguageSelector from '../components/translation/LanguageSelector'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'
import { getLanguage } from '../utils/constants'
import { PHRASE_CATEGORIES, TOURIST_PHRASES } from '../data/touristPhrases'
import { getNearestLocationContext, LOCATION_CONTEXTS } from '../data/locationContexts'

export default function PhraseBank() {
  const [fromLang, setFromLang] = useState('hi')
  const [toLang, setToLang] = useState('bn')
  const [category, setCategory] = useState('greetings')
  const [query, setQuery] = useState('')
  const [activePhrase, setActivePhrase] = useState(null)
  const [locationId, setLocationId] = useState('')
  const [locationStatus, setLocationStatus] = useState('idle')
  const [locationError, setLocationError] = useState('')
  const { speak, stop, isSpeaking } = useSpeechSynthesis()

  const from = getLanguage(fromLang)
  const to = getLanguage(toLang)
  const locationContext = LOCATION_CONTEXTS.find((location) => location.id === locationId)
  const recommendedPhrases = locationContext
    ? locationContext.phraseIds.map((id) => TOURIST_PHRASES.find((phrase) => phrase.id === id)).filter(Boolean)
    : []
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

  const applyLocation = (id) => {
    const location = LOCATION_CONTEXTS.find((item) => item.id === id)
    setLocationId(id)
    setLocationError('')
    if (!location) return
    setToLang(location.primaryLanguage)
    if (fromLang === location.primaryLanguage) setFromLang(location.primaryLanguage === 'hi' ? 'bn' : 'hi')
    setCategory(location.categories[0])
  }

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Location is not supported by this browser. Choose a place manually.')
      return
    }
    setLocationStatus('loading')
    setLocationError('')
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const nearest = getNearestLocationContext(coords.latitude, coords.longitude)
        setLocationStatus('idle')
        if (nearest) applyLocation(nearest.id)
        else setLocationError('You are outside the supported region. Choose the nearest travel hub manually.')
      },
      () => {
        setLocationStatus('idle')
        setLocationError('Location could not be detected. Choose a place manually.')
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    )
  }

  return (
    <main className="phrase-bank-page">
      <header className="phrase-bank-hero">
        <div className="phrase-bank-offline"><WifiOff size={14} /> Works offline</div>
        <h1><span className="gradient-text">Tourist</span> Phrase Bank</h1>
        <p>Tap a phrase to translate it and speak it aloud.</p>
      </header>

      <section className="location-context glass" aria-label="Location context">
        <div className="location-context-heading">
          <div>
            <span className="location-context-eyebrow"><MapPin size={14} /> Location context</span>
            <h2>What area are you visiting?</h2>
          </div>
          <button className="detect-location" onClick={detectLocation} disabled={locationStatus === 'loading'}>
            <LocateFixed size={16} />
            {locationStatus === 'loading' ? 'Finding...' : 'Use my location'}
          </button>
        </div>
        <select value={locationId} onChange={(event) => applyLocation(event.target.value)} aria-label="Choose tourist location">
          <option value="">Choose a travel hub</option>
          {LOCATION_CONTEXTS.map((location) => (
            <option key={location.id} value={location.id}>{location.name} - {location.region}</option>
          ))}
        </select>
        <p className="location-privacy">Location is matched on your device and is not saved.</p>
        {locationError && <div className="location-error">{locationError}</div>}

        {locationContext && (
          <div className="location-result fade-in">
            <div className="location-result-title">
              <div>
                <strong>{locationContext.name}</strong>
                <span>{locationContext.region}</span>
              </div>
              <span className="location-language">Suggested: {getLanguage(locationContext.primaryLanguage).name}</span>
            </div>
            <p>{locationContext.note}</p>
            <div className="location-category-links">
              {locationContext.categories.map((categoryId) => {
                const item = PHRASE_CATEGORIES.find((entry) => entry.id === categoryId)
                return <button key={categoryId} onClick={() => setCategory(categoryId)}>{item?.name}</button>
              })}
            </div>
            <div className="location-quick-phrases">
              {recommendedPhrases.map((phrase) => (
                <button key={phrase.id} onClick={() => playPhrase(phrase)}>
                  <Volume2 size={15} />
                  <span>{phrase.title}</span>
                  <strong>{phrase.translations[toLang]}</strong>
                </button>
              ))}
            </div>
            <small>Travel conditions can change. Confirm current road, weather, permit, and safety information locally.</small>
          </div>
        )}
      </section>

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
