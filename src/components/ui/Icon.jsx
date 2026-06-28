// A single, consistent line-icon set (Lucide-style, 24×24, stroke =
// currentColor). One coherent family replaces the earlier grab-bag of
// Unicode glyphs and colour emoji, so every icon shares the same weight,
// metrics and optical size.

const PATHS = {
  // - Navigation -
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  library: (
    <>
      <path d="m16 6 4 14" />
      <path d="M12 6v14" />
      <path d="M8 8v12" />
      <path d="M4 4v16" />
    </>
  ),
  star: (
    <path d="M12 2.5l2.9 5.88 6.48.94-4.69 4.57 1.11 6.46L12 17.8l-5.8 3.05 1.1-6.46L2.62 9.82l6.49-.94z" />
  ),
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="9" r="6" />
      <path d="M8.2 13.9 7 21l5-2.5L17 21l-1.2-7.1" />
    </>
  ),
  trendingUp: (
    <>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </>
  ),
  settings: (
    <>
      <path d="M20 7h-9" />
      <path d="M14 17H5" />
      <circle cx="17" cy="17" r="3" />
      <circle cx="7" cy="7" r="3" />
    </>
  ),
  // - Recommendation templates -
  alertTriangle: (
    <>
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </>
  ),
  bookOpen: (
    <>
      <path d="M2 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z" />
      <path d="M22 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z" />
    </>
  ),
  plus: (
    <>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </>
  ),
  rotate: (
    <>
      <path d="M21 3v6h-6" />
      <path d="M21 9a9 9 0 1 0-2.1 9.4" />
    </>
  ),
  pencil: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </>
  ),
  check: <polyline points="20 6 9 17 4 12" />,
  arrowRight: (
    <>
      <line x1="4" y1="12" x2="20" y2="12" />
      <polyline points="13 5 20 12 13 19" />
    </>
  ),
  arrowLeft: (
    <>
      <line x1="20" y1="12" x2="4" y2="12" />
      <polyline points="11 5 4 12 11 19" />
    </>
  ),
  externalLink: (
    <>
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </>
  ),
  paperclip: (
    <path d="m21.4 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  ),
  listOrdered: (
    <>
      <line x1="10" y1="6" x2="21" y2="6" />
      <line x1="10" y1="12" x2="21" y2="12" />
      <line x1="10" y1="18" x2="21" y2="18" />
      <path d="M4 6h1v4" />
      <path d="M4 10h2" />
      <path d="M6 18H4c0-1 2-1.3 2-2.5S5 14 4 14.5" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <polygon points="16.2 7.8 14.1 14.1 7.8 16.2 9.9 9.9" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <polyline points="12 7 12 12 15.5 14" />
    </>
  ),
  lightbulb: (
    <>
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M15.1 14c.2-1 .7-1.7 1.5-2.5A6 6 0 1 0 6 8c0 1.3.5 2.6 1.5 3.5.7.8 1.2 1.5 1.4 2.5" />
    </>
  ),
  flag: (
    <>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V4s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </>
  ),
  medal: (
    <>
      <path d="M7.2 14 3 6.5 4.8 4h14.4L21 6.5 16.8 14" />
      <circle cx="12" cy="17" r="5" />
      <path d="M12 14v6" />
    </>
  ),
  play: <polygon points="7 4 20 12 7 20" />,
  x: (
    <>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </>
  ),
  dot: <circle cx="12" cy="12" r="3" />,
}

const FILLED = new Set(['star', 'play'])

export function Icon({
  name,
  size = 18,
  strokeWidth = 1.75,
  filled,
  className,
  style,
}) {
  const body = PATHS[name] || PATHS.dot
  const isFilled = filled ?? FILLED.has(name)
  return (
    <svg
      className={className}
      style={style}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={isFilled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={isFilled && name !== 'star' ? 0 : strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {body}
    </svg>
  )
}
