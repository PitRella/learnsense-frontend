import { Link } from 'react-router-dom'

import {
  DEFAULT_META,
  STATUS,
  TYPE_META,
  recLink,
} from '../lib/recommendations'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { Icon } from './ui/Icon'
import styles from './RecommendationsPanel.module.css'

/**
 * A single recommendation card.
 * `onMark(status)` advances its status; `onNavigate` fires when the
 * student follows the suggested link (e.g. to close a hosting modal).
 */
export function RecommendationCard({ rec, onMark, onNavigate, pending = false }) {
  const status = STATUS[rec.status] || STATUS.CREATED
  const meta = TYPE_META[rec.recommendation_type] || DEFAULT_META
  const link = recLink(rec)

  return (
    <Card accentTop accentColor={meta.color} className={styles.card}>
      <div
        className={styles.icon}
        style={{ '--accent': meta.color }}
        aria-hidden="true"
      >
        <Icon name={meta.icon} size={22} />
      </div>

      <div className={styles.body}>
        <div className={styles.title}>{rec.title || meta.label}</div>
        <p className={styles.reason}>{rec.reason}</p>
        <div className={styles.meta}>
          <span style={{ color: meta.color, fontWeight: 600 }}>
            {meta.label}
          </span>
          {rec.module_title && <span>· {rec.module_title}</span>}
          <Badge tone={status.tone}>{status.label}</Badge>
        </div>
        {link && (
          <Link
            to={link.to}
            className={styles.cardLink}
            style={{ color: meta.color }}
            onClick={onNavigate}
          >
            {link.label}
            <Icon name="arrowRight" size={15} />
          </Link>
        )}
      </div>

      {onMark && (
        <div className={styles.actions}>
          {rec.status === 'COMPLETED' ? (
            <span className={styles.done}>
              <Icon name="check" size={15} /> Завершено
            </span>
          ) : (
            <>
              {rec.status === 'CREATED' && (
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={pending}
                  onClick={() => onMark('VIEWED')}
                >
                  Переглянуто
                </Button>
              )}
              <Button
                size="sm"
                disabled={pending}
                onClick={() => onMark('COMPLETED')}
              >
                Виконано
              </Button>
            </>
          )}
        </div>
      )}
    </Card>
  )
}
