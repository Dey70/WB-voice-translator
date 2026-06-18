import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AlertTriangle, Clock3, ExternalLink, IndianRupee, MapPinned, Navigation, Search } from 'lucide-react'
import { TOURISM_DETAIL_TRANSLATIONS, TOURISM_REGIONS, TOURISM_SPOTS } from '../data/tourismSpots'
import { TOURISM_ENGLISH_DESCRIPTIONS, TOURISM_ENGLISH_DETAILS } from '../data/tourismEnglish'
import { HIDDEN_TOURISM_SPOTS } from '../data/hiddenTourismSpots'
import { REGIONAL_EXPANSION_SPOTS } from '../data/regionalExpansionSpots'
import { CATEGORY_NAMES, getPlaceCategory, REGION_NAMES, TOURISM_LOCALE } from '../data/tourismLocale'
import { getTourismPlaceName } from '../data/tourismPlaceNames'
import PlacesSubnav from '../components/places/PlacesSubnav'

const ALL_TOURISM_SPOTS = [...TOURISM_SPOTS, ...HIDDEN_TOURISM_SPOTS, ...REGIONAL_EXPANSION_SPOTS]
const INFORMATION_LANGUAGES = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'bn', label: 'BN', name: 'বাংলা' },
  { code: 'ne', label: 'NE', name: 'नेपाली' },
  { code: 'hi', label: 'HI', name: 'हिन्दी' },
]

const getDescription = (spot, language) => language === 'en'
  ? (spot.description.en || TOURISM_ENGLISH_DESCRIPTIONS[spot.id])
  : spot.description[language]

const googleMapsDirectionsUrl = (spot) => {
  const region = TOURISM_REGIONS.find((item) => item.id === spot.region)?.name || spot.region
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${spot.name}, ${spot.locality || region}, India`)}`
}

export default function TourismSpots() {
  const [searchParams] = useSearchParams()
  const [region, setRegion] = useState(() => {
    const requested = searchParams.get('region')
    return TOURISM_REGIONS.some((item) => item.id === requested) ? requested : 'darjeeling'
  })
  const [language, setLanguage] = useState('en')
  const [query, setQuery] = useState('')
  const [discovery, setDiscovery] = useState('all')
  const [access, setAccess] = useState('all')
  const [category, setCategory] = useState('all')
  const copy = TOURISM_LOCALE[language]
  const regionName = REGION_NAMES[region][language]

  const availableCategories = useMemo(() => [...new Set(
    ALL_TOURISM_SPOTS
      .filter((spot) => (spot.regions || [spot.region]).includes(region))
      .map((spot) => getPlaceCategory(spot.type)),
  )], [region])

  const spots = useMemo(() => {
    const search = query.trim().toLocaleLowerCase()
    return ALL_TOURISM_SPOTS.filter((spot) => (spot.regions || [spot.region]).includes(region)
      && (discovery === 'all' || (discovery === 'hidden' ? spot.isHidden : !spot.isHidden))
      && (access === 'all' || (access === 'local' ? !spot.access || spot.access === 'local' : spot.access === access))
      && (category === 'all' || getPlaceCategory(spot.type) === category)
      && (!search
        || spot.name.toLocaleLowerCase().includes(search)
        || getTourismPlaceName(spot, language).toLocaleLowerCase().includes(search)
        || spot.type.toLocaleLowerCase().includes(search)
        || getDescription(spot, language).toLocaleLowerCase().includes(search)))
  }, [region, language, query, discovery, access, category])

  return (
    <main className="tourism-page">
      <PlacesSubnav language={language} />
      <header className="tourism-hero">
        <span><MapPinned size={15} /> {copy.eyebrow}</span>
        <h1><span className="gradient-text">{copy.titleLead}</span> {copy.titleTail}</h1>
        <p>{copy.subtitle}</p>
      </header>

      <div className="tourism-unverified">
        <AlertTriangle size={17} />
        <span><strong>{copy.warningTitle}</strong> {copy.warning}</span>
      </div>

      <section className="tourism-controls glass">
        <div className="tourism-language">
          <span>{copy.language}</span>
          <div className="tourism-language-options">
            {INFORMATION_LANGUAGES.map((item) => (
              <button key={item.code} className={language === item.code ? 'active' : ''} onClick={() => setLanguage(item.code)} aria-pressed={language === item.code}>
                <strong>{item.label}</strong><span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="tourism-select-grid">
          <label><span>{copy.destination}</span><select value={region} onChange={(event) => { setRegion(event.target.value); setCategory('all') }}>
            {TOURISM_REGIONS.map((item) => <option key={item.id} value={item.id}>{REGION_NAMES[item.id][language]}</option>)}
          </select></label>
          <label><span>{copy.distance}</span><select value={access} onChange={(event) => setAccess(event.target.value)}>
            <option value="all">{copy.anyDistance}</option><option value="local">{copy.inTown}</option><option value="drive">{copy.nearbyDrive}</option><option value="restricted">{copy.planAhead}</option>
          </select></label>
          <label><span>{copy.discovery}</span><select value={discovery} onChange={(event) => setDiscovery(event.target.value)}>
            <option value="all">{copy.allPlaces}</option><option value="popular">{copy.popular}</option><option value="hidden">{copy.hidden}</option>
          </select></label>
          <label><span>{copy.category}</span><select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="all">{copy.allCategories}</option>{availableCategories.map((item) => <option key={item} value={item}>{CATEGORY_NAMES[item][language]}</option>)}
          </select></label>
        </div>

        <label className="tourism-search">
          <Search size={16} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.search} aria-label={copy.search} />
        </label>
      </section>

      <div className="tourism-map-privacy"><Navigation size={14} /> {copy.mapPrivacy}</div>
      <div className="tourism-count">{copy.results(spots.length, regionName)}</div>

      <section className="tourism-grid">
        {spots.map((spot) => {
          const detailKey = spot.detailKey || spot.id
          const details = language === 'en'
            ? (TOURISM_ENGLISH_DETAILS[detailKey] || { timing: spot.timing, fee: spot.fee })
            : TOURISM_DETAIL_TRANSLATIONS[detailKey]
          const categoryName = CATEGORY_NAMES[getPlaceCategory(spot.type)][language]
          const placeName = getTourismPlaceName(spot, language)
          const accessName = spot.access === 'drive' ? copy.nearbyDrive : spot.access === 'restricted' ? copy.planAhead : copy.inTown
          const caution = spot.access === 'drive' ? copy.cautionDrive : spot.access === 'restricted' ? copy.cautionRestricted : copy.cautionLocal
          return (
            <article key={spot.id} className="tourism-card glass">
              <div className="tourism-card-heading">
                <div>
                  <span>{categoryName}</span>
                  {spot.isHidden && <span className="hidden-gem-badge">{copy.hiddenBadge}</span>}
                  <h2>{placeName}</h2>
                  <div className="tourism-locality">{language === 'en' ? (spot.locality || regionName) : regionName} · {accessName}</div>
                </div>
                <a className="tourism-map-link" href={googleMapsDirectionsUrl(spot)} target="_blank" rel="noreferrer" aria-label={`${copy.directions}: ${placeName}`} title={`${copy.directions}: ${placeName}`}>
                  <MapPinned size={18} /><span>{copy.directions}</span><ExternalLink size={12} />
                </a>
              </div>
              <p className="tourism-description">{getDescription(spot, language)}</p>
              <dl>
                <div><dt><Clock3 size={15} /> {copy.timing}</dt><dd>{language === 'en' ? details.timing : details.timing[language]}</dd></div>
                <div><dt><IndianRupee size={15} /> {copy.entry}</dt><dd>{language === 'en' ? details.fee : details.fee[language]}</dd></div>
              </dl>
              <p className="tourism-advisory"><AlertTriangle size={13} /> {caution}</p>
            </article>
          )
        })}
      </section>
      {spots.length === 0 && <div className="tourism-empty">{copy.noResults}</div>}
    </main>
  )
}
