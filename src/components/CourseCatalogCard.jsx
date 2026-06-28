import { Link } from 'react-router-dom'

import { useEnroll, useToggleFavorite } from '../hooks/useApi'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { Icon } from './ui/Icon'
import styles from '../routes/cabinet.module.css'

export function CourseCatalogCard({ course }) {
  const toggleFav = useToggleFavorite()
  const enroll = useEnroll()

  return (
    <Card className={styles.card}>
      <div className={styles.cardTop}>
        <span className={styles.cardTitle}>{course.title}</span>
        <button
          type="button"
          className={`${styles.star} ${course.is_favorite ? styles.starOn : ''}`}
          aria-label={course.is_favorite ? 'Прибрати з обраних' : 'В обрані'}
          disabled={toggleFav.isPending}
          onClick={() =>
            toggleFav.mutate({
              courseId: course.id,
              on: !course.is_favorite,
            })
          }
        >
          <Icon name="star" size={18} filled={course.is_favorite} />
        </button>
      </div>
      {course.description && (
        <p className={styles.cardDesc}>{course.description}</p>
      )}
      <div className={styles.cardFoot}>
        {course.is_enrolled ? (
          <Badge tone="pass">Записані</Badge>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            disabled={enroll.isPending}
            onClick={() => enroll.mutate(course.id)}
          >
            Записатися
          </Button>
        )}
        <Link to={`/courses/${course.id}`} className={styles.link}>
          Відкрити →
        </Link>
      </div>
    </Card>
  )
}
