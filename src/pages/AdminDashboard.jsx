import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import AdminAssignmentCard from '../components/admin/AdminAssignmentCard'
import AssignmentForm from '../components/admin/AssignmentForm'
import ConfirmDialog from '../components/common/ConfirmDialog'
import EmptyState from '../components/common/EmptyState'
import FilterBar from '../components/common/FilterBar'

const adminStatusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'completed', label: 'Completed' },
  { value: 'pending', label: 'Pending' },
]

function AdminDashboard() {
  const { currentUser } = useAuth()
  const { assignments, submissions, deleteAssignment } = useData()

  // Modal and dialog states
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [assignmentToDelete, setAssignmentToDelete] = useState(null)

  // Local filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('earliest')

  // Filter to show only assignments created by this admin
  const myAssignments = assignments.filter(
    (assignment) => assignment.createdBy === currentUser.id
  )

  // Check if an assignment has 100% submission completion
  function isAssignmentCompleted(assignment) {
    if (!assignment.assignedTo || assignment.assignedTo.length === 0) return false
    const submittedCount = submissions.filter(
      (sub) =>
        sub.assignmentId === assignment.id &&
        assignment.assignedTo.includes(sub.studentId)
    ).length
    return submittedCount === assignment.assignedTo.length
  }

  // Filter assignments by search term and completed/pending status
  const filteredAssignments = myAssignments.filter((assignment) => {
    // Title search
    const matchesSearch = assignment.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase().trim())
    if (!matchesSearch) return false

    // Status filter
    const isCompleted = isAssignmentCompleted(assignment)
    if (statusFilter === 'completed') return isCompleted
    if (statusFilter === 'pending') return !isCompleted

    return true
  })

  // Sort assignments by due date
  filteredAssignments.sort((a, b) => {
    const timeA = new Date(a.dueDate).getTime()
    const timeB = new Date(b.dueDate).getTime()
    return sortBy === 'earliest' ? timeA - timeB : timeB - timeA
  })

  // Open modal for "+ New Assignment"
  function handleOpenCreate() {
    setSelectedAssignment(null)
    setIsFormOpen(true)
  }

  // Open modal for editing an existing assignment
  function handleOpenEdit(assignment) {
    setSelectedAssignment(assignment)
    setIsFormOpen(true)
  }

  // Prompt delete confirmation dialog
  function handleOpenDelete(assignment) {
    setAssignmentToDelete(assignment)
  }

  // Execute delete after confirmation
  function handleConfirmDelete() {
    if (assignmentToDelete) {
      deleteAssignment(assignmentToDelete.id)
      setAssignmentToDelete(null)
    }
  }

  return (
    <div>
      {/* Header with Title and New Assignment Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Course Assignments
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your assignments, view student progress, and track submissions.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          aria-label="Create a new assignment"
          className="py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          + New Assignment
        </button>
      </div>

      {/* Toolbar filter displayed when assignments exist */}
      {myAssignments.length > 0 && (
        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          statusOptions={adminStatusOptions}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      )}

      {/* Empty State when no assignments have been created */}
      {myAssignments.length === 0 ? (
        <EmptyState
          icon="📝"
          title="No Assignments Found"
          message="You haven't created any assignments"
          actionText="Create one"
          onAction={handleOpenCreate}
        />
      ) : filteredAssignments.length === 0 ? (
        /* Empty State when filter/search produces 0 matches */
        <EmptyState
          icon="🔍"
          title="No results found"
          message="No assignments match your current search or filter criteria."
          actionText="Clear filters"
          onAction={() => {
            setSearchTerm('')
            setStatusFilter('all')
          }}
        />
      ) : (
        /* Responsive Grid: 1 col on mobile, 2 cols on tablet, 3 cols on desktop */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssignments.map((assignment) => (
            <AdminAssignmentCard
              key={assignment.id}
              assignment={assignment}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
            />
          ))}
        </div>
      )}

      {/* Assignment Create / Edit Modal Form */}
      <AssignmentForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        assignmentToEdit={selectedAssignment}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(assignmentToDelete)}
        title="Delete Assignment"
        message="Delete this assignment? Student submissions for it will also be removed."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setAssignmentToDelete(null)}
      />
    </div>
  )
}

export default AdminDashboard
