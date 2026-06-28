import { useMemo, useState } from 'react'

import { CourseCatalogCard } from '../components/CourseCatalogCard'
import { Spinner } from '../components/ui/Spinner'
import { useCatalog } from '../hooks/useApi'
import styles from './cabinet.module.css'

export function CatalogPage() {
  const { data, isLoading } = useCatalog()
  const [query, setQuery] = useState('')

  const courses = useMemo(() => {
    const all = data || []
    const q = query.trim().toLowerCase()
    if (!q) return all
    return all.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.description || '').toLowerCase().includes(q),
    )
  }, [data, query])

  return (
    <div>
      <header className={styles.head}>
        <h1 className={styles.title}>
          Каталог <em>курсів</em>
        </h1>
        <p className={styles.subtitle}>
          Знайдіть дисципліну, додайте в обрані або запишіться на курс.
        </p>
      </header>

      <input
        className={styles.search}
        type="search"
        placeholder="Пошук за назвою або описом…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {isLoading ? (
        <Spinner label="Завантаження каталогу…" />
      ) : courses.length === 0 ? (
        <div className={styles.state}>
          <p>Нічого не знайдено за запитом «{query}».</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {courses.map((c) => (
            <CourseCatalogCard key={c.id} course={c} />
          ))}
        </div>
      )}
    </div>
  )
}
