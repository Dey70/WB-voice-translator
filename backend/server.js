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
      trainName: 'Howrah Rajdhani Express',
      trainNumber: '12301',
      origin, destination, date,
      departure: '16:55', arrival: '10:00+1', duration: '17h 05m',
      class: '3A', price: 1455, currency: 'INR', availability: 'AVAILABLE',
    },
    {
      trainName: 'Duronto Express',
      trainNumber: '12213',
      origin, destination, date,
      departure: '22:05', arrival: '14:20+1', duration: '16h 15m',
      class: '2A', price: 2185, currency: 'INR', availability: 'WL/4',
    },
    {
      trainName: 'Shatabdi Express',
      trainNumber: '12019',
      origin, destination, date,
      departure: '06:00', arrival: '13:30', duration: '7h 30m',
      class: 'CC', price: 895, currency: 'INR', availability: 'AVAILABLE',
    },
  ]
}

function mockBusResults(origin, destination, date) {
  return [
    {
      busOperator: 'Greenline Travels',
      busType: 'Volvo AC Sleeper',
      origin, destination, date,
      departure: '21:00', arrival: '06:30+1', duration: '9h 30m',
      price: 850, currency: 'INR', seatsAvailable: 12,
    },
    {
      busOperator: 'SBSTC',
      busType: 'Non-AC Seater',
      origin, destination, date,
      departure: '06:00', arrival: '14:45', duration: '8h 45m',
      price: 280, currency: 'INR', seatsAvailable: 34,
    },
    {
      busOperator: 'NueGo',
      busType: 'Electric AC Seater',
      origin, destination, date,
      departure: '08:30', arrival: '17:00', duration: '8h 30m',
      price: 620, currency: 'INR', seatsAvailable: 6,
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

function mockHotelResults(destination, date) {
  return [
    {
      hotelName: 'The Oberoi Grand',
      rating: 5,
      location: `${destination} City Centre`,
      checkIn: date, checkOut: date,
      pricePerNight: 12500, currency: 'INR',
      amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Airport Transfer'],
    },
    {
      hotelName: 'Taj Bengal',
      rating: 5,
      location: `${destination} Alipore`,
      checkIn: date, checkOut: date,
      pricePerNight: 10800, currency: 'INR',
      amenities: ['WiFi', 'Pool', 'Multiple Restaurants', 'Concierge'],
    },
    {
      hotelName: 'Ibis Styles',
      rating: 3,
      location: `${destination} Airport Area`,
      checkIn: date, checkOut: date,
      pricePerNight: 3200, currency: 'INR',
      amenities: ['WiFi', 'Restaurant', 'Gym'],
    },
  ]
}

// ── Fallback chain ─────────────────────────────────────────────────────────────

async function primarySearch({ origin, destination, mode, date, simulateFailure }) {
  if (simulateFailure) {
    throw new Error('primarySearch: simulated failure via ?simulateFailure=true')
  }
  switch (mode) {
    case 'train':  return mockTrainResults(origin, destination, date)
    case 'bus':    return mockBusResults(origin, destination, date)
    case 'flight': return mockFlightResults(origin, destination, date)
    case 'hotel':  return mockHotelResults(destination, date)
  }
}

async function fallbackSearch({ origin, destination, mode, date, simulateFallbackFailure }) {
  if (simulateFallbackFailure) {
    throw new Error('fallbackSearch: simulated failure via ?simulateFallbackFailure=true')
  }
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
  const { origin, destination, mode, date } = req.body
  const simulateFailure = req.query.simulateFailure === 'true'
  const simulateFallbackFailure = req.query.simulateFallbackFailure === 'true'

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
    simulateFallbackFailure,
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

// ── Health check ───────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', port: PORT })
})

app.listen(PORT, () => {
  console.log(`KothaSetu backend running on http://localhost:${PORT}`)
})
