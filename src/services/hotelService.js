const API_KEY = import.meta.env.VITE_LITEAPI_KEY
const BASE = 'https://api.liteapi.travel/v3.0'

export async function searchHotels({ city, checkin, checkout, guests = 2 }) {
  // Step 1 — get hotel list for city
  const hotelsRes = await fetch(
    `${BASE}/data/hotels?countryCode=IN&cityName=${encodeURIComponent(city)}&limit=10`,
    { headers: { 'X-API-Key': API_KEY } }
  )
  if (!hotelsRes.ok) throw new Error(`Hotels API ${hotelsRes.status}`)

  const hotelsData = await hotelsRes.json()
  const hotels = hotelsData?.data ?? hotelsData?.hotels ?? []
  if (!hotels.length) throw new Error('No hotels found in city')

  const hotelIds = hotels
    .map((h) => h.id ?? h.hotelId)
    .filter(Boolean)
    .slice(0, 10)

  // Step 2 — get rates
  const ratesRes = await fetch(`${BASE}/hotels/rates`, {
    method: 'POST',
    headers: { 'X-API-Key': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ hotelIds, checkin, checkout, adults: guests, currency: 'INR' }),
  })
  if (!ratesRes.ok) throw new Error(`Rates API ${ratesRes.status}`)

  const ratesData = await ratesRes.json()
  const rates = ratesData?.data ?? ratesData?.hotels ?? []

  const results = rates
    .filter((r) => r.minRate ?? r.price)
    .slice(0, 6)
    .map((r) => {
      const meta = hotels.find((h) => (h.id ?? h.hotelId) === (r.hotelId ?? r.id))
      return {
        name: r.name ?? meta?.name ?? 'Hotel',
        stars: r.starRating ?? r.stars ?? meta?.starRating ?? 3,
        pricePerNight: Math.round(r.minRate ?? r.price ?? 0),
        hotelId: r.hotelId ?? r.id ?? '',
        city,
      }
    })

  if (!results.length) throw new Error('No rates available')
  return results
}
