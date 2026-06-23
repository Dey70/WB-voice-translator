import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Mic, Compass, Bookmark, Home, Sun, Moon, Menu, X, MessageSquare, BookOpen, MapPinned, ShieldAlert, History, HeartHandshake, Landmark } from 'lucide-react'
import { useAppStore } from '../../store/appStore'

const navItems = [
  { to: '/',             icon: Home,          label: 'Home'         },
  { to: '/translate',    icon: Mic,           label: 'Translate'    },
  { to: '/discover',     icon: Compass,       label: 'Discover'     },
  { to: '/collections',  icon: Bookmark,      label: 'Collections', mobileLabel: 'Saved' },
]

const mobileNavItems = [
  { to: '/discover', icon: Compass, label: 'Explore' },
  { to: '/phrases', icon: BookOpen, label: 'Phrases' },
  { to: '/translate', icon: Mic, label: 'Translate', primary: true },
  { to: '/guide', icon: Landmark, label: 'Guide' },
]

const moreItems = [
  { to: '/conversation', icon: MessageSquare, label: 'Conversation', detail: 'Two-person voice translation' },
  { to: '/phrases', icon: BookOpen, label: 'Phrasebook', detail: 'Useful phrases available offline' },
  { to: '/places', icon: MapPinned, label: 'Places & seasons', detail: 'Sightseeing and trip planning' },
  { to: '/culture', icon: HeartHandshake, label: 'Cultural guide', detail: 'Customs, etiquette and festivals' },
  { to: '/history', icon: History, label: 'Translation history', detail: 'Saved activity on this device' },
  { to: '/emergency', icon: ShieldAlert, label: 'Emergency', detail: 'SOS phrases and verified numbers', urgent: true },
]

const isNavActive = (pathname, to) => {
  if (to === '/') return pathname === '/'
  return pathname === to
}

export default function Navbar() {
  const location = useLocation()
  const { darkMode, toggleDarkMode } = useAppStore()
  const [moreOpen, setMoreOpen] = useState(false)

  if (location.pathname === '/places' || location.pathname === '/places/explore' || location.pathname === '/places/seasons') return (
    <>
      {moreOpen && <button className="more-backdrop" aria-label="Close menu" onClick={() => setMoreOpen(false)} />}
      <aside id="more-menu" className={`more-menu ${moreOpen ? 'open' : ''}`} aria-hidden={!moreOpen}>
        <header><div><span>Explore KothaSetu</span><strong>More tools</strong></div><button onClick={() => setMoreOpen(false)} aria-label="Close menu"><X size={19} /></button></header>
        <div className="more-menu-grid">
          {moreItems.map(({ to, icon: Icon, label, detail, urgent }) => (
            <Link key={to} to={to} onClick={() => setMoreOpen(false)} className={urgent ? 'urgent' : ''} tabIndex={moreOpen ? 0 : -1}>
              <span><Icon size={19} /></span><div><strong>{label}</strong><small>{detail}</small></div>
            </Link>
          ))}
        </div>
      </aside>
      <nav className="mobile-nav mobile-nav-bar" aria-label="Main navigation" style={{
        display: 'none',
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: darkMode ? 'rgba(28, 15, 5, 0.97)' : 'rgba(253, 246, 233, 0.97)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border)',
        zIndex: 50,
        paddingBottom: 'env(safe-area-inset-bottom, 8px)',
        transition: 'background 0.3s',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', width: '100%' }}>
          {mobileNavItems.map(({ to, icon: Icon, label, primary }) => {
            const active = isNavActive(location.pathname, to)
            return (
              <Link key={to} to={to} className={`mobile-tab-link${primary ? ' primary' : ''}`} aria-current={active ? 'page' : undefined} style={{
                textDecoration: 'none', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 3, padding: '10px 0 8px',
                color: active ? 'var(--accent-secondary)' : 'var(--text-muted)',
              }}>
                <div className="mobile-tab-icon" style={{
                  width: 36, height: 28, borderRadius: 10,
                  background: active ? 'rgba(200,86,10,0.12)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}>
                  <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                </div>
                <span style={{
                  fontSize: 10, fontWeight: active ? 600 : 400,
                  textAlign: 'center', whiteSpace: 'nowrap',
                  color: active ? 'var(--accent-secondary)' : 'var(--text-muted)',
                }}>{label}</span>
              </Link>
            )
          })}
          <button className="mobile-tab-link mobile-more" onClick={() => setMoreOpen(true)} aria-expanded={moreOpen}>
            <div className="mobile-tab-icon"><Menu size={20} /></div><span>More</span>
          </button>
        </div>
      </nav>
    </>
  )

  return (
    <>
      {/* Top navbar */}
      <nav className="app-navbar" aria-label="Site navigation" style={{
        background: darkMode ? 'rgba(28, 15, 5, 0.94)' : 'rgba(253, 246, 233, 0.94)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 50,
        transition: 'background 0.3s',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          padding: '0 16px',
          display: 'flex', alignItems: 'center', height: 60,
        }}>
          {/* Bengali wordmark from the mobile design system */}
          <Link to="/" className="brand-logo-link" aria-label="KothaSetu - go to home">
            <div className="brand-logo"><span>কথা</span><b>সেতু</b></div>
          </Link>

          {/* Desktop nav links */}
          <div style={{ display: 'flex', gap: 2, flex: 1 }} className="desktop-nav">
            {navItems.map(({ to, icon: Icon, label }) => {
              const active = isNavActive(location.pathname, to)
              return (
                <Link key={to} to={to} aria-current={active ? 'page' : undefined} style={{
                  textDecoration: 'none',
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 14px', borderRadius: 8,
                  fontSize: 14, fontWeight: active ? 600 : 400,
                  color: active ? 'var(--accent-secondary)' : 'var(--text-secondary)',
                  background: active ? 'rgba(200, 86, 10, 0.1)' : 'transparent',
                  transition: 'all 0.2s', whiteSpace: 'nowrap',
                }}>
                  <Icon size={15} />
                  <span>{label}</span>
                </Link>
              )
            })}
          </div>

          {/* Mobile: centered page title */}
          <div className="mobile-nav" style={{ display: 'none', flex: 1, justifyContent: 'center' }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
              {location.pathname === '/history'
                ? 'Translation History'
                : location.pathname === '/guide'
                  ? 'Guide'
                  : location.pathname === '/culture' || location.pathname.startsWith('/places')
                  ? 'Explore'
                  : location.pathname === '/phrases'
                    ? 'Phrasebook'
                    : location.pathname === '/emergency'
                      ? 'Emergency'
                  : navItems.find(n => n.to === location.pathname)?.label || 'KothaSetu'}
            </span>
          </div>

          <button
            className="theme-toggle"
            onClick={toggleDarkMode}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-pressed={darkMode}
            style={{
            background: darkMode ? 'rgba(200,86,10,0.15)' : 'rgba(200,150,12,0.12)',
            border: darkMode ? '1px solid rgba(200,86,10,0.35)' : '1px solid rgba(200,150,12,0.35)',
            borderRadius: 8, padding: '7px 9px', cursor: 'pointer',
            color: darkMode ? '#E8872A' : '#C8960C',
            display: 'flex', alignItems: 'center', gap: 5,
            flexShrink: 0, transition: 'all 0.25s',
            fontSize: 11, fontWeight: 600,
          }}>
            {darkMode ? <><Sun size={14} /> <span>Day</span></> : <><Moon size={14} /> <span>Night</span></>}
          </button>
          <button className="more-trigger" onClick={() => setMoreOpen((open) => !open)} aria-expanded={moreOpen} aria-controls="more-menu">
            {moreOpen ? <X size={17} /> : <Menu size={17} />}
            <span>More</span>
          </button>
        </div>
      </nav>

      {moreOpen && <button className="more-backdrop" aria-label="Close menu" onClick={() => setMoreOpen(false)} />}
      <aside id="more-menu" className={`more-menu ${moreOpen ? 'open' : ''}`} aria-hidden={!moreOpen}>
        <header><div><span>Explore KothaSetu</span><strong>More tools</strong></div><button onClick={() => setMoreOpen(false)} aria-label="Close menu"><X size={19} /></button></header>
        <div className="more-menu-grid">
          {moreItems.map(({ to, icon: Icon, label, detail, urgent }) => (
            <Link key={to} to={to} onClick={() => setMoreOpen(false)} className={urgent ? 'urgent' : ''} tabIndex={moreOpen ? 0 : -1}>
              <span><Icon size={19} /></span><div><strong>{label}</strong><small>{detail}</small></div>
            </Link>
          ))}
        </div>
      </aside>

      {/* Mobile bottom tab bar */}
      <nav className="mobile-nav mobile-nav-bar" aria-label="Main navigation" style={{
        display: 'none',
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: darkMode ? 'rgba(28, 15, 5, 0.97)' : 'rgba(253, 246, 233, 0.97)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border)',
        zIndex: 50,
        paddingBottom: 'env(safe-area-inset-bottom, 8px)',
        transition: 'background 0.3s',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          width: '100%',
        }}>
          {mobileNavItems.map(({ to, icon: Icon, label, primary }) => {
            const active = isNavActive(location.pathname, to)
            return (
              <Link key={to} to={to} className={`mobile-tab-link${primary ? ' primary' : ''}`} aria-current={active ? 'page' : undefined} style={{
                textDecoration: 'none',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 3, padding: '10px 0 8px',
                color: active ? 'var(--accent-secondary)' : 'var(--text-muted)',
              }}>
                <div className="mobile-tab-icon" style={{
                  width: 36, height: 28, borderRadius: 10,
                  background: active ? 'rgba(200,86,10,0.12)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}>
                  <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                </div>
                <span style={{
                  fontSize: 10, fontWeight: active ? 600 : 400,
                  textAlign: 'center', whiteSpace: 'nowrap',
                  color: active ? 'var(--accent-secondary)' : 'var(--text-muted)',
                }}>{label}</span>
              </Link>
            )
          })}
          <button className="mobile-tab-link mobile-more" onClick={() => setMoreOpen(true)} aria-expanded={moreOpen}>
            <div className="mobile-tab-icon"><Menu size={20} /></div><span>More</span>
          </button>
        </div>
      </nav>
    </>
  )
}
