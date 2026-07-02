import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ScrollText, Lightbulb, Newspaper, Library, HelpCircle,
  Flame, X, Heart, ChevronRight,
  Cloud, CloudRain, Sun, Droplets, Wind, LoaderCircle,
  MapPin, LocateFixed, Check, TriangleAlert,
} from 'lucide-react'
import { platformServices } from '../services/platform/platformAdapter'
import { TOURISM_SPOTS } from '../data/tourismSpots'
import teaGarden from '../assets/tea-garden.webp'
import PageMenuButton from '../components/layout/PageMenuButton'

/* ── Destinations ─────────────────────────────────────── */
const destinations = [
  { name: 'Kolkata',    area: 'South Bengal',     latitude: 22.5726, longitude: 88.3639 },
  { name: 'Darjeeling', area: 'Himalayan Hills',   latitude: 27.041,  longitude: 88.2663 },
  { name: 'Digha',      area: 'Coastal Bengal',    latitude: 21.6266, longitude: 87.5074 },
  { name: 'Sundarbans', area: 'South 24 Parganas', latitude: 21.9497, longitude: 89.1833 },
  { name: 'Bishnupur',  area: 'Bankura',           latitude: 23.0672, longitude: 87.3165 },
  { name: 'Kalimpong',  area: 'Himalayan Hills',   latitude: 27.0594, longitude: 88.4695 },
]

/* ── Bioscope ─────────────────────────────────────────── */
const STREAK = 4
const STREAK_TOTAL = 5

const bioCategories = [
  { icon: ScrollText, label: 'Stories', to: '/culture',        active: true  },
  { icon: Lightbulb,  label: 'Facts',   to: '/discover',       active: true  },
  { icon: Newspaper,  label: 'News',    to: '/places/seasons', active: false },
  { icon: Library,    label: 'Books',   to: '/phrases',        active: false },
  { icon: HelpCircle, label: 'Trivia',  to: '/discover',       active: false },
]

const spotTaglines = {
  'victoria-memorial': 'Marble dreams of empire.',
  'sundarbans':        'Where tigers walk on water.',
  'howrah-bridge':     'The city breathes across the Hooghly.',
  'prinsep-ghat':      'Evenings were made for the river.',
}

function getDaySpotIndex() {
  const start = new Date(new Date().getFullYear(), 0, 0)
  return Math.floor((Date.now() - start) / 86400000) % TOURISM_SPOTS.length
}

/* ── Weather helpers ──────────────────────────────────── */
const weatherLabels = {
  0: 'Clear sky', 1: 'Mostly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Foggy', 51: 'Light drizzle', 61: 'Light rain', 63: 'Rain',
  65: 'Heavy rain', 80: 'Rain showers', 95: 'Thunderstorms',
}

function getWeatherIcon(code, size = 18) {
  if ([0, 1].includes(code)) return <Sun size={size} />
  if ([2, 3, 45].includes(code)) return <Cloud size={size} />
  return <CloudRain size={size} />
}

function buildAdvice(weather) {
  const cur = weather.current
  const day = weather.daily
  const dos = [], donts = []

  if (day.precipitation_probability_max[0] >= 50 || cur.precipitation > 0) {
    dos.push('Carry a compact umbrella and keep electronics covered.')
    donts.push('Do not enter waterlogged streets or fast-moving water.')
  } else {
    dos.push('Keep water with you, even for a short day out.')
  }
  if (cur.apparent_temperature >= 35) {
    dos.push('Plan outdoor stops before 11 AM or after 4 PM.')
    donts.push('Avoid long walks in the midday sun.')
  } else if (cur.apparent_temperature <= 12) {
    dos.push('Pack a warm outer layer for early mornings and evenings.')
  } else {
    dos.push('Choose light, breathable layers for changing conditions.')
  }
  if (day.uv_index_max[0] >= 6) {
    dos.push('Use SPF 30+ sunscreen and reapply through the day.')
    donts.push('Do not underestimate UV when the sky looks cloudy.')
  }
  if (cur.wind_speed_10m >= 30) donts.push('Avoid exposed viewpoints and unsecured boat trips.')
  if (donts.length === 0) donts.push('Do not leave valuables exposed in crowded areas.')

  const headline = cur.apparent_temperature >= 35 ? 'Heat-smart travel day'
    : day.precipitation_probability_max[0] >= 50 ? 'Keep the day flexible'
    : cur.wind_speed_10m >= 30 ? 'Windy conditions ahead'
    : 'Comfortable for exploring'

  return { dos: dos.slice(0, 3), donts: donts.slice(0, 2), headline }
}

function buildSummary(weather) {
  const cur = weather.current
  const pop = weather.daily.precipitation_probability_max[0]
  if (cur.apparent_temperature >= 38) return 'Very hot — limit time outdoors'
  if (pop >= 70) return 'Heavy rain likely — carry an umbrella'
  if (pop >= 40) return 'Rain possible — pack light gear'
  if (cur.wind_speed_10m >= 30) return 'Windy — secure loose items'
  if ([0, 1].includes(cur.weather_code)) return 'Clear skies — great day to explore'
  return 'Manageable conditions — enjoy your day'
}

/* ── Ethnic alpana SVG ornament ───────────────────────── */
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

/* ── Main component ───────────────────────────────────── */
export default function Home() {
  const [spotOffset, setSpotOffset] = useState(0)

  /* location */
  const [location, setLocation] = useState(destinations[1])
  const [destIndex, setDestIndex] = useState(1)
  const [showPlaces, setShowPlaces] = useState(false)
  const [gpsState, setGpsState] = useState('idle')
  const [gpsError, setGpsError] = useState('')

  /* weather */
  const [weather, setWeather] = useState(null)
  const [weatherState, setWeatherState] = useState('loading')
  const [refreshKey, setRefreshKey] = useState(0)
  const [showPlacard, setShowPlacard] = useState(false)

  const spot = TOURISM_SPOTS[(getDaySpotIndex() + spotOffset) % TOURISM_SPOTS.length]
  const tagline = spotTaglines[spot.id] || 'Discover the soul of Bengal.'

  /* hide ONLY top navbar on home, keep bottom nav */
  useEffect(() => {
    document.body.classList.add('home-page-active')
    return () => document.body.classList.remove('home-page-active')
  }, [])

  /* silent GPS restore from cache on load */
  useEffect(() => {
    const cached = sessionStorage.getItem('wb_gps_location')
    if (cached) {
      try { const loc = JSON.parse(cached); setLocation(loc); setGpsState('ready') } catch {}
    }
  }, [])

  /* fetch weather whenever location changes */
  useEffect(() => {
    const controller = new AbortController()
    const params = new URLSearchParams({
      latitude: location.latitude,
      longitude: location.longitude,
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m',
      hourly: 'temperature_2m,precipitation_probability,wind_speed_10m',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,sunrise,sunset',
      timezone: 'auto',
      forecast_days: '3',
    })
    setWeatherState('loading')
    fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal: controller.signal })
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(data => { setWeather(data); setWeatherState('ready') })
      .catch(e => { if (e.name !== 'AbortError') setWeatherState('error') })
    return () => controller.abort()
  }, [location.latitude, location.longitude, refreshKey])

  const handleGPS = async () => {
    if (!platformServices.location.isAvailable()) {
      setGpsError('Location unavailable on this device.')
      return
    }
    setGpsState('loading')
    setGpsError('')
    try {
      const granted = await platformServices.location.requestPermission()
      if (!granted) throw new Error('Location permission denied.')
      const { coords } = await platformServices.location.getCurrentPosition({
        enableHighAccuracy: true, timeout: 15000, maximumAge: 60000,
      })
      const loc = { name: 'Your location', latitude: coords.latitude, longitude: coords.longitude, gps: true }
      setLocation(loc)
      setGpsState('ready')
      setRefreshKey(k => k + 1)
      sessionStorage.removeItem('wb_gps_location')
      // resolve place name in background
      fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=en`)
        .then(r => r.json())
        .then(d => {
          const admins = (d.localityInfo?.administrative ?? [])
            .filter(a => a.adminLevel >= 6 && a.name)
            .sort((a, b) => b.adminLevel - a.adminLevel || b.order - a.order)
          const name = d.locality || admins[0]?.name || d.city || 'Your location'
          const resolved = { ...loc, name }
          setLocation(resolved)
          sessionStorage.setItem('wb_gps_location', JSON.stringify(resolved))
        }).catch(() => {})
    } catch (err) {
      setGpsState('idle')
      setGpsError(err?.message || 'Could not detect your location.')
    }
  }

  const pickDest = (dest, index) => {
    setLocation(dest)
    setDestIndex(index)
    setGpsState('idle')
    setShowPlaces(false)
    setRefreshKey(k => k + 1)
    sessionStorage.removeItem('wb_gps_location')
  }

  const advice = weather ? buildAdvice(weather) : null
  const summary = weather ? buildSummary(weather) : null

  return (
    <main className="bioscope-home">

      {/* Tea-garden background */}
      <div className="bh-bg" aria-hidden="true">
        <img src={teaGarden} alt="" />
        <div className="bh-bg-overlay" />
      </div>

      <div className="bh-content">

        {/* ── Header: brand + search icon ── */}
        <div className="bh-header">
          <div className="bh-brand-block">
            <span className="bh-brand">কথাসেতু</span>
            <AlpanaBar />
          </div>
          <PageMenuButton className="bh-search-btn" />
        </div>

        {/* ── Bioscope glass panel ── */}
        <div className="bh-bioscope-panel">
          <div className="bh-bioscope-top">
            <div className="bh-bioscope-label-group">
              <span className="bh-bioscope-dot" aria-hidden="true" />
              <span className="bh-bioscope-title">আজকের বায়োস্কোপ</span>
              <span className="bh-bioscope-subtitle">Today's bioscope</span>
            </div>
            <div className="bh-streak" aria-label={`${STREAK} of ${STREAK_TOTAL} day streak`}>
              {Array.from({ length: STREAK_TOTAL }, (_, i) => (
                <Flame key={i} size={12} className={i < STREAK ? 'flame-on' : 'flame-off'} aria-hidden="true" />
              ))}
            </div>
          </div>

          <div className="bh-circles" role="list">
            {bioCategories.map(({ icon: Icon, label, to, active }) => (
              <Link key={label} to={to} className={`bh-circle-item ${active ? 'active' : ''}`} role="listitem">
                <div className="bh-circle-ring">
                  {active && <div className="bh-circle-inner-ring" aria-hidden="true" />}
                  <Icon size={20} aria-hidden="true" />
                </div>
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Hero headline ── */}
        <h1 className="bh-hero">
          West Bengal, without the <em>language</em> wall.
        </h1>

        {/* ── Spot of the day card ── */}
        <div className="bh-card-stack" aria-label="Spot of the day">
          <div className="bh-card-back" aria-hidden="true" />
          <div className="bh-card-front">
            <div>
              <span className="bh-card-label">Spot of the day</span>
              <p className="bh-card-name">{spot.name}</p>
              <p className="bh-card-tagline">{tagline}</p>
            </div>
            <div className="bh-card-actions">
              <button className="bh-card-btn dismiss" onClick={() => setSpotOffset(o => o + 1)} aria-label="Skip"><X size={16} /></button>
              <span className="bh-card-hint">tap to explore next</span>
              <button className="bh-card-btn love" onClick={() => setSpotOffset(o => o + 1)} aria-label="Save"><Heart size={16} /></button>
            </div>
          </div>
        </div>

        {/* ── Weather ── */}
        <div className="bh-weather">

          {/* Two location buttons */}
          <div className="bh-weather-loc-row">
            <div className="bh-weather-loc-buttons">
              <button className="bh-loc-btn places" onClick={() => setShowPlaces(v => !v)}>
                <MapPin size={12} />
                <span>{!location.gps ? location.name : destinations[destIndex]?.name ?? 'Choose place'}</span>
                <ChevronRight size={10} className={`bh-chevron ${showPlaces ? 'open' : ''}`} />
              </button>
              <button className="bh-loc-btn gps" onClick={handleGPS} disabled={gpsState === 'loading'}>
                {gpsState === 'loading' ? <LoaderCircle size={12} className="bh-spin" /> : <LocateFixed size={12} />}
                <span>{gpsState === 'loading' ? 'Locating…' : location.gps ? location.name : 'My location'}</span>
              </button>
            </div>
            {gpsError && <p className="bh-gps-error">{gpsError}</p>}

            {/* Places dropdown — fixed position to avoid overlap */}
            {showPlaces && (
              <div className="bh-places-popup" role="listbox" aria-label="Choose destination">
                <div className="bh-places-header">
                  <strong>Choose destination</strong>
                  <button onClick={() => setShowPlaces(false)} aria-label="Close"><X size={13} /></button>
                </div>
                {destinations.map((dest, i) => (
                  <button key={dest.name} role="option"
                    aria-selected={!location.gps && destIndex === i}
                    className={!location.gps && destIndex === i ? 'selected' : ''}
                    onClick={() => pickDest(dest, i)}>
                    <span className="bh-place-name">{dest.name}</span>
                    <span className="bh-place-area">{dest.area}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Weather data */}
          {weatherState === 'loading' && (
            <div className="bh-weather-loading"><LoaderCircle size={15} className="bh-spin" /><span>Fetching weather…</span></div>
          )}
          {weatherState === 'error' && (
            <div className="bh-weather-loading"><CloudRain size={14} /><span>Weather unavailable</span></div>
          )}
          {weatherState === 'ready' && weather && (
            <>
              <div className="bh-weather-now">
                <span className="bh-weather-icon">{getWeatherIcon(weather.current.weather_code, 26)}</span>
                <span className="bh-weather-temp">{Math.round(weather.current.temperature_2m)}°</span>
                <div className="bh-weather-right">
                  <span className="bh-weather-desc">{weatherLabels[weather.current.weather_code] || 'Changing skies'}</span>
                  <span className="bh-weather-feels">Feels {Math.round(weather.current.apparent_temperature)}°</span>
                </div>
              </div>

              <div className="bh-weather-facts">
                <span><Droplets size={11} /> {weather.current.relative_humidity_2m}%</span>
                <span><Wind size={11} /> {Math.round(weather.current.wind_speed_10m)} km/h</span>
                <span><CloudRain size={11} /> {weather.daily.precipitation_probability_max[0]}%</span>
              </div>

              <button className="bh-weather-summary" onClick={() => setShowPlacard(true)}>
                <span>{summary}</span>
                <span className="bh-summary-cta">Do's &amp; Don'ts <ChevronRight size={11} /></span>
              </button>

              <div className="bh-weather-strip">
                {weather.daily.time.map((date, i) => (
                  <div key={date} className="bh-weather-day">
                    <span>{i === 0 ? 'Today' : new Intl.DateTimeFormat('en', { weekday: 'short' }).format(new Date(`${date}T12:00:00`))}</span>
                    {getWeatherIcon(weather.daily.weather_code[i], 13)}
                    <span>{Math.round(weather.daily.temperature_2m_max[i])}°</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* SOS */}
        <Link to="/emergency" className="bh-sos-row" aria-label="Emergency — Urgent help">
          <div><span className="bh-sos-tag">SOS</span><span className="bh-sos-label">Urgent help</span></div>
          <ChevronRight size={15} />
        </Link>

      </div>

      {/* ── Do's & Don'ts placard ── */}
      {showPlacard && advice && (
        <div className="bh-placard-backdrop" onClick={() => setShowPlacard(false)}>
          <div className="bh-placard" role="dialog" aria-modal="true" aria-label="Travel advice" onClick={e => e.stopPropagation()}>
            <div className="bh-placard-header">
              <AlpanaBar />
              <h2>{advice.headline}</h2>
              <p className="bh-placard-loc">{location.name} · Live forecast</p>
              <button className="bh-placard-close" onClick={() => setShowPlacard(false)} aria-label="Close"><X size={16} /></button>
            </div>
            <div className="bh-placard-body">
              <div className="bh-placard-col do">
                <h3><Check size={13} /> Do</h3>
                {advice.dos.map(item => <p key={item}>{item}</p>)}
              </div>
              <div className="bh-placard-col dont">
                <h3><X size={13} /> Avoid</h3>
                {advice.donts.map(item => <p key={item}>{item}</p>)}
              </div>
            </div>
            <p className="bh-placard-note"><TriangleAlert size={11} /> Guidance from live forecast data — not an official government warning.</p>
          </div>
        </div>
      )}

    </main>
  )
}
