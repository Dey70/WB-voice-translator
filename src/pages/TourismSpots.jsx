import { useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AlertTriangle, ChevronDown, Clock3, Globe2, IndianRupee, MapPin, Navigation, Search, Tag, X } from 'lucide-react'
import { CATEGORY_NAMES, REGION_NAMES, TOURISM_LOCALE } from '../data/tourismLocale'
import { getAvailableTourismCategories, getTourismRegionOptions, queryTourismSpots, TOURISM_REGION_IDS } from '../data/repositories/tourismRepository'
import { platformServices } from '../services/platform/platformAdapter'
import VaultGuideHeader from '../components/layout/VaultGuideHeader'
import mirkBg from '../assets/mirk.jpg'

const LANGUAGES = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'bn', label: 'বাং', name: 'বাংলা' },
  { code: 'ne', label: 'ने', name: 'नेपाली' },
  { code: 'hi', label: 'हि', name: 'हिन्दी' },
]

const AUDIT_COPY = {
  en: { indicative: 'Indicative', timing: 'Timing', entry: 'Entry / Permit', verify: 'Verify before travel' },
  bn: { indicative: 'আনুমানিক', timing: 'সময়', entry: 'প্রবেশ / অনুমতি', verify: 'ভ্রমণের আগে যাচাই করুন' },
  ne: { indicative: 'अनुमानित', timing: 'समय', entry: 'प्रवेश / अनुमति', verify: 'यात्राअघि जाँच्नुहोस्' },
  hi: { indicative: 'संकेतात्मक', timing: 'समय', entry: 'प्रवेश / अनुमति', verify: 'यात्रा से पहले जाँचें' },
}

const CATEGORY_COLORS = {
  hidden:    { bg: 'rgba(45,212,191,.18)', color: '#5eead4' },
  nature:    { bg: 'rgba(45,212,191,.18)', color: '#2dd4bf' },
  wildlife:  { bg: 'rgba(251,146,60,.18)', color: '#fb923c' },
  heritage:  { bg: 'rgba(167,139,250,.18)', color: '#a78bfa' },
  food:      { bg: 'rgba(251,191,36,.18)', color: '#fbbf24' },
  spiritual: { bg: 'rgba(232,135,42,.18)', color: '#E8872A' },
  adventure: { bg: 'rgba(96,165,250,.18)', color: '#60a5fa' },
  art:       { bg: 'rgba(244,114,182,.18)', color: '#f472b6' },
  default:   { bg: 'rgba(148,163,184,.13)', color: '#94a3b8' },
}

/* ── Bottom Sheet ── */
function Sheet({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <>
      <div className="dv-sheet-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="dv-sheet" role="dialog" aria-modal="true" aria-label={title}>
        <div className="dv-sheet-handle" />
        <div className="dv-sheet-header">
          <span className="dv-sheet-title">{title}</span>
          <button className="dv-sheet-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
        <div className="dv-sheet-body">{children}</div>
      </div>
    </>
  )
}

export default function TourismSpots() {
  const [searchParams] = useSearchParams()
  const [region, setRegion] = useState(() => {
    const r = searchParams.get('region')
    return TOURISM_REGION_IDS.includes(r) ? r : 'darjeeling'
  })
  const [language, setLanguage] = useState('en')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')

  const [locationOpen, setLocationOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [catOpen, setCatOpen] = useState(false)
  const searchRef = useRef(null)

  const copy = TOURISM_LOCALE[language]
  const auditCopy = AUDIT_COPY[language]
  const regionName = REGION_NAMES[region][language]
  const langName = LANGUAGES.find(l => l.code === language)?.label ?? 'EN'
  const catName = category === 'all' ? 'All' : CATEGORY_NAMES[category]?.[language] ?? category
  const catStyle = CATEGORY_COLORS[category] || CATEGORY_COLORS.default

  const regionOptions = useMemo(() => getTourismRegionOptions(language), [language])
  const availableCategories = useMemo(() => ['hidden', ...getAvailableTourismCategories(region)], [region])
  const spots = useMemo(() => queryTourismSpots({
    region,
    language,
    query,
    discovery: category === 'hidden' ? 'hidden' : 'all',
    access: 'all',
    category: category === 'hidden' ? 'all' : category,
  }), [region, language, query, category])

  return (
    <main className="dv-page">

      {/* Full-page background */}
      <div className="pb-bg" aria-hidden="true">
        <img src={mirkBg} alt="" />
        <div className="pb-bg-overlay pb-bg-overlay--overcast" />
      </div>

      <div className="dv-content">
        <VaultGuideHeader backTo="/places" searchLabel="Search places" onSearch={() => { searchRef.current?.scrollIntoView({ behavior:'smooth', block:'center' }); searchRef.current?.focus() }} />

        {/* Hero */}
        <div className="dv-hero">
          <span className="dv-hero-eyebrow">Curated Regional Guide</span>
          <h1 className="dv-hero-title"><em>Destination</em> Vault</h1>
          <p className="dv-hero-sub">{spots.length} places around {regionName}</p>
        </div>

        {/* Filter pill row */}
        <div className="dv-pill-row">
          <button className="dv-pill" onClick={() => setLocationOpen(true)}>
            <MapPin size={13} />
            <span>{regionName}</span>
            <ChevronDown size={12} />
          </button>
          <button className="dv-pill" onClick={() => setLangOpen(true)}>
            <Globe2 size={13} />
            <span>{langName}</span>
            <ChevronDown size={12} />
          </button>
          <button className="dv-pill" onClick={() => setCatOpen(true)}
            style={category !== 'all' ? { borderColor: catStyle.color, background: catStyle.bg, color: catStyle.color } : {}}>
            <Tag size={13} />
            <span>{catName}</span>
            <ChevronDown size={12} />
          </button>
        </div>

        {/* Search */}
        <label className="dv-search">
          <Search size={14} />
          <input ref={searchRef} value={query} onChange={e => setQuery(e.target.value)} placeholder={copy.search} aria-label={copy.search} />
          {query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={13} /></button>}
        </label>

        {/* Result count */}
        <div className="dv-result-row">
          <span>{spots.length} places around {regionName}</span>
          <span className="dv-verify"><AlertTriangle size={11} /> {auditCopy.verify}</span>
        </div>

        {/* Cards */}
        <section className="dv-grid">
          {spots.map(spot => {
            const cs = CATEGORY_COLORS[spot.category] || CATEGORY_COLORS.default
            const accessName = spot.access === 'drive' ? copy.nearbyDrive : spot.access === 'restricted' ? copy.planAhead : copy.inTown
            const caution = spot.access === 'drive' ? copy.cautionDrive : spot.access === 'restricted' ? copy.cautionRestricted : copy.cautionLocal
            return (
              <article key={spot.id} className="dv-card">
                <div className="dv-card-top">
                  <div className="dv-card-badges">
                    <span className="dv-cat-badge" style={{ background: cs.bg, color: cs.color, borderColor: cs.color + '55' }}>
                      {CATEGORY_NAMES[spot.category][language]}
                    </span>
                    {spot.isHidden && <span className="dv-cat-badge dv-hidden-badge">{copy.hiddenBadge}</span>}
                  </div>
                  <span className="dv-access">{accessName}</span>
                </div>
                <h2 className="dv-card-title">{spot.name}</h2>
                {spot.localName && <p className="dv-card-local">{spot.localName} · {regionName}</p>}
                <p className="dv-card-desc">{spot.description}</p>
                <div className="dv-info-rows">
                  <div className="dv-info-row">
                    <Clock3 size={13} />
                    <div>
                      <span className="dv-info-label">{auditCopy.indicative} {auditCopy.timing}</span>
                      <span className="dv-info-val">{spot.timing}</span>
                    </div>
                  </div>
                  <div className="dv-info-row">
                    <IndianRupee size={13} />
                    <div>
                      <span className="dv-info-label">{auditCopy.entry}</span>
                      <span className="dv-info-val">{spot.fee}</span>
                    </div>
                  </div>
                </div>
                <div className="dv-card-footer">
                  <button className="dv-verify-btn" onClick={() => platformServices.links.openExternal(spot.sourceUrl)}>
                    <AlertTriangle size={11} /> {caution.split('.')[0]}
                  </button>
                  <button className="dv-directions-btn" onClick={() => platformServices.links.openMap(spot.mapDestination)}
                    style={{ background: cs.bg, color: cs.color, borderColor: cs.color + '66' }}>
                    <Navigation size={13} /> {copy.directions}
                  </button>
                </div>
              </article>
            )
          })}
          {spots.length === 0 && <div className="dv-empty">{copy.noResults}</div>}
        </section>
      </div>

      {/* ── Bottom Sheets ── */}

      {/* Location */}
      <Sheet open={locationOpen} onClose={() => setLocationOpen(false)} title="Choose Region">
        <div className="dv-sheet-list">
          {regionOptions.map(o => (
            <button key={o.id} className={`dv-sheet-option${region === o.id ? ' active' : ''}`}
              onClick={() => { setRegion(o.id); setCategory('all'); setLocationOpen(false) }}>
              <MapPin size={15} />
              <span>{o.name}</span>
              {region === o.id && <span className="dv-sheet-tick">✓</span>}
            </button>
          ))}
        </div>
      </Sheet>

      {/* Language */}
      <Sheet open={langOpen} onClose={() => setLangOpen(false)} title="Display Language">
        <div className="dv-sheet-list">
          {LANGUAGES.map(l => (
            <button key={l.code} className={`dv-sheet-option${language === l.code ? ' active' : ''}`}
              onClick={() => { setLanguage(l.code); setLangOpen(false) }}>
              <Globe2 size={15} />
              <div>
                <strong>{l.name}</strong>
                <small>{l.label}</small>
              </div>
              {language === l.code && <span className="dv-sheet-tick">✓</span>}
            </button>
          ))}
        </div>
      </Sheet>

      {/* Category */}
      <Sheet open={catOpen} onClose={() => setCatOpen(false)} title="Filter by Category">
        <div className="dv-sheet-cats">
          <button className={`dv-sheet-cat${category === 'all' ? ' active' : ''}`}
            onClick={() => { setCategory('all'); setCatOpen(false) }}>
            <span className="dv-sheet-cat-icon" style={{ background: 'rgba(148,163,184,.15)', color: '#94a3b8' }}>✦</span>
            <span>All places</span>
            {category === 'all' && <span className="dv-sheet-tick">✓</span>}
          </button>
          {availableCategories.map(cat => {
            const cs = CATEGORY_COLORS[cat] || CATEGORY_COLORS.default
            return (
              <button key={cat} className={`dv-sheet-cat${category === cat ? ' active' : ''}`}
                onClick={() => { setCategory(cat); setCatOpen(false) }}>
                <span className="dv-sheet-cat-icon" style={{ background: cs.bg, color: cs.color }}>{CATEGORY_NAMES[cat]['en'][0]}</span>
                <span>{CATEGORY_NAMES[cat][language]}</span>
                {category === cat && <span className="dv-sheet-tick">✓</span>}
              </button>
            )
          })}
        </div>
      </Sheet>
    </main>
  )
}
