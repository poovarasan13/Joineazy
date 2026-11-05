import ProgressBar from '../common/ProgressBar'

function ProgressSummary({ total, submittedCount }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm mb-6 transition-colors">
      <ProgressBar
        value={submittedCount}
        max={total}
        label="Submission Progress"
      />
    </div>
  )
}

export default ProgressSummary
