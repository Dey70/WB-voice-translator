export const ROUTE_ACCESS_TYPES = Object.freeze({
  ROAD: 'road_accessible',
  TREK: 'trek_only',
  ROAD_THEN_TREK: 'road_then_trek',
})

export const ROUTE_ACCESS_TYPE_VALUES = Object.freeze(Object.values(ROUTE_ACCESS_TYPES))

// West Bengal plus the app's existing Gangtok/Sikkim destination cluster.
export const ROUTE_COVERAGE_BOUNDS = Object.freeze({ south: 21.4, west: 85.8, north: 28.3, east: 89.95 })

// Explicit exceptions remain auditable until route metadata moves into each authoring record.
const ACCESS_TYPE_OVERRIDES = Object.freeze({
  buxa: ROUTE_ACCESS_TYPES.ROAD_THEN_TREK,
})

const toPoint = (value) => {
  if (!value) return null
  const lat = Number(value.lat ?? value.latitude)
  const lng = Number(value.lng ?? value.longitude)
  return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null
}

export function isPointInRouteCoverage(point) {
  const value = toPoint(point)
  return Boolean(value
    && value.lat >= ROUTE_COVERAGE_BOUNDS.south
    && value.lat <= ROUTE_COVERAGE_BOUNDS.north
    && value.lng >= ROUTE_COVERAGE_BOUNDS.west
    && value.lng <= ROUTE_COVERAGE_BOUNDS.east)
}

export function getRouteAccessType(spot) {
  const explicit = spot.route?.accessType ?? spot.accessType ?? ACCESS_TYPE_OVERRIDES[spot.id]
  if (ROUTE_ACCESS_TYPE_VALUES.includes(explicit)) return explicit
  if (spot.modes?.includes('trek')) return ROUTE_ACCESS_TYPES.TREK
  return ROUTE_ACCESS_TYPES.ROAD
}

export function buildRouteProfile(spot) {
  const accessType = getRouteAccessType(spot)
  const destination = toPoint(spot.route?.destination ?? spot.coordinates ?? spot)
  const trailhead = toPoint(spot.route?.trailhead)
  const errors = []

  if (destination && !isPointInRouteCoverage(destination)) errors.push('destination_outside_coverage')
  if (trailhead && !isPointInRouteCoverage(trailhead)) errors.push('trailhead_outside_coverage')

  const routeTarget = accessType === ROUTE_ACCESS_TYPES.ROAD_THEN_TREK ? trailhead : destination
  if (!routeTarget) errors.push(accessType === ROUTE_ACCESS_TYPES.ROAD_THEN_TREK ? 'missing_trailhead' : 'missing_destination_coordinates')

  return Object.freeze({
    accessType,
    destination,
    trailhead,
    routeTarget,
    canRequestLiveRoute: errors.length === 0 && accessType !== ROUTE_ACCESS_TYPES.TREK,
    errors: Object.freeze(errors),
  })
}
