import { Link } from 'react-router-dom'
import { MapPinned, HeartHandshake, ChevronRight, Sun, Compass } from 'lucide-react'

const guideItems = [
  {
    to: '/places',
    icon: MapPinned,
    label: 'Places & Seasons',
    nativeLabel: 'স্থান ও ঋতু',
    description: 'Explore sightseeing spots, plan trips by season, and discover the best of West Bengal.',
    accentColor: '#0D7377',
    bgColor: 'rgba(13,115,119,0.08)',
    borderColor: 'rgba(13,115,119,0.22)',
    iconBg: 'linear-gradient(135deg,#0D7377,#14A98A)',
  },
  {
    to: '/culture',
    icon: HeartHandshake,
    label: 'Cultural Guide',
    nativeLabel: 'সাংস্কৃতিক গাইড',
    description: 'Understand local customs, etiquette, festivals, and traditions for a respectful visit.',
    accentColor: '#C8560A',
    bgColor: 'rgba(200,86,10,0.08)',
    borderColor: 'rgba(200,86,10,0.22)',
    iconBg: 'linear-gradient(135deg,#C8560A,#E8872A)',
  },
]

export default function Guide() {
  return (
    <main className="immersive-page" style={{ maxWidth: 680, margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <h1 style={{ fontSize: 'clamp(24px,5vw,34px)', fontWeight: 700, marginBottom: 8 }}>
          <span className="gradient-text">Travel</span> Guide
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(13px,2vw,15px)', maxWidth: 380, margin: '0 auto' }}>
          Discover West Bengal — places to visit, the best seasons to go, and cultural insights for a meaningful journey.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {guideItems.map(({ to, icon: Icon, label, nativeLabel, description, accentColor, bgColor, borderColor, iconBg }) => (
          <Link
            key={to}
            to={to}
            style={{
              display: 'flex', alignItems: 'center', gap: 20,
              padding: '22px 24px',
              borderRadius: 18,
              background: bgColor,
              border: `1px solid ${borderColor}`,
              textDecoration: 'none',
              transition: 'transform 0.18s, box-shadow 0.18s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 28px ${borderColor}` }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
          >
            <div style={{
              width: 60, height: 60, borderRadius: 16, flexShrink: 0,
              background: iconBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 4px 16px ${accentColor}40`,
            }}>
              <Icon size={28} color="white" strokeWidth={1.8} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{label}</span>
                <span style={{ fontSize: 12, color: accentColor, fontWeight: 500 }}>{nativeLabel}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.55 }}>
                {description}
              </p>
            </div>
            <ChevronRight size={20} color={accentColor} style={{ flexShrink: 0 }} />
          </Link>
        ))}
      </div>

      <div className="glass" style={{ borderRadius: 16, padding: '20px 24px', marginTop: 28, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(200,150,12,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Sun size={22} color="#C8960C" />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>Tip for travelers</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            October to March is the best time to visit West Bengal — pleasant weather, vibrant festivals, and lush landscapes.
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <Link to="/discover" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 13, color: 'var(--accent-secondary)',
          textDecoration: 'none', fontWeight: 500,
        }}>
          <Compass size={14} /> Also browse Discover for more inspiration
        </Link>
      </div>
    </main>
  )
}
