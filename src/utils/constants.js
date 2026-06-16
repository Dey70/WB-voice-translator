export const LANGUAGES = [
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    speechCode: 'bn-BD',
    flag: '🇧🇩',
    color: '#2dd4bf',
  },
  {
    code: 'ne',
    name: 'Nepali',
    nativeName: 'नेपाली',
    speechCode: 'ne-NP',
    flag: '🇳🇵',
    color: '#6c63ff',
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    speechCode: 'hi-IN',
    flag: '🇮🇳',
    color: '#f87171',
  },
]

export const getLanguage = (code) =>
  LANGUAGES.find((l) => l.code === code) || LANGUAGES[0]

export const getOtherLanguages = (code) =>
  LANGUAGES.filter((l) => l.code !== code)

export const TRANSLATION_MODES = [
  { id: 'voice-voice', label: 'Voice → Voice', icon: '🎙️' },
  { id: 'voice-text', label: 'Voice → Text', icon: '🎙️➡️📝' },
  { id: 'text-voice', label: 'Text → Voice', icon: '📝➡️🔊' },
  { id: 'text-text', label: 'Text → Text', icon: '📝' },
]
