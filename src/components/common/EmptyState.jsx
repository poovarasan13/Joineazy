function EmptyState({ icon = '📋', title, message, actionText, onAction }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 sm:p-12 text-center max-w-md mx-auto shadow-sm">
      <div className="text-4xl mb-3">{icon}</div>

      {title && (
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          {title}
        </h3>
      )}

      <p className="text-sm text-gray-600 mb-6 leading-relaxed">
        {message}
      </p>

      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition shadow-sm cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  )
}

export default EmptyState

