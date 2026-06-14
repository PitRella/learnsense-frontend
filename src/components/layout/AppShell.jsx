import { NavLink, Outlet } from 'react-router-dom'

import { useAuth } from '../../lib/auth'
import { Button } from '../ui/Button'
import { Logo } from '../ui/Logo'
import styles from './AppShell.module.css'

const cx = (...c) => c.filter(Boolean).join(' ')

export function AppShell() {
  const { role, logout } = useAuth()
  const roleLabel = role === 'TEACHER' ? 'Викладач' : 'Студент'

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <NavLink to="/" aria-label="LearnSense">
          <Logo />
        </NavLink>
        <nav className={styles.nav}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              cx(styles.navlink, isActive && styles.active)
            }
          >
            Огляд
          </NavLink>
        </nav>
        <div className={styles.right}>
          <span className={styles.role}>{roleLabel}</span>
          <Button variant="ghost" size="sm" onClick={logout}>
            Вийти
          </Button>
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
