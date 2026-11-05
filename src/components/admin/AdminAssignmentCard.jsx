import { useState } from 'react'
import { useData } from '../../context/DataContext'
import { formatDate } from '../../utils/dateHelpers'
import ProgressBar from '../common/ProgressBar'

function AdminAssignmentCard({ assignment, onEdit, onDelete }) {
  const { users, submissions } = useData()

  // State to toggle the assigned student list
  const [isExpanded, setIsExpanded] = useState(false)

  // Get the list of student objects assigned to this task
  const assignedStudents = users.filter((user) =>
    assignment.assignedTo.includes(user.id)
  )

  // Count how many assigned students have submitted
  const submittedCount = submissions.filter(
    (sub) =>
      sub.assignmentId === assignment.id &&
      assignment.assignedTo.includes(sub.studentId)
  ).length

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      {/* Top Section */}
      <div>
        {/* Due Date & Assignment Count */}
        <div className="flex flex-wrap items-center justify-between gap-1 text-xs text-gray-500 dark:text-gray-400 mb-2">
          <span>
            Due: <strong className="text-gray-700 dark:text-gray-200">{formatDate(assignment.dueDate)}</strong>
          </span>

          <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium">
            {assignedStudents.length} Student{assignedStudents.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-snug break-words">
          {assignment.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3 break-words">
          {assignment.description}
        </p>

        {/* Drive Link */}
        <div className="mb-4">
          <a
            href={assignment.driveLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open Google Drive folder for ${assignment.title} in new tab`}
            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium inline-flex items-center gap-1 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          >
            Open Drive Folder ↗
          </a>
        </div>

        {/* Class Completion Progress Bar (always visible at top of card) */}
        <div className="bg-gray-50 dark:bg-gray-900/60 p-3 rounded-lg border border-gray-100 dark:border-gray-700/60 mb-3">
          <ProgressBar
            value={submittedCount}
            max={assignedStudents.length}
            label="Class Completion"
          />
        </div>

        {/* View Students Toggle Button */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? 'Collapse student list' : 'Expand student list'}
          className="w-full py-1.5 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-xs font-semibold text-gray-700 dark:text-gray-200 flex items-center justify-between transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span>
            {isExpanded ? 'Hide students' : 'View students'} ({assignedStudents.length})
          </span>
          <span className="text-gray-400 text-xs">
            {isExpanded ? '▲' : '▼'}
          </span>
        </button>

        {/* Expanded Student Submission Status List */}
        {isExpanded && (
          <div className="mt-3 border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-100 dark:divide-gray-750 max-h-48 overflow-y-auto bg-gray-50 dark:bg-gray-900/50">
            {assignedStudents.length === 0 ? (
              <p className="p-3 text-xs text-gray-500 dark:text-gray-400 text-center">
                No students assigned.
              </p>
            ) : (
              assignedStudents.map((student) => {
                const submission = submissions.find(
                  (s) =>
                    s.assignmentId === assignment.id &&
                    s.studentId === student.id
                )
                const isSubmitted = Boolean(submission)

                return (
                  <div
                    key={student.id}
                    className="p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition"
                  >
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {student.name}
                    </span>

                    {isSubmitted ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 text-green-800 border border-green-200 dark:bg-green-950/60 dark:text-green-300 dark:border-green-800 w-fit">
                        Submitted ({formatDate(submission.submittedAt)})
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800 w-fit">
                        Not submitted
                      </span>
                    )}
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>

      {/* Bottom Section: Edit & Delete Buttons */}
      <div className="pt-4 border-t border-gray-100 dark:border-gray-700/60 mt-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(assignment)}
            aria-label={`Edit ${assignment.title}`}
            className="flex-1 py-1.5 px-3 rounded-lg border border-gray-300 dark:border-gray-600 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(assignment)}
            aria-label={`Delete ${assignment.title}`}
            className="flex-1 py-1.5 px-3 rounded-lg border border-red-200 dark:border-red-900/60 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminAssignmentCard
