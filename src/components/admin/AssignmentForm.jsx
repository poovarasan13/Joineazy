import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'

function AssignmentForm({ isOpen, onClose, assignmentToEdit }) {
  const { currentUser } = useAuth()
  const { users, addAssignment, updateAssignment } = useData()
  const titleInputRef = useRef(null)

  const students = users.filter((user) => user.role === 'student')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [driveLink, setDriveLink] = useState('')
  const [assignMode, setAssignMode] = useState('all')
  const [selectedStudentIds, setSelectedStudentIds] = useState([])

  const [errors, setErrors] = useState({})

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
      setTimeout(() => {
        titleInputRef.current?.focus()
      }, 50)
    }
  }, [assignmentToEdit, isOpen, students.length])

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

  function handleStudentCheckboxChange(studentId) {
    if (selectedStudentIds.includes(studentId)) {
      setSelectedStudentIds(selectedStudentIds.filter((id) => id !== studentId))
    } else {
      setSelectedStudentIds([...selectedStudentIds, studentId])
    }
  }

  function handleSubmit(e) {
    e.preventDefault()

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto transition-opacity duration-200"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 my-8 transition-all duration-200">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800 mb-5">
          <div>
            <h3
              id="assignment-form-title"
              className="text-lg font-bold text-slate-900 dark:text-white"
            >
              {assignmentToEdit ? 'Edit Assignment Details' : 'Create New Assignment'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Fill in the parameters and assign student rosters
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold leading-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-1"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="assignment-title"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1"
            >
              Assignment Title *
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
              placeholder="e.g. React State Management Lab"
              className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            />
            {errors.title && (
              <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="assignment-description"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1"
            >
              Description & Instructions
            </label>
            <textarea
              id="assignment-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline expectations, submission criteria, or relevant links..."
              className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="assignment-due-date"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1"
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
                className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              />
              {errors.dueDate && (
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.dueDate}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="assignment-drive-link"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1"
              >
                Google Drive Link *
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
                className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              />
              {errors.driveLink && (
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.driveLink}</p>
              )}
            </div>
          </div>

          <div>
            <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-2">
              Assign Students *
            </span>

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
                  className="text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
                />
                <label
                  htmlFor="assign-mode-all"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  All enrolled students ({students.length})
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
                  className="text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
                />
                <label
                  htmlFor="assign-mode-selected"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Selected students
                </label>
              </div>
            </div>

            {assignMode === 'selected' && (
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 space-y-2 bg-slate-50 dark:bg-slate-850 max-h-36 overflow-y-auto">
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
                        className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
                      />
                      <label
                        htmlFor={inputId}
                        className="text-sm text-slate-700 dark:text-slate-300 cursor-pointer select-none"
                      >
                        {student.name} <span className="text-xs text-slate-400">(@{student.username})</span>
                      </label>
                    </div>
                  )
                })}
              </div>
            )}

            {errors.students && (
              <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.students}</p>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2.5 sm:gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-xl transition shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
