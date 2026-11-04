function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}) {
  // If not open, render nothing
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          {message}
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition cursor-pointer"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog

