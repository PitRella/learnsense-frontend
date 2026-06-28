import { AnimatePresence, motion } from 'motion/react'
import { useMemo } from 'react'

import { useRecommendations, useUpdateRecommendation } from '../hooks/useApi'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { Spinner } from './ui/Spinner'
import styles from './RecommendationsPanel.module.css'

const STATUS = {
  CREATED: { tone: 'watch', label: 'Нова' },
  VIEWED: { tone: 'neutral', label: 'Переглянуто' },
  COMPLETED: { tone: 'pass', label: 'Виконано' },
}

// Per-template visual identity: an icon + accent colour + short label.
const TYPE_META = {
  AT_RISK_ALERT: { icon: '⚠', color: 'var(--risk)', label: 'Зона ризику' },
  REVIEW_THEORY: { icon: '📖', color: 'var(--clay)', label: 'Повторення' },
  ADDITIONAL_MATERIAL: { icon: '➕', color: 'var(--clay)', label: 'Додатково' },
  RETRY_TEST: { icon: '↻', color: 'var(--watch)', label: 'Повторний тест' },
  PRACTICE_REMINDER: { icon: '✎', color: 'var(--watch)', label: 'Практика' },
  REINFORCE_AFTER_PASS: { icon: '✓', color: 'var(--pass)', label: 'Закріплення' },
  NEXT_MODULE: { icon: '→', color: 'var(--pine)', label: 'Наступний модуль' },
  STRONG_PROGRESS: { icon: '★', color: 'var(--pass)', label: 'Чудово' },
  TOPIC_SEQUENCE: { icon: '⇉', color: 'var(--pine)', label: 'Послідовність' },
  CERTIFICATE_PROGRESS: { icon: '🎓', color: 'var(--gold)', label: 'Сертифікат' },
  LEARNING_TRAJECTORY: { icon: '🧭', color: 'var(--pine)', label: 'Траєкторія' },
  PACE_REGULARITY: { icon: '⏱', color: 'var(--gold)', label: 'Регулярність' },
}
const DEFAULT_META = { icon: '•', color: 'var(--pine)', label: 'Порада' }

export function RecommendationsPanel() {
  const { data, isLoading } = useRecommendations({ poll: true })
  const update = useUpdateRecommendation()

  // Defensive: collapse duplicates for the same (module, type) — keep the
  // most recent — and order by relevance so the most urgent advice leads.
  const items = useMemo(() => {
    const byKey = new Map()
    for (const r of data || []) {
      const key = `${r.module_id ?? 'course'}:${r.recommendation_type}`
      const prev = byKey.get(key)
      if (!prev || r.id > prev.id) byKey.set(key, r)
    }
    return [...byKey.values()].sort(
      (a, b) => b.relevance_score - a.relevance_score,
    )
  }, [data])

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <p className={styles.eyebrow}>Персональні рекомендації</p>
        <span className={styles.live}>
          <span className={styles.liveDot} />
          оновлюється автоматично
        </span>
      </div>

      {isLoading ? (
        <Spinner label="Завантаження рекомендацій…" />
      ) : items.length === 0 ? (
        <div className={styles.empty}>
          <p style={{ color: 'var(--ink)', fontSize: 'var(--text-md)' }}>
            Поки що рекомендацій немає
          </p>
          <p>
            Щойно система виявить прогалину в знаннях, тут зʼявиться
            персональна порада — що саме переглянути далі.
          </p>
        </div>
      ) : (
        <AnimatePresence initial={false}>
          {items.map((rec) => {
            const status = STATUS[rec.status] || STATUS.CREATED
            const meta = TYPE_META[rec.recommendation_type] || DEFAULT_META
            return (
              <motion.div
                key={rec.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <Card
                  accentTop
                  accentColor={meta.color}
                  className={styles.card}
                >
                  <div
                    className={styles.icon}
                    style={{ '--accent': meta.color }}
                    aria-hidden="true"
                  >
                    {meta.icon}
                  </div>

                  <div className={styles.body}>
                    <div className={styles.title}>
                      {rec.title || meta.label}
                    </div>
                    <p className={styles.reason}>{rec.reason}</p>
                    <div className={styles.meta}>
                      <span style={{ color: meta.color, fontWeight: 600 }}>
                        {meta.label}
                      </span>
                      {rec.module_title && <span>· {rec.module_title}</span>}
                      <Badge tone={status.tone}>{status.label}</Badge>
                    </div>
                  </div>

                  <div className={styles.actions}>
                    {rec.status === 'COMPLETED' ? (
                      <span className={styles.done}>✓ Завершено</span>
                    ) : (
                      <>
                        {rec.status === 'CREATED' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={update.isPending}
                            onClick={() =>
                              update.mutate({
                                id: rec.id,
                                status: 'VIEWED',
                              })
                            }
                          >
                            Переглянуто
                          </Button>
                        )}
                        <Button
                          size="sm"
                          disabled={update.isPending}
                          onClick={() =>
                            update.mutate({
                              id: rec.id,
                              status: 'COMPLETED',
                            })
                          }
                        >
                          Виконано
                        </Button>
                      </>
                    )}
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      )}
    </div>
  )
}
