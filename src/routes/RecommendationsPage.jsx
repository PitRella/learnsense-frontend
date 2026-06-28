import { RecommendationsPanel } from '../components/RecommendationsPanel'
import styles from './cabinet.module.css'

export function RecommendationsPage() {
  return (
    <div>
      <header className={styles.head}>
        <h1 className={styles.title}>
          Персональні <em>рекомендації</em>
        </h1>
        <p className={styles.subtitle}>
          Поради системи на основі вашого цифрового сліду — оновлюються
          автоматично.
        </p>
      </header>
      <RecommendationsPanel />
    </div>
  )
}
