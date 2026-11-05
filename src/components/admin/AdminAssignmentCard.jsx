import { useState } from 'react'
import { useData } from '../../context/DataContext'
import { formatDate } from '../../utils/dateHelpers'
import ProgressBar from '../common/ProgressBar'

function AdminAssignmentCard({ assignment, onEdit, onDelete }) {
  const { users, submissions } = useData()

  const [isExpanded, setIsExpanded] = useState(false)

  const assignedStudents = users.filter((user) =>
    assignment.assignedTo.includes(user.id)
  )

  const submittedCount = submissions.filter(
    (sub) =>
      sub.assignmentId === assignment.id &&
      assignment.assignedTo.includes(sub.studentId)
  ).length

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-0.5 transition-all duration-200">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-1 text-xs text-slate-500 dark:text-slate-400 mb-2.5">
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Due: <strong className="text-slate-700 dark:text-slate-200 font-medium">{formatDate(assignment.dueDate)}</strong>
          </span>

          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold border border-slate-200 dark:border-slate-700">
            {assignedStudents.length} Assigned
          </span>
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 leading-snug break-words">
          {assignment.title}
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3 break-words">
          {assignment.description}
        </p>

        <div className="mb-4">
          <a
            href={assignment.driveLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open Google Drive folder for ${assignment.title} in new tab`}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold inline-flex items-center gap-1 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
          >
            Drive Folder ↗
          </a>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 mb-3">
          <ProgressBar
            value={submittedCount}
            max={assignedStudents.length}
            label="Class Completion"
          />
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? 'Collapse student list' : 'Expand student list'}
          className="w-full py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-between transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <span>
            {isExpanded ? 'Hide student roster' : 'View student roster'} ({assignedStudents.length})
          </span>
          <span className="text-slate-400 text-xs">
            {isExpanded ? '▲' : '▼'}
          </span>
        </button>

        {isExpanded && (
          <div className="mt-2.5 border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 max-h-48 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/50">
            {assignedStudents.length === 0 ? (
              <p className="p-3 text-xs text-slate-500 dark:text-slate-400 text-center">
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
                    className="p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {student.name}
                    </span>

                    {isSubmitted ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Submitted ({formatDate(submission.submittedAt)})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800 w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
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

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(assignment)}
            aria-label={`Edit ${assignment.title}`}
            className="flex-1 py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(assignment)}
            aria-label={`Delete ${assignment.title}`}
            className="flex-1 py-1.5 px-3 rounded-xl border border-rose-200 dark:border-rose-900/60 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminAssignmentCard
