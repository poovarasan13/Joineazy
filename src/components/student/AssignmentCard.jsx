import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { formatDate, isOverdue } from '../../utils/dateHelpers'
import ConfirmDialog from '../common/ConfirmDialog'

function AssignmentCard({ assignment, isSubmitted, submittedAt }) {
  const { currentUser } = useAuth()
  const { markAsSubmitted } = useData()

  // 0 = closed, 1 = first confirmation step, 2 = final confirmation step
  const [confirmStep, setConfirmStep] = useState(0)

  const overdue = !isSubmitted && isOverdue(assignment.dueDate)

  function handleFirstConfirm() {
    setConfirmStep(2)
  }

  function handleFinalConfirm() {
    markAsSubmitted(assignment.id, currentUser.id)
    setConfirmStep(0)
  }

  function handleCancel() {
    setConfirmStep(0)
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-0.5 transition-all duration-200">
      {/* Top Details */}
      <div>
        {/* Status Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {isSubmitted ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Submitted
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Not submitted
            </span>
          )}

          {overdue && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              Overdue
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 leading-snug break-words">
          {assignment.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 break-words">
          {assignment.description}
        </p>
      </div>

      {/* Bottom Section */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-1 text-xs text-slate-500 dark:text-slate-400 mb-3.5">
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Due: <strong className="text-slate-700 dark:text-slate-200 font-medium">{formatDate(assignment.dueDate)}</strong>
          </span>

          <a
            href={assignment.driveLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open Google Drive link for ${assignment.title} in new tab`}
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold inline-flex items-center gap-1 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
          >
            Drive Link ↗
          </a>
        </div>

        {/* Action Button or Submitted Status Card */}
        {isSubmitted ? (
          <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
            <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Submitted on {formatDate(submittedAt)}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmStep(1)}
            aria-label={`Mark ${assignment.title} as submitted`}
            className="w-full py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            Yes, I have submitted
          </button>
        )}
      </div>

      {/* Step 1 Dialog: Verify Drive upload */}
      <ConfirmDialog
        isOpen={confirmStep === 1}
        title="Verify Submission"
        message="Have you uploaded your solution to the designated Google Drive link?"
        confirmText="Yes, I uploaded it"
        cancelText="Cancel"
        onConfirm={handleFirstConfirm}
        onCancel={handleCancel}
      />

      {/* Step 2 Dialog: Final submission verification */}
      <ConfirmDialog
        isOpen={confirmStep === 2}
        title="Final Confirmation"
        message="This will mark the assignment as officially Submitted for faculty review. Proceed?"
        confirmText="Confirm Submission"
        cancelText="Cancel"
        onConfirm={handleFinalConfirm}
        onCancel={handleCancel}
      />
    </div>
  )
}

export default AssignmentCard
