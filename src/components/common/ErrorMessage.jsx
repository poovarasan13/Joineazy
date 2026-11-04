function ErrorMessage({
  title = 'Something went wrong',
  message,
  actionText,
  onAction,
}) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 sm:p-8 text-center max-w-md mx-auto shadow-sm">
      <div className="text-4xl mb-3">⚠️</div>

      <h3 className="text-lg font-bold text-red-900 mb-1">
        {title}
      </h3>

      <p className="text-sm text-red-700 mb-6 leading-relaxed">
        {message}
      </p>

      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition shadow-sm cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  )
}

export default ErrorMessage

