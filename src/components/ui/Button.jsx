import styles from './Button.module.css'

const cx = (...c) => c.filter(Boolean).join(' ')

export function Button({
  variant = 'primary',
  size,
  block = false,
  className,
  ...props
}) {
  return (
    <button
      className={cx(
        styles.btn,
        styles[variant],
        size && styles[size],
        block && styles.block,
        className,
      )}
      {...props}
    />
  )
}
