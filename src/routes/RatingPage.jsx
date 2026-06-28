import { Card } from '../components/ui/Card'
import { Icon } from '../components/ui/Icon'
import { Spinner } from '../components/ui/Spinner'
import {
  useCourseRating,
  useCourses,
  useMe,
  useMyRating,
} from '../hooks/useApi'
import { useAuth } from '../lib/auth'
import styles from './cabinet.module.css'
import rstyles from './RatingPage.module.css'

// Gold / silver / bronze for the top three places.
const MEDAL_COLOR = ['#caa015', '#9aa1ad', '#b06a34']

function Rank({ rank }) {
  if (rank >= 1 && rank <= 3) {
    return (
      <Icon name="medal" size={20} style={{ color: MEDAL_COLOR[rank - 1] }} />
    )
  }
  return <>{rank}</>
}

function Leaderboard({ courseId, title, meId }) {
  const { data, isLoading } = useCourseRating(courseId)
  if (isLoading) return <Spinner label="…" />
  const rows = data || []
  return (
    <Card className={rstyles.board}>
      {title && <div className={rstyles.boardTitle}>{title}</div>}
      {rows.map((r) => (
        <div
          key={r.student_id}
          className={`${rstyles.row} ${r.student_id === meId ? rstyles.me : ''}`}
        >
          <span className={rstyles.rank}>
            <Rank rank={r.rank} />
          </span>
          <span className={rstyles.name}>
            {r.name} {r.surname}
          </span>
          <span className={`${rstyles.score} tnum`}>
            {Math.round(r.score * 100)}
          </span>
        </div>
      ))}
      {rows.length === 0 && (
        <p style={{ color: 'var(--ink-faint)' }}>Поки що немає студентів.</p>
      )}
    </Card>
  )
}

export function RatingPage() {
  const { isTeacher, userId } = useAuth()
  const { data: me } = useMe()
  const myRating = useMyRating()
  const courses = useCourses()

  if (isTeacher) {
    const mine = (courses.data || []).filter((c) => c.teacher_id === userId)
    return (
      <div>
        <header className={styles.head}>
          <h1 className={styles.title}>
            Рейтинг <em>студентів</em>
          </h1>
          <p className={styles.subtitle}>
            Інтелектуальний рейтинг враховує успішність, спроби,
            регулярність та активність - не лише бали.
          </p>
        </header>
        <div className={rstyles.boards}>
          {mine.map((c) => (
            <Leaderboard
              key={c.id}
              courseId={c.id}
              title={c.title}
              meId={null}
            />
          ))}
        </div>
      </div>
    )
  }

  const entries = myRating.data || []
  return (
    <div>
      <header className={styles.head}>
        <h1 className={styles.title}>
          Мій <em>рейтинг</em>
        </h1>
        <p className={styles.subtitle}>
          Ваше місце в курсах за комплексним показником.
        </p>
      </header>

      {myRating.isLoading ? (
        <Spinner label="Завантаження…" />
      ) : entries.length === 0 ? (
        <div className={styles.state}>
          <p>Запишіться на курс, щоб побачити свій рейтинг.</p>
        </div>
      ) : (
        <div className={rstyles.boards}>
          {entries.map((e) => (
            <div key={e.course_id} className={rstyles.section}>
              <div className={rstyles.standing}>
                <span className={rstyles.bigRank}>
                  #{e.rank}
                  <span className={rstyles.ofTotal}>з {e.total_students}</span>
                </span>
                <div>
                  <div className={rstyles.courseTitle}>{e.title}</div>
                  <div className={rstyles.percentile}>
                    Топ {e.percentile}% · бал {Math.round(e.score * 100)}
                  </div>
                </div>
              </div>
              <Leaderboard courseId={e.course_id} meId={me?.id ?? userId} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
