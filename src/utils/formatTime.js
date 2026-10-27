export function timeAgo(date) {
  if (!date) return ''
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (Number.isNaN(diff)) return ''
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}