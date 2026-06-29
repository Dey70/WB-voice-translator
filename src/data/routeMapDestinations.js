export const ROUTE_MAP_DESTINATIONS = Object.freeze([
  {
    id: 'darjeeling-town',
    name: 'Darjeeling town',
    district: 'Darjeeling',
    coordinates: { lat: 27.041, lng: 88.2663 },
    modes: ['drive'],
    nearest: 'Darjeeling town centre',
    bestTime: 'October to December and March to May',
    stay: 'Hotels and homestays are available across town',
    permit: 'No general entry permit; confirm current road conditions before travel',
  },
  {
    id: 'sandakphu',
    name: 'Sandakphu',
    district: 'Darjeeling',
    coordinates: { lat: 27.1054, lng: 88.0017 },
    modes: ['trek'],
    nearest: 'Manebhanjan trailhead',
    bestTime: 'March to May and October to early December, weather permitting',
    stay: 'Book a registered trekker hut or homestay before departure',
    permit: 'Singalila National Park entry and local guide requirements must be confirmed before travel',
  },
  {
    id: 'kalimpong-town',
    name: 'Kalimpong town',
    district: 'Kalimpong',
    coordinates: { lat: 27.0594, lng: 88.4695 },
    modes: ['drive'],
    nearest: 'Kalimpong town centre',
    bestTime: 'October to May',
    stay: 'Hotels and homestays are available in town',
    permit: 'No general entry permit; confirm current hill-road conditions',
  },
  {
    id: 'kurseong', name: 'Kurseong', district: 'Darjeeling',
    coordinates: { lat: 26.8821, lng: 88.2789 }, modes: ['drive'],
    nearest: 'Kurseong town centre', bestTime: 'October to May',
    stay: 'Hotels and homestays are available in town', permit: 'No general entry permit; confirm current hill-road conditions',
  },
  {
    id: 'mirik', name: 'Mirik', district: 'Darjeeling',
    coordinates: { lat: 26.8872, lng: 88.1847 }, modes: ['drive'],
    nearest: 'Mirik Lake and town centre', bestTime: 'October to May',
    stay: 'Hotels and homestays are available around Mirik', permit: 'No general entry permit; confirm current hill-road conditions',
  },
  {
    id: 'lava', name: 'Lava', district: 'Kalimpong',
    coordinates: { lat: 27.0864, lng: 88.6571 }, modes: ['drive'],
    nearest: 'Lava bazaar', bestTime: 'October to May, weather permitting',
    stay: 'Homestays and small lodges are available', permit: 'Confirm forest access and current road conditions',
  },
  {
    id: 'gorumara', name: 'Gorumara National Park', district: 'Jalpaiguri',
    coordinates: { lat: 26.7076, lng: 88.8004 }, modes: ['drive'],
    nearest: 'Lataguri', bestTime: 'November to April, subject to forest opening dates',
    stay: 'Resorts and lodges are available around Lataguri', permit: 'Safari and forest-entry bookings must be confirmed separately',
  },
])

export function destinationAccessType(destination) {
  return destination.modes.includes('trek') ? 'trek_only' : 'road_accessible'
}
