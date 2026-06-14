import { motion } from 'motion/react'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { Card } from '../components/ui/Card'
import { Spinner } from '../components/ui/Spinner'
import { useCourses } from '../hooks/useApi'
import { useAuth } from '../lib/auth'
import styles from './Dashboard.module.css'

export function Dashboard() {
  const { userId } = useAuth()
  const { data, isLoading, isError, error } = useCourses()

  // Show the teacher only their own courses (scoped by JWT subject).
  const courses = useMemo(() => {
    if (!data) return []
    return userId ? data.filter((c) => c.teacher_id === userId) : data
  }, [data, userId])

  if (isLoading) {
    return (
      <div className={styles.state}>
        <Spinner size={22} label="Завантаження курсів…" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className={styles.state}>
        <p>Не вдалося завантажити курси: {error?.detail || 'помилка'}</p>
      </div>
    )
  }

  return (
    <div>
      <header className={styles.head}>
        <div>
          <h1 className={styles.title}>
            Аналітична <em>панель</em>
          </h1>
          <p className={styles.subtitle}>
            Курси під вашим керівництвом. Відкрийте курс, щоб побачити
            інтегральний індекс успішності, зони ризику та налаштувати
            вагові коефіцієнти.
          </p>
        </div>
        <span className={styles.count}>
          {courses.length} {courses.length === 1 ? 'курс' : 'курсів'}
        </span>
      </header>

      {courses.length === 0 ? (
        <div className={`${styles.state} ${styles.empty}`}>
          <p>Поки що немає курсів під вашим обліковим записом.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {courses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: Math.min(i * 0.05, 0.3),
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Card
                accentTop
                accentColor="var(--pine)"
                className={styles.course}
                style={{ height: '100%' }}
              >
                <Link to={`/courses/${course.id}`} className={styles.cardLink}>
                  <h2 className={styles.courseTitle}>{course.title}</h2>
                  {course.description && (
                    <p className={styles.courseDesc}>{course.description}</p>
                  )}
                  <div className={styles.weights}>
                    <span className={styles.wItem}>
                      <b className="tnum">{course.weight_academic.toFixed(1)}</b>
                      A · академ.
                    </span>
                    <span className={styles.wItem}>
                      <b className="tnum">
                        {course.weight_engagement.toFixed(1)}
                      </b>
                      B · залуч.
                    </span>
                    <span className={styles.wItem}>
                      <b className="tnum">{course.weight_time.toFixed(1)}</b>
                      T · час
                    </span>
                    <span className={styles.wItem}>
                      <b className="tnum">
                        {course.pass_threshold.toFixed(2)}
                      </b>
                      поріг θ
                    </span>
                  </div>
                  <span className={styles.go}>Переглянути модулі →</span>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
