import { NavLink, Outlet } from 'react-router-dom'

import { useMe } from '../../hooks/useApi'
import { useAuth } from '../../lib/auth'
import { Button } from '../ui/Button'
import { Logo } from '../ui/Logo'
import styles from './AppShell.module.css'

const cx = (...c) => c.filter(Boolean).join(' ')

const STUDENT_NAV = [
  { to: '/', label: 'Мої курси', icon: '◫', end: true },
  { to: '/catalog', label: 'Каталог', icon: '⊞' },
  { to: '/favorites', label: 'Обрані', icon: '★' },
  { to: '/completed', label: 'Завершені', icon: '✓' },
  { to: '/certificates', label: 'Сертифікати', icon: '🎓' },
  { to: '/recommendations', label: 'Рекомендації', icon: '✦' },
  { to: '/rating', label: 'Рейтинг', icon: '↑' },
  { to: '/achievements', label: 'Досягнення', icon: '🏅' },
  { to: '/settings', label: 'Налаштування', icon: '⚙' },
]

const TEACHER_NAV = [
  { to: '/', label: 'Курси', icon: '◫', end: true },
  { to: '/rating', label: 'Рейтинг', icon: '↑' },
  { to: '/settings', label: 'Налаштування', icon: '⚙' },
]

export function AppShell() {
  const { role, logout } = useAuth()
  const { data: me } = useMe()
  const isTeacher = role === 'TEACHER'
  const nav = isTeacher ? TEACHER_NAV : STUDENT_NAV
  const initial = (me?.name || '?').charAt(0).toUpperCase()

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <NavLink to="/" className={styles.brand} aria-label="LearnSense">
          <Logo />
        </NavLink>

        <nav className={styles.navGroup}>
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cx(styles.navlink, isActive && styles.active)
              }
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.navlabel}>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.user}>
          <div className={styles.userRow}>
            <span className={styles.avatar}>{initial}</span>
            <span className={styles.userMeta}>
              <span className={styles.userName}>
                {me ? `${me.name} ${me.surname}` : '…'}
              </span>
              <span className={styles.userRole}>
                {isTeacher ? 'Викладач' : 'Студент'}
              </span>
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={logout}>
            Вийти
          </Button>
        </div>
      </aside>

      <div className={styles.content}>
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
