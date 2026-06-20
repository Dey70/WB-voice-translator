import { useEffect, useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  ArrowRight, BookOpen, Check, Cloud, CloudRain, Compass, Droplets,
  Eye, LoaderCircle, LocateFixed, MapPin, MessageSquare, Mic, Navigation, RefreshCw,
  Search, ShieldAlert, Sparkles, Sun, Sunrise, Sunset,
  TriangleAlert, Umbrella, Wind, X,
} from 'lucide-react'
import { platformServices } from '../services/platform/platformAdapter'

const quickActions = [
  { to: '/translate', icon: Mic, label: 'Translate', detail: 'Speak or type' },
  { to: '/phrases', icon: BookOpen, label: 'Phrasebook', detail: 'Works offline' },
  { to: '/discover', icon: Compass, label: 'Explore', detail: 'Local ideas' },
  { to: '/emergency', icon: ShieldAlert, label: 'SOS', detail: 'Urgent help', urgent: true },
]

const destinations = [
  { name: 'Kolkata', area: 'South Bengal', latitude: 22.5726, longitude: 88.3639 },
  { name: 'Darjeeling', area: 'Himalayan Hills', latitude: 27.041, longitude: 88.2663 },
  { name: 'Digha', area: 'Coastal Bengal', latitude: 21.6266, longitude: 87.5074 },
  { name: 'Sundarbans', area: 'South 24 Parganas', latitude: 21.9497, longitude: 89.1833 },
  { name: 'Bishnupur', area: 'Bankura', latitude: 23.0672, longitude: 87.3165 },
  { name: 'Kalimpong', area: 'Himalayan Hills', latitude: 27.0594, longitude: 88.4695 },
]

const weatherLabels = {
  0: 'Clear sky', 1: 'Mostly clear', 2: 'Partly cloudy', 3: 'Overcast', 45: 'Foggy', 48: 'Rime fog',
  51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle', 56: 'Freezing drizzle', 57: 'Freezing drizzle',
  61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 66: 'Freezing rain', 67: 'Freezing rain',
  71: 'Light snow', 73: 'Snow', 75: 'Heavy snow', 77: 'Snow grains',
  80: 'Rain showers', 81: 'Rain showers', 82: 'Heavy showers', 85: 'Snow showers', 86: 'Heavy snow showers',
  95: 'Thunderstorms', 96: 'Storm with hail', 99: 'Storm with hail',
}

const formatDay = (date, index) => index === 0
  ? 'Today'
  : new Intl.DateTimeFormat('en', { weekday: 'short' }).format(new Date(`${date}T12:00:00`))

function createGpsLocation(coords) {
  return {
    name: 'GPS location',
    area: `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)} · Accuracy ±${Math.max(1, Math.round(coords.accuracy))} m`,
    latitude: coords.latitude,
    longitude: coords.longitude,
    precise: true,
  }
}

async function resolveGpsPlace(location) {
  const params = new URLSearchParams({
    format: 'jsonv2',
    latitude: location.latitude,
    longitude: location.longitude,
    zoom: '18',
    localityLanguage: 'en',
  })
  // BigDataCloud accepts browser requests without an API key and returns locality-level address fields.
  const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?${params}`)
  if (!response.ok) throw new Error('Place-name lookup is unavailable.')
  const result = await response.json()
  const locality = result.locality
    || result.city
    || result.principalSubdivision
  if (!locality) throw new Error('No locality was found for these coordinates.')
  const area = [result.city, result.principalSubdivision]
    .filter((value, index, values) => value && value !== locality && values.indexOf(value) === index)
    .slice(0, 2)
    .join(', ')
  return {
    ...location,
    name: locality,
    area: `${area ? `${area} · ` : ''}GPS accuracy ±${location.accuracy} m`,
  }
}

function getWeatherIcon(code, size = 20) {
  if ([0, 1].includes(code)) return <Sun size={size} />
  if ([2, 3, 45, 48].includes(code)) return <Cloud size={size} />
  return <CloudRain size={size} />
}

function buildTravelAdvice(weather) {
  const current = weather.current
  const today = weather.daily
  const dos = []
  const donts = []

  if (today.precipitation_probability_max[0] >= 50 || current.precipitation > 0) {
    dos.push('Carry a compact umbrella and keep electronics covered.')
    donts.push('Do not enter waterlogged streets or fast-moving water.')
  } else {
    dos.push('Keep water with you, even for a short day out.')
  }
  if (current.apparent_temperature >= 35) {
    dos.push('Plan outdoor stops before 11 AM or after 4 PM.')
    donts.push('Avoid long walks in the midday sun.')
  } else if (current.apparent_temperature <= 12) {
    dos.push('Pack a warm outer layer for early mornings and evenings.')
  } else {
    dos.push('Choose light, breathable layers for changing conditions.')
  }
  if (today.uv_index_max[0] >= 6) {
    dos.push('Use SPF 30+ sunscreen and reapply through the day.')
    donts.push('Do not underestimate UV when the sky looks cloudy.')
  }
  if (current.wind_speed_10m >= 30) {
    donts.push('Avoid exposed viewpoints and unsecured boat trips.')
  }
  if (donts.length === 0) donts.push('Do not leave valuables exposed in crowded areas.')

  const headline = current.apparent_temperature >= 35
    ? 'Heat-smart travel day'
    : today.precipitation_probability_max[0] >= 50
      ? 'Keep the day flexible'
      : current.wind_speed_10m >= 30
        ? 'Windy conditions ahead'
        : 'Comfortable for exploring'

  return { dos: dos.slice(0, 3), donts: donts.slice(0, 2), headline }
}

function buildWeatherAlert(weather) {
  const current = weather.current
  const daily = weather.daily

  if (current.apparent_temperature >= 40 || daily.temperature_2m_max[0] >= 40) {
    return { level: 'danger', title: 'Excessive heat', detail: 'Severe heat is expected. Limit afternoon travel and watch for signs of heat stress.' }
  }
  if (daily.precipitation_probability_max[0] >= 75 || weather.current.weather_code >= 95) {
    return { level: 'danger', title: 'Heavy rain risk', detail: 'Storms or intense rain may disrupt travel. Avoid flooded roads and exposed areas.' }
  }
  if (current.wind_speed_10m >= 35) {
    return { level: 'caution', title: 'Strong wind caution', detail: 'Exposed viewpoints, ferry crossings and coastal routes may be uncomfortable.' }
  }
  if (daily.uv_index_max[0] >= 8) {
    return { level: 'caution', title: 'Very high UV', detail: 'Unprotected skin can burn quickly. Seek shade during the middle of the day.' }
  }
  return { level: 'clear', title: 'No major weather concerns', detail: 'Conditions look manageable for most plans. Keep checking as your departure gets closer.' }
}

function WeatherTrend({ weather, metric }) {
  const start = Math.max(0, weather.hourly.time.findIndex((time) => time >= weather.current.time))
  const end = Math.min(start + 8, weather.hourly.time.length)
  const config = {
    temperature: { values: weather.hourly.temperature_2m.slice(start, end), unit: '°' },
    rain: { values: weather.hourly.precipitation_probability.slice(start, end), unit: '%' },
    wind: { values: weather.hourly.wind_speed_10m.slice(start, end), unit: '' },
  }[metric]
  const times = weather.hourly.time.slice(start, end)
  const min = Math.min(...config.values)
  const max = Math.max(...config.values)
  const spread = Math.max(max - min, 1)
  const points = config.values.map((value, index) => ({
    x: config.values.length === 1 ? 50 : 4 + (index / (config.values.length - 1)) * 92,
    y: 74 - ((value - min) / spread) * 46,
    value,
  }))
  const line = points.map((point) => `${point.x},${point.y}`).join(' ')
  const area = `4,82 ${line} 96,82`

  return (
    <div className="weather-trend" role="img" aria-label={`${metric} forecast for the next eight hours`}>
      <svg viewBox="0 0 100 86" preserveAspectRatio="none" aria-hidden="true">
        <polygon points={area} />
        <polyline points={line} />
        {points.map((point, index) => <circle key={times[index]} cx={point.x} cy={point.y} r="1.2" />)}
      </svg>
      <div className="trend-values">{points.map((point, index) => <strong key={times[index]}>{Math.round(point.value)}{config.unit}</strong>)}</div>
      <div className="trend-times">{times.map((time) => <span key={time}>{new Intl.DateTimeFormat('en', { hour: 'numeric' }).format(new Date(time))}</span>)}</div>
    </div>
  )
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [destinationIndex, setDestinationIndex] = useState(0)
  const [weather, setWeather] = useState(null)
  const [weatherState, setWeatherState] = useState('loading')
  const [refreshKey, setRefreshKey] = useState(0)
  const [trendMetric, setTrendMetric] = useState('temperature')
  const [preciseLocation, setPreciseLocation] = useState(null)
  const [locationState, setLocationState] = useState('idle')
  const [locationError, setLocationError] = useState('')
  const navigate = useNavigate()
  const destination = destinations[destinationIndex]
  const weatherTarget = preciseLocation || destination

  useEffect(() => {
    const controller = new AbortController()
    const params = new URLSearchParams({
      latitude: weatherTarget.latitude,
      longitude: weatherTarget.longitude,
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m',
      hourly: 'temperature_2m,precipitation_probability,wind_speed_10m',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,sunrise,sunset',
      timezone: 'auto',
      forecast_days: '8',
    })

    fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Weather service unavailable')
        return response.json()
      })
      .then((data) => {
        setWeather(data)
        setWeatherState('ready')
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setWeatherState('error')
      })

    return () => controller.abort()
  }, [weatherTarget.latitude, weatherTarget.longitude, refreshKey])

  const advice = useMemo(() => weather ? buildTravelAdvice(weather) : null, [weather])
  const weatherAlert = useMemo(() => weather ? buildWeatherAlert(weather) : null, [weather])

  const search = (event) => {
    event.preventDefault()
    navigate(query.trim() ? `/places/explore?q=${encodeURIComponent(query.trim())}` : '/discover')
  }

  const changeDestination = (event) => {
    setWeatherState('loading')
    setPreciseLocation(null)
    setLocationState('idle')
    setLocationError('')
    setDestinationIndex(Number(event.target.value))
  }

  const usePreciseLocation = async () => {
    if (!platformServices.location.isAvailable()) {
      setLocationState('error')
      setLocationError('Precise location is unavailable on this device.')
      return
    }
    setLocationState('loading')
    setLocationError('')
    try {
      const granted = await platformServices.location.requestPermission()
      if (!granted) throw new Error('Location permission was not granted.')
      const { coords } = await platformServices.location.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
      })
      const gpsLocation = {
        ...createGpsLocation(coords),
        accuracy: Math.max(1, Math.round(coords.accuracy)),
      }
      setWeatherState('loading')
      setPreciseLocation(gpsLocation)
      setLocationState('ready')
      try {
        const resolvedLocation = await resolveGpsPlace(gpsLocation)
        setPreciseLocation(resolvedLocation)
      } catch {
        // Coordinates remain visible and continue to drive the forecast if naming is unavailable.
      }
    } catch (error) {
      setLocationState('error')
      setLocationError(error?.message || 'Your location could not be detected. Check that GPS is enabled.')
    }
  }

  const retryWeather = () => {
    setWeatherState('loading')
    setRefreshKey((key) => key + 1)
  }

  return (
    <main className="home-page mockup-home">
      <section className="mockup-home-hero">
        <div className="mockup-home-pattern" aria-hidden="true" />
        <div className="mockup-greeting">
          <span>Namaskar, traveller</span>
          <h1>West Bengal,<br />without the <em>language</em> wall.</h1>
          <p>Useful words, local context and calmer journeys, all in one place.</p>
        </div>
      </section>

      <form className="mockup-search" onSubmit={search}>
        <Search size={18} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search places, food or phrases" aria-label="Search KothaSetu" />
        <button type="button" onClick={() => navigate('/translate')} aria-label="Open voice translator"><Mic size={17} /></button>
      </form>

      <section className="mockup-quick-grid" aria-label="Quick actions">
        {quickActions.map(({ to, icon: Icon, label, detail, urgent }) => (
          <Link key={to} to={to} className={urgent ? 'urgent' : ''}><span><Icon size={20} /></span><strong>{label}</strong><small>{detail}</small></Link>
        ))}
      </section>

      <section className="journey-weather" aria-labelledby="weather-heading">
        <header className="journey-weather-heading">
          <div><span>Before you set out</span><h2 id="weather-heading">Know the day ahead</h2></div>
          <span className="live-weather-badge"><i /> Live weather</span>
        </header>

        <div className={`destination-picker ${preciseLocation ? 'using-gps' : ''}`}>
          <span><Navigation size={16} /></span>
          <div><small>{preciseLocation ? 'Weather at your position' : 'Your destination'}</small><strong>{weatherTarget.name}</strong></div>
          <button className="precise-location-button" onClick={usePreciseLocation} disabled={locationState === 'loading'}>
            {locationState === 'loading' ? <LoaderCircle className="weather-spinner" size={14} /> : preciseLocation ? <RefreshCw size={14} /> : <LocateFixed size={14} />}
            {locationState === 'loading' ? 'Locating' : preciseLocation ? 'Refresh GPS' : 'Use my location'}
          </button>
          <label className="manual-destination"><span className="sr-only">Choose destination manually</span><select value={preciseLocation ? '' : destinationIndex} onChange={changeDestination} aria-label="Choose destination manually">
              <option value="" disabled>{preciseLocation ? 'Choose manually' : 'Change area'}</option>
              {destinations.map((place, index) => <option key={place.name} value={index}>{place.name}</option>)}
            </select></label>
        </div>
        <p className="location-privacy-note"><ShieldAlert size={11} /> Coordinates are sent to weather and place-name services, but are not saved by KothaSetu.</p>
        {locationError && <div className="weather-location-error" role="alert">{locationError} Manual destination weather is still available.</div>}

        {weatherState === 'loading' && (
          <div className="weather-state" role="status"><LoaderCircle className="weather-spinner" size={24} /><strong>Reading the skies over {weatherTarget.name}</strong><span>Bringing in the latest local forecast...</span></div>
        )}

        {weatherState === 'error' && (
          <div className="weather-state error" role="alert"><CloudRain size={25} /><strong>Forecast could not be reached</strong><span>Check your connection and try again.</span><button onClick={retryWeather}><RefreshCw size={14} /> Try again</button></div>
        )}

        {weatherState === 'ready' && weather && (
          <>
            <article className="weather-now-card">
              <div className="weather-now-top">
                <div className="weather-location"><MapPin size={14} /><span><strong>{weatherTarget.name}</strong><small>{weatherTarget.area}</small></span></div>
                <small>Updated {new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date(weather.current.time))}</small>
              </div>
              <div className="weather-now-main">
                <div className="weather-symbol">{getWeatherIcon(weather.current.weather_code, 38)}</div>
                <div className="weather-temperature"><strong>{Math.round(weather.current.temperature_2m)}°</strong><span>{weatherLabels[weather.current.weather_code] || 'Changing skies'}<small>Feels like {Math.round(weather.current.apparent_temperature)}°</small></span></div>
              </div>
              <div className="weather-facts">
                <span><Droplets size={14} /><small>Humidity</small><strong>{weather.current.relative_humidity_2m}%</strong></span>
                <span><Wind size={14} /><small>Wind</small><strong>{Math.round(weather.current.wind_speed_10m)} km/h</strong></span>
                <span><Umbrella size={14} /><small>Rain</small><strong>{weather.daily.precipitation_probability_max[0]}%</strong></span>
                <span><Eye size={14} /><small>UV index</small><strong>{Math.round(weather.daily.uv_index_max[0])}</strong></span>
              </div>
              <div className="weather-sun-times">
                <span><Sunrise size={14} /> {weather.daily.sunrise[0].slice(11, 16)}</span>
                <span><Sunset size={14} /> {weather.daily.sunset[0].slice(11, 16)}</span>
              </div>
            </article>

            <div className="weather-chart-card">
              <div className="weather-chart-tabs" role="tablist" aria-label="Hourly forecast metric">
                {[
                  ['temperature', 'Temperature'],
                  ['rain', 'Precipitation'],
                  ['wind', 'Wind'],
                ].map(([value, label]) => (
                  <button key={value} role="tab" aria-selected={trendMetric === value} className={trendMetric === value ? 'active' : ''} onClick={() => setTrendMetric(value)}>{label}</button>
                ))}
              </div>
              <WeatherTrend weather={weather} metric={trendMetric} />
            </div>

            <div className="forecast-strip" aria-label="Eight day forecast">
              {weather.daily.time.map((date, index) => (
                <div key={date} className={index === 0 ? 'today' : ''}>
                  <strong>{formatDay(date, index)}</strong>
                  {getWeatherIcon(weather.daily.weather_code[index], 18)}
                  <span>{Math.round(weather.daily.temperature_2m_max[index])}° <small>{Math.round(weather.daily.temperature_2m_min[index])}°</small></span>
                  <em><Droplets size={10} /> {weather.daily.precipitation_probability_max[index]}%</em>
                </div>
              ))}
            </div>

            <article className={`weather-alert-card ${weatherAlert.level}`}>
              <span><TriangleAlert size={19} /></span>
              <div><small>Forecast-based travel alert</small><h3>{weatherAlert.title}</h3><p>{weatherAlert.detail}</p><em>Guidance generated from live forecast data, not an official government warning.</em></div>
            </article>

            <article className="travel-readiness">
              <header><span><Sparkles size={16} /></span><div><small>Weather-wise guidance</small><h3>{advice.headline}</h3></div></header>
              <div className="advice-columns">
                <section><h4><Check size={13} /> Do</h4>{advice.dos.map((item) => <p key={item}>{item}</p>)}</section>
                <section className="avoid"><h4><X size={13} /> Avoid</h4>{advice.donts.map((item) => <p key={item}>{item}</p>)}</section>
              </div>
              <footer><TriangleAlert size={13} /><span>Conditions can change quickly. Check local advisories before remote or coastal travel.</span></footer>
            </article>
          </>
        )}
      </section>

      <Link to="/conversation" className="mockup-conversation-cta"><span><MessageSquare size={21} /></span><div><strong>Talking with someone?</strong><small>Open two-person Conversation mode</small></div><ArrowRight size={17} /></Link>
    </main>
  )
}
