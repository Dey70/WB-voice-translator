import { TOURISM_DETAIL_TRANSLATIONS, TOURISM_REGIONS, TOURISM_SPOTS } from '../tourismSpots'
import { TOURISM_ENGLISH_DESCRIPTIONS, TOURISM_ENGLISH_DETAILS } from '../tourismEnglish'
import { HIDDEN_TOURISM_SPOTS } from '../hiddenTourismSpots'
import { REGIONAL_EXPANSION_SPOTS } from '../regionalExpansionSpots'
import { getPlaceCategory, REGION_NAMES } from '../tourismLocale'
import { getTourismPlaceName } from '../tourismPlaceNames'
import { TOURISM_OFFICIAL_SOURCES } from '../contentAudit'

const DEFAULT_DETAILS = {
  timing: 'Confirm current access and opening conditions before travel',
  fee: 'Confirm current entry, permit, guide, and activity charges',
}

const normalizeSpot = (spot) => Object.freeze({
  ...spot,
  regions: Object.freeze([...(spot.regions || [spot.region])]),
  primaryRegion: spot.region,
  access: spot.access || 'local',
  isHidden: Boolean(spot.isHidden),
  category: getPlaceCategory(spot.type),
  detailKey: spot.detailKey || spot.id,
})

export const TOURISM_CATALOG = Object.freeze([
  ...TOURISM_SPOTS,
  ...HIDDEN_TOURISM_SPOTS,
  ...REGIONAL_EXPANSION_SPOTS,
].map(normalizeSpot))

export const TOURISM_REGION_IDS = Object.freeze(TOURISM_REGIONS.map((region) => region.id))
const SPOT_BY_ID = new Map(TOURISM_CATALOG.map((spot) => [spot.id, spot]))

const localizedValue = (value, language, fallback) => {
  if (typeof value === 'string') return value
  return value?.[language] || value?.en || fallback
}

export const getTourismSpotById = (id) => SPOT_BY_ID.get(id) || null

export const getTourismRegionOptions = (language = 'en') => TOURISM_REGIONS.map((region) => ({
  id: region.id,
  name: REGION_NAMES[region.id]?.[language] || region.name,
}))

export const getTourismSpotView = (spot, language = 'en') => {
  const englishDetails = TOURISM_ENGLISH_DETAILS[spot.detailKey]
    || { timing: spot.timing, fee: spot.fee }
    || DEFAULT_DETAILS
  const translatedDetails = TOURISM_DETAIL_TRANSLATIONS[spot.detailKey]

  return {
    ...spot,
    name: getTourismPlaceName(spot, language),
    regionName: REGION_NAMES[spot.primaryRegion]?.[language] || spot.primaryRegion,
    description: language === 'en'
      ? (spot.description?.en || TOURISM_ENGLISH_DESCRIPTIONS[spot.id] || '')
      : (spot.description?.[language] || spot.description?.en || TOURISM_ENGLISH_DESCRIPTIONS[spot.id] || ''),
    timing: language === 'en'
      ? localizedValue(englishDetails?.timing, 'en', DEFAULT_DETAILS.timing)
      : localizedValue(translatedDetails?.timing, language, localizedValue(englishDetails?.timing, 'en', DEFAULT_DETAILS.timing)),
    fee: language === 'en'
      ? localizedValue(englishDetails?.fee, 'en', DEFAULT_DETAILS.fee)
      : localizedValue(translatedDetails?.fee, language, localizedValue(englishDetails?.fee, 'en', DEFAULT_DETAILS.fee)),
    sourceUrl: TOURISM_OFFICIAL_SOURCES[spot.primaryRegion] || TOURISM_OFFICIAL_SOURCES.default,
    mapDestination: `${spot.name}, ${spot.locality || spot.primaryRegion}, India`,
  }
}

export const getAvailableTourismCategories = (region) => [...new Set(
  TOURISM_CATALOG.filter((spot) => spot.regions.includes(region)).map((spot) => spot.category),
)]

export const queryTourismSpots = ({ region, language = 'en', discovery = 'all', access = 'all', category = 'all', query = '' }) => {
  const search = query.trim().toLocaleLowerCase()
  return TOURISM_CATALOG.filter((spot) => spot.regions.includes(region)
    && (discovery === 'all' || (discovery === 'hidden' ? spot.isHidden : !spot.isHidden))
    && (access === 'all' || (access === 'local' ? spot.access === 'local' : spot.access === access))
    && (category === 'all' || spot.category === category))
    .map((spot) => getTourismSpotView(spot, language))
    .filter((spot) => !search || [spot.name, spot.type, spot.description, spot.locality]
      .filter(Boolean)
      .some((value) => value.toLocaleLowerCase().includes(search)))
}
