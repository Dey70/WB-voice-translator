export const LOCATION_CONTEXTS = [
  {
    id: 'kolkata', name: 'Kolkata', region: 'West Bengal', latitude: 22.5726, longitude: 88.3639,
    primaryLanguage: 'bn',
    note: 'Bengali is most useful locally. Keep transport, food, and shopping phrases ready for markets, taxis, and public transit.',
    categories: ['transport', 'food', 'shopping'],
    phraseIds: ['taxi', 'fare', 'station', 'menu', 'how-much', 'hospital'],
  },
  {
    id: 'darjeeling', name: 'Darjeeling', region: 'West Bengal Hills', latitude: 27.041, longitude: 88.2663,
    primaryLanguage: 'ne',
    note: 'Nepali is widely useful in the hills. Shared jeeps, changing road conditions, cool weather, and hotel heating are common travel contexts.',
    categories: ['transport', 'stays', 'sightseeing'],
    phraseIds: ['shared-jeep', 'road-open', 'hot-water', 'guide-available', 'safe-today', 'mobile-signal'],
  },
  {
    id: 'kalimpong', name: 'Kalimpong', region: 'West Bengal Hills', latitude: 27.0594, longitude: 88.4695,
    primaryLanguage: 'ne',
    note: 'Nepali is a practical first choice. Hill transport, local directions, mobile connectivity, and accommodation phrases are especially useful.',
    categories: ['transport', 'sightseeing', 'stays'],
    phraseIds: ['shared-jeep', 'next-vehicle', 'road-open', 'directions-viewpoint', 'room-available', 'mobile-signal'],
  },
  {
    id: 'siliguri', name: 'Siliguri', region: 'North Bengal', latitude: 26.7271, longitude: 88.3953,
    primaryLanguage: 'bn',
    note: 'This is a major transit hub for the hills and Dooars. Bengali and Hindi are both useful; keep onward transport phrases close.',
    categories: ['transport', 'essentials', 'stays'],
    phraseIds: ['shared-jeep', 'bus-stop', 'next-vehicle', 'ticket', 'atm', 'room-available'],
  },
  {
    id: 'dooars', name: 'Dooars', region: 'North Bengal', latitude: 26.704, longitude: 89.145,
    primaryLanguage: 'bn',
    note: 'Bengali is a useful first choice. Confirm park access, guide arrangements, transport timing, and local safety information before setting out.',
    categories: ['sightseeing', 'transport', 'essentials'],
    phraseIds: ['guide-available', 'safe-today', 'closing-time', 'next-vehicle', 'water', 'mobile-signal'],
  },
  {
    id: 'sundarbans', name: 'Sundarbans', region: 'South Bengal', latitude: 21.9497, longitude: 88.9417,
    primaryLanguage: 'bn',
    note: 'Bengali is the key local language. Boat, guide, drinking-water, weather, and medical-access questions are important in remote areas.',
    categories: ['sightseeing', 'transport', 'emergency'],
    phraseIds: ['guide-available', 'safe-today', 'water', 'ticket', 'doctor', 'hospital'],
  },
  {
    id: 'digha', name: 'Digha', region: 'Coastal West Bengal', latitude: 21.6265, longitude: 87.5074,
    primaryLanguage: 'bn',
    note: 'Bengali is most useful. Hotel, food, local transport, shopping, and beach-safety questions cover most visitor needs.',
    categories: ['stays', 'food', 'shopping'],
    phraseIds: ['room-available', 'price-per-night', 'menu', 'bill', 'how-much', 'safe-today'],
  },
  {
    id: 'gangtok', name: 'Gangtok', region: 'Sikkim', latitude: 27.3389, longitude: 88.6065,
    primaryLanguage: 'ne',
    note: 'Nepali is widely useful. Ask about permits, shared transport, road conditions, and altitude-related health before visiting restricted or high-altitude areas.',
    categories: ['sightseeing', 'transport', 'emergency'],
    phraseIds: ['permit-needed', 'permit-office', 'shared-jeep', 'road-open', 'safe-today', 'emergency-have-altitude'],
  },
]

const toRadians = (degrees) => degrees * Math.PI / 180

const distanceInKm = (lat1, lon1, lat2, lon2) => {
  const earthRadius = 6371
  const latDistance = toRadians(lat2 - lat1)
  const lonDistance = toRadians(lon2 - lon1)
  const a = Math.sin(latDistance / 2) ** 2
    + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(lonDistance / 2) ** 2
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function getNearestLocationContext(latitude, longitude) {
  const matches = LOCATION_CONTEXTS.map((location) => ({
    location,
    distance: distanceInKm(latitude, longitude, location.latitude, location.longitude),
  })).sort((a, b) => a.distance - b.distance)

  return matches[0]?.distance <= 180 ? matches[0].location : null
}
