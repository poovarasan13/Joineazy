import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'

function AssignmentForm({ isOpen, onClose, assignmentToEdit }) {
  const { currentUser } = useAuth()
  const { users, addAssignment, updateAssignment } = useData()
  const titleInputRef = useRef(null)

  // Get list of all students
  const students = users.filter((user) => user.role === 'student')

  // Form field states
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [driveLink, setDriveLink] = useState('')
  const [assignMode, setAssignMode] = useState('all') // 'all' or 'selected'
  const [selectedStudentIds, setSelectedStudentIds] = useState([])

  // Validation error messages mapped by field name
  const [errors, setErrors] = useState({})

  // Initialize form state when opened or when assignmentToEdit changes
  useEffect(() => {
    if (assignmentToEdit) {
      setTitle(assignmentToEdit.title || '')
      setDescription(assignmentToEdit.description || '')
      setDueDate(assignmentToEdit.dueDate || '')
      setDriveLink(assignmentToEdit.driveLink || '')

      const isAll = assignmentToEdit.assignedTo?.length === students.length
      setAssignMode(isAll ? 'all' : 'selected')
      setSelectedStudentIds(assignmentToEdit.assignedTo || [])
    } else {
      setTitle('')
      setDescription('')
      setDueDate('')
      setDriveLink('')
      setAssignMode('all')
      setSelectedStudentIds([])
    }
    setErrors({})

    if (isOpen) {
      // Focus the first interactive field when opened
      setTimeout(() => {
        titleInputRef.current?.focus()
      }, 50)
    }
  }, [assignmentToEdit, isOpen, students.length])

  // Close modal on Escape key press
  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Checkbox toggle for student selection
  function handleStudentCheckboxChange(studentId) {
    if (selectedStudentIds.includes(studentId)) {
      setSelectedStudentIds(selectedStudentIds.filter((id) => id !== studentId))
    } else {
      setSelectedStudentIds([...selectedStudentIds, studentId])
    }
  }

  function handleSubmit(e) {
    e.preventDefault()

    // Validation checks
    const newErrors = {}

    if (!title.trim()) {
      newErrors.title = 'Title is required.'
    }

    if (!dueDate) {
      newErrors.dueDate = 'Due date is required.'
    }

    const trimmedDriveLink = driveLink.trim()
    if (!trimmedDriveLink) {
      newErrors.driveLink = 'Drive link is required.'
    } else if (!trimmedDriveLink.startsWith('http://') && !trimmedDriveLink.startsWith('https://')) {
      newErrors.driveLink = 'Drive link must start with http:// or https://'
    }

    if (assignMode === 'selected' && selectedStudentIds.length === 0) {
      newErrors.students = 'At least one student must be selected.'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const finalAssignedTo =
      assignMode === 'all'
        ? students.map((s) => s.id)
        : selectedStudentIds

    const payload = {
      title: title.trim(),
      description: description.trim(),
      dueDate,
      driveLink: trimmedDriveLink,
      assignedTo: finalAssignedTo,
    }

    if (assignmentToEdit) {
      updateAssignment(assignmentToEdit.id, payload)
    } else {
      addAssignment({
        ...payload,
        createdBy: currentUser.id,
      })
    }

    onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="assignment-form-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto transition-opacity duration-200"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700 my-8 transition-all duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700 mb-5">
          <h3
            id="assignment-form-title"
            className="text-xl font-bold text-gray-900 dark:text-white"
          >
            {assignmentToEdit ? 'Edit Assignment' : 'New Assignment'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl font-bold leading-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
          >
            ×
          </button>
        </div>

        {/* Assignment Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Field */}
          <div>
            <label
              htmlFor="assignment-title"
              className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1"
            >
              Title *
            </label>
            <input
              ref={titleInputRef}
              id="assignment-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (errors.title) setErrors({ ...errors, title: '' })
              }}
              placeholder="e.g. React Hooks Practice"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
            {errors.title && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label
              htmlFor="assignment-description"
              className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1"
            >
              Description
            </label>
            <textarea
              id="assignment-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide assignment details or instructions..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-colors"
            />
          </div>

          {/* Due Date & Drive Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="assignment-due-date"
                className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1"
              >
                Due Date *
              </label>
              <input
                id="assignment-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value)
                  if (errors.dueDate) setErrors({ ...errors, dueDate: '' })
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
              {errors.dueDate && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.dueDate}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="assignment-drive-link"
                className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1"
              >
                Drive Link *
              </label>
              <input
                id="assignment-drive-link"
                type="text"
                value={driveLink}
                onChange={(e) => {
                  setDriveLink(e.target.value)
                  if (errors.driveLink) setErrors({ ...errors, driveLink: '' })
                }}
                placeholder="https://drive.google.com/..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
              {errors.driveLink && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.driveLink}</p>
              )}
            </div>
          </div>

          {/* Assign To Section */}
          <div>
            <span className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-2">
              Assign To *
            </span>

            {/* Radios: All students vs Selected students */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-3">
              <div className="flex items-center gap-2">
                <input
                  id="assign-mode-all"
                  type="radio"
                  name="assignMode"
                  value="all"
                  checked={assignMode === 'all'}
                  onChange={() => {
                    setAssignMode('all')
                    if (errors.students) setErrors({ ...errors, students: '' })
                  }}
                  className="text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                />
                <label
                  htmlFor="assign-mode-all"
                  className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  All students ({students.length})
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="assign-mode-selected"
                  type="radio"
                  name="assignMode"
                  value="selected"
                  checked={assignMode === 'selected'}
                  onChange={() => setAssignMode('selected')}
                  className="text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                />
                <label
                  htmlFor="assign-mode-selected"
                  className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  Selected students
                </label>
              </div>
            </div>

            {/* Checkbox list when 'Selected students' is chosen */}
            {assignMode === 'selected' && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-2 bg-gray-50 dark:bg-gray-900/50 max-h-36 overflow-y-auto">
                {students.map((student) => {
                  const isChecked = selectedStudentIds.includes(student.id)
                  const inputId = `student-${student.id}`

                  return (
                    <div key={student.id} className="flex items-center gap-2.5">
                      <input
                        id={inputId}
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          handleStudentCheckboxChange(student.id)
                          if (errors.students) setErrors({ ...errors, students: '' })
                        }}
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                      />
                      <label
                        htmlFor={inputId}
                        className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none"
                      >
                        {student.name}
                      </label>
                    </div>
                  )
                })}
              </div>
            )}

            {errors.students && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.students}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2.5 sm:gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {assignmentToEdit ? 'Save Changes' : 'Create Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AssignmentForm
