// Translation service with multiple fallbacks
// Primary: MyMemory API with explicit language pairs
// Fallback: MyMemory alternate endpoint

const MYMEMORY_URL = 'https://api.mymemory.translated.net/get'

// Language code mapping for MyMemory
const LANG_MAP = {
  bn: 'bn',
  hi: 'hi',
  ne: 'ne',
}

async function tryMyMemory(text, fromLang, toLang) {
  const from = LANG_MAP[fromLang] || fromLang
  const to = LANG_MAP[toLang] || toLang
  const langPair = from + '|' + to

  const url = MYMEMORY_URL + '?q=' + encodeURIComponent(text) + '&langpair=' + langPair + '&de=kothasetu@gmail.com'

  const res = await fetch(url)
  if (!res.ok) throw new Error('MyMemory HTTP ' + res.status)

  const data = await res.json()
  console.log('[KothaSetu] MyMemory response:', data.responseStatus, data.responseData)

  if (data.responseStatus !== 200) {
    throw new Error('MyMemory error: ' + data.responseDetails)
  }

  const result = data.responseData.translatedText

  // MyMemory sometimes returns the input unchanged or returns garbage
  // Detect this and throw so we can retry
  if (!result || result.trim() === text.trim()) {
    throw new Error('Translation returned unchanged text')
  }

  // Detect if result is in wrong language (very basic check)
  // If we asked for Hindi/Bengali/Nepali but got Latin script back, something is wrong
  const needsNonLatin = ['bn', 'hi', 'ne'].includes(toLang)
  const hasDevanagari = /[\u0900-\u097F]/.test(result)
  const hasBengali = /[\u0980-\u09FF]/.test(result)

  if (needsNonLatin && toLang === 'hi' && !hasDevanagari) {
    throw new Error('Hindi translation returned non-Devanagari text: ' + result)
  }
  if (needsNonLatin && toLang === 'bn' && !hasBengali) {
    throw new Error('Bengali translation returned non-Bengali text: ' + result)
  }

  return result
}

async function tryMyMemoryV2(text, fromLang, toLang) {
  // Use English as pivot language for better accuracy
  // bn -> en -> hi is more reliable than bn -> hi directly for short text
  const from = LANG_MAP[fromLang] || fromLang
  const to = LANG_MAP[toLang] || toLang

  // First translate to English
  const toEnUrl = MYMEMORY_URL + '?q=' + encodeURIComponent(text) + '&langpair=' + from + '|en'
  const toEnRes = await fetch(toEnUrl)
  const toEnData = await toEnRes.json()

  if (toEnData.responseStatus !== 200) throw new Error('Pivot step 1 failed')
  const english = toEnData.responseData.translatedText
  console.log('[KothaSetu] Pivot via English:', english)

  if (!english || english.trim() === text.trim()) throw new Error('Pivot step 1 returned unchanged')

  // Then translate English to target
  const toTargetUrl = MYMEMORY_URL + '?q=' + encodeURIComponent(english) + '&langpair=en|' + to
  const toTargetRes = await fetch(toTargetUrl)
  const toTargetData = await toTargetRes.json()

  if (toTargetData.responseStatus !== 200) throw new Error('Pivot step 2 failed')
  const result = toTargetData.responseData.translatedText

  if (!result) throw new Error('Pivot step 2 empty result')
  return result
}

export async function translateText(text, fromLang, toLang) {
  if (!text || !text.trim()) return ''
  if (fromLang === toLang) return text

  console.log('[KothaSetu] Translating:', fromLang, '->', toLang, ':', text.substring(0, 50))

  // Try direct translation first
  try {
    const result = await tryMyMemory(text, fromLang, toLang)
    console.log('[KothaSetu] Direct translation success:', result.substring(0, 50))
    return result
  } catch (err) {
    console.warn('[KothaSetu] Direct translation failed:', err.message)
  }

  // Fallback: pivot through English (more reliable for short/ambiguous text)
  try {
    const result = await tryMyMemoryV2(text, fromLang, toLang)
    console.log('[KothaSetu] Pivot translation success:', result.substring(0, 50))
    return result
  } catch (err) {
    console.warn('[KothaSetu] Pivot translation failed:', err.message)
    throw new Error('Translation failed. Please check your internet connection and try again.')
  }
}
