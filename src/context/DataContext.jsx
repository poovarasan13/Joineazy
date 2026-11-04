import { createContext, useContext, useState, useEffect } from 'react'
import {
  assignments as initialAssignments,
  submissions as initialSubmissions,
  users,
} from '../data/seedData'
import { loadFromStorage, saveToStorage } from '../utils/storage'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  // 1. Load assignments and submissions from localStorage (falls back to seed data)
  const [assignments, setAssignments] = useState(() => {
    return loadFromStorage('assignments', initialAssignments)
  })

  const [submissions, setSubmissions] = useState(() => {
    return loadFromStorage('submissions', initialSubmissions)
  })

  // 2. Automatically sync to localStorage whenever state changes
  useEffect(() => {
    saveToStorage('assignments', assignments)
  }, [assignments])

  useEffect(() => {
    saveToStorage('submissions', submissions)
  }, [submissions])

  // 3. Actions to manage assignments
  function addAssignment(data) {
    const newAssignment = {
      ...data,
      id: 'a_' + Date.now(), // simple unique id generator
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
    // Remove the assignment
    setAssignments((prev) => prev.filter((item) => item.id !== id))
    // Also remove any related student submissions
    setSubmissions((prev) => prev.filter((sub) => sub.assignmentId !== id))
  }

  // 4. Actions to manage submissions
  function markAsSubmitted(assignmentId, studentId) {
    // Avoid duplicate submissions
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
    addAssignment,
    updateAssignment,
    deleteAssignment,
    markAsSubmitted,
    isSubmitted,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

// Helper hook to consume data context anywhere in the app
export function useData() {
  return useContext(DataContext)
}

