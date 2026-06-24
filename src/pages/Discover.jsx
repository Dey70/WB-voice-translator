import { useState, useRef, useEffect } from 'react'
import {
  Plane, Train, Bus, Building2,
  ArrowLeftRight, Search, Loader2,
  ChevronDown, AlertCircle,
} from 'lucide-react'
import { buildFlightLink, buildTrainLink, buildBusLink, buildHotelLink } from '../utils/bookingLinks'

// ─── Static data ──────────────────────────────────────────────────────────────

const WB_CITIES = [
  'Kolkata', 'Siliguri', 'Darjeeling', 'Kalimpong', 'Gangtok',
  'Digha', 'Mandarmani', 'Sundarbans', 'Murshidabad', 'Bishnupur',
  'Cooch Behar', 'Jalpaiguri', 'Malda', 'Durgapur', 'Asansol',
  'Shantiniketan', 'Purulia',
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

const TODAY = new Date().toISOString().split('T')[0]

const addDay = (iso) =>
  iso ? new Date(new Date(iso).getTime() + 86_400_000).toISOString().split('T')[0] : TODAY

const TABS = [
  { id: 'flight', label: 'Flight', icon: Plane },
  { id: 'train',  label: 'Train',  icon: Train },
  { id: 'bus',    label: 'Bus',    icon: Bus },
  { id: 'hotel',  label: 'Hotel',  icon: Building2 },
]

// ─── Shared primitives ────────────────────────────────────────────────────────

function inputCls(hasError) {
  return [
    'w-full px-3 py-2.5 text-sm rounded-lg border bg-white',
    'focus:outline-none focus:ring-2 transition-colors placeholder:text-gray-400',
    hasError
      ? 'border-red-400 focus:ring-red-200'
      : 'border-gray-200 focus:border-[#0F4C5C]',
  ].join(' ')
}

function Label({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-gray-400">
      {children}
    </label>
  )
}

function FieldError({ msg }) {
  if (!msg) return null
  return (
    <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
      <AlertCircle size={11} />{msg}
    </p>
  )
}

function TextInput({ id, value, onChange, placeholder, type = 'text', min, hasError }) {
  return (
    <input
      id={id} type={type} value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder} min={min} autoComplete="off"
      className={inputCls(hasError)}
    />
  )
}

function NumberInput({ id, value, onChange, min = 1, max = 9 }) {
  return (
    <input
      id={id} type="number" value={value} min={min} max={max}
      onChange={(e) => onChange(Math.max(min, Math.min(max, parseInt(e.target.value, 10) || min)))}
      className={inputCls(false)}
    />
  )
}

function SelectInput({ id, value, onChange, options }) {
  return (
    <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={inputCls(false)}>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

function SearchBtn({ loading, label, onClick }) {
  return (
    <button
      type="button" onClick={onClick} disabled={loading}
      className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#0F4C5C] py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#0a3a47] active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-60"
      style={{ boxShadow: '0 6px 22px rgba(15,76,92,.28)' }}
    >
      {loading
        ? <><Loader2 size={16} className="animate-spin" />Searching…</>
        : <><Search size={16} />{label}</>}
    </button>
  )
}

// ─── Combobox ─────────────────────────────────────────────────────────────────

function Combobox({ id, value, onChange, options, placeholder, hasError }) {
  const [query, setQuery]   = useState(value || '')
  const [open, setOpen]     = useState(false)
  const containerRef        = useRef(null)

  useEffect(() => { setQuery(value || '') }, [value])

  useEffect(() => {
    const close = (e) => { if (!containerRef.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const visible = options
    .filter((o) => o.toLowerCase().includes((query || '').toLowerCase()))
    .slice(0, 10)

  const pick = (opt) => { onChange(opt); setQuery(opt); setOpen(false) }

  return (
    <div ref={containerRef} className="relative">
      <input
        id={id} type="text" value={query} placeholder={placeholder}
        autoComplete="off"
        onChange={(e) => { setQuery(e.target.value); onChange(''); setOpen(true) }}
        onFocus={() => setOpen(true)}
        className={[inputCls(hasError), 'pr-8'].join(' ')}
      />
      <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
      {open && visible.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1 w-full rounded-xl border border-gray-100 bg-white py-1 shadow-xl"
          style={{ maxHeight: 220, overflowY: 'auto' }}
        >
          {visible.map((opt) => (
            <li key={opt} role="option" aria-selected={opt === value}>
              <button
                type="button"
                className={`w-full px-3 py-2 text-left text-sm transition-colors hover:bg-gray-50 hover:text-[#0F4C5C] ${
                  opt === value ? 'font-semibold text-[#0F4C5C]' : 'text-gray-700'
                }`}
                onMouseDown={(e) => { e.preventDefault(); pick(opt) }}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ─── Tab: Flight ──────────────────────────────────────────────────────────────

function FlightTab() {
  const [form, setForm] = useState({
    tripType: 'One Way', from: '', to: '',
    date: '', returnDate: '', passengers: 1, cabinClass: 'Economy',
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
    if (!form.from.trim())                                      e.from       = 'Enter departure city'
    if (!form.to.trim())                                        e.to         = 'Enter destination city'
    if (!form.date)                                             e.date       = 'Select departure date'
    else if (form.date < TODAY)                                 e.date       = 'Date cannot be in the past'
    if (form.tripType === 'Round Trip') {
      if (!form.returnDate)                                     e.returnDate = 'Select return date'
      else if (form.returnDate < form.date)                    e.returnDate = 'Must be after departure date'
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
    <div className="space-y-4">
      {/* Trip type */}
      <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
        {['One Way', 'Round Trip'].map((t) => (
          <button
            key={t} type="button" onClick={() => set('tripType', t)}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
              form.tripType === t
                ? 'bg-[#0F4C5C] text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* From / swap / To */}
      <div className="grid items-end gap-2" style={{ gridTemplateColumns: '1fr auto 1fr' }}>
        <div>
          <Label htmlFor="fl-from">From</Label>
          <TextInput id="fl-from" value={form.from} onChange={(v) => set('from', v)} placeholder="e.g. Kolkata" hasError={!!errors.from} />
          <FieldError msg={errors.from} />
        </div>
        <button
          type="button" onClick={swap} aria-label="Swap cities"
          className="mb-0.5 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 transition-colors hover:border-[#0F4C5C] hover:text-[#0F4C5C]"
        >
          <ArrowLeftRight size={15} />
        </button>
        <div>
          <Label htmlFor="fl-to">To</Label>
          <TextInput id="fl-to" value={form.to} onChange={(v) => set('to', v)} placeholder="e.g. Delhi" hasError={!!errors.to} />
          <FieldError msg={errors.to} />
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="fl-date">Departure</Label>
          <TextInput id="fl-date" type="date" value={form.date} onChange={(v) => set('date', v)} min={TODAY} hasError={!!errors.date} />
          <FieldError msg={errors.date} />
        </div>
        {isRound && (
          <div>
            <Label htmlFor="fl-return">Return</Label>
            <TextInput id="fl-return" type="date" value={form.returnDate} onChange={(v) => set('returnDate', v)} min={form.date || TODAY} hasError={!!errors.returnDate} />
            <FieldError msg={errors.returnDate} />
          </div>
        )}
      </div>

      {/* Passengers + Class */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="fl-pax">Passengers</Label>
          <NumberInput id="fl-pax" value={form.passengers} onChange={(v) => set('passengers', v)} min={1} max={9} />
        </div>
        <div>
          <Label htmlFor="fl-class">Cabin class</Label>
          <SelectInput id="fl-class" value={form.cabinClass} onChange={(v) => set('cabinClass', v)} options={['Economy', 'Premium Economy', 'Business']} />
        </div>
      </div>

      <SearchBtn loading={loading} label="Search Flights" onClick={handleSearch} />
    </div>
  )
}

// ─── Tab: Train ───────────────────────────────────────────────────────────────

function TrainTab() {
  const [form, setForm] = useState({
    from: '', to: '', date: '', travelClass: 'SL', quota: 'General',
  })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((e) => ({ ...e, [k]: null }))
  }

  const validate = () => {
    const e = {}
    if (!form.from)                     e.from = 'Select departure station'
    if (!form.to)                       e.to   = 'Select destination station'
    if (!form.date)                     e.date = 'Select journey date'
    else if (form.date < TODAY)         e.date = 'Date cannot be in the past'
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
    <div className="space-y-4">
      <div>
        <Label htmlFor="tr-from">From station</Label>
        <Combobox id="tr-from" value={form.from} onChange={(v) => set('from', v)} options={WB_STATIONS} placeholder="Search station…" hasError={!!errors.from} />
        <FieldError msg={errors.from} />
      </div>
      <div>
        <Label htmlFor="tr-to">To station</Label>
        <Combobox id="tr-to" value={form.to} onChange={(v) => set('to', v)} options={WB_STATIONS} placeholder="Search station…" hasError={!!errors.to} />
        <FieldError msg={errors.to} />
      </div>
      <div>
        <Label htmlFor="tr-date">Date of journey</Label>
        <TextInput id="tr-date" type="date" value={form.date} onChange={(v) => set('date', v)} min={TODAY} hasError={!!errors.date} />
        <FieldError msg={errors.date} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="tr-class">Class</Label>
          <SelectInput id="tr-class" value={form.travelClass} onChange={(v) => set('travelClass', v)} options={['SL', '3A', '2A', '1A', 'CC']} />
        </div>
        <div>
          <Label htmlFor="tr-quota">Quota</Label>
          <SelectInput id="tr-quota" value={form.quota} onChange={(v) => set('quota', v)} options={['General', 'Ladies', 'Senior Citizen']} />
        </div>
      </div>
      <SearchBtn loading={loading} label="Search Trains" onClick={handleSearch} />
      <p className="mt-2 text-center text-xs text-gray-400">
        You'll be redirected to IRCTC to complete your booking.
      </p>
    </div>
  )
}

// ─── Tab: Bus ─────────────────────────────────────────────────────────────────

function BusTab() {
  const [form, setForm] = useState({ from: '', to: '', date: '' })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((e) => ({ ...e, [k]: null }))
  }

  const validate = () => {
    const e = {}
    if (!form.from)             e.from = 'Select departure city'
    if (!form.to)               e.to   = 'Select destination city'
    if (!form.date)             e.date = 'Select journey date'
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
    <div className="space-y-4">
      <div>
        <Label htmlFor="bs-from">From city</Label>
        <Combobox id="bs-from" value={form.from} onChange={(v) => set('from', v)} options={WB_CITIES} placeholder="Search city…" hasError={!!errors.from} />
        <FieldError msg={errors.from} />
      </div>
      <div>
        <Label htmlFor="bs-to">To city</Label>
        <Combobox id="bs-to" value={form.to} onChange={(v) => set('to', v)} options={WB_CITIES} placeholder="Search city…" hasError={!!errors.to} />
        <FieldError msg={errors.to} />
      </div>
      <div>
        <Label htmlFor="bs-date">Date of journey</Label>
        <TextInput id="bs-date" type="date" value={form.date} onChange={(v) => set('date', v)} min={TODAY} hasError={!!errors.date} />
        <FieldError msg={errors.date} />
      </div>
      <SearchBtn loading={loading} label="Search Buses" onClick={handleSearch} />
    </div>
  )
}

// ─── Tab: Hotel ───────────────────────────────────────────────────────────────

function HotelTab() {
  const [form, setForm] = useState({
    city: 'Kolkata', checkIn: '', checkOut: '', rooms: 1, guests: 2,
  })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((e) => ({ ...e, [k]: null }))
  }

  const validate = () => {
    const e = {}
    if (!form.city)                                             e.city     = 'Select a city'
    if (!form.checkIn)                                          e.checkIn  = 'Select check-in date'
    else if (form.checkIn < TODAY)                              e.checkIn  = 'Date cannot be in the past'
    if (!form.checkOut)                                         e.checkOut = 'Select check-out date'
    else if (form.checkIn && form.checkOut <= form.checkIn)    e.checkOut = 'Must be after check-in date'
    return e
  }

  const handleSearch = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    setLoading(false)
    window.open(buildHotelLink(form), '_blank', 'noopener,noreferrer')
  }

  const minCheckOut = addDay(form.checkIn)

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="ht-city">City</Label>
        <Combobox id="ht-city" value={form.city} onChange={(v) => set('city', v)} options={WB_CITIES} placeholder="Search city…" hasError={!!errors.city} />
        <FieldError msg={errors.city} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="ht-checkin">Check-in</Label>
          <TextInput
            id="ht-checkin" type="date" value={form.checkIn} min={TODAY} hasError={!!errors.checkIn}
            onChange={(v) => {
              set('checkIn', v)
              if (form.checkOut && form.checkOut <= v) set('checkOut', '')
            }}
          />
          <FieldError msg={errors.checkIn} />
        </div>
        <div>
          <Label htmlFor="ht-checkout">Check-out</Label>
          <TextInput id="ht-checkout" type="date" value={form.checkOut} onChange={(v) => set('checkOut', v)} min={minCheckOut} hasError={!!errors.checkOut} />
          <FieldError msg={errors.checkOut} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="ht-rooms">Rooms</Label>
          <NumberInput id="ht-rooms" value={form.rooms} onChange={(v) => set('rooms', v)} min={1} max={5} />
        </div>
        <div>
          <Label htmlFor="ht-guests">Guests</Label>
          <NumberInput id="ht-guests" value={form.guests} onChange={(v) => set('guests', v)} min={1} max={9} />
        </div>
      </div>
      <SearchBtn loading={loading} label="Search Hotels" onClick={handleSearch} />
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TAB_CONTENT = { flight: FlightTab, train: TrainTab, bus: BusTab, hotel: HotelTab }

export default function Discover() {
  const [activeTab, setActiveTab] = useState('flight')
  const TabContent = TAB_CONTENT[activeTab]

  return (
    <main className="discover-page" style={{ paddingTop: 24 }}>
      {/* Header */}
      <div className="mb-6 text-center">
        <span
          className="inline-block text-[10px] font-bold uppercase tracking-widest mb-1"
          style={{ color: '#0F4C5C', opacity: 0.7 }}
        >
          West Bengal Tourism
        </span>
        <h1
          className="text-2xl font-extrabold leading-tight"
          style={{ fontFamily: "'Baloo Da 2','Hind Siliguri',sans-serif", color: 'var(--text-primary)' }}
        >
          Plan Your Trip
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Book flights, trains, buses &amp; hotels across Bengal
        </p>
      </div>

      {/* Tab bar */}
      <div
        role="tablist"
        aria-label="Booking type"
        className="mb-4 flex border-b"
        style={{ borderColor: 'var(--border-light)', overflowX: 'auto', scrollbarWidth: 'none' }}
      >
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            role="tab"
            aria-selected={activeTab === id}
            aria-controls={`tab-panel-${id}`}
            onClick={() => setActiveTab(id)}
            style={{
              borderColor: activeTab === id ? '#0F4C5C' : 'transparent',
              color: activeTab === id ? '#0F4C5C' : 'var(--text-muted)',
            }}
            className="flex shrink-0 items-center gap-2 border-b-2 -mb-px px-4 pb-3 pt-1 text-sm font-semibold transition-colors hover:text-gray-600"
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Card */}
      <div
        id={`tab-panel-${activeTab}`}
        role="tabpanel"
        className="rounded-2xl p-4"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          boxShadow: '0 2px 12px rgba(0,0,0,.06)',
        }}
      >
        <TabContent />
      </div>
    </main>
  )
}
