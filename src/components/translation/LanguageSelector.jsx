// Indian-palette language colors:
//   Bengali  — Bay of Bengal teal
//   Nepali   — Himalayan deep pine green
//   Hindi    — Sindoor red (national identity)
//   English  — Marigold gold
const LANGUAGES = [
  { code: 'bn', name: 'Bengali',  nativeName: 'বাংলা',    label: 'বাং', color: '#0D7377' },
  { code: 'ne', name: 'Nepali',   nativeName: 'नेपाली',   label: 'ने',  color: '#2D6A4F' },
  { code: 'hi', name: 'Hindi',    nativeName: 'हिन्दी',   label: 'हिं', color: '#C0392B' },
  { code: 'en', name: 'English',  nativeName: 'English',   label: 'EN',  color: '#C8960C' },
]

export default function LanguageSelector({ value, onChange, exclude, variant = 'buttons' }) {
  const options = exclude ? LANGUAGES.filter((l) => l.code !== exclude) : LANGUAGES

  if (variant === 'select') {
    const selected = LANGUAGES.find((language) => language.code === value)
    return (
      <label className="language-select-compact">
        <span style={{ color: selected?.color }}>{selected?.label}</span>
        <select value={value} onChange={(event) => onChange(event.target.value)} aria-label="Choose language">
          {options.map((language) => <option key={language.code} value={language.code}>{language.nativeName} - {language.name}</option>)}
        </select>
      </label>
    )
  }

  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {options.map((lang) => {
        const selected = value === lang.code
        return (
          <button
            key={lang.code}
            onClick={() => onChange(lang.code)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 14px', borderRadius: 10,
              border: selected ? `2px solid ${lang.color}` : '1px solid var(--border)',
              background: selected ? lang.color + '18' : 'var(--bg-card)',
              color: selected ? lang.color : 'var(--text-secondary)',
              cursor: 'pointer', fontSize: 13, fontWeight: selected ? 700 : 400,
              transition: 'all 0.2s',
              boxShadow: selected ? `0 2px 14px ${lang.color}35, inset 0 0 0 1px ${lang.color}20` : 'none',
              minWidth: 0,
            }}
          >
            {/* Decorative label badge with bindi dot */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: selected ? lang.color + '28' : 'var(--bg-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: lang.code === 'en' ? 10 : 13,
                fontWeight: 700,
                color: selected ? lang.color : 'var(--text-muted)',
                fontFamily: "'Tiro Bangla', 'Noto Sans Bengali', 'Noto Sans Devanagari', sans-serif",
              }}>
                {lang.label}
              </div>
              {selected && (
                <div style={{
                  position: 'absolute', top: -3, right: -3,
                  width: 7, height: 7, borderRadius: '50%',
                  background: lang.color,
                  boxShadow: `0 0 6px ${lang.color}`,
                }}/>
              )}
            </div>
            <div style={{ textAlign: 'left', minWidth: 0 }}>
              <div style={{
                fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
                fontFamily: "'Tiro Bangla', 'Noto Sans Bengali', 'Noto Sans Devanagari', sans-serif",
              }}>{lang.nativeName}</div>
              <div style={{ fontSize: 11, opacity: 0.7, whiteSpace: 'nowrap' }}>{lang.name}</div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
