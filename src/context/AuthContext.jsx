import { createContext, useContext, useState, useEffect } from 'react'
import { loadFromStorage, saveToStorage } from '../utils/storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Load existing logged-in user from localStorage on initial render
  const [currentUser, setCurrentUser] = useState(() => {
    return loadFromStorage('currentUser', null)
  })

  // Whenever currentUser changes, update localStorage
  useEffect(() => {
    saveToStorage('currentUser', currentUser)
  }, [currentUser])

  function login(user) {
    setCurrentUser(user)
  }

  function logout() {
    setCurrentUser(null)
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Helper hook to easily access auth state from any component
export function useAuth() {
  return useContext(AuthContext)
}

