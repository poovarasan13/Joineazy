import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import AdminAssignmentCard from '../components/admin/AdminAssignmentCard'
import AssignmentForm from '../components/admin/AssignmentForm'
import ConfirmDialog from '../components/common/ConfirmDialog'
import EmptyState from '../components/common/EmptyState'

function AdminDashboard() {
  const { currentUser } = useAuth()
  const { assignments, deleteAssignment } = useData()

  // State to control AssignmentForm modal
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState(null)

  // State to control Delete confirmation dialog
  const [assignmentToDelete, setAssignmentToDelete] = useState(null)

  // Filter to show only assignments created by this admin
  const myAssignments = assignments.filter(
    (assignment) => assignment.createdBy === currentUser.id
  )

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
          <h2 className="text-2xl font-bold text-gray-900">
            Course Assignments
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your assignments, view student progress, and track submissions.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition shadow-sm cursor-pointer"
        >
          + New Assignment
        </button>
      </div>

      {/* Empty State */}
      {myAssignments.length === 0 ? (
        <EmptyState
          icon="📝"
          title="No Assignments Found"
          message="You haven't created any assignments"
          actionText="Create one"
          onAction={handleOpenCreate}
        />
      ) : (
        /* Responsive Grid: 1 col on mobile, 2 cols on tablet, 3 cols on desktop */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myAssignments.map((assignment) => (
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
