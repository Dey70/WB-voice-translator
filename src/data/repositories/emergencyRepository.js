import { EMERGENCY_CONTACTS, OFFICIAL_SITES } from '../emergencyResources'
import { EMERGENCY_CONTACT_SOURCES } from '../contentAudit'

export const getEmergencyContacts = (scope) => EMERGENCY_CONTACTS
  .filter((contact) => contact.scope === scope)
  .map((contact) => ({ ...contact, sourceUrl: EMERGENCY_CONTACT_SOURCES[contact.id] }))

export const getOfficialSites = (scope) => OFFICIAL_SITES.filter((site) => site.scope === scope)
