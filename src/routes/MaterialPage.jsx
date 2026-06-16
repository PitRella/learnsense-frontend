import { useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'

import { Button } from '../components/ui/Button'
import { Spinner } from '../components/ui/Spinner'
import { useModules } from '../hooks/useApi'
import { api } from '../lib/api'
import { useAuth } from '../lib/auth'
import styles from './MaterialPage.module.css'

const TYPE_LABEL = { TEXT: 'Конспект', VIDEO: 'Відео', TEST: 'Тест' }
const MIN_LOGGED_SECONDS = 3

function isUrl(value) {
  return typeof value === 'string' && /^https?:\/\//i.test(value.trim())
}

export function MaterialPage() {
  const { courseId, materialId } = useParams()
  const cId = Number(courseId)
  const mId = Number(materialId)
  const { token } = useAuth()
  const { data: modules, isLoading } = useModules(cId)

  // The compiler memoizes this lookup automatically.
  let material = null
  let module = null
  for (const mod of modules || []) {
    const found = (mod.materials || []).find((x) => x.id === mId)
    if (found) {
      material = found
      module = mod
      break
    }
  }

  // Behavioural telemetry: record how long the student spent reading and
  // report it on exit (best-effort), feeding the analytics engine.
  const startedAt = useRef(0)
  useEffect(() => {
    startedAt.current = Date.now()
    return () => {
      const seconds = Math.round((Date.now() - startedAt.current) / 1000)
      if (seconds < MIN_LOGGED_SECONDS || !token) return
      api
        .logActivity(token, {
          material_id: mId,
          time_spent_sec: seconds,
          opened_links: 0,
        })
        .catch(() => {})
    }
  }, [mId, token])

  if (isLoading) {
    return <Spinner size={22} label="Завантаження матеріалу…" />
  }

  if (!material) {
    return (
      <div className={styles.article}>
        <Link to={`/courses/${cId}`} className={styles.back}>
          ← До курсу
        </Link>
        <div className={styles.empty}>Матеріал не знайдено.</div>
      </div>
    )
  }

  const label = TYPE_LABEL[material.material_type] || material.material_type

  return (
    <div>
      <Link to={`/courses/${cId}`} className={styles.back}>
        ← {module?.title || 'До курсу'}
      </Link>

      <article className={styles.article}>
        <div className={styles.eyebrow}>
          <span className={styles.type}>{label}</span>
          {module && <span>{module.title}</span>}
        </div>
        <h1 className={styles.title}>{material.title}</h1>

        {material.material_type === 'TEXT' && (
          <Content content={material.content} />
        )}

        {material.material_type === 'VIDEO' && (
          <VideoBlock content={material.content} />
        )}

        {material.material_type === 'TEST' && (
          <div className={styles.test}>
            <Content content={material.content} />
            <Button disabled>Почати тест (демо)</Button>
          </div>
        )}

        <p className={styles.footnote}>
          <span className={styles.recDot} />
          Час перегляду фіксується автоматично та враховується в індексі
          успішності.
        </p>
      </article>
    </div>
  )
}

function Content({ content }) {
  if (!content) {
    return (
      <div className={styles.empty}>
        Матеріал ще готується викладачем.
      </div>
    )
  }
  const paragraphs = content.split(/\n{2,}|\n/).filter(Boolean)
  return (
    <div className={styles.prose}>
      {paragraphs.map((p, i) => (
        <p key={i} className={i === 0 ? styles.dropcap : undefined}>
          {p}
        </p>
      ))}
    </div>
  )
}

function VideoBlock({ content }) {
  return (
    <div className={styles.video}>
      <div className={styles.videoFrame}>
        {isUrl(content) ? (
          <iframe title="Відео-матеріал" src={content} allowFullScreen />
        ) : (
          <span className={styles.playMark}>▶</span>
        )}
      </div>
      {isUrl(content) && (
        <p style={{ marginTop: 'var(--sp-4)' }}>
          <a href={content} target="_blank" rel="noreferrer">
            Відкрити відео у новій вкладці →
          </a>
        </p>
      )}
    </div>
  )
}
