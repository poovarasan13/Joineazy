import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import AssignmentCard from '../components/student/AssignmentCard'
import ProgressSummary from '../components/student/ProgressSummary'
import EmptyState from '../components/common/EmptyState'

function StudentDashboard() {
  const { currentUser } = useAuth()
  const { assignments, submissions, isSubmitted } = useData()

  // Filter only assignments assigned to this student
  const myAssignments = assignments.filter((assignment) =>
    assignment.assignedTo.includes(currentUser.id)
  )

  // Count how many of this student's assigned tasks have been submitted
  const submittedCount = myAssignments.filter((assignment) =>
    isSubmitted(assignment.id, currentUser.id)
  ).length

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          My Assignments
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back, {currentUser.name}. Track your tasks and record submissions.
        </p>
      </div>

      {/* Progress Summary at the top */}
      {myAssignments.length > 0 && (
        <ProgressSummary
          total={myAssignments.length}
          submittedCount={submittedCount}
        />
      )}

      {/* Empty State */}
      {myAssignments.length === 0 ? (
        <EmptyState
          icon="🎉"
          title="All Caught Up!"
          message="No assignments yet. Enjoy the free time!"
        />
      ) : (
        /* Responsive Grid: 1 col on mobile, 2 cols on tablet, 3 cols on desktop */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myAssignments.map((assignment) => {
            const studentSubmitted = isSubmitted(assignment.id, currentUser.id)
            const submissionRecord = submissions.find(
              (sub) =>
                sub.assignmentId === assignment.id &&
                sub.studentId === currentUser.id
            )

            return (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                isSubmitted={studentSubmitted}
                submittedAt={submissionRecord?.submittedAt}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default StudentDashboard
