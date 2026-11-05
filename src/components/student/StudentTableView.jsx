import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { formatDate, isOverdue } from '../../utils/dateHelpers'
import SubmissionModal from './SubmissionModal'

function StudentTableView({ assignments, submissions }) {
  const { currentUser } = useAuth()
  const { markAsSubmitted } = useData()

  const [activeAssignment, setActiveAssignment] = useState(null)

  function handleStartSubmit(assignment) {
    setActiveAssignment(assignment)
  }

  function handleSubmitSolution(studentDriveLink) {
    if (activeAssignment) {
      markAsSubmitted(activeAssignment.id, currentUser.id, studentDriveLink)
      setActiveAssignment(null)
    }
  }

  function handleCloseModal() {
    setActiveAssignment(null)
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-colors">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th scope="col" className="py-3 px-4 sm:px-6">
                Assignment
              </th>
              <th scope="col" className="py-3 px-4">
                Due Date
              </th>
              <th scope="col" className="py-3 px-4">
                Resources
              </th>
              <th scope="col" className="py-3 px-4">
                Status
              </th>
              <th scope="col" className="py-3 px-4 sm:px-6 text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
            {assignments.map((assignment) => {
              const submissionRecord = submissions.find(
                (s) =>
                  s.assignmentId === assignment.id &&
                  s.studentId === currentUser.id
              )
              const isSubmitted = Boolean(submissionRecord)
              const overdue = !isSubmitted && isOverdue(assignment.dueDate)

              return (
                <tr
                  key={assignment.id}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  <td className="py-4 px-4 sm:px-6">
                    <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {assignment.title}
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 max-w-md">
                      {assignment.description}
                    </div>
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-xs text-slate-700">
                      <svg
                        className="w-3.5 h-3.5 text-slate-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="font-medium">
                        {formatDate(assignment.dueDate)}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    <a
                      href={assignment.driveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open Course Google Drive folder for ${assignment.title}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/60 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <span>Drive</span>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {isSubmitted ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Submitted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Pending
                        </span>
                      )}

                      {overdue && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          Overdue
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-4 sm:px-6 whitespace-nowrap text-right">
                    {isSubmitted ? (
                      <div className="inline-flex items-center gap-2.5">
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Done ({formatDate(submissionRecord.submittedAt)})</span>
                        </span>

                        {submissionRecord.submissionLink && (
                          <a
                            href={submissionRecord.submissionLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`View submitted solution file for ${assignment.title}`}
                            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold hover:underline inline-flex items-center gap-0.5"
                          >
                            <span>My File</span>
                            <span>↗</span>
                          </a>
                        )}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleStartSubmit(assignment)}
                        aria-label={`Submit solution for ${assignment.title}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        Submit Solution
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <SubmissionModal
        isOpen={Boolean(activeAssignment)}
        assignment={activeAssignment}
        onClose={handleCloseModal}
        onSubmit={handleSubmitSolution}
      />
    </div>
  )
}

export default StudentTableView
