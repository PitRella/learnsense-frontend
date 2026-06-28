import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Field } from '../components/ui/Field'
import { Modal } from '../components/ui/Modal'
import { Spinner } from '../components/ui/Spinner'
import { useCourses, useCreateCourse } from '../hooks/useApi'
import { useAuth } from '../lib/auth'
import styles from './Dashboard.module.css'

function CreateCourseModal({ onClose }) {
  const navigate = useNavigate()
  const create = useCreateCourse()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  function submit(e) {
    e.preventDefault()
    if (!title.trim()) return
    create.mutate(
      { title: title.trim(), description: description.trim() || null },
      { onSuccess: (course) => navigate(`/courses/${course.id}`) },
    )
  }

  return (
    <Modal title="Новий курс" onClose={onClose}>
      <form className={styles.form} onSubmit={submit}>
        <Field
          label="Назва курсу"
          placeholder="напр. Алгоритми та структури даних"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
        <label className={styles.formLabel}>
          Опис
          <textarea
            className={styles.textarea}
            placeholder="Короткий опис курсу (необовʼязково)"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        {create.isError && (
          <p className={styles.formError}>
            {create.error?.detail || 'Не вдалося створити курс'}
          </p>
        )}
        <div className={styles.formActions}>
          <Button type="button" variant="ghost" onClick={onClose}>
            Скасувати
          </Button>
          <Button
            type="submit"
            disabled={!title.trim() || create.isPending}
          >
            {create.isPending ? 'Створення…' : 'Створити курс'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export function Dashboard() {
  const { userId } = useAuth()
  const { data, isLoading, isError, error } = useCourses()
  const [creating, setCreating] = useState(false)

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
        <div className={styles.headActions}>
          <span className={styles.count}>
            {courses.length} {courses.length === 1 ? 'курс' : 'курсів'}
          </span>
          <Button onClick={() => setCreating(true)}>Створити курс</Button>
        </div>
      </header>

      {courses.length === 0 ? (
        <div className={`${styles.state} ${styles.empty}`}>
          <p>Поки що немає курсів під вашим обліковим записом.</p>
          <Button onClick={() => setCreating(true)}>
            Створити перший курс
          </Button>
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

      <AnimatePresence>
        {creating && (
          <CreateCourseModal onClose={() => setCreating(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}
