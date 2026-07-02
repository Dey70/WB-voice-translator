import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, Star, Search, Volume2, Download, Clock, ArrowRight, ArrowLeftRight, BookOpen } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { getLanguage } from '../utils/constants'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'
import train2Bg from '../assets/train2.jpg'
import VaultGuideHeader from '../components/layout/VaultGuideHeader'
import '../styles/guide-pages-theme.css'

function AlpanaBar() {
  return (
    <svg className="bh-alpana" viewBox="0 0 240 18" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="9" x2="88" y2="9" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.5" />
      <circle cx="96"  cy="9" r="2"   fill="currentColor" fillOpacity="0.7" />
      <circle cx="108" cy="9" r="4"   fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.7" />
      <circle cx="108" cy="9" r="1.5" fill="currentColor" fillOpacity="0.8" />
      <polygon points="120,4 123,9 120,14 117,9" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.8" />
      <circle cx="132" cy="9" r="4"   fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.7" />
      <circle cx="132" cy="9" r="1.5" fill="currentColor" fillOpacity="0.8" />
      <circle cx="144" cy="9" r="2"   fill="currentColor" fillOpacity="0.7" />
      <line x1="152" y1="9" x2="240" y2="9" stroke="currentColor" strokeOpacity="0.5" strokeWidth="0.8" />
    </svg>
  )
}

export default function History() {
  const { history, deleteFromHistory, clearHistory, toggleFavorite, isFavorite } = useAppStore()
  const { speak } = useSpeechSynthesis()
  const [search, setSearch] = useState('')

  useEffect(() => {
    document.body.classList.add('history-page-active')
    return () => document.body.classList.remove('history-page-active')
  }, [])

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
    <main className="hs-page">

      {/* Background */}
      <div className="pb-bg" aria-hidden="true">
        <img src={train2Bg} alt="" />
        <div className="pb-bg-overlay pb-bg-overlay--overcast" />
      </div>

      <div className="hs-content">

        <VaultGuideHeader backTo="/translate" searchTo="/translate" searchLabel="Return to translator" />
        {/* Legacy header retained structurally but replaced by the shared page header. */}
        <div className="bh-header" hidden>
          <Link to="/" className="bh-brand-block" style={{ textDecoration: 'none' }}>
            <span className="bh-brand">কথাসেতু</span>
            <AlpanaBar />
          </Link>
          <Link to="/translate" className="tr-history-btn" aria-label="Translate">
            <ArrowLeftRight size={15} />
            <span>Translate</span>
          </Link>
        </div>

        {/* Title */}
        <h1 className="tr-heading" style={{ marginBottom: 4 }}>
          <em>Translation</em> History
        </h1>
        <p className="tr-sub">Saved locally on this device</p>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <button onClick={exportHistory} disabled={history.length === 0} style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '10px 22px', borderRadius: 24,
            border: '1.5px solid rgba(255,255,255,.5)',
            background: 'rgba(255,255,255,.18)',
            color: '#fff', fontSize: 13, fontWeight: 700,
            cursor: history.length === 0 ? 'not-allowed' : 'pointer',
            opacity: history.length === 0 ? 0.35 : 1,
            backdropFilter: 'blur(10px)',
            letterSpacing: '.02em',
          }}>
            <Download size={14} /> Export
          </button>
          <button onClick={clearHistory} disabled={history.length === 0} style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '10px 22px', borderRadius: 24,
            border: '1.5px solid rgba(248,113,113,.7)',
            background: 'rgba(192,57,43,.28)',
            color: '#ff9a9a', fontSize: 13, fontWeight: 700,
            cursor: history.length === 0 ? 'not-allowed' : 'pointer',
            opacity: history.length === 0 ? 0.35 : 1,
            backdropFilter: 'blur(10px)',
            letterSpacing: '.02em',
          }}>
            <Trash2 size={14} /> Clear all
          </button>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,.35)' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your translations…"
            className="hs-search"
          />
          {search && (
            <button onClick={() => setSearch('')} style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', color: 'rgba(255,255,255,.4)', cursor: 'pointer', fontSize: 15,
            }}>×</button>
          )}
        </div>

        {search && (
          <div style={{ marginBottom: 14, fontSize: 12, color: 'rgba(255,255,255,.38)' }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"
          </div>
        )}

        {/* Empty state */}
        {filtered.length === 0 ? (
          <div className="hs-empty">
            <BookOpen size={48} style={{ color: 'rgba(255,255,255,.15)', marginBottom: 16 }} />
            <div className="hs-empty-title">
              {search ? 'No results found' : 'No translations yet'}
            </div>
            <div className="hs-empty-sub">
              {search ? 'Try a different search term' : 'Start translating and your history will appear here.'}
            </div>

            {/* Dot row */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, margin: '20px 0' }}>
              {['#C8560A','#C8960C','#0D7377','#C8960C','#C8560A'].map((c, i) => (
                <div key={i} style={{ width: i === 2 ? 10 : 6, height: i === 2 ? 10 : 6, borderRadius: '50%', background: c, opacity: 0.6 }}/>
              ))}
            </div>

            {!search && (
              <Link to="/translate" className="hs-sample-btn">
                See a sample translation
              </Link>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map((item) => {
              const from = getLanguage(item.fromLang)
              const to = getLanguage(item.toLang)
              const fav = isFavorite(item.id)

              return (
                <div key={item.id} className="hs-card fade-in">

                  {/* Card header */}
                  <div className="hs-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="hs-lang-badge">
                        <span style={{ color: from.color, fontWeight: 700 }}>{from.flag} {from.name}</span>
                        <ArrowRight size={11} style={{ color: 'rgba(255,255,255,.3)' }} />
                        <span style={{ color: to.color, fontWeight: 700 }}>{to.flag} {to.name}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => toggleFavorite(item.id)} title={fav ? 'Remove from favorites' : 'Save'} className={`hs-icon-btn ${fav ? 'hs-icon-btn--gold' : ''}`}>
                        <Star size={13} fill={fav ? '#C8960C' : 'none'} />
                      </button>
                      <button onClick={() => speak(item.translatedText, item.toLang)} title="Speak" className="hs-icon-btn">
                        <Volume2 size={13} />
                      </button>
                      <button onClick={() => deleteFromHistory(item.id)} title="Delete" className="hs-icon-btn hs-icon-btn--danger">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'rgba(255,255,255,.3)', marginBottom: 12 }}>
                    <Clock size={10} /> {formatDate(item.timestamp)}
                  </div>

                  {/* Text blocks */}
                  <div className="hs-text-grid">
                    <div className="hs-text-block" style={{ borderLeftColor: from.color }}>
                      <div className="hs-text-label" style={{ color: from.color }}>{from.flag} {from.nativeName}</div>
                      <div className="hs-text-body">{item.originalText}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.25)', flexShrink: 0 }}>
                      <ArrowRight size={14} />
                    </div>
                    <div className="hs-text-block" style={{ borderLeftColor: to.color }}>
                      <div className="hs-text-label" style={{ color: to.color }}>{to.flag} {to.nativeName}</div>
                      <div className="hs-text-body">{item.translatedText}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <style>{`
        .hs-page { min-height:100dvh; position:relative; color:#E8EAF6; }
        .hs-content { position:relative; z-index:1; padding:0 20px calc(104px + env(safe-area-inset-bottom,0px)); max-width:800px; margin:0 auto; }
        .hs-content .bh-header { padding-top:20px; margin-bottom:16px; }

        .hs-action-btn {
          display:flex; align-items:center; gap:7px;
          padding:10px 20px; border-radius:22px; font-size:13px; font-weight:700;
          border:1.5px solid rgba(255,255,255,.35); background:rgba(255,255,255,.14);
          color:#fff; cursor:pointer; transition:all .15s;
          backdrop-filter:blur(8px); letter-spacing:.02em;
        }
        .hs-action-btn:hover:not(:disabled) { background:rgba(255,255,255,.22); border-color:rgba(255,255,255,.55); }
        .hs-action-btn:disabled { opacity:.3; cursor:default; }
        .hs-action-btn--danger { border-color:rgba(248,113,113,.6); color:#ff8a8a; background:rgba(192,57,43,.22); }
        .hs-action-btn--danger:hover:not(:disabled) { background:rgba(192,57,43,.35); border-color:rgba(248,113,113,.8); }

        .hs-search {
          width:100%; padding:12px 16px 12px 44px; box-sizing:border-box;
          background:rgba(18,10,28,.6); border:1px solid rgba(255,255,255,.12);
          border-radius:12px; color:#F4EDE1; font-size:14px; outline:none;
          font-family:inherit; backdrop-filter:blur(14px);
          transition:border-color .15s;
        }
        .hs-search:focus { border-color:rgba(255,255,255,.25); }
        .hs-search::placeholder { color:rgba(255,255,255,.28); }

        .hs-empty {
          text-align:center; padding:56px 24px;
          border-radius:18px;
          background:rgba(18,10,28,.55); border:1px solid rgba(255,255,255,.09);
          backdrop-filter:blur(16px);
          display:flex; flex-direction:column; align-items:center;
        }
        .hs-empty-title { font-size:17px; font-weight:700; color:#F4EDE1; font-family:'Playfair Display',serif; margin-bottom:8px; }
        .hs-empty-sub { font-size:13px; color:rgba(255,255,255,.45); line-height:1.6; max-width:240px; }
        .hs-sample-btn {
          display:inline-block; padding:12px 28px; border-radius:24px;
          border:1px solid rgba(217,164,65,.45); background:rgba(217,164,65,.1);
          color:#D9A441; font-size:14px; font-weight:600; text-decoration:none;
          transition:background .15s;
        }
        .hs-sample-btn:hover { background:rgba(217,164,65,.18); }

        .hs-card {
          padding:18px; border-radius:16px;
          background:rgba(18,10,28,.62); border:1px solid rgba(255,255,255,.1);
          backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px);
          transition:border-color .2s;
        }
        .hs-card:hover { border-color:rgba(255,255,255,.18); }

        .hs-card-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
        .hs-lang-badge {
          display:flex; align-items:center; gap:6px;
          padding:3px 10px; border-radius:20px; font-size:11px;
          background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.12);
        }

        .hs-icon-btn {
          width:30px; height:30px; border-radius:8px;
          background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.12);
          color:rgba(255,255,255,.5); cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          transition:all .15s;
        }
        .hs-icon-btn:hover { background:rgba(255,255,255,.13); color:#fff; }
        .hs-icon-btn--gold { border-color:rgba(200,150,12,.5); color:#C8960C; background:rgba(200,150,12,.12); }
        .hs-icon-btn--danger { border-color:rgba(192,57,43,.3); color:#f87171; }
        .hs-icon-btn--danger:hover { background:rgba(192,57,43,.15); }

        .hs-text-grid { display:grid; grid-template-columns:1fr auto 1fr; gap:10px; align-items:start; }
        .hs-text-block { padding:10px 12px; background:rgba(255,255,255,.05); border-radius:10px; border-left:3px solid; }
        .hs-text-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; margin-bottom:5px; }
        .hs-text-body { font-size:14px; color:#F4EDE1; line-height:1.6; font-family:'Baloo Da 2','Hind Siliguri',sans-serif; }
      `}</style>
    </main>
  )
}
