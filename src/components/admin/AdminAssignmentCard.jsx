import { formatDate } from '../../utils/dateHelpers'
import ProgressBar from '../common/ProgressBar'

function AdminAssignmentCard({ assignment, submittedCount }) {
  const totalAssigned = assignment.assignedTo.length

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col justify-between hover:shadow-md transition">
      {/* Top Details */}
      <div>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>
            Due: <strong className="text-gray-700">{formatDate(assignment.dueDate)}</strong>
          </span>

          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-medium">
            {totalAssigned} Student{totalAssigned === 1 ? '' : 's'} Assigned
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
          {assignment.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
          {assignment.description}
        </p>

        {/* Drive Link */}
        <div className="mb-4">
          <a
            href={assignment.driveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 hover:underline"
          >
            Open Drive Folder ↗
          </a>
        </div>
      </div>

      {/* Bottom: Progress Bar & Actions */}
      <div className="pt-4 border-t border-gray-100">
        <ProgressBar
          value={submittedCount}
          max={totalAssigned}
          label="Class Submissions"
        />

        {/* Placeholder Edit & Delete Buttons */}
        <div className="flex items-center gap-2 mt-4">
          <button
            type="button"
            className="flex-1 py-1.5 px-3 rounded-lg border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
          >
            Edit
          </button>
          <button
            type="button"
            className="flex-1 py-1.5 px-3 rounded-lg border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50 transition cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminAssignmentCard

