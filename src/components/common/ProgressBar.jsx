function ProgressBar({ value, max, label }) {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          <span>{label}</span>
          <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
            {value}/{max} ({percentage}%)
          </span>
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'Submission progress'}
        className="w-full bg-slate-200 dark:bg-slate-700/80 rounded-full h-2 overflow-hidden"
      >
        <div
          className={`h-2 rounded-full transition-all duration-300 ease-out ${
            percentage === 100
              ? 'bg-emerald-500'
              : 'bg-indigo-600 dark:bg-indigo-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
