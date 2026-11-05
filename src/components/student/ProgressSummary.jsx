import ProgressBar from '../common/ProgressBar'

function ProgressSummary({ total, submittedCount }) {
  const percentage = total === 0 ? 0 : Math.round((submittedCount / total) * 100)

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs mb-6 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
            {percentage}%
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Submission Progress
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {submittedCount} of {total} assigned tasks completed
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {submittedCount} Done
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            {total - submittedCount} Pending
          </span>
        </div>
      </div>

      <ProgressBar
        value={submittedCount}
        max={total}
      />
    </div>
  )
}

export default ProgressSummary
