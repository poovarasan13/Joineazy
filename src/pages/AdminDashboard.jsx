import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import AdminTableView from '../components/admin/AdminTableView'
import AssignmentForm from '../components/admin/AssignmentForm'
import ConfirmDialog from '../components/common/ConfirmDialog'
import EmptyState from '../components/common/EmptyState'
import FilterBar from '../components/common/FilterBar'

const adminStatusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'completed', label: '100% Completed' },
  { value: 'pending', label: 'Pending Submissions' },
]

function AdminDashboard({ activeNav, onSelectNav }) {
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

  // Sync with Sidebar navigation tab if changed
  useEffect(() => {
    if (activeNav === 'pending') {
      setStatusFilter('pending')
    } else if (activeNav === 'submitted') {
      setStatusFilter('completed')
    } else if (activeNav === 'all') {
      setStatusFilter('all')
    }
  }, [activeNav])

  // Filter only assignments created by this admin
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

  // Metrics
  const totalCount = myAssignments.length
  const completedCount = myAssignments.filter(isAssignmentCompleted).length
  const pendingCount = totalCount - completedCount
  const totalSubmissionsReceived = submissions.filter((sub) =>
    myAssignments.some(
      (a) => a.id === sub.assignmentId && a.assignedTo.includes(sub.studentId)
    )
  ).length

  // Filter assignments by search term and completed/pending status
  const filteredAssignments = myAssignments.filter((assignment) => {
    const matchesSearch = assignment.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase().trim())
    if (!matchesSearch) return false

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
    <div className="space-y-6">
      {/* Header with Title and Create Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Curriculum & Faculty Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Logged in as <strong className="text-slate-700">{currentUser.name}</strong> (@{currentUser.username})
          </p>
        </div>

        {/* "+ Create Assignment" Button */}
        <button
          type="button"
          onClick={handleOpenCreate}
          aria-label="Create a new assignment"
          className="inline-flex items-center gap-2 py-2 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm transition shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          <span>Create Assignment</span>
        </button>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Active Modules */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Active Modules
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            {totalCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Authored by you
          </div>
        </div>

        {/* 100% Completed */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              100% Completed
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-2">
            {completedCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Full class submission
          </div>
        </div>

        {/* Incomplete Classes */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Incomplete Classes
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-600 mt-2">
            {pendingCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Awaiting student work
          </div>
        </div>

        {/* Submissions Received */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Submissions
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-extrabold text-purple-600 mt-2">
            {totalSubmissionsReceived}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Individual student uploads
          </div>
        </div>
      </div>

      {/* Toolbar filter */}
      {myAssignments.length > 0 && (
        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={(val) => {
            setStatusFilter(val)
            if (onSelectNav) {
              if (val === 'pending') onSelectNav('pending')
              else if (val === 'completed') onSelectNav('submitted')
              else onSelectNav('all')
            }
          }}
          statusOptions={adminStatusOptions}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      )}

      {/* Empty State when no assignments created */}
      {myAssignments.length === 0 ? (
        <EmptyState
          title="No Assignments Created Yet"
          message="You have not published any assignments for this course. Click below to draft your first assignment."
          actionText="Create Assignment"
          onAction={handleOpenCreate}
        />
      ) : filteredAssignments.length === 0 ? (
        /* Empty State when filter/search produces 0 matches */
        <EmptyState
          title="No Matching Assignments"
          message="No tasks match your current filter or search criteria."
          actionText="Clear filters"
          onAction={() => {
            setSearchTerm('')
            setStatusFilter('all')
            if (onSelectNav) onSelectNav('all')
          }}
        />
      ) : (
        /* Data Table View Only */
        <AdminTableView
          assignments={filteredAssignments}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
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
        message="Are you sure you want to permanently delete this assignment? All associated student submissions and records will be removed."
        confirmText="Delete Assignment"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setAssignmentToDelete(null)}
      />
    </div>
  )
}

export default AdminDashboard