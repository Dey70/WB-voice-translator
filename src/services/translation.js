const AZURE_KEY = import.meta.env.VITE_AZURE_TRANSLATOR_KEY
const AZURE_REGION = import.meta.env.VITE_AZURE_TRANSLATOR_REGION
const AZURE_ENDPOINT = 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0'

// Map our lang codes to Azure codes
const AZURE_LANG_MAP = {
  bn: 'bn',
  hi: 'hi',
  ne: 'ne',
}

export async function translateText(text, fromLang, toLang) {
  if (!text || !text.trim()) return ''
  if (fromLang === toLang) return text

  if (!AZURE_KEY) {
    console.error('[KothaSetu] Azure key missing')
    return 'Error: API Key missing. Check your .env file.'
  }

  const from = AZURE_LANG_MAP[fromLang] || fromLang
  const to = AZURE_LANG_MAP[toLang] || toLang

  // Fix 3: Add textType=plain and request formal/polite register
  // Azure Translator supports profanityAction and textType params
  const url = AZURE_ENDPOINT +
    '&from=' + from +
    '&to=' + to +
    '&textType=plain'

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': AZURE_KEY,
        'Ocp-Apim-Subscription-Region': AZURE_REGION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{ text: text.trim() }]),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('[KothaSetu] Azure API error:', response.status, errorData)
      throw new Error('HTTP ' + response.status)
    }

    const data = await response.json()
    const result = data[0]?.translations?.[0]?.text

    if (!result) throw new Error('Empty response from Azure')

    return result
  } catch (error) {
    console.error('[KothaSetu] Translation error:', error)
    throw new Error('Translation failed. Please check your connection.')
  }
}
