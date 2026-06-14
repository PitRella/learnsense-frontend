import { Link } from 'react-router-dom'

import { RecommendationsPanel } from '../components/RecommendationsPanel'
import { Card } from '../components/ui/Card'
import { Spinner } from '../components/ui/Spinner'
import { useCourses, useMe } from '../hooks/useApi'

export function StudentDashboard() {
  const { data: courses, isLoading } = useCourses()
  const { data: me } = useMe()

  return (
    <div>
      <header
        style={{ marginBottom: 'var(--sp-7)', maxWidth: '54ch' }}
      >
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
        <h1
          style={{
            fontSize: 'var(--text-2xl)',
            letterSpacing: '-0.025em',
          }}
        >
          Навчання під <em style={{ color: 'var(--clay)' }}>наглядом</em>
        </h1>
        <p style={{ marginTop: 'var(--sp-2)', color: 'var(--ink-soft)' }}>
          Тут зʼявляються персональні поради — що переглянути, щоб
          опанувати складні теми вчасно. Нижче — доступні курси.
        </p>
      </header>

      <RecommendationsPanel />

      <section style={{ marginTop: 'var(--sp-8)' }}>
        <p
          style={{
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--ink-faint)',
            marginBottom: 'var(--sp-4)',
          }}
        >
          Доступні курси
        </p>
        {isLoading ? (
          <Spinner label="Завантаження курсів…" />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 'var(--sp-4)',
            }}
          >
            {(courses || []).map((course) => (
              <Card key={course.id} style={{ height: '100%' }}>
                <Link
                  to={`/courses/${course.id}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--sp-3)',
                    height: '100%',
                    color: 'inherit',
                    textDecoration: 'none',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 600,
                      fontSize: 'var(--text-md)',
                    }}
                  >
                    {course.title}
                  </span>
                  {course.description && (
                    <span
                      style={{
                        color: 'var(--ink-soft)',
                        fontSize: 'var(--text-sm)',
                        lineHeight: 1.5,
                        flex: 1,
                      }}
                    >
                      {course.description}
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 600,
                      color: 'var(--pine)',
                    }}
                  >
                    Переглянути курс →
                  </span>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
