import { useAuth } from '../../context/AuthContext'

function Header() {
  const { currentUser, logout } = useAuth()

  const isAdmin = currentUser?.role === 'admin'
  const roleBadgeStyle = isAdmin
    ? 'bg-purple-50 text-purple-700 border-purple-200'
    : 'bg-indigo-50 text-indigo-700 border-indigo-200'

  const roleDotColor = isAdmin ? 'bg-purple-500' : 'bg-indigo-500'

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-md bg-white/90">
      <div className="max-w-6xl mx-auto px-4 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">
              Assignment & Review
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              Academic Dashboard
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/70">
            <span className="text-xs font-semibold text-slate-800">
              {currentUser?.name}
            </span>

            <span
              className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full border capitalize ${roleBadgeStyle}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${roleDotColor}`} />
              {currentUser?.role}
            </span>
          </div>

          <button
            type="button"
            onClick={logout}
            aria-label="Log out of account"
            className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
