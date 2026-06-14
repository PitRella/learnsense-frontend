import { useId } from 'react'

import styles from './Field.module.css'

export function Field({ label, hint, error, className, ...inputProps }) {
  const id = useId()
  return (
    <div className={`${styles.field} ${className || ''}`}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      )}
      <input id={id} className={styles.input} {...inputProps} />
      {error ? (
        <span className={styles.error}>{error}</span>
      ) : hint ? (
        <span className={styles.hint}>{hint}</span>
      ) : null}
    </div>
  )
}
