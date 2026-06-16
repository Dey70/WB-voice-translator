import { Link, useLocation } from 'react-router-dom'
import { MessageSquare, Mic, History, Star, Settings, Moon, Sun } from 'lucide-react'
import { useAppStore } from '../../store/appStore'

const navItems = [
  { to: '/', icon: Mic, label: 'Translate' },
  { to: '/conversation', icon: MessageSquare, label: 'Conversation' },
  { to: '/history', icon: History, label: 'History' },
  { to: '/favorites', icon: Star, label: 'Favorites' },
]

export default function Navbar() {
  const location = useLocation()
  const { darkMode, toggleDarkMode } = useAppStore()

  return (
    <nav style={{
      background: 'rgba(10, 10, 15, 0.9)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', height: 64 }}>
        
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, marginRight: 40 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #6c63ff, #2dd4bf)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>KS</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
              কথাসেতু
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: 1 }}>KOTHASETU</div>
          </div>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 4, flex: 1 }}>
          {navItems.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to
            return (
              <Link key={to} to={to} style={{
                textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 8,
                fontSize: 14, fontWeight: active ? 600 : 400,
                color: active ? 'var(--accent-secondary)' : 'var(--text-secondary)',
                background: active ? 'rgba(108, 99, 255, 0.1)' : 'transparent',
                transition: 'all 0.2s',
              }}>
                <Icon size={16} />
                <span>{label}</span>
              </Link>
            )
          })}
        </div>

        {/* Theme toggle */}
        <button onClick={toggleDarkMode} style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 8, padding: '8px', cursor: 'pointer',
          color: 'var(--text-secondary)', display: 'flex', alignItems: 'center',
        }}>
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>

      {/* Mobile bottom nav */}
      <div style={{
        display: 'none',
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'rgba(10, 10, 15, 0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border)',
        padding: '8px 0',
        zIndex: 50,
      }} className="mobile-nav">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to
          return (
            <Link key={to} to={to} style={{
              textDecoration: 'none', flex: 1,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              padding: '6px 0',
              color: active ? 'var(--accent-secondary)' : 'var(--text-muted)',
              fontSize: 10,
            }}>
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
