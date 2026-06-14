import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { WeightsPanel } from '../components/WeightsPanel'
import { Button } from '../components/ui/Button'
import { Field } from '../components/ui/Field'
import { Spinner } from '../components/ui/Spinner'
import { useCourses, useCreateModule, useModules } from '../hooks/useApi'
import styles from './CoursePage.module.css'

export function CoursePage() {
  const { courseId } = useParams()
  const id = Number(courseId)
  const { data: courses } = useCourses()
  const course = courses?.find((c) => c.id === id)
  const { data: modules, isLoading } = useModules(id)
  const createModule = useCreateModule(id)
  const [newTitle, setNewTitle] = useState('')

  function addModule(e) {
    e.preventDefault()
    if (!newTitle.trim()) return
    createModule.mutate(
      { title: newTitle.trim(), order_index: modules?.length || 0 },
      { onSuccess: () => setNewTitle('') },
    )
  }

  return (
    <div>
      <Link to="/" className={styles.back}>
        ← Усі курси
      </Link>

      <header className={styles.head}>
        <h1 className={styles.title}>{course?.title || 'Курс'}</h1>
        {course?.description && (
          <p className={styles.desc}>{course.description}</p>
        )}
      </header>

      <div className={styles.layout}>
        <section>
          <p className={styles.sectionLabel}>Навчальні модулі</p>

          {isLoading ? (
            <Spinner label="Завантаження модулів…" />
          ) : modules && modules.length > 0 ? (
            <div className={styles.modList}>
              {modules.map((m, i) => (
                <Link
                  key={m.id}
                  to={`/courses/${id}/modules/${m.id}`}
                  className={styles.mod}
                >
                  <span className={styles.modIndex}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={styles.modBody}>
                    <span className={styles.modTitle}>{m.title}</span>
                    <span className={styles.modMeta}>
                      {(m.materials?.length || 0)} матеріал(ів) · аналітика →
                    </span>
                  </span>
                  <span className={styles.modGo}>→</span>
                </Link>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--ink-soft)' }}>
              Ще немає модулів. Додайте перший нижче.
            </p>
          )}

          <form className={styles.addRow} onSubmit={addModule}>
            <Field
              placeholder="Назва нового модуля"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <Button
              variant="ghost"
              type="submit"
              disabled={createModule.isPending || !newTitle.trim()}
            >
              Додати
            </Button>
          </form>
        </section>

        <aside>
          {course ? (
            <WeightsPanel course={course} />
          ) : (
            <Spinner label="…" />
          )}
        </aside>
      </div>
    </div>
  )
}
