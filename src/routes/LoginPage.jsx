import { motion } from 'motion/react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Button } from '../components/ui/Button'
import { Field } from '../components/ui/Field'
import { Logo } from '../components/ui/Logo'
import { useAuth } from '../lib/auth'
import styles from './LoginPage.module.css'

const reveal = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  }),
}

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  const from = location.state?.from?.pathname || '/'

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(
        err?.status === 401
          ? 'Невірний email або пароль.'
          : err?.detail || 'Не вдалося увійти. Спробуйте ще раз.',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={styles.wrap}>
      <section className={styles.brand}>
        <motion.div variants={reveal} initial="hidden" animate="show" custom={0}>
          <Logo size={24} />
        </motion.div>

        <div>
          <motion.p
            className={styles.kicker}
            variants={reveal}
            initial="hidden"
            animate="show"
            custom={1}
          >
            Навчальна аналітика · проактивно
          </motion.p>
          <motion.h1
            className={styles.headline}
            variants={reveal}
            initial="hidden"
            animate="show"
            custom={2}
          >
            Успіх, <em>виміряний</em> вчасно.
          </motion.h1>
          <motion.p
            className={styles.lede}
            variants={reveal}
            initial="hidden"
            animate="show"
            custom={3}
          >
            Інтегральний індекс успішності, зони ризику та персональні
            рекомендації — щоб допомогти студенту до дедлайну, а не після.
          </motion.p>

          <motion.div
            className={styles.metaRow}
            variants={reveal}
            initial="hidden"
            animate="show"
            custom={4}
          >
            <div className={styles.metaItem}>
              <b>w₁·A + w₂·B + w₃·T</b>
              <span>інтегральний індекс</span>
            </div>
            <div className={styles.metaItem}>
              <b>cos(u,v)</b>
              <span>гібридні рекомендації</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className={styles.panel}>
        <motion.form
          className={styles.form}
          onSubmit={onSubmit}
          variants={reveal}
          initial="hidden"
          animate="show"
          custom={2}
        >
          <div className={styles.formHead}>
            <h2>Вхід до системи</h2>
            <p>Увійдіть, щоб перейти до аналітичної панелі.</p>
          </div>

          {error && <div className={styles.errorBox}>{error}</div>}

          <Field
            label="Email"
            type="email"
            autoComplete="username"
            placeholder="teacher@learnsense.io"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Field
            label="Пароль"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" block disabled={busy}>
            {busy ? 'Вхід…' : 'Увійти'}
          </Button>

          <p className={styles.foot}>
            Демо-стек: FastAPI · Celery · PostgreSQL · Redis
          </p>
        </motion.form>
      </section>
    </div>
  )
}
