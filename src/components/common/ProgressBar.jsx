function ProgressBar({ value, max, label }) {
  // Calculate percentage safely
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          <span>{label}</span>
          <span>
            {value} of {max} submitted ({percentage}%)
          </span>
        </div>
      )}

      {/* Accessible progress bar track */}
      <div
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'Submission progress'}
        className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden"
      >
        <div
          className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
