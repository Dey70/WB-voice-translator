import { useMemo, useState } from 'react'
import { AlertTriangle, Clock3, IndianRupee, MapPinned, Search } from 'lucide-react'
import LanguageSelector from '../components/translation/LanguageSelector'
import { TOURISM_DETAIL_TRANSLATIONS, TOURISM_REGIONS, TOURISM_SPOTS } from '../data/tourismSpots'

export default function TourismSpots() {
  const [region, setRegion] = useState('darjeeling')
  const [language, setLanguage] = useState('bn')
  const [query, setQuery] = useState('')

  const spots = useMemo(() => {
    const search = query.trim().toLocaleLowerCase()
    return TOURISM_SPOTS.filter((spot) => spot.region === region && (!search
      || spot.name.toLocaleLowerCase().includes(search)
      || spot.type.toLocaleLowerCase().includes(search)
      || spot.description[language].toLocaleLowerCase().includes(search)))
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
          <LanguageSelector value={language} onChange={setLanguage} />
        </div>
        <label className="tourism-search">
          <Search size={16} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search places" aria-label="Search tourism spots" />
        </label>
      </section>

      <div className="tourism-count">{spots.length} curated places</div>
      <section className="tourism-grid">
        {spots.map((spot) => {
          const details = TOURISM_DETAIL_TRANSLATIONS[spot.id]
          return (
            <article key={spot.id} className="tourism-card glass">
              <div className="tourism-card-heading">
                <div><span>{spot.type}</span><h2>{spot.name}</h2></div>
                <MapPinned size={20} />
              </div>
              <p className="tourism-description">{spot.description[language]}</p>
              <dl>
                <div><dt><Clock3 size={15} /> Timing</dt><dd>{details.timing[language]}</dd></div>
                <div><dt><IndianRupee size={15} /> Entry / permit</dt><dd>{details.fee[language]}</dd></div>
              </dl>
              <p className="tourism-advisory"><AlertTriangle size={13} /> {spot.advisory}</p>
            </article>
          )
        })}
      </section>
    </main>
  )
}
