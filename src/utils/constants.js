export const LANGUAGES = [
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    speechCode: 'bn-BD',
    label: 'BN',
    color: '#2dd4bf',
  },
  {
    code: 'ne',
    name: 'Nepali',
    nativeName: 'नेपाली',
    speechCode: 'ne-NP',
    label: 'NE',
    color: '#6c63ff',
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    speechCode: 'hi-IN',
    label: 'HI',
    color: '#f87171',
  },
]

export const getLanguage = (code) =>
  LANGUAGES.find((l) => l.code === code) || LANGUAGES[0]

export const getOtherLanguages = (code) =>
  LANGUAGES.filter((l) => l.code !== code)
