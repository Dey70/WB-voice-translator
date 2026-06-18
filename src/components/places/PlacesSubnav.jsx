import { Link, useLocation } from 'react-router-dom'
import { CalendarRange, MapPinned } from 'lucide-react'

const LABELS = {
  en:{ explore:'Explore Nearby', seasons:'Seasonal Guide' }, bn:{ explore:'কাছাকাছি ঘুরুন', seasons:'ঋতুভিত্তিক গাইড' },
  ne:{ explore:'नजिकका ठाउँ', seasons:'मौसमी गाइड' }, hi:{ explore:'आसपास घूमें', seasons:'मौसमी गाइड' },
}

export default function PlacesSubnav({ language = 'en' }) {
  const { pathname } = useLocation()
  const labels = LABELS[language]
  return (
    <nav className="places-subnav" aria-label="Places planning">
      <Link className={pathname === '/places/explore' ? 'active' : ''} to="/places/explore"><MapPinned size={15} /> {labels.explore}</Link>
      <Link className={pathname === '/places/seasons' ? 'active' : ''} to="/places/seasons"><CalendarRange size={15} /> {labels.seasons}</Link>
    </nav>
  )
}
