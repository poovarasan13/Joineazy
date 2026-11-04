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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col justify-between hover:shadow-md transition">
      {/* Top Section: Badges, Title, Description */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {isSubmitted ? (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
              Submitted
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
              Not submitted
            </span>
          )}

          {overdue && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
              Overdue
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
          {assignment.title}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
          {assignment.description}
        </p>
      </div>

      {/* Bottom Section: Due date, Drive link & Action */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>
            Due: <strong className="text-gray-700">{formatDate(assignment.dueDate)}</strong>
          </span>

          <a
            href={assignment.driveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 hover:underline"
          >
            Open Drive Link ↗
          </a>
        </div>

        {/* Once submitted, show submission date; otherwise show submission action button */}
        {isSubmitted ? (
          <div className="text-center py-2 px-3 rounded-lg bg-green-50 border border-green-200 text-xs text-green-800 font-medium">
            Submitted on {formatDate(submittedAt)}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmStep(1)}
            className="w-full py-2 px-3 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer"
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
