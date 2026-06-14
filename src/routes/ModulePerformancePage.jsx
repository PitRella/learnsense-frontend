import { motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { IndexGauge } from '../components/charts/IndexGauge'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { Spinner } from '../components/ui/Spinner'
import { useCourses, useModulePerformance, useModules } from '../hooks/useApi'
import styles from './ModulePerformancePage.module.css'

const COMPONENTS = [
  { key: 'academic_score', color: 'var(--pine)' },
  { key: 'engagement_score', color: 'var(--clay)' },
  { key: 'time_score', color: 'var(--gold)' },
]

function classify(record, threshold) {
  if (record.is_at_risk || record.index_value < threshold) return 'risk'
  if (record.index_value < threshold + 0.1) return 'watch'
  return 'pass'
}

export function ModulePerformancePage() {
  const { courseId, moduleId } = useParams()
  const cId = Number(courseId)
  const mId = Number(moduleId)
  const [poll, setPoll] = useState(false)

  const { data: courses } = useCourses()
  const course = courses?.find((c) => c.id === cId)
  const threshold = course?.pass_threshold ?? 0.5

  const { data: modules } = useModules(cId)
  const module = modules?.find((m) => m.id === mId)

  const { data, isLoading } = useModulePerformance(mId, { poll })

  // Defensive: collapse any duplicate rows per student (keep the most
  // recent by id) so concurrent analytics writes never double-count.
  const records = useMemo(() => {
    const byStudent = new Map()
    for (const r of data || []) {
      const prev = byStudent.get(r.student_id)
      if (!prev || r.id > prev.id) byStudent.set(r.student_id, r)
    }
    return [...byStudent.values()]
  }, [data])

  const summary = useMemo(() => {
    const rows = records
    if (rows.length === 0) return null
    const mean =
      rows.reduce((s, r) => s + r.index_value, 0) / rows.length
    const buckets = { risk: 0, watch: 0, pass: 0 }
    rows.forEach((r) => (buckets[classify(r, threshold)] += 1))
    return { mean, buckets, total: rows.length }
  }, [records, threshold])

  const rows = useMemo(
    () => [...records].sort((a, b) => a.index_value - b.index_value),
    [records],
  )

  return (
    <div>
      <Link to={`/courses/${cId}`} className={styles.back}>
        ← {course?.title || 'Курс'}
      </Link>

      <header className={styles.head}>
        <div>
          <p className={styles.eyebrow}>Аналітика модуля</p>
          <h1 className={styles.title}>{module?.title || 'Модуль'}</h1>
        </div>
        <button
          className={styles.poll}
          onClick={() => setPoll((p) => !p)}
          type="button"
        >
          <span className={`${styles.dot} ${poll ? styles.dotLive : ''}`} />
          {poll ? 'Авто-оновлення увімкнено' : 'Авто-оновлення'}
        </button>
      </header>

      {isLoading ? (
        <Spinner size={22} label="Завантаження аналітики…" />
      ) : !summary ? (
        <div className={styles.empty}>
          <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)' }}>
            Поки що немає розрахованих індексів
          </p>
          <p>
            Дані з’являться, щойно воркер Celery обробить телеметрію
            студентів. Увімкніть авто-оновлення, щоб побачити результати
            одразу.
          </p>
        </div>
      ) : (
        <>
          <div className={styles.summary}>
            <Card raised className={styles.gaugeCard}>
              <IndexGauge
                value={summary.mean}
                threshold={threshold}
                label="середній індекс"
              />
            </Card>

            <Card>
              <div className={styles.stats}>
                <div className={`${styles.stat} ${styles.statRisk}`}>
                  <b className="tnum">{summary.buckets.risk}</b>
                  <span>у зоні ризику</span>
                </div>
                <div className={styles.stat}>
                  <b className="tnum">{summary.buckets.watch}</b>
                  <span>під наглядом</span>
                </div>
                <div className={`${styles.stat} ${styles.statPass}`}>
                  <b className="tnum">{summary.buckets.pass}</b>
                  <span>успішні</span>
                </div>
              </div>
              <div className={styles.distro}>
                {['risk', 'watch', 'pass'].map((k) => {
                  const colors = {
                    risk: 'var(--risk)',
                    watch: 'var(--watch)',
                    pass: 'var(--pass)',
                  }
                  const pct = (summary.buckets[k] / summary.total) * 100
                  return (
                    <i
                      key={k}
                      style={{ width: `${pct}%`, background: colors[k] }}
                    />
                  )
                })}
              </div>
              <p
                style={{
                  marginTop: 'var(--sp-4)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--ink-soft)',
                }}
              >
                {summary.total} студент(ів) · поріг θ ={' '}
                <span className="tnum">{threshold.toFixed(2)}</span>
              </p>
            </Card>
          </div>

          <p className={styles.sectionLabel}>Студенти · за зростанням індексу</p>
          <div className={styles.rows}>
            {rows.map((r, i) => {
              const kind = classify(r, threshold)
              const tone =
                kind === 'risk' ? 'risk' : kind === 'watch' ? 'watch' : 'pass'
              const toneLabel =
                kind === 'risk'
                  ? 'Ризик'
                  : kind === 'watch'
                    ? 'Нагляд'
                    : 'Успішно'
              return (
                <motion.div
                  key={r.id}
                  className={`${styles.row} ${kind === 'risk' ? styles.rowRisk : ''}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: Math.min(i * 0.03, 0.25),
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <div className={styles.student}>
                    <span className={styles.studentName}>
                      {r.student_name || `Студент #${r.student_id}`}
                    </span>
                    <Badge tone={tone}>{toneLabel}</Badge>
                  </div>
                  <span
                    className={`${styles.idxBig} tnum`}
                    style={{
                      color:
                        kind === 'risk'
                          ? 'var(--risk)'
                          : kind === 'pass'
                            ? 'var(--pass)'
                            : 'var(--ink)',
                    }}
                  >
                    {r.index_value.toFixed(2)}
                  </span>
                  <div className={styles.miniBarsWrap}>
                    <div className={styles.miniBars}>
                      {COMPONENTS.map(({ key, color }) => (
                        <div key={key} className={styles.miniBar}>
                          <i
                            style={{
                              width: `${Math.min(100, r[key] * 100)}%`,
                              background: color,
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className={styles.miniLabels}>
                      <span>A {r.academic_score.toFixed(2)}</span>
                      <span>B {r.engagement_score.toFixed(2)}</span>
                      <span>T {r.time_score.toFixed(2)}</span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
