import { motion } from 'motion/react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { AuthAside } from '../components/AuthAside'
import { Button } from '../components/ui/Button'
import { Field } from '../components/ui/Field'
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
      <AuthAside
        kicker="Навчальна аналітика"
        title={
          <>
            Помічайте ризик <em>раніше</em> за дедлайн.
          </>
        }
        lede="LearnSense зводить успішність кожного студента в один індекс і підказує, кому потрібна увага вже сьогодні."
      />

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
            <h2>З поверненням</h2>
            <p>Увійдіть, щоб продовжити роботу з платформою.</p>
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
            Немає акаунту? <Link to="/register">Зареєструватися</Link>
          </p>
        </motion.form>
      </section>
    </div>
  )
}
