function ErrorMessage({
  title = 'Something went wrong',
  message,
  actionText,
  onAction,
}) {
  return (
    <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl p-6 sm:p-8 text-center max-w-md mx-auto shadow-sm transition-colors">
      <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>

      <h3 className="text-base font-bold text-rose-900 dark:text-rose-200 mb-1.5">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-rose-700 dark:text-rose-300 mb-6 leading-relaxed">
        {message}
      </p>

      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        >
          {actionText}
        </button>
      )}
    </div>
  )
}

export default ErrorMessage
