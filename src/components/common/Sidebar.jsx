import { useAuth } from '../../context/AuthContext'

function Sidebar({ mobileOpen, onCloseMobile, activeNav = 'all', onSelectNav }) {
  const { currentUser, logout } = useAuth()

  const isAdmin = currentUser?.role === 'admin'

  const navItems = [
    {
      id: 'all',
      label: 'All Assignments',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      ),
    },
    {
      id: 'pending',
      label: isAdmin ? 'Incomplete Classes' : 'Pending Tasks',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'submitted',
      label: isAdmin ? '100% Completed' : 'Completed Work',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ]

  return (
    <>
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-white text-slate-700 border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 shadow-xs ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          <div className="h-16 px-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                J
              </div>
              <div>
                <span className="font-bold text-slate-900 text-sm tracking-tight block">
                  Joineazy Academic
                </span>
                <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block">
                  Workspace OS
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onCloseMobile}
              className="md:hidden text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="p-3 space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Workspace Views
            </div>

            {navItems.map((item) => {
              const active = activeNav === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (onSelectNav) onSelectNav(item.id)
                    if (onCloseMobile) onCloseMobile()
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    active
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span className={active ? 'text-indigo-600' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="p-3 border-t border-slate-100 space-y-2">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <div className="truncate">
              <div className="text-xs font-semibold text-slate-900 truncate">
                {currentUser?.name}
              </div>
              <div className="text-[10px] text-slate-500 font-mono capitalize">
                {currentUser?.role}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-slate-200 transition cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
