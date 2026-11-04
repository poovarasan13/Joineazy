import ProgressBar from '../common/ProgressBar'

function ProgressSummary({ total, submittedCount }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm mb-6">
      <ProgressBar
        value={submittedCount}
        max={total}
        label="Submission Progress"
      />
    </div>
  )
}

export default ProgressSummary
