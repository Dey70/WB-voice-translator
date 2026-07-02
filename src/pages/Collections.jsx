import { Bookmark, Heart, MapPin, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DISCOVERY_CARDS } from '../data/discoveryCards'
import { useAppStore } from '../store/appStore'
import VaultGuideHeader from '../components/layout/VaultGuideHeader'
import '../styles/guide-pages-theme.css'

export default function Collections() {
  const savedDiscoveries = useAppStore((state) => state.savedDiscoveries)
  const toggleDiscovery = useAppStore((state) => state.toggleDiscovery)
  const cards = DISCOVERY_CARDS.filter((card) => savedDiscoveries.includes(card.id))

  return (
    <main className="collections-page immersive-page">
      <VaultGuideHeader backTo="/" />
      <header className="collections-header">
        <span><Bookmark size={15} /> Your collections</span>
        <h1>My Bengal Trip</h1>
        <p>{cards.length} saved idea{cards.length === 1 ? '' : 's'}, available on this device.</p>
      </header>
      {cards.length === 0 ? (
        <section className="collections-empty glass">
          <Heart size={30} />
          <h2>Start with what you love</h2>
          <p>Discover local places, food and culture, then save them here.</p>
          <Link to="/discover">Explore the feed</Link>
        </section>
      ) : (
        <section className="collection-grid">
          {cards.map((card) => (
            <article key={card.id} className={`collection-card discovery-${card.tone}`}>
              <div className="collection-card-photo" />
              <div><span>{card.badge}</span><h2>{card.title}</h2><p><MapPin size={13} /> {card.region}</p></div>
              <button onClick={() => toggleDiscovery(card.id)} aria-label={`Remove ${card.title}`}><Trash2 size={16} /></button>
            </article>
          ))}
        </section>
      )}
    </main>
  )
}
