import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import { AppShell } from './components/layout/AppShell'
import { Spinner } from './components/ui/Spinner'
import { useAuth } from './lib/auth'
import { LoginPage } from './routes/LoginPage'
import { RegisterPage } from './routes/RegisterPage'

// Code-split every authenticated surface so the login screen stays light.
const named = (loader, name) =>
  lazy(() => loader().then((m) => ({ default: m[name] })))

const Dashboard = named(() => import('./routes/Dashboard'), 'Dashboard')
const MyCoursesPage = named(
  () => import('./routes/MyCoursesPage'),
  'MyCoursesPage',
)
const CatalogPage = named(() => import('./routes/CatalogPage'), 'CatalogPage')
const FavoritesPage = named(
  () => import('./routes/FavoritesPage'),
  'FavoritesPage',
)
const CompletedPage = named(
  () => import('./routes/CompletedPage'),
  'CompletedPage',
)
const CertificatesPage = named(
  () => import('./routes/CertificatesPage'),
  'CertificatesPage',
)
const SettingsPage = named(
  () => import('./routes/SettingsPage'),
  'SettingsPage',
)
const RatingPage = named(() => import('./routes/RatingPage'), 'RatingPage')
const CoursePage = named(() => import('./routes/CoursePage'), 'CoursePage')
const ModulePerformancePage = named(
  () => import('./routes/ModulePerformancePage'),
  'ModulePerformancePage',
)
const MaterialPage = named(() => import('./routes/MaterialPage'), 'MaterialPage')

function RouteFallback() {
  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '50vh' }}>
      <Spinner size={22} label="Завантаження…" />
    </div>
  )
}

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return children
}

// Wrap a lazy element in the shared Suspense fallback.
function L({ children }) {
  return <Suspense fallback={<RouteFallback />}>{children}</Suspense>
}

// The home surface differs by role: course analytics for teachers,
// the "my courses" progress board for students.
function HomeIndex() {
  const { isTeacher } = useAuth()
  return <L>{isTeacher ? <Dashboard /> : <MyCoursesPage />}</L>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route index element={<HomeIndex />} />
        <Route path="catalog" element={<L><CatalogPage /></L>} />
        <Route path="favorites" element={<L><FavoritesPage /></L>} />
        <Route path="completed" element={<L><CompletedPage /></L>} />
        <Route path="certificates" element={<L><CertificatesPage /></L>} />
        <Route path="settings" element={<L><SettingsPage /></L>} />
        <Route path="rating" element={<L><RatingPage /></L>} />
        <Route path="courses/:courseId" element={<L><CoursePage /></L>} />
        <Route
          path="courses/:courseId/modules/:moduleId"
          element={<L><ModulePerformancePage /></L>}
        />
        <Route
          path="courses/:courseId/materials/:materialId"
          element={<L><MaterialPage /></L>}
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
