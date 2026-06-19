export const CONTENT_AUDIT_DATE = '2026-06-19'
export const CONTENT_AUDIT_DATE_LABEL = '19 June 2026'

export const CONTENT_AUDITS = {
  emergency: {
    status: 'source-check-required',
    reviewEveryDays: 30,
    summary: 'Emergency records were inventoried, but live official-source verification could not be completed during this audit.',
  },
  tourism: {
    status: 'variable-information',
    reviewEveryDays: 90,
    summary: 'Timings, fees, permits, closures, road access, and operator charges are indicative and must be checked before travel.',
  },
  seasonal: {
    status: 'planning-guidance',
    reviewEveryDays: 180,
    summary: 'Seasonal ratings describe broad historical patterns and are not weather, road, tide, ferry, or forest forecasts.',
  },
}

export const EMERGENCY_CONTACT_SOURCES = {
  erss: 'https://112.gov.in',
  tourist: 'https://www.incredibleindia.gov.in',
  cyber: 'https://cybercrime.gov.in',
  child: 'https://www.spniwcd.wcd.gov.in',
  'wb-disaster': 'https://wbdmd.gov.in',
  'district-disaster': 'https://wbdmd.gov.in',
  'police-legacy': 'https://wbpolice.gov.in',
  'fire-legacy': 'https://wbfes.gov.in',
  'ambulance-legacy': 'https://www.wbhealth.gov.in',
  'women-legacy': 'https://wbpolice.gov.in',
}

export const TOURISM_OFFICIAL_SOURCES = {
  default: 'https://wbtourism.gov.in',
  sikkim: 'https://sikkimtourism.gov.in',
}

export const LIVE_CONDITION_SOURCES = {
  weather: 'https://mausam.imd.gov.in',
  westBengalTourism: 'https://wbtourism.gov.in',
  sikkimTourism: 'https://sikkimtourism.gov.in',
}
