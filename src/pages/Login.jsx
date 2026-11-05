import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'

function Login() {
  const { login } = useAuth()
  const { users, addUser } = useData()

  const [authMode, setAuthMode] = useState('signin')

  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [autofillNotice, setAutofillNotice] = useState('')

  const [signupName, setSignupName] = useState('')
  const [signupUsername, setSignupUsername] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupRole, setSignupRole] = useState('student')
  const [signupError, setSignupError] = useState('')

  const [showPassword, setShowPassword] = useState(false)

  const demoAdmins = users.filter((u) => u.role === 'admin')
  const demoStudents = users.filter((u) => u.role === 'student')

  function handleSelectDemoAccount(user) {
    setAuthMode('signin')
    setLoginUsername(user.username || '')
    setLoginPassword(user.password || 'password123')
    setLoginError('')
    setAutofillNotice(`Loaded credentials for ${user.name}`)

    setTimeout(() => {
      setAutofillNotice('')
    }, 3500)
  }

  function handleSignInSubmit(e) {
    e.preventDefault()
    setLoginError('')

    const cleanUsername = loginUsername.trim().toLowerCase()
    const cleanPassword = loginPassword.trim()

    if (!cleanUsername || !cleanPassword) {
      setLoginError('Please enter both your username and password.')
      return
    }

    const matchedUser = users.find(
      (u) =>
        u.username.toLowerCase() === cleanUsername &&
        u.password === cleanPassword
    )

    if (!matchedUser) {
      setLoginError('Invalid username or password. Click any demo account below to autofill valid credentials.')
      return
    }

    login(matchedUser)
  }

  function handleSignUpSubmit(e) {
    e.preventDefault()
    setSignupError('')

    const cleanName = signupName.trim()
    const cleanUsername = signupUsername.trim().toLowerCase()
    const cleanPassword = signupPassword.trim()

    if (!cleanName) {
      setSignupError('Please enter your full name.')
      return
    }
    if (!cleanUsername) {
      setSignupError('Please choose a username.')
      return
    }
    if (cleanPassword.length < 4) {
      setSignupError('Password must be at least 4 characters long.')
      return
    }

    const exists = users.some((u) => u.username.toLowerCase() === cleanUsername)
    if (exists) {
      setSignupError('This username is already taken. Please choose another username.')
      return
    }

    const newUser = addUser({
      name: cleanName,
      username: cleanUsername,
      password: cleanPassword,
      role: signupRole,
    })

    login(newUser)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-indigo-500/20 mx-auto mb-3">
          J
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Joineazy Academic
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Assignment & review workspace for faculty and students
        </p>
      </div>

      <div className="max-w-md w-full bg-white border border-slate-200 shadow-sm rounded-2xl p-6 sm:p-8">
        <div className="mb-5">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            {authMode === 'signin' ? 'Sign in to your account' : 'Create a new account'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {authMode === 'signin'
              ? 'Enter your credentials or click a demo account below.'
              : 'Sign up as a student or professor to get started.'}
          </p>
        </div>

        <div className="flex rounded-xl bg-slate-100 p-1 mb-5 border border-slate-200/60">
          <button
            type="button"
            onClick={() => {
              setAuthMode('signin')
              setLoginError('')
              setSignupError('')
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
              authMode === 'signin'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('signup')
              setLoginError('')
              setSignupError('')
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
              authMode === 'signup'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            New User Sign Up
          </button>
        </div>

        {autofillNotice && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center justify-between">
            <span>{autofillNotice}</span>
            <span className="font-bold">✓ Autofilled</span>
          </div>
        )}

        {authMode === 'signin' && (
          <form onSubmit={handleSignInSubmit} className="space-y-4">
            {loginError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {loginError}
              </div>
            )}

            <div>
              <label
                htmlFor="login-username"
                className="block text-xs font-semibold text-slate-700 uppercase mb-1.5"
              >
                Username
              </label>
              <input
                id="login-username"
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="e.g. prof.sharma or aarav"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-xs font-semibold text-slate-700 uppercase mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-medium cursor-pointer"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl text-white font-semibold text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-700 transition shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Sign In to Dashboard
            </button>
          </form>
        )}

        {authMode === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="space-y-4">
            {signupError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {signupError}
              </div>
            )}

            <div>
              <label
                htmlFor="signup-name"
                className="block text-xs font-semibold text-slate-700 uppercase mb-1.5"
              >
                Full Name *
              </label>
              <input
                id="signup-name"
                type="text"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                placeholder="e.g. Dr. Rajesh Kumar or Meera Sen"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="signup-username"
                  className="block text-xs font-semibold text-slate-700 uppercase mb-1.5"
                >
                  Username *
                </label>
                <input
                  id="signup-username"
                  type="text"
                  value={signupUsername}
                  onChange={(e) => setSignupUsername(e.target.value)}
                  placeholder="e.g. rajesh"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="signup-password"
                  className="block text-xs font-semibold text-slate-700 uppercase mb-1.5"
                >
                  Password *
                </label>
                <input
                  id="signup-password"
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <span className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                Account Role *
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSignupRole('student')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                    signupRole === 'student'
                      ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-semibold text-xs text-slate-900">
                    Student
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Submit coursework & review
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSignupRole('admin')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                    signupRole === 'admin'
                      ? 'border-purple-600 bg-purple-50/60 ring-2 ring-purple-500/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-semibold text-xs text-slate-900">
                    Professor / Admin
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Author assignments & grades
                  </div>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl text-white font-semibold text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-700 transition shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mt-2"
            >
              Create Account & Sign In
            </button>
          </form>
        )}

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase">
            <span className="bg-white px-3 text-slate-500 font-bold tracking-wider">
              Click Demo Account to Autofill
            </span>
          </div>
        </div>

        <div className="space-y-3.5">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Faculty Admins
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {demoAdmins.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleSelectDemoAccount(user)}
                  className="flex items-center justify-between p-2 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-purple-50 hover:border-purple-300 transition text-left cursor-pointer group shadow-2xs"
                >
                  <div className="truncate pr-1">
                    <div className="text-xs font-semibold text-slate-900 group-hover:text-purple-600 truncate">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      @{user.username}
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 shrink-0">
                    Prof
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Enrolled Students
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {demoStudents.slice(0, 4).map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleSelectDemoAccount(user)}
                  className="flex items-center justify-between p-2 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-blue-50 hover:border-blue-300 transition text-left cursor-pointer group shadow-2xs"
                >
                  <div className="truncate pr-1">
                    <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 truncate">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      @{user.username}
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 shrink-0">
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
