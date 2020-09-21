function formatLoggedAt(date: Date): string {
  return date.toLocaleDateString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  })
}

export default formatLoggedAt
