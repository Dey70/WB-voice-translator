import { Star, Volume2, ArrowRight, Heart } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { getLanguage } from '../utils/constants'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'

export default function Favorites() {
  const { favorites, toggleFavorite } = useAppStore()
  const { speak } = useSpeechSynthesis()

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 20px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 28, fontWeight: 700, fontFamily: "'Playfair Display',serif" }}>
          <Heart size={25} color="var(--accent-gold)" /> <span className="gradient-text">Favorites</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>
          {favorites.length} saved translation{favorites.length !== 1 ? 's' : ''}
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="glass" style={{ textAlign: 'center', padding: '56px 32px', borderRadius: 18 }}>
          <div style={{ width: 62, height: 62, display: 'grid', placeItems: 'center', margin: '0 auto 14px', borderRadius: 20, background: 'rgba(200,150,12,.12)', color: 'var(--accent-gold)' }}><Heart size={30} /></div>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6, fontFamily: "'Playfair Display',serif" }}>
            No favorites yet
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 280, margin: '0 auto', lineHeight: 1.6 }}>
            Tap the star on any translation in History to light it up here
          </div>
          {/* Decorative rangoli dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
            {['#C8560A','#C8960C','#0D7377','#C8960C','#C8560A'].map((c, i) => (
              <div key={i} style={{ width: i === 2 ? 10 : 6, height: i === 2 ? 10 : 6, borderRadius: '50%', background: c, opacity: 0.6 }}/>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {favorites.map((item) => {
            const from = getLanguage(item.fromLang)
            const to = getLanguage(item.toLang)
            return (
              <div key={item.id} className="glass fade-in" style={{ borderRadius: 14, padding: 18, borderLeft: '3px solid var(--accent-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    {/* Language route */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <span style={{
                        padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                        background: (from?.color || '#C8560A') + '18', color: from?.color || '#C8560A',
                      }}>{from?.nativeName || item.fromLangName}</span>
                      <ArrowRight size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                      <span style={{
                        padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                        background: (to?.color || '#0D7377') + '18', color: to?.color || '#0D7377',
                      }}>{to?.nativeName || item.toLangName}</span>
                    </div>
                    <div style={{ fontSize: 15, color: 'var(--text-primary)', marginBottom: 6, fontFamily: "'Tiro Bangla','Noto Sans Bengali',sans-serif", lineHeight: 1.6 }}>
                      {item.originalText}
                    </div>
                    <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.translatedText}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {/* Star — filled gold diya glow */}
                    <button onClick={() => toggleFavorite(item.id)} title="Remove from favorites" style={{
                      width: 34, height: 34, borderRadius: 10,
                      background: 'rgba(200,150,12,0.15)',
                      border: '1px solid rgba(200,150,12,0.4)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s',
                      boxShadow: '0 0 8px rgba(200,150,12,0.3)',
                    }}>
                      <Star size={15} fill="#C8960C" color="#C8960C" />
                    </button>
                    {/* Speak */}
                    <button onClick={() => speak(item.translatedText, item.toLang)} title="Listen" style={{
                      width: 34, height: 34, borderRadius: 10,
                      background: 'rgba(200,86,10,0.1)',
                      border: '1px solid rgba(200,86,10,0.3)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s',
                      color: 'var(--accent-primary)',
                    }}>
                      <Volume2 size={15} />
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
