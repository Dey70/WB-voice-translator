import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, CalendarDays, CheckCircle2, MapPin, Search, Sparkles } from 'lucide-react'
import { CULTURAL_GUIDE_ITEMS, CULTURE_CATEGORIES, CULTURE_LOCALE, CULTURE_REGIONS } from '../data/culturalGuide'
import { CULTURAL_GUIDE_EXPANSION } from '../data/culturalGuideExpansion'
import { FESTIVAL_TIMINGS, FESTIVAL_TIME_LABELS } from '../data/festivalTimings'
import potteryBg from '../assets/Pottery.jpg'

const ALL_CULTURAL_ITEMS = [...CULTURAL_GUIDE_ITEMS, ...CULTURAL_GUIDE_EXPANSION]

const LANGUAGES = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'bn', label: 'BN', name: 'বাংলা' },
  { code: 'ne', label: 'NE', name: 'नेपाली' },
  { code: 'hi', label: 'HI', name: 'हिन्दी' },
]

const TONE_META = {
  do:    { Icon: CheckCircle2, color: '#2dd4bf', bg: 'rgba(45,212,191,0.15)', border: 'rgba(45,212,191,0.35)', cardBorder: '#2dd4bf' },
  avoid: { Icon: AlertCircle,  color: '#f87171', bg: 'rgba(248,113,113,0.15)', border: 'rgba(248,113,113,0.35)', cardBorder: '#f87171' },
  know:  { Icon: Sparkles,     color: '#a78bfa', bg: 'rgba(167,139,250,0.15)', border: 'rgba(167,139,250,0.35)', cardBorder: '#a78bfa' },
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

function CompassHero() {
  return (
    <svg viewBox="0 0 180 80" aria-hidden="true" style={{ position:'absolute', right:0, top:0, height:'100%', width:'auto', opacity:0.35 }}>
      <circle cx="130" cy="40" r="32" fill="none" stroke="rgba(200,86,10,0.4)" strokeWidth="1.2" />
      <circle cx="130" cy="40" r="20" fill="none" stroke="rgba(200,86,10,0.25)" strokeWidth="0.8" />
      <circle cx="130" cy="40" r="7"  fill="rgba(200,86,10,0.3)" />
      <circle cx="130" cy="40" r="3"  fill="rgba(200,86,10,0.7)" />
      <line x1="130" y1="8"  x2="130" y2="72" stroke="rgba(200,86,10,0.3)" strokeWidth="0.8" />
      <line x1="98"  y1="40" x2="162" y2="40" stroke="rgba(200,86,10,0.3)" strokeWidth="0.8" />
      <circle cx="50" cy="40" r="18" fill="none" stroke="rgba(200,86,10,0.2)" strokeWidth="1" />
      <circle cx="50" cy="40" r="6"  fill="rgba(200,86,10,0.2)" />
      <circle cx="167" cy="15" r="10" fill="none" stroke="rgba(200,86,10,0.15)" strokeWidth="0.8" />
    </svg>
  )
}

export default function CulturalGuide() {
  const [language, setLanguage] = useState('en')
  const [category, setCategory] = useState('customs')
  const [region, setRegion]     = useState('all')
  const [query, setQuery]       = useState('')
  const copy = CULTURE_LOCALE[language]

  useEffect(() => {
    document.body.classList.add('culture-immersive-active')
    return () => document.body.classList.remove('culture-immersive-active')
  }, [])

  const items = useMemo(() => {
    const search = query.trim().toLocaleLowerCase()
    return ALL_CULTURAL_ITEMS.filter(entry =>
      entry.category === category &&
      (region === 'all' || entry.region === 'all' || entry.region === region) &&
      (!search || entry.title[language].toLocaleLowerCase().includes(search) ||
        entry.description[language].toLocaleLowerCase().includes(search))
    )
  }, [language, category, region, query])

  return (
    <main className="cg-page">

      {/* Background */}
      <div className="pb-bg" aria-hidden="true">
        <img src={potteryBg} alt="" />
        <div className="pb-bg-overlay pb-bg-overlay--overcast" />
      </div>

      <div className="cg-content">

        {/* Brand header */}
        <div className="bh-header">
          <Link to="/" className="bh-brand-block" style={{ textDecoration: 'none' }}>
            <span className="bh-brand">কথাসেতু</span>
            <AlpanaBar />
          </Link>
        </div>

        {/* Hero */}
        <div className="cg-hero">
          <CompassHero />
          <div className="cg-eyebrow">{copy.eyebrow.toUpperCase()}</div>
          <h1 className="tr-heading" style={{ marginBottom: 6 }}>
            <em>Cultural</em> guide
          </h1>
          <p className="tr-sub">{copy.subtitle}</p>
        </div>

        {/* Alpana divider */}
        <div style={{ color: '#C8960C', marginBottom: 20 }}><AlpanaBar /></div>

        {/* Controls */}
        <div className="cg-controls">

          {/* Section 1 — Language */}
          <div className="cg-section-label">Language</div>
          <div className="cg-lang-row">
            <div className="cg-lang-select-wrap">
              <select value={language} onChange={e => setLanguage(e.target.value)}
                className="cg-lang-select" aria-label="Select language">
                {LANGUAGES.map(({ code, label, name }) => (
                  <option key={code} value={code}>{label} — {name}</option>
                ))}
              </select>
              <span className="cg-lang-label">
                {LANGUAGES.find(l => l.code === language)?.label}
              </span>
            </div>
            <span className="cg-lang-name">{LANGUAGES.find(l => l.code === language)?.name}</span>
            <span className="cg-lang-hint">Tap to change</span>
          </div>

          <div className="cg-divider" />

          {/* Section 2 — Category */}
          <div className="cg-section-label">Browse by</div>
          <div className="cg-cats">
            {CULTURE_CATEGORIES.map(cat => (
              <button key={cat}
                className={`cg-pill ${category === cat ? 'active-cat' : ''}`}
                onClick={() => setCategory(cat)}>
                {copy[cat]}
              </button>
            ))}
          </div>

          <div className="cg-divider" />

          {/* Section 3 — Search + Region */}
          <div className="cg-section-label">Filter</div>
          <div className="cg-filter-row">
            <div className="cg-search-wrap">
              <Search size={13} style={{ color: 'rgba(255,255,255,.35)', flexShrink: 0 }} />
              <input value={query} onChange={e => setQuery(e.target.value)}
                placeholder={copy.search + '…'} className="cg-search-input" />
            </div>
            <div className="cg-region-wrap">
              <MapPin size={11} style={{ color: 'rgba(255,255,255,.35)', flexShrink: 0 }} />
              <select value={region} onChange={e => setRegion(e.target.value)} className="cg-region-select">
                {CULTURE_REGIONS.map(r => (
                  <option key={r} value={r}>{copy[r]}</option>
                ))}
              </select>
            </div>
          </div>

        </div>

        {/* Count */}
        <div className="cg-count">
          {copy.results(items.length)} · {copy[category]} · {copy[region]}
        </div>

        {/* Cards */}
        {items.length === 0 ? (
          <div className="cg-empty">{copy.empty}</div>
        ) : (
          <div className="cg-cards">
            {items.map(entry => {
              const { Icon, color, bg, border, cardBorder } = TONE_META[entry.tone]
              return (
                <article key={entry.id} className="cg-card" style={{ borderLeftColor: cardBorder }}>
                  <div className="cg-card-top">
                    <span className="cg-tone-badge" style={{ color, background: bg, border: `1px solid ${border}` }}>
                      <Icon size={11} /> {copy[entry.tone].toUpperCase()}
                    </span>
                    <span className="cg-card-region">
                      {entry.region !== 'all' && <MapPin size={10} style={{ marginRight: 3 }} />}
                      {copy[entry.region]}
                    </span>
                  </div>
                  <h2 className="cg-card-title">{entry.title[language]}</h2>
                  {entry.category === 'festivals' && FESTIVAL_TIMINGS[entry.id] && (
                    <div className="cg-festival-timing">
                      <CalendarDays size={13} />
                      <div>
                        <strong>{FESTIVAL_TIME_LABELS[language]}</strong>
                        <span>{FESTIVAL_TIMINGS[entry.id][language]}</span>
                      </div>
                    </div>
                  )}
                  <p className="cg-card-desc">{entry.description[language]}</p>
                </article>
              )
            })}
          </div>
        )}
      </div>

      <style>{`
        .culture-immersive-active .app-navbar { display:none!important; }

        .cg-page { min-height:100dvh; position:relative; color:#E8EAF6; }
        .cg-content {
          position:relative; z-index:1;
          padding:0 20px calc(104px + env(safe-area-inset-bottom,0px));
          max-width:720px; margin:0 auto;
        }
        .cg-content .bh-header { padding-top:20px; margin-bottom:16px; }

        .cg-hero {
          position:relative; overflow:hidden;
          padding:20px 0 8px; margin-bottom:8px;
        }
        .cg-eyebrow {
          font-size:10px; font-weight:800; letter-spacing:.1em;
          color:#C8560A; margin-bottom:6px; text-transform:uppercase;
        }

        /* ── Controls ── */
        .cg-controls {
          background:rgba(14,10,32,.72); border:1px solid rgba(255,255,255,.12);
          border-radius:16px; padding:14px 16px; backdrop-filter:blur(18px);
          margin-bottom:14px; display:flex; flex-direction:column; gap:10px;
        }
        .cg-divider { height:1px; background:rgba(255,255,255,.08); }
        .cg-section-label {
          font-size:9px; font-weight:800; letter-spacing:.1em; text-transform:uppercase;
          color:rgba(255,255,255,.35);
        }

        /* Language row */
        .cg-lang-row { display:flex; align-items:center; gap:10px; }
        .cg-lang-name { font-size:13px; font-weight:700; color:#F4EDE1; }
        .cg-lang-hint { font-size:10px; color:rgba(255,255,255,.28); margin-left:auto; }

        /* Language circle */
        .cg-lang-select-wrap { position:relative; width:40px; height:40px; flex-shrink:0; }
        .cg-lang-select {
          position:absolute; inset:0; width:100%; height:100%;
          opacity:0; cursor:pointer; z-index:2;
          appearance:none; -webkit-appearance:none; border:none; background:transparent;
        }
        .cg-lang-label {
          position:absolute; inset:0; border-radius:50%;
          background:rgba(200,150,12,.15); border:2px solid rgba(200,150,12,.6);
          color:#D9A441; font-size:11px; font-weight:800; letter-spacing:.03em;
          display:flex; align-items:center; justify-content:center;
          pointer-events:none; transition:background .15s;
        }
        .cg-lang-select-wrap:hover .cg-lang-label { background:rgba(200,150,12,.25); }

        /* Category pills */
        .cg-cats { display:flex; gap:8px; flex-wrap:wrap; }
        .cg-pill {
          padding:7px 16px; border-radius:22px; font-size:12px; font-weight:600;
          border:1px solid rgba(255,255,255,.2); background:transparent;
          color:rgba(255,255,255,.55); cursor:pointer; transition:all .15s; white-space:nowrap;
        }
        .cg-pill:hover { background:rgba(255,255,255,.1); color:#fff; }
        .cg-pill.active-cat { background:#C8960C; border-color:#C8960C; color:#fff; font-weight:700; }

        /* Filter row */
        .cg-filter-row { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
        .cg-search-wrap {
          flex:1; min-width:0; display:flex; align-items:center; gap:7px;
          padding:9px 12px; border-radius:10px;
          background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.12);
        }
        .cg-search-input {
          flex:1; min-width:0; background:transparent; border:none; outline:none;
          color:#F4EDE1; font-size:12px; font-family:inherit;
        }
        .cg-search-input::placeholder { color:rgba(255,255,255,.3); }

        .cg-region-wrap {
          display:flex; align-items:center; gap:5px;
          padding:9px 12px; border-radius:10px; flex-shrink:0;
          background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.12);
        }
        .cg-region-select {
          background:transparent; border:none; outline:none;
          color:rgba(255,255,255,.7); font-size:12px; font-weight:600;
          font-family:inherit; cursor:pointer;
          appearance:none; -webkit-appearance:none; max-width:90px;
        }
        .cg-region-select option { background:#1a1030; color:#fff; }

        @media (max-width:400px) {
          .cg-filter-row { flex-direction:column; align-items:stretch; }
          .cg-region-wrap { box-sizing:border-box; }
          .cg-region-select { max-width:none; }
          .cg-lang-hint { display:none; }
        }

        .cg-count { font-size:11px; color:rgba(255,255,255,.38); margin-bottom:14px; }

        /* Cards */
        .cg-cards { display:flex; flex-direction:column; gap:12px; }
        .cg-card {
          padding:18px 20px; border-radius:14px;
          background:rgba(18,10,40,.65); border:1px solid rgba(255,255,255,.09);
          border-left:3px solid; backdrop-filter:blur(12px);
          transition:border-color .2s;
        }
        .cg-card:hover { border-color:rgba(255,255,255,.18); }

        .cg-card-top {
          display:flex; align-items:center; justify-content:space-between;
          margin-bottom:10px;
        }
        .cg-tone-badge {
          display:inline-flex; align-items:center; gap:5px;
          padding:4px 10px; border-radius:20px;
          font-size:10px; font-weight:800; letter-spacing:.06em;
        }
        .cg-card-region {
          display:flex; align-items:center;
          font-size:10px; color:rgba(255,255,255,.38);
        }

        .cg-card-title {
          font-size:17px; font-weight:700; color:#F4EDE1;
          margin:0 0 10px; line-height:1.3;
        }
        .cg-card-desc {
          font-size:13px; color:rgba(255,255,255,.65); line-height:1.65; margin:0;
        }

        .cg-festival-timing {
          display:flex; align-items:flex-start; gap:8px; margin-bottom:10px;
          padding:8px 10px; border-radius:9px;
          background:rgba(167,139,250,.08); border:1px solid rgba(167,139,250,.2);
          font-size:12px; color:rgba(255,255,255,.6);
        }
        .cg-festival-timing strong { display:block; color:#a78bfa; font-size:10px; font-weight:700; }
        .cg-festival-timing span { display:block; margin-top:2px; }

        .cg-empty {
          text-align:center; padding:48px 20px;
          border:1px dashed rgba(255,255,255,.15); border-radius:14px;
          color:rgba(255,255,255,.38); font-size:14px;
        }
      `}</style>
    </main>
  )
}
