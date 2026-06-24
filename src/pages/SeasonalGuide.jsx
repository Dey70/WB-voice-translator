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
  winter:  { color: '#93c5fd', localName: 'শীতকাল' },
  spring:  { color: '#fcd34d', localName: 'বসন্তকাল' },
  monsoon: { color: '#7dd3fc', localName: 'বর্ষাকাল' },
  autumn:  { color: '#6ee7b7', localName: 'শরৎকাল' },
}

const RATING_META = {
  best:    { color: '#34d399' },
  good:    { color: '#60a5fa' },
  caution: { color: '#fbbf24' },
  avoid:   { color: '#f87171' },
}

const IMD_CHECK = {
  en: 'Check live IMD weather →',
  bn: 'IMD লাইভ আবহাওয়া দেখুন →',
  ne: 'IMD प्रत्यक्ष मौसम →',
  hi: 'IMD लाइव मौसम देखें →',
}

function getCurrentSeason() {
  const m = new Date().getMonth() + 1
  if (m >= 12 || m <= 2) return 'winter'
  if (m >= 3  && m <= 5) return 'spring'
  if (m >= 6  && m <= 9) return 'monsoon'
  return 'autumn'
}

export default function SeasonalGuide() {
  const [language, setLanguage]     = useState('en')
  const [region, setRegion]         = useState('darjeeling')
  const [regionOpen, setRegionOpen] = useState(false)

  const copy          = SEASON_LOCALE[language]
  const config        = REGION_SEASON_CONFIG[region]
  const currentSeason = getCurrentSeason()

  return (
    <>
      <div className="pb-bg" aria-hidden="true">
        <img src={sundarbansBg} alt="" />
        <div className="pb-bg-overlay pb-bg-overlay--overcast" />
      </div>

      <div className="sg2-page">
        <div className="sg2-content">
          <PageHeader />

          {/* Hero */}
          <header className="sg2-hero">
            <span className="sg2-eyebrow">
              <CalendarRange size={12} aria-hidden="true" />
              {copy.eyebrow}
            </span>
            <h1 className="sg2-title">{copy.title}</h1>
            <p className="sg2-subtitle">{copy.subtitle}</p>
          </header>

          {/* Region + Language controls */}
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

          {/* IMD disclaimer */}
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

          {/* Season cards */}
          <div className="sg2-grid">
            {SEASON_KEYS.map(season => {
              const [rating, condition] = config[season]
              const meta  = SEASON_META[season]
              const rm    = RATING_META[rating]
              const isNow = season === currentSeason

              return (
                <article key={season} className={`sg2-card${isNow ? ' sg2-card--now' : ''}`}>
                  <div className="sg2-card-bar" style={{ background: meta.color }} />
                  <div className="sg2-card-body">
                    <div className="sg2-card-meta">
                      <time className="sg2-card-period" style={{ color: meta.color }}>
                        {copy[`${season}Months`]}
                      </time>
                      <span className="sg2-card-rating" style={{ color: rm.color }}>
                        <span className="sg2-rating-dot" aria-hidden="true">●</span>
                        {copy[rating]}
                      </span>
                      {isNow && <span className="sg2-now-tag">Now</span>}
                    </div>
                    <h2 className="sg2-card-name">{copy[season]}</h2>
                    <p className="sg2-card-local">{meta.localName}</p>
                    <hr className="sg2-card-rule" />
                    <p className="sg2-card-desc">{SEASON_CONDITIONS[condition][language]}</p>
                  </div>
                </article>
              )
            })}
          </div>

          {/* Recommended window + CTA */}
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
    </>
  )
}
