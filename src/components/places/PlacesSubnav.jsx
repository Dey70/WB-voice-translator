import { Link, useLocation } from 'react-router-dom'
import { CalendarRange, Map, MapPinned, UtensilsCrossed } from 'lucide-react'

const LABELS = {
  en:{ explore:'Explore Nearby', routes:'Route Map', seasons:'Seasonal Guide', food:'Local Food' },
  bn:{ explore:'কাছাকাছি ঘুরুন', seasons:'ঋতুভিত্তিক গাইড', food:'স্থানীয় খাবার' },
  ne:{ explore:'नजिकका ठाउँ', seasons:'मौसमी गाइड', food:'स्थानीय खाना' },
  hi:{ explore:'आसपास घूमें', seasons:'मौसमी गाइड', food:'स्थानीय भोजन' },
}

export default function PlacesSubnav({ language = 'en' }) {
  const { pathname } = useLocation()
  const labels = LABELS[language] || LABELS.en
  return <nav className="places-subnav" aria-label="Places planning">
    <Link className={pathname === '/places/explore' ? 'active' : ''} to="/places/explore"><MapPinned size={15}/> {labels.explore}</Link>
    <Link className={pathname === '/places/routes' ? 'active' : ''} to="/places/routes"><Map size={15}/> {labels.routes || LABELS.en.routes}</Link>
    <Link className={pathname === '/places/seasons' ? 'active' : ''} to="/places/seasons"><CalendarRange size={15}/> {labels.seasons}</Link>
    <Link className={pathname === '/places/food' ? 'active' : ''} to="/places/food"><UtensilsCrossed size={15}/> {labels.food}</Link>
  </nav>
}
