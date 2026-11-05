export function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function isOverdue(dateString) {
  if (!dateString) return false
  const deadline = new Date(dateString)
  deadline.setHours(23, 59, 59, 999)
  return new Date() > deadline
}
