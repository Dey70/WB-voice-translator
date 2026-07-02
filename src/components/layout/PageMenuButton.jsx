import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Home, Landmark, MapPinned, Menu, Mic, Search, ShieldAlert, Train, X } from 'lucide-react'

const links = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/translate', label: 'Translate', icon: Mic },
  { to: '/phrases', label: 'Phrasebook', icon: BookOpen },
  { to: '/places', label: 'Explore', icon: MapPinned },
  { to: '/travel-info', label: 'Travel Info', icon: Train },
  { to: '/guide', label: 'Guide', icon: Landmark },
  { to: '/emergency', label: 'Emergency', icon: ShieldAlert },
]

export default function PageMenuButton({ className = '', onSearch, searchLabel = 'Search this page' }) {
  const [open, setOpen] = useState(false)
  return <>
    <button className={className} type="button" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}><Menu size={19}/></button>
    {open && <div className="page-menu-backdrop" onClick={() => setOpen(false)}>
      <aside className="page-menu-sheet" role="dialog" aria-modal="true" aria-label="Navigation menu" onClick={event => event.stopPropagation()}>
        <div className="page-menu-handle" />
        <header><div><span>KothaSetu</span><strong>Where would you like to go?</strong></div><button onClick={() => setOpen(false)} aria-label="Close menu"><X size={18}/></button></header>
        {onSearch && <button className="page-menu-search" onClick={() => { setOpen(false); onSearch() }}><Search size={18}/><span><strong>{searchLabel}</strong><small>Find something on the current page</small></span></button>}
        <nav>{links.map(({ to, label, icon: Icon }) => <Link key={to} to={to} onClick={() => setOpen(false)}><Icon size={18}/><span>{label}</span></Link>)}</nav>
      </aside>
    </div>}
  </>
}
