import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { users } from '../data/seedData'

function Login() {
  const { login } = useAuth()
  const { isDarkMode, toggleDarkMode } = useTheme()

  // Separate seeded users into two groups
  const admins = users.filter((user) => user.role === 'admin')
  const students = users.filter((user) => user.role === 'student')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 max-w-2xl w-full relative transition-colors">
        {/* Dark Mode Toggle on Login Screen */}
        <div className="absolute top-4 right-4">
          <button
            type="button"
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-sm transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Title Header */}
        <div className="text-center mb-8 pt-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Assignment Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Select an account to log in instantly (no password required)
          </p>
        </div>

        {/* User Groups Grid: 1 column on mobile, 2 columns on tablet/desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Admins Group */}
          <div>
            <h2 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Professors / Admins
            </h2>
            <div className="space-y-3">
              {admins.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => login(user)}
                  aria-label={`Log in as ${user.name} (Admin)`}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl border border-purple-200 dark:border-purple-800/60 bg-purple-50/70 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-900/40 hover:border-purple-300 dark:hover:border-purple-700 transition text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-200 text-purple-800 dark:bg-purple-900/80 dark:text-purple-300">
                    Admin
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Students Group */}
          <div>
            <h2 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Students
            </h2>
            <div className="space-y-3">
              {students.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => login(user)}
                  aria-label={`Log in as ${user.name} (Student)`}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl border border-blue-200 dark:border-blue-800/60 bg-blue-50/70 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:border-blue-300 dark:hover:border-blue-700 transition text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-200 text-blue-800 dark:bg-blue-900/80 dark:text-blue-300">
                    Student
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
