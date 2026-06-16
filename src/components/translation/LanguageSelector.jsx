import { LANGUAGES } from '../../utils/constants'

export default function LanguageSelector({ value, onChange, exclude }) {
  const options = exclude ? LANGUAGES.filter((l) => l.code !== exclude) : LANGUAGES

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {options.map((lang) => {
        const selected = value === lang.code
        return (
          <button
            key={lang.code}
            onClick={() => onChange(lang.code)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 16px', borderRadius: 10,
              border: selected ? '1px solid ' + lang.color : '1px solid var(--border)',
              background: selected ? lang.color + '18' : 'var(--bg-card)',
              color: selected ? lang.color : 'var(--text-secondary)',
              cursor: 'pointer', fontSize: 14, fontWeight: selected ? 600 : 400,
              transition: 'all 0.2s',
              boxShadow: selected ? '0 0 12px ' + lang.color + '30' : 'none',
            }}
          >
            <span style={{ fontSize: 18 }}>{lang.flag}</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{lang.nativeName}</div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>{lang.name}</div>
            </div>
          </button>
        )
      })}
    </div>
  )
}

