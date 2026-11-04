import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'

function AssignmentModal({ isOpen, onClose, assignmentToEdit }) {
  const { currentUser } = useAuth()
  const { users, addAssignment, updateAssignment } = useData()

  // Filter student accounts to assign tasks to
  const students = users.filter((u) => u.role === 'student')

  // Form fields
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [driveLink, setDriveLink] = useState('')
  const [assignedTo, setAssignedTo] = useState([])
  const [errorMessage, setErrorMessage] = useState('')

  // Pre-fill fields if editing, or reset if creating new
  useEffect(() => {
    if (assignmentToEdit) {
      setTitle(assignmentToEdit.title || '')
      setDescription(assignmentToEdit.description || '')
      setDueDate(assignmentToEdit.dueDate || '')
      setDriveLink(assignmentToEdit.driveLink || '')
      setAssignedTo(assignmentToEdit.assignedTo || [])
    } else {
      setTitle('')
      setDescription('')
      setDueDate('')
      setDriveLink('')
      // Default to assigning to all students for convenience
      setAssignedTo(students.map((s) => s.id))
    }
    setErrorMessage('')
  }, [assignmentToEdit, isOpen])

  if (!isOpen) return null

  // Toggle student selection checkbox
  function toggleStudent(studentId) {
    if (assignedTo.includes(studentId)) {
      setAssignedTo(assignedTo.filter((id) => id !== studentId))
    } else {
      setAssignedTo([...assignedTo, studentId])
    }
  }

  // Toggle select/deselect all students
  function handleSelectAll() {
    if (assignedTo.length === students.length) {
      setAssignedTo([])
    } else {
      setAssignedTo(students.map((s) => s.id))
    }
  }

  function handleSubmit(e) {
    e.preventDefault()

    // Basic validation
    if (!title.trim()) {
      setErrorMessage('Please enter an assignment title.')
      return
    }
    if (!dueDate) {
      setErrorMessage('Please select a due date.')
      return
    }
    if (!driveLink.trim()) {
      setErrorMessage('Please provide a Google Drive folder link.')
      return
    }
    if (assignedTo.length === 0) {
      setErrorMessage('Please assign this task to at least one student.')
      return
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      dueDate,
      driveLink: driveLink.trim(),
      assignedTo,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-200 my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            {assignmentToEdit ? 'Edit Assignment' : 'Create New Assignment'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-red-700">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. React Hooks Practice"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Instructions or requirements for the students..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Due Date *
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Drive Link *
              </label>
              <input
                type="url"
                value={driveLink}
                onChange={(e) => setDriveLink(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Student Assignment Checkboxes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-gray-700 uppercase">
                Assign to Students * ({assignedTo.length} selected)
              </label>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
              >
                {assignedTo.length === students.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="max-h-36 overflow-y-auto border border-gray-200 rounded-lg p-2.5 space-y-2 bg-gray-50">
              {students.map((student) => {
                const checked = assignedTo.includes(student.id)
                return (
                  <label
                    key={student.id}
                    className="flex items-center gap-2.5 text-sm text-gray-700 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleStudent(student.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                    />
                    <span>{student.name}</span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition cursor-pointer"
            >
              {assignmentToEdit ? 'Save Changes' : 'Create Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AssignmentModal

