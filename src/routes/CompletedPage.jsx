import { Link } from 'react-router-dom'

import { Card } from '../components/ui/Card'
import { Spinner } from '../components/ui/Spinner'
import { useMyProgress } from '../hooks/useApi'
import styles from './cabinet.module.css'

export function CompletedPage() {
  const { data, isLoading } = useMyProgress()
  const done = (data || []).filter((c) => c.completed)

  return (
    <div>
      <header className={styles.head}>
        <h1 className={styles.title}>
          Завершені <em>курси</em>
        </h1>
        <p className={styles.subtitle}>Курси, де опановані всі модулі.</p>
      </header>

      {isLoading ? (
        <Spinner label="Завантаження…" />
      ) : done.length === 0 ? (
        <div className={styles.state}>
          <p>Ще немає завершених курсів - усе попереду!</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {done.map((c) => (
            <Card key={c.course_id} className={styles.card}>
              <span className={styles.cardTitle}>{c.title}</span>
              <p className={styles.cardDesc}>
                Усі {c.modules_total} модулів опановано · середній індекс{' '}
                {c.avg_index.toFixed(2)}.
              </p>
              <div className={styles.cardFoot}>
                <Link to={`/courses/${c.course_id}`} className={styles.link}>
                  Переглянути →
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
