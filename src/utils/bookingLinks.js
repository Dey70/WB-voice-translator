const slug = (s) => s.toLowerCase().replace(/\s+/g, '-')

const fmtMMT = (iso) => {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

const fmtRedBus = (iso) => {
  const [y, m, d] = iso.split('-')
  return `${d}-${m}-${y}`
}

const CABIN_MAP = { Economy: 'E', 'Premium Economy': 'PE', Business: 'B' }

export function buildFlightLink({ from, to, date, returnDate, passengers = 1, cabinClass, tripType }) {
  const type = tripType === 'Round Trip' ? 'R' : 'O'
  const cls = CABIN_MAP[cabinClass] ?? 'E'
  const depCode = (from || '').trim().toUpperCase()
  const arrCode = (to || '').trim().toUpperCase()
  const depDate = date ? fmtMMT(date) : fmtMMT(new Date().toISOString().split('T')[0])
  let itinerary = `${depCode}-${arrCode}-${depDate}`
  if (type === 'R' && returnDate) itinerary += `-${fmtMMT(returnDate)}`
  const pax = Math.max(1, parseInt(passengers) || 1)
  // MMT requires slashes in dates to be encoded
  return `https://www.makemytrip.com/flights/search?tripType=${type}&itinerary=${encodeURIComponent(itinerary)}&paxType=A-${pax}_C-0_I-0&cabinClass=${cls}&lang=eng`
}

export function buildTrainLink() {
  return 'https://www.irctc.co.in/nget/train-search'
}

export function buildBusLink({ from, to, date }) {
  return `https://www.redbus.in/bus-tickets/${slug(from)}-to-${slug(to)}?date=${fmtRedBus(date)}`
}

export function buildHotelLink({ city, checkIn, checkOut, guests, rooms }) {
  return `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(city)}&checkin=${checkIn}&checkout=${checkOut}&group_adults=${guests}&no_rooms=${rooms}`
}
