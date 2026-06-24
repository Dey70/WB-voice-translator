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

export function buildFlightLink({ from, to, date, returnDate, passengers, cabinClass, tripType }) {
  const type = tripType === 'Round Trip' ? 'R' : 'O'
  const cls = CABIN_MAP[cabinClass] ?? 'E'
  let itinerary = `${from.trim().toUpperCase()}-${to.trim().toUpperCase()}-${fmtMMT(date)}`
  if (tripType === 'Round Trip' && returnDate) itinerary += `-${fmtMMT(returnDate)}`
  return `https://www.makemytrip.com/flights/search?tripType=${type}&itinerary=${itinerary}&paxType=A-${passengers}_C-0_I-0&cabinClass=${cls}&lang=eng`
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
