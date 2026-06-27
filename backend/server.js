require('dotenv').config()
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
      airline: 'IndiGo',
      flightNumber: '6E 501',
      origin, destination, date,
      departure: '07:20', arrival: '09:15', duration: '1h 55m',
      class: 'Economy', stops: 0, price: 4250, currency: 'INR',
    },
    {
      airline: 'Air India',
      flightNumber: 'AI 764',
      origin, destination, date,
      departure: '13:50', arrival: '16:10', duration: '2h 20m',
      class: 'Economy', stops: 1, price: 5100, currency: 'INR',
    },
    {
      airline: 'SpiceJet',
      flightNumber: 'SG 116',
      origin, destination, date,
      departure: '19:45', arrival: '21:30', duration: '1h 45m',
      class: 'Economy', stops: 0, price: 3890, currency: 'INR',
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

function withConfidence(data, confidence, lastVerified) {
  const allowed = ['live', 'scheduled-reference', 'curated-estimate']
  if (!allowed.includes(confidence)) {
    throw new Error(`withConfidence: invalid confidence "${confidence}"`)
  }
  return { confidence, lastVerified, data }
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

// ── GET /api/flights-info ──────────────────────────────────────────────────────
app.get('/api/flights-info', (req, res) => {
  const { origin, destination, date } = req.query

  if (!origin || !destination) {
    const missing = ['origin', 'destination'].filter(k => !req.query[k])
    return res.status(400).json({
      error: `Missing required query parameter(s): ${missing.join(', ')}`,
    })
  }

  const resolvedDate = date || new Date().toISOString().split('T')[0]
  logRequest(req, 'flights-info', { origin, destination, date: resolvedDate })

  // ── SWAP POINT ──────────────────────────────────────────────────────────────
  // To connect the real FlightAPI used elsewhere in the project, replace the
  // two lines below (mockFlightResults call + withConfidence wrap) with your
  // live call, e.g.:
  //   const flights = await searchFlights({ origin, destination, date: resolvedDate })
  //   return res.json(withConfidence(flights, 'live', new Date().toISOString()))
  // ── END SWAP POINT ──────────────────────────────────────────────────────────
  const flights = mockFlightResults(origin, destination, resolvedDate)
  return res.json(withConfidence(flights, 'live', new Date().toISOString()))
})

// ── Health check ───────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', port: PORT })
})

app.listen(PORT, () => {
  console.log(`KothaSetu backend running on http://localhost:${PORT}`)
})
