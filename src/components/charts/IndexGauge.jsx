import { useId } from 'react'

// Semicircular gauge for the integral performance index (0..1), with a
// threshold tick (theta). Pure SVG - no chart library.
const TAU = Math.PI

function polar(cx, cy, r, t) {
  // t in [0,1] maps to a half-circle sweep from left (PI) to right (0).
  const angle = TAU - t * TAU
  return [cx + r * Math.cos(angle), cy - r * Math.sin(angle)]
}

function arcPath(cx, cy, r, from, to) {
  const [x1, y1] = polar(cx, cy, r, from)
  const [x2, y2] = polar(cx, cy, r, to)
  const large = to - from > 0.5 ? 1 : 0
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
}

export function IndexGauge({
  value = 0,
  threshold = 0.5,
  size = 220,
  label,
}) {
  const gid = useId()
  const w = size
  const h = size * 0.62
  const cx = w / 2
  const cy = h - 6
  const r = w / 2 - 16
  const atRisk = value < threshold
  const valColor = atRisk ? 'var(--risk)' : 'var(--pass)'
  const [tx, ty] = polar(cx, cy, r, threshold)
  const [tx2, ty2] = polar(cx, cy, r + 11, threshold)

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 4 }}>
      <svg width={w} height={h + 8} viewBox={`0 0 ${w} ${h + 8}`}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--risk)" />
            <stop offset="50%" stopColor="var(--clay)" />
            <stop offset="100%" stopColor="var(--pass)" />
          </linearGradient>
        </defs>
        {/* track */}
        <path
          d={arcPath(cx, cy, r, 0, 1)}
          fill="none"
          stroke="var(--hairline)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* value arc */}
        <path
          d={arcPath(cx, cy, r, 0, Math.max(0.001, Math.min(1, value)))}
          fill="none"
          stroke={`url(#${gid})`}
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* threshold tick */}
        <line
          x1={tx}
          y1={ty}
          x2={tx2}
          y2={ty2}
          stroke="var(--ink)"
          strokeWidth="2"
        />
        {/* value text */}
        <text
          x={cx}
          y={cy - r * 0.34}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={w * 0.17}
          fontWeight="700"
          fill={valColor}
        >
          {value.toFixed(2)}
        </text>
        <text
          x={cx}
          y={cy - r * 0.34 + w * 0.1}
          textAnchor="middle"
          fontFamily="var(--font-body)"
          fontSize={w * 0.05}
          letterSpacing="0.12em"
          fill="var(--ink-faint)"
        >
          {(label || 'ІНДЕКС').toUpperCase()}
        </text>
      </svg>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 'var(--text-xs)',
          color: 'var(--ink-faint)',
          padding: '0 14px',
        }}
        className="tnum"
      >
        <span>0.00</span>
        <span>поріг θ {threshold.toFixed(2)}</span>
        <span>1.00</span>
      </div>
    </div>
  )
}
