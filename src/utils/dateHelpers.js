// Formats a date string like "2026-11-10" into "10 Nov 2026"
export function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// Checks if a given date string is past today (end of the due date day)
export function isOverdue(dateString) {
  if (!dateString) return false
  const deadline = new Date(dateString)
  deadline.setHours(23, 59, 59, 999) // valid until the end of the due day
  return new Date() > deadline
}

