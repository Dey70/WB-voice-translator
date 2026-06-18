import { useMemo, useState } from 'react'
import { AlertCircle, CheckCircle2, HeartHandshake, Search, Sparkles } from 'lucide-react'
import { CULTURAL_GUIDE_ITEMS, CULTURE_CATEGORIES, CULTURE_LOCALE, CULTURE_REGIONS } from '../data/culturalGuide'
import { CULTURAL_GUIDE_EXPANSION } from '../data/culturalGuideExpansion'

const ALL_CULTURAL_ITEMS = [...CULTURAL_GUIDE_ITEMS, ...CULTURAL_GUIDE_EXPANSION]

const LANGUAGES = [
  { code:'en', label:'EN', name:'English' }, { code:'bn', label:'BN', name:'বাংলা' },
  { code:'ne', label:'NE', name:'नेपाली' }, { code:'hi', label:'HI', name:'हिन्दी' },
]

const TONE_ICONS = { do: CheckCircle2, avoid: AlertCircle, know: Sparkles }

export default function CulturalGuide() {
  const [language, setLanguage] = useState('en')
  const [category, setCategory] = useState('customs')
  const [region, setRegion] = useState('all')
  const [query, setQuery] = useState('')
  const copy = CULTURE_LOCALE[language]

  const items = useMemo(() => {
    const search = query.trim().toLocaleLowerCase()
    return ALL_CULTURAL_ITEMS.filter((entry) => entry.category === category
      && (region === 'all' || entry.region === 'all' || entry.region === region)
      && (!search || entry.title[language].toLocaleLowerCase().includes(search) || entry.description[language].toLocaleLowerCase().includes(search)))
  }, [language, category, region, query])

  return (
    <main className="culture-page">
      <header className="culture-hero">
        <span><HeartHandshake size={16} /> {copy.eyebrow}</span>
        <h1 className="gradient-text">{copy.title}</h1>
        <p>{copy.subtitle}</p>
      </header>

      <section className="culture-controls glass">
        <div className="culture-languages">
          {LANGUAGES.map((item) => (
            <button key={item.code} className={language === item.code ? 'active' : ''} onClick={() => setLanguage(item.code)}>
              <strong>{item.label}</strong><span>{item.name}</span>
            </button>
          ))}
        </div>
        <div className="culture-selects">
          <label><span>{copy.category}</span><select value={category} onChange={(event) => setCategory(event.target.value)}>
            {CULTURE_CATEGORIES.map((item) => <option key={item} value={item}>{copy[item]}</option>)}
          </select></label>
          <label><span>{copy.region}</span><select value={region} onChange={(event) => setRegion(event.target.value)}>
            {CULTURE_REGIONS.map((item) => <option key={item} value={item}>{copy[item]}</option>)}
          </select></label>
        </div>
        <label className="culture-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.search} aria-label={copy.search} /></label>
      </section>

      <div className="culture-count">{copy.results(items.length)}</div>
      <section className="culture-grid">
        {items.map((entry) => {
          const Icon = TONE_ICONS[entry.tone]
          return (
            <article key={entry.id} className={`culture-card glass tone-${entry.tone}`}>
              <div className="culture-card-heading">
                <span><Icon size={16} /> {copy[entry.tone]}</span>
                <small>{copy[entry.region]}</small>
              </div>
              <h2>{entry.title[language]}</h2>
              <p>{entry.description[language]}</p>
            </article>
          )
        })}
      </section>
      {items.length === 0 && <div className="culture-empty">{copy.empty}</div>}
    </main>
  )
}
