import { Link } from 'react-router-dom'

import { Icon } from './ui/Icon'
import { Logo } from './ui/Logo'
import styles from '../routes/LoginPage.module.css'

const FEATURES = [
  {
    icon: 'trendingUp',
    title: 'Індекс успішності в реальному часі',
    text: 'Оцінки, активність і регулярність зводяться в один зрозумілий показник.',
  },
  {
    icon: 'lightbulb',
    title: 'Персональні рекомендації',
    text: 'Що повторити, який тест перескласти і коли переходити до нової теми.',
  },
  {
    icon: 'compass',
    title: 'Аналітика для викладача',
    text: 'Теплові карти, рейтинги та оцінка складності матеріалів курсу.',
  },
]

// The left-hand brand panel shared by the login and register screens:
// a route home, the product pitch, and three concrete capabilities so the
// screen reads as a real product rather than an empty form.
export function AuthAside({ kicker, title, lede }) {
  return (
    <section className={styles.brand}>
      <div className={styles.brandTop}>
        <Link to="/" className={styles.backHome}>
          <Icon name="arrowLeft" size={15} />
          На головну
        </Link>
        <Logo size={24} />
      </div>

      <div className={styles.brandCopy}>
        <p className={styles.kicker}>{kicker}</p>
        <h1 className={styles.headline}>{title}</h1>
        <p className={styles.lede}>{lede}</p>
      </div>

      <ul className={styles.featureList}>
        {FEATURES.map((feature) => (
          <li key={feature.title} className={styles.feature}>
            <span className={styles.featureIcon} aria-hidden="true">
              <Icon name={feature.icon} size={18} />
            </span>
            <span className={styles.featureText}>
              <b>{feature.title}</b>
              <span>{feature.text}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
