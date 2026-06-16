import { motion } from 'motion/react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '../components/ui/Button'
import { Field } from '../components/ui/Field'
import { Logo } from '../components/ui/Logo'
import { api, ApiError } from '../lib/api'
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

const ROLES = [
  { value: 'STUDENT', label: 'Студент' },
  { value: 'TEACHER', label: 'Викладач' },
]

export function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    role: 'STUDENT',
  })
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      await api.signup(form)
      await login(form.email, form.password)
      navigate('/', { replace: true })
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setError('Цей email вже зареєстровано.')
      } else if (err instanceof ApiError && err.status === 422) {
        setError('Перевірте поля: пароль має містити щонайменше 8 символів.')
      } else {
        setError(err?.detail || 'Не вдалося створити акаунт.')
      }
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
            Приєднуйтесь
          </motion.p>
          <motion.h1
            className={styles.headline}
            variants={reveal}
            initial="hidden"
            animate="show"
            custom={2}
          >
            Почніть <em>вимірювати</em> прогрес.
          </motion.h1>
          <motion.p
            className={styles.lede}
            variants={reveal}
            initial="hidden"
            animate="show"
            custom={3}
          >
            Один обліковий запис — для студентів і викладачів. Роль
            визначає, що ви побачите далі.
          </motion.p>
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
            <h2>Створити акаунт</h2>
            <p>Заповніть дані — і одразу до системи.</p>
          </div>

          {error && <div className={styles.errorBox}>{error}</div>}

          <div className={styles.roleToggle}>
            {ROLES.map((r) => (
              <button
                key={r.value}
                type="button"
                className={`${styles.roleBtn} ${
                  form.role === r.value ? styles.roleActive : ''
                }`}
                onClick={() => setForm((f) => ({ ...f, role: r.value }))}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className={styles.row2}>
            <Field
              label="Імʼя"
              value={form.name}
              onChange={set('name')}
              required
            />
            <Field
              label="Прізвище"
              value={form.surname}
              onChange={set('surname')}
              required
            />
          </div>
          <Field
            label="Email"
            type="email"
            autoComplete="username"
            placeholder="you@learnsense.io"
            value={form.email}
            onChange={set('email')}
            required
          />
          <Field
            label="Пароль"
            type="password"
            autoComplete="new-password"
            placeholder="щонайменше 8 символів"
            value={form.password}
            onChange={set('password')}
            required
          />

          <Button type="submit" block disabled={busy}>
            {busy ? 'Створення…' : 'Зареєструватися'}
          </Button>

          <p className={styles.foot}>
            Вже маєте акаунт? <Link to="/login">Увійти</Link>
          </p>
        </motion.form>
      </section>
    </div>
  )
}
