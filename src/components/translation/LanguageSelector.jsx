export default function LanguageSelector({ value, onChange, exclude }) {
  const LANGUAGES = [
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', label: 'BN', color: '#2dd4bf' },
    { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', label: 'NE', color: '#6c63ff' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', label: 'HI', color: '#f87171' },
  ]
  const options = exclude ? LANGUAGES.filter((l) => l.code !== exclude) : LANGUAGES

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
              border: selected ? '1px solid ' + lang.color : '1px solid var(--border)',
              background: selected ? lang.color + '18' : 'var(--bg-card)',
              color: selected ? lang.color : 'var(--text-secondary)',
              cursor: 'pointer', fontSize: 13, fontWeight: selected ? 600 : 400,
              transition: 'all 0.2s',
              boxShadow: selected ? '0 0 12px ' + lang.color + '30' : 'none',
              minWidth: 0,
            }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: selected ? lang.color + '30' : 'var(--bg-secondary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: selected ? lang.color : 'var(--text-muted)',
              flexShrink: 0,
              letterSpacing: 0.5,
            }}>
              {lang.label}
            </div>
            <div style={{ textAlign: 'left', minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>{lang.nativeName}</div>
              <div style={{ fontSize: 11, opacity: 0.7, whiteSpace: 'nowrap' }}>{lang.name}</div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
