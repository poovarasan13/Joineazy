import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import AdminAssignmentCard from '../components/admin/AdminAssignmentCard'

function AdminDashboard() {
  const { currentUser } = useAuth()
  const { assignments, submissions } = useData()

  // Filter to show only assignments created by this admin
  const myAssignments = assignments.filter(
    (assignment) => assignment.createdBy === currentUser.id
  )

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

        {/* Placeholder button for creating new assignments */}
        <button
          type="button"
          className="py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition shadow-sm cursor-pointer"
        >
          + New Assignment
        </button>
      </div>

      {/* Empty State */}
      {myAssignments.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
          You haven't created any assignments yet. Click "+ New Assignment" to get started.
        </div>
      ) : (
        /* Responsive Grid: 1 col on mobile, 2 cols on tablet, 3 cols on desktop */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myAssignments.map((assignment) => {
            // Count submissions from students who were assigned to this task
            const submittedCount = submissions.filter(
              (sub) =>
                sub.assignmentId === assignment.id &&
                assignment.assignedTo.includes(sub.studentId)
            ).length

            return (
              <AdminAssignmentCard
                key={assignment.id}
                assignment={assignment}
                submittedCount={submittedCount}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
