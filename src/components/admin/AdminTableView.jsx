import { useState, Fragment } from 'react'
import { useData } from '../../context/DataContext'
import { formatDate } from '../../utils/dateHelpers'
import ProgressBar from '../common/ProgressBar'

function AdminTableView({ assignments, onEdit, onDelete }) {
  const { users, submissions } = useData()

  // Track which assignment row has its student roster expanded
  const [expandedRowId, setExpandedRowId] = useState(null)

  function toggleRow(id) {
    setExpandedRowId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-colors">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th scope="col" className="py-3 px-4 sm:px-6">
                Curriculum Task
              </th>
              <th scope="col" className="py-3 px-4">
                Due Date
              </th>
              <th scope="col" className="py-3 px-4">
                Resources
              </th>
              <th scope="col" className="py-3 px-4 min-w-[180px]">
                Class Progress
              </th>
              <th scope="col" className="py-3 px-4">
                Roster
              </th>
              <th scope="col" className="py-3 px-4 sm:px-6 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
            {assignments.map((assignment) => {
              const assignedStudents = users.filter((user) =>
                assignment.assignedTo.includes(user.id)
              )
              const submittedCount = submissions.filter(
                (sub) =>
                  sub.assignmentId === assignment.id &&
                  assignment.assignedTo.includes(sub.studentId)
              ).length

              const isExpanded = expandedRowId === assignment.id

              return (
                <Fragment key={assignment.id}>
                  <tr className="hover:bg-slate-50/70 transition-colors group">
                    {/* Title & Description */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="font-semibold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {assignment.title}
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 max-w-xs">
                        {assignment.description}
                      </div>
                    </td>

                    {/* Due Date */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
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
                        <span>{formatDate(assignment.dueDate)}</span>
                      </div>
                    </td>

                    {/* Drive Resource Link */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <a
                        href={assignment.driveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open Google Drive folder for ${assignment.title}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/60 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <span>Drive Folder</span>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </td>

                    {/* Progress Bar */}
                    <td className="py-4 px-4 min-w-[180px]">
                      <div className="w-full">
                        <ProgressBar
                          value={submittedCount}
                          max={assignedStudents.length}
                          label="Completion"
                        />
                      </div>
                    </td>

                    {/* Student Roster Toggle */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => toggleRow(assignment.id)}
                        aria-expanded={isExpanded}
                        aria-label={isExpanded ? 'Hide student roster' : 'View student roster'}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                      >
                        <span>{assignedStudents.length} Students</span>
                        <span className="text-[10px] text-slate-400">
                          {isExpanded ? '▲' : '▼'}
                        </span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onEdit(assignment)}
                          aria-label={`Edit ${assignment.title}`}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-100 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(assignment)}
                          aria-label={`Delete ${assignment.title}`}
                          className="px-2.5 py-1 rounded-lg border border-rose-200 text-xs font-medium text-rose-600 hover:bg-rose-50 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Sub-Row for Student Submission Roster */}
                  {isExpanded && (
                    <tr className="bg-slate-50/50">
                      <td colSpan={6} className="py-3 px-4 sm:px-8 border-b border-slate-200">
                        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
                          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                            Assigned Student Submission Status ({assignedStudents.length})
                          </div>
                          {assignedStudents.length === 0 ? (
                            <p className="text-xs text-slate-400 py-1">No students assigned to this task.</p>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                              {assignedStudents.map((student) => {
                                const submission = submissions.find(
                                  (s) =>
                                    s.assignmentId === assignment.id &&
                                    s.studentId === student.id
                                )
                                const studentDone = Boolean(submission)

                                return (
                                  <div
                                    key={student.id}
                                    className="p-2 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between text-xs"
                                  >
                                    <span className="font-medium text-slate-800 truncate pr-2">
                                      {student.name}
                                    </span>
                                    {studentDone ? (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        Submitted
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                        Pending
                                      </span>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminTableView