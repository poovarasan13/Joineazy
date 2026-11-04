import { useAuth } from '../context/AuthContext'
import { users } from '../data/seedData'

function Login() {
  const { login } = useAuth()

  // Separate seeded users into two groups
  const admins = users.filter((user) => user.role === 'admin')
  const students = users.filter((user) => user.role === 'student')

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8 max-w-2xl w-full">
        {/* Title Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Assignment Dashboard
          </h1>
          <p className="text-gray-500 text-sm">
            Select an account to log in instantly (no password required)
          </p>
        </div>

        {/* User Groups Grid: 1 column on mobile, 2 columns on tablet/desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Admins Group */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Professors / Admins
            </h2>
            <div className="space-y-3">
              {admins.map((user) => (
                <button
                  key={user.id}
                  onClick={() => login(user)}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 hover:border-purple-300 transition text-left"
                >
                  <span className="font-medium text-gray-900">{user.name}</span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-200 text-purple-800">
                    Admin
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Students Group */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Students
            </h2>
            <div className="space-y-3">
              {students.map((user) => (
                <button
                  key={user.id}
                  onClick={() => login(user)}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-300 transition text-left"
                >
                  <span className="font-medium text-gray-900">{user.name}</span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-200 text-blue-800">
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

