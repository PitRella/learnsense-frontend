import { IndexGauge } from './charts/IndexGauge'
import { Badge } from './ui/Badge'
import { Card } from './ui/Card'
import { Spinner } from './ui/Spinner'
import { useReadiness } from '../hooks/useApi'
import styles from './ReadinessPanel.module.css'

const COMPONENTS = [
  { key: 'academic', label: 'Академічна успішність' },
  { key: 'practical', label: 'Практичні завдання' },
  { key: 'attempts', label: 'Якість спроб' },
  { key: 'regularity', label: 'Регулярність' },
  { key: 'activity', label: 'Активність' },
]

const COMPETENCY = {
  mastered: { tone: 'pass', label: 'Освоєно' },
  review: { tone: 'watch', label: 'Потребує повторення' },
  not_mastered: { tone: 'risk', label: 'Не освоєно' },
  not_started: { tone: 'neutral', label: 'Не розпочато' },
}

const BAND = {
  high: 'Високий рівень готовності',
  medium: 'Середній рівень готовності',
  low: 'Низький рівень готовності',
}

export function ReadinessPanel({ courseId }) {
  const { data, isLoading } = useReadiness(courseId)

  if (isLoading) return <Spinner label="Розрахунок готовності…" />
  if (!data) return null

  return (
    <section className={styles.wrap}>
      <p className={styles.label}>Готовність до підсумкової атестації</p>
      <Card raised>
        <div className={styles.grid}>
          <div className={styles.gaugeCard}>
            <IndexGauge
              value={data.readiness_score}
              threshold={0.5}
              label="готовність"
            />
            <span className={`${styles.band} ${styles['band' + data.level]}`}>
              {BAND[data.level]}
            </span>
          </div>

          <div className={styles.components}>
            {COMPONENTS.map(({ key, label }) => (
              <div key={key} className={styles.comp}>
                <div className={styles.compHead}>
                  <span>{label}</span>
                  <b>{Math.round((data[key] ?? 0) * 100)}%</b>
                </div>
                <div className={styles.track}>
                  <i style={{ width: `${Math.min(100, (data[key] ?? 0) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <p className={styles.label} style={{ marginTop: 'var(--sp-6)' }}>
        Карта компетенцій
      </p>
      <div className={styles.competencies}>
        {data.competencies.map((c) => {
          const meta = COMPETENCY[c.level] || COMPETENCY.not_started
          return (
            <div key={c.module_id} className={styles.comprow}>
              <span className={styles.compTitle}>{c.title}</span>
              <Badge tone={meta.tone}>{meta.label}</Badge>
            </div>
          )
        })}
      </div>
    </section>
  )
}
