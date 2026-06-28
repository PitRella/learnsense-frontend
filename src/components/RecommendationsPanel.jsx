import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { Icon } from './ui/Icon'
import styles from './RecommendationsPanel.module.css'

const STATUS = {
  CREATED: { tone: 'watch', label: 'Нова' },
  VIEWED: { tone: 'neutral', label: 'Переглянуто' },
  COMPLETED: { tone: 'pass', label: 'Виконано' },
}

// Per-template visual identity: a line icon + accent colour + short label.
const TYPE_META = {
  AT_RISK_ALERT: { icon: 'alertTriangle', color: 'var(--risk)', label: 'Зона ризику' },
  REVIEW_THEORY: { icon: 'bookOpen', color: 'var(--clay)', label: 'Повторення' },
  ADDITIONAL_MATERIAL: { icon: 'plus', color: 'var(--clay)', label: 'Додатково' },
  RETRY_TEST: { icon: 'rotate', color: 'var(--watch)', label: 'Повторний тест' },
  PRACTICE_REMINDER: { icon: 'pencil', color: 'var(--watch)', label: 'Практика' },
  REINFORCE_AFTER_PASS: { icon: 'check', color: 'var(--pass)', label: 'Закріплення' },
  NEXT_MODULE: { icon: 'arrowRight', color: 'var(--pine)', label: 'Наступний модуль' },
  STRONG_PROGRESS: { icon: 'star', color: 'var(--pass)', label: 'Чудово' },
  TOPIC_SEQUENCE: { icon: 'listOrdered', color: 'var(--pine)', label: 'Послідовність' },
  CERTIFICATE_PROGRESS: { icon: 'award', color: 'var(--gold)', label: 'Сертифікат' },
  LEARNING_TRAJECTORY: { icon: 'compass', color: 'var(--pine)', label: 'Траєкторія' },
  PACE_REGULARITY: { icon: 'clock', color: 'var(--gold)', label: 'Регулярність' },
}
const DEFAULT_META = { icon: 'lightbulb', color: 'var(--pine)', label: 'Порада' }

/** A single recommendation card. `onMark(status)` advances its status. */
export function RecommendationCard({ rec, onMark, pending = false }) {
  const status = STATUS[rec.status] || STATUS.CREATED
  const meta = TYPE_META[rec.recommendation_type] || DEFAULT_META
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
