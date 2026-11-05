import { createContext, useContext, useEffect } from 'react'

const ThemeContext = createContext({ isDarkMode: false, toggleDarkMode: () => {} })

export function ThemeProvider({ children }) {
  useEffect(() => {
    document.documentElement.classList.remove('dark')
    localStorage.removeItem('theme_mode')
  }, [])

  return (
    <ThemeContext.Provider value={{ isDarkMode: false, toggleDarkMode: () => {} }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
