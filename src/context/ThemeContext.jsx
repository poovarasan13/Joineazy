import { createContext, useContext, useState, useEffect } from 'react'
import { loadFromStorage, saveToStorage } from '../utils/storage'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  // Load saved theme preference, defaulting to light
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return loadFromStorage('theme_mode', false)
  })

  // Whenever isDarkMode changes, sync the 'dark' class on <html> and save to localStorage
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    saveToStorage('theme_mode', isDarkMode)
  }, [isDarkMode])

  function toggleDarkMode() {
    setIsDarkMode((prev) => !prev)
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}

