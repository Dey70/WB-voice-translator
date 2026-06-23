import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowRight, CalendarRange, MapPin, ChevronDown } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import { REGION_NAMES } from '../data/tourismLocale'
import { REGION_SEASON_CONFIG, SEASON_CONDITIONS, SEASON_KEYS, SEASON_LOCALE } from '../data/seasonalGuide'
import { LIVE_CONDITION_SOURCES } from '../data/contentAudit'
import { platformServices } from '../services/platform/platformAdapter'
import sundarbansBg from '../assets/sundarbans.jpeg'

const LANGUAGES = ['en', 'bn', 'ne', 'hi']

const SEASON_META = {
  winter:  { icon: '❄️', color: '#93c5fd', border: '#3b82f6', localName: 'শীতকাল' },
  spring:  { icon: '🌸', color: '#fcd34d', border: '#d97706', localName: 'বসন্তকাল' },
  monsoon: { icon: '🌧️', color: '#7dd3fc', border: '#0ea5e9', localName: 'বর্ষাকাল' },
  autumn:  { icon: '🍂', color: '#6ee7b7', border: '#10b981', localName: 'শরৎকাল' },
}

const RATING_META = {
  best:    { color: '#34d399', bg: 'rgba(52,211,153,0.14)',  border: 'rgba(52,211,153,0.30)' },
  good:    { color: '#60a5fa', bg: 'rgba(96,165,250,0.14)',  border: 'rgba(96,165,250,0.30)' },
  caution: { color: '#fbbf24', bg: 'rgba(251,191,36,0.13)',  border: 'rgba(251,191,36,0.30)' },
  avoid:   { color: '#f87171', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.30)' },
}

// Visual condition pills — emoji-coded, English, supplementary to the multilingual description
const CONDITION_PILLS = {
  pleasant:      ['☀️ Mild weather',  '🚶 Good for walks',    '👁️ Clear skies'],
  hotHumid:      ['🥵 Heat builds',   '🌅 Start early',       '💧 Carry water'],
  heavyRain:     ['🌊 Waterlogging',  '🚌 Transport risk',    '☁️ Low visibility'],
  festive:       ['🪔 Festival season','👥 Crowds likely',    '🎟️ Book early'],
  coldHills:     ['❄️ Fog likely',    '🛣️ Road caution',      '🧥 Warm layers'],
  bloomClear:    ['🌺 Rhododendrons', '🏔️ Clear views',       '🥾 Trails open'],
  landslide:     ['⚠️ Landslide risk','🚧 Road blocks',       '🪲 Leech season'],
  mountainClear: ['🏔️ Crystal views', '🛣️ Roads open',        '📸 Best photos'],
  forestOpen:    ['🌿 Forest active', '🦅 Wildlife time',     '🚤 Boats open'],
  forestClosed:  ['🚫 Forest closed', '🌊 Rivers swell',      '🦟 Insect peak'],
  roughSea:      ['🌊 Rough seas',    '🚫 No bathing',        '⛈️ Storm alerts'],
  cycloneDelta:  ['🌀 Cyclone risk',  '⛵ Boats disrupted',   '🌧️ Heavy rain'],
  altitudeWinter:['🏔️ High routes ✕', '❄️ Snow & ice',        '🏙️ City touring ok'],
}

const IMD_CHECK = {
  en: 'Check live IMD weather →',
  bn: 'IMD লাইভ আবহাওয়া দেখুন →',
  ne: 'IMD प्रत्यक्ष मौसम →',
  hi: 'IMD लाइव मौसम देखें →',
}

// Arc marker positions — pre-computed from quadratic bezier M 20 145 Q 170 30 320 145
// viewBox 340×165, parametric t values 0.10 / 0.35 / 0.65 / 0.90
const ARC_POS = {
  winter:  { x: 50,  y: 120, ly: 106 },
  spring:  { x: 125, y: 90,  ly: 76  },
  monsoon: { x: 215, y: 90,  ly: 76  },
  autumn:  { x: 290, y: 120, ly: 106 },
}

function getCurrentSeason() {
  const m = new Date().getMonth() + 1
  if (m >= 12 || m <= 2) return 'winter'
  if (m >= 3  && m <= 5) return 'spring'
  if (m >= 6  && m <= 9) return 'monsoon'
  return 'autumn'
}

function SeasonArc({ currentSeason }) {
  return (
    <svg viewBox="0 0 340 165" width="100%" height="148" className="sg2-arc" aria-hidden="true">
      {/* Ambient star field */}
      <circle cx="18"  cy="22" r="1.2" fill="white"   opacity="0.30"/>
      <circle cx="68"  cy="10" r="0.9" fill="white"   opacity="0.22"/>
      <circle cx="140" cy="7"  r="1.4" fill="#fcd34d" opacity="0.38"/>
      <circle cx="200" cy="12" r="1.0" fill="white"   opacity="0.20"/>
      <circle cx="265" cy="9"  r="1.1" fill="white"   opacity="0.27"/>
      <circle cx="320" cy="20" r="0.8" fill="#93c5fd" opacity="0.32"/>
      <circle cx="46"  cy="50" r="0.7" fill="white"   opacity="0.15"/>
      <circle cx="295" cy="46" r="0.7" fill="white"   opacity="0.15"/>
      <circle cx="100" cy="38" r="0.5" fill="#6ee7b7" opacity="0.18"/>
      <circle cx="240" cy="35" r="0.5" fill="#7dd3fc" opacity="0.18"/>

      {/* Season arc — glowing dashed curve */}
      {/* Glow layer */}
      <path
        d="M 20 145 Q 170 30 320 145"
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* Main dashed arc */}
      <path
        d="M 20 145 Q 170 30 320 145"
        fill="none"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="1.8"
        strokeDasharray="7 5"
        strokeLinecap="round"
      />

      {/* Season markers */}
      {SEASON_KEYS.map(s => {
        const pos    = ARC_POS[s]
        const meta   = SEASON_META[s]
        const active = s === currentSeason
        return (
          <g key={s}>
            {/* Outer glow rings for active season */}
            {active && <circle cx={pos.x} cy={pos.y} r="22" fill={meta.color} opacity="0.07"/>}
            {active && <circle cx={pos.x} cy={pos.y} r="14" fill={meta.color} opacity="0.14"/>}

            {/* Marker dot */}
            <circle
              cx={pos.x} cy={pos.y}
              r={active ? 8 : 5}
              fill={active ? meta.color : 'rgba(255,255,255,0.20)'}
              stroke={active ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.12)'}
              strokeWidth={active ? 1.5 : 0.8}
            />
            {/* Inner bright core for active */}
            {active && <circle cx={pos.x} cy={pos.y} r="3.5" fill="white" opacity="0.95"/>}

            {/* "now" text above active marker */}
            {active && (
              <text
                x={pos.x} y={pos.ly - 16}
                textAnchor="middle"
                fontSize="9.5"
                fill={meta.color}
                fontWeight="700"
                fontFamily="Hind, sans-serif"
                opacity="0.92"
              >
                ▾ now
              </text>
            )}

            {/* Season label */}
            <text
              x={pos.x} y={pos.ly}
              textAnchor="middle"
              fontSize="11"
              fill={active ? meta.color : 'rgba(255,255,255,0.40)'}
              fontWeight={active ? '700' : '400'}
              fontFamily="Hind, sans-serif"
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </text>
          </g>
        )
      })}

      {/* Mountain silhouette */}
      <polygon
        points="0,158 28,140 55,148 88,128 116,138 152,118 184,128 218,112 252,122 278,108 306,116 340,104 340,165 0,165"
        fill="rgba(4,8,20,0.70)"
      />
    </svg>
  )
}

export default function SeasonalGuide() {
  const [language, setLanguage]     = useState('en')
  const [region, setRegion]         = useState('darjeeling')
  const [regionOpen, setRegionOpen] = useState(false)

  const copy          = SEASON_LOCALE[language]
  const config        = REGION_SEASON_CONFIG[region]
  const currentSeason = getCurrentSeason()

  return (
    <div className="sg2-page">
      {/* Immersive background */}
      <div className="sg2-bg" style={{ backgroundImage: `url(${sundarbansBg})` }} />
      <div className="sg2-overlay" />

      <div className="sg2-content">
        <PageHeader />

        {/* ── Hero header ── */}
        <header className="sg2-hero">
          <span className="sg2-eyebrow">
            <CalendarRange size={12} aria-hidden="true" />
            {copy.eyebrow}
          </span>
          <h1 className="sg2-title">{copy.title}</h1>
          <p className="sg2-subtitle">{copy.subtitle}</p>
        </header>

        {/* ── Season arc timeline ── */}
        <div className="sg2-arc-wrap">
          <SeasonArc currentSeason={currentSeason} />
        </div>

        {/* ── Region + Language controls ── */}
        <div className="sg2-controls">
          <div className="sg2-region-wrap">
            <button
              className="sg2-region-btn"
              onClick={() => setRegionOpen(o => !o)}
              aria-expanded={regionOpen}
              aria-haspopup="listbox"
            >
              <MapPin size={13} className="sg2-pin-icon" aria-hidden="true" />
              <span>{REGION_NAMES[region][language]}</span>
              <ChevronDown
                size={12}
                className={`sg2-chevron${regionOpen ? ' open' : ''}`}
                aria-hidden="true"
              />
            </button>

            {regionOpen && (
              <ul className="sg2-dropdown" role="listbox" aria-label={copy.region}>
                {Object.keys(REGION_SEASON_CONFIG).map(r => (
                  <li key={r} role="option" aria-selected={r === region}>
                    <button
                      className={`sg2-dropdown-item${r === region ? ' active' : ''}`}
                      onClick={() => { setRegion(r); setRegionOpen(false) }}
                    >
                      <span>{REGION_NAMES[r][language]}</span>
                      {r === region && <span className="sg2-tick" aria-hidden="true">✓</span>}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="sg2-langs" role="group" aria-label={copy.language}>
            {LANGUAGES.map(lang => (
              <button
                key={lang}
                className={`sg2-lang${lang === language ? ' active' : ''}`}
                onClick={() => setLanguage(lang)}
                aria-pressed={lang === language}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* ── IMD disclaimer ── */}
        <div className="sg2-disclaimer" role="note">
          <AlertTriangle size={12} className="sg2-warn-icon" aria-hidden="true" />
          <p>
            {copy.verify}{' '}
            <button
              className="sg2-imd-link"
              onClick={() => platformServices.links.openExternal(LIVE_CONDITION_SOURCES.weather)}
            >
              {IMD_CHECK[language]}
            </button>
          </p>
        </div>

        {/* ── Season cards ── */}
        <div className="sg2-grid">
          {SEASON_KEYS.map(season => {
            const [rating, condition] = config[season]
            const meta  = SEASON_META[season]
            const rm    = RATING_META[rating]
            const isNow = season === currentSeason
            const pills = CONDITION_PILLS[condition] ?? []

            return (
              <article
                key={season}
                className={`sg2-card${isNow ? ' sg2-card--now' : ''}`}
              >
                {/* Coloured left accent bar */}
                <div className="sg2-card-bar" style={{ background: meta.border }} />

                <div className="sg2-card-body">
                  {/* Month range + rating badge */}
                  <div className="sg2-card-top">
                    <span className="sg2-card-months" style={{ color: meta.color }}>
                      {copy[`${season}Months`]}
                    </span>
                    <span
                      className="sg2-badge"
                      style={{ color: rm.color, background: rm.bg, borderColor: rm.border }}
                    >
                      {copy[rating]}
                    </span>
                  </div>

                  {/* Icon + name row */}
                  <div className="sg2-card-nameline">
                    <span className="sg2-card-icon" aria-hidden="true">{meta.icon}</span>
                    <div className="sg2-card-names">
                      <h2 className="sg2-card-name">{copy[season]}</h2>
                      <p className="sg2-card-local">{meta.localName}</p>
                    </div>
                    <div className="sg2-card-side">
                      {isNow && <span className="sg2-now-tag">Now</span>}
                      {season === 'monsoon' && (
                        <span className="sg2-rain" aria-hidden="true">
                          {[0, 1, 2, 3].map(i => (
                            <span
                              key={i}
                              className="sg2-drop"
                              style={{ animationDelay: `${i * 0.28}s` }}
                            />
                          ))}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Condition description (multilingual) */}
                  <p className="sg2-card-desc">{SEASON_CONDITIONS[condition][language]}</p>

                  {/* Condition pills */}
                  <div className="sg2-pills" aria-hidden="true">
                    {pills.map(p => (
                      <span
                        key={p}
                        className="sg2-pill"
                        style={{ color: meta.color, borderColor: `${meta.border}55` }}
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {/* ── Recommended window + CTA ── */}
        <div className="sg2-footer">
          <div className="sg2-footer-copy">
            <span className="sg2-footer-label">{copy.bestWindow}</span>
            <strong className="sg2-footer-window">{config.best[language]}</strong>
          </div>
          <Link
            to={`/places/explore?region=${region}`}
            className="sg2-footer-cta"
          >
            {copy.openExplore}
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  )
}
