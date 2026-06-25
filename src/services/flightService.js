function calcDuration(minutes) {
  if (!minutes || minutes < 0) return '—'
  return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, '0')}m`
}

function formatTime(dateStr) {
  if (!dateStr) return '—'
  // SerpAPI returns "2024-06-25 06:30" or ISO strings
  const t = dateStr.slice(-5)
  return /^\d{2}:\d{2}$/.test(t) ? t : '—'
}

export async function searchFlights({ from, to, date, adults = 1, cabin = 'Economy' }) {
  const travelClass = { Economy: '1', 'Premium Economy': '2', Business: '3', First: '4' }[cabin] ?? '1'
  const params = new URLSearchParams({ dep_iata: from, arr_iata: to, adults: String(adults), travel_class: travelClass })
  if (date) params.set('outbound_date', date)

  // In local dev (localhost) always use same-origin to hit the Vite proxy.
  // In production, prefix with VITE_API_BASE_URL so Capacitor/Android can reach Vercel.
  const isLocal = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  const base = isLocal ? '' : (import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || '')
  const res = await fetch(`${base}/api/flights?${params}`)
  if (!res.ok) throw new Error(`Flight API ${res.status}`)

  const data = await res.json()
  if (data?.error) throw new Error(data.error)

  // SerpAPI nests results under best_flights and other_flights
  const allFlights = [
    ...(data.best_flights ?? []),
    ...(data.other_flights ?? []),
  ]

  if (!allFlights.length) throw new Error('No flights found')

  return allFlights.slice(0, 6).map((f) => {
    // Each SerpAPI flight can have multiple legs (f.flights array)
    const legs = f.flights ?? []
    const first = legs[0] ?? {}
    const last = legs[legs.length - 1] ?? first

    return {
      airline: first.airline ?? 'Airline',
      flightNo: first.flight_number ?? '—',
      depTime: formatTime(first.departure_airport?.time),
      arrTime: formatTime(last.arrival_airport?.time),
      duration: calcDuration(f.total_duration),
      stops: Math.max(0, legs.length - 1),
      price: f.price ?? null,
      bookingToken: f.booking_token ?? null,
    }
  })
}
