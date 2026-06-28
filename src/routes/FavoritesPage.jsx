import { CourseCatalogCard } from '../components/CourseCatalogCard'
import { Spinner } from '../components/ui/Spinner'
import { useCatalog } from '../hooks/useApi'
import styles from './cabinet.module.css'

export function FavoritesPage() {
  const { data, isLoading } = useCatalog()
  const favorites = (data || []).filter((c) => c.is_favorite)

  return (
    <div>
      <header className={styles.head}>
        <h1 className={styles.title}>
          Обрані <em>курси</em>
        </h1>
        <p className={styles.subtitle}>Курси, які ви додали в закладки.</p>
      </header>

      {isLoading ? (
        <Spinner label="Завантаження…" />
      ) : favorites.length === 0 ? (
        <div className={styles.state}>
          <p>Поки що немає обраних курсів. Додайте їх ★ у каталозі.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {favorites.map((c) => (
            <CourseCatalogCard key={c.id} course={c} />
          ))}
        </div>
      )}
    </div>
  )
}
