import { useState } from 'react'
import { Trash2, Star, Search, Volume2, Download, Clock, ArrowRight } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { getLanguage } from '../utils/constants'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'

export default function History() {
  const { history, deleteFromHistory, clearHistory, toggleFavorite, isFavorite } = useAppStore()
  const { speak } = useSpeechSynthesis()
  const [search, setSearch] = useState('')

  const filtered = history.filter((h) =>
    (h.originalText || '').toLowerCase().includes(search.toLowerCase()) ||
    (h.translatedText || '').toLowerCase().includes(search.toLowerCase())
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

  const formatDate = (iso) => {
    if (!iso) return ''
    const d = new Date(iso)
    return d.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' }) +
      ' at ' + d.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700 }}>Translation <span className="gradient-text">History</span></h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>
            {history.length} translation{history.length !== 1 ? 's' : ''} saved locally on this device
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={exportHistory} disabled={history.length === 0} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 8,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            color: 'var(--text-secondary)', cursor: history.length > 0 ? 'pointer' : 'not-allowed',
            fontSize: 13, opacity: history.length === 0 ? 0.5 : 1,
          }}>
            <Download size={14} /> Export JSON
          </button>
          <button onClick={clearHistory} disabled={history.length === 0} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 8,
            background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)',
            color: '#f87171', cursor: history.length > 0 ? 'pointer' : 'not-allowed',
            fontSize: 13, opacity: history.length === 0 ? 0.5 : 1,
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
          placeholder="Search your translations..."
          style={{
            width: '100%', padding: '12px 16px 12px 42px',
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 10, color: 'var(--text-primary)', fontSize: 14, outline: 'none',
            fontFamily: 'inherit',
          }}
        />
        {search && (
          <button onClick={() => setSearch('')} style={{
            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16,
          }}>x</button>
        )}
      </div>

      {search && (
        <div style={{ marginBottom: 16, fontSize: 13, color: 'var(--text-muted)' }}>
          {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"
        </div>
      )}

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📜</div>
          <div style={{ fontSize: 16, marginBottom: 8, color: 'var(--text-secondary)' }}>
            {search ? 'No results found' : 'No translations yet'}
          </div>
          <div style={{ fontSize: 13 }}>
            {search ? 'Try a different search term' : 'Start translating and your history will appear here'}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((item, index) => {
            const from = getLanguage(item.fromLang)
            const to = getLanguage(item.toLang)
            const fav = isFavorite(item.id)
            const charCount = (item.originalText || '').length

            return (
              <div key={item.id} className="glass fade-in" style={{ borderRadius: 14, padding: 20, transition: 'all 0.2s' }}>
                
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {/* Language pair badge */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '4px 10px', borderRadius: 20,
                      background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                      fontSize: 12,
                    }}>
                      <span style={{ color: from.color, fontWeight: 600 }}>{from.flag} {from.name}</span>
                      <ArrowRight size={12} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ color: to.color, fontWeight: 600 }}>{to.flag} {to.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)' }}>
                      <Clock size={11} />
                      {formatDate(item.timestamp)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={() => toggleFavorite(item.id)} title={fav ? 'Remove from favorites' : 'Add to favorites'} style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: fav ? 'rgba(251,191,36,0.1)' : 'transparent',
                      border: '1px solid ' + (fav ? 'rgba(251,191,36,0.3)' : 'var(--border)'),
                      cursor: 'pointer', color: fav ? '#fbbf24' : 'var(--text-muted)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Star size={14} fill={fav ? '#fbbf24' : 'none'} />
                    </button>
                    <button onClick={() => speak(item.translatedText, item.toLang)} title="Speak translation" style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: 'transparent', border: '1px solid var(--border)',
                      cursor: 'pointer', color: 'var(--text-muted)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Volume2 size={14} />
                    </button>
                    <button onClick={() => deleteFromHistory(item.id)} title="Delete" style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: 'transparent', border: '1px solid var(--border)',
                      cursor: 'pointer', color: 'var(--text-muted)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Text content */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 12, alignItems: 'start' }}>
                  {/* Original */}
                  <div style={{ padding: '12px 14px', background: 'var(--bg-secondary)', borderRadius: 10, borderLeft: '3px solid ' + from.color }}>
                    <div style={{ fontSize: 11, color: from.color, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {from.flag} {from.nativeName}
                    </div>
                    <div style={{ fontSize: 16, color: 'var(--text-primary)', lineHeight: 1.6 }}>
                      {item.originalText}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
                      {charCount} character{charCount !== 1 ? 's' : ''}
                    </div>
                  </div>

                  {/* Arrow */}
                  <div style={{ paddingTop: 20, color: 'var(--text-muted)' }}>
                    <ArrowRight size={16} />
                  </div>

                  {/* Translation */}
                  <div style={{ padding: '12px 14px', background: 'var(--bg-secondary)', borderRadius: 10, borderLeft: '3px solid ' + to.color }}>
                    <div style={{ fontSize: 11, color: to.color, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {to.flag} {to.nativeName}
                    </div>
                    <div style={{ fontSize: 16, color: 'var(--text-primary)', lineHeight: 1.6 }}>
                      {item.translatedText}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
                      {(item.translatedText || '').length} character{(item.translatedText || '').length !== 1 ? 's' : ''}
                    </div>
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
