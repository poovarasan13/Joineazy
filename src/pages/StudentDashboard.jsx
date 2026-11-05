import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { isOverdue } from '../utils/dateHelpers'
import StudentTableView from '../components/student/StudentTableView'
import EmptyState from '../components/common/EmptyState'
import FilterBar from '../components/common/FilterBar'

const studentStatusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'not_submitted', label: 'Not submitted' },
]

function StudentDashboard({ activeNav, onSelectNav }) {
  const { currentUser } = useAuth()
  const { assignments, submissions, isSubmitted } = useData()

  // Local filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('earliest')

  // Sync with Sidebar navigation tab if changed
  useEffect(() => {
    if (activeNav === 'pending') {
      setStatusFilter('not_submitted')
    } else if (activeNav === 'submitted') {
      setStatusFilter('submitted')
    } else if (activeNav === 'all') {
      setStatusFilter('all')
    }
  }, [activeNav])

  // Filter assignments assigned to this student
  const myAssignments = assignments.filter((assignment) =>
    assignment.assignedTo.includes(currentUser.id)
  )

  // Metrics
  const totalCount = myAssignments.length
  const submittedCount = myAssignments.filter((assignment) =>
    isSubmitted(assignment.id, currentUser.id)
  ).length
  const pendingCount = totalCount - submittedCount
  const overdueCount = myAssignments.filter(
    (assignment) =>
      !isSubmitted(assignment.id, currentUser.id) && isOverdue(assignment.dueDate)
  ).length
  const completionPercentage =
    totalCount > 0 ? Math.round((submittedCount / totalCount) * 100) : 0

  // Filter by search & status
  const filteredAssignments = myAssignments.filter((assignment) => {
    const matchesSearch = assignment.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase().trim())
    if (!matchesSearch) return false

    const studentHasSubmitted = isSubmitted(assignment.id, currentUser.id)
    if (statusFilter === 'submitted') return studentHasSubmitted
    if (statusFilter === 'not_submitted') return !studentHasSubmitted

    return true
  })

  // Sort assignments
  filteredAssignments.sort((a, b) => {
    const timeA = new Date(a.dueDate).getTime()
    const timeB = new Date(b.dueDate).getTime()
    return sortBy === 'earliest' ? timeA - timeB : timeB - timeA
  })

  return (
    <div className="space-y-6">
      {/* Page Title & User Greeting */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Student Assignment Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Logged in as <strong className="text-slate-700">{currentUser.name}</strong> (@{currentUser.username})
        </p>
      </div>

      {/* KPI Stat Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Assigned */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Assigned Tasks
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            {totalCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Total course modules
          </div>
        </div>

        {/* Submitted */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Completed
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-2">
            {submittedCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {completionPercentage}% complete
          </div>
        </div>

        {/* Pending */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Pending
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-600 mt-2">
            {pendingCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Awaiting your solution
          </div>
        </div>

        {/* Overdue */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Overdue
            </span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-extrabold text-rose-600 mt-2">
            {overdueCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Passed deadline
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      {myAssignments.length > 0 && (
        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={(val) => {
            setStatusFilter(val)
            if (onSelectNav) {
              if (val === 'not_submitted') onSelectNav('pending')
              else if (val === 'submitted') onSelectNav('submitted')
              else onSelectNav('all')
            }
          }}
          statusOptions={studentStatusOptions}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      )}

      {/* Empty State when student has no assignments assigned */}
      {myAssignments.length === 0 ? (
        <EmptyState
          title="All Caught Up!"
          message="No assignments have been assigned to your account yet. Enjoy your free time!"
        />
      ) : filteredAssignments.length === 0 ? (
        /* Empty State when search/filter yields 0 results */
        <EmptyState
          title="No Matching Assignments"
          message="No tasks match your current search query or status filter."
          actionText="Clear filters"
          onAction={() => {
            setSearchTerm('')
            setStatusFilter('all')
            if (onSelectNav) onSelectNav('all')
          }}
        />
      ) : (
        /* Data Table View Only */
        <StudentTableView
          assignments={filteredAssignments}
          submissions={submissions}
        />
      )}
    </div>
  )
}

export default StudentDashboard