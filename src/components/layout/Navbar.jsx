import { Link, useLocation } from 'react-router-dom'
import { MessageSquare, Mic, History, BookOpen, Sun, Moon } from 'lucide-react'
import { useAppStore } from '../../store/appStore'

const navItems = [
  { to: '/', icon: Mic, label: 'Translate' },
  { to: '/conversation', icon: MessageSquare, label: 'Chat' },
  { to: '/history', icon: History, label: 'History' },
  { to: '/phrases', icon: BookOpen, label: 'Phrases' },
]

export default function Navbar() {
  const location = useLocation()
  const { darkMode, toggleDarkMode } = useAppStore()

  return (
    <>
      {/* Top navbar */}
      <nav style={{
        background: darkMode ? 'rgba(10, 10, 15, 0.92)' : 'rgba(244, 244, 248, 0.92)',
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
              width: 34, height: 34, borderRadius: 9,
              background: 'linear-gradient(135deg, #6c63ff, #2dd4bf)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 700, color: 'white',
            }}>K</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
                কথাসেতু
              </div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: 1.5 }}>KOTHASETU</div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div style={{ display: 'flex', gap: 2, flex: 1 }} className="desktop-nav">
            {navItems.map(({ to, icon: Icon, label }) => {
              const active = location.pathname === to
              return (
                <Link key={to} to={to} style={{
                  textDecoration: 'none',
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 14px', borderRadius: 8,
                  fontSize: 14, fontWeight: active ? 600 : 400,
                  color: active ? 'var(--accent-secondary)' : 'var(--text-secondary)',
                  background: active ? 'rgba(108, 99, 255, 0.1)' : 'transparent',
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
              {navItems.find(n => n.to === location.pathname)?.label || 'KothaSetu'}
            </span>
          </div>

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

      {/* Fix 2: Mobile bottom tab bar — proper equal grid, no cramping */}
      <div className="mobile-nav mobile-nav-bar" style={{
        display: 'none',
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: darkMode ? 'rgba(10, 10, 15, 0.97)' : 'rgba(244, 244, 248, 0.97)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border)',
        zIndex: 50,
        paddingBottom: 'env(safe-area-inset-bottom, 8px)',
        transition: 'background 0.3s',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr', // Fix 2: equal 4-column grid
          width: '100%',
        }}>
          {navItems.map(({ to, icon: Icon, label }) => {
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
        </div>
      </div>
    </>
  )
}
