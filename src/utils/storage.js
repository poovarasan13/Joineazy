
export function loadFromStorage(key, fallback) {
  try {
    const savedData = localStorage.getItem(key)
      if (savedData === null) {
      return fallback
    }
    return JSON.parse(savedData)
  } catch (error) {
    console.error(`Error reading key "${key}" from localStorage:`, error)
    return fallback
  }
}

export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error writing key "${key}" to localStorage:`, error)
  }
}

