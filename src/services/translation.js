// MyMemory API â€” free, no key needed for basic use (1000 req/day)
const MYMEMORY_URL = 'https://api.mymemory.translated.net/get'

export async function translateText(text, fromLang, toLang) {
  if (!text || !text.trim()) return ''
  if (fromLang === toLang) return text

  try {
    const langPair = fromLang + '|' + toLang
    const url = MYMEMORY_URL + '?q=' + encodeURIComponent(text) + '&langpair=' + langPair
    const res = await fetch(url)
    const data = await res.json()

    if (data.responseStatus === 200) {
      return data.responseData.translatedText
    }
    throw new Error(data.responseDetails || 'Translation failed')
  } catch (err) {
    console.error('Translation error:', err)
    throw err
  }
}

