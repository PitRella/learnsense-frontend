// Wordmark: a small index-arc mark + "LearnSense" set in the display serif.
export function Logo({ size = 22, showText = true, muted = false }) {
  const ink = muted ? 'var(--ink-soft)' : 'var(--ink)'
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        userSelect: 'none',
      }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M3 18a9 9 0 0 1 18 0"
          fill="none"
          stroke="var(--hairline-strong)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M3 18a9 9 0 0 1 13.2-7.95"
          fill="none"
          stroke="var(--pine)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <circle cx="16.2" cy="10.05" r="2.4" fill="var(--clay)" />
      </svg>
      {showText && (
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: '1.18rem',
            letterSpacing: '-0.02em',
            color: ink,
          }}
        >
          Learn<span style={{ fontStyle: 'italic' }}>Sense</span>
        </span>
      )}
    </span>
  )
}
