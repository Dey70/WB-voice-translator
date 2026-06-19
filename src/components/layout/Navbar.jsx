import { Link, useLocation } from 'react-router-dom'
import { MessageSquare, Mic, BookOpen, MapPinned, ShieldAlert, Sun, Moon } from 'lucide-react'
import { useAppStore } from '../../store/appStore'

const navItems = [
  { to: '/translate',    icon: Mic,           label: 'Translate'    },
  { to: '/conversation', icon: MessageSquare, label: 'Conversation', mobileLabel: 'Chat' },
  { to: '/places',       icon: MapPinned,     label: 'Explore'      },
  { to: '/phrases',      icon: BookOpen,      label: 'Phrasebook', mobileLabel: 'Phrases' },
  { to: '/emergency',    icon: ShieldAlert,   label: 'SOS'          },
]

const isNavActive = (pathname, to) => {
  if (to === '/places') return pathname.startsWith('/places') || pathname === '/culture'
  return pathname === to
}

export default function Navbar() {
  const location = useLocation()
  const { darkMode, toggleDarkMode } = useAppStore()

  return (
    <>
      {/* Top navbar */}
      <nav style={{
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
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, marginRight: 32, flexShrink: 0 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #C8560A, #E8872A)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 700, color: 'white',
              boxShadow: '0 3px 12px rgba(200,86,10,0.35)',
            }}>ক</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1, fontFamily: "'Playfair Display', serif" }}>কথাসেতু</div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: 2 }}>KOTHASETU</div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div style={{ display: 'flex', gap: 2, flex: 1 }} className="desktop-nav">
            {navItems.map(({ to, icon: Icon, label }) => {
              const active = isNavActive(location.pathname, to)
              return (
                <Link key={to} to={to} style={{
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
                : location.pathname === '/culture' || location.pathname.startsWith('/places')
                  ? 'Explore'
                  : navItems.find(n => n.to === location.pathname)?.label || 'KothaSetu'}
            </span>
          </div>

          <button onClick={toggleDarkMode} title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'} style={{
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
        </div>
      </nav>

      {/* Mobile bottom tab bar */}
      <div className="mobile-nav mobile-nav-bar" style={{
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
          gridTemplateColumns: `repeat(${navItems.length}, 1fr)`,
          width: '100%',
        }}>
          {navItems.map(({ to, icon: Icon, label, mobileLabel }) => {
            const active = isNavActive(location.pathname, to)
            return (
              <Link key={to} to={to} style={{
                textDecoration: 'none',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 3, padding: '10px 0 8px',
                color: active ? 'var(--accent-secondary)' : 'var(--text-muted)',
              }}>
                <div style={{
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
                }}>{mobileLabel || label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
