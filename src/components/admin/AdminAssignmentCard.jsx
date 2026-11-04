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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col justify-between hover:shadow-md transition">
      {/* Top Section */}
      <div>
        {/* Due Date & Assignment Count */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>
            Due: <strong className="text-gray-700">{formatDate(assignment.dueDate)}</strong>
          </span>

          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-medium">
            {assignedStudents.length} Student{assignedStudents.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
          {assignment.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {assignment.description}
        </p>

        {/* Drive Link */}
        <div className="mb-4">
          <a
            href={assignment.driveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 hover:underline"
          >
            Open Drive Folder ↗
          </a>
        </div>

        {/* Class Completion Progress Bar (always visible at top of card) */}
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-3">
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
          className="w-full py-1.5 px-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center justify-between transition cursor-pointer"
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
          <div className="mt-3 border border-gray-200 rounded-lg divide-y divide-gray-100 max-h-48 overflow-y-auto bg-gray-50">
            {assignedStudents.length === 0 ? (
              <p className="p-3 text-xs text-gray-500 text-center">
                No students assigned.
              </p>
            ) : (
              assignedStudents.map((student) => {
                // Find submission record for this specific student and assignment
                const submission = submissions.find(
                  (s) =>
                    s.assignmentId === assignment.id &&
                    s.studentId === student.id
                )
                const isSubmitted = Boolean(submission)

                return (
                  <div
                    key={student.id}
                    className="p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs bg-white hover:bg-gray-50 transition"
                  >
                    <span className="font-medium text-gray-800">
                      {student.name}
                    </span>

                    {isSubmitted ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 text-green-800 border border-green-200 w-fit">
                        Submitted ({formatDate(submission.submittedAt)})
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200 w-fit">
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
      <div className="pt-4 border-t border-gray-100 mt-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(assignment)}
            className="flex-1 py-1.5 px-3 rounded-lg border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(assignment)}
            className="flex-1 py-1.5 px-3 rounded-lg border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50 transition cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminAssignmentCard
