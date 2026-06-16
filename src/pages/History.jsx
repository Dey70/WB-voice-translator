import { useState } from 'react'
import { Trash2, Star, Search, Volume2, Download } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { getLanguage } from '../utils/constants'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'

export default function History() {
  const { history, deleteFromHistory, clearHistory, toggleFavorite, isFavorite } = useAppStore()
  const { speak } = useSpeechSynthesis()
  const [search, setSearch] = useState('')

  const filtered = history.filter((h) =>
    h.originalText?.toLowerCase().includes(search.toLowerCase()) ||
    h.translatedText?.toLowerCase().includes(search.toLowerCase())
  )

  const exportHistory = () => {
    const data = JSON.stringify(history, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'kothasetu-history.json'
    a.click()
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700 }}>Translation <span className="gradient-text">History</span></h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>{history.length} translations saved</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={exportHistory} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 8,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 13,
          }}>
            <Download size={14} /> Export
          </button>
          <button onClick={clearHistory} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 8,
            background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)',
            color: '#f87171', cursor: 'pointer', fontSize: 13,
          }}>
            <Trash2 size={14} /> Clear All
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 24 }}>
        <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search translations..."
          style={{
            width: '100%', padding: '12px 16px 12px 42px',
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 10, color: 'var(--text-primary)', fontSize: 14, outline: 'none',
          }}
        />
      </div>

      {/* History list */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>ðŸ“œ</div>
          <div>{search ? 'No results found' : 'No translations yet â€” start translating!'}</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((item) => {
            const from = getLanguage(item.fromLang)
            const to = getLanguage(item.toLang)
            const fav = isFavorite(item.id)
            return (
              <div key={item.id} className="glass fade-in" style={{ borderRadius: 12, padding: 18 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    {/* Languages */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <span style={{ fontSize: 13, color: from.color, fontWeight: 600 }}>{from.flag} {from.nativeName}</span>
                      <span style={{ color: 'var(--text-muted)' }}>â†’</span>
                      <span style={{ fontSize: 13, color: to.color, fontWeight: 600 }}>{to.flag} {to.nativeName}</span>
                      <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)' }}>
                        {new Date(item.timestamp).toLocaleDateString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Texts */}
                    <div style={{ fontSize: 15, color: 'var(--text-primary)', marginBottom: 6 }}>{item.originalText}</div>
                    <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{item.translatedText}</div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <button onClick={() => toggleFavorite(item.id)} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: fav ? '#fbbf24' : 'var(--text-muted)', padding: 4,
                    }}>
                      <Star size={16} fill={fav ? '#fbbf24' : 'none'} />
                    </button>
                    <button onClick={() => speak(item.translatedText, item.toLang)} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--text-muted)', padding: 4,
                    }}>
                      <Volume2 size={16} />
                    </button>
                    <button onClick={() => deleteFromHistory(item.id)} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--text-muted)', padding: 4,
                    }}>
                      <Trash2 size={16} />
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

