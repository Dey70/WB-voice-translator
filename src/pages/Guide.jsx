import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronRight, HeartHandshake, MapPinned, Search, ShieldAlert } from 'lucide-react'
import bolpurBg from '../assets/Bolpur.jpg'
import '../styles/guide.css'

const guideSections = [
  {
    heading: 'Before your trip',
    items: [
      {
        to: '/culture',
        title: 'Cultural Guide',
        description: 'Customs, etiquette and traditions for travelling with respect.',
        note: 'Festivals · dress · local courtesy',
        icon: HeartHandshake,
        tone: 'culture',
      },
    ],
  },
  {
    heading: 'Getting around',
    items: [
      {
        to: '/places/routes',
        title: 'Route Map',
        description: 'Plan directions and understand the road before you leave.',
        note: 'Road routes · distance · navigation',
        icon: MapPinned,
        tone: 'route',
      },
    ],
  },
]

export default function Guide() {
  useEffect(() => {
    document.body.classList.add('guide-page-active')
    return () => document.body.classList.remove('guide-page-active')
  }, [])

  return (
    <main className="guide-hub">
      <div className="guide-hub-bg" aria-hidden="true">
        <img src={bolpurBg} alt="" />
        <div />
      </div>

      <div className="guide-hub-shell">
        <header className="guide-hub-header">
          <Link to="/" className="guide-header-action" aria-label="Back to home"><ArrowLeft size={19} /></Link>
          <Link to="/" className="guide-hub-brand" aria-label="KothaSetu home">
            <strong>কথাসেতু</strong>
            <span>Speak. Be understood.</span>
          </Link>
          <Link to="/places/explore" className="guide-header-action" aria-label="Search places"><Search size={18} /></Link>
        </header>

        <section className="guide-hub-intro">
          <span>Travel thoughtfully</span>
          <h1>Guide</h1>
          <p>A few useful things to know before you step out.</p>
        </section>

        {guideSections.map(section => (
          <section className="guide-hub-section" key={section.heading}>
            <h2>{section.heading}</h2>
            {section.items.map(({ to, title, description, note, icon: Icon, tone }) => (
              <Link to={to} className={`guide-hub-card ${tone}`} key={to}>
                <span className="guide-card-icon"><Icon size={22} strokeWidth={1.8} /></span>
                <span className="guide-card-copy">
                  <strong>{title}</strong>
                  <small>{description}</small>
                  <em>{note}</em>
                </span>
                <ChevronRight className="guide-card-arrow" size={17} />
              </Link>
            ))}
          </section>
        ))}

        <section className="guide-hub-section guide-emergency-section">
          <h2>When you need help</h2>
          <Link to="/emergency" className="guide-emergency-card">
            <span className="guide-emergency-icon"><ShieldAlert size={22} /></span>
            <span><strong>SOS & Emergency</strong><small>Essential phrases and important contacts, kept easy to reach.</small></span>
            <ChevronRight size={17} />
          </Link>
        </section>
      </div>
    </main>
  )
}
