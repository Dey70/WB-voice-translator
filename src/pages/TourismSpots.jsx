import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AlertTriangle, Clock3, ExternalLink, IndianRupee, MapPinned, Navigation, Search } from 'lucide-react'
import { CATEGORY_NAMES, REGION_NAMES, TOURISM_LOCALE } from '../data/tourismLocale'
import PlacesSubnav from '../components/places/PlacesSubnav'
import { CONTENT_AUDIT_DATE_LABEL } from '../data/contentAudit'
import { getAvailableTourismCategories, getTourismRegionOptions, queryTourismSpots, TOURISM_REGION_IDS } from '../data/repositories/tourismRepository'

const INFORMATION_LANGUAGES = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'bn', label: 'BN', name: 'বাংলা' },
  { code: 'ne', label: 'NE', name: 'नेपाली' },
  { code: 'hi', label: 'HI', name: 'हिन्दी' },
]

const AUDIT_COPY = {
  en: { auditLabel:'Internal inventory', sourceCheck:'Live source check required before travel.', indicative:'Indicative', verifySource:'Check official tourism source' },
  bn: { auditLabel:'অভ্যন্তরীণ তালিকা', sourceCheck:'ভ্রমণের আগে সরকারি উৎসে বর্তমান তথ্য যাচাই করুন।', indicative:'আনুমানিক', verifySource:'সরকারি পর্যটন উৎস যাচাই করুন' },
  ne: { auditLabel:'आन्तरिक सूची', sourceCheck:'यात्राअघि आधिकारिक स्रोतमा हालको जानकारी जाँच्नुहोस्।', indicative:'अनुमानित', verifySource:'आधिकारिक पर्यटन स्रोत जाँच्नुहोस्' },
  hi: { auditLabel:'आंतरिक सूची', sourceCheck:'यात्रा से पहले आधिकारिक स्रोत पर वर्तमान जानकारी जाँचें।', indicative:'संकेतात्मक', verifySource:'आधिकारिक पर्यटन स्रोत जाँचें' },
}

export default function TourismSpots() {
  const [searchParams] = useSearchParams()
  const [region, setRegion] = useState(() => {
    const requested = searchParams.get('region')
    return TOURISM_REGION_IDS.includes(requested) ? requested : 'darjeeling'
  })
  const [language, setLanguage] = useState('en')
  const [query, setQuery] = useState('')
  const [discovery, setDiscovery] = useState('all')
  const [access, setAccess] = useState('all')
  const [category, setCategory] = useState('all')
  const copy = TOURISM_LOCALE[language]
  const auditCopy = AUDIT_COPY[language]
  const regionName = REGION_NAMES[region][language]

  const regionOptions = useMemo(() => getTourismRegionOptions(language), [language])
  const availableCategories = useMemo(() => getAvailableTourismCategories(region), [region])

  const spots = useMemo(() => {
    return queryTourismSpots({ region, language, query, discovery, access, category })
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
        <span><strong>{copy.warningTitle}</strong> {copy.warning} <small>{auditCopy.auditLabel}: {CONTENT_AUDIT_DATE_LABEL}. {auditCopy.sourceCheck}</small></span>
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
            {regionOptions.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
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
          const categoryName = CATEGORY_NAMES[spot.category][language]
          const placeName = spot.name
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
                <a className="tourism-map-link" href={spot.mapsUrl} target="_blank" rel="noreferrer" aria-label={`${copy.directions}: ${placeName}`} title={`${copy.directions}: ${placeName}`}>
                  <MapPinned size={18} /><span>{copy.directions}</span><ExternalLink size={12} />
                </a>
              </div>
              <p className="tourism-description">{spot.description}</p>
              <dl>
                <div><dt><Clock3 size={15} /> {auditCopy.indicative} {copy.timing}</dt><dd>{spot.timing}</dd></div>
                <div><dt><IndianRupee size={15} /> {auditCopy.indicative} {copy.entry}</dt><dd>{spot.fee}</dd></div>
              </dl>
              <p className="tourism-advisory"><AlertTriangle size={13} /> {caution}</p>
              <a className="content-source-link" href={spot.sourceUrl} target="_blank" rel="noreferrer">{auditCopy.verifySource} <ExternalLink size={11}/></a>
            </article>
          )
        })}
      </section>
      {spots.length === 0 && <div className="tourism-empty">{copy.noResults}</div>}
    </main>
  )
}
