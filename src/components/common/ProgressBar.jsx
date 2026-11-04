function ProgressBar({ value, max, label }) {
  // Calculate percentage safely
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center text-xs font-semibold text-gray-700 mb-1.5">
          <span>{label}</span>
          <span>
            {value} of {max} submitted ({percentage}%)
          </span>
        </div>
      )}

      {/* Bar container */}
      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar

