import { useMe, useMyProgress } from '../hooks/useApi'
import { Spinner } from '../components/ui/Spinner'
import styles from './cabinet.module.css'

export function CertificatesPage() {
  const { data, isLoading } = useMyProgress()
  const { data: me } = useMe()
  const eligible = (data || []).filter((c) => c.certificate_eligible)

  return (
    <div>
      <header className={styles.head}>
        <h1 className={styles.title}>
          Мої <em>сертифікати</em>
        </h1>
        <p className={styles.subtitle}>
          Сертифікат стає доступним після опанування всіх модулів курсу.
        </p>
      </header>

      {isLoading ? (
        <Spinner label="Завантаження…" />
      ) : eligible.length === 0 ? (
        <div className={styles.state}>
          <p>
            Поки що немає доступних сертифікатів. Завершіть усі модулі курсу,
            щоб отримати його.
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          {eligible.map((c) => (
            <div key={c.course_id} className={styles.cert}>
              <span className={styles.certSeal}>🎓</span>
              <span className={styles.certName}>{c.title}</span>
              <span className={styles.certMeta}>
                Сертифікат про успішне завершення
              </span>
              <span className={styles.certMeta}>
                {me ? `${me.name} ${me.surname}` : ''} · індекс{' '}
                {c.avg_index.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
