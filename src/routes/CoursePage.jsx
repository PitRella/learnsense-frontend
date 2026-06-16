import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { WeightsPanel } from '../components/WeightsPanel'
import { Button } from '../components/ui/Button'
import { Field } from '../components/ui/Field'
import { Spinner } from '../components/ui/Spinner'
import { useCourses, useCreateModule, useModules } from '../hooks/useApi'
import { useAuth } from '../lib/auth'
import styles from './CoursePage.module.css'

const MATERIAL_LABEL = {
  TEXT: 'Конспект',
  VIDEO: 'Відео',
  TEST: 'Тест',
}

export function CoursePage() {
  const { courseId } = useParams()
  const id = Number(courseId)
  const { isTeacher } = useAuth()
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

  const header = (
    <>
      <Link to="/" className={styles.back}>
        ← {isTeacher ? 'Усі курси' : 'До курсів'}
      </Link>
      <header className={styles.head}>
        <h1 className={styles.title}>{course?.title || 'Курс'}</h1>
        {course?.description && (
          <p className={styles.desc}>{course.description}</p>
        )}
      </header>
    </>
  )

  // — Student: read-only module + material outline —
  if (!isTeacher) {
    return (
      <div>
        {header}
        <p className={styles.sectionLabel}>Навчальні модулі</p>
        {isLoading ? (
          <Spinner label="Завантаження модулів…" />
        ) : (
          <div className={styles.modList}>
            {(modules || []).map((m, i) => (
              <div key={m.id} className={styles.studentMod}>
                <div className={styles.studentModHead}>
                  <span className={styles.modIndex}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={styles.modTitle}>{m.title}</span>
                </div>
                {m.materials?.length > 0 && (
                  <ul className={styles.matList}>
                    {m.materials.map((mat) => (
                      <li key={mat.id}>
                        <Link
                          to={`/courses/${id}/materials/${mat.id}`}
                          className={styles.mat}
                        >
                          <span className={styles.matType}>
                            {MATERIAL_LABEL[mat.material_type] ||
                              mat.material_type}
                          </span>
                          <span>{mat.title}</span>
                          <span className={styles.matGo}>→</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // — Teacher: modules link to analytics + weight configuration —
  return (
    <div>
      {header}
      <div className={styles.layout}>
        <section>
          <p className={styles.sectionLabel}>Навчальні модулі</p>

          {isLoading ? (
            <Spinner label="Завантаження модулів…" />
          ) : modules && modules.length > 0 ? (
            <div className={styles.modList}>
              {modules.map((m, i) => (
                <div key={m.id} className={styles.studentMod}>
                  <div className={styles.studentModHead}>
                    <span className={styles.modIndex}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className={styles.modTitle}>{m.title}</span>
                    <Link
                      to={`/courses/${id}/modules/${m.id}`}
                      className={styles.analyticsLink}
                    >
                      Аналітика →
                    </Link>
                  </div>
                  {m.materials?.length > 0 && (
                    <ul className={styles.matList}>
                      {m.materials.map((mat) => (
                        <li key={mat.id}>
                          <Link
                            to={`/courses/${id}/materials/${mat.id}`}
                            className={styles.mat}
                          >
                            <span className={styles.matType}>
                              {MATERIAL_LABEL[mat.material_type] ||
                                mat.material_type}
                            </span>
                            <span>{mat.title}</span>
                            {mat.file_name && (
                              <span className={styles.matClip}>📎</span>
                            )}
                            <span className={styles.matGo}>→</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
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
          {course ? <WeightsPanel course={course} /> : <Spinner label="…" />}
        </aside>
      </div>
    </div>
  )
}
