import { motion } from 'motion/react'
import { Link } from 'react-router-dom'

import { Icon } from '../components/ui/Icon'
import { Logo } from '../components/ui/Logo'
import styles from './LandingPage.module.css'

const FEATURES = [
  {
    icon: 'trendingUp',
    title: 'Інтегральний індекс успішності',
    text: 'Оцінки, залученість і регулярність зводяться в один показник за формулою w1·A + w2·B + w3·T.',
  },
  {
    icon: 'alertTriangle',
    title: 'Раннє виявлення зон ризику',
    text: 'Студенти, що починають відставати, підсвічуються до дедлайну, а не після нього.',
  },
  {
    icon: 'lightbulb',
    title: 'Персональні рекомендації',
    text: 'Дванадцять сценаріїв: повторити теорію, перескласти тест, перейти до нової теми.',
  },
  {
    icon: 'compass',
    title: 'Глибока аналітика курсу',
    text: 'Теплові карти, рейтинги, оцінка складності матеріалів і готовність до атестації.',
  },
]

const STEPS = [
  {
    n: '01',
    title: 'Студент навчається',
    text: 'Проходить лекції та тести, а платформа фіксує його цифровий слід.',
  },
  {
    n: '02',
    title: 'Система рахує індекс',
    text: 'Метрики нормалізуються, обчислюється інтегральний показник успішності.',
  },
  {
    n: '03',
    title: 'Усі отримують підказки',
    text: 'Студент бачить персональні рекомендації, викладач бачить зони ризику.',
  },
]

const reveal = {
  hidden: { opacity: 0, y: 18 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.06 * i, duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  }),
}

function HeroVisual() {
  // A self-contained "index gauge" mock so the hero reads as a product.
  return (
    <div className={styles.heroCard} aria-hidden="true">
      <div className={styles.heroCardHead}>
        <span className={styles.heroCardLabel}>Індекс успішності</span>
        <span className={styles.heroCardTag}>модуль активний</span>
      </div>
      <svg viewBox="0 0 200 116" className={styles.gauge}>
        <path
          d="M16 104 A 84 84 0 0 1 184 104"
          fill="none"
          stroke="var(--hairline-strong)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M16 104 A 84 84 0 0 1 169 60"
          fill="none"
          stroke="var(--pine)"
          strokeWidth="14"
          strokeLinecap="round"
        />
      </svg>
      <div className={styles.heroScore}>
        <span className={styles.heroScoreNum}>0.78</span>
        <span className={styles.heroScoreNote}>вище порогу 0.50</span>
      </div>
      <div className={styles.heroBars}>
        {[0.82, 0.64, 0.9].map((v, i) => (
          <span key={i} className={styles.heroBarTrack}>
            <span className={styles.heroBar} style={{ width: `${v * 100}%` }} />
          </span>
        ))}
      </div>
    </div>
  )
}

export function LandingPage() {
  return (
    <div className={styles.page}>
      <header className={styles.nav}>
        <Link to="/" className={styles.navBrand} aria-label="LearnSense">
          <Logo />
        </Link>
        <nav className={styles.navActions}>
          <Link to="/login" className={styles.navLogin}>
            Увійти
          </Link>
          <Link to="/register" className={styles.cta}>
            Реєстрація
          </Link>
        </nav>
      </header>

      <main>
        <section className={styles.hero}>
          <motion.div
            className={styles.heroCopy}
            initial="hidden"
            animate="show"
          >
            <motion.p className={styles.kicker} variants={reveal} custom={0}>
              Інтелектуальний моніторинг успішності
            </motion.p>
            <motion.h1 className={styles.title} variants={reveal} custom={1}>
              Бачте, кому потрібна допомога, <em>поки ще не пізно</em>.
            </motion.h1>
            <motion.p className={styles.lede} variants={reveal} custom={2}>
              LearnSense зводить оцінки, активність і час у навчанні в єдиний
              індекс успішності, виявляє зони ризику та надає персональні
              рекомендації кожному студенту.
            </motion.p>
            <motion.div
              className={styles.heroActions}
              variants={reveal}
              custom={3}
            >
              <Link to="/register" className={styles.cta}>
                Почати безкоштовно
              </Link>
              <Link to="/login" className={styles.ctaGhost}>
                Увійти
                <Icon name="arrowRight" size={16} />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            variants={reveal}
            custom={2}
            initial="hidden"
            animate="show"
          >
            <HeroVisual />
          </motion.div>
        </section>

        <section className={styles.stats}>
          <div className={styles.stat}>
            <b>1</b>
            <span>індекс замість десятка таблиць</span>
          </div>
          <div className={styles.stat}>
            <b>12</b>
            <span>сценаріїв рекомендацій</span>
          </div>
          <div className={styles.stat}>
            <b>3</b>
            <span>метрики: оцінки, активність, час</span>
          </div>
        </section>

        <section className={styles.section} id="features">
          <p className={styles.sectionKicker}>Можливості</p>
          <h2 className={styles.sectionTitle}>
            Усе, щоб не втратити жодного студента
          </h2>
          <div className={styles.featureGrid}>
            {FEATURES.map((feature) => (
              <div key={feature.title} className={styles.featureCard}>
                <span className={styles.featureIcon}>
                  <Icon name={feature.icon} size={20} />
                </span>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureText}>{feature.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <p className={styles.sectionKicker}>Як це працює</p>
          <h2 className={styles.sectionTitle}>Три кроки від даних до дії</h2>
          <div className={styles.steps}>
            {STEPS.map((step) => (
              <div key={step.n} className={styles.step}>
                <span className={styles.stepNum}>{step.n}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepText}>{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.finalCta}>
          <h2 className={styles.finalTitle}>
            Готові побачити успішність по-новому?
          </h2>
          <p className={styles.finalText}>
            Створіть акаунт за хвилину і одразу почніть працювати з курсами.
          </p>
          <Link to="/register" className={styles.cta}>
            Створити акаунт
          </Link>
        </section>
      </main>

      <footer className={styles.footer}>
        <Logo muted />
        <span className={styles.footerNote}>
          Інтелектуальний моніторинг успішності студентів.
        </span>
      </footer>
    </div>
  )
}
