function ErrorMessage({
  title = 'Something went wrong',
  message,
  actionText,
  onAction,
}) {
  return (
    <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-2xl p-6 sm:p-8 text-center max-w-md mx-auto shadow-sm transition-colors">
      <div className="text-4xl mb-3">⚠️</div>

      <h3 className="text-lg font-bold text-red-900 dark:text-red-300 mb-1">
        {title}
      </h3>

      <p className="text-sm text-red-700 dark:text-red-400 mb-6 leading-relaxed">
        {message}
      </p>

      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500 text-white text-sm font-semibold rounded-lg transition shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          {actionText}
        </button>
      )}
    </div>
  )
}

export default ErrorMessage
