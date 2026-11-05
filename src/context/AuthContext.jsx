import { createContext, useContext, useState, useEffect } from 'react'
import { loadFromStorage, saveToStorage } from '../utils/storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    return loadFromStorage('currentUser', null)
  })

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

export function useAuth() {
  return useContext(AuthContext)
}
