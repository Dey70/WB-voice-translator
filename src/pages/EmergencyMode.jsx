import { useMemo, useState } from 'react'
import { AlertCircle, ArrowLeftRight, Copy, ExternalLink, Globe2, Phone, PhoneCall, ShieldAlert, Volume2, VolumeX } from 'lucide-react'
import LanguageSelector from '../components/translation/LanguageSelector'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'
import { getLanguage } from '../utils/constants'
import { TOURIST_PHRASES } from '../data/touristPhrases'
import { EMERGENCY_CONTACTS, EMERGENCY_RESOURCE_LOCALE, OFFICIAL_SITES } from '../data/emergencyResources'

const GROUPS = [
  { id: 'urgent', name: 'Urgent help', phraseIds: ['help', 'police', 'ambulance', 'doctor', 'hospital', 'pain', 'lost', 'passport'] },
  { id: 'medical', name: 'Medical', match: (id) => id.startsWith('emergency-have-') || id.startsWith('emergency-medicine-') },
  { id: 'lost', name: 'Lost items', match: (id) => id.startsWith('emergency-lost-') || id.startsWith('emergency-find-') || id === 'passport' },
  { id: 'safety', name: 'Safety', phraseIds: ['help', 'police', 'ambulance', 'hospital', 'safe-today', 'road-open', 'mobile-signal', 'do-not-understand', 'speak-slowly'] },
]

const phrasesForGroup = (group) => group.phraseIds
  ? group.phraseIds.map((id) => TOURIST_PHRASES.find((phrase) => phrase.id === id)).filter(Boolean)
  : TOURIST_PHRASES.filter((phrase) => group.match?.(phrase.id))

export default function EmergencyMode() {
  const [fromLang, setFromLang] = useState('hi')
  const [toLang, setToLang] = useState('bn')
  const [groupId, setGroupId] = useState('urgent')
  const [selectedId, setSelectedId] = useState('help')
  const [copied, setCopied] = useState(false)
  const [resourceScope, setResourceScope] = useState('india')
  const { speak, stop, isSpeaking, isPreparing, noVoiceAvailable } = useSpeechSynthesis()

  const from = getLanguage(fromLang)
  const to = getLanguage(toLang)
  const group = GROUPS.find((item) => item.id === groupId) || GROUPS[0]
  const phrases = useMemo(() => phrasesForGroup(group), [group])
  const selected = TOURIST_PHRASES.find((phrase) => phrase.id === selectedId) || phrases[0]
  const resourceCopy = EMERGENCY_RESOURCE_LOCALE[fromLang]
  const contacts = EMERGENCY_CONTACTS.filter((item) => item.scope === resourceScope)
  const sites = OFFICIAL_SITES.filter((item) => item.scope === resourceScope)

  const playPhrase = (phrase) => {
    setSelectedId(phrase.id)
    speak(phrase.translations[toLang], toLang)
  }

  const swapLanguages = () => {
    setFromLang(toLang)
    setToLang(fromLang)
    stop()
  }

  const copyTranslation = async () => {
    if (!selected) return
    await navigator.clipboard.writeText(selected.translations[toLang])
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <main className="emergency-page">
      <header className="emergency-header">
        <div className="emergency-title">
          <span><ShieldAlert size={17} /> Emergency communication</span>
          <h1>Emergency Mode</h1>
          <p>Tap the message you need. The translated phrase will fill the screen and play aloud.</p>
        </div>
        <a className="emergency-call" href="tel:112" aria-label="Call 112 emergency services in India">
          <Phone size={21} />
          <span><strong>Call 112</strong><small>India emergency services</small></span>
        </a>
      </header>

      <div className="emergency-caution">
        If someone is in immediate danger, contact emergency services first. Translation can help communication but does not replace professional medical or safety advice.
      </div>

      <section className="emergency-languages" aria-label="Emergency phrase languages">
        <div>
          <span>You speak</span>
          <LanguageSelector value={fromLang} onChange={(value) => {
            setFromLang(value)
            if (value === toLang) setToLang(fromLang)
          }} />
        </div>
        <button onClick={swapLanguages} aria-label="Swap emergency languages"><ArrowLeftRight size={18} /></button>
        <div>
          <span>Local language</span>
          <LanguageSelector value={toLang} onChange={setToLang} exclude={fromLang} />
        </div>
      </section>

      <section className="emergency-directory" aria-label={resourceCopy.directory}>
        <div className="emergency-section-heading">
          <div><PhoneCall size={18} /><span><strong>{resourceCopy.directory}</strong><small>{resourceCopy.directoryText}</small></span></div>
          <div className="emergency-scope-switch">
            <button className={resourceScope === 'india' ? 'active' : ''} onClick={() => setResourceScope('india')}>{resourceCopy.india}</button>
            <button className={resourceScope === 'wb' ? 'active' : ''} onClick={() => setResourceScope('wb')}>{resourceCopy.westBengal}</button>
          </div>
        </div>
        <div className="emergency-contact-grid">
          {contacts.map((contact) => (
            <article key={contact.id} className={`emergency-contact level-${contact.level}`}>
              <div><span className="emergency-level">{resourceCopy[contact.level]}</span><h3>{contact.name[fromLang]}</h3><p>{contact.description[fromLang]}</p>{contact.alternate && <small>{contact.alternate}</small>}</div>
              <a href={`tel:${contact.number}`} aria-label={`${resourceCopy.call} ${contact.number}`}><Phone size={15} /><strong>{contact.number}</strong><span>{resourceCopy.call}</span></a>
            </article>
          ))}
        </div>
        <p className="emergency-availability"><AlertCircle size={13} /> {resourceCopy.availability}</p>
      </section>

      {selected && (
        <section className="emergency-display" aria-live="assertive">
          <div className="emergency-display-label">
            <span style={{ color: from.color }}>{from.name}</span><span>{selected.title}</span>
          </div>
          <p className="emergency-source">{selected.translations[fromLang]}</p>
          <div className="emergency-divider" />
          <div className="emergency-display-label">
            <span style={{ color: to.color }}>{to.name}</span><span>Show this message or play it aloud</span>
          </div>
          <p className="emergency-target">{selected.translations[toLang]}</p>
          <div className="emergency-actions">
            <button className="emergency-speak" onClick={() => (isSpeaking || isPreparing) ? stop() : speak(selected.translations[toLang], toLang)}>
              {isSpeaking || isPreparing ? <VolumeX size={20} /> : <Volume2 size={20} />}{isPreparing ? 'Preparing voice...' : isSpeaking ? 'Stop speaking' : 'Speak loudly'}
            </button>
            <button onClick={copyTranslation}><Copy size={17} /> {copied ? 'Copied' : 'Copy'}</button>
          </div>
          {noVoiceAvailable && <p className="speech-unavailable" role="alert">Voice playback is unavailable for {to.name} on this device. Show or copy the translated text instead.</p>}
        </section>
      )}

      <div className="emergency-groups" role="tablist" aria-label="Emergency phrase groups">
        {GROUPS.map((item) => (
          <button key={item.id} role="tab" aria-selected={groupId === item.id} className={groupId === item.id ? 'active' : ''} onClick={() => {
            setGroupId(item.id)
            const next = phrasesForGroup(item)[0]
            if (next) setSelectedId(next.id)
          }}>{item.name}</button>
        ))}
      </div>

      <section className="emergency-phrase-grid">
        {phrases.map((phrase) => (
          <button key={phrase.id} className={selected?.id === phrase.id ? 'selected' : ''} onClick={() => playPhrase(phrase)}>
            <span>{phrase.title}</span><strong>{phrase.translations[toLang]}</strong><Volume2 size={17} />
          </button>
        ))}
      </section>

      <section className="emergency-sites">
        <div className="emergency-section-heading">
          <div><Globe2 size={18} /><span><strong>{resourceCopy.sites}</strong><small>{resourceCopy.sitesText}</small></span></div>
        </div>
        <div className="emergency-site-grid">
          {sites.map((site) => (
            <a key={site.id} href={site.url} target="_blank" rel="noreferrer">
              <span><strong>{site.name[fromLang]}</strong><small>{site.description[fromLang]}</small></span><ExternalLink size={15} />
            </a>
          ))}
        </div>
        <p className="emergency-site-warning"><Globe2 size={13} /> {resourceCopy.siteWarning}</p>
      </section>
    </main>
  )
}
