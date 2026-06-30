require('dotenv').config()
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local'), override: false })
const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// ── Request logger ─────────────────────────────────────────────────────────────
function logRequest(req, stage, extra = {}) {
  console.log(JSON.stringify({
    ts: new Date().toISOString(),
    method: req.method,
    path: req.path,
    body: req.body,
    query: req.query,
    stage,
    ...extra,
  }, null, 2))
}

// ── Mock data generators ───────────────────────────────────────────────────────
function mockTrainResults(origin, destination, date) {
  return [
    {
      trainName: 'Vande Bharat Express',
      trainNameNative: 'বন্দে ভারত এক্সপ্রেস',
      trainNumber: '22301 / 22302',
      category: 'fastest',
      isFastest: true,
      originCode: 'NJP', destinationCode: 'HWH',
      originFull: 'New Jalpaiguri', destinationFull: 'Howrah Junction',
      origin, destination, date,
      departure: '05:45', arrival: '13:20', duration: '7h 35m',
      frequency: 'Daily', tripType: 'Direct',
      classes: ['AC Chair Car', 'Executive Class'],
      tags: ['Daily'],
      accentColor: '#E0652E',
    },
    {
      trainName: 'Padatik Express',
      trainNameNative: 'পাদাতিক এক্সপ্রেস',
      trainNumber: '12377',
      category: 'overnight',
      isFastest: false,
      originCode: 'NJP', destinationCode: 'KOAA',
      originFull: 'New Jalpaiguri', destinationFull: 'Kolkata',
      origin, destination, date,
      departure: '23:00', arrival: '09:05+1', duration: '~10h',
      frequency: 'Daily', tripType: 'Direct',
      classes: ['Sleeper', '3AC', '2AC'],
      tags: ['Popular daily', 'Overnight'],
      accentColor: '#D9A441',
    },
    {
      trainName: 'Uttar Banga Express',
      trainNameNative: 'উত্তর বঙ্গ এক্সপ্রেস',
      trainNumber: '13147',
      category: 'weekly',
      isFastest: false,
      originCode: 'NJP', destinationCode: 'HWH',
      originFull: 'New Jalpaiguri', destinationFull: 'Howrah Junction',
      origin, destination, date,
      departure: '12:15', arrival: '22:50', duration: '~10h 35m',
      frequency: 'Weekly', tripType: 'HWH',
      classes: ['Sleeper'],
      tags: ['Weekly'],
      accentColor: '#6C7BC4',
    },
    {
      trainName: 'Kanchanjunga Express',
      trainNameNative: 'কাঞ্চনজঙ্ঘা এক্সপ্রেস',
      trainNumber: '13173 / 13175',
      category: 'overnight',
      isFastest: false,
      originCode: 'NJP', destinationCode: 'SDAH',
      originFull: 'New Jalpaiguri', destinationFull: 'Sealdah',
      origin, destination, date,
      departure: '06:00', arrival: '17:15', duration: '~11h',
      frequency: 'Daily', tripType: 'SDAH',
      classes: ['Sleeper'],
      tags: ['Sealdah terminus'],
      accentColor: '#4FA8A0',
    },
  ]
}

function mockBusResults(origin, destination, date) {
  return [
    {
      busOperator: 'Shyamoli Paribahan',
      busOperatorNative: 'শ্যামলী পরিবহন',
      busType: 'Volvo AC Sleeper',
      category: 'ac-sleeper',
      origin, destination, date,
      boardingPoint: 'Hill Cart Rd',
      droppingPoint: 'Esplanade',
      departure: '20:00', arrival: '08:40+1', duration: '~12h 40m',
      fareRange: { low: 1300, high: 6050 }, currency: 'INR',
      amenities: ['Pushback seats', 'Charging port'],
      tripType: 'Overnight',
      accentColor: '#D9A441',
    },
    {
      busOperator: 'Greenline',
      busOperatorNative: 'গ্রীনলাইন',
      busType: 'Volvo AC Sleeper',
      category: 'ac-sleeper',
      origin, destination, date,
      boardingPoint: 'Hill Cart Rd',
      droppingPoint: 'Esplanade',
      departure: '21:00', arrival: '08:30+1', duration: '~11h 30m',
      fareRange: { low: 850, high: 2185 }, currency: 'INR',
      amenities: ['Semi-sleeper', 'Fastest'],
      tripType: 'Overnight',
      accentColor: '#4FA8A0',
    },
    {
      busOperator: 'NBSTC',
      busOperatorNative: 'উত্তরবঙ্গ রাজ্য পরিবহন',
      busType: 'Non-AC Seater',
      category: 'non-ac',
      origin, destination, date,
      boardingPoint: 'Siliguri Junction',
      droppingPoint: 'Esplanade',
      departure: '06:00', arrival: '19:00', duration: '~13h',
      fareRange: { low: 454, high: 900 }, currency: 'INR',
      amenities: ['Most affordable'],
      tripType: 'Multiple stops',
      accentColor: '#6C7BC4',
    },
    {
      busOperator: 'NueGo',
      busOperatorNative: 'NueGo',
      busType: 'Electric AC Seater',
      category: 'budget',
      origin, destination, date,
      boardingPoint: 'Hill Cart Rd',
      droppingPoint: 'Kolkata depot',
      departure: '08:30', arrival: '17:00', duration: '~8h 30m',
      fareRange: { low: 620, high: 1200 }, currency: 'INR',
      amenities: ['Electric', 'Wi-Fi'],
      tripType: 'Day journey',
      accentColor: '#4FA8A0',
    },
  ]
}

function mockFlightResults(origin, destination, date) {
  return [
    {
      airline: 'IndiGo', flightNumber: '6E 501',
      origin, destination, date,
      departure: '07:20', arrival: '09:15', duration: '1h 55m',
      stops: 0, price: 4250, currency: 'INR',
    },
    {
      airline: 'Air India', flightNumber: 'AI 764',
      origin, destination, date,
      departure: '13:50', arrival: '16:10', duration: '2h 20m',
      stops: 1, price: 5100, currency: 'INR',
    },
    {
      airline: 'SpiceJet', flightNumber: 'SG 116',
      origin, destination, date,
      departure: '19:45', arrival: '21:30', duration: '1h 45m',
      stops: 0, price: 3890, currency: 'INR',
    },
  ]
}

/**
 * Builds a Booking.com public search deeplink.
 * Used as the primary hotel result while no live hotel API is available.
 *
 * @param {string} destination  - City or property name to search
 * @param {string} checkin      - Check-in date in YYYY-MM-DD format
 * @param {object} opts
 * @param {number} [opts.adults=1]
 * @param {number} [opts.children=0]
 * @param {number} [opts.rooms=1]
 * @param {string} [opts.checkoutDate] - Explicit checkout date; defaults to checkin + 1 day
 */
function buildBookingComDeeplink(destination, checkin, {
  adults = 1,
  children = 0,
  rooms = 1,
  checkoutDate,
} = {}) {
  const checkout = checkoutDate ?? (() => {
    const d = new Date(checkin)
    d.setUTCDate(d.getUTCDate() + 1)
    return d.toISOString().split('T')[0]
  })()

  const params = new URLSearchParams({
    ss:             destination,
    checkin,
    checkout,
    group_adults:   String(adults),
    group_children: String(children),
    no_rooms:       String(rooms),
  })

  return {
    type:        'deeplink',
    source:      'booking.com',
    destination,
    checkin,
    checkout,
    url:         `https://www.booking.com/searchresults.html?${params.toString()}`,
    message:     'Continue your hotel search on Booking.com',
  }
}

// ── Fallback chain ─────────────────────────────────────────────────────────────

async function primarySearch({ origin, destination, mode, date, simulateFailure, adults, children, rooms, checkoutDate }) {
  if (simulateFailure) {
    throw new Error('primarySearch: simulated failure via ?simulateFailure=true')
  }
  switch (mode) {
    case 'train':  return mockTrainResults(origin, destination, date)
    case 'bus':    return mockBusResults(origin, destination, date)
    case 'flight': return mockFlightResults(origin, destination, date)
    case 'hotel':  return [buildBookingComDeeplink(destination, date, { adults, children, rooms, checkoutDate })]
  }
}

async function fallbackSearch({ origin, destination, mode, date }) {
  // Single simplified result — simulates a secondary/cheaper provider
  return [
    {
      source: 'fallback-provider',
      mode, origin, destination, date,
      note: 'Limited results — primary provider unavailable',
      price: mode === 'hotel' ? 2500 : 999,
      currency: 'INR',
    },
  ]
}

async function deeplinkFallback({ origin, destination, mode, date }) {
  const params = new URLSearchParams({ origin, destination, mode, date })
  return {
    type: 'deeplink',
    mode,
    url: `https://example.com/search?${params.toString()}`,
    message: 'Live search unavailable. Continue booking on our partner site.',
  }
}

// ── POST /api/search ───────────────────────────────────────────────────────────
app.post('/api/search', async (req, res) => {
  const { origin, destination, mode, date, adults, children, rooms, checkoutDate } = req.body
  const simulateFailure = req.query.simulateFailure === 'true'

  // Validate required fields
  const missing = ['origin', 'destination', 'mode'].filter(k => !req.body[k])
  if (missing.length) {
    return res.status(400).json({
      error: `Missing required field(s): ${missing.join(', ')}`,
    })
  }

  const validModes = ['train', 'bus', 'flight', 'hotel']
  if (!validModes.includes(mode)) {
    return res.status(400).json({
      error: `Invalid mode "${mode}". Allowed values: ${validModes.join(', ')}`,
    })
  }

  const params = {
    origin,
    destination,
    mode,
    date: date || new Date().toISOString().split('T')[0],
    simulateFailure,
    // Hotel-specific guest options (all optional)
    adults:       adults       != null ? Number(adults)   : undefined,
    children:     children     != null ? Number(children) : undefined,
    rooms:        rooms        != null ? Number(rooms)    : undefined,
    checkoutDate: checkoutDate ?? undefined,
  }

  // Primary
  try {
    const results = await primarySearch(params)
    logRequest(req, 'primary', { resultsCount: results.length })
    return res.json({ stage: 'primary', results })
  } catch (err) {
    console.error(`[primary] failed: ${err.message}`)
  }

  // Fallback
  try {
    const results = await fallbackSearch(params)
    logRequest(req, 'fallback', { resultsCount: results.length })
    return res.json({ stage: 'fallback', results })
  } catch (err) {
    console.error(`[fallback] failed: ${err.message}`)
  }

  // Deeplink — last resort, always succeeds
  const deeplink = await deeplinkFallback(params)
  logRequest(req, 'deeplink', {})
  return res.json({ stage: 'deeplink', ...deeplink })
})

// ── Information Booklet helpers ────────────────────────────────────────────────

function withConfidence(data, confidence, lastVerified, extra = {}) {
  const allowed = ['live', 'scheduled-reference', 'curated-estimate']
  if (!allowed.includes(confidence)) {
    throw new Error(`withConfidence: invalid confidence "${confidence}"`)
  }
  return { confidence, lastVerified, data, ...extra }
}

function trainOverview(origin, destination, date) {
  const trains = mockTrainResults(origin, destination, date)
  const fastest = trains.find(t => t.isFastest) || trains[0]
  const summary = {
    serviceCount: trains.length,
    fastestServiceName: fastest.trainName,
    trains,
    note: 'Schedule reference only — not live seat availability. Verify class and availability directly on IRCTC before travel.',
  }
  return withConfidence(summary, 'scheduled-reference', null)
}

function busOverview(origin, destination, date) {
  const buses = mockBusResults(origin, destination, date)
  const allLow  = buses.map(b => b.fareRange.low)
  const allHigh = buses.map(b => b.fareRange.high)
  const summary = {
    operatorCount: buses.length,
    typicalDuration: '8–13 hours',
    fareRange: { low: Math.min(...allLow), high: Math.max(...allHigh) },
    buses,
    note: 'Schedule reference only — not a live seat map. Confirm with the operator directly before travel.',
  }
  return withConfidence(summary, 'scheduled-reference', null)
}

function hotelOverview(destination, date) {
  const summary = {
    hotels: [
      {
        name: 'The Oberoi Grand',
        tier: 'Luxury',
        category: 'luxury',
        stars: 5,
        area: 'Chowringhee',
        description: 'Kolkata landmark',
        typicalPricePerNight: 12000,
        accentColor: '#D9A441',
      },
      {
        name: 'ITC Royal Bengal',
        tier: 'Luxury',
        category: 'luxury',
        stars: 5,
        area: 'New Town',
        description: 'Business & leisure',
        typicalPricePerNight: 10500,
        accentColor: '#D9A441',
      },
      {
        name: 'Swissotel Kolkata',
        tier: 'Luxury',
        category: 'luxury',
        stars: 5,
        area: 'New Town',
        description: 'Contemporary luxury',
        typicalPricePerNight: 9500,
        accentColor: '#D9A441',
      },
      {
        name: 'Lemon Tree Premier',
        tier: 'Mid-range',
        category: 'mid-range',
        stars: 4,
        area: 'Park Circus',
        description: 'Well-connected, modern rooms',
        typicalPricePerNight: 4500,
        accentColor: '#4FA8A0',
      },
      {
        name: 'Mint Hotel',
        tier: 'Mid-range',
        category: 'mid-range',
        stars: 3,
        area: 'Park Street',
        description: 'Budget-friendly, great location',
        typicalPricePerNight: 2800,
        accentColor: '#4FA8A0',
      },
      {
        name: 'Hotel Galaxy',
        tier: 'Budget',
        category: 'budget',
        stars: 2,
        area: 'Esplanade',
        description: 'Clean, central, no-frills',
        typicalPricePerNight: 1200,
        accentColor: '#9CA3C4',
      },
    ],
    note: 'Curated estimate from public listings — prices are indicative and fluctuate. Confirm directly with the property before booking.',
  }
  return withConfidence(summary, 'curated-estimate', null)
}

// ── POST /api/overview ─────────────────────────────────────────────────────────
app.post('/api/overview', (req, res) => {
  const { origin, destination, date } = req.body

  if (!origin || !destination) {
    const missing = ['origin', 'destination'].filter(k => !req.body[k])
    return res.status(400).json({
      error: `Missing required field(s): ${missing.join(', ')}`,
    })
  }

  const resolvedDate = date || new Date().toISOString().split('T')[0]
  logRequest(req, 'overview', { origin, destination, date: resolvedDate })

  const trains = trainOverview(origin, destination, resolvedDate)
  const buses  = busOverview(origin, destination, resolvedDate)
  const hotels = hotelOverview(destination, resolvedDate)

  return res.json({
    origin,
    destination,
    date: resolvedDate,
    trains,
    buses,
    hotels,
    flights: {
      confidence: 'live',
      lastVerified: null,
      data: null,
      note: 'Not yet loaded — call GET /api/flights-info',
    },
  })
})

// ── City / station → IATA lookup ──────────────────────────────────────────────
const IATA_MAP = {
  bagdogra: 'IXB', 'bagdogra airport': 'IXB', ixb: 'IXB',
  kolkata: 'CCU', calcutta: 'CCU', ccu: 'CCU',
  'netaji subhas': 'CCU', 'dum dum': 'CCU',
  delhi: 'DEL', 'new delhi': 'DEL', del: 'DEL',
  mumbai: 'BOM', bombay: 'BOM', bom: 'BOM',
  chennai: 'MAA', madras: 'MAA', maa: 'MAA',
  bengaluru: 'BLR', bangalore: 'BLR', blr: 'BLR',
  hyderabad: 'HYD', hyd: 'HYD',
  guwahati: 'GAU', gau: 'GAU',
  'cooch behar': 'COH', coh: 'COH',
  pune: 'PNQ', pnq: 'PNQ',
  ahmedabad: 'AMD', amd: 'AMD',
  'coimbatore': 'CJB', cjb: 'CJB',
}

function toIATA(city) {
  return IATA_MAP[city.toLowerCase().trim()] || city.toUpperCase().trim()
}

function calcDuration(minutes) {
  if (!minutes || minutes < 0) return '—'
  return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, '0')}m`
}

function parseTime(str) {
  if (!str) return '—'
  const t = str.slice(-5)
  return /^\d{2}:\d{2}$/.test(t) ? t : '—'
}

// ── GET /api/flights-info ──────────────────────────────────────────────────────
app.get('/api/flights-info', async (req, res) => {
  const { origin, destination, date } = req.query

  if (!origin || !destination) {
    const missing = ['origin', 'destination'].filter(k => !req.query[k])
    return res.status(400).json({ error: `Missing required query parameter(s): ${missing.join(', ')}` })
  }

  // ── Date validation ────────────────────────────────────────────────────────
  const resolvedDate = date || new Date().toISOString().split('T')[0]
  const parsedDate = new Date(resolvedDate + 'T00:00:00')
  if (isNaN(parsedDate.getTime())) {
    return res.json(withConfidence([], 'live', new Date().toISOString(), {
      reason: `"${resolvedDate}" is not a valid date. Please check the date and try again.`,
    }))
  }
  // Reject calendar dates that don't actually exist (e.g. June 31)
  const [yr, mo, dy] = resolvedDate.split('-').map(Number)
  if (parsedDate.getFullYear() !== yr || parsedDate.getMonth() + 1 !== mo || parsedDate.getDate() !== dy) {
    return res.json(withConfidence([], 'live', new Date().toISOString(), {
      reason: `${resolvedDate} doesn't exist on the calendar — for example, June only has 30 days. Please pick a valid date.`,
    }))
  }

  // ── Location validation ────────────────────────────────────────────────────
  const depIATA = toIATA(origin)
  const arrIATA = toIATA(destination)

  // A location is unknown if it's not in our map AND doesn't look like a real
  // IATA code (exactly 3 letters) or a meaningful city name (4+ chars)
  const VALID_IATA = /^[A-Z]{3}$/
  const isUnknown = loc => {
    const key = loc.toLowerCase().trim()
    if (IATA_MAP[key]) return false              // known city or code in our map
    if (VALID_IATA.test(loc.toUpperCase().trim()) && loc.trim().length === 3) return false // looks like a real IATA code — let SerpAPI decide
    return loc.trim().length < 4               // too short to be a real city name
  }

  // Catch anything that's clearly not a real place before hitting SerpAPI
  const notRecognised = [origin, destination].filter(loc => {
    const key = loc.toLowerCase().trim()
    // Not in our map at all and either too short OR clearly gibberish (no vowels, repeated chars, etc.)
    if (IATA_MAP[key]) return false
    const clean = loc.trim()
    if (clean.length < 3) return true
    // If it's exactly 3 chars treat as IATA and let SerpAPI validate
    if (clean.length === 3 && VALID_IATA.test(clean.toUpperCase())) return false
    // For longer strings — require at least one vowel (real place names have them)
    return !/[aeiouAEIOU]/.test(clean)
  })

  if (notRecognised.length) {
    return res.json(withConfidence([], 'live', new Date().toISOString(), {
      reason: `We don't recognise "${notRecognised.join('", "')}" as a city or airport. Try a full city name like "Kolkata" or "Bagdogra", or a 3-letter airport code like "CCU".`,
    }))
  }

  logRequest(req, 'flights-info', { origin, destination, depIATA, arrIATA, date: resolvedDate })

  const serpKey = process.env.VITE_SERPAPI_KEY || process.env.SERPAPI_KEY

  // ── Live SerpAPI call ──────────────────────────────────────────────────────
  if (serpKey) {
    try {
      const params = new URLSearchParams({
        engine: 'google_flights',
        departure_id: depIATA,
        arrival_id: arrIATA,
        outbound_date: resolvedDate,
        currency: 'INR',
        adults: '1',
        travel_class: '1',
        type: '2',
        api_key: serpKey,
      })
      const upstream = await fetch(`https://serpapi.com/search?${params}`)
      const data = await upstream.json()

      if (!upstream.ok) {
        const raw = (data.error || '').toLowerCase()
        let reason = 'We couldn\'t load flights right now. Please try again in a moment.'
        if (raw.includes('departure_id') || raw.includes('arrival_id') || raw.includes('not valid') || raw.includes('invalid')) {
          reason = `We couldn't find an airport for "${raw.includes('departure') ? origin : destination}". Please use a full city name like "Kolkata" or a 3-letter airport code like "CCU".`
        } else if (raw.includes('api_key') || raw.includes('key')) {
          reason = 'Flight search is temporarily unavailable. Please try again later.'
        } else if (raw.includes('quota') || raw.includes('limit')) {
          reason = 'Flight search has reached its daily limit. Please try again tomorrow.'
        }
        return res.json(withConfidence([], 'live', new Date().toISOString(), { reason }))
      }

      const allFlights = [...(data.best_flights ?? []), ...(data.other_flights ?? [])]

      if (!allFlights.length) {
        return res.json(withConfidence([], 'live', new Date().toISOString(), {
          reason: `No flights found from "${origin}" to "${destination}" on ${resolvedDate}. This route may not have direct or connecting service on that date.`,
        }))
      }

      const flights = allFlights.slice(0, 6).map(f => {
        const legs  = f.flights ?? []
        const first = legs[0] ?? {}
        const last  = legs[legs.length - 1] ?? first
        return {
          airline:      first.airline ?? 'Airline',
          flightNumber: first.flight_number ?? '—',
          departure:    parseTime(first.departure_airport?.time),
          arrival:      parseTime(last.arrival_airport?.time),
          duration:     calcDuration(f.total_duration),
          stops:        Math.max(0, legs.length - 1),
          price:        f.price ?? null,
          currency:     'INR',
        }
      })

      return res.json(withConfidence(flights, 'live', new Date().toISOString()))
    } catch (err) {
      console.error(`[flights-info] SerpAPI error: ${err.message}`)
      const raw = err.message.toLowerCase()
      let reason = 'Could not load flights right now. Please try again in a moment.'
      if (raw.includes('not valid') || raw.includes('invalid') || raw.includes('departure_id') || raw.includes('arrival_id')) {
        reason = `We couldn't find an airport matching your search. Try using a full city name like "Kolkata" or a 3-letter code like "CCU".`
      }
      return res.json(withConfidence([], 'live', new Date().toISOString(), { reason }))
    }
  }

  // ── No API key configured ──────────────────────────────────────────────────
  return res.json(withConfidence([], 'live', new Date().toISOString(), {
    reason: 'Flight search is not configured on this server.',
  }))
})

// ── Health check ───────────────────────────────────────────────────────────────
const GOOGLE_ROUTES_API_URL = 'https://routes.googleapis.com/directions/v2:computeRoutes'
const GOOGLE_ROUTES_API_KEY = process.env.GOOGLE_ROUTES_API_KEY
const ROUTE_TIMEOUT_MS = 8000
const ROUTE_RETRY_DELAY_MS = 350
const routeCache = new Map()
const TREK_NOTE = 'This destination has no road access. See trek details below.'

// GET /api/geocode - browser-key-independent fallback for typed destinations.
app.get('/api/geocode', async (req, res) => {
  const query = String(req.query.q || '').trim()
  if (!query) return res.status(400).json({ error: 'Missing destination query.' })

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 6000)
  try {
    const params = new URLSearchParams({
      q: query,
      format: 'jsonv2',
      countrycodes: 'in',
      limit: '1',
      viewbox: '85.8,27.5,89.9,21.5',
      bounded: '1',
      addressdetails: '1',
    })
    const upstream = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
      headers: { 'User-Agent': 'KothaSetu/1.0 (West Bengal travel route planner)' },
      signal: controller.signal,
    })
    if (!upstream.ok) throw new Error(`Geocoder returned HTTP ${upstream.status}`)
    const [place] = await upstream.json()
    if (!place) return res.status(404).json({ error: 'Could not find that destination within West Bengal.' })
    logRequest(req, 'geocode', { result: place.display_name })
    return res.json({
      name: place.name || place.display_name.split(',')[0],
      district: place.address?.state_district || place.address?.county || place.address?.state || 'West Bengal',
      lat: Number(place.lat),
      lng: Number(place.lon),
    })
  } catch (error) {
    logRequest(req, 'geocode-error', { error: error.message })
    return res.status(503).json({ error: 'Destination search is temporarily unavailable.' })
  } finally {
    clearTimeout(timeout)
  }
})

function routeCacheKey(...coordinates) {
  return coordinates.map(value => Number(value).toFixed(4)).join(':')
}

function haversineKm(lat1, lng1, lat2, lng2) {
  const radians = degrees => degrees * Math.PI / 180
  const earthRadiusKm = 6371
  const deltaLat = radians(lat2 - lat1)
  const deltaLng = radians(lng2 - lng1)
  const a = Math.sin(deltaLat / 2) ** 2
    + Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * Math.sin(deltaLng / 2) ** 2
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function degradedRoute(originLat, originLng, destinationLat, destinationLng, reason) {
  const straightLineKm = haversineKm(originLat, originLng, destinationLat, destinationLng)
  const estimatedMinutes = Math.max(1, Math.round((straightLineKm * 1.3) / 35 * 60))
  return {
    distanceKm: Number(straightLineKm.toFixed(1)),
    durationText: `roughly ${calcDuration(estimatedMinutes)}`,
    polyline: null,
    source: 'degraded',
    estimate: 'straight-line',
    message: `Approx. ${straightLineKm.toFixed(1)} km straight-line distance; road travel is typically around ${calcDuration(estimatedMinutes)}.`,
    reason,
  }
}

function formatGoogleDuration(duration) {
  const match = /^(\d+(?:\.\d+)?)s$/.exec(duration || '')
  return match ? calcDuration(Math.max(1, Math.round(Number(match[1]) / 60))) : (duration || null)
}

function isValidEncodedPolyline(polyline) {
  if (typeof polyline !== 'string' || !polyline.length) return false
  let index = 0
  while (index < polyline.length) {
    for (let coordinate = 0; coordinate < 2; coordinate += 1) {
      let byte
      let shift = 0
      do {
        if (index >= polyline.length || shift > 30) return false
        byte = polyline.charCodeAt(index++) - 63
        if (byte < 0 || byte > 63) return false
        shift += 5
      } while (byte >= 0x20)
    }
  }
  return true
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function fetchGoogleRoute(payload, simulateFailure) {
  if (simulateFailure) return { ok: false, status: 429 }
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), ROUTE_TIMEOUT_MS)
  try {
    return await fetch(GOOGLE_ROUTES_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_ROUTES_API_KEY,
        'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeout)
  }
}

// POST /api/route
app.post('/api/route', async (req, res) => {
  logRequest(req, 'route-request')
  const { originLat, originLng, destinationLat, destinationLng, destinationAccessType, originPlaceId, destinationPlaceId } = req.body
  const coordinateNames = ['originLat', 'originLng', 'destinationLat', 'destinationLng']
  const missing = coordinateNames.filter(name => req.body[name] === undefined || req.body[name] === null || req.body[name] === '')
  if (missing.length) {
    return res.status(400).json({ error: `Missing required coordinate field(s): ${missing.join(', ')}` })
  }

  const coordinates = { originLat, originLng, destinationLat, destinationLng }
  const nonNumeric = coordinateNames.filter(name => typeof coordinates[name] === 'boolean' || !Number.isFinite(Number(coordinates[name])))
  if (nonNumeric.length) {
    return res.status(400).json({ error: `Coordinate field(s) must be numeric: ${nonNumeric.join(', ')}` })
  }

  const numeric = Object.fromEntries(Object.entries(coordinates).map(([name, value]) => [name, Number(value)]))
  const outOfBounds = coordinateNames.filter(name => {
    const [minimum, maximum] = name.endsWith('Lat') ? [21.5, 27.5] : [85.8, 89.9]
    return numeric[name] < minimum || numeric[name] > maximum
  })
  if (outOfBounds.length) {
    return res.status(400).json({
      error: `Coordinate field(s) outside the supported West Bengal bounds (lat 21.5-27.5, lng 85.8-89.9): ${outOfBounds.join(', ')}`,
    })
  }

  const validAccessTypes = ['road_accessible', 'trek_only', 'road_then_trek']
  if (!validAccessTypes.includes(destinationAccessType)) {
    return res.status(400).json({
      error: `Invalid destinationAccessType "${destinationAccessType}". Allowed values: ${validAccessTypes.join(', ')}`,
    })
  }

  if (destinationAccessType === 'trek_only') {
    logRequest(req, 'route-static-trek', { googleCalled: false })
    return res.json({ source: 'static', message: TREK_NOTE })
  }

  const key = routeCacheKey(numeric.originLat, numeric.originLng, numeric.destinationLat, numeric.destinationLng)
  const simulateFailure = req.query.simulateGoogleFailure === 'true'
  const cached = routeCache.get(key)
  if (cached && !simulateFailure) {
    logRequest(req, 'route-cache', { cacheKey: key })
    return res.json({
      ...cached.route,
      source: 'cache',
      lastCalculated: cached.calculatedAt,
      ...(destinationAccessType === 'road_then_trek' ? { trekMessage: TREK_NOTE } : {}),
    })
  }

  if (!GOOGLE_ROUTES_API_KEY) {
    logRequest(req, 'route-not-configured')
    return res.status(503).json({ error: 'Live routing is not configured on this server.', source: 'offline' })
  }

  const googlePayload = {
    origin: originPlaceId
      ? { placeId: originPlaceId }
      : { location: { latLng: { latitude: numeric.originLat, longitude: numeric.originLng } } },
    destination: destinationPlaceId
      ? { placeId: destinationPlaceId }
      : { location: { latLng: { latitude: numeric.destinationLat, longitude: numeric.destinationLng } } },
    travelMode: 'DRIVE',
    routingPreference: 'TRAFFIC_AWARE',
  }
  let upstream

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      upstream = await fetchGoogleRoute(googlePayload, simulateFailure)
      break
    } catch (error) {
      const timedOut = error.name === 'AbortError'
      if (timedOut && attempt === 1) {
        logRequest(req, 'route-timeout-retry', { attempt })
        await delay(ROUTE_RETRY_DELAY_MS)
        continue
      }
      logRequest(req, timedOut ? 'route-timeout' : 'route-offline', { attempt, error: error.message })
      return res.status(timedOut ? 504 : 503).json({
        error: timedOut
          ? 'Live route calculation timed out after one retry. Please retry manually.'
          : "You're offline -- reconnect to calculate a live route.",
        source: 'offline',
        retryable: true,
      })
    }
  }

  if (!upstream.ok) {
    const route = degradedRoute(
      numeric.originLat, numeric.originLng, numeric.destinationLat, numeric.destinationLng,
      simulateFailure ? 'Simulated Google API failure' : `Google Routes API returned HTTP ${upstream.status}`,
    )
    logRequest(req, 'route-degraded', { upstreamStatus: upstream.status })
    return res.json({ ...route, ...(destinationAccessType === 'road_then_trek' ? { trekMessage: TREK_NOTE } : {}) })
  }

  let data
  try {
    data = await upstream.json()
  } catch (error) {
    const route = degradedRoute(numeric.originLat, numeric.originLng, numeric.destinationLat, numeric.destinationLng, 'Google returned a malformed response')
    logRequest(req, 'route-degraded-malformed', { error: error.message })
    return res.json({ ...route, ...(destinationAccessType === 'road_then_trek' ? { trekMessage: TREK_NOTE } : {}) })
  }

  const googleRoute = data?.routes?.[0]
  if (!Number.isFinite(googleRoute?.distanceMeters) || !googleRoute?.duration) {
    const route = degradedRoute(numeric.originLat, numeric.originLng, numeric.destinationLat, numeric.destinationLng, 'Google returned an empty or incomplete route')
    logRequest(req, 'route-degraded-empty')
    return res.json({ ...route, ...(destinationAccessType === 'road_then_trek' ? { trekMessage: TREK_NOTE } : {}) })
  }

  const encodedPolyline = googleRoute.polyline?.encodedPolyline
  const route = {
    distanceKm: Number((googleRoute.distanceMeters / 1000).toFixed(1)),
    durationText: formatGoogleDuration(googleRoute.duration),
    polyline: isValidEncodedPolyline(encodedPolyline) ? encodedPolyline : null,
    source: 'live',
  }
  const calculatedAt = new Date().toISOString()
  routeCache.set(key, { route, calculatedAt })
  logRequest(req, 'route-live', { cacheKey: key, hasPolyline: Boolean(route.polyline) })
  return res.json({ ...route, ...(destinationAccessType === 'road_then_trek' ? { trekMessage: TREK_NOTE } : {}) })
})

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', port: PORT })
})

// Export the Express application so Vercel can run it as a serverless function.
// Keep the normal listener for local `npm run backend` development.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`KothaSetu backend running on http://localhost:${PORT}`)
  })
}

module.exports = app
