import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Search, UtensilsCrossed, X } from 'lucide-react'
import { FOOD_TIERS } from '../data/localFood'
import foodBackground from '../assets/Bengali food.jpg'
import '../styles/food-guide.css'

export default function FoodGuide() {
  const [tier, setTier] = useState('everyday')
  const [selected, setSelected] = useState(null)
  const [query, setQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const searchRef = useRef(null)
  const activeTier = FOOD_TIERS.find(item => item.id === tier)
  const visibleItems = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return activeTier.items
    return activeTier.items.filter(item => [item.name, item.local, item.community, item.where, item.place].join(' ').toLowerCase().includes(term))
  }, [activeTier, query])

  if (selected) return <main className="food-page food-page--detail">
    <div className="food-detail-shell">
      <button className="food-back food-back--overlay" onClick={() => setSelected(null)} aria-label="Back to food list"><ArrowLeft size={19}/></button>
      <article className="food-detail">
        <div className="food-detail-hero">
          <span className="food-detail-badge">{activeTier.label} · {selected.community}</span>
          <div><h1>{selected.name}</h1><p>{selected.local}</p></div>
        </div>
        <div className="food-detail-body">
          <div className="food-facts"><div><span>Price</span><strong>{selected.price}</strong></div><div><span>Spice</span><strong>{selected.spice}</strong></div><div><span>Best season</span><strong>{selected.season}</strong></div></div>
          <p className="food-story">{selected.description}</p>
          <section className="food-find"><div><h2>Where to actually find it</h2><p>{selected.where}</p><span><MapPin size={13}/> {selected.place}</span></div></section>
          <section className="food-ask"><span>Ask with care</span><p>{selected.ask}</p></section>
        </div>
      </article>
    </div>
  </main>

  return <main className="food-page">
    <div className="food-bg" aria-hidden="true"><img src={foodBackground} alt=""/><div className="food-bg-overcast"/></div>
    <div className="food-shell">
    <div className="food-topbar">
      <Link to="/places" className="food-header-action" aria-label="Back to Explore"><ArrowLeft size={19}/></Link>
      <Link to="/" className="food-brand" aria-label="KothaSetu home"><strong>কথাসেতু</strong><span>Speak. Be understood.</span></Link>
      <button className="food-header-action" aria-label="Search local food" aria-expanded={showSearch} onClick={() => {
        if (showSearch) {
          setQuery('')
          setShowSearch(false)
          return
        }
        setShowSearch(true)
        setTimeout(() => searchRef.current?.focus(), 0)
      }}><Search size={18}/></button>
    </div>
    <section className="food-hero"><h1>Local Food</h1><p>{activeTier.intro}</p></section>
    {showSearch && <label className="food-search"><Search size={15}/><input ref={searchRef} value={query} onChange={event => setQuery(event.target.value)} placeholder="Search food, place, or community"/>{query && <button type="button" onClick={() => setQuery('')} aria-label="Clear food search"><X size={15}/></button>}</label>}
    <nav className="food-tier-tabs" aria-label="Food availability tiers">{FOOD_TIERS.map(item => <button key={item.id} aria-current={tier === item.id ? 'page' : undefined} className={tier === item.id ? `active ${item.id}` : ''} onClick={() => setTier(item.id)}>{item.label}</button>)}</nav>
    <section className={`food-tier-panel ${activeTier.id}`}>
      {activeTier.id === 'rare' && <aside className="food-rare-note"><strong>A note before you explore this list</strong><span>{activeTier.note}</span></aside>}
      <header><span className="food-tier-dot"/><div><h2>{activeTier.title}</h2><p>{activeTier.subtitle}</p></div></header>
      <div className="food-list" role="table" aria-label={activeTier.title}>{visibleItems.map(item => <button role="row" className="food-card" key={item.id} onClick={() => setSelected(item)}>
        <span className="food-card-icon" aria-hidden="true"><UtensilsCrossed size={18}/></span>
        <span className="food-card-copy" role="cell"><strong>{item.name}</strong><small>{item.community}</small><span>{item.where}</span></span>
        <span className="food-card-end" role="cell"><b>{item.price}</b></span>
      </button>)}</div>
      {!visibleItems.length && <div className="food-empty">No food matches that search in this tier.</div>}
      {activeTier.id !== 'rare' && <aside className="food-balance-note">{activeTier.note}</aside>}
    </section>
    <p className="food-footnote">Availability and prices change with season and market. Ask locally, photograph only with permission, and let hosts lead the experience.</p>
  </div></main>
}
