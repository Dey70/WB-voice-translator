import { useMemo, useState } from 'react'
import { ArrowLeftRight, Copy, Phone, ShieldAlert, Volume2, VolumeX } from 'lucide-react'
import LanguageSelector from '../components/translation/LanguageSelector'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'
import { getLanguage } from '../utils/constants'
import { TOURIST_PHRASES } from '../data/touristPhrases'

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
  const { speak, stop, isSpeaking } = useSpeechSynthesis()

  const from = getLanguage(fromLang)
  const to = getLanguage(toLang)
  const group = GROUPS.find((item) => item.id === groupId) || GROUPS[0]
  const phrases = useMemo(() => phrasesForGroup(group), [group])
  const selected = TOURIST_PHRASES.find((phrase) => phrase.id === selectedId) || phrases[0]

  const playPhrase = (phrase) => {
    setSelectedId(phrase.id)
    stop()
    setTimeout(() => speak(phrase.translations[toLang], toLang), 100)
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
            <button className="emergency-speak" onClick={() => isSpeaking ? stop() : speak(selected.translations[toLang], toLang)}>
              {isSpeaking ? <VolumeX size={20} /> : <Volume2 size={20} />}{isSpeaking ? 'Stop speaking' : 'Speak loudly'}
            </button>
            <button onClick={copyTranslation}><Copy size={17} /> {copied ? 'Copied' : 'Copy'}</button>
          </div>
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
    </main>
  )
}
