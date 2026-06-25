const slug = (s) => s.toLowerCase().replace(/\s+/g, '-')

const fmtMMT = (iso) => {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

const fmtRedBus = (iso) => {
  const [y, m, d] = iso.split('-')
  return `${d}-${m}-${y}`
}

export function buildFlightLink({ from, to, date, returnDate, passengers = 1, tripType }) {
  const depCode = (from || '').trim().toUpperCase()
  const arrCode = (to || '').trim().toUpperCase()
  // Ixigo uses YYYY-MM-DD format directly
  const depDate = date || new Date().toISOString().split('T')[0]
  const retDate = returnDate || ''
  const pax = Math.max(1, parseInt(passengers) || 1)
  const isRound = tripType === 'Round Trip' && retDate

  if (isRound) {
    return `https://www.ixigo.com/search/result/flight/${depCode}/${arrCode}/${depDate}/${retDate}/${pax}/0/0/R/ECONOMY/1`
  }
  return `https://www.ixigo.com/search/result/flight/${depCode}/${arrCode}/${depDate}/null/${pax}/0/0/O/ECONOMY/1`
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
