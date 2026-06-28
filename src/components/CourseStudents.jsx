import { useMemo } from 'react'

import { useCourseStudents } from '../hooks/useApi'
import { Badge } from './ui/Badge'
import { Spinner } from './ui/Spinner'
import styles from './CourseStudents.module.css'

export function CourseStudents({ courseId, threshold = 0.5 }) {
  const { data, isLoading } = useCourseStudents(courseId)

  // Auto-rank students by average index (the group rating).
  const ranked = useMemo(
    () => [...(data || [])].sort((a, b) => b.avg_index - a.avg_index),
    [data],
  )

  if (isLoading) return <Spinner label="Завантаження студентів…" />
  if (ranked.length === 0) {
    return (
      <p className={styles.empty}>На курс ще не записані студенти.</p>
    )
  }

  return (
    <section className={styles.wrap}>
      <p className={styles.label}>Студенти курсу · рейтинг групи</p>
      <div className={styles.table}>
        <div className={`${styles.row} ${styles.header}`}>
          <span>#</span>
          <span>Студент</span>
          <span className={styles.num}>Модулі</span>
          <span className={styles.num}>Індекс</span>
          <span className={styles.num}>Ризик</span>
        </div>
        {ranked.map((s, i) => {
          const passing = s.avg_index >= threshold
          return (
            <div key={s.student_id} className={styles.row}>
              <span className={styles.rank}>{i + 1}</span>
              <span className={styles.name}>
                {s.name} {s.surname}
                <span className={styles.email}>{s.email}</span>
              </span>
              <span className={`${styles.num} tnum`}>
                {s.modules_passed}/{s.modules_total}
              </span>
              <span
                className={`${styles.num} tnum`}
                style={{
                  color: passing ? 'var(--pass)' : 'var(--risk)',
                  fontWeight: 700,
                }}
              >
                {s.avg_index.toFixed(2)}
              </span>
              <span className={styles.num}>
                {s.at_risk_count > 0 ? (
                  <Badge tone="risk">{s.at_risk_count}</Badge>
                ) : (
                  <Badge tone="pass">0</Badge>
                )}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
