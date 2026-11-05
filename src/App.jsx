import { ThemeProvider } from './context/ThemeContext'
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

  // 1. Initial 600ms loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors">
        <Spinner text="Loading assignments..." />
      </div>
    )
  }

  // 2. LocalStorage corruption error state
  if (hasStorageError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors">
        <ErrorMessage
          title="Data Storage Error"
          message="Saved assignment data in your browser is unreadable or corrupted. Click below to restore the default seed data."
          actionText="Reset data"
          onAction={resetData}
        />
      </div>
    )
  }

  // 3. If not logged in, show the login page
  if (!currentUser) {
    return <Login />
  }

  // 4. If logged in, wrap the view inside the shared Layout
  return (
    <Layout>
      {currentUser.role === 'admin' ? (
        <AdminDashboard />
      ) : (
        <StudentDashboard />
      )}
    </Layout>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
