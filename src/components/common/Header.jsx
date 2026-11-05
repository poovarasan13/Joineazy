import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

function Header() {
  const { currentUser, logout } = useAuth()
  const { isDarkMode, toggleDarkMode } = useTheme()

  // Pick distinct badge styling based on role
  const isAdmin = currentUser?.role === 'admin'
  const roleBadgeStyle = isAdmin
    ? 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800'
    : 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* App Title */}
        <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
          Assignment Dashboard
        </h1>

        {/* User Info & Actions */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
          {/* Dark Mode Toggle Button */}
          <button
            type="button"
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-sm transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>

          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {currentUser?.name}
          </span>

          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border capitalize ${roleBadgeStyle}`}
          >
            {currentUser?.role}
          </span>

          <button
            type="button"
            onClick={logout}
            aria-label="Log out of account"
            className="text-sm px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
