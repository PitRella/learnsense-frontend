import { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { useRecommendations } from '../../hooks/useApi'
import {
  ACTIONABLE_TYPES,
  DEFAULT_META,
  TYPE_META,
  recLink,
} from '../../lib/recommendations'
import { Icon } from '../ui/Icon'
import styles from './SidebarRecommendations.module.css'

// Compact "what to do now" rail in the sidebar. Unlike the old flat tab,
// it surfaces only the actionable-moment templates - review the theory for
// a failed test, submit pending work, move on to a new section - capped to
// the few most relevant, each a one-tap link to where the work happens.
export function SidebarRecommendations() {
  const { data } = useRecommendations({ poll: true })

  const items = useMemo(() => {
    const byKey = new Map()
    for (const rec of data || []) {
      if (rec.status === 'COMPLETED') continue
      if (!ACTIONABLE_TYPES.has(rec.recommendation_type)) continue
      const key = `${rec.module_id ?? 'course'}:${rec.recommendation_type}`
      const prev = byKey.get(key)
      if (!prev || rec.id > prev.id) byKey.set(key, rec)
    }
    return [...byKey.values()]
      .sort((a, b) => b.relevance_score - a.relevance_score)
      .slice(0, 3)
  }, [data])

  if (items.length === 0) return null

  return (
    <div className={styles.panel}>
      <p className={styles.heading}>Що зробити зараз</p>
      <div className={styles.list}>
        {items.map((rec) => {
          const meta = TYPE_META[rec.recommendation_type] || DEFAULT_META
          const link = recLink(rec)
          const subtitle = rec.material_title || rec.module_title
          const content = (
            <>
              <span
                className={styles.icon}
                style={{ '--accent': meta.color }}
                aria-hidden="true"
              >
                <Icon name={meta.icon} size={15} />
              </span>
              <span className={styles.text}>
                <span className={styles.title}>{rec.title || meta.label}</span>
                {subtitle && <span className={styles.sub}>{subtitle}</span>}
              </span>
              {link && (
                <Icon name="arrowRight" size={14} className={styles.chev} />
              )}
            </>
          )
          return link ? (
            <Link key={rec.id} to={link.to} className={styles.item}>
              {content}
            </Link>
          ) : (
            <div key={rec.id} className={styles.item}>
              {content}
            </div>
          )
        })}
      </div>
    </div>
  )
}
