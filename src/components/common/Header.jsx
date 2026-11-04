import { useAuth } from '../../context/AuthContext'

function Header() {
  const { currentUser, logout } = useAuth()

  // Pick distinct badge styling based on role
  const isAdmin = currentUser?.role === 'admin'
  const roleBadgeStyle = isAdmin
    ? 'bg-purple-100 text-purple-800 border-purple-200'
    : 'bg-blue-100 text-blue-800 border-blue-200'

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* App Title */}
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">
          Assignment Dashboard
        </h1>

        {/* User Info & Actions */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">
            {currentUser?.name}
          </span>

          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border capitalize ${roleBadgeStyle}`}
          >
            {currentUser?.role}
          </span>

          <button
            onClick={logout}
            className="text-sm px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header

