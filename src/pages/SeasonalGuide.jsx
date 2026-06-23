import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowRight, CalendarRange } from 'lucide-react'
import PlacesSubnav from '../components/places/PlacesSubnav'
import PageHeader from '../components/layout/PageHeader'
import { REGION_NAMES } from '../data/tourismLocale'
import { REGION_SEASON_CONFIG, SEASON_CONDITIONS, SEASON_KEYS, SEASON_LOCALE } from '../data/seasonalGuide'
import { CONTENT_AUDIT_DATE_LABEL, LIVE_CONDITION_SOURCES } from '../data/contentAudit'
import { platformServices } from '../services/platform/platformAdapter'

const LANGUAGES = ['en','bn','ne','hi']
const AUDIT_COPY = {
  en:{ label:'Internal inventory', check:'Check live IMD weather' },
  bn:{ label:'অভ্যন্তরীণ তালিকা', check:'IMD-এর লাইভ আবহাওয়া দেখুন' },
  ne:{ label:'आन्तरिक सूची', check:'IMD को प्रत्यक्ष मौसम हेर्नुहोस्' },
  hi:{ label:'आंतरिक सूची', check:'IMD का लाइव मौसम देखें' },
}

export default function SeasonalGuide() {
  const [language,setLanguage] = useState('en')
  const [region,setRegion] = useState('darjeeling')
  const copy = SEASON_LOCALE[language]
  const auditCopy = AUDIT_COPY[language]
  const config = REGION_SEASON_CONFIG[region]
  return (
    <main className="season-page">
      <PageHeader />
      <PlacesSubnav language={language}/>
      <header className="season-hero"><span><CalendarRange size={15}/> {copy.eyebrow}</span><h1>{copy.title}</h1><p>{copy.subtitle}</p></header>
      <section className="season-controls glass">
        <div className="season-languages">{LANGUAGES.map(item=><button key={item} className={language===item?'active':''} onClick={()=>setLanguage(item)}>{item.toUpperCase()}</button>)}</div>
        <label><span>{copy.region}</span><select value={region} onChange={event=>setRegion(event.target.value)}>{Object.keys(REGION_SEASON_CONFIG).map(item=><option key={item} value={item}>{REGION_NAMES[item][language]}</option>)}</select></label>
      </section>
      <div className="season-verify"><AlertTriangle size={16}/><span>{copy.verify} <small>{auditCopy.label}: {CONTENT_AUDIT_DATE_LABEL}. <button onClick={() => platformServices.links.openExternal(LIVE_CONDITION_SOURCES.weather)}>{auditCopy.check}</button></small></span></div>
      <section className="season-grid">
        {SEASON_KEYS.map(season=>{const [rating,condition]=config[season];return <article key={season} className={`season-card glass rating-${rating}`}><div className="season-card-top"><div><span>{copy[`${season}Months`]}</span><h2>{copy[season]}</h2></div><strong>{copy[rating]}</strong></div><p>{SEASON_CONDITIONS[condition][language]}</p></article>})}
      </section>
      <div className="season-footer glass"><div><span>{copy.bestWindow}</span><strong>{config.best[language]}</strong></div><Link to={`/places/explore?region=${region}`}>{copy.openExplore}<ArrowRight size={16}/></Link></div>
    </main>
  )
}
