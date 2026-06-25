import process from 'node:process'

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store, max-age=0')
  response.setHeader('Content-Type', 'application/json; charset=utf-8')

  if (request.method !== 'GET') {
    response.statusCode = 405
    return response.end(JSON.stringify({ error: 'Method not allowed.' }))
  }

  const key = process.env.VITE_SERPAPI_KEY || process.env.SERPAPI_KEY
  if (!key) {
    response.statusCode = 503
    return response.end(JSON.stringify({ error: 'Flight API key not configured.' }))
  }

  const { dep_iata, arr_iata, outbound_date, currency = 'INR', adults = '1', travel_class = '1' } = request.query ?? {}
  if (!dep_iata || !arr_iata) {
    response.statusCode = 400
    return response.end(JSON.stringify({ error: 'dep_iata and arr_iata are required.' }))
  }

  const params = new URLSearchParams({
    engine: 'google_flights',
    departure_id: dep_iata,
    arrival_id: arr_iata,
    outbound_date: outbound_date || new Date().toISOString().split('T')[0],
    currency,
    adults,
    travel_class,
    type: '2', // one-way
    api_key: key,
  })

  try {
    const upstream = await fetch(`https://serpapi.com/search?${params}`)
    const data = await upstream.json()
    if (!upstream.ok) {
      response.statusCode = upstream.status
      return response.end(JSON.stringify({ error: data.error ?? 'SerpAPI error' }))
    }
    response.statusCode = 200
    return response.end(JSON.stringify(data))
  } catch (err) {
    response.statusCode = 502
    return response.end(JSON.stringify({ error: 'Could not reach flight data provider.' }))
  }
}
