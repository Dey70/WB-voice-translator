import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Plane, Train, Bus, Car,
  ArrowUpDown, Search, Loader2,
  AlertCircle, Users, LayoutGrid,
} from 'lucide-react'
import { buildFlightLink, buildTrainLink, buildBusLink, buildHotelLink } from '../utils/bookingLinks'
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
  { id: 'cab',    label: 'Cabs',    icon: Car },
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
  const ref               = useRef(null)

  const selected = WB_AIRPORTS.find((a) => a.city === value)

  useEffect(() => {
    const close = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const visible = WB_AIRPORTS.filter((a) =>
    `${a.city} ${a.code} ${a.name}`.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8)

  const pick = (a) => { onChange(a.city); setQuery(''); setOpen(false) }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {selected && !open ? (
        <div onClick={() => { setOpen(true); setQuery('') }} style={{ cursor: 'text' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: DARK.text }}>{selected.city}</span>
            <span style={{ fontSize: 13, color: DARK.muted, fontWeight: 500 }}>({selected.code})</span>
          </div>
          <div style={{ fontSize: 12, color: DARK.muted, marginTop: 2 }}>{selected.name}</div>
        </div>
      ) : (
        <input
          autoFocus={open}
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
          position: 'absolute', zIndex: 200, top: 'calc(100% + 8px)', left: -16, right: -16,
          background: '#1C2340', borderRadius: 14, boxShadow: '0 16px 48px rgba(0,0,0,.5)',
          border: `1px solid ${DARK.border}`, padding: '6px 0', listStyle: 'none', margin: 0,
          maxHeight: 280, overflowY: 'auto',
        }}>
          {visible.map((a) => (
            <li key={a.code}>
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); pick(a) }}
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
          position: 'absolute', zIndex: 200, top: 'calc(100% + 8px)', left: -16, right: -16,
          background: '#1C2340', borderRadius: 14, boxShadow: '0 16px 48px rgba(0,0,0,.5)',
          border: `1px solid ${DARK.border}`, padding: '6px 0', listStyle: 'none', margin: 0,
          maxHeight: 240, overflowY: 'auto',
        }}>
          {visible.map((o) => (
            <li key={o}>
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); pick(o) }}
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
      backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
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

// ─── Tab: Flight ──────────────────────────────────────────────────────────────

function FlightTab() {
  const [form, setForm] = useState({
    tripType: 'One Way', from: 'Kolkata', to: 'Bagdogra',
    date: TODAY, returnDate: '', passengers: 1, cabinClass: 'Economy', directOnly: false,
  })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((e) => ({ ...e, [k]: null }))
  }

  const swap = () => setForm((f) => ({ ...f, from: f.to, to: f.from }))

  const validate = () => {
    const e = {}
    if (!form.from) e.from = 'Select departure city'
    if (!form.to)   e.to   = 'Select destination city'
    if (!form.date) e.date = 'Select departure date'
    else if (form.date < TODAY) e.date = 'Date cannot be in the past'
    if (form.tripType === 'Round Trip') {
      if (!form.returnDate)                         e.returnDate = 'Select return date'
      else if (form.returnDate < form.date)         e.returnDate = 'Must be after departure'
    }
    return e
  }

  const handleSearch = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    setLoading(false)
    window.open(buildFlightLink(form), '_blank', 'noopener,noreferrer')
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

        {/* Swap button */}
        <button
          type="button" onClick={swap} aria-label="Swap airports"
          style={{
            position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
            width: 36, height: 36, borderRadius: '50%', border: `1.5px solid ${DARK.border}`,
            background: DARK.cardAlt, color: DARK.muted, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
            transition: 'all 0.2s',
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
          {form.date
            ? <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: DARK.text }}>{formatDate(form.date)}</span>
              </div>
            : null}
          <input
            type="date" value={form.date} min={TODAY}
            onChange={(e) => set('date', e.target.value)}
            style={{ opacity: form.date ? 0 : 1, position: form.date ? 'absolute' : 'static', width: form.date ? '100%' : 'auto', top: 0, left: 0, height: '100%', background: 'transparent', border: 'none', outline: 'none', cursor: 'pointer', colorScheme: 'dark', color: DARK.text, fontSize: 14 }}
          />
          {form.date && (
            <input
              type="date" value={form.date} min={TODAY}
              onChange={(e) => set('date', e.target.value)}
              style={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer' }}
            />
          )}
          <FieldErr msg={errors.date} />
        </FieldCard>

        {isRound && (
          <FieldCard style={{ position: 'relative' }}>
            <FieldLabel>Return</FieldLabel>
            {form.returnDate
              ? <span style={{ fontSize: 16, fontWeight: 700, color: DARK.text }}>{formatDate(form.returnDate)}</span>
              : <span style={{ fontSize: 15, color: DARK.muted }}>Add date</span>}
            <input
              type="date" value={form.returnDate} min={form.date || TODAY}
              onChange={(e) => set('returnDate', e.target.value)}
              style={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer' }}
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
            <select
              value={form.passengers} onChange={(e) => set('passengers', +e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: DARK.text, fontSize: 16, fontWeight: 700, cursor: 'pointer', colorScheme: 'dark' }}
            >
              {[1,2,3,4,5,6,7,8,9].map((n) => <option key={n} value={n}>{n} Adult{n > 1 ? 's' : ''}</option>)}
            </select>
          </div>
        </FieldCard>
        <FieldCard>
          <FieldLabel>Class</FieldLabel>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LayoutGrid size={16} color={DARK.muted} />
            <select
              value={form.cabinClass} onChange={(e) => set('cabinClass', e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: DARK.text, fontSize: 16, fontWeight: 700, cursor: 'pointer', colorScheme: 'dark' }}
            >
              {['Economy', 'Premium Economy', 'Business'].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </FieldCard>
      </div>

      {/* Direct flights toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
        <span style={{ fontSize: 14, color: DARK.text, fontWeight: 500 }}>Direct flights only</span>
        <Toggle checked={form.directOnly} onChange={(v) => set('directOnly', v)} />
      </div>

      <SearchBtn loading={loading} label="Search flights" onClick={handleSearch} />
    </div>
  )
}

// ─── Tab: Train ───────────────────────────────────────────────────────────────

function TrainTab() {
  const [form, setForm] = useState({ from: '', to: '', date: '', travelClass: 'SL', quota: 'General' })
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
      <FieldCard style={{ position: 'relative' }}>
        <FieldLabel>Date of journey</FieldLabel>
        {form.date
          ? <span style={{ fontSize: 16, fontWeight: 700, color: DARK.text }}>{formatDate(form.date)}</span>
          : <span style={{ fontSize: 15, color: DARK.muted }}>Select date</span>}
        <input
          type="date" value={form.date} min={TODAY}
          onChange={(e) => set('date', e.target.value)}
          style={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer' }}
        />
        <FieldErr msg={errors.date} />
      </FieldCard>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <FieldCard>
          <FieldLabel>Class</FieldLabel>
          <select value={form.travelClass} onChange={(e) => set('travelClass', e.target.value)}
            style={{ background: 'transparent', border: 'none', outline: 'none', color: DARK.text, fontSize: 15, fontWeight: 600, cursor: 'pointer', colorScheme: 'dark', width: '100%' }}>
            {['SL', '3A', '2A', '1A', 'CC'].map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </FieldCard>
        <FieldCard>
          <FieldLabel>Quota</FieldLabel>
          <select value={form.quota} onChange={(e) => set('quota', e.target.value)}
            style={{ background: 'transparent', border: 'none', outline: 'none', color: DARK.text, fontSize: 15, fontWeight: 600, cursor: 'pointer', colorScheme: 'dark', width: '100%' }}>
            {['General', 'Ladies', 'Senior Citizen'].map((q) => <option key={q} value={q}>{q}</option>)}
          </select>
        </FieldCard>
      </div>
      <SearchBtn loading={loading} label="Search trains" onClick={handleSearch} />
      <p style={{ textAlign: 'center', fontSize: 12, color: DARK.muted }}>You'll be redirected to IRCTC to complete your booking.</p>
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
      <FieldCard style={{ position: 'relative' }}>
        <FieldLabel>Date of journey</FieldLabel>
        {form.date
          ? <span style={{ fontSize: 16, fontWeight: 700, color: DARK.text }}>{formatDate(form.date)}</span>
          : <span style={{ fontSize: 15, color: DARK.muted }}>Select date</span>}
        <input
          type="date" value={form.date} min={TODAY}
          onChange={(e) => set('date', e.target.value)}
          style={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer' }}
        />
        <FieldErr msg={errors.date} />
      </FieldCard>
      <SearchBtn loading={loading} label="Search buses" onClick={handleSearch} />
    </div>
  )
}

// ─── Tab: Cab ─────────────────────────────────────────────────────────────────

function CabTab() {
  const [form, setForm] = useState({ pickup: '', drop: '', date: '', time: '' })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: null })) }

  const validate = () => {
    const e = {}
    if (!form.pickup.trim()) e.pickup = 'Enter pickup location'
    if (!form.drop.trim())   e.drop   = 'Enter drop location'
    if (!form.date)          e.date   = 'Select date'
    return e
  }

  const handleSearch = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    setLoading(false)
    const q = encodeURIComponent(`cab from ${form.pickup} to ${form.drop} West Bengal`)
    window.open(`https://www.olacabs.com/`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <FieldCard>
        <FieldLabel>Pickup location</FieldLabel>
        <input
          type="text" value={form.pickup} placeholder="Enter pickup point…"
          onChange={(e) => set('pickup', e.target.value)}
          style={{ background: 'transparent', border: 'none', outline: 'none', color: DARK.text, fontSize: 16, fontWeight: 600, padding: 0, width: '100%' }}
        />
        <FieldErr msg={errors.pickup} />
      </FieldCard>
      <FieldCard>
        <FieldLabel>Drop location</FieldLabel>
        <input
          type="text" value={form.drop} placeholder="Enter drop point…"
          onChange={(e) => set('drop', e.target.value)}
          style={{ background: 'transparent', border: 'none', outline: 'none', color: DARK.text, fontSize: 16, fontWeight: 600, padding: 0, width: '100%' }}
        />
        <FieldErr msg={errors.drop} />
      </FieldCard>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <FieldCard style={{ position: 'relative' }}>
          <FieldLabel>Date</FieldLabel>
          {form.date
            ? <span style={{ fontSize: 16, fontWeight: 700, color: DARK.text }}>{formatDate(form.date)}</span>
            : <span style={{ fontSize: 15, color: DARK.muted }}>Select date</span>}
          <input
            type="date" value={form.date} min={TODAY}
            onChange={(e) => set('date', e.target.value)}
            style={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer' }}
          />
          <FieldErr msg={errors.date} />
        </FieldCard>
        <FieldCard>
          <FieldLabel>Time (optional)</FieldLabel>
          <input
            type="time" value={form.time} onChange={(e) => set('time', e.target.value)}
            style={{ background: 'transparent', border: 'none', outline: 'none', color: DARK.text, fontSize: 15, fontWeight: 600, cursor: 'pointer', colorScheme: 'dark', width: '100%', padding: 0 }}
          />
        </FieldCard>
      </div>
      <SearchBtn loading={loading} label="Find cabs" onClick={handleSearch} />
      <p style={{ textAlign: 'center', fontSize: 12, color: DARK.muted }}>You'll be redirected to Ola to complete your booking.</p>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TAB_CONTENT = { flight: FlightTab, train: TrainTab, bus: BusTab, cab: CabTab }

export default function Discover() {
  const [activeTab, setActiveTab] = useState('flight')
  const TabContent = TAB_CONTENT[activeTab]

  return (
    <div style={{ minHeight: '100dvh', paddingBottom: 100, position: 'relative' }}>
      {/* Background — same pattern as other pages */}
      <div className="pb-bg" aria-hidden="true">
        <img src={bgImage} alt="" />
        <div className="pb-bg-overlay pb-bg-overlay--overcast" />
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Logo + search bar — same as every other page */}
        <div className="bh-header" style={{ padding: '20px 20px 0' }}>
          <div className="bh-brand-block">
            <span className="bh-brand">কথাসেতু</span>
          </div>
          <Link to="/" className="bh-search-btn" aria-label="Search">
            <Search size={19} />
          </Link>
        </div>

        {/* Section label + title */}
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

        {/* Wavy divider */}
        <div style={{ padding: '14px 0 4px', overflow: 'hidden' }}>
          <svg viewBox="0 0 390 24" fill="none" style={{ width: '100%', display: 'block' }}>
            <path d="M0 12 Q50 4 100 12 Q150 20 200 12 Q250 4 300 12 Q350 20 390 12" stroke={DARK.orange} strokeWidth="1" strokeOpacity="0.4" fill="none" />
            <circle cx="100" cy="12" r="3" fill={DARK.orange} fillOpacity="0.5" />
            <circle cx="280" cy="10.5" r="2" fill={DARK.orange} fillOpacity="0.4" />
            <circle cx="380" cy="12.5" r="2" fill={DARK.orange} fillOpacity="0.35" />
          </svg>
        </div>

        {/* Transport tabs */}
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

        {/* Form card */}
        <div style={{ padding: '4px 16px 0', position: 'relative' }}>
          <TabContent />
        </div>

      </div>{/* end scrollable content */}
    </div>
  )
}
