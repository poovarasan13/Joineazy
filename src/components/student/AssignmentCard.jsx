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

  // Step 1: User says yes to having uploaded to Google Drive
  function handleFirstConfirm() {
    setConfirmStep(2)
  }

  // Step 2: Final confirmation marks the assignment as submitted
  function handleFinalConfirm() {
    markAsSubmitted(assignment.id, currentUser.id)
    setConfirmStep(0)
  }

  function handleCancel() {
    setConfirmStep(0)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      {/* Top Section: Badges, Title, Description */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {isSubmitted ? (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200 dark:bg-green-950/60 dark:text-green-300 dark:border-green-800">
              Submitted
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800">
              Not submitted
            </span>
          )}

          {overdue && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800">
              Overdue
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-snug break-words">
          {assignment.title}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4 break-words">
          {assignment.description}
        </p>
      </div>

      {/* Bottom Section: Due date, Drive link & Action */}
      <div className="pt-4 border-t border-gray-100 dark:border-gray-700/60">
        <div className="flex flex-wrap items-center justify-between gap-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
          <span>
            Due: <strong className="text-gray-700 dark:text-gray-200">{formatDate(assignment.dueDate)}</strong>
          </span>

          <a
            href={assignment.driveLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open Google Drive link for ${assignment.title} in new tab`}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium inline-flex items-center gap-1 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          >
            Open Drive Link ↗
          </a>
        </div>

        {/* Once submitted, show submission date; otherwise show submission action button */}
        {isSubmitted ? (
          <div className="text-center py-2 px-3 rounded-lg bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 text-xs text-green-800 dark:text-green-300 font-medium">
            Submitted on {formatDate(submittedAt)}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmStep(1)}
            aria-label={`Mark ${assignment.title} as submitted`}
            className="w-full py-2 px-3 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Yes, I have submitted
          </button>
        )}
      </div>

      {/* Step 1 Dialog: Verify Drive upload */}
      <ConfirmDialog
        isOpen={confirmStep === 1}
        title="Check Drive Upload"
        message="Have you submitted this on the Drive link?"
        confirmText="Yes"
        cancelText="Cancel"
        onConfirm={handleFirstConfirm}
        onCancel={handleCancel}
      />

      {/* Step 2 Dialog: Final submission verification */}
      <ConfirmDialog
        isOpen={confirmStep === 2}
        title="Final Confirmation"
        message="This will mark the assignment as Submitted. Are you sure?"
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={handleFinalConfirm}
        onCancel={handleCancel}
      />
    </div>
  )
}

export default AssignmentCard
