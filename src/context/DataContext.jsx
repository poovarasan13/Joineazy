import { createContext, useContext, useState, useEffect } from 'react'
import {
  assignments as initialAssignments,
  submissions as initialSubmissions,
  users,
} from '../data/seedData'
import { loadFromStorage, saveToStorage } from '../utils/storage'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  // Check if saved localStorage data is unparseable/corrupted
  const [hasStorageError, setHasStorageError] = useState(() => {
    try {
      const rawAssignments = localStorage.getItem('assignments')
      if (rawAssignments !== null) JSON.parse(rawAssignments)
      const rawSubmissions = localStorage.getItem('submissions')
      if (rawSubmissions !== null) JSON.parse(rawSubmissions)
      return false
    } catch {
      return true
    }
  })

  // Simulated initial loading delay (600ms) to show spinner on first load
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  // 1. Load assignments and submissions from localStorage (falls back to seed data)
  const [assignments, setAssignments] = useState(() => {
    return loadFromStorage('assignments', initialAssignments)
  })

  const [submissions, setSubmissions] = useState(() => {
    return loadFromStorage('submissions', initialSubmissions)
  })

  // 2. Automatically sync to localStorage whenever state changes (only if no error)
  useEffect(() => {
    if (!hasStorageError) {
      saveToStorage('assignments', assignments)
    }
  }, [assignments, hasStorageError])

  useEffect(() => {
    if (!hasStorageError) {
      saveToStorage('submissions', submissions)
    }
  }, [submissions, hasStorageError])

  // Reset corrupted data back to original seed data
  function resetData() {
    try {
      localStorage.removeItem('assignments')
      localStorage.removeItem('submissions')
    } catch (err) {
      console.error('Error resetting storage:', err)
    }
    setAssignments(initialAssignments)
    setSubmissions(initialSubmissions)
    saveToStorage('assignments', initialAssignments)
    saveToStorage('submissions', initialSubmissions)
    setHasStorageError(false)
  }

  // 3. Actions to manage assignments
  function addAssignment(data) {
    const newAssignment = {
      ...data,
      id: 'a_' + Date.now(),
    }
    setAssignments((prev) => [newAssignment, ...prev])
    return newAssignment
  }

  function updateAssignment(id, updatedFields) {
    setAssignments((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updatedFields } : item
      )
    )
  }

  function deleteAssignment(id) {
    setAssignments((prev) => prev.filter((item) => item.id !== id))
    setSubmissions((prev) => prev.filter((sub) => sub.assignmentId !== id))
  }

  // 4. Actions to manage submissions
  function markAsSubmitted(assignmentId, studentId) {
    const alreadySubmitted = submissions.some(
      (sub) => sub.assignmentId === assignmentId && sub.studentId === studentId
    )
    if (alreadySubmitted) return

    const newSubmission = {
      assignmentId,
      studentId,
      submittedAt: new Date().toISOString(),
    }
    setSubmissions((prev) => [...prev, newSubmission])
  }

  function isSubmitted(assignmentId, studentId) {
    return submissions.some(
      (sub) => sub.assignmentId === assignmentId && sub.studentId === studentId
    )
  }

  const value = {
    users,
    assignments,
    submissions,
    isLoading,
    hasStorageError,
    resetData,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    markAsSubmitted,
    isSubmitted,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  return useContext(DataContext)
}
