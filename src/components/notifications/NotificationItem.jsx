import { styles } from './notificationStyles'
import { timeAgo } from '../../utils/formatTime'

// The teacher API sends only `type` and `message`, so the title and icon come from here
const TYPE_META = {
  enrollment: { icon: '👥', title: 'New enrollment' },
  submission: { icon: '📝', title: 'New submission' },
}

export default function NotificationItem({ notification, first, onClick }) {
  const { type, title, message, icon, read, createdAt } = notification
  const meta = TYPE_META[type] || {}

  return (
    <div
      onClick={onClick}
      style={{ ...styles.item(read, first), cursor: onClick ? 'pointer' : 'default' }}
    >
      <span style={styles.itemDot(read)} />
      <div style={{ minWidth: 0 }}>
        <div style={styles.itemTitle}>
          {icon || meta.icon || '🔔'} {title || meta.title || 'Notification'}
        </div>
        {message && <div style={styles.itemMessage}>{message}</div>}
        <div style={styles.itemTime}>{timeAgo(createdAt)}</div>
      </div>
    </div>
  )
}