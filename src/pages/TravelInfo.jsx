import { useState, useRef } from 'react'
import { useAppStore } from '../store/appStore'
import PageHeader from '../components/layout/PageHeader'
import riverMountainBg from '../assets/The River Between the Mountain.jpg'
import howrahImage from '../assets/Howrah2.jpeg'
import airportImage from '../assets/Airport.jpeg'
import victoriaImage from '../assets/Victoria.jpeg'
import yellowTaxiImage from '../assets/Yellow taxi.jpeg'
import {
  ArrowLeft, ArrowUpDown, Calendar, Loader2,
  Plane, Train, Bus, Building2,
} from 'lucide-react'

// Web deployments use same-origin Vercel Functions. A packaged Capacitor app can
// supply the public Vercel origin through VITE_API_BASE_URL at build time.
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const TODAY    = new Date().toISOString().split('T')[0]

// ── City → IATA lookup (mirrors backend IATA_MAP) ─────────────────────────
const CITY_IATA = {
  'bagdogra': 'IXB', 'bagdogra airport': 'IXB',
  'kolkata': 'CCU', 'calcutta': 'CCU',
  'delhi': 'DEL', 'new delhi': 'DEL',
  'mumbai': 'BOM', 'bombay': 'BOM',
  'chennai': 'MAA', 'madras': 'MAA',
  'bengaluru': 'BLR', 'bangalore': 'BLR',
  'hyderabad': 'HYD',
  'guwahati': 'GAU',
  'cooch behar': 'COH',
  'pune': 'PNQ',
  'ahmedabad': 'AMD',
  'coimbatore': 'CJB',
  'imphal': 'IMF',
  'bhubaneswar': 'BBI',
  'patna': 'PAT',
  'varanasi': 'VNS',
  'lucknow': 'LKO',
  'jaipur': 'JAI',
  'goa': 'GOI', 'panaji': 'GOI',
  'kochi': 'COK', 'cochin': 'COK',
  'thiruvananthapuram': 'TRV', 'trivandrum': 'TRV',
  'amritsar': 'ATQ',
  'srinagar': 'SXR',
  'chandigarh': 'IXC',
  'indore': 'IDR',
  'nagpur': 'NAG',
  'raipur': 'RPR',
  'bhopal': 'BHO',
  'visakhapatnam': 'VTZ', 'vizag': 'VTZ',
}

// Returns the IATA code if the input matches a known city, else null
function resolveIATA(input) {
  if (!input) return null
  const key = input.toLowerCase().trim()
  if (CITY_IATA[key]) return CITY_IATA[key]
  // Check if it already IS a valid IATA code
  if (/^[A-Z]{3}$/.test(input.toUpperCase().trim()) && input.trim().length === 3) {
    return input.toUpperCase().trim()
  }
  return null
}

// For sending to the backend — prefer IATA code if resolvable
function toBackendValue(input) {
  return resolveIATA(input) || input.trim()
}

// ── Light-on-dark palette (photo bg is always dark-navy) ───────────────────
const C = {
  text:        '#F4EDE1',
  sub:         'rgba(255,255,255,.62)',
  muted:       'rgba(255,255,255,.38)',
  card:        'rgba(12,18,38,.58)',
  border:      'rgba(255,255,255,.12)',
  borderFaint: 'rgba(255,255,255,.07)',
  borderStrg:  'rgba(255,255,255,.22)',
  bg2:         'rgba(255,255,255,.05)',
  shadow:      '0 2px 14px rgba(0,0,0,.35)',
  shadowRaised:'0 4px 22px rgba(0,0,0,.48)',
}

function formatDisplayDate(iso) {
  if (!iso) return ''
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', {
    weekday:'short', day:'numeric', month:'short', year:'numeric',
  })
}

// ── Alpona wave ────────────────────────────────────────────────────────────
function Alpona({ accent }) {
  return (
    <svg
      viewBox="0 0 380 14" width="100%" height="14" aria-hidden="true"
      style={{ display:'block', margin:'14px 0', color: accent || 'var(--accent-gold)' }}
    >
      <path
        d="M0 7 Q19 1,38 7 T76 7 T114 7 T152 7 T190 7 T228 7 T266 7 T304 7 T342 7 T380 7"
        fill="none" stroke="currentColor" strokeWidth=".8" opacity=".35"
      />
      <circle cx="76"  cy="7" r="1.2" fill="currentColor" opacity=".45" />
      <circle cx="190" cy="7" r="1.2" fill="currentColor" opacity=".45" />
      <circle cx="304" cy="7" r="1.2" fill="currentColor" opacity=".45" />
    </svg>
  )
}

// ── Confidence band ────────────────────────────────────────────────────────
const BANDS = {
  live:                  { dot:'var(--accent-teal)',    bg:'rgba(8,52,61,.88)',  border:'rgba(45,212,191,.62)', label:'Live data'           },
  'scheduled-reference': { dot:'var(--accent-primary)', bg:'rgba(65,31,20,.88)', border:'rgba(248,113,71,.58)', label:'Scheduled reference' },
  'curated-estimate':    { dot:'var(--accent-gold)',    bg:'rgba(61,48,13,.88)', border:'rgba(234,179,8,.58)',  label:'Curated estimate'    },
}

function ConfidenceBand({ confidence, note }) {
  const c = BANDS[confidence] || { dot:C.muted, bg:C.bg2, border:C.border, label:confidence }
  return (
    <div style={{ display:'flex', alignItems:'flex-start', gap:11, background:c.bg, border:`1px solid ${c.border}`, borderRadius:11, padding:'12px 14px', marginBottom:14, backdropFilter:'blur(16px)', boxShadow:'0 4px 18px rgba(0,0,0,.28)' }}>
      <span style={{ width:8, height:8, borderRadius:'50%', background:c.dot, display:'inline-block', marginTop:4, flexShrink:0 }} />
      <div>
        <strong style={{ display:'block', fontSize:10, letterSpacing:'.07em', textTransform:'uppercase', color:c.dot, marginBottom:3 }}>{c.label}</strong>
        <span style={{ fontSize:12, color:C.text, lineHeight:1.55 }}>{note}</span>
      </div>
    </div>
  )
}

// ── Filter pills ───────────────────────────────────────────────────────────
function FilterPills({ filters, active, onSelect }) {
  return (
    <div style={{ display:'flex', gap:7, marginBottom:14, overflowX:'auto', scrollbarWidth:'none', paddingBottom:2 }}>
      {filters.map(f => {
        const on = active === f.key
        return (
          <button key={f.key} onClick={() => onSelect(f.key)} style={{
            fontSize:11, borderRadius:999, padding:'5px 14px', whiteSpace:'nowrap',
            cursor:'pointer', fontFamily:'inherit', transition:'all .15s', minHeight:'auto',
            background: on ? 'var(--accent-primary)' : C.bg2,
            color:       on ? '#fff' : C.sub,
            border:      on ? '1px solid transparent' : `1px solid ${C.border}`,
            fontWeight:  on ? 600 : 400,
          }}>{f.label}</button>
        )
      })}
    </div>
  )
}

// ── Chip ───────────────────────────────────────────────────────────────────
function Chip({ label, color, bg, border }) {
  return (
    <span style={{
      fontSize:9, borderRadius:999, padding:'2px 9px',
      color:      color  || C.sub,
      background: bg     || C.bg2,
      border: `1px solid ${border || C.border}`,
    }}>{label}</span>
  )
}

// ── Route timeline ─────────────────────────────────────────────────────────
function RouteTimeline({ from, fromSub, to, toSub, duration, subLabel, accent, Icon }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 0', borderTop:`1px dashed ${C.borderFaint}`, borderBottom:`1px dashed ${C.borderFaint}`, marginBottom:10 }}>
      <div style={{ minWidth:0, flex:'0 0 auto', maxWidth:'30%' }}>
        <p style={{ fontSize:14, fontWeight:700, color:C.text, margin:0 }}>{from}</p>
        <p style={{ fontSize:9, color:C.muted, margin:'2px 0 0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{fromSub}</p>
      </div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3, minWidth:0 }}>
        <span style={{ fontSize:10, color:accent, fontWeight:600, whiteSpace:'nowrap' }}>{duration}</span>
        <div style={{ width:'100%', display:'flex', alignItems:'center' }}>
          <div style={{ width:5, height:5, borderRadius:'50%', border:`1.5px solid ${accent}`, flexShrink:0 }} />
          <div style={{ flex:1, height:1, borderTop:`1.5px dashed ${accent}`, opacity:.4 }} />
          <Icon size={12} color={accent} style={{ flexShrink:0 }} />
          <div style={{ flex:1, height:1, borderTop:`1.5px dashed ${accent}`, opacity:.4 }} />
          <div style={{ width:5, height:5, borderRadius:'50%', border:`1.5px solid ${accent}`, flexShrink:0 }} />
        </div>
        {subLabel && <span style={{ fontSize:9, color:C.muted, whiteSpace:'nowrap' }}>{subLabel}</span>}
      </div>
      <div style={{ textAlign:'right', minWidth:0, flex:'0 0 auto', maxWidth:'30%' }}>
        <p style={{ fontSize:14, fontWeight:700, color:C.text, margin:0 }}>{to}</p>
        <p style={{ fontSize:9, color:C.muted, margin:'2px 0 0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{toSub}</p>
      </div>
    </div>
  )
}

// ── Shared field styles ────────────────────────────────────────────────────
const FIELD = { background:C.card, border:`1px solid ${C.border}`, backdropFilter:'blur(14px)' }
const LABEL = { fontSize:9, letterSpacing:'.07em', textTransform:'uppercase', color:C.muted, margin:'0 0 4px', fontWeight:700, display:'block' }
const INPUT = { background:'transparent', border:'none', outline:'none', fontSize:15, fontWeight:500, color:C.text, width:'100%', fontFamily:'inherit' }

// ── IATA badge shown inline inside the input ───────────────────────────────
function IATABadge({ code }) {
  if (!code) return null
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:3,
      padding:'2px 7px', borderRadius:6,
      background:'rgba(13,115,119,0.14)', border:'1px solid rgba(13,115,119,0.3)',
      color:'var(--accent-teal)', fontSize:11, fontWeight:700,
      letterSpacing:'.05em', flexShrink:0, marginLeft:6,
    }}>
      {code}
    </span>
  )
}

// ── SCREEN 1: Search ───────────────────────────────────────────────────────
function SearchScreen({ onSearch, darkMode }) {
  const [origin,      setOrigin]      = useState('')
  const [destination, setDestination] = useState('')
  const [date,        setDate]        = useState(TODAY)
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState(null)
  const [originIATA,  setOriginIATA]  = useState(null)
  const [destIATA,    setDestIATA]    = useState(null)

  // Resolve IATA on every keystroke so the badge appears as the user types
  const handleOriginChange = (val) => {
    setOrigin(val)
    setOriginIATA(resolveIATA(val))
  }
  const handleDestChange = (val) => {
    setDestination(val)
    setDestIATA(resolveIATA(val))
  }

  const swap = () => {
    setOrigin(destination);      setDestination(origin)
    setOriginIATA(destIATA);    setDestIATA(originIATA)
  }

  async function submit(e) {
    e.preventDefault()
    if (!origin.trim() || !destination.trim()) { setError('Please enter both origin and destination.'); return }
    setError(null); setLoading(true)
    try {
      const res  = await fetch(`${API_BASE}/api/overview`, {
        method:'POST', headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({
          origin: toBackendValue(origin),
          destination: toBackendValue(destination),
          date,
        }),
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
    <form onSubmit={submit} style={{ padding:'8px 16px 28px' }}>

      {/* Title */}
      <div style={{ marginBottom:20 }}>
        <p style={{ fontSize:10, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--accent-primary)', margin:'0 0 5px', fontWeight:700 }}>
          Information booklet
        </p>
        <h1 style={{
          fontFamily:"'Baloo Da 2','Hind Siliguri',sans-serif",
          fontSize:'clamp(24px,6vw,30px)', fontWeight:800, lineHeight:1.1,
          color:C.text, margin:'0 0 7px', letterSpacing:'-.3px',
        }}>
          <span style={{ color:'var(--accent-primary)', fontStyle:'italic', fontFamily:"'Playfair Display',Georgia,serif" }}>Travel</span>
          {' '}information
        </h1>
        <p style={{ fontSize:13, color:C.sub, margin:0, lineHeight:1.6 }}>
          One search — flights, trains, buses &amp; hotels laid out clearly.
        </p>
      </div>

      <Alpona />

      {/* Flight IATA disclaimer */}
      <div style={{
        display:'flex', alignItems:'flex-start', gap:10,
        padding:'11px 14px', borderRadius:10, marginBottom:14,
        background:'rgba(13,115,119,0.09)', border:'1px solid rgba(13,115,119,0.22)',
      }}>
        <Plane size={14} color="var(--accent-teal)" style={{ flexShrink:0, marginTop:2 }} />
        <p style={{ margin:0, fontSize:12, color:'var(--accent-teal)', lineHeight:1.6 }}>
          <strong>Flights require airport cities.</strong> Enter a city and we'll detect its airport code.
        </p>
      </div>

      {/* From / To */}
      <div style={{ position:'relative', marginBottom:10 }}>
        <div style={{ ...FIELD, borderRadius:'12px 12px 0 0', padding:'12px 48px 12px 14px' }}>
          <span style={LABEL}>From</span>
          <div style={{ display:'flex', alignItems:'center', gap:0, width:'100%' }}>
            <input
              value={origin}
              onChange={e => handleOriginChange(e.target.value)}
              placeholder="City, station or airport"
              style={{ ...INPUT, flex:1 }}
              autoComplete="off"
            />
            <IATABadge code={originIATA} />
          </div>
        </div>
        <div style={{ height:1, background:C.borderFaint }} />
        <div style={{ ...FIELD, borderTop:'none', borderRadius:'0 0 12px 12px', padding:'12px 48px 12px 14px' }}>
          <span style={LABEL}>To</span>
          <div style={{ display:'flex', alignItems:'center', gap:0, width:'100%' }}>
            <input
              value={destination}
              onChange={e => handleDestChange(e.target.value)}
              placeholder="City, station or airport"
              style={{ ...INPUT, flex:1 }}
              autoComplete="off"
            />
            <IATABadge code={destIATA} />
          </div>
        </div>
        <button type="button" onClick={swap} aria-label="Swap" style={{
          position:'absolute', right:14, top:'50%', transform:'translateY(-50%)',
          width:32, height:32, borderRadius:'50%', minHeight:'auto',
          background:C.bg2, border:`1px solid ${C.borderStrg}`,
          display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', zIndex:2,
        }}>
          <ArrowUpDown size={14} color="var(--accent-gold)" />
        </button>
      </div>

      {/* Date */}
      <div style={{ ...FIELD, borderRadius:12, padding:'12px 14px', marginBottom:18, display:'flex', alignItems:'center', gap:10 }}>
        <Calendar size={15} color="var(--accent-gold)" style={{ flexShrink:0 }} />
        <div style={{ flex:1, minWidth:0 }}>
          <span style={LABEL}>Date of travel</span>
          <input type="date" value={date} min={TODAY} onChange={e => setDate(e.target.value)}
            style={{ ...INPUT, cursor:'pointer', colorScheme: darkMode ? 'dark' : 'light' }} />
        </div>
      </div>

      {/* Legend */}
      <div style={{ display:'flex', gap:14, marginBottom:18, flexWrap:'wrap' }}>
        {[
          { color:'var(--accent-teal)',    label:'Live' },
          { color:'var(--accent-primary)', label:'Scheduled reference' },
          { color:'var(--accent-gold)',    label:'Curated estimate' },
        ].map(({ color, label }) => (
          <span key={label} style={{ fontSize:10, color:C.muted, display:'flex', alignItems:'center', gap:5 }}>
            <span style={{ width:7, height:7, borderRadius:'50%', background:color, display:'inline-block', flexShrink:0 }} />
            {label}
          </span>
        ))}
      </div>

      {error && <p style={{ fontSize:12, color:'var(--accent-primary)', margin:'0 0 14px', lineHeight:1.5 }}>{error}</p>}

      <button type="submit" disabled={loading} style={{
        width:'100%', borderRadius:12, padding:'14px 16px', border:'none',
        fontSize:14, fontWeight:700, color:'#fff', cursor:loading ? 'not-allowed' : 'pointer',
        background: loading ? 'rgba(200,86,10,.5)' : 'var(--accent-primary)',
        display:'flex', alignItems:'center', justifyContent:'center', gap:8,
        transition:'background .2s', fontFamily:'var(--font-interface)',
        boxShadow:'0 6px 22px rgba(200,86,10,.3)',
      }}>
        {loading ? <><Loader2 size={16} className="ti-spin" /> Searching…</> : 'Show me everything →'}
      </button>
    </form>
  )
}

// ── SCREEN 2: Results ──────────────────────────────────────────────────────
const PLACARDS = [
  { key:'flights', label:'Flights', icon:Plane,     confidence:'live',                lazy:true,  summaryFn:()  => 'Tap to load live prices' },
  { key:'trains',  label:'Trains',  icon:Train,     confidence:'scheduled-reference', lazy:false, summaryFn:(d) => d ? `${d.data.serviceCount} services` : '' },
  { key:'buses',   label:'Buses',   icon:Bus,       confidence:'scheduled-reference', lazy:false, summaryFn:(d) => d ? `${d.data.operatorCount} operators` : '' },
  { key:'hotels',  label:'Hotels',  icon:Building2, confidence:'curated-estimate',    lazy:false, summaryFn:(d) => d ? 'Budget to luxury' : '' },
]
const CONF_ACCENT = { live:'var(--accent-teal)', 'scheduled-reference':'var(--accent-primary)', 'curated-estimate':'var(--accent-gold)' }
const CONF_LABEL  = { live:'Live', 'scheduled-reference':'Scheduled', 'curated-estimate':'Estimate' }

function ResultsScreen({ overview, onSelect, onBack }) {
  const { origin, destination, date } = overview
  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 16px 0' }}>
        <button onClick={onBack} style={{
          background:C.bg2, border:`1px solid ${C.border}`, cursor:'pointer',
          padding:'6px 8px', borderRadius:8, color:C.sub, display:'flex', minHeight:'auto',
        }}>
          <ArrowLeft size={18} />
        </button>
        <div style={{ minWidth:0 }}>
          <p style={{
            fontFamily:"'Baloo Da 2','Hind Siliguri',sans-serif",
            fontSize:17, fontWeight:800, color:C.text, margin:0,
            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
          }}>
            <span style={{ color:'var(--accent-primary)' }}>{origin}</span>
            <span style={{ color:C.muted, margin:'0 4px' }}>→</span>
            {destination}
          </p>
          <p style={{ fontSize:11, color:C.muted, margin:'2px 0 0' }}>{formatDisplayDate(date)}</p>
        </div>
      </div>

      <div style={{ padding:'0 16px 20px' }}>
        <Alpona />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {PLACARDS.map(({ key, label, icon:Icon, confidence, summaryFn }) => {
            const accent    = CONF_ACCENT[confidence]
            const confLabel = CONF_LABEL[confidence]
            const summary   = summaryFn(overview[key])
            return (
              <button
                key={key} onClick={() => onSelect(key)}
                style={{
                  background:C.card,
                  borderRadius:16, padding:14, cursor:'pointer', textAlign:'left',
                  transition:'box-shadow .2s, border-color .2s, background .2s',
                  backdropFilter:'blur(14px)',
                  border:`1px solid ${C.border}`,
                  boxShadow: C.shadow,
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = C.shadowRaised; e.currentTarget.style.borderColor='var(--accent-primary)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = C.shadow; e.currentTarget.style.borderColor = C.border }}
              >
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                  <span style={{ fontSize:9, letterSpacing:'.07em', textTransform:'uppercase', color:accent, fontWeight:700 }}>{confLabel}</span>
                  <span style={{ width:7, height:7, borderRadius:'50%', background:accent, display:'inline-block' }} />
                </div>
                <Icon size={22} color={accent} strokeWidth={1.6} style={{ marginBottom:8, opacity:0.9 }} />
                <p style={{ fontSize:13, fontWeight:700, color:C.text, margin:'0 0 3px', fontFamily:'var(--font-interface)' }}>{label}</p>
                <p style={{ fontSize:10, color:C.muted, lineHeight:1.4, margin:0 }}>{summary}</p>
              </button>
            )
          })}
        </div>
        <p style={{ fontSize:10, color:C.muted, lineHeight:1.55, margin:'12px 0 0', fontStyle:'italic' }}>
          Trains, buses and hotels load instantly. Flights call a live metered API — tap when ready.
        </p>
      </div>
    </div>
  )
}

// ── Train cards ────────────────────────────────────────────────────────────
const TRAIN_FILTERS = [
  { key:'all', label:'All' }, { key:'fastest', label:'Fastest' },
  { key:'overnight', label:'Overnight' }, { key:'weekly', label:'Weekly' },
]

function TrainCard({ train }) {
  const { trainName, trainNameNative, trainNumber, isFastest, accentColor,
    originCode, destinationCode, originFull, destinationFull,
    duration, frequency, tripType, classes, tags } = train
  return (
    <div style={{
      background:C.card, backdropFilter:'blur(14px)', borderRadius:14, overflow:'hidden', marginBottom:10,
      border: isFastest ? '1px solid var(--accent-gold)' : `1px solid ${C.border}`, boxShadow:C.shadow,
    }}>
      <div style={{ borderLeft:`3px solid ${accentColor}`, padding:13 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6, flexWrap:'wrap', gap:4 }}>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap', alignItems:'center' }}>
            {isFastest && <span style={{ fontSize:9, fontWeight:700, color:'#1C0F05', background:'var(--accent-gold)', borderRadius:999, padding:'2px 9px' }}>⚡ Fastest</span>}
            {tags.filter(t => t !== 'Fastest').map(t => <Chip key={t} label={t} color={accentColor} bg={`${accentColor}1a`} border={`${accentColor}55`} />)}
          </div>
          <span style={{ fontSize:9, color:C.muted }}>{trainNumber}</span>
        </div>
        <p style={{ fontSize:15, fontWeight:700, color:C.text, margin:'0 0 2px', fontFamily:'var(--font-interface)' }}>{trainName}</p>
        {trainNameNative && <p style={{ fontFamily:"'Playfair Display',Georgia,serif", fontStyle:'italic', fontSize:11, color:C.muted, margin:'0 0 10px' }}>{trainNameNative}</p>}
        <RouteTimeline from={originCode} fromSub={originFull} to={destinationCode} toSub={destinationFull} duration={duration} subLabel={tripType} accent={accentColor} Icon={Train} />
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {classes.map(c => <Chip key={c} label={c} />)}
          <Chip label={frequency} color={accentColor} border={`${accentColor}55`} />
        </div>
      </div>
    </div>
  )
}

function TrainsDetail({ data }) {
  const [filter, setFilter] = useState('all')
  const { serviceCount, trains, note } = data.data
  const shown = filter === 'all' ? trains : trains.filter(t => t.category === filter)
  return (
    <>
      <ConfidenceBand confidence={data.confidence} note={note} />
      <FilterPills filters={TRAIN_FILTERS} active={filter} onSelect={setFilter} />
      {shown.length > 0
        ? shown.map(t => <TrainCard key={t.trainNumber} train={t} />)
        : <p style={{ fontSize:12, color:C.muted, margin:'8px 0' }}>No trains in this category.</p>}
      <p style={{ fontSize:10, color:C.muted, lineHeight:1.6, margin:'4px 0 0', fontStyle:'italic' }}>
        {serviceCount} total services connect this corridor weekly. Verify class availability on IRCTC.
      </p>
    </>
  )
}

// ── Bus cards ──────────────────────────────────────────────────────────────
const BUS_FILTERS = [
  { key:'all', label:'All' }, { key:'ac-sleeper', label:'AC Sleeper' },
  { key:'non-ac', label:'Non-AC' }, { key:'budget', label:'Budget' },
]

function BusCard({ bus }) {
  const { busOperator, busOperatorNative, busType, accentColor, duration,
    boardingPoint, droppingPoint, origin, destination, fareRange, amenities, tripType } = bus
  return (
    <div style={{ background:C.card, backdropFilter:'blur(14px)', borderRadius:14, overflow:'hidden', marginBottom:10, border:`1px solid ${C.border}`, boxShadow:C.shadow }}>
      <div style={{ borderLeft:`3px solid ${accentColor}`, padding:13 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
          <Chip label={busType} color={accentColor} bg={`${accentColor}1a`} border={`${accentColor}55`} />
          <span style={{ fontSize:10, fontWeight:700, color:C.text }}>{duration}</span>
        </div>
        <p style={{ fontSize:15, fontWeight:700, color:C.text, margin:'0 0 2px', fontFamily:'var(--font-interface)' }}>{busOperator}</p>
        {busOperatorNative && busOperatorNative !== busOperator &&
          <p style={{ fontFamily:"'Playfair Display',Georgia,serif", fontStyle:'italic', fontSize:11, color:C.muted, margin:'0 0 10px' }}>{busOperatorNative}</p>}
        <RouteTimeline from={origin} fromSub={boardingPoint} to={destination} toSub={droppingPoint} duration={duration} subLabel={tripType} accent={accentColor} Icon={Bus} />
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, flexWrap:'wrap' }}>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>{amenities.map(a => <Chip key={a} label={a} />)}</div>
          <p style={{ fontSize:14, fontWeight:700, color:C.text, margin:0, flexShrink:0 }}>
            ₹{fareRange.low.toLocaleString('en-IN')}–{fareRange.high.toLocaleString('en-IN')}
          </p>
        </div>
      </div>
    </div>
  )
}

function BusesDetail({ data }) {
  const [filter, setFilter] = useState('all')
  const { buses, note } = data.data
  const shown = filter === 'all' ? buses : buses.filter(b => b.category === filter)
  return (
    <>
      <ConfidenceBand confidence={data.confidence} note={note} />
      <FilterPills filters={BUS_FILTERS} active={filter} onSelect={setFilter} />
      {shown.length > 0
        ? shown.map(b => <BusCard key={b.busOperator} bus={b} />)
        : <p style={{ fontSize:12, color:C.muted, margin:'8px 0' }}>No buses in this category.</p>}
      <div style={{ background:'rgba(13,115,119,.12)', border:'1px dashed rgba(13,115,119,.38)', borderRadius:12, padding:'11px 14px', marginTop:8, display:'flex', gap:10, alignItems:'center' }}>
        <span style={{ fontSize:16, flexShrink:0 }}>📍</span>
        <div>
          <p style={{ fontSize:10, letterSpacing:'.07em', textTransform:'uppercase', color:'var(--accent-teal)', margin:'0 0 2px', fontWeight:700 }}>Boarding point</p>
          <p style={{ fontSize:12, color:C.sub, margin:0 }}>Hill Cart Road & Siliguri Junction · 75+ daily departures</p>
        </div>
      </div>
      <p style={{ fontSize:10, color:C.muted, lineHeight:1.6, margin:'8px 0 0', fontStyle:'italic' }}>Fare ranges are indicative. Confirm directly with the operator.</p>
    </>
  )
}

// ── Hotel cards ────────────────────────────────────────────────────────────
const HOTEL_FILTERS = [
  { key:'all', label:'All' }, { key:'budget', label:'Budget' },
  { key:'mid-range', label:'Mid-range' }, { key:'luxury', label:'Luxury' },
]

function StarRating({ count }) {
  return <span style={{ fontSize:9, color:'var(--accent-gold)', letterSpacing:1 }}>{'★'.repeat(count)}{'☆'.repeat(5 - count)}</span>
}

function HotelCard({ hotel }) {
  const { name, tier, stars, area, description, typicalPricePerNight } = hotel
  const tierAccent = tier === 'Luxury' ? 'var(--accent-gold)' : tier === 'Mid-range' ? 'var(--accent-teal)' : C.sub
  return (
    <div style={{ background:C.card, backdropFilter:'blur(14px)', border:`1px solid ${C.border}`, borderRadius:14, padding:'13px 14px', marginBottom:10, boxShadow:C.shadow }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:8 }}>
        <div style={{ flex:1, marginRight:10, minWidth:0 }}>
          <p style={{ fontSize:13, fontWeight:700, color:C.text, margin:'0 0 4px', fontFamily:'var(--font-interface)' }}>{name}</p>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <StarRating count={stars} />
            <span style={{ fontSize:9, color:C.muted }}>{area}</span>
          </div>
        </div>
        <Chip label={tier} color={tierAccent} border={C.border} />
      </div>
      <div style={{ borderTop:`1px dashed ${C.borderFaint}`, paddingTop:8, display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, flexWrap:'wrap' }}>
        <span style={{ fontSize:11, color:C.sub, flex:1 }}>{description}</span>
        <span style={{ fontSize:13, fontWeight:700, color:C.text, flexShrink:0 }}>
          ~₹{typicalPricePerNight.toLocaleString('en-IN')}
          <span style={{ fontSize:10, fontWeight:400, color:C.muted }}>/night</span>
        </span>
      </div>
    </div>
  )
}

function HotelsDetail({ data }) {
  const [filter, setFilter] = useState('all')
  const { hotels, note } = data.data
  const shown = filter === 'all' ? hotels : hotels.filter(h => h.category === filter)
  return (
    <>
      <ConfidenceBand confidence={data.confidence} note={note} />
      <FilterPills filters={HOTEL_FILTERS} active={filter} onSelect={setFilter} />
      {shown.length > 0
        ? shown.map(h => <HotelCard key={h.name} hotel={h} />)
        : <p style={{ fontSize:12, color:C.muted, margin:'8px 0' }}>No hotels in this category.</p>}
      <p style={{ fontSize:10, color:C.muted, lineHeight:1.6, margin:'6px 0 0', fontStyle:'italic' }}>
        Prices fluctuate — confirm directly with the property. KothaSetu does not handle bookings.
      </p>
    </>
  )
}

// ── Flights ────────────────────────────────────────────────────────────────
function FlightsDetail({ data }) {
  if (!data) return null

  const flights  = data.data   ?? []
  const reason   = data.reason ?? null
  const hasFlights = flights.length > 0

  return (
    <>
      <ConfidenceBand
        confidence={data.confidence}
        note={data.lastVerified
          ? `Live prices fetched at ${new Date(data.lastVerified).toLocaleTimeString()}.`
          : 'Real-time prices and schedules, fetched just now.'}
      />

      {/* ── Empty / error state ─────────────────────────────────────────── */}
      {!hasFlights && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center', padding: '32px 16px', gap: 14,
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'rgba(224,101,46,0.12)', border: '1px solid rgba(224,101,46,0.28)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Plane size={24} color="#E0652E" strokeWidth={1.5} />
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#F4EDE1', margin: '0 0 8px' }}>
              No flights found
            </p>
            <p style={{ fontSize: 13, color: 'rgba(200,205,230,0.75)', lineHeight: 1.65, margin: 0, maxWidth: 300 }}>
              {reason || 'No flights were found for this route and date. Try a different city or date.'}
            </p>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.12)',
            borderRadius: 10, padding: '10px 14px', fontSize: 11,
            color: 'rgba(200,205,230,0.55)', lineHeight: 1.6,
          }}>
            Tip: use city names like <em>Kolkata</em>, <em>Delhi</em>, <em>Mumbai</em> or IATA codes like <em>CCU</em>, <em>DEL</em>.
          </div>
        </div>
      )}

      {/* ── Flight cards ────────────────────────────────────────────────── */}
      {hasFlights && flights.map(f => (
        <div key={f.flightNumber} style={{ background:C.card, backdropFilter:'blur(14px)', border:`1px solid ${C.border}`, borderRadius:12, padding:'13px 14px', marginBottom:8, boxShadow:C.shadow }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
            <p style={{ fontSize:13, fontWeight:700, color:C.text, margin:0 }}>{f.airline}</p>
            <span style={{ fontSize:10, color:C.muted }}>{f.flightNumber}</span>
          </div>
          <RouteTimeline from={f.departure} fromSub="" to={f.arrival} toSub="" duration={f.duration}
            subLabel={f.stops === 0 ? 'Direct' : `${f.stops} stop`} accent="var(--accent-teal)" Icon={Plane} />
          {f.price != null && (
            <p style={{ fontSize:14, fontWeight:700, color:C.text, margin:0 }}>
              From ₹{f.price.toLocaleString('en-IN')}
              <span style={{ fontSize:10, fontWeight:400, color:C.muted }}> per person</span>
            </p>
          )}
        </div>
      ))}

      {hasFlights && (
        <p style={{ fontSize:10, color:C.muted, lineHeight:1.55, margin:'6px 0 0', fontStyle:'italic' }}>
          Fetched live on tap — KothaSetu calls a metered API for flights, so it loads only when you ask.
        </p>
      )}
    </>
  )
}

// ── SCREEN 3: Detail ───────────────────────────────────────────────────────
const DETAIL_META = {
  flights:{ title:'Flights', accent:'var(--accent-teal)',    image:airportImage },
  trains: { title:'Trains',  accent:'var(--accent-primary)', image:howrahImage },
  buses:  { title:'Buses',   accent:'var(--accent-primary)', image:yellowTaxiImage },
  hotels: { title:'Hotels',  accent:'var(--accent-gold)',    image:victoriaImage },
}

function DetailScreen({ mode, overview, flightData, flightLoading, flightError, onBack }) {
  const { origin, destination, date } = overview
  const meta = DETAIL_META[mode] || { title:mode, accent:'var(--accent-primary)' }
  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 16px 0' }}>
        <button onClick={onBack} style={{
          background:C.bg2, border:`1px solid ${C.border}`, cursor:'pointer',
          padding:'6px 8px', borderRadius:8, color:C.sub, display:'flex', minHeight:'auto',
        }}>
          <ArrowLeft size={18} />
        </button>
        <div style={{ minWidth:0 }}>
          <p style={{ fontFamily:"'Baloo Da 2','Hind Siliguri',sans-serif", fontSize:18, fontWeight:800, color:C.text, margin:0 }}>
            <span style={{ color:meta.accent }}>{meta.title}</span>
          </p>
          <p style={{ fontSize:11, color:C.muted, margin:'2px 0 0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {origin} → {destination} · {formatDisplayDate(date)}
          </p>
        </div>
      </div>
      <div style={{ padding:'0 16px 24px' }}>
        <Alpona accent={meta.accent} />
        {mode === 'trains'  && <TrainsDetail data={overview.trains} />}
        {mode === 'buses'   && <BusesDetail  data={overview.buses}  />}
        {mode === 'hotels'  && <HotelsDetail data={overview.hotels} />}
        {mode === 'flights' && (
          flightLoading
            ? <div style={{ display:'flex', alignItems:'center', gap:10, padding:'20px 0', color:C.muted }}>
                <Loader2 size={18} className="ti-spin" />
                <span style={{ fontSize:13 }}>Loading live flight data…</span>
              </div>
            : flightError
              ? <p style={{ fontSize:13, color:'var(--accent-primary)', margin:'12px 0', lineHeight:1.5 }}>{flightError}</p>
              : <FlightsDetail data={flightData} />
        )}
      </div>
    </div>
  )
}

// ── Root ───────────────────────────────────────────────────────────────────
export default function TravelInfo() {
  const { darkMode } = useAppStore()
  const [screen,        setScreen]        = useState('search')
  const [overview,      setOverview]      = useState(null)
  const [activeMode,    setActiveMode]    = useState(null)
  const [flightData,    setFlightData]    = useState(null)
  const [flightLoading, setFlightLoading] = useState(false)
  const [flightError,   setFlightError]   = useState(null)
  const flightFetched                     = useRef(false)
  const backgroundImage = screen === 'detail'
    ? (DETAIL_META[activeMode]?.image || riverMountainBg)
    : riverMountainBg

  function handleSearch(data) {
    setOverview(data); setFlightData(null); flightFetched.current = false; setScreen('results')
  }

  async function handleSelectMode(mode) {
    setActiveMode(mode); setScreen('detail')
    if (mode === 'flights' && !flightFetched.current) {
      flightFetched.current = true; setFlightLoading(true); setFlightError(null)
      try {
        const params = new URLSearchParams({ origin:overview.origin, destination:overview.destination, date:overview.date })
        const res    = await fetch(`${API_BASE}/api/flights-info?${params}`)
        const data   = await res.json()
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
    <>
      <style>{`
        .ti-spin { animation: ti-kf .9s linear infinite; display:inline-block; }
        @keyframes ti-kf { to { transform:rotate(360deg); } }
        .ti-content input::placeholder { color: rgba(255,255,255,.28); }
      `}</style>

      {/* Fixed photo background — same pattern as Guide, SeasonalGuide, PhraseBank */}
      <div className="pb-bg" aria-hidden="true">
        <img src={backgroundImage} alt="" style={{ objectPosition:screen === 'detail' ? 'center' : 'center 45%' }} />
        <div className="pb-bg-overlay pb-bg-overlay--overcast" />
      </div>

      {/* Scrollable content layer */}
      <div className="ti-content" style={{
        position:'relative', zIndex:1,
        maxWidth:640, margin:'0 auto',
        fontFamily:'var(--font-interface)',
        paddingBottom:'calc(88px + env(safe-area-inset-bottom,0px))',
      }}>
        <PageHeader />

        {screen === 'search'  && <SearchScreen onSearch={handleSearch} darkMode={darkMode} />}
        {screen === 'results' && overview && <ResultsScreen overview={overview} onSelect={handleSelectMode} onBack={() => setScreen('search')} />}
        {screen === 'detail'  && overview && (
          <DetailScreen
            mode={activeMode} overview={overview}
            flightData={flightData} flightLoading={flightLoading} flightError={flightError}
            onBack={() => setScreen('results')}
          />
        )}
      </div>
    </>
  )
}
