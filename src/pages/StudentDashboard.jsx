import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import AssignmentCard from '../components/student/AssignmentCard'
import ProgressSummary from '../components/student/ProgressSummary'
import EmptyState from '../components/common/EmptyState'
import FilterBar from '../components/common/FilterBar'

const studentStatusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'not_submitted', label: 'Not submitted' },
]

function StudentDashboard() {
  const { currentUser } = useAuth()
  const { assignments, submissions, isSubmitted } = useData()

  // Local filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('earliest')

  // Filter only assignments assigned to this student
  const myAssignments = assignments.filter((assignment) =>
    assignment.assignedTo.includes(currentUser.id)
  )

  // Count how many of this student's assigned tasks have been submitted
  const submittedCount = myAssignments.filter((assignment) =>
    isSubmitted(assignment.id, currentUser.id)
  ).length

  // Apply search and status filters
  const filteredAssignments = myAssignments.filter((assignment) => {
    // Search by title
    const matchesSearch = assignment.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase().trim())
    if (!matchesSearch) return false

    // Filter by submission status
    const studentHasSubmitted = isSubmitted(assignment.id, currentUser.id)
    if (statusFilter === 'submitted') return studentHasSubmitted
    if (statusFilter === 'not_submitted') return !studentHasSubmitted

    return true
  })

  // Sort assignments by due date
  filteredAssignments.sort((a, b) => {
    const timeA = new Date(a.dueDate).getTime()
    const timeB = new Date(b.dueDate).getTime()
    return sortBy === 'earliest' ? timeA - timeB : timeB - timeA
  })

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Assignments
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
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

      {/* Toolbar */}
      {myAssignments.length > 0 && (
        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          statusOptions={studentStatusOptions}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      )}

      {/* Empty State when student has no assignments assigned at all */}
      {myAssignments.length === 0 ? (
        <EmptyState
          icon="🎉"
          title="All Caught Up!"
          message="No assignments yet. Enjoy the free time!"
        />
      ) : filteredAssignments.length === 0 ? (
        /* Empty State when search/filter yields 0 results */
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
          {filteredAssignments.map((assignment) => {
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
