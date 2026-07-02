import { useEffect, useMemo, useRef, useState } from 'react'
import { AlertCircle, CalendarDays, CheckCircle2, Check, ChevronDown, MapPin, Search, Sparkles, X } from 'lucide-react'
import VaultGuideHeader from '../components/layout/VaultGuideHeader'
import { CULTURAL_GUIDE_ITEMS, CULTURE_CATEGORIES, CULTURE_LOCALE, CULTURE_REGIONS } from '../data/culturalGuide'
import { CULTURAL_GUIDE_EXPANSION } from '../data/culturalGuideExpansion'
import { FESTIVAL_TIMINGS, FESTIVAL_TIME_LABELS } from '../data/festivalTimings'
import potteryBg from '../assets/Pottery.jpg'
import '../styles/guide-pages-theme.css'

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
  const [open, setOpen]                     = useState(false)
  const [langExpanded, setLangExpanded]     = useState(false)
  const [regionExpanded, setRegionExpanded] = useState(false)
  const panelRef = useRef(null)
  const copy = CULTURE_LOCALE[language]

  const openPanel = () => {
    setLangExpanded(false); setRegionExpanded(false)
    setOpen(true)
  }
  const closePanel = () => setOpen(false)

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

  const activeLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0]

  return (
    <main className="cg-page">

      {/* Background */}
      <div className="pb-bg" aria-hidden="true">
        <img src={potteryBg} alt="" />
        <div className="pb-bg-overlay pb-bg-overlay--overcast" />
      </div>

      <div className="cg-content">

        <VaultGuideHeader />

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

        {/* Collapsed filter bar — 3 equal segments */}
        <button className="cg-filter-bar" onClick={openPanel} aria-haspopup="dialog" aria-expanded={open}>
          <span className="cg-bar-seg">
            <span className="cg-bar-lang-circle">{activeLang.label}</span>
            <span className="cg-bar-seg-text">{activeLang.name}</span>
          </span>
          <span className="cg-bar-divider" aria-hidden="true">·</span>
          <span className="cg-bar-seg">
            <span className="cg-bar-seg-text">{copy[category]}</span>
          </span>
          <span className="cg-bar-divider" aria-hidden="true">·</span>
          <span className="cg-bar-seg">
            <MapPin size={12} aria-hidden="true" />
            <span className="cg-bar-seg-text">{copy[region]}</span>
          </span>
          <ChevronDown size={14} className="cg-bar-chevron" />
        </button>

        {/* Settings panel — bottom sheet */}
        {open && (
          <div className="cg-panel-backdrop" onClick={closePanel}>
            <div className="cg-panel" ref={panelRef} role="dialog" aria-modal="true" aria-label="Cultural settings" onClick={e => e.stopPropagation()}>

              {/* Drag handle */}
              <div className="cg-panel-handle" aria-hidden="true" />

              {/* Header */}
              <div className="cg-panel-header">
                <span className="cg-panel-title">Cultural settings</span>
                <button className="cg-panel-close" onClick={closePanel} aria-label="Close"><X size={16} /></button>
              </div>

              {/* LANGUAGE */}
              <div className="cg-section-label">Language</div>
              <button
                className="cg-lang-trigger"
                onClick={() => setLangExpanded(v => !v)}
                aria-expanded={langExpanded}
              >
                <span className="cg-lang-circle-badge">{activeLang.label}</span>
                <span className="cg-lang-trigger-name">{activeLang.name}</span>
                <ChevronDown
                  size={16}
                  style={{ marginLeft: 'auto', color: 'rgba(255,255,255,.45)', transition: 'transform .2s', transform: langExpanded ? 'rotate(180deg)' : 'none' }}
                />
              </button>
              {langExpanded && (
                <div className="cg-lang-list">
                  {LANGUAGES.map(({ code, label, name }) => (
                    <button
                      key={code}
                      className={`cg-lang-option ${language === code ? 'active' : ''}`}
                      onClick={() => { setLanguage(code); setLangExpanded(false) }}
                    >
                      <span className="cg-lang-option-code">{label}</span>
                      <span className="cg-lang-option-name">{name}</span>
                      {language === code && <Check size={14} style={{ marginLeft: 'auto', color: '#D9A441' }} />}
                    </button>
                  ))}
                </div>
              )}

              <div className="cg-divider" />

              {/* BROWSE BY */}
              <div className="cg-section-label">Browse by</div>
              <div className="cg-cats">
                {CULTURE_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    className={`cg-pill ${category === cat ? 'active-cat' : ''}`}
                    onClick={() => setCategory(cat)}
                  >
                    {CULTURE_LOCALE[language][cat]}
                  </button>
                ))}
              </div>

              <div className="cg-divider" />

              {/* FILTER */}
              <div className="cg-section-label">Filter</div>

              {/* Search — full width */}
              <div className="cg-search-wrap">
                <Search size={13} style={{ color: 'rgba(255,255,255,.35)', flexShrink: 0 }} />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder={copy.search + '…'}
                  className="cg-search-input"
                />
                {query && <button onClick={() => setQuery('')} className="cg-clear-query">×</button>}
              </div>

              {/* All regions — full-width row, expands inline */}
              <button
                className="cg-region-row"
                onClick={() => setRegionExpanded(v => !v)}
                aria-expanded={regionExpanded}
              >
                <MapPin size={15} style={{ color: 'rgba(255,255,255,.45)', flexShrink: 0 }} />
                <span className="cg-region-row-label">{copy[region]}</span>
                <ChevronDown
                  size={14}
                  style={{ marginLeft: 'auto', color: 'rgba(255,255,255,.4)', transition: 'transform .2s', transform: regionExpanded ? 'rotate(180deg)' : 'none' }}
                />
              </button>
              {regionExpanded && (
                <div className="cg-region-list">
                  {CULTURE_REGIONS.map(r => (
                    <button
                      key={r}
                      className={`cg-region-option ${region === r ? 'active' : ''}`}
                      onClick={() => { setRegion(r); setRegionExpanded(false) }}
                    >
                      <span>{copy[r]}</span>
                      {region === r && <Check size={13} style={{ marginLeft: 'auto', color: '#D9A441' }} />}
                    </button>
                  ))}
                </div>
              )}

              {/* Cancel — full width */}
              <button className="cg-btn-cancel" onClick={closePanel}>Cancel</button>

            </div>
          </div>
        )}

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

        .cg-hero { position:relative; overflow:hidden; padding:20px 0 8px; margin-bottom:8px; }
        .cg-eyebrow {
          font-size:10px; font-weight:800; letter-spacing:.1em;
          color:#C8560A; margin-bottom:6px; text-transform:uppercase;
        }

        /* ── Collapsed filter bar ── */
        .cg-filter-bar {
          display:flex; align-items:center;
          width:100%; min-height:48px; padding:8px 14px 8px 10px;
          border-radius:999px; margin-bottom:14px;
          background:rgba(14,10,32,.72); border:1px solid rgba(255,255,255,.16);
          backdrop-filter:blur(18px); cursor:pointer;
          color:rgba(255,255,255,.7); font-size:13px; font-family:inherit;
          transition:border-color .15s, background .15s;
          gap:0;
        }
        .cg-filter-bar:hover { background:rgba(14,10,32,.88); border-color:rgba(255,255,255,.28); }

        .cg-bar-seg {
          flex:1; display:flex; align-items:center; justify-content:center;
          gap:6px; min-width:0; padding:0 4px;
        }
        .cg-bar-seg-text {
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
          font-size:13px; font-weight:600; color:#F4EDE1;
        }
        .cg-bar-lang-circle {
          width:26px; height:26px; border-radius:50%; flex-shrink:0;
          background:rgba(200,150,12,.2); border:1.5px solid rgba(200,150,12,.5);
          display:flex; align-items:center; justify-content:center;
          font-size:9px; font-weight:800; color:#D9A441; letter-spacing:.02em;
        }
        .cg-bar-divider {
          font-size:16px; color:rgba(255,255,255,.25); flex-shrink:0; padding:0 2px;
          user-select:none;
        }
        .cg-bar-chevron { flex-shrink:0; color:rgba(255,255,255,.4); margin-left:4px; }

        /* ── Panel backdrop ── */
        .cg-panel-backdrop {
          position:fixed; inset:0; z-index:100;
          background:rgba(0,0,0,.6); backdrop-filter:blur(3px);
          display:flex; align-items:flex-end; justify-content:center;
        }

        /* ── Panel sheet ── */
        .cg-panel {
          width:100%; max-width:600px;
          background:rgba(16,11,36,.98); border:1px solid rgba(255,255,255,.12);
          border-radius:22px 22px 0 0;
          padding:0 20px calc(32px + env(safe-area-inset-bottom,0px));
          display:flex; flex-direction:column; gap:14px;
          animation:cgSlideUp .22s ease;
          max-height:88dvh; overflow-y:auto;
        }
        @keyframes cgSlideUp { from{transform:translateY(40px);opacity:0} to{transform:none;opacity:1} }

        .cg-panel-handle {
          width:40px; height:4px; border-radius:2px;
          background:rgba(255,255,255,.18); margin:14px auto 0; flex-shrink:0;
        }
        .cg-panel-header {
          display:flex; align-items:center; justify-content:space-between;
          padding-top:4px;
        }
        .cg-panel-title {
          font-size:16px; font-weight:700; color:#F4EDE1; letter-spacing:-.01em;
        }
        .cg-panel-close {
          width:34px; height:34px; border-radius:50%;
          border:1.5px solid rgba(255,255,255,.2);
          background:rgba(255,255,255,.09); color:rgba(255,255,255,.75);
          display:flex; align-items:center; justify-content:center; cursor:pointer;
          transition:background .15s;
        }
        .cg-panel-close:hover { background:rgba(255,255,255,.16); }

        .cg-divider { height:1px; background:rgba(255,255,255,.07); }
        .cg-section-label {
          font-size:9px; font-weight:800; letter-spacing:.1em; text-transform:uppercase;
          color:rgba(255,255,255,.32); margin-bottom:-6px;
        }

        /* Language row trigger */
        .cg-lang-trigger {
          display:flex; align-items:center; gap:12px; width:100%;
          padding:12px 14px; border-radius:12px; cursor:pointer; font-family:inherit;
          border:1px solid rgba(255,255,255,.12); background:rgba(255,255,255,.05);
          color:#F4EDE1; transition:background .15s;
        }
        .cg-lang-trigger:hover { background:rgba(255,255,255,.09); }
        .cg-lang-circle-badge {
          width:34px; height:34px; border-radius:50%; flex-shrink:0;
          background:rgba(14,10,32,.9); border:2px solid rgba(200,150,12,.55);
          display:flex; align-items:center; justify-content:center;
          font-size:10px; font-weight:800; color:#D9A441; letter-spacing:.03em;
        }
        .cg-lang-trigger-name { font-size:14px; font-weight:600; }

        /* Language inline list */
        .cg-lang-list {
          display:flex; flex-direction:column; gap:4px;
          padding:6px 0; border-radius:10px;
          background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08);
        }
        .cg-lang-option {
          display:flex; align-items:center; gap:12px;
          padding:10px 14px; cursor:pointer; font-family:inherit;
          background:transparent; border:none; color:rgba(255,255,255,.65);
          transition:background .12s; border-radius:8px; text-align:left;
        }
        .cg-lang-option:hover { background:rgba(255,255,255,.07); color:#fff; }
        .cg-lang-option.active { color:#D9A441; }
        .cg-lang-option-code {
          width:30px; height:30px; border-radius:50%; flex-shrink:0;
          background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.14);
          display:flex; align-items:center; justify-content:center;
          font-size:9px; font-weight:800; letter-spacing:.03em;
        }
        .cg-lang-option.active .cg-lang-option-code {
          background:rgba(200,150,12,.15); border-color:rgba(200,150,12,.45); color:#D9A441;
        }
        .cg-lang-option-name { font-size:14px; font-weight:500; }

        /* Category pills */
        .cg-cats { display:flex; gap:8px; flex-wrap:wrap; }
        .cg-pill {
          padding:8px 18px; border-radius:22px; font-size:13px; font-weight:600;
          border:1.5px solid rgba(255,255,255,.18); background:transparent;
          color:rgba(255,255,255,.55); cursor:pointer; transition:all .15s; white-space:nowrap;
          font-family:inherit;
        }
        .cg-pill:hover { background:rgba(255,255,255,.09); color:#fff; }
        .cg-pill.active-cat {
          background:rgba(14,10,32,.9); border-color:rgba(255,255,255,.55);
          color:#fff; font-weight:700;
        }

        /* Search */
        .cg-search-wrap {
          display:flex; align-items:center; gap:8px;
          padding:11px 14px; border-radius:12px;
          background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.11);
        }
        .cg-search-input {
          flex:1; min-width:0; background:transparent; border:none; outline:none;
          color:#F4EDE1; font-size:14px; font-family:inherit;
        }
        .cg-search-input::placeholder { color:rgba(255,255,255,.3); }
        .cg-clear-query {
          background:none; border:none; color:rgba(255,255,255,.4);
          cursor:pointer; font-size:18px; padding:0; line-height:1;
        }

        /* Region row — full width */
        .cg-region-row {
          display:flex; align-items:center; gap:10px; width:100%;
          padding:12px 14px; border-radius:12px; cursor:pointer; font-family:inherit;
          border:1px solid rgba(255,255,255,.11); background:rgba(255,255,255,.06);
          color:rgba(255,255,255,.7); font-size:14px; font-weight:500;
          transition:background .15s;
        }
        .cg-region-row:hover { background:rgba(255,255,255,.09); }
        .cg-region-row-label { flex:1; text-align:left; }

        /* Region inline list */
        .cg-region-list {
          display:flex; flex-direction:column; gap:2px;
          border-radius:10px; overflow:hidden;
          background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08);
        }
        .cg-region-option {
          display:flex; align-items:center; gap:8px;
          padding:11px 16px; text-align:left; font-size:13px; font-family:inherit;
          background:transparent; border:none; color:rgba(255,255,255,.65); cursor:pointer;
          border-bottom:1px solid rgba(255,255,255,.05); transition:background .12s;
        }
        .cg-region-option:last-child { border-bottom:none; }
        .cg-region-option:hover { background:rgba(255,255,255,.07); color:#fff; }
        .cg-region-option.active { color:#D9A441; font-weight:600; }

        /* Cancel button */
        .cg-btn-cancel {
          width:100%; padding:13px; border-radius:14px; font-size:14px; font-weight:600;
          border:1.5px solid rgba(255,255,255,.2); background:rgba(255,255,255,.06);
          color:rgba(255,255,255,.7); cursor:pointer; font-family:inherit;
          transition:background .15s, border-color .15s;
          margin-top:4px;
        }
        .cg-btn-cancel:hover { background:rgba(255,255,255,.1); border-color:rgba(255,255,255,.32); color:#fff; }

        @media (max-width:400px) {
          .cg-content { padding-left:14px; padding-right:14px; }
          .cg-panel { padding:0 14px calc(28px + env(safe-area-inset-bottom,0px)); }
          .cg-bar-seg-text { font-size:12px; }
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
