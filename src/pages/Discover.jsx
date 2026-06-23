import { useState } from 'react'
import { Bookmark, ChevronLeft, Heart, Landmark, MapPin, Mountain, PartyPopper, Sparkles, Trees, UtensilsCrossed, X } from 'lucide-react'
import { DISCOVERY_CARDS } from '../data/discoveryCards'
import { useAppStore } from '../store/appStore'
import PageHeader from '../components/layout/PageHeader'

const interests = [
  { id: 'all', label: 'For you', icon: Sparkles },
  { id: 'heritage', label: 'Heritage', icon: Landmark },
  { id: 'nature', label: 'Nature', icon: Trees },
  { id: 'food', label: 'Food', icon: UtensilsCrossed },
  { id: 'hills', label: 'Hills', icon: Mountain },
  { id: 'festivals', label: 'Festivals', icon: PartyPopper },
]

export default function Discover() {
  const [index, setIndex] = useState(0)
  const [interest, setInterest] = useState('all')
  const savedDiscoveries = useAppStore((state) => state.savedDiscoveries)
  const toggleDiscovery = useAppStore((state) => state.toggleDiscovery)
  const card = DISCOVERY_CARDS[index % DISCOVERY_CARDS.length]
  const saved = savedDiscoveries.includes(card.id)
  const next = () => setIndex((value) => (value + 1) % DISCOVERY_CARDS.length)

  const saveAndNext = () => {
    if (!saved) toggleDiscovery(card.id)
    next()
  }

  return (
    <main className="discover-page immersive-page">
      <PageHeader />
      <header className="discover-header">
        <span><Sparkles size={15} /> Bhalo Lage</span>
        <h1>Find your Bengal</h1>
        <p>Save the places, flavours and stories that feel like your kind of journey.</p>
      </header>

      <nav className="discover-interest-row" aria-label="Discovery interests">
        {interests.map(({ id, label, icon: Icon }) => <button key={id} className={interest === id ? 'active' : ''} onClick={() => setInterest(id)}><span><Icon size={18} /></span>{label}</button>)}
      </nav>

      <section className={`discovery-card discovery-${card.tone}`} aria-live="polite">
        <div className="discovery-photo" />
        <div className="discovery-card-copy">
          <span className="postcard-stamp">{card.badge}</span>
          <div><small>{card.kind}</small><h2>{card.title}</h2></div>
          <p><MapPin size={14} /> {card.region}</p>
          <strong>{card.description}</strong>
        </div>
        {saved && <Bookmark className="discovery-saved" fill="currentColor" />}
      </section>

      <div className="discovery-actions">
        <button onClick={next} aria-label="Skip"><X size={24} /></button>
        <button className="like" onClick={saveAndNext} aria-label="Save to collections"><Heart size={27} fill={saved ? 'currentColor' : 'none'} /></button>
      </div>
      <button className="discover-previous" onClick={() => setIndex((value) => (value - 1 + DISCOVERY_CARDS.length) % DISCOVERY_CARDS.length)}><ChevronLeft size={15} /> Previous</button>
    </main>
  )
}
