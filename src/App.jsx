import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { DataProvider, useData } from './context/DataContext'
import Login from './pages/Login'
import Layout from './components/common/Layout'
import StudentDashboard from './pages/StudentDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Spinner from './components/common/Spinner'
import ErrorMessage from './components/common/ErrorMessage'

function AppContent() {
  const { currentUser } = useAuth()
  const { isLoading, hasStorageError, resetData } = useData()
  const [activeNav, setActiveNav] = useState('all')

  useEffect(() => {
    document.documentElement.classList.remove('dark')
    localStorage.removeItem('theme_mode')
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Spinner text="Loading your workspace..." />
      </div>
    )
  }

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

  if (!currentUser) {
    return <Login />
  }

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
