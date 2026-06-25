const API_KEY = import.meta.env.VITE_FLIGHTAPI_KEY

function toApiDate(iso) {
  const [y, m, d] = iso.split('-')
  return `${d}${m}${y}`
}

export async function searchFlights({ from, to, date, adults = 1, cabin = 'Economy' }) {
  const apiDate = toApiDate(date)
  const url = `https://api.flightapi.io/oneway/${API_KEY}/${from}/${to}/${apiDate}/${adults}/${cabin}`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Flight API ${res.status}`)

  const data = await res.json()

  // flightapi.io can return { fares: [...] } or { legs: [...], fares: [...] }
  const fares = Array.isArray(data) ? data : (data?.fares ?? data?.data ?? [])
  if (!fares.length) throw new Error('No flights found')

  return fares.slice(0, 6).map((fare) => {
    const leg = fare.legs?.[0] ?? fare.leg ?? {}
    const raw = fare.price?.total ?? fare.price ?? fare.totalPrice ?? 0
    const currency = fare.price?.currency ?? fare.currency ?? 'USD'
    const priceINR = currency === 'INR' ? Math.round(raw) : Math.round(raw * 84)
    const carrier = leg.carrier?.name ?? leg.airline ?? leg.flightInfo?.carrierCode ?? 'Airline'
    const flightNo = leg.flightInfo
      ? `${leg.flightInfo.carrierCode ?? ''}${leg.flightInfo.flightNumber ?? ''}`.trim()
      : (leg.flightNumber ?? '—')
    const depTime = (leg.departureTime ?? leg.departure ?? '').slice(11, 16) || '—'
    const arrTime = (leg.arrivalTime ?? leg.arrival ?? '').slice(11, 16) || '—'
    const mins = leg.duration ?? leg.durationMinutes ?? 0
    const duration = mins ? `${Math.floor(mins / 60)}h ${mins % 60}m` : '—'
    return {
      airline: carrier,
      flightNo,
      depTime,
      arrTime,
      duration,
      stops: leg.stopCount ?? leg.stops ?? 0,
      price: priceINR,
    }
  })
}
