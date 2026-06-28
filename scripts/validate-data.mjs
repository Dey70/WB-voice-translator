import { TOURISM_DETAIL_TRANSLATIONS, TOURISM_REGIONS, TOURISM_SPOTS } from '../src/data/tourismSpots.js'
import { TOURISM_ENGLISH_DESCRIPTIONS, TOURISM_ENGLISH_DETAILS } from '../src/data/tourismEnglish.js'
import { HIDDEN_TOURISM_SPOTS } from '../src/data/hiddenTourismSpots.js'
import { REGIONAL_EXPANSION_SPOTS } from '../src/data/regionalExpansionSpots.js'
import { PHRASE_CATEGORIES, TOURIST_PHRASES } from '../src/data/touristPhrases.js'
import { LOCATION_CONTEXTS } from '../src/data/locationContexts.js'
import { EMERGENCY_CONTACTS, OFFICIAL_SITES } from '../src/data/emergencyResources.js'
import { EMERGENCY_CONTACT_SOURCES } from '../src/data/contentAudit.js'
import { buildRouteProfile, ROUTE_ACCESS_TYPE_VALUES } from '../src/data/routeAccess.js'

const LANGUAGES = ['en', 'bn', 'ne', 'hi']
const issues = []
const tourism = [...TOURISM_SPOTS, ...HIDDEN_TOURISM_SPOTS, ...REGIONAL_EXPANSION_SPOTS]
const regionIds = new Set(TOURISM_REGIONS.map((region) => region.id))
const categoryIds = new Set(PHRASE_CATEGORIES.map((category) => category.id))
const phraseIds = new Set(TOURIST_PHRASES.map((phrase) => phrase.id))

const reportDuplicateIds = (records, label) => {
  const seen = new Set()
  for (const record of records) {
    if (seen.has(record.id)) issues.push(`${label}: duplicate id "${record.id}"`)
    seen.add(record.id)
  }
}

reportDuplicateIds(tourism, 'tourism')
reportDuplicateIds(TOURIST_PHRASES, 'phrase')
reportDuplicateIds(LOCATION_CONTEXTS, 'location')
reportDuplicateIds(EMERGENCY_CONTACTS, 'emergency contact')
reportDuplicateIds(OFFICIAL_SITES, 'official site')

for (const spot of tourism) {
  const regions = spot.regions || [spot.region]
  if (!spot.id || !spot.name || !spot.type) issues.push(`tourism: ${spot.id || '<missing id>'} lacks a required field`)
  for (const region of regions) if (!regionIds.has(region)) issues.push(`tourism: ${spot.id} references unknown region "${region}"`)
  for (const language of ['bn', 'ne', 'hi']) {
    if (!spot.description?.[language]) issues.push(`tourism: ${spot.id} lacks ${language} description`)
  }
  if (!spot.description?.en && !TOURISM_ENGLISH_DESCRIPTIONS[spot.id]) issues.push(`tourism: ${spot.id} lacks English description`)
  const detailKey = spot.detailKey || spot.id
  const hasEnglishDetails = Boolean(TOURISM_ENGLISH_DETAILS[detailKey] || (spot.timing && spot.fee))
  const hasTranslatedDetails = Boolean(TOURISM_DETAIL_TRANSLATIONS[detailKey])
  if (!hasEnglishDetails) issues.push(`tourism: ${spot.id} lacks English timing/fee fallback`)
  if (!hasTranslatedDetails) issues.push(`tourism: ${spot.id} lacks translated timing/fee fallback for "${detailKey}"`)
  const route = buildRouteProfile(spot)
  if (!ROUTE_ACCESS_TYPE_VALUES.includes(route.accessType)) issues.push(`tourism: ${spot.id} has invalid route access type "${route.accessType}"`)
  if (route.errors.includes('destination_outside_coverage')) issues.push(`tourism: ${spot.id} has destination coordinates outside route coverage`)
  if (route.errors.includes('trailhead_outside_coverage')) issues.push(`tourism: ${spot.id} has trailhead coordinates outside route coverage`)
}

for (const phrase of TOURIST_PHRASES) {
  if (!categoryIds.has(phrase.category)) issues.push(`phrase: ${phrase.id} references unknown category "${phrase.category}"`)
  for (const language of LANGUAGES) if (!phrase.translations?.[language]) issues.push(`phrase: ${phrase.id} lacks ${language} translation`)
}

for (const location of LOCATION_CONTEXTS) {
  for (const phraseId of location.phraseIds) if (!phraseIds.has(phraseId)) issues.push(`location: ${location.id} references missing phrase "${phraseId}"`)
  for (const categoryId of location.categories) if (!categoryIds.has(categoryId)) issues.push(`location: ${location.id} references unknown category "${categoryId}"`)
}

for (const contact of EMERGENCY_CONTACTS) {
  if (!/^\+?[\d-]+$/.test(contact.number)) issues.push(`emergency contact: ${contact.id} has invalid number`)
  if (!EMERGENCY_CONTACT_SOURCES[contact.id]?.startsWith('https://')) issues.push(`emergency contact: ${contact.id} lacks HTTPS source`)
  for (const language of LANGUAGES) {
    if (!contact.name?.[language] || !contact.description?.[language]) issues.push(`emergency contact: ${contact.id} lacks ${language} content`)
  }
}

for (const site of OFFICIAL_SITES) if (!site.url.startsWith('https://')) issues.push(`official site: ${site.id} is not HTTPS`)

if (issues.length) {
  console.error(`Data validation failed with ${issues.length} issue(s):`)
  issues.forEach((issue) => console.error(`- ${issue}`))
  process.exit(1)
}

const routeReady = tourism.filter((spot) => buildRouteProfile(spot).canRequestLiveRoute).length
console.log(`Data validation passed: ${tourism.length} places, ${TOURIST_PHRASES.length} phrases, ${LOCATION_CONTEXTS.length} location contexts, ${EMERGENCY_CONTACTS.length} emergency contacts. Route-ready: ${routeReady}/${tourism.length}.`)
