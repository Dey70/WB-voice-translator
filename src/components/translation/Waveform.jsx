export default function Waveform({ active, color = '#6c63ff' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3, height: 32 }}>
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className={active ? 'wave-bar' : ''}
          style={{
            width: 3,
            height: active ? undefined : 4,
            minHeight: 4,
            maxHeight: 28,
            background: color,
            borderRadius: 2,
            transition: 'height 0.1s',
            animationDelay: (i * 0.1) + 's',
            opacity: active ? 1 : 0.4,
          }}
        />
      ))}
    </div>
  )
}

