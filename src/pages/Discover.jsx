import { useState, useRef, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Plane, Train, Bus, BedDouble,
  ArrowUpDown, Search, Loader2,
  AlertCircle, Users, LayoutGrid,
} from 'lucide-react'
import { buildFlightLink, buildTrainLink, buildBusLink } from '../utils/bookingLinks'
import { searchFlights } from '../services/flightService'
import { searchHotels } from '../services/hotelService'
import bgImage from '../assets/download (18).jpg'

// ─── Static data ──────────────────────────────────────────────────────────────

const WB_AIRPORTS = [
  { code: 'CCU', city: 'Kolkata', name: 'Netaji Subhas Chandra Bose International' },
  { code: 'IXB', city: 'Bagdogra', name: 'Bagdogra Airport · Darjeeling gateway' },
  { code: 'COH', city: 'Cooch Behar', name: 'Cooch Behar Airport' },
  { code: 'RGH', city: 'Balurghat', name: 'Balurghat Airport' },
  { code: 'DEL', city: 'Delhi', name: 'Indira Gandhi International Airport' },
  { code: 'BOM', city: 'Mumbai', name: 'Chhatrapati Shivaji Maharaj International' },
  { code: 'MAA', city: 'Chennai', name: 'Chennai International Airport' },
  { code: 'BLR', city: 'Bengaluru', name: 'Kempegowda International Airport' },
  { code: 'HYD', city: 'Hyderabad', name: 'Rajiv Gandhi International Airport' },
  { code: 'GAU', city: 'Guwahati', name: 'Lokpriya Gopinath Bordoloi International' },
  { code: 'IMF', city: 'Imphal', name: 'Bir Tikendrajit International Airport' },
  { code: 'PNQ', city: 'Pune', name: 'Pune Airport' },
  { code: 'AMD', city: 'Ahmedabad', name: 'Sardar Vallabhbhai Patel International' },
]

const WB_STATIONS = [
  'Kolkata – Howrah (HWH)',
  'Kolkata – Kolkata (KOAA)',
  'New Jalpaiguri (NJP)',
  'Siliguri (SGUJ)',
  'Darjeeling (DJJ)',
  'Malda Town (MLDT)',
  'Asansol (ASN)',
  'Durgapur (DGR)',
  'Bolpur Shantiniketan (BHP)',
  'Murshidabad (MBI)',
  'Cooch Behar (COB)',
  'Alipurduar (APDJ)',
]

const WB_CITIES = [
  'Kolkata', 'Siliguri', 'Darjeeling', 'Kalimpong', 'Digha',
  'Mandarmani', 'Sundarbans', 'Murshidabad', 'Bishnupur',
  'Cooch Behar', 'Jalpaiguri', 'Malda', 'Durgapur', 'Asansol',
  'Shantiniketan', 'Purulia',
]

const TODAY = new Date().toISOString().split('T')[0]
const SEVEN_DAYS = new Date(Date.now() + 7 * 86_400_000).toISOString().split('T')[0]

const addDay = (iso) =>
  iso ? new Date(new Date(iso).getTime() + 86_400_000).toISOString().split('T')[0] : TODAY

const formatDate = (iso) => {
  if (!iso) return null
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

const TABS = [
  { id: 'flight', label: 'Flights', icon: Plane },
  { id: 'train',  label: 'Trains',  icon: Train },
  { id: 'bus',    label: 'Buses',   icon: Bus },
  { id: 'hotel',  label: 'Hotels',  icon: BedDouble },
]

// ─── Curated data ─────────────────────────────────────────────────────────────

const POPULAR_ROUTES = [
  { from: 'DEL', to: 'CCU', label: 'Delhi → Kolkata', iata: 'DEL→CCU', duration: '~2h 10m', price: '₹3,499', airlines: ['IndiGo', 'Air India', 'SpiceJet'] },
  { from: 'BOM', to: 'CCU', label: 'Mumbai → Kolkata', iata: 'BOM→CCU', duration: '~2h 40m', price: '₹4,299', airlines: ['IndiGo', 'Air India', 'Akasa'] },
  { from: 'BLR', to: 'CCU', label: 'Bangalore → Kolkata', iata: 'BLR→CCU', duration: '~2h 25m', price: '₹3,899', airlines: ['IndiGo', 'SpiceJet'] },
  { from: 'DEL', to: 'IXB', label: 'Delhi → Bagdogra', iata: 'DEL→IXB', duration: '~2h 20m', price: '₹3,799', airlines: ['IndiGo', 'Air India'], tag: '🏔️ Gateway to Darjeeling' },
  { from: 'BOM', to: 'IXB', label: 'Mumbai → Bagdogra', iata: 'BOM→IXB', duration: '~2h 55m', price: '₹4,599', airlines: ['IndiGo', 'SpiceJet'] },
  { from: 'MAA', to: 'CCU', label: 'Chennai → Kolkata', iata: 'MAA→CCU', duration: '~2h 00m', price: '₹3,299', airlines: ['IndiGo', 'Air India'] },
]

const POPULAR_TRAINS = [
  {
    name: 'Darjeeling Mail', route: 'HWH → NJP',
    dep: '22:05', arr: '08:10 (+1)', duration: '10h 05m',
    classes: [{ label: 'SL', price: '₹310' }, { label: '3A', price: '₹820' }, { label: '2A', price: '₹1,150' }],
    tag: '🏔️ For Darjeeling & Sikkim',
    link: 'https://www.ixigo.com/train/12343/darjeeling-mail',
  },
  {
    name: 'Padatik Express', route: 'KOAA → NJP',
    dep: '23:00', arr: '09:15 (+1)', duration: '10h 15m',
    classes: [{ label: 'SL', price: '₹325' }, { label: '3A', price: '₹850' }],
    tag: '🏔️ For Siliguri & North Bengal',
    link: 'https://www.ixigo.com/train/12377/padatik-express',
  },
  {
    name: 'Shantiniketan Express', route: 'HWH → BHP',
    dep: '10:10', arr: '13:25', duration: '3h 15m',
    classes: [{ label: 'SL', price: '₹145' }, { label: 'CC', price: '₹520' }],
    tag: '🎨 For Bolpur & Shantiniketan',
    link: 'https://www.ixigo.com/train/12337/shantiniketan-express',
  },
  {
    name: 'Hazarduari Express', route: 'HWH → KWAE',
    dep: '07:15', arr: '11:10', duration: '3h 55m',
    classes: [{ label: 'SL', price: '₹160' }, { label: '3A', price: '₹455' }],
    tag: '🕌 For Murshidabad',
    link: 'https://www.ixigo.com/train/13113/hazarduari-express',
  },
  {
    name: 'Tamralipta Express', route: 'HWH → DGH',
    dep: '06:25', arr: '09:35', duration: '3h 10m',
    classes: [{ label: 'SL', price: '₹130' }, { label: '3A', price: '₹390' }],
    tag: '🏖️ For Digha Beach',
    link: 'https://www.ixigo.com/train/12833/tamralipta-express',
  },
  {
    name: 'Sundarbans Express', route: 'KOAA → NMZ',
    dep: '06:10', arr: '10:00', duration: '3h 50m',
    classes: [{ label: 'SL', price: '₹140' }, { label: '3A', price: '₹430' }],
    tag: '🐯 For Sundarbans',
    link: 'https://www.ixigo.com/train/12659/sundarbans-express',
  },
]

const POPULAR_BUSES = [
  {
    route: 'Kolkata → Siliguri', duration: '~10-12 hrs',
    operators: 'NBSTC, Shyamoli, Greenline',
    price: '₹450 – ₹1,200',
    link: 'https://www.redbus.in/bus-tickets/kolkata-to-siliguri',
  },
  {
    route: 'Kolkata → Digha', duration: '~3-4 hrs',
    operators: 'SBSTC, Private',
    price: '₹150 – ₹350',
    link: 'https://www.redbus.in/bus-tickets/kolkata-to-digha',
  },
  {
    route: 'Kolkata → Mandarmani', duration: '~3.5 hrs',
    operators: 'Private',
    price: '₹200 – ₹400',
    link: 'https://www.redbus.in/bus-tickets/kolkata-to-mandarmani',
  },
  {
    route: 'Kolkata → Murshidabad', duration: '~4-5 hrs',
    operators: 'NBSTC, Private',
    price: '₹180 – ₹450',
    link: 'https://www.redbus.in/bus-tickets/kolkata-to-murshidabad',
  },
  {
    route: 'Siliguri → Darjeeling', duration: '~3 hrs',
    operators: 'Private, Shared Jeep',
    price: '₹120 – ₹350',
    link: 'https://www.redbus.in/bus-tickets/siliguri-to-darjeeling',
  },
  {
    route: 'Kolkata → Bakkhali', duration: '~3 hrs',
    operators: 'SBSTC',
    price: '₹120 – ₹280',
    link: 'https://www.redbus.in/bus-tickets/kolkata-to-bakkhali',
  },
]

const POPULAR_HOTELS = [
  { name: 'The Elgin Darjeeling', city: 'Darjeeling', stars: 5, desc: 'Colonial heritage hotel with Himalayan views', price: '₹8,500', link: 'https://www.booking.com/hotel/in/the-elgin-darjeeling.html' },
  { name: 'Mayfair Darjeeling', city: 'Darjeeling', stars: 5, desc: 'Luxury colonial property near Mall Road', price: '₹7,200', link: 'https://www.booking.com/hotel/in/mayfair-darjeeling.html' },
  { name: 'ITC Royal Bengal', city: 'Kolkata', stars: 5, desc: 'Luxury Collection hotel in the heart of Kolkata', price: '₹12,000', link: 'https://www.booking.com/hotel/in/itc-royal-bengal.html' },
  { name: 'Taj Bengal', city: 'Kolkata', stars: 5, desc: 'Iconic Taj property with city and garden views', price: '₹10,500', link: 'https://www.booking.com/hotel/in/taj-bengal-kolkata.html' },
  { name: 'Mayfair Gangtok', city: 'Gangtok', stars: 5, desc: 'Mountain resort overlooking Kanchenjunga', price: '₹6,800', link: 'https://www.booking.com/hotel/in/mayfair-gangtok.html' },
  { name: 'Sea Beach Resort Digha', city: 'Digha', stars: 3, desc: 'Beachfront property steps from the sea', price: '₹2,800', link: 'https://www.booking.com/hotel/in/sea-beach-resort-digha.html' },
]

// ─── Dark theme primitives ────────────────────────────────────────────────────

const DARK = {
  bg:      'transparent',
  card:    'rgba(10,14,30,0.55)',
  cardAlt: 'rgba(10,14,30,0.65)',
  border:  'rgba(255,255,255,0.14)',
  orange:  '#E87630',
  orangeD: '#D06520',
  text:    '#FFFFFF',
  muted:   'rgba(255,255,255,0.45)',
  label:   'rgba(255,255,255,0.35)',
}

function DarkInput({ value, onChange, placeholder, type = 'text', min, id }) {
  return (
    <input
      id={id} type={type} value={value} placeholder={placeholder} min={min}
      autoComplete="off"
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%', background: 'transparent', border: 'none', outline: 'none',
        color: DARK.text, fontSize: 16, fontWeight: 600, padding: 0,
        colorScheme: 'dark',
      }}
    />
  )
}

function DarkSelect({ value, onChange, children, fontSize = 16 }) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value} onChange={onChange}
        style={{
          background: 'transparent', border: 'none', outline: 'none',
          color: DARK.text, fontSize, fontWeight: 600,
          cursor: 'pointer', width: '100%', padding: '2px 22px 2px 0',
          appearance: 'none', WebkitAppearance: 'none',
        }}
      >
        {children}
      </select>
      <span style={{ position: 'absolute', right: 2, top: '50%', transform: 'translateY(-50%)', color: DARK.muted, fontSize: 12, pointerEvents: 'none' }}>▾</span>
    </div>
  )
}

function FieldLabel({ children }) {
  return (
    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: DARK.label, display: 'block', marginBottom: 4 }}>
      {children}
    </span>
  )
}

function FieldErr({ msg }) {
  if (!msg) return null
  return (
    <p style={{ marginTop: 4, fontSize: 11, color: '#FF6B6B', display: 'flex', alignItems: 'center', gap: 4 }}>
      <AlertCircle size={10} />{msg}
    </p>
  )
}

// ─── Airport Combobox ─────────────────────────────────────────────────────────

function AirportCombobox({ value, onChange, placeholder, hasError }) {
  const [query, setQuery] = useState('')
  const [open, setOpen]   = useState(false)
  const wrapRef  = useRef(null)
  const inputRef = useRef(null)

  const selected = WB_AIRPORTS.find((a) => a.code === value)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    const close = (e) => { if (!wrapRef.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const visible = WB_AIRPORTS.filter((a) =>
    `${a.city} ${a.code} ${a.name}`.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8)

  const pick = (a) => { onChange(a.code); setQuery(''); setOpen(false) }

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      {selected && !open ? (
        <div onClick={() => { setQuery(''); setOpen(true) }} style={{ cursor: 'text' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: DARK.text }}>{selected.city}</span>
            <span style={{ fontSize: 13, color: DARK.muted, fontWeight: 500 }}>({selected.code})</span>
          </div>
          <div style={{ fontSize: 12, color: DARK.muted, marginTop: 2 }}>{selected.name}</div>
        </div>
      ) : (
        <input
          ref={inputRef}
          type="text" value={query} placeholder={placeholder}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          style={{
            width: '100%', background: 'transparent', border: 'none', outline: 'none',
            color: DARK.text, fontSize: 18, fontWeight: 700, padding: 0,
          }}
        />
      )}
      {open && visible.length > 0 && (
        <ul style={{
          position: 'absolute', zIndex: 100,
          top: 'calc(100% + 8px)', left: -16, right: -16,
          background: '#1C2340', borderRadius: 14, boxShadow: '0 16px 48px rgba(0,0,0,.7)',
          border: `1px solid ${DARK.border}`, padding: '6px 0', listStyle: 'none', margin: 0,
          maxHeight: 260, overflowY: 'auto',
        }}>
          {visible.map((a) => (
            <li key={a.code}>
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); pick(a) }}
                onTouchEnd={(e) => { e.preventDefault(); pick(a) }}
                style={{
                  width: '100%', textAlign: 'left', background: 'none', border: 'none',
                  padding: '10px 16px', cursor: 'pointer', display: 'flex', gap: 12, alignItems: 'center',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 8, background: 'rgba(232,118,48,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: DARK.orange }}>{a.code}</span>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: DARK.text }}>{a.city}</div>
                  <div style={{ fontSize: 11, color: DARK.muted }}>{a.name}</div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
      {hasError && <div style={{ position: 'absolute', top: 4, right: 0, color: '#FF6B6B' }}><AlertCircle size={14} /></div>}
    </div>
  )
}

// ─── Generic Combobox ─────────────────────────────────────────────────────────

function GenericCombobox({ value, onChange, options, placeholder, hasError }) {
  const [query, setQuery] = useState(value || '')
  const [open, setOpen]   = useState(false)
  const ref = useRef(null)

  useEffect(() => { setQuery(value || '') }, [value])

  useEffect(() => {
    const close = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const visible = options.filter((o) => o.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
  const pick = (o) => { onChange(o); setQuery(o); setOpen(false) }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <input
        type="text" value={query} placeholder={placeholder}
        onChange={(e) => { setQuery(e.target.value); onChange(''); setOpen(true) }}
        onFocus={() => setOpen(true)}
        style={{
          width: '100%', background: 'transparent', border: 'none', outline: 'none',
          color: DARK.text, fontSize: 16, fontWeight: 600, padding: 0,
        }}
      />
      {open && visible.length > 0 && (
        <ul style={{
          position: 'absolute', zIndex: 100,
          top: 'calc(100% + 8px)', left: -16, right: -16,
          background: '#1C2340', borderRadius: 14, boxShadow: '0 16px 48px rgba(0,0,0,.7)',
          border: `1px solid ${DARK.border}`, padding: '6px 0', listStyle: 'none', margin: 0,
          maxHeight: 240, overflowY: 'auto',
        }}>
          {visible.map((o) => (
            <li key={o}>
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); pick(o) }}
                onTouchEnd={(e) => { e.preventDefault(); pick(o) }}
                style={{
                  width: '100%', textAlign: 'left', background: 'none', border: 'none',
                  padding: '10px 16px', cursor: 'pointer', fontSize: 14, color: DARK.text,
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
              >
                {o}
              </button>
            </li>
          ))}
        </ul>
      )}
      {hasError && <div style={{ position: 'absolute', top: 4, right: 0, color: '#FF6B6B' }}><AlertCircle size={14} /></div>}
    </div>
  )
}

// ─── Shared field card ────────────────────────────────────────────────────────

function FieldCard({ children, style = {} }) {
  return (
    <div style={{
      background: DARK.card, borderRadius: 16, padding: '14px 16px',
      border: `1px solid ${DARK.border}`,
      position: 'relative',
      ...style,
    }}>
      {children}
    </div>
  )
}

// ─── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: 46, height: 26, borderRadius: 13, cursor: 'pointer', flexShrink: 0,
        background: checked ? DARK.orange : 'rgba(255,255,255,0.15)',
        position: 'relative', transition: 'background 0.25s',
      }}
    >
      <div style={{
        position: 'absolute', top: 3, left: checked ? 23 : 3,
        width: 20, height: 20, borderRadius: '50%', background: '#fff',
        transition: 'left 0.25s', boxShadow: '0 1px 4px rgba(0,0,0,.3)',
      }} />
    </div>
  )
}

// ─── Search Button ────────────────────────────────────────────────────────────

function SearchBtn({ loading, label, onClick }) {
  return (
    <button
      type="button" onClick={onClick} disabled={loading}
      style={{
        width: '100%', padding: '16px', borderRadius: 50, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
        background: loading ? 'rgba(232,118,48,0.5)' : DARK.orange,
        color: '#fff', fontSize: 15, fontWeight: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        boxShadow: `0 8px 28px rgba(232,118,48,0.35)`,
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = DARK.orangeD }}
      onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = DARK.orange }}
    >
      {loading
        ? <><Loader2 size={18} className="animate-spin" />Searching…</>
        : <><Search size={18} />{label}</>}
    </button>
  )
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div style={{
      background: 'rgba(30,35,60,0.96)', color: '#fff', fontSize: 13, fontWeight: 500,
      borderRadius: 10, padding: '10px 16px', marginBottom: 12,
      border: '1px solid rgba(255,255,255,0.12)',
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      <AlertCircle size={14} color={DARK.orange} />
      {message}
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 4 }}>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{
          background: '#fff', borderRadius: 12, padding: 16,
          border: '1px solid #f3f4f6', overflow: 'hidden', position: 'relative',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ height: 14, background: '#e5e7eb', borderRadius: 6, width: '55%', animation: 'pulse 1.5s ease-in-out infinite' }} />
            <div style={{ height: 12, background: '#e5e7eb', borderRadius: 6, width: '75%', animation: 'pulse 1.5s ease-in-out infinite 0.2s' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ height: 20, background: '#e5e7eb', borderRadius: 6, width: '30%', animation: 'pulse 1.5s ease-in-out infinite 0.4s' }} />
              <div style={{ height: 32, background: '#e5e7eb', borderRadius: 8, width: '22%', animation: 'pulse 1.5s ease-in-out infinite 0.6s' }} />
            </div>
          </div>
        </div>
      ))}
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  )
}

// ─── Flight result card ───────────────────────────────────────────────────────

function FlightCard({ flight, bookLink }) {
  const stopsLabel = flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`
  const statusBadge = flight.status && flight.status !== 'scheduled'
    ? <span style={{ fontSize: 11, background: '#fef9c3', color: '#854d0e', borderRadius: 4, padding: '1px 6px', marginLeft: 6 }}>{flight.status}</span>
    : null
  return (
    <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: '1px solid #f3f4f6', padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, color: '#1f2937', fontSize: 15 }}>
            {flight.airline}
            {flight.flightNo !== '—' && <span style={{ color: '#6b7280', fontWeight: 400, fontSize: 13 }}> · {flight.flightNo}</span>}
            {statusBadge}
          </div>
          <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
            {flight.depTime} → {flight.arrTime} &nbsp;·&nbsp; {flight.duration} &nbsp;·&nbsp; {stopsLabel}
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          {flight.price != null
            ? <div style={{ fontSize: 20, fontWeight: 700, color: '#0F4C5C' }}>₹{flight.price.toLocaleString('en-IN')}</div>
            : <div style={{ fontSize: 12, color: '#6b7280' }}>Price on Ixigo</div>
          }
        </div>
      </div>
      <div style={{ marginTop: 12 }}>
        <button
          type="button"
          onClick={() => window.open(bookLink, '_blank', 'noopener,noreferrer')}
          style={{ background: '#0F4C5C', color: '#fff', borderRadius: 8, padding: '8px 16px', fontSize: 14, border: 'none', cursor: 'pointer', fontWeight: 600 }}
        >
          Check Price →
        </button>
      </div>
    </div>
  )
}

// ─── Flight fallback card (shown when API unavailable) ───────────────────────

function FlightFallbackCard({ from, to, date, searchForm }) {
  const fromAirport = WB_AIRPORTS.find((a) => a.code === from)
  const toAirport   = WB_AIRPORTS.find((a) => a.code === to)
  const fromLabel   = fromAirport ? `${fromAirport.city} (${from})` : from
  const toLabel     = toAirport   ? `${toAirport.city} (${to})`     : to
  const mmtLink     = buildFlightLink({ ...searchForm, passengers: searchForm?.passengers ?? 1 })

  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #f3f4f6', padding: 16, marginTop: 4 }}>
      <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 6 }}>Live prices unavailable</div>
      <div style={{ fontWeight: 700, color: '#1f2937', fontSize: 16, marginBottom: 2 }}>
        {fromLabel} → {toLabel}
      </div>
      {date && (
        <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 14 }}>{formatDate(date)}</div>
      )}
      <button
        type="button"
        onClick={() => window.open(mmtLink, '_blank', 'noopener,noreferrer')}
        style={{ background: '#0F4C5C', color: '#fff', borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', width: '100%' }}
      >
        Search on Ixigo →
      </button>
      <p style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center', marginTop: 8, marginBottom: 0 }}>
        Or browse popular routes below
      </p>
    </div>
  )
}

// ─── Hotel result card ────────────────────────────────────────────────────────

function HotelResultCard({ hotel }) {
  const bookLink = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(hotel.name + ' ' + hotel.city)}`
  const stars = '★'.repeat(Math.min(5, Math.max(1, hotel.stars)))
  return (
    <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: '1px solid #f3f4f6', padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, color: '#1f2937', fontSize: 15 }}>{hotel.name}</div>
          <div style={{ color: '#f59e0b', fontSize: 13, marginTop: 2 }}>{stars}</div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#0F4C5C' }}>₹{hotel.pricePerNight.toLocaleString('en-IN')}</div>
          <div style={{ fontSize: 11, color: '#6b7280' }}>/night</div>
        </div>
      </div>
      <div style={{ marginTop: 12 }}>
        <button
          type="button"
          onClick={() => window.open(bookLink, '_blank', 'noopener,noreferrer')}
          style={{ background: '#0F4C5C', color: '#fff', borderRadius: 8, padding: '8px 16px', fontSize: 14, border: 'none', cursor: 'pointer', fontWeight: 600 }}
        >
          View Hotel
        </button>
      </div>
    </div>
  )
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: DARK.text, margin: 0 }}>{title}</h2>
      <p style={{ fontSize: 12, color: DARK.muted, margin: '4px 0 0' }}>{subtitle}</p>
    </div>
  )
}

// ─── Popular routes section ───────────────────────────────────────────────────

function PopularRoutes({ onRouteSearch, searching }) {
  return (
    <div style={{ marginTop: 24 }}>
      <SectionHeader
        title="✈️ Popular Routes to West Bengal"
        subtitle="Tap any route to see live prices"
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {POPULAR_ROUTES.map((r) => (
          <div key={r.iata} style={{
            background: 'rgba(10,14,30,0.55)', borderRadius: 14, padding: 14,
            border: '1px solid rgba(255,255,255,0.12)', display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            {r.tag && (
              <span style={{ fontSize: 10, color: '#5eead4', background: 'rgba(20,184,166,0.12)', borderRadius: 20, padding: '2px 8px', alignSelf: 'flex-start' }}>
                {r.tag}
              </span>
            )}
            <div style={{ fontWeight: 700, color: DARK.text, fontSize: 13, lineHeight: 1.3 }}>{r.label}</div>
            <div style={{ fontSize: 11, color: DARK.muted }}>{r.iata} · {r.duration}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {r.airlines.map((a) => (
                <span key={a} style={{ fontSize: 10, background: 'rgba(255,255,255,0.08)', color: DARK.muted, borderRadius: 20, padding: '2px 7px' }}>{a}</span>
              ))}
            </div>
            <div style={{ fontSize: 12, color: DARK.orange, fontWeight: 600 }}>From {r.price}</div>
            <button
              type="button"
              onClick={() => onRouteSearch(r)}
              disabled={searching}
              style={{
                background: searching ? 'rgba(232,118,48,0.4)' : DARK.orange,
                color: '#fff', borderRadius: 8, padding: '7px 0', fontSize: 12, fontWeight: 600,
                border: 'none', cursor: searching ? 'not-allowed' : 'pointer', width: '100%', marginTop: 2,
              }}
            >
              {searching ? 'Searching…' : 'Search Flights'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Popular trains section ───────────────────────────────────────────────────

function PopularTrains() {
  return (
    <div style={{ marginTop: 24 }}>
      <SectionHeader
        title="🚂 Popular Trains to West Bengal"
        subtitle="Tap to book on Ixigo – authorized IRCTC partner"
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {POPULAR_TRAINS.map((t) => (
          <div key={t.name} style={{ background: '#fff', borderRadius: 14, padding: 16, border: '1px solid #f3f4f6', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: '#1f2937', fontSize: 15 }}>{t.name}</div>
                <div style={{ fontSize: 13, color: '#4b5563', marginTop: 3 }}>
                  {t.route} &nbsp;·&nbsp; {t.dep} → {t.arr} &nbsp;·&nbsp; {t.duration}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 8 }}>
                  {t.classes.map((c) => (
                    <span key={c.label} style={{ fontSize: 11, background: '#f3f4f6', color: '#374151', borderRadius: 20, padding: '3px 9px' }}>
                      {c.label}: {c.price}
                    </span>
                  ))}
                  <span style={{ fontSize: 11, background: '#f0fdfa', color: '#0f766e', borderRadius: 20, padding: '3px 9px' }}>
                    {t.tag}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <button
                type="button"
                onClick={() => window.open(t.link, '_blank', 'noopener,noreferrer')}
                style={{ background: '#0F4C5C', color: '#fff', borderRadius: 8, padding: '10px 0', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', width: '100%' }}
              >
                Book on Ixigo
              </button>
              <button
                type="button"
                onClick={() => window.open('https://www.irctc.co.in', '_blank', 'noopener,noreferrer')}
                style={{ background: 'none', color: '#0F4C5C', borderRadius: 8, padding: '6px 0', fontSize: 12, fontWeight: 500, border: 'none', cursor: 'pointer', width: '100%', textAlign: 'center' }}
              >
                or book on IRCTC →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Popular buses section ────────────────────────────────────────────────────

function PopularBuses() {
  return (
    <div style={{ marginTop: 24 }}>
      <SectionHeader
        title="🚌 Popular Bus Routes in West Bengal"
        subtitle="Tap to see buses on RedBus"
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {POPULAR_BUSES.map((b) => (
          <div key={b.route} style={{ background: '#fff', borderRadius: 14, padding: 16, border: '1px solid #f3f4f6', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
            <div style={{ fontWeight: 700, color: '#1f2937', fontSize: 15 }}>{b.route}</div>
            <div style={{ fontSize: 13, color: '#4b5563', marginTop: 4 }}>
              {b.duration} &nbsp;·&nbsp; {b.operators}
            </div>
            <div style={{ fontSize: 13, color: '#0F4C5C', fontWeight: 600, marginTop: 4 }}>{b.price}</div>
            <button
              type="button"
              onClick={() => window.open(b.link, '_blank', 'noopener,noreferrer')}
              style={{
                background: '#0F4C5C', color: '#fff', borderRadius: 8, padding: '10px 0', fontSize: 14, fontWeight: 600,
                border: 'none', cursor: 'pointer', width: '100%', marginTop: 12,
              }}
            >
              View Buses
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Popular hotels section ───────────────────────────────────────────────────

function PopularHotels() {
  return (
    <div style={{ marginTop: 24 }}>
      <SectionHeader
        title="🏨 Recommended Stays in West Bengal"
        subtitle=""
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {POPULAR_HOTELS.map((h) => (
          <div key={h.name} style={{ background: '#fff', borderRadius: 14, padding: 16, border: '1px solid #f3f4f6', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: '#1f2937', fontSize: 15 }}>{h.name}</div>
                <div style={{ color: '#f59e0b', fontSize: 13, marginTop: 2 }}>{'★'.repeat(h.stars)}</div>
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{h.city} · {h.desc}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#0F4C5C' }}>{h.price}</div>
                <div style={{ fontSize: 11, color: '#6b7280' }}>/night</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => window.open(h.link, '_blank', 'noopener,noreferrer')}
              style={{ background: '#0F4C5C', color: '#fff', borderRadius: 8, padding: '10px 0', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', width: '100%', marginTop: 12 }}
            >
              View Hotel
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Tab: Flight ──────────────────────────────────────────────────────────────

function FlightTab() {
  const [form, setForm] = useState({
    tripType: 'One Way', from: 'CCU', to: 'IXB',
    date: TODAY, returnDate: '', passengers: 1, cabinClass: 'Economy', directOnly: false,
  })
  const [errors, setErrors]     = useState({})
  const [loading, setLoading]   = useState(false)
  const [results, setResults]   = useState(null)

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((e) => ({ ...e, [k]: null }))
  }

  const swap = () => setForm((f) => ({ ...f, from: f.to, to: f.from }))

  const validate = (f = form) => {
    const e = {}
    if (!f.from) e.from = 'Select departure city'
    if (!f.to)   e.to   = 'Select destination city'
    if (!f.date) e.date = 'Select departure date'
    else if (f.date < TODAY) e.date = 'Date cannot be in the past'
    if (f.tripType === 'Round Trip') {
      if (!f.returnDate)               e.returnDate = 'Select return date'
      else if (f.returnDate < f.date)  e.returnDate = 'Must be after departure'
    }
    return e
  }

  const doSearch = useCallback(async (searchForm) => {
    setLoading(true)
    setResults(null)
    try {
      const flights = await searchFlights({
        from: searchForm.from,
        to: searchForm.to,
        date: searchForm.date,
        adults: searchForm.passengers ?? 1,
        cabin: searchForm.cabinClass ?? 'Economy',
      })
      if (!flights.length) throw new Error('empty')
      setResults({ flights, from: searchForm.from, to: searchForm.to, date: searchForm.date, live: true })
    } catch {
      setResults({ fallback: true, from: searchForm.from, to: searchForm.to, date: searchForm.date, form: searchForm })
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSearch = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    await doSearch(form)
  }

  const handleRouteSearch = (route) => {
    const searchForm = { ...form, from: route.from, to: route.to, date: SEVEN_DAYS }
    setForm((f) => ({ ...f, from: route.from, to: route.to, date: SEVEN_DAYS }))
    doSearch(searchForm)
  }

  const isRound = form.tripType === 'Round Trip'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Trip type */}
      <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.07)', borderRadius: 10, padding: 3, alignSelf: 'flex-start' }}>
        {['One Way', 'Round Trip'].map((t) => (
          <button
            key={t} type="button" onClick={() => set('tripType', t)}
            style={{
              padding: '7px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              background: form.tripType === t ? DARK.orange : 'transparent',
              color: form.tripType === t ? '#fff' : DARK.muted,
              transition: 'all 0.2s',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* FROM / TO */}
      <div style={{ position: 'relative' }}>
        <FieldCard style={{ borderRadius: '16px 16px 0 0', borderBottom: `1px solid ${DARK.border}`, paddingBottom: 18 }}>
          <FieldLabel>From</FieldLabel>
          <AirportCombobox value={form.from} onChange={(v) => set('from', v)} placeholder="Departure city…" hasError={!!errors.from} />
          <FieldErr msg={errors.from} />
        </FieldCard>

        <button
          type="button" onClick={swap} aria-label="Swap airports"
          style={{
            position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
            width: 36, height: 36, minWidth: 36, minHeight: 36, padding: 0,
            borderRadius: '50%', border: `1.5px solid ${DARK.border}`,
            background: DARK.cardAlt, color: DARK.muted, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
            transition: 'all 0.2s', flexShrink: 0,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = DARK.orange; e.currentTarget.style.color = DARK.orange }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = DARK.border; e.currentTarget.style.color = DARK.muted }}
        >
          <ArrowUpDown size={15} />
        </button>

        <FieldCard style={{ borderRadius: '0 0 16px 16px', paddingTop: 18 }}>
          <FieldLabel>To</FieldLabel>
          <AirportCombobox value={form.to} onChange={(v) => set('to', v)} placeholder="Destination city…" hasError={!!errors.to} />
          <FieldErr msg={errors.to} />
        </FieldCard>
      </div>

      {/* Dates */}
      <div style={{ display: 'grid', gridTemplateColumns: isRound ? '1fr 1fr' : '1fr', gap: 10 }}>
        <FieldCard>
          <FieldLabel>Depart</FieldLabel>
          <input
            type="date" value={form.date} min={TODAY}
            onChange={(e) => set('date', e.target.value)}
            style={{ background: 'transparent', border: 'none', outline: 'none', color: DARK.text, fontSize: 16, fontWeight: 700, cursor: 'pointer', width: '100%', padding: 0, minHeight: 28 }}
          />
          <FieldErr msg={errors.date} />
        </FieldCard>

        {isRound && (
          <FieldCard>
            <FieldLabel>Return</FieldLabel>
            <input
              type="date" value={form.returnDate} min={form.date || TODAY}
              onChange={(e) => set('returnDate', e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: DARK.text, fontSize: 16, fontWeight: 700, cursor: 'pointer', width: '100%', padding: 0, minHeight: 28 }}
            />
            <FieldErr msg={errors.returnDate} />
          </FieldCard>
        )}
      </div>

      {/* Travellers + Class */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <FieldCard>
          <FieldLabel>Travellers</FieldLabel>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={16} color={DARK.muted} />
            <DarkSelect value={form.passengers} onChange={(e) => set('passengers', +e.target.value)}>
              {[1,2,3,4,5,6,7,8,9].map((n) => <option key={n} value={n} style={{ background: '#0d1228', color: '#fff' }}>{n} Adult{n > 1 ? 's' : ''}</option>)}
            </DarkSelect>
          </div>
        </FieldCard>
        <FieldCard>
          <FieldLabel>Class</FieldLabel>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LayoutGrid size={16} color={DARK.muted} />
            <DarkSelect value={form.cabinClass} onChange={(e) => set('cabinClass', e.target.value)}>
              {['Economy', 'Premium Economy', 'Business'].map((c) => <option key={c} value={c} style={{ background: '#0d1228', color: '#fff' }}>{c}</option>)}
            </DarkSelect>
          </div>
        </FieldCard>
      </div>

      {/* Direct flights toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
        <span style={{ fontSize: 14, color: DARK.text, fontWeight: 500 }}>Direct flights only</span>
        <Toggle checked={form.directOnly} onChange={(v) => set('directOnly', v)} />
      </div>

      <SearchBtn loading={loading} label="Search flights" onClick={handleSearch} />

      {/* Results */}
      {loading && <Skeleton />}

      {!loading && results?.live && results.flights.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
          <div style={{ fontSize: 13, color: DARK.muted, marginBottom: 2 }}>
            {results.flights.length} flight{results.flights.length > 1 ? 's' : ''} found · Prices on Ixigo
          </div>
          {results.flights.map((f, i) => {
            const link = buildFlightLink({ from: results.from, to: results.to, date: results.date, passengers: form.passengers ?? 1, cabinClass: form.cabinClass ?? 'Economy', tripType: form.tripType })
            return <FlightCard key={i} flight={f} bookLink={link} />
          })}
        </div>
      )}

      {!loading && results?.fallback && (
        <FlightFallbackCard from={results.from} to={results.to} date={results.date} searchForm={results.form} />
      )}

      <PopularRoutes onRouteSearch={handleRouteSearch} searching={loading} />
    </div>
  )
}

// ─── Tab: Train ───────────────────────────────────────────────────────────────

function TrainTab() {
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState({
    from:        searchParams.get('from')  || '',
    to:          searchParams.get('to')    || '',
    date:        searchParams.get('date')  || '',
    travelClass: searchParams.get('class') || 'SL',
    quota:       searchParams.get('quota') || 'General',
  })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: null })) }

  const validate = () => {
    const e = {}
    if (!form.from) e.from = 'Select departure station'
    if (!form.to)   e.to   = 'Select destination station'
    if (!form.date) e.date = 'Select journey date'
    else if (form.date < TODAY) e.date = 'Date cannot be in the past'
    return e
  }

  const handleSearch = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    setLoading(false)
    window.open(buildTrainLink(), '_blank', 'noopener,noreferrer')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <FieldCard>
        <FieldLabel>From station</FieldLabel>
        <GenericCombobox value={form.from} onChange={(v) => set('from', v)} options={WB_STATIONS} placeholder="Search station…" hasError={!!errors.from} />
        <FieldErr msg={errors.from} />
      </FieldCard>
      <FieldCard>
        <FieldLabel>To station</FieldLabel>
        <GenericCombobox value={form.to} onChange={(v) => set('to', v)} options={WB_STATIONS} placeholder="Search station…" hasError={!!errors.to} />
        <FieldErr msg={errors.to} />
      </FieldCard>
      <FieldCard>
        <FieldLabel>Date of journey</FieldLabel>
        <input
          type="date" value={form.date} min={TODAY}
          onChange={(e) => set('date', e.target.value)}
          style={{ background: 'transparent', border: 'none', outline: 'none', color: DARK.text, fontSize: 16, fontWeight: 700, cursor: 'pointer', width: '100%', padding: 0, minHeight: 28 }}
        />
        <FieldErr msg={errors.date} />
      </FieldCard>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <FieldCard>
          <FieldLabel>Class</FieldLabel>
          <DarkSelect value={form.travelClass} onChange={(e) => set('travelClass', e.target.value)} fontSize={15}>
            {['SL', '3A', '2A', '1A', 'CC'].map((c) => <option key={c} value={c} style={{ background: '#0d1228', color: '#fff' }}>{c}</option>)}
          </DarkSelect>
        </FieldCard>
        <FieldCard>
          <FieldLabel>Quota</FieldLabel>
          <DarkSelect value={form.quota} onChange={(e) => set('quota', e.target.value)} fontSize={15}>
            {['General', 'Ladies', 'Senior Citizen'].map((q) => <option key={q} value={q} style={{ background: '#0d1228', color: '#fff' }}>{q}</option>)}
          </DarkSelect>
        </FieldCard>
      </div>
      <SearchBtn loading={loading} label="Search trains" onClick={handleSearch} />
      <p style={{ textAlign: 'center', fontSize: 12, color: DARK.muted }}>You'll be redirected to IRCTC to complete your booking.</p>

      <PopularTrains />
    </div>
  )
}

// ─── Tab: Bus ─────────────────────────────────────────────────────────────────

function BusTab() {
  const [form, setForm] = useState({ from: '', to: '', date: '' })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: null })) }

  const validate = () => {
    const e = {}
    if (!form.from) e.from = 'Select departure city'
    if (!form.to)   e.to   = 'Select destination city'
    if (!form.date) e.date = 'Select journey date'
    else if (form.date < TODAY) e.date = 'Date cannot be in the past'
    return e
  }

  const handleSearch = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    setLoading(false)
    window.open(buildBusLink(form), '_blank', 'noopener,noreferrer')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <FieldCard>
        <FieldLabel>From city</FieldLabel>
        <GenericCombobox value={form.from} onChange={(v) => set('from', v)} options={WB_CITIES} placeholder="Search city…" hasError={!!errors.from} />
        <FieldErr msg={errors.from} />
      </FieldCard>
      <FieldCard>
        <FieldLabel>To city</FieldLabel>
        <GenericCombobox value={form.to} onChange={(v) => set('to', v)} options={WB_CITIES} placeholder="Search city…" hasError={!!errors.to} />
        <FieldErr msg={errors.to} />
      </FieldCard>
      <FieldCard>
        <FieldLabel>Date of journey</FieldLabel>
        <input
          type="date" value={form.date} min={TODAY}
          onChange={(e) => set('date', e.target.value)}
          style={{ background: 'transparent', border: 'none', outline: 'none', color: DARK.text, fontSize: 16, fontWeight: 700, cursor: 'pointer', width: '100%', padding: 0, minHeight: 28 }}
        />
        <FieldErr msg={errors.date} />
      </FieldCard>
      <SearchBtn loading={loading} label="Search buses" onClick={handleSearch} />

      <PopularBuses />
    </div>
  )
}

// ─── Tab: Hotel ───────────────────────────────────────────────────────────────

function HotelTab() {
  const [form, setForm] = useState({ city: 'Kolkata', checkIn: TODAY, checkOut: addDay(TODAY), rooms: 1, guests: 2 })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [toast, setToast]     = useState(null)

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: null })) }

  const handleCheckIn = (v) => {
    set('checkIn', v)
    if (form.checkOut && form.checkOut <= v) set('checkOut', addDay(v))
  }

  const validate = () => {
    const e = {}
    if (!form.city)    e.city    = 'Select a city'
    if (!form.checkIn) e.checkIn = 'Select check-in date'
    if (!form.checkOut || form.checkOut <= form.checkIn) e.checkOut = 'Must be after check-in'
    return e
  }

  const handleSearch = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    setResults(null)
    try {
      const hotels = await searchHotels({
        city: form.city,
        checkin: form.checkIn,
        checkout: form.checkOut,
        guests: form.guests,
      })
      setResults(hotels)
    } catch {
      setToast('Live prices unavailable — browse recommended stays below')
      setResults(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      <FieldCard>
        <FieldLabel>City</FieldLabel>
        <DarkSelect value={form.city} onChange={(e) => set('city', e.target.value)}>
          {WB_CITIES.map((c) => <option key={c} value={c} style={{ background: '#0d1228', color: '#fff' }}>{c}</option>)}
        </DarkSelect>
        <FieldErr msg={errors.city} />
      </FieldCard>

      <FieldCard>
        <FieldLabel>Check-in</FieldLabel>
        <input
          type="date" value={form.checkIn} min={TODAY}
          onChange={(e) => handleCheckIn(e.target.value)}
          style={{ background: 'transparent', border: 'none', outline: 'none', color: DARK.text, fontSize: 16, fontWeight: 700, cursor: 'pointer', width: '100%', padding: 0, minHeight: 28 }}
        />
        <FieldErr msg={errors.checkIn} />
      </FieldCard>
      <FieldCard>
        <FieldLabel>Check-out</FieldLabel>
        <input
          type="date" value={form.checkOut} min={addDay(form.checkIn)}
          onChange={(e) => set('checkOut', e.target.value)}
          style={{ background: 'transparent', border: 'none', outline: 'none', color: DARK.text, fontSize: 16, fontWeight: 700, cursor: 'pointer', width: '100%', padding: 0, minHeight: 28 }}
        />
        <FieldErr msg={errors.checkOut} />
      </FieldCard>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <FieldCard>
          <FieldLabel>Rooms</FieldLabel>
          <DarkSelect value={form.rooms} onChange={(e) => set('rooms', +e.target.value)}>
            {[1,2,3,4,5].map((n) => <option key={n} value={n} style={{ background: '#0d1228', color: '#fff' }}>{n} Room{n > 1 ? 's' : ''}</option>)}
          </DarkSelect>
        </FieldCard>
        <FieldCard>
          <FieldLabel>Guests</FieldLabel>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={16} color={DARK.muted} />
            <DarkSelect value={form.guests} onChange={(e) => set('guests', +e.target.value)}>
              {[1,2,3,4,5,6,7,8,9].map((n) => <option key={n} value={n} style={{ background: '#0d1228', color: '#fff' }}>{n} Guest{n > 1 ? 's' : ''}</option>)}
            </DarkSelect>
          </div>
        </FieldCard>
      </div>

      <SearchBtn loading={loading} label="Search Hotels" onClick={handleSearch} />
      <p style={{ textAlign: 'center', fontSize: 12, color: DARK.muted }}>You'll be redirected to Booking.com to complete your reservation.</p>

      {loading && <Skeleton />}

      {!loading && results && results.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
          <div style={{ fontSize: 13, color: DARK.muted, marginBottom: 2 }}>
            {results.length} hotel{results.length > 1 ? 's' : ''} found
          </div>
          {results.map((h, i) => (
            <HotelResultCard key={i} hotel={h} />
          ))}
        </div>
      )}

      <PopularHotels />
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TAB_CONTENT = { flight: FlightTab, train: TrainTab, bus: BusTab, hotel: HotelTab }

export default function Discover() {
  const [searchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState(TAB_CONTENT[tabParam] ? tabParam : 'flight')
  const TabContent = TAB_CONTENT[activeTab]

  return (
    <div style={{ minHeight: '100dvh', paddingBottom: 100, position: 'relative' }}>
      <div className="pb-bg" aria-hidden="true">
        <img src={bgImage} alt="" />
        <div className="pb-bg-overlay pb-bg-overlay--overcast" />
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>

        <div className="bh-header" style={{ padding: '20px 20px 0' }}>
          <Link to="/" className="bh-brand-block" style={{ textDecoration: 'none' }}>
            <span className="bh-brand">কথাসেতু</span>
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
          </Link>
          <Link to="/discover" className="bh-search-btn" aria-label="Search">
            <Search size={19} />
          </Link>
        </div>

        <div style={{ padding: '22px 20px 0' }}>
          <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: DARK.orange, marginBottom: 4 }}>
            Getting here
          </p>
          <h1 style={{
            fontSize: 28, fontWeight: 400, color: DARK.text, margin: 0, lineHeight: 1.2,
            fontFamily: "'Baloo Da 2', 'Hind Siliguri', sans-serif",
          }}>
            <em style={{ fontStyle: 'italic', fontWeight: 700 }}>Travel</em> search
          </h1>
        </div>

        <div style={{ padding: '14px 0 4px', overflow: 'hidden' }}>
          <svg viewBox="0 0 390 24" fill="none" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: 'auto', display: 'block' }}>
            <path d="M0 12 Q50 4 100 12 Q150 20 200 12 Q250 4 300 12 Q350 20 390 12" stroke={DARK.orange} strokeWidth="1" strokeOpacity="0.4" fill="none" />
            <circle cx="100" cy="12" r="3" fill={DARK.orange} fillOpacity="0.5" />
            <circle cx="280" cy="10.5" r="2" fill={DARK.orange} fillOpacity="0.4" />
            <circle cx="380" cy="12.5" r="2" fill={DARK.orange} fillOpacity="0.35" />
          </svg>
        </div>

        <div style={{ display: 'flex', gap: 8, padding: '12px 20px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id
          return (
            <button
              key={id} type="button" onClick={() => setActiveTab(id)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 6, padding: '14px 20px', borderRadius: 14, border: 'none', cursor: 'pointer',
                background: active ? 'rgba(10,14,30,0.65)' : 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                border: active ? `1px solid rgba(232,118,48,0.35)` : `1px solid rgba(255,255,255,0.08)`,
                color: active ? DARK.orange : DARK.muted,
                minWidth: 72, flexShrink: 0, transition: 'all 0.2s',
              }}
            >
              <Icon size={22} strokeWidth={active ? 2.2 : 1.6} />
              <span style={{ fontSize: 12, fontWeight: active ? 700 : 500 }}>{label}</span>
            </button>
          )
        })}
        </div>

        <div style={{ padding: '4px 16px 0', position: 'relative' }}>
          <TabContent />
        </div>

      </div>
    </div>
  )
}
