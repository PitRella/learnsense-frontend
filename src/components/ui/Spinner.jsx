export function Spinner({ size = 18, label }) {
  return (
    <span
      role="status"
      aria-label={label || 'Завантаження'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        color: 'var(--ink-soft)',
        fontSize: 'var(--text-sm)',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        style={{ animation: 'ls-spin 0.8s linear infinite' }}
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          fill="none"
          stroke="var(--hairline-strong)"
          strokeWidth="2.5"
        />
        <path
          d="M21 12a9 9 0 0 0-9-9"
          fill="none"
          stroke="var(--pine)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      {label}
      <style>{`@keyframes ls-spin{to{transform:rotate(360deg)}}`}</style>
    </span>
  )
}
