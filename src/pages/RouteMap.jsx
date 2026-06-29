import { useCallback, useEffect, useMemo, useState } from 'react'
import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api'
import { AlertTriangle, ChevronDown, LocateFixed, MapPin, Navigation, RefreshCw, Search, X } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import { destinationAccessType, ROUTE_MAP_DESTINATIONS } from '../data/routeMapDestinations'

const SILIGURI = { lat: 26.7271, lng: 88.3953 }
const MAP_LIBRARIES = ['geometry']
const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
const DARK_MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#172343' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#9aa8c7' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#10172d' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#344263' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#46577c' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0c2940' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#12382f' }] },
  { featureType: 'poi', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
]
const HUBS = [
  { name: 'Siliguri', point: SILIGURI },
  { name: 'NJP', point: { lat: 26.6826, lng: 88.4432 } },
  { name: 'Bagdogra', point: { lat: 26.6982, lng: 88.3117 } },
  { name: 'Darjeeling town', point: { lat: 27.041, lng: 88.2663 } },
]

function MapCanvas({ origin, destination, encodedPolyline, onMapClick, onReady, onFailure, onSearchedDestination, knownDestinations }) {
  const { isLoaded, loadError } = useJsApiLoader({ googleMapsApiKey: MAPS_KEY, libraries: MAP_LIBRARIES })
  const [searchText, setSearchText] = useState('')
  const [searchMessage, setSearchMessage] = useState('')

  useEffect(() => {
    if (loadError) onFailure()
  }, [loadError, onFailure])

  const routePath = useMemo(() => {
    if (!isLoaded || !encodedPolyline || !window.google?.maps?.geometry) return []
    try {
      return window.google.maps.geometry.encoding.decodePath(encodedPolyline)
    } catch {
      return []
    }
  }, [encodedPolyline, isLoaded])

  if (!isLoaded) return <div className="rm-map-loading">Loading North Bengal map…</div>
  const applyPlaceResult = (place, typedName) => {
    const location = place?.geometry?.location
    if (!location) return
    const district = place.address_components?.find(component => component.types.includes('administrative_area_level_2'))?.long_name
      || place.formatted_address?.split(',')?.[1]?.trim()
      || 'Selected place'
    onSearchedDestination({
      id: `google-${place.place_id || `${location.lat()}-${location.lng()}`}`,
      name: place.name || typedName || place.formatted_address?.split(',')?.[0] || 'Selected destination',
      district,
      coordinates: { lat: location.lat(), lng: location.lng() },
      modes: ['drive'],
      googlePlaceId: place.place_id || null,
    })
    setSearchText(place.name || typedName || searchText)
    setSearchMessage('')
  }

  const submitTypedDestination = (event) => {
    event.preventDefault()
    const query = searchText.trim()
    if (!query) return
    const normalizedQuery = query.toLocaleLowerCase()
    const known = knownDestinations.find(item => item.name.toLocaleLowerCase() === normalizedQuery
      || item.name.toLocaleLowerCase().startsWith(normalizedQuery)
      || normalizedQuery.startsWith(item.name.toLocaleLowerCase()))
    if (known) {
      setSearchMessage('')
      onSearchedDestination(known)
      return
    }
    setSearchMessage('Finding destination…')
    const runBackendFallback = async () => {
      try {
        const endpoint = import.meta.env.DEV
          ? `/geocode-api?q=${encodeURIComponent(query)}`
          : `${API_BASE_URL}/api/geocode?q=${encodeURIComponent(query)}`
        const response = await fetch(endpoint)
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Could not find that destination.')
        onSearchedDestination({
          id: `search-${data.lat}-${data.lng}`,
          name: data.name || query,
          district: data.district || 'West Bengal',
          coordinates: { lat: data.lat, lng: data.lng },
          modes: ['drive'],
        })
        setSearchMessage('')
      } catch (error) {
        setSearchMessage(error.message || 'Could not find that destination. Try adding its district or state.')
      }
    }
    if (!window.google?.maps?.Geocoder) {
      runBackendFallback()
      return
    }
    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode({ address: query, componentRestrictions: { country: 'IN' } }, (results, status) => {
      if (status === 'OK' && results?.[0]) applyPlaceResult(results[0], query)
      else runBackendFallback()
    })
  }

  return <>
    <form className="rm-place-search" onSubmit={submitTypedDestination}><Search size={15} />
      <input value={searchText} onChange={event => setSearchText(event.target.value)} type="search" placeholder="Type any destination" aria-label="Type any destination" />
      <button type="submit">Go</button></form>
    {searchMessage && <div className="rm-search-message" role="status">{searchMessage}</div>}
    <GoogleMap
      key={destination?.id || 'no-destination'}
      mapContainerClassName="rm-google-map"
      center={SILIGURI}
      zoom={9}
      onLoad={onReady}
      onClick={(event) => onMapClick({ lat: event.latLng.lat(), lng: event.latLng.lng() })}
      options={{ streetViewControl: false, mapTypeControl: false, fullscreenControl: false, styles: DARK_MAP_STYLES, backgroundColor: '#172343' }}
    >
      <Marker position={origin} label="A" title="Starting point" />
      {destination && <Marker position={destination.coordinates} label="B" title={destination.name} />}
      {routePath.length > 0 && <Polyline path={routePath} options={{ strokeColor: '#C8560A', strokeWeight: 5, strokeOpacity: 0.9 }} />}
    </GoogleMap>
  </>
}

export default function RouteMap() {
  const [origin, setOrigin] = useState(SILIGURI)
  const [originLabel, setOriginLabel] = useState('Siliguri (temporary starting point)')
  const [manualMode, setManualMode] = useState(false)
  const [locationNote, setLocationNote] = useState('Finding your location…')
  const [destination, setDestination] = useState(null)
  const [route, setRoute] = useState(null)
  const [routeError, setRouteError] = useState('')
  const [loadingRoute, setLoadingRoute] = useState(false)
  const [mapFailed, setMapFailed] = useState(!MAPS_KEY)
  const [mapReady, setMapReady] = useState(false)
  const [originSearchName, setOriginSearchName] = useState('Siliguri, West Bengal, India')
  const [destinationsOpen, setDestinationsOpen] = useState(false)

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setManualMode(true)
      setLocationNote('Location is unavailable. Choose a starting point below or tap the map.')
      return
    }
    setLocationNote('Finding your location…')
    navigator.geolocation.getCurrentPosition((position) => {
      const point = { lat: position.coords.latitude, lng: position.coords.longitude }
      setOrigin(point)
      setOriginLabel('Your location')
      setOriginSearchName('')
      setManualMode(false)
      const stale = Date.now() - position.timestamp > 5 * 60 * 1000
      setLocationNote(stale ? 'Using your last-known location; it may not be current.' : 'Using your current location.')
    }, (highAccuracyError) => {
      if (highAccuracyError.code === highAccuracyError.PERMISSION_DENIED) {
        setManualMode(true)
        setLocationNote('Location permission was denied. Choose a starting point below or tap the map.')
        return
      }
      navigator.geolocation.getCurrentPosition((position) => {
        setOrigin({ lat: position.coords.latitude, lng: position.coords.longitude })
        setOriginLabel('Approximate network location')
        setOriginSearchName('')
        setManualMode(false)
        setLocationNote('Using an approximate network location.')
      }, () => {
        setManualMode(true)
        setLocationNote('GPS and network location are unavailable. Choose a starting point below or tap the map.')
      }, { enableHighAccuracy: false, timeout: 7000, maximumAge: 300000 })
    }, { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 })
  }, [])

  useEffect(() => {
    const timer = setTimeout(requestLocation, 0)
    return () => clearTimeout(timer)
  }, [requestLocation])
  useEffect(() => {
    if (mapReady || mapFailed) return undefined
    const timer = setTimeout(() => setMapFailed(true), 12000)
    return () => clearTimeout(timer)
  }, [mapFailed, mapReady])

  const chooseOrigin = (hub) => {
    setOrigin(hub.point)
    setOriginLabel(hub.name)
    setOriginSearchName(`${hub.name}, West Bengal, India`)
    setLocationNote(`Starting from ${hub.name}.`)
    setRoute(null)
    setRouteError('')
  }

  const resolvePlaceId = useCallback((query) => new Promise((resolve) => {
    if (!mapReady || !window.google?.maps?.Geocoder || !query) return resolve(null)
    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode({ address: query, componentRestrictions: { country: 'IN' } }, (results, status) => {
      resolve(status === 'OK' ? results?.[0]?.place_id || null : null)
    })
  }), [mapReady])

  const chooseDestination = async (selected) => {
    setDestination(selected)
    setRoute(null)
    setRouteError('')
    setLoadingRoute(true)
    try {
      const [originPlaceId, destinationPlaceId] = await Promise.all([
        resolvePlaceId(originSearchName),
        selected.googlePlaceId ? Promise.resolve(selected.googlePlaceId) : resolvePlaceId(`${selected.name}, ${selected.district}, West Bengal, India`),
      ])
      const routeEndpoint = import.meta.env.DEV ? '/route-api' : `${API_BASE_URL}/api/route`
      const response = await fetch(routeEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originLat: origin.lat,
          originLng: origin.lng,
          destinationLat: selected.coordinates.lat,
          destinationLng: selected.coordinates.lng,
          destinationAccessType: destinationAccessType(selected),
          ...(originPlaceId ? { originPlaceId } : {}),
          ...(destinationPlaceId ? { destinationPlaceId } : {}),
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Route calculation failed')
      setRoute(data)
    } catch (error) {
      const unreachable = !navigator.onLine || error instanceof TypeError || error.message === 'Failed to fetch'
      setRouteError(unreachable ? "You're offline — reconnect to calculate a live route." : error.message)
    } finally {
      setLoadingRoute(false)
    }
  }

  return (
    <main className="rm-page">
      <div className="rm-shell">
        <PageHeader />
        <header className="rm-hero">
          <span>North Bengal journey planner</span>
          <h1><em>Route</em> map</h1>
          <p>Honest road routes and trek info where roads end.</p>
        </header>

        <section className="rm-origin-card">
          <div><LocateFixed size={18} /><div><small>Starting point</small><strong>{originLabel}</strong><p>{locationNote}</p></div></div>
          <button onClick={requestLocation}><RefreshCw size={14} /> Refresh</button>
          {manualMode && <div className="rm-hubs" aria-label="Manual starting points">
            {HUBS.map(hub => <button key={hub.name} onClick={() => chooseOrigin(hub)}>{hub.name}</button>)}
          </div>}
        </section>

        <section className="rm-map-card">
          {mapFailed ? (
            <div className="rm-map-fallback">
              <AlertTriangle size={22} />
              <h2>Map unavailable</h2>
              <p>You can still choose a destination from this list.</p>
              {ROUTE_MAP_DESTINATIONS.map(item => <button key={item.id} onClick={() => chooseDestination(item)}><span>{item.name}</span><small>{item.district} district</small></button>)}
            </div>
          ) : (
            <MapCanvas
              origin={origin}
              destination={destination}
              encodedPolyline={route?.polyline}
              onReady={() => setMapReady(true)}
              onFailure={() => setMapFailed(true)}
              onSearchedDestination={chooseDestination}
              knownDestinations={ROUTE_MAP_DESTINATIONS}
              onMapClick={(point) => { setOrigin(point); setOriginLabel('Point selected on map'); setOriginSearchName(''); setLocationNote('Manual starting point selected.'); setManualMode(true); setRoute(null); setRouteError('') }}
            />
          )}
        </section>

        {!mapFailed && <button className="rm-open-destinations" onClick={() => setDestinationsOpen(true)}>
          <span><small>Prefer not to type?</small><strong>{destination ? destination.name : 'Where are you going?'}</strong><em>Tap to choose a popular destination</em></span><ChevronDown size={19} />
        </button>}

        {destinationsOpen && <div className="rm-picker-backdrop" onClick={() => setDestinationsOpen(false)} role="presentation">
          <section className="rm-destination-picker" role="dialog" aria-modal="true" aria-label="Choose a popular destination" onClick={event => event.stopPropagation()}>
            <header><div><small>Popular North Bengal places</small><h2>Where are you going?</h2><p>If you do not want to type, choose any location below.</p></div><button onClick={() => setDestinationsOpen(false)} aria-label="Close destination picker"><X size={18} /></button></header>
            <div className="rm-destinations">
              {ROUTE_MAP_DESTINATIONS.map(item => (
                <button key={item.id} className={destination?.id === item.id ? 'active' : ''} onClick={() => { chooseDestination(item); setDestinationsOpen(false) }}>
                  <span className={`rm-destination-icon ${destinationAccessType(item) === 'trek_only' ? 'trek' : ''}`}><MapPin size={16} /></span><span><strong>{item.name}</strong><small>{item.district} · {destinationAccessType(item) === 'trek_only' ? 'Trek only' : 'Road accessible'}{destination?.id === item.id ? ' · Selected' : ''}</small></span><Navigation size={15} />
                </button>
              ))}
            </div>
          </section>
        </div>}

        {loadingRoute && <div className="rm-status">Calculating route…</div>}
        {routeError && <div className="rm-error"><AlertTriangle size={17} /> {routeError}</div>}
        {route && destination && <section className="rm-result">
          <span className={`rm-source rm-source--${route.source}`}>{route.source}</span>
          {route.source === 'static' ? (
            <><h2>{route.message}</h2><dl><div><dt>Nearest road point</dt><dd>{destination.nearest}</dd></div><div><dt>Best time</dt><dd>{destination.bestTime}</dd></div><div><dt>Stay</dt><dd>{destination.stay}</dd></div><div><dt>Permit</dt><dd>{destination.permit}</dd></div></dl></>
          ) : (
            <><h2>{destination.name}</h2><div className="rm-metrics"><div><strong>{route.distanceKm} km</strong><span>Distance</span></div><div><strong>{route.durationText}</strong><span>Est. drive</span></div></div><div className="rm-result-tags"><span>Road accessible</span><span>Mountain road</span></div>{route.message && <p>{route.message}</p>}<p className="rm-route-note">Route shown is indicative. Mountain roads may close due to landslides or weather — check conditions before travel.</p></>
          )}
        </section>}
      </div>
    </main>
  )
}
