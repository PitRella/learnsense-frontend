import styles from './cabinet.module.css'

export function PlaceholderPage({ title, note }) {
  return (
    <div>
      <header className={styles.head}>
        <h1 className={styles.title}>{title}</h1>
      </header>
      <div className={styles.state}>
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)' }}>
          Розділ зʼявиться незабаром
        </p>
        <p>{note}</p>
      </div>
    </div>
  )
}
