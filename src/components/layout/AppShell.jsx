import { NavLink, Outlet } from 'react-router-dom'

import { useMe } from '../../hooks/useApi'
import { useAuth } from '../../lib/auth'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'
import { Logo } from '../ui/Logo'
import styles from './AppShell.module.css'

const cx = (...c) => c.filter(Boolean).join(' ')

const STUDENT_NAV = [
  { to: '/', label: 'Мої курси', icon: 'grid', end: true },
  { to: '/catalog', label: 'Каталог', icon: 'library' },
  { to: '/favorites', label: 'Обрані', icon: 'star' },
  { to: '/completed', label: 'Завершені', icon: 'checkCircle' },
  { to: '/certificates', label: 'Сертифікати', icon: 'award' },
  { to: '/rating', label: 'Рейтинг', icon: 'trendingUp' },
  { to: '/settings', label: 'Налаштування', icon: 'settings' },
]

const TEACHER_NAV = [
  { to: '/', label: 'Курси', icon: 'grid', end: true },
  { to: '/rating', label: 'Рейтинг', icon: 'trendingUp' },
  { to: '/settings', label: 'Налаштування', icon: 'settings' },
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
              <span className={styles.icon}>
                <Icon name={item.icon} size={18} />
              </span>
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
