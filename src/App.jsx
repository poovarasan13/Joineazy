import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { DataProvider, useData } from './context/DataContext'
import Login from './pages/Login'
import Layout from './components/common/Layout'
import StudentDashboard from './pages/StudentDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Spinner from './components/common/Spinner'
import ErrorMessage from './components/common/ErrorMessage'

// Decides which screen to show based on loading state, storage errors, login status, and role
function AppContent() {
  const { currentUser } = useAuth()
  const { isLoading, hasStorageError, resetData } = useData()
  const [activeNav, setActiveNav] = useState('all')

  // Enforce pure white/light theme across the app
  useEffect(() => {
    document.documentElement.classList.remove('dark')
    localStorage.removeItem('theme_mode')
  }, [])

  // 1. Initial loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Spinner text="Loading your workspace..." />
      </div>
    )
  }

  // 2. LocalStorage corruption error state
  if (hasStorageError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <ErrorMessage
          title="Data Storage Error"
          message="Saved assignment data in your browser is unreadable or corrupted. Click below to restore the default seed data."
          actionText="Reset data"
          onAction={resetData}
        />
      </div>
    )
  }

  // 3. If not logged in, show the split-screen enterprise login/register portal
  if (!currentUser) {
    return <Login />
  }

  // 4. If logged in, wrap the view inside the shared Layout shell with persistent sidebar
  return (
    <Layout activeNav={activeNav} onSelectNav={setActiveNav}>
      {currentUser.role === 'admin' ? (
        <AdminDashboard activeNav={activeNav} onSelectNav={setActiveNav} />
      ) : (
        <StudentDashboard activeNav={activeNav} onSelectNav={setActiveNav} />
      )}
    </Layout>
  )
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  )
}

export default App