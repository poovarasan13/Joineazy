function EmptyState({ icon = '📋', title, message, actionText, onAction }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 sm:p-12 text-center max-w-md mx-auto shadow-sm transition-colors">
      <div className="text-4xl mb-3">{icon}</div>

      {title && (
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
          {title}
        </h3>
      )}

      <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
        {message}
      </p>

      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          {actionText}
        </button>
      )}
    </div>
  )
}

export default EmptyState
