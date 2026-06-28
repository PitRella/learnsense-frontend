// Horizontal breakdown of the three normalized index components (A/B/T)
// with their weights - shows how the integral index was composed.
const ROWS = [
  { key: 'academic_score', label: 'Академічна (A)', color: 'var(--pine)' },
  { key: 'engagement_score', label: 'Залученість (B)', color: 'var(--clay)' },
  { key: 'time_score', label: 'Час (T)', color: 'var(--gold)' },
]

export function ComponentBars({ record, weights }) {
  return (
    <div style={{ display: 'grid', gap: 'var(--sp-4)' }}>
      {ROWS.map(({ key, label, color }) => {
        const v = record[key] ?? 0
        const w = weights?.[key]
        return (
          <div key={key} style={{ display: 'grid', gap: 6 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 'var(--text-sm)',
              }}
            >
              <span style={{ color: 'var(--ink-soft)' }}>
                {label}
                {w != null && (
                  <span className="tnum" style={{ color: 'var(--ink-faint)' }}>
                    {' '}
                    · вага {w.toFixed(2)}
                  </span>
                )}
              </span>
              <span className="tnum" style={{ fontWeight: 600 }}>
                {v.toFixed(2)}
              </span>
            </div>
            <div
              style={{
                height: 8,
                borderRadius: 999,
                background: 'var(--paper-2)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${Math.min(100, v * 100)}%`,
                  height: '100%',
                  background: color,
                  borderRadius: 999,
                  transition: 'width 0.6s var(--ease)',
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
