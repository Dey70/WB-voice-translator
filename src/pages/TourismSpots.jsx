import { useMemo, useState } from 'react'
import { AlertTriangle, Clock3, ExternalLink, IndianRupee, MapPinned, Navigation, Search } from 'lucide-react'
import { TOURISM_DETAIL_TRANSLATIONS, TOURISM_REGIONS, TOURISM_SPOTS } from '../data/tourismSpots'
import { TOURISM_ENGLISH_DESCRIPTIONS, TOURISM_ENGLISH_DETAILS } from '../data/tourismEnglish'

const INFORMATION_LANGUAGES = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'bn', label: 'BN', name: 'বাংলা' },
  { code: 'ne', label: 'NE', name: 'नेपाली' },
  { code: 'hi', label: 'HI', name: 'हिन्दी' },
]

const getDescription = (spot, language) => language === 'en'
  ? TOURISM_ENGLISH_DESCRIPTIONS[spot.id]
  : spot.description[language]

const googleMapsDirectionsUrl = (spot) => {
  const region = TOURISM_REGIONS.find((item) => item.id === spot.region)?.name || spot.region
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${spot.name}, ${region}, India`)}`
}

export default function TourismSpots() {
  const [region, setRegion] = useState('darjeeling')
  const [language, setLanguage] = useState('en')
  const [query, setQuery] = useState('')

  const spots = useMemo(() => {
    const search = query.trim().toLocaleLowerCase()
    return TOURISM_SPOTS.filter((spot) => spot.region === region && (!search
      || spot.name.toLocaleLowerCase().includes(search)
      || spot.type.toLocaleLowerCase().includes(search)
      || getDescription(spot, language).toLocaleLowerCase().includes(search)))
  }, [region, language, query])

  return (
    <main className="tourism-page">
      <header className="tourism-hero">
        <span><MapPinned size={15} /> Curated regional guide</span>
        <h1><span className="gradient-text">Explore</span> Nearby</h1>
        <p>Tourism spots across Darjeeling, the Sundarbans, and Sikkim in your preferred language.</p>
      </header>

      <div className="tourism-unverified">
        <AlertTriangle size={17} />
        <span><strong>Confirm before travelling.</strong> Timings, fees, permits, weather access, and weekly closures can change. Exact current authority rates could not be verified during this update.</span>
      </div>

      <section className="tourism-controls glass">
        <div className="tourism-regions" role="tablist" aria-label="Tourism regions">
          {TOURISM_REGIONS.map((item) => (
            <button key={item.id} role="tab" aria-selected={region === item.id} className={region === item.id ? 'active' : ''} onClick={() => setRegion(item.id)}>{item.name}</button>
          ))}
        </div>
        <div className="tourism-language">
          <span>Information language</span>
          <div className="tourism-language-options">
            {INFORMATION_LANGUAGES.map((item) => (
              <button key={item.code} className={language === item.code ? 'active' : ''} onClick={() => setLanguage(item.code)} aria-pressed={language === item.code}>
                <strong>{item.label}</strong><span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>
        <label className="tourism-search">
          <Search size={16} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search places" aria-label="Search tourism spots" />
        </label>
      </section>

      <div className="tourism-map-privacy">
        <Navigation size={14} /> Directions open in Google Maps. Maps may request your current location; KothaSetu does not collect or store it.
      </div>

      <div className="tourism-count">{spots.length} curated places</div>
      <section className="tourism-grid">
        {spots.map((spot) => {
          const detailKey = spot.detailKey || spot.id
          const details = language === 'en'
            ? (TOURISM_ENGLISH_DETAILS[detailKey] || { timing: spot.timing, fee: spot.fee })
            : TOURISM_DETAIL_TRANSLATIONS[detailKey]
          return (
            <article key={spot.id} className="tourism-card glass">
              <div className="tourism-card-heading">
                <div><span>{spot.type}</span><h2>{spot.name}</h2></div>
                <a className="tourism-map-link" href={googleMapsDirectionsUrl(spot)} target="_blank" rel="noreferrer" aria-label={`Get directions to ${spot.name} in Google Maps`} title={`Get directions to ${spot.name}`}>
                  <MapPinned size={18} /><span>Directions</span><ExternalLink size={12} />
                </a>
              </div>
              <p className="tourism-description">{getDescription(spot, language)}</p>
              <dl>
                <div><dt><Clock3 size={15} /> Timing</dt><dd>{language === 'en' ? details.timing : details.timing[language]}</dd></div>
                <div><dt><IndianRupee size={15} /> Entry / permit</dt><dd>{language === 'en' ? details.fee : details.fee[language]}</dd></div>
              </dl>
              <p className="tourism-advisory"><AlertTriangle size={13} /> {spot.advisory}</p>
            </article>
          )
        })}
      </section>
    </main>
  )
}
