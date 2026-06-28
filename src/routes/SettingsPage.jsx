import { Card } from '../components/ui/Card'
import { Spinner } from '../components/ui/Spinner'
import { useMe } from '../hooks/useApi'
import styles from './cabinet.module.css'

export function SettingsPage() {
  const { data: me, isLoading } = useMe()

  return (
    <div>
      <header className={styles.head}>
        <h1 className={styles.title}>
          Налаштування <em>профілю</em>
        </h1>
        <p className={styles.subtitle}>Дані вашого облікового запису.</p>
      </header>

      {isLoading || !me ? (
        <Spinner label="Завантаження…" />
      ) : (
        <Card>
          <div className={styles.profile}>
            <div className={styles.field}>
              <span>Імʼя</span>
              <span>
                {me.name} {me.surname}
              </span>
            </div>
            <div className={styles.field}>
              <span>Email</span>
              <span>{me.email}</span>
            </div>
            <div className={styles.field}>
              <span>Роль</span>
              <span>{me.role === 'TEACHER' ? 'Викладач' : 'Студент'}</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
