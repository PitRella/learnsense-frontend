import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import { AppShell } from './components/layout/AppShell'
import { Spinner } from './components/ui/Spinner'
import { useAuth } from './lib/auth'
import { LoginPage } from './routes/LoginPage'
import { RegisterPage } from './routes/RegisterPage'

// Code-split the authenticated surfaces so the login screen stays light.
const Dashboard = lazy(() =>
  import('./routes/Dashboard').then((m) => ({ default: m.Dashboard })),
)
const StudentDashboard = lazy(() =>
  import('./routes/StudentDashboard').then((m) => ({
    default: m.StudentDashboard,
  })),
)
const CoursePage = lazy(() =>
  import('./routes/CoursePage').then((m) => ({ default: m.CoursePage })),
)
const ModulePerformancePage = lazy(() =>
  import('./routes/ModulePerformancePage').then((m) => ({
    default: m.ModulePerformancePage,
  })),
)
const MaterialPage = lazy(() =>
  import('./routes/MaterialPage').then((m) => ({ default: m.MaterialPage })),
)

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

// The home surface differs by role: analytics for teachers, courses +
// personalized recommendations for students.
function HomeIndex() {
  const { isTeacher } = useAuth()
  return (
    <Suspense fallback={<RouteFallback />}>
      {isTeacher ? <Dashboard /> : <StudentDashboard />}
    </Suspense>
  )
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
        <Route
          path="courses/:courseId"
          element={
            <Suspense fallback={<RouteFallback />}>
              <CoursePage />
            </Suspense>
          }
        />
        <Route
          path="courses/:courseId/modules/:moduleId"
          element={
            <Suspense fallback={<RouteFallback />}>
              <ModulePerformancePage />
            </Suspense>
          }
        />
        <Route
          path="courses/:courseId/materials/:materialId"
          element={
            <Suspense fallback={<RouteFallback />}>
              <MaterialPage />
            </Suspense>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
