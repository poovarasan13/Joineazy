import { useState, useEffect, useRef } from 'react'

function SubmissionModal({ isOpen, assignment, onClose, onSubmit }) {
  const [step, setStep] = useState(1)
  const [driveLink, setDriveLink] = useState('')
  const [linkError, setLinkError] = useState('')
  const inputRef = useRef(null)

  // Reset state whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setDriveLink('')
      setLinkError('')
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !assignment) return null

  // Validate and advance from Step 1 to Step 2
  function handleNextStep(e) {
    e.preventDefault()
    setLinkError('')

    const trimmed = driveLink.trim()
    if (trimmed && !trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      setLinkError('Drive link must begin with http:// or https://')
      return
    }

    setStep(2)
  }

  // Execute submission
  function handleFinalSubmit() {
    onSubmit(driveLink.trim())
    onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="submission-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-200"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 transition-all">
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                step === 1
                  ? 'bg-indigo-600 text-white'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {step === 1 ? '1' : '✓'}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {step === 1 ? 'Step 1 of 2: Upload & Link' : 'Step 2 of 2: Confirm Submission'}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close submission dialog"
            className="text-slate-400 hover:text-slate-600 p-1 text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* STEP 1: Verify Drive Upload & Optional Link Input */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className="space-y-4">
            <div>
              <h3
                id="submission-modal-title"
                className="text-base sm:text-lg font-bold text-slate-900"
              >
                Submit: {assignment.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Have you uploaded your solution to Google Drive? You can upload to the designated course folder below or share your own public Drive link.
              </p>
            </div>

            {/* Course Drive Folder Link */}
            <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between gap-3">
              <div className="truncate">
                <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider block">
                  Course Drive Destination
                </span>
                <span className="text-xs text-indigo-700 truncate block mt-0.5">
                  {assignment.driveLink}
                </span>
              </div>
              <a
                href={assignment.driveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shrink-0 inline-flex items-center gap-1"
              >
                <span>Open Drive</span>
                <span>↗</span>
              </a>
            </div>

            {/* Student's Public Drive Link Input */}
            <div>
              <label
                htmlFor="student-drive-link"
                className="block text-xs font-semibold text-slate-700 uppercase mb-1.5"
              >
                Your Public Google Drive Link (Optional)
              </label>
              <input
                id="student-drive-link"
                ref={inputRef}
                type="url"
                value={driveLink}
                onChange={(e) => {
                  setDriveLink(e.target.value)
                  if (linkError) setLinkError('')
                }}
                placeholder="https://drive.google.com/file/d/... or your folder link"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              />
              {linkError ? (
                <p className="text-xs text-rose-600 mt-1 font-medium">{linkError}</p>
              ) : (
                <p className="text-[11px] text-slate-500 mt-1">
                  If uploading to your own Drive, ensure link sharing is set to &quot;Anyone with the link can view&quot;. Leave blank if uploaded directly to the course folder above.
                </p>
              )}
            </div>

            {/* Step 1 Actions */}
            <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Yes, I have submitted →
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Final Confirmation Dialog */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h3
                id="submission-modal-title"
                className="text-base sm:text-lg font-bold text-slate-900"
              >
                Final Confirmation
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Please verify your submission details before official submission.
              </p>
            </div>

            {/* Submission Summary Card */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Assignment:</span>
                <span className="text-slate-900 font-bold truncate max-w-xs">
                  {assignment.title}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-slate-500 font-medium">Recorded Drive Link:</span>
                <span className="text-slate-900 font-semibold text-right truncate max-w-[240px]">
                  {driveLink.trim() ? (
                    <a
                      href={driveLink.trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline inline-flex items-center gap-1"
                    >
                      <span>{driveLink.trim()}</span>
                      <span>↗</span>
                    </a>
                  ) : (
                    'Designated Course Folder'
                  )}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
              ⚠️ This will mark the task as officially <strong>Submitted</strong> for faculty review with an immutable submission timestamp.
            </div>

            {/* Step 2 Actions */}
            <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
              >
                ← Back to Edit
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="w-full sm:w-auto px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                Confirm Submission
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SubmissionModal
