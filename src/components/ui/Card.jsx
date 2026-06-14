import styles from './Card.module.css'

const cx = (...c) => c.filter(Boolean).join(' ')

export function Card({
  padded = true,
  raised = false,
  accentTop = false,
  accentColor,
  className,
  style,
  ...props
}) {
  return (
    <div
      className={cx(
        styles.card,
        padded && styles.padded,
        raised && styles.raised,
        accentTop && styles.accentTop,
        className,
      )}
      style={accentColor ? { '--card-accent': accentColor, ...style } : style}
      {...props}
    />
  )
}
