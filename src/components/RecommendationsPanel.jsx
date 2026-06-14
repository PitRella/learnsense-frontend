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

export function RecommendationsPanel() {
  const { data, isLoading } = useRecommendations({ poll: true })
  const update = useUpdateRecommendation()

  // Defensive: collapse duplicate suggestions for the same material in a
  // module (keep the most recent), so a concurrent generation race never
  // shows the same advice twice.
  const items = useMemo(() => {
    const byKey = new Map()
    for (const r of data || []) {
      const key = `${r.module_id}:${r.material_id}`
      const prev = byKey.get(key)
      if (!prev || r.id > prev.id) byKey.set(key, r)
    }
    return [...byKey.values()].sort((a, b) => b.id - a.id)
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
            const pct = Math.round((rec.relevance_score || 0) * 100)
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
                  accentColor="var(--clay)"
                  className={styles.card}
                >
                  <div
                    className={styles.scoreRing}
                    style={{ '--score': pct }}
                    title={`Релевантність ${pct}%`}
                  >
                    <span className={styles.scoreInner}>{pct}</span>
                  </div>

                  <div className={styles.body}>
                    <div className={styles.title}>
                      Матеріал #{rec.material_id}
                    </div>
                    <p className={styles.reason}>
                      {rec.reason ||
                        'Рекомендовано для усунення прогалини в проблемному модулі.'}
                    </p>
                    <div className={styles.meta}>
                      <span>Модуль #{rec.module_id}</span>
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
