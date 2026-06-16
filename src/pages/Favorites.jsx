import { Star, Volume2 } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { getLanguage } from '../utils/constants'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'

export default function Favorites() {
  const { favorites, toggleFavorite } = useAppStore()
  const { speak } = useSpeechSynthesis()

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 20px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>â­ <span className="gradient-text">Favorites</span></h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>{favorites.length} saved translations</p>
      </div>

      {favorites.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>â­</div>
          <div style={{ fontSize: 16, marginBottom: 6 }}>No favorites yet</div>
          <div style={{ fontSize: 13 }}>Tap the star icon on any translation in History to save it here</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {favorites.map((item) => {
            const from = getLanguage(item.fromLang)
            const to = getLanguage(item.toLang)
            return (
              <div key={item.id} className="glass fade-in" style={{ borderRadius: 12, padding: 18 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <span style={{ fontSize: 13, color: from.color, fontWeight: 600 }}>{from.flag} {from.nativeName}</span>
                      <span style={{ color: 'var(--text-muted)' }}>â†’</span>
                      <span style={{ fontSize: 13, color: to.color, fontWeight: 600 }}>{to.flag} {to.nativeName}</span>
                    </div>
                    <div style={{ fontSize: 15, color: 'var(--text-primary)', marginBottom: 6 }}>{item.originalText}</div>
                    <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{item.translatedText}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <button onClick={() => toggleFavorite(item.id)} style={{
                      background: 'none', border: 'none', cursor: 'pointer', color: '#fbbf24', padding: 4,
                    }}>
                      <Star size={16} fill="#fbbf24" />
                    </button>
                    <button onClick={() => speak(item.translatedText, item.toLang)} style={{
                      background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4,
                    }}>
                      <Volume2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

