import { AuthProvider, useAuth } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import Login from './pages/Login'
import Layout from './components/common/Layout'
import StudentDashboard from './pages/StudentDashboard'
import AdminDashboard from './pages/AdminDashboard'

// Decides which screen to show based on login status and role
function AppContent() {
  const { currentUser } = useAuth()

  // 1. If not logged in, show the login page
  if (!currentUser) {
    return <Login />
  }

  // 2. If logged in, wrap the view inside the shared Layout
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
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  )
}

export default App
