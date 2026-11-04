function ProgressSummary({ total, submittedCount }) {
  // Calculate completion percentage safely
  const percentage = total === 0 ? 0 : Math.round((submittedCount / total) * 100)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm mb-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <span className="text-sm font-semibold text-gray-700">
          Submission Progress
        </span>
        <span className="text-sm font-bold text-gray-900">
          {submittedCount} of {total} submitted ({percentage}%)
        </span>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
        <div
          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressSummary

