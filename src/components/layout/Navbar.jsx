import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MessageSquare, Mic, History, BookOpen, HeartHandshake, MapPinned, ShieldAlert, Sun, Moon, ScanSearch } from 'lucide-react'
import { useAppStore } from '../../store/appStore'

const LEFT_NAV  = [
  { to: '/',            icon: Mic,           label: 'Translate' },
  { to: '/conversation',icon: MessageSquare, label: 'Chat'      },
  { to: '/history',     icon: History,       label: 'History'   },
]
const RIGHT_NAV = [
  { to: '/phrases', icon: BookOpen,       label: 'Phrases' },
  { to: '/places',  icon: MapPinned,      label: 'Places'  },
  { to: '/culture', icon: HeartHandshake, label: 'Culture' },
]
const ALL_NAV = [...LEFT_NAV, ...RIGHT_NAV]

function openGoogleLens() {
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  if (isMobile) {
    // Try native app deep link; fall back to web after 800 ms
    const start = Date.now()
    window.location.href = 'googlelens://'
    setTimeout(() => {
      if (Date.now() - start < 1500) {
        window.open('https://lens.google.com', '_blank', 'noopener')
      }
    }, 800)
  } else {
    window.open('https://lens.google.com', '_blank', 'noopener')
  }
}

export default function Navbar() {
  const location = useLocation()
  const { darkMode, toggleDarkMode } = useAppStore()
  const [lensActive, setLensActive] = useState(false)

  const handleLens = () => {
    setLensActive(true)
    setTimeout(() => { setLensActive(false); openGoogleLens() }, 320)
  }

  const navLink = ({ to, icon: Icon, label }) => {
    const active = to === '/places'
      ? location.pathname.startsWith('/places')
      : location.pathname === to
    return (
      <Link key={to} to={to} style={{
        textDecoration: 'none',
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '7px 14px', borderRadius: 8,
        fontSize: 14, fontWeight: active ? 600 : 400,
        color: active ? 'var(--accent-secondary)' : 'var(--text-secondary)',
        background: active ? 'rgba(108,99,255,0.1)' : 'transparent',
        transition: 'all 0.2s', whiteSpace: 'nowrap',
      }}>
        <Icon size={15} />
        <span>{label}</span>
      </Link>
    )
  }

  return (
    <>
      {/* ── Top navbar ── */}
      <nav style={{
        background: darkMode ? 'rgba(10,10,15,0.92)' : 'rgba(244,244,248,0.92)',
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
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, marginRight: 24, flexShrink: 0 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9,
              background: 'linear-gradient(135deg, #6c63ff, #2dd4bf)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 700, color: 'white',
            }}>K</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>কথাসেতু</div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: 1.5 }}>KOTHASETU</div>
            </div>
          </Link>

          {/* Desktop nav — left group | Lens pill | right group */}
          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            {LEFT_NAV.map(item => navLink(item))}

            {/* ── Desktop Lens pill ── */}
            <button
              onClick={handleLens}
              title="Open Google Lens for translation"
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                margin: '0 10px',
                padding: '7px 16px', borderRadius: 999,
                background: lensActive
                  ? 'linear-gradient(135deg,#2dd4bf,#6c63ff)'
                  : 'linear-gradient(135deg,#6c63ff,#2dd4bf)',
                border: 'none', cursor: 'pointer',
                color: 'white', fontSize: 13, fontWeight: 700,
                boxShadow: lensActive
                  ? '0 0 20px rgba(108,99,255,0.7)'
                  : '0 0 12px rgba(108,99,255,0.35)',
                transform: lensActive ? 'scale(0.93)' : 'scale(1)',
                transition: 'all 0.25s cubic-bezier(.34,1.56,.64,1)',
                flexShrink: 0,
              }}
            >
              <ScanSearch size={15} />
              Lens
            </button>

            {RIGHT_NAV.map(item => navLink(item))}
          </div>

          {/* Mobile: page title */}
          <div className="mobile-nav" style={{ display: 'none', flex: 1, justifyContent: 'center' }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
              {location.pathname === '/emergency'
                ? 'Emergency'
                : location.pathname.startsWith('/places')
                  ? 'Places'
                  : ALL_NAV.find(n => n.to === location.pathname)?.label || 'KothaSetu'}
            </span>
          </div>

          <Link className="desktop-sos" to="/emergency" title="Open Emergency Mode">
            <ShieldAlert size={15} /> SOS
          </Link>

          <button onClick={toggleDarkMode} title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '7px', cursor: 'pointer',
            color: 'var(--text-secondary)', display: 'flex', alignItems: 'center',
            flexShrink: 0, transition: 'all 0.2s',
          }}>
            {darkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </nav>

      {/* ── Mobile bottom tab bar ── */}
      <div className="mobile-nav mobile-nav-bar" style={{
        display: 'none',
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: darkMode ? 'rgba(10,10,15,0.97)' : 'rgba(244,244,248,0.97)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border)',
        zIndex: 50,
        paddingBottom: 'env(safe-area-inset-bottom,8px)',
        transition: 'background 0.3s',
      }}>
        {/* 7-column grid: 3 left tabs | Lens FAB space | 3 right tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3,1fr) 72px repeat(3,1fr)',
          width: '100%',
          alignItems: 'end',
        }}>
          {LEFT_NAV.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to
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
                  background: active ? 'rgba(108,99,255,0.15)' : 'transparent',
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

          {/* ── Center Lens FAB ── */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: 6 }}>
            <button
              onClick={handleLens}
              aria-label="Open Google Lens"
              style={{
                width: 56, height: 56,
                borderRadius: '50%',
                background: lensActive
                  ? 'linear-gradient(135deg,#2dd4bf,#6c63ff)'
                  : 'linear-gradient(135deg,#6c63ff,#2dd4bf)',
                border: '3px solid var(--bg-primary)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: lensActive
                  ? '0 0 28px rgba(108,99,255,0.85), 0 4px 16px rgba(0,0,0,0.4)'
                  : '0 0 16px rgba(108,99,255,0.5), 0 4px 16px rgba(0,0,0,0.35)',
                transform: lensActive ? 'scale(0.88) translateY(0px)' : 'translateY(-10px)',
                transition: 'all 0.25s cubic-bezier(.34,1.56,.64,1)',
                position: 'relative',
              }}
            >
              <ScanSearch size={24} color="white" strokeWidth={2} />
              {/* Pulse ring */}
              <span style={{
                position: 'absolute', inset: -4,
                borderRadius: '50%',
                border: '2px solid rgba(108,99,255,0.4)',
                animation: 'lens-pulse 2.4s ease-in-out infinite',
                pointerEvents: 'none',
              }} />
            </button>
          </div>

          {RIGHT_NAV.map(({ to, icon: Icon, label }) => {
            const active = to === '/places'
              ? location.pathname.startsWith('/places')
              : location.pathname === to
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
                  background: active ? 'rgba(108,99,255,0.15)' : 'transparent',
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
        </div>
      </div>

      <Link className="mobile-sos" to="/emergency" aria-label="Open Emergency Mode">
        <ShieldAlert size={17} /> SOS
      </Link>

      {/* Lens pulse keyframe */}
      <style>{`
        @keyframes lens-pulse {
          0%   { transform: scale(1);   opacity: 0.7; }
          50%  { transform: scale(1.22); opacity: 0; }
          100% { transform: scale(1);   opacity: 0; }
        }
      `}</style>
    </>
  )
}
