import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Clock3,
  MapPinned,
  MessageSquare,
  Mic,
  ShieldAlert,
  Sparkles,
} from 'lucide-react'
import { useAppStore } from '../store/appStore'

const quickActions = [
  {
    to: '/conversation',
    icon: MessageSquare,
    title: 'Have a conversation',
    description: 'Use a simple two-person translation view.',
    tone: 'teal',
  },
  {
    to: '/phrases',
    icon: BookOpen,
    title: 'Find a useful phrase',
    description: 'Browse practical phrases for common situations.',
    tone: 'gold',
  },
  {
    to: '/places',
    icon: MapPinned,
    title: 'Explore the region',
    description: 'Discover places, seasons, and local culture.',
    tone: 'violet',
  },
]

export default function Home() {
  const history = useAppStore((state) => state.history)
  const latestTranslation = history[0]

  return (
    <main className="home-page">
      <section className="home-hero glass">
        <div className="home-hero-copy">
          <span className="home-eyebrow"><Sparkles size={14} /> Your local travel companion</span>
          <h1>Travel with fewer language barriers.</h1>
          <p>Translate, communicate, and explore West Bengal and its surrounding regions with more confidence.</p>
          <Link to="/translate" className="home-primary-action">
            <span><Mic size={22} /></span>
            <div><strong>Start translating</strong><small>Speak or type a message</small></div>
            <ArrowRight size={20} />
          </Link>
        </div>
        <div className="home-language-mark" aria-hidden="true">
          <strong>ক</strong><span>अ</span><small>A</small>
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-heading">
          <div><span>Quick actions</span><h2>What do you need right now?</h2></div>
        </div>
        <div className="home-action-grid">
          {quickActions.map(({ to, icon: Icon, title, description, tone }) => (
            <Link to={to} className="home-action-card glass" key={to}>
              <span className={`home-action-icon ${tone}`}><Icon size={21} /></span>
              <div><strong>{title}</strong><p>{description}</p></div>
              <ArrowRight size={17} />
            </Link>
          ))}
        </div>
      </section>

      {latestTranslation && (
        <section className="home-recent glass">
          <span className="home-action-icon recent"><Clock3 size={19} /></span>
          <div>
            <small>Continue where you left off</small>
            <strong>{latestTranslation.originalText}</strong>
            <p>{latestTranslation.translatedText}</p>
          </div>
          <Link to="/history">View history <ArrowRight size={15} /></Link>
        </section>
      )}

      <Link to="/emergency" className="home-emergency">
        <span><ShieldAlert size={22} /></span>
        <div><strong>Need urgent help?</strong><small>Open emergency phrases and verified contact numbers</small></div>
        <ArrowRight size={18} />
      </Link>
    </main>
  )
}
