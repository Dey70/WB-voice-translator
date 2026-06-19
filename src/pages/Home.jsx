import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Compass, Landmark, MapPin, MessageSquare, Mic, Mountain, Search, ShieldAlert, Star, Trees, UtensilsCrossed } from 'lucide-react'

const quickActions = [
  { to: '/translate', icon: Mic, label: 'Translate', detail: 'Speak or type' },
  { to: '/phrases', icon: BookOpen, label: 'Phrasebook', detail: 'Works offline' },
  { to: '/discover', icon: Compass, label: 'Explore', detail: 'Local ideas' },
  { to: '/emergency', icon: ShieldAlert, label: 'SOS', detail: 'Urgent help', urgent: true },
]

const interests = [
  { icon: Landmark, label: 'Heritage', tone: 'terracotta' },
  { icon: Trees, label: 'Wildlife', tone: 'teal' },
  { icon: UtensilsCrossed, label: 'Food', tone: 'gold' },
  { icon: Mountain, label: 'Hills', tone: 'indigo' },
]

const trending = [
  { title: 'Bishnupur', subtitle: 'Terracotta temples', region: 'Bankura', tone: 'terracotta' },
  { title: 'Darjeeling', subtitle: 'Tea trails and hill walks', region: 'Darjeeling', tone: 'tea' },
  { title: 'Sundarbans', subtitle: 'Guided mangrove journeys', region: 'South Bengal', tone: 'teal' },
]

export default function Home() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const search = (event) => {
    event.preventDefault()
    navigate(query.trim() ? `/places/explore?q=${encodeURIComponent(query.trim())}` : '/discover')
  }

  return (
    <main className="home-page mockup-home">
      <section className="mockup-home-hero">
        <div className="mockup-home-pattern" aria-hidden="true" />
        <div className="mockup-greeting">
          <span>Namaskar, traveller</span>
          <h1>West Bengal,<br />without the <em>language</em> wall.</h1>
          <p>Useful words, local context and calmer journeys, all in one place.</p>
        </div>
      </section>

      <form className="mockup-search" onSubmit={search}>
        <Search size={18} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search places, food or phrases" aria-label="Search KothaSetu" />
        <button type="button" onClick={() => navigate('/translate')} aria-label="Open voice translator"><Mic size={17} /></button>
      </form>

      <section className="mockup-quick-grid" aria-label="Quick actions">
        {quickActions.map(({ to, icon: Icon, label, detail, urgent }) => (
          <Link key={to} to={to} className={urgent ? 'urgent' : ''}><span><Icon size={20} /></span><strong>{label}</strong><small>{detail}</small></Link>
        ))}
      </section>

      <section className="mockup-section">
        <header><div><span>Pick a mood</span><h2>Explore by interest</h2></div><Link to="/discover">See all <ArrowRight size={14} /></Link></header>
        <div className="mockup-interests">
          {interests.map(({ icon: Icon, label, tone }) => (
            <Link key={label} to="/discover"><span className={`interest-ring ${tone}`}><Icon size={22} /></span><strong>{label}</strong></Link>
          ))}
        </div>
      </section>

      <section className="mockup-section">
        <header><div><span>Worth a detour</span><h2>Ideas for your trip</h2></div></header>
        <div className="mockup-trending-rail">
          {trending.map((item) => (
            <Link key={item.title} to="/places/explore" className={`mockup-trend-card ${item.tone}`}>
              <span className="mockup-rating"><Star size={11} fill="currentColor" /> Curated</span>
              <div><small><MapPin size={11} /> {item.region}</small><h3>{item.title}</h3><p>{item.subtitle}</p></div>
            </Link>
          ))}
        </div>
      </section>

      <Link to="/conversation" className="mockup-conversation-cta"><span><MessageSquare size={21} /></span><div><strong>Talking with someone?</strong><small>Open two-person Conversation mode</small></div><ArrowRight size={17} /></Link>
    </main>
  )
}
