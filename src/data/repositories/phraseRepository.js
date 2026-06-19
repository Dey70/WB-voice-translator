import { PHRASE_CATEGORIES, TOURIST_PHRASES } from '../touristPhrases'
import { LOCATION_CONTEXTS, getNearestLocationContext } from '../locationContexts'

const PHRASE_BY_ID = new Map(TOURIST_PHRASES.map((phrase) => [phrase.id, phrase]))
const LOCATION_BY_ID = new Map(LOCATION_CONTEXTS.map((location) => [location.id, location]))

export { PHRASE_CATEGORIES, LOCATION_CONTEXTS, getNearestLocationContext }
export const getPhraseById = (id) => PHRASE_BY_ID.get(id) || null
export const getPhrasesByIds = (ids = []) => ids.map(getPhraseById).filter(Boolean)
export const getLocationContextById = (id) => LOCATION_BY_ID.get(id) || null
export const getLocationPhrases = (location) => getPhrasesByIds(location?.phraseIds)

export const queryPhrases = ({ category, query = '' }) => {
  const search = query.trim().toLocaleLowerCase()
  return TOURIST_PHRASES.filter((phrase) => phrase.category === category
    && (!search || [phrase.title, ...Object.values(phrase.translations)]
      .some((text) => text.toLocaleLowerCase().includes(search))))
}

export const matchPhrases = (group) => group.phraseIds
  ? getPhrasesByIds(group.phraseIds)
  : TOURIST_PHRASES.filter((phrase) => group.match?.(phrase.id))
