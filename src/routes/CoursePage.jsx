import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { CourseAnalytics } from '../components/CourseAnalytics'
import { CourseStudents } from '../components/CourseStudents'
import { ReadinessPanel } from '../components/ReadinessPanel'
import { WeightsPanel } from '../components/WeightsPanel'
import { Button } from '../components/ui/Button'
import { Field } from '../components/ui/Field'
import { Icon } from '../components/ui/Icon'
import { Spinner } from '../components/ui/Spinner'
import {
  useCourses,
  useCreateMaterial,
  useCreateModule,
  useModules,
} from '../hooks/useApi'
import { useAuth } from '../lib/auth'
import styles from './CoursePage.module.css'

const MATERIAL_LABEL = {
  TEXT: 'Конспект',
  VIDEO: 'Відео',
  TEST: 'Тест',
}

const MATERIAL_TYPES = [
  { value: 'TEXT', label: 'Конспект' },
  { value: 'VIDEO', label: 'Відео' },
  { value: 'TEST', label: 'Тест' },
]

// Per-module "add material" affordance for teachers: a collapsed button
// that expands into a small typed form (lecture text, video link, or a
// test whose questions are authored on the material page afterwards).
function ModuleMaterialForm({ courseId, moduleId }) {
  const create = useCreateMaterial(courseId)
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [type, setType] = useState('TEXT')
  const [content, setContent] = useState('')

  function reset() {
    setTitle('')
    setType('TEXT')
    setContent('')
    setOpen(false)
  }

  function submit(e) {
    e.preventDefault()
    if (!title.trim()) return
    create.mutate(
      {
        moduleId,
        body: {
          title: title.trim(),
          material_type: type,
          content: content.trim() || null,
        },
      },
      { onSuccess: reset },
    )
  }

  if (!open) {
    return (
      <button
        type="button"
        className={styles.addMatBtn}
        onClick={() => setOpen(true)}
      >
        <Icon name="plus" size={14} /> Додати матеріал
      </button>
    )
  }

  return (
    <form className={styles.matForm} onSubmit={submit}>
      <div className={styles.matFormRow}>
        <input
          className={styles.matInput}
          placeholder="Назва матеріалу"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
        <select
          className={styles.matSelect}
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          {MATERIAL_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
      {type === 'TEXT' && (
        <textarea
          className={styles.matTextarea}
          rows={4}
          placeholder="Текст конспекту"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      )}
      {type === 'VIDEO' && (
        <input
          className={styles.matInput}
          placeholder="Посилання на відео (https://…)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      )}
      {type === 'TEST' && (
        <p className={styles.matHint}>
          Питання тесту можна додати на сторінці матеріалу після створення.
        </p>
      )}
      {create.isError && (
        <p className={styles.matErr}>
          {create.error?.detail || 'Не вдалося додати матеріал'}
        </p>
      )}
      <div className={styles.matFormActions}>
        <Button type="button" variant="ghost" size="sm" onClick={reset}>
          Скасувати
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={!title.trim() || create.isPending}
        >
          {create.isPending ? 'Додавання…' : 'Додати'}
        </Button>
      </div>
    </form>
  )
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

  // - Student: read-only module + material outline -
  if (!isTeacher) {
    return (
      <div>
        {header}
        <ReadinessPanel courseId={id} />
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

  // - Teacher: modules link to analytics + weight configuration -
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
                              <span className={styles.matClip}>
                                <Icon name="paperclip" size={13} />
                              </span>
                            )}
                            <span className={styles.matGo}>→</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  <ModuleMaterialForm courseId={id} moduleId={m.id} />
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

      <CourseStudents courseId={id} threshold={course?.pass_threshold} />
      <CourseAnalytics courseId={id} />
    </div>
  )
}
