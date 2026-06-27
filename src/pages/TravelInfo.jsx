import { useState, useRef } from 'react'
import { ArrowLeft, ArrowUpDown, Calendar, ChevronRight, Loader2, Plane, Train, Bus, Building2 } from 'lucide-react'

const API_BASE = 'http://localhost:3001'

const TODAY = new Date().toISOString().split('T')[0]

function formatDisplayDate(iso) {
  if (!iso) return ''
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

// ── Confidence band ────────────────────────────────────────────────────────────
function ConfidenceBand({ confidence, note }) {
  const cfg = {
    live:                { dot: '#4FA8A0', bg: 'rgba(15,50,46,0.8)', border: '#1B4D45', label: 'Live' },
    'scheduled-reference':{ dot: '#E0652E', bg: 'rgba(40,13,13,0.8)', border: '#5C2018', label: 'Scheduled reference' },
    'curated-estimate':  { dot: '#D9A441', bg: 'rgba(36,28,0,0.8)',  border: '#5C4A00', label: 'Curated estimate' },
  }[confidence] || { dot: '#9CA3C4', bg: 'rgba(30,30,50,0.8)', border: '#353C66', label: confidence }

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      background: cfg.bg, border: `1px solid ${cfg.border}`,
      borderRadius: 10, padding: '10px 13px', marginBottom: 14,
    }}>
      <span style={{
        width: 8, height: 8, borderRadius: '50%', background: cfg.dot,
        display: 'inline-block', marginTop: 3, flexShrink: 0,
      }} />
      <div>
        <strong style={{
          display: 'block', fontSize: 10, letterSpacing: '.06em',
          textTransform: 'uppercase', color: cfg.dot, marginBottom: 3,
        }}>{cfg.label}</strong>
        <span style={{ fontSize: 12, color: 'rgba(200,205,230,0.85)', lineHeight: 1.55 }}>{note}</span>
      </div>
    </div>
  )
}

// ── Alpona SVG divider ─────────────────────────────────────────────────────────
function Alpona({ color = '#D9A441' }) {
  return (
    <svg viewBox="0 0 380 14" width="100%" height="14" style={{ display: 'block', margin: '14px 0' }} aria-hidden="true">
      <path d="M0 7 Q19 1,38 7 T76 7 T114 7 T152 7 T190 7 T228 7 T266 7 T304 7 T342 7 T380 7"
        fill="none" stroke={color} strokeWidth=".8" opacity=".28" />
      <circle cx="76" cy="7" r="1.2" fill={color} opacity=".38" />
      <circle cx="190" cy="7" r="1.2" fill={color} opacity=".38" />
      <circle cx="304" cy="7" r="1.2" fill={color} opacity=".38" />
    </svg>
  )
}

// ── SCREEN 1: Search form ──────────────────────────────────────────────────────
function SearchScreen({ onSearch }) {
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [date, setDate] = useState(TODAY)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function swap() {
    setOrigin(destination)
    setDestination(origin)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!origin.trim() || !destination.trim()) {
      setError('Please enter both origin and destination.')
      return
    }
    setError(null)
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/overview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin: origin.trim(), destination: destination.trim(), date }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Request failed')
      onSearch(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px 20px 28px' }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: '#D9A441', margin: '0 0 4px', fontWeight: 500 }}>
          Information booklet
        </p>
        <h1 style={{
          fontFamily: 'var(--font-serif, Georgia, serif)',
          fontSize: 26, fontWeight: 500, color: '#F4EDE1', margin: 0,
        }}>
          <em style={{ fontStyle: 'italic', color: '#E0652E' }}>Travel</em> information
        </h1>
        <p style={{ fontSize: 12, color: '#7C82A6', margin: '6px 0 0', lineHeight: 1.6 }}>
          One search, every option laid out — no booking, just real information.
        </p>
      </div>

      <Alpona />

      {/* From / To */}
      <div style={{ position: 'relative', marginBottom: 10 }}>
        <div style={{
          background: '#1F2547', border: '0.5px solid #353C66',
          borderRadius: '12px 12px 0 0', padding: '12px 14px',
        }}>
          <p style={{ fontSize: 9, letterSpacing: '.07em', textTransform: 'uppercase', color: '#7C82A6', margin: '0 0 4px', fontWeight: 500 }}>From</p>
          <input
            value={origin}
            onChange={e => setOrigin(e.target.value)}
            placeholder="City, station or airport"
            style={{
              background: 'transparent', border: 'none', outline: 'none',
              fontSize: 15, fontWeight: 500, color: '#F4EDE1', width: '100%',
              fontFamily: 'inherit',
            }}
          />
        </div>
        <div style={{ height: '0.5px', background: '#2B3158' }} />
        <div style={{
          background: '#1F2547', border: '0.5px solid #353C66',
          borderTop: 'none', borderRadius: '0 0 12px 12px', padding: '12px 14px',
        }}>
          <p style={{ fontSize: 9, letterSpacing: '.07em', textTransform: 'uppercase', color: '#7C82A6', margin: '0 0 4px', fontWeight: 500 }}>To</p>
          <input
            value={destination}
            onChange={e => setDestination(e.target.value)}
            placeholder="City, station or airport"
            style={{
              background: 'transparent', border: 'none', outline: 'none',
              fontSize: 15, fontWeight: 500, color: '#F4EDE1', width: '100%',
              fontFamily: 'inherit',
            }}
          />
        </div>
        {/* Swap button */}
        <button
          type="button"
          onClick={swap}
          aria-label="Swap origin and destination"
          style={{
            position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
            width: 30, height: 30, borderRadius: '50%',
            background: '#161B30', border: '1px solid #4B527A',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', zIndex: 2,
          }}
        >
          <ArrowUpDown size={14} color="#D9A441" />
        </button>
      </div>

      {/* Date */}
      <div style={{
        background: '#1F2547', border: '0.5px solid #353C66',
        borderRadius: 12, padding: '12px 14px', marginBottom: 16,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <Calendar size={15} color="#D9A441" />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 9, letterSpacing: '.07em', textTransform: 'uppercase', color: '#7C82A6', margin: '0 0 3px', fontWeight: 500 }}>Date</p>
          <input
            type="date"
            value={date}
            min={TODAY}
            onChange={e => setDate(e.target.value)}
            style={{
              background: 'transparent', border: 'none', outline: 'none',
              fontSize: 14, fontWeight: 500, color: '#F4EDE1',
              fontFamily: 'inherit', width: '100%', cursor: 'pointer',
              colorScheme: 'dark',
            }}
          />
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 16, flexWrap: 'wrap' }}>
        {[
          { color: '#4FA8A0', label: 'Live' },
          { color: '#E0652E', label: 'Scheduled reference' },
          { color: '#D9A441', label: 'Curated estimate' },
        ].map(({ color, label }) => (
          <span key={label} style={{ fontSize: 10, color: '#9CA3C4', display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, display: 'inline-block' }} />
            {label}
          </span>
        ))}
      </div>

      {error && (
        <p style={{ fontSize: 12, color: '#E0652E', margin: '0 0 12px', lineHeight: 1.5 }}>{error}</p>
      )}

      {/* CTA */}
      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%', background: loading ? '#8B3C1F' : '#E0652E',
          borderRadius: 12, padding: 14, border: 'none',
          fontSize: 14, fontWeight: 500, color: '#F4EDE1',
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'background .2s',
        }}
      >
        {loading ? <><Loader2 size={16} style={{ animation: 'ks-spin 1s linear infinite' }} /> Loading…</> : 'Show me everything'}
      </button>
    </form>
  )
}

// ── SCREEN 2: Results grid ─────────────────────────────────────────────────────
const PLACARDS = [
  {
    key: 'flights',
    label: 'Flights',
    icon: Plane,
    confidence: 'live',
    lazy: true,
    summaryFn: () => 'Tap to load live prices',
  },
  {
    key: 'trains',
    label: 'Trains',
    icon: Train,
    confidence: 'scheduled-reference',
    lazy: false,
    summaryFn: (d) => d ? `${d.data.serviceCount} services · fastest ${d.data.services?.[0] ? d.data.services.reduce((a, b) => a, d.data.services[0]).typicalDuration : ''}` : '',
  },
  {
    key: 'buses',
    label: 'Buses',
    icon: Bus,
    confidence: 'scheduled-reference',
    lazy: false,
    summaryFn: (d) => d ? `${d.data.operatorCount} operators · ₹${d.data.fareRange?.low}–${d.data.fareRange?.high}` : '',
  },
  {
    key: 'hotels',
    label: 'Hotels',
    icon: Building2,
    confidence: 'curated-estimate',
    lazy: false,
    summaryFn: (d) => d ? `Budget to luxury, ${d.data.priceBrackets?.length || 3} tiers` : '',
  },
]

const CONF_COLORS = {
  live: '#4FA8A0',
  'scheduled-reference': '#E0652E',
  'curated-estimate': '#D9A441',
}
const CONF_LABELS = {
  live: 'Live',
  'scheduled-reference': 'Scheduled',
  'curated-estimate': 'Estimate',
}

function ResultsScreen({ overview, onSelect, onBack }) {
  const { origin, destination, date } = overview

  return (
    <div style={{ paddingBottom: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '18px 20px 0' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <ArrowLeft size={18} color="#9CA3C4" />
        </button>
        <div>
          <p style={{
            fontFamily: 'var(--font-serif, Georgia, serif)',
            fontSize: 17, fontWeight: 500, color: '#F4EDE1', margin: 0,
          }}>
            <em style={{ fontStyle: 'italic', color: '#E0652E' }}>{origin}</em> → {destination}
          </p>
          <p style={{ fontSize: 11, color: '#7C82A6', margin: '2px 0 0' }}>{formatDisplayDate(date)}</p>
        </div>
      </div>

      <Alpona />

      {/* 2×2 grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '0 20px' }}>
        {PLACARDS.map(({ key, label, icon: Icon, confidence, lazy, summaryFn }) => {
          const dotColor = CONF_COLORS[confidence]
          const confLabel = CONF_LABELS[confidence]
          const isLazy = lazy
          const summary = summaryFn(overview[key])

          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              style={{
                background: '#1F2547',
                border: isLazy ? '1px dashed #4B527A' : '0.5px solid #353C66',
                borderRadius: 14, padding: '13px 14px',
                cursor: 'pointer', textAlign: 'left',
                transition: 'border-color .2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#D9A441'}
              onMouseLeave={e => e.currentTarget.style.borderColor = isLazy ? '#4B527A' : '#353C66'}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 9, letterSpacing: '.07em', textTransform: 'uppercase', color: dotColor, fontWeight: 500 }}>
                  {confLabel}
                </span>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: dotColor, display: 'inline-block' }} />
              </div>
              <Icon size={22} color={isLazy ? '#4FA8A0' : dotColor} strokeWidth={1.5} style={{ marginBottom: 6, opacity: isLazy ? 0.5 : 0.8 }} />
              <p style={{ fontSize: 13, fontWeight: 500, color: isLazy ? '#9CA3C4' : '#F4EDE1', margin: '0 0 3px' }}>{label}</p>
              <p style={{ fontSize: 10, color: isLazy ? '#555E8C' : '#7C82A6', lineHeight: 1.4, margin: 0 }}>{summary}</p>
            </button>
          )
        })}
      </div>

      <p style={{ fontSize: 10, color: '#555E8C', lineHeight: 1.55, margin: '14px 20px 0', fontStyle: 'italic' }}>
        Trains, Buses and Hotels loaded instantly. Flights loads only when tapped — it calls a live metered source.
      </p>
    </div>
  )
}

// ── SCREEN 3: Detail panels ────────────────────────────────────────────────────

const TRAIN_FILTERS = [
  { key: 'all',      label: 'All' },
  { key: 'fastest',  label: 'Fastest' },
  { key: 'overnight',label: 'Overnight' },
  { key: 'weekly',   label: 'Weekly' },
]

function TrainCard({ train }) {
  const {
    trainName, trainNameNative, trainNumber, isFastest,
    accentColor, originCode, destinationCode,
    originFull, destinationFull, duration,
    frequency, tripType, classes, tags,
  } = train

  return (
    <div style={{
      background: '#1F2547', borderRadius: 14, overflow: 'hidden',
      marginBottom: 10,
      border: isFastest ? `1px solid #4A2A18` : '0.5px solid #353C66',
    }}>
      <div style={{ borderLeft: `3px solid ${accentColor}`, padding: '13px 13px 13px 13px' }}>

        {/* Top row: badges + number */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            {isFastest && (
              <span style={{
                fontSize: 9, fontWeight: 600, color: '#161B30',
                background: '#D9A441', borderRadius: 999, padding: '2px 9px',
              }}>⚡ Fastest</span>
            )}
            {tags.filter(t => t !== 'Fastest').map(tag => (
              <span key={tag} style={{
                fontSize: 9, color: accentColor,
                background: `${accentColor}1A`, border: `1px solid ${accentColor}55`,
                borderRadius: 999, padding: '2px 9px',
              }}>{tag}</span>
            ))}
          </div>
          <span style={{ fontSize: 9, color: '#7C82A6' }}>{trainNumber}</span>
        </div>

        {/* Train name */}
        <p style={{ fontSize: 15, fontWeight: 500, color: '#F4EDE1', margin: '0 0 2px' }}>{trainName}</p>
        <p style={{
          fontFamily: 'var(--font-serif, Georgia, serif)',
          fontStyle: 'italic', fontSize: 11, color: '#7C82A6', margin: '0 0 10px',
        }}>{trainNameNative}</p>

        {/* Route timeline */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 0', borderTop: '1px dashed #353C66', borderBottom: '1px dashed #353C66',
          marginBottom: 10,
        }}>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: 14, fontWeight: 500, color: '#F4EDE1', margin: 0 }}>{originCode}</p>
            <p style={{ fontSize: 10, color: '#7C82A6', margin: '2px 0 0' }}>{originFull}</p>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 10, color: accentColor, fontWeight: 500 }}>{duration}</span>
            <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', border: `1.5px solid ${accentColor}`, flexShrink: 0 }} />
              <div style={{ flex: 1, height: 1, borderTop: `1.5px dashed ${accentColor}`, opacity: .5 }} />
              <Train size={12} color={accentColor} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, height: 1, borderTop: `1.5px dashed ${accentColor}`, opacity: .5 }} />
              <div style={{ width: 5, height: 5, borderRadius: '50%', border: `1.5px solid ${accentColor}`, flexShrink: 0 }} />
            </div>
            <span style={{ fontSize: 9, color: '#7C82A6' }}>{tripType}</span>
          </div>

          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 14, fontWeight: 500, color: '#F4EDE1', margin: 0 }}>{destinationCode}</p>
            <p style={{ fontSize: 10, color: '#7C82A6', margin: '2px 0 0' }}>{destinationFull}</p>
          </div>
        </div>

        {/* Class tags */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {classes.map(cls => (
            <span key={cls} style={{
              fontSize: 9, color: '#9CA3C4',
              border: '1px solid #353C66', borderRadius: 999, padding: '2px 9px',
            }}>{cls}</span>
          ))}
          <span style={{
            fontSize: 9, color: accentColor,
            border: `1px solid ${accentColor}55`, borderRadius: 999, padding: '2px 9px',
          }}>{frequency}</span>
        </div>
      </div>
    </div>
  )
}

function TrainsDetail({ data }) {
  const [activeFilter, setActiveFilter] = useState('all')
  const { serviceCount, trains, note } = data.data

  const filtered = activeFilter === 'all'
    ? trains
    : trains.filter(t => t.category === activeFilter)

  return (
    <>
      <ConfidenceBand confidence={data.confidence} note={note} />

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 7, marginBottom: 14, overflowX: 'auto', scrollbarWidth: 'none' }}>
        {TRAIN_FILTERS.map(f => {
          const active = activeFilter === f.key
          return (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              style={{
                fontSize: 11, borderRadius: 999, padding: '5px 13px',
                whiteSpace: 'nowrap', cursor: 'pointer', border: 'none',
                background: active ? '#E0652E' : 'transparent',
                color: active ? '#F4EDE1' : '#9CA3C4',
                outline: active ? 'none' : '1px solid #353C66',
                fontWeight: active ? 500 : 400, fontFamily: 'inherit',
              }}
            >{f.label}</button>
          )
        })}
      </div>

      {/* Train cards */}
      {filtered.length > 0
        ? filtered.map(t => <TrainCard key={t.trainNumber} train={t} />)
        : <p style={{ fontSize: 12, color: '#7C82A6', margin: '8px 0' }}>No trains in this category.</p>
      }

      <p style={{ fontSize: 10, color: '#555E8C', lineHeight: 1.6, margin: '4px 0 0', fontStyle: 'italic' }}>
        {serviceCount} total services connect this corridor weekly. Class availability varies — verify directly on IRCTC.
      </p>
    </>
  )
}

const BUS_FILTERS = [
  { key: 'all',        label: 'All' },
  { key: 'ac-sleeper', label: 'AC Sleeper' },
  { key: 'non-ac',     label: 'Non-AC' },
  { key: 'budget',     label: 'Budget' },
]

function BusCard({ bus }) {
  const { busOperator, busOperatorNative, busType, accentColor, duration,
          boardingPoint, droppingPoint, origin, destination, fareRange,
          amenities, tripType } = bus

  return (
    <div style={{
      background: '#1F2547', borderRadius: 14, overflow: 'hidden',
      marginBottom: 10, border: '0.5px solid #353C66',
    }}>
      <div style={{ borderLeft: `3px solid ${accentColor}`, padding: '13px 13px 13px 13px' }}>

        {/* Top row: type badge + duration */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{
            fontSize: 9, fontWeight: 500, color: accentColor,
            background: `${accentColor}1A`, border: `1px solid ${accentColor}66`,
            borderRadius: 999, padding: '2px 9px',
          }}>{busType}</span>
          <span style={{ fontSize: 10, fontWeight: 500, color: '#F4EDE1' }}>{duration}</span>
        </div>

        {/* Operator name */}
        <p style={{ fontSize: 15, fontWeight: 500, color: '#F4EDE1', margin: '0 0 2px' }}>{busOperator}</p>
        {busOperatorNative && busOperatorNative !== busOperator && (
          <p style={{
            fontFamily: 'var(--font-serif, Georgia, serif)',
            fontStyle: 'italic', fontSize: 11, color: '#7C82A6', margin: '0 0 10px',
          }}>{busOperatorNative}</p>
        )}

        {/* Route row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 0', borderTop: '1px dashed #353C66', borderBottom: '1px dashed #353C66',
          marginBottom: 10,
        }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 500, color: '#F4EDE1', margin: 0 }}>{origin}</p>
            <p style={{ fontSize: 9, color: '#7C82A6', margin: '2px 0 0' }}>{boardingPoint}</p>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 10, color: accentColor, fontWeight: 500 }}>{duration}</span>
            <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', border: `1.5px solid ${accentColor}`, flexShrink: 0 }} />
              <div style={{ flex: 1, height: 1, borderTop: `1.5px dashed ${accentColor}`, opacity: .5 }} />
              <Bus size={12} color={accentColor} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, height: 1, borderTop: `1.5px dashed ${accentColor}`, opacity: .5 }} />
              <div style={{ width: 5, height: 5, borderRadius: '50%', border: `1.5px solid ${accentColor}`, flexShrink: 0 }} />
            </div>
            <span style={{ fontSize: 9, color: '#7C82A6' }}>{tripType}</span>
          </div>

          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: '#F4EDE1', margin: 0 }}>{destination}</p>
            <p style={{ fontSize: 9, color: '#7C82A6', margin: '2px 0 0' }}>{droppingPoint}</p>
          </div>
        </div>

        {/* Bottom row: amenities + fare */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {amenities.map(a => (
              <span key={a} style={{
                fontSize: 9, color: '#9CA3C4',
                border: '1px solid #353C66', borderRadius: 999, padding: '2px 9px',
              }}>{a}</span>
            ))}
          </div>
          <p style={{ fontSize: 14, fontWeight: 500, color: '#F4EDE1', margin: 0, flexShrink: 0 }}>
            ₹{fareRange.low.toLocaleString('en-IN')}–{fareRange.high.toLocaleString('en-IN')}
          </p>
        </div>
      </div>
    </div>
  )
}

function BusesDetail({ data }) {
  const [activeFilter, setActiveFilter] = useState('all')
  const { buses, note } = data.data

  const filtered = activeFilter === 'all'
    ? buses
    : buses.filter(b => b.category === activeFilter)

  return (
    <>
      <ConfidenceBand confidence={data.confidence} note={note} />

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 7, marginBottom: 14, overflowX: 'auto', scrollbarWidth: 'none' }}>
        {BUS_FILTERS.map(f => {
          const active = activeFilter === f.key
          return (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              style={{
                fontSize: 11, borderRadius: 999, padding: '5px 13px',
                whiteSpace: 'nowrap', cursor: 'pointer', border: 'none',
                background: active ? '#E0652E' : 'transparent',
                color: active ? '#F4EDE1' : '#9CA3C4',
                outline: active ? 'none' : '1px solid #353C66',
                fontWeight: active ? 500 : 400, fontFamily: 'inherit',
              }}
            >{f.label}</button>
          )
        })}
      </div>

      {/* Bus cards */}
      {filtered.length > 0
        ? filtered.map(b => <BusCard key={b.busOperator} bus={b} />)
        : <p style={{ fontSize: 12, color: '#7C82A6', margin: '8px 0' }}>No buses in this category.</p>
      }

      {/* Boarding callout */}
      <div style={{
        background: '#1A1F3A', border: '1px dashed #4FA8A0',
        borderRadius: 12, padding: '11px 14px', marginTop: 4,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ fontSize: 16, flexShrink: 0 }}>📍</span>
        <div>
          <p style={{ fontSize: 10, letterSpacing: '.07em', textTransform: 'uppercase', color: '#4FA8A0', margin: '0 0 2px', fontWeight: 500 }}>Boarding point</p>
          <p style={{ fontSize: 12, color: '#C7CBE0', margin: 0 }}>Hill Cart Road & Siliguri Junction · 75+ daily departures</p>
        </div>
      </div>

      <p style={{ fontSize: 10, color: '#555E8C', lineHeight: 1.6, margin: '8px 0 0', fontStyle: 'italic' }}>
        Fare ranges are indicative — prices vary by platform and seat type. Confirm directly with the operator.
      </p>
    </>
  )
}

const HOTEL_FILTERS = [
  { key: 'all',       label: 'All' },
  { key: 'budget',    label: 'Budget' },
  { key: 'mid-range', label: 'Mid-range' },
  { key: 'luxury',    label: 'Luxury' },
]

const TIER_COLOR = {
  Luxury:      '#D9A441',
  'Mid-range': '#4FA8A0',
  Budget:      '#9CA3C4',
}

function StarRating({ count }) {
  return (
    <span style={{ fontSize: 9, color: '#D9A441', letterSpacing: 1 }}>
      {'★'.repeat(count)}{'☆'.repeat(5 - count)}
    </span>
  )
}

function HotelCard({ hotel }) {
  const { name, tier, stars, area, description, typicalPricePerNight } = hotel
  const tierColor = TIER_COLOR[tier] || '#9CA3C4'

  return (
    <div style={{
      background: '#1F2547', border: '0.5px solid #353C66',
      borderRadius: 14, padding: '13px 14px', marginBottom: 10,
    }}>
      {/* Top row: name + tier badge */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ flex: 1, marginRight: 10 }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: '#F4EDE1', margin: '0 0 4px' }}>{name}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <StarRating count={stars} />
            <span style={{ fontSize: 9, color: '#7C82A6' }}>{area}</span>
          </div>
        </div>
        <span style={{
          fontSize: 9, fontWeight: 500, flexShrink: 0,
          color: tierColor,
          background: `${tierColor}1A`,
          border: `1px solid ${tierColor}`,
          borderRadius: 999, padding: '2px 9px',
        }}>{tier}</span>
      </div>

      {/* Divider row: description + price */}
      <div style={{
        borderTop: '1px dashed #2B3158', paddingTop: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 11, color: '#9CA3C4' }}>{description}</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: '#F4EDE1', flexShrink: 0 }}>
          ~₹{typicalPricePerNight.toLocaleString('en-IN')}
          <span style={{ fontSize: 10, fontWeight: 400, color: '#7C82A6' }}>/night</span>
        </span>
      </div>
    </div>
  )
}

function HotelsDetail({ data, destination }) {
  const [activeFilter, setActiveFilter] = useState('all')
  const { hotels, note } = data.data

  const filtered = activeFilter === 'all'
    ? hotels
    : hotels.filter(h => h.category === activeFilter)

  return (
    <>
      <ConfidenceBand confidence={data.confidence} note={note} />

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 7, marginBottom: 14, overflowX: 'auto', scrollbarWidth: 'none' }}>
        {HOTEL_FILTERS.map(f => {
          const active = activeFilter === f.key
          const pillColor = f.key === 'luxury' ? '#D9A441' : f.key === 'mid-range' ? '#4FA8A0' : f.key === 'budget' ? '#9CA3C4' : '#D9A441'
          return (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              style={{
                fontSize: 11, borderRadius: 999, padding: '5px 13px',
                whiteSpace: 'nowrap', cursor: 'pointer', border: 'none',
                background: active ? pillColor : 'transparent',
                color: active ? (f.key === 'all' || f.key === 'luxury' ? '#161B30' : '#161B30') : '#9CA3C4',
                outline: active ? 'none' : '1px solid #353C66',
                fontWeight: active ? 600 : 400, fontFamily: 'inherit',
                transition: 'all .15s',
              }}
            >{f.label}</button>
          )
        })}
      </div>

      {/* Hotel cards */}
      {filtered.length > 0
        ? filtered.map(h => <HotelCard key={h.name} hotel={h} />)
        : <p style={{ fontSize: 12, color: '#7C82A6', margin: '8px 0' }}>No hotels in this category.</p>
      }

      <p style={{ fontSize: 10, color: '#555E8C', lineHeight: 1.6, margin: '6px 0 0', fontStyle: 'italic' }}>
        Prices fluctuate — always confirm directly with the property. KothaSetu does not handle bookings.
      </p>
    </>
  )
}

function FlightsDetail({ data, origin, destination, date }) {
  if (!data) return null
  const flights = data.data
  return (
    <>
      <ConfidenceBand
        confidence={data.confidence}
        note={data.lastVerified
          ? `Real-time prices fetched at ${new Date(data.lastVerified).toLocaleTimeString()}.`
          : 'Real-time prices and schedules, fetched just now.'}
      />
      {flights.map(f => (
        <div key={f.flightNumber} style={{
          background: '#1F2547', border: '0.5px solid #353C66',
          borderRadius: 12, padding: '13px 14px', marginBottom: 8,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: '#F4EDE1', margin: 0 }}>{f.airline}</p>
            <span style={{ fontSize: 10, color: '#7C82A6' }}>{f.flightNumber}</span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 0', borderTop: '1px dashed #2B3158', borderBottom: '1px dashed #2B3158',
            marginBottom: 8,
          }}>
            <p style={{ fontSize: 15, fontWeight: 500, color: '#F4EDE1', margin: 0 }}>{f.departure}</p>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <span style={{ fontSize: 9, color: '#7C82A6' }}>{f.duration} · {f.stops === 0 ? 'Direct' : `${f.stops} stop`}</span>
              <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', border: '1.5px solid #4FA8A0', flexShrink: 0 }} />
                <div style={{ flex: 1, height: 1, borderTop: '1.5px dashed #4FA8A0', opacity: .5 }} />
                <Plane size={11} color="#4FA8A0" style={{ flexShrink: 0, transform: 'rotate(90deg)' }} />
                <div style={{ flex: 1, height: 1, borderTop: '1.5px dashed #4FA8A0', opacity: .5 }} />
                <div style={{ width: 5, height: 5, borderRadius: '50%', border: '1.5px solid #4FA8A0', flexShrink: 0 }} />
              </div>
            </div>
            <p style={{ fontSize: 15, fontWeight: 500, color: '#F4EDE1', margin: 0 }}>{f.arrival}</p>
          </div>
          <p style={{ fontSize: 14, fontWeight: 500, color: '#F4EDE1', margin: 0 }}>
            From ₹{f.price.toLocaleString('en-IN')} <span style={{ fontSize: 10, fontWeight: 400, color: '#7C82A6' }}>per person</span>
          </p>
        </div>
      ))}
      <p style={{ fontSize: 10, color: '#555E8C', lineHeight: 1.55, margin: '6px 0 0', fontStyle: 'italic' }}>
        Fetched live on tap — KothaSetu calls a metered API for flights, so it loads only when you ask.
      </p>
    </>
  )
}

function DetailScreen({ mode, overview, flightData, flightLoading, flightError, onBack }) {
  const { origin, destination, date } = overview

  const titles = { flights: '✈ Flights', trains: '🚂 Trains', buses: '🚌 Buses', hotels: '🏨 Hotels' }
  const accentColors = {
    flights: '#4FA8A0', trains: '#E0652E', buses: '#E0652E', hotels: '#D9A441',
  }
  const accent = accentColors[mode]

  return (
    <div style={{ paddingBottom: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '18px 20px 0' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <ArrowLeft size={18} color="#9CA3C4" />
        </button>
        <div>
          <p style={{
            fontFamily: 'var(--font-serif, Georgia, serif)',
            fontSize: 18, fontWeight: 500, color: '#F4EDE1', margin: 0,
          }}>
            <em style={{ fontStyle: 'italic', color: accent }}>{titles[mode]}</em>
          </p>
          <p style={{ fontSize: 11, color: '#7C82A6', margin: '2px 0 0' }}>
            {origin} → {destination} · {formatDisplayDate(date)}
          </p>
        </div>
      </div>

      <Alpona color={accent} />

      <div style={{ padding: '0 20px' }}>
        {mode === 'trains' && <TrainsDetail data={overview.trains} />}
        {mode === 'buses'  && <BusesDetail data={overview.buses} />}
        {mode === 'hotels' && <HotelsDetail data={overview.hotels} destination={destination} />}
        {mode === 'flights' && (
          flightLoading
            ? <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '20px 0', color: '#7C82A6' }}>
                <Loader2 size={18} style={{ animation: 'ks-spin 1s linear infinite' }} />
                <span style={{ fontSize: 13 }}>Loading live flight data…</span>
              </div>
            : flightError
              ? <p style={{ fontSize: 13, color: '#E0652E', margin: '12px 0' }}>{flightError}</p>
              : <FlightsDetail data={flightData} origin={origin} destination={destination} date={date} />
        )}
      </div>
    </div>
  )
}

// ── Root page component ────────────────────────────────────────────────────────
export default function TravelInfo() {
  const [screen, setScreen] = useState('search') // 'search' | 'results' | 'detail'
  const [overview, setOverview] = useState(null)
  const [activeMode, setActiveMode] = useState(null)
  const [flightData, setFlightData] = useState(null)
  const [flightLoading, setFlightLoading] = useState(false)
  const [flightError, setFlightError] = useState(null)
  const flightFetched = useRef(false)

  function handleSearch(data) {
    setOverview(data)
    setFlightData(null)
    flightFetched.current = false
    setScreen('results')
  }

  async function handleSelectMode(mode) {
    setActiveMode(mode)
    setScreen('detail')

    if (mode === 'flights' && !flightFetched.current) {
      flightFetched.current = true
      setFlightLoading(true)
      setFlightError(null)
      try {
        const params = new URLSearchParams({
          origin: overview.origin,
          destination: overview.destination,
          date: overview.date,
        })
        const res = await fetch(`${API_BASE}/api/flights-info?${params}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to load flights')
        setFlightData(data)
      } catch (err) {
        setFlightError(err.message)
      } finally {
        setFlightLoading(false)
      }
    }
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: '#161B30',
      color: '#F4EDE1',
      fontFamily: 'var(--font-sans, "Hind Siliguri", sans-serif)',
      maxWidth: 480,
      margin: '0 auto',
      position: 'relative',
    }}>
      <style>{`
        @keyframes ks-spin { to { transform: rotate(360deg); } }
        .ks-tcard-hover:hover { border-color: #D9A441 !important; }
      `}</style>

      {screen === 'search' && (
        <SearchScreen onSearch={handleSearch} />
      )}

      {screen === 'results' && overview && (
        <ResultsScreen
          overview={overview}
          onSelect={handleSelectMode}
          onBack={() => setScreen('search')}
        />
      )}

      {screen === 'detail' && overview && (
        <DetailScreen
          mode={activeMode}
          overview={overview}
          flightData={flightData}
          flightLoading={flightLoading}
          flightError={flightError}
          onBack={() => setScreen('results')}
        />
      )}
    </div>
  )
}
