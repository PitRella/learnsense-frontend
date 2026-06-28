import { Link } from 'react-router-dom'

import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { Spinner } from '../components/ui/Spinner'
import { useMe, useMyProgress } from '../hooks/useApi'
import styles from './cabinet.module.css'

export function MyCoursesPage() {
  const { data, isLoading } = useMyProgress()
  const { data: me } = useMe()
  const courses = data || []

  return (
    <div>
      <header className={styles.head}>
        <p
          style={{
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--ink-faint)',
            marginBottom: 'var(--sp-2)',
          }}
        >
          {me ? `Вітаємо, ${me.name}` : 'Вітаємо'}
        </p>
        <h1 className={styles.title}>
          Мої <em>курси</em>
        </h1>
        <p className={styles.subtitle}>
          Ваш прогрес по записаних курсах. Відкрийте курс, щоб продовжити
          навчання.
        </p>
      </header>

      {isLoading ? (
        <Spinner label="Завантаження…" />
      ) : courses.length === 0 ? (
        <div className={styles.state}>
          <p style={{ color: 'var(--ink)', fontSize: 'var(--text-md)' }}>
            Ви ще не записані на жоден курс
          </p>
          <Link to="/catalog" className={styles.link}>
            Перейти до каталогу →
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {courses.map((c) => (
            <Card key={c.course_id} className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.cardTitle}>{c.title}</span>
              </div>
              <div className={styles.progress}>
                <div className={styles.bar}>
                  <i
                    style={{
                      width: `${
                        c.modules_total
                          ? (c.modules_passed / c.modules_total) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <span className="tnum">
                  {c.modules_passed}/{c.modules_total}
                </span>
              </div>
              <div className={styles.badges}>
                {c.completed ? (
                  <Badge tone="pass">Завершено</Badge>
                ) : (
                  <Badge tone="watch">У процесі</Badge>
                )}
                {c.certificate_eligible && (
                  <Badge tone="neutral">🎓 Сертифікат</Badge>
                )}
                <span
                  className="tnum"
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--ink-faint)',
                  }}
                >
                  індекс {c.avg_index.toFixed(2)}
                </span>
              </div>
              <div className={styles.cardFoot}>
                <Link to={`/courses/${c.course_id}`} className={styles.link}>
                  Продовжити →
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
