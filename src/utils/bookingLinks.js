const slug = (s) => s.toLowerCase().replace(/\s+/g, '-')

const fmtMMT = (iso) => {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

const fmtRedBus = (iso) => {
  const [y, m, d] = iso.split('-')
  return `${d}-${m}-${y}`
}

const fmtIxigo = (iso) => {
  // YYYY-MM-DD → DDMMYYYY
  const [y, m, d] = iso.split('-')
  return `${d}${m}${y}`
}

export function buildFlightLink({ from, to, date, returnDate, passengers = 1, cabinClass, tripType }) {
  const depCode = (from || '').trim().toUpperCase()
  const arrCode = (to || '').trim().toUpperCase()
  const depDate = fmtIxigo(date || new Date().toISOString().split('T')[0])
  const pax = Math.max(1, parseInt(passengers) || 1)
  const cls = cabinClass === 'Business' ? 'b' : 'e'
  const isRound = tripType === 'Round Trip' && returnDate

  let url = `https://www.ixigo.com/search/result/flight?from=${depCode}&to=${arrCode}&date=${depDate}&adults=${pax}&children=0&infants=0&class=${cls}`
  if (isRound) url += `&tripType=R&returnDate=${fmtIxigo(returnDate)}`
  url += `&source=Search+Form`
  return url
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
