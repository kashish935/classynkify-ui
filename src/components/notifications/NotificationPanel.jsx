import { styles } from './notificationStyles'
import NotificationItem from './NotificationItem'

export default function NotificationPanel({ items, loading, error, unreadCount, onRetry, onMarkAllRead, onItemClick }) {
  let body
  if (loading && items.length === 0) {
    body = <div style={styles.stateBox}>Loading…</div>
  } else if (error) {
    body = (
      <div style={styles.stateBox}>
        Couldn&apos;t load notifications.
        <div>
          <button type="button" onClick={onRetry} style={{ ...styles.linkButton, marginTop: '8px', fontSize: '13px' }}>
            Try again
          </button>
        </div>
      </div>
    )
  } else if (items.length === 0) {
    body = (
      <div style={styles.stateBox}>
        <div style={{ fontSize: '28px', marginBottom: '6px' }}>🔔</div>
        <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>You&apos;re all caught up</div>
        <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>No new notifications</div>
      </div>
    )
  } else {
        body = items.map((n, i) => (
      <NotificationItem
        key={n.id || n._id || i}
        notification={n}
        first={i === 0}
        onClick={() => onItemClick(n)}
      />
    ))
  }

  return (
    <div role="menu" style={styles.panel}>
      <div style={styles.panelHeader}>
        <span style={styles.panelTitle}>Notifications</span>
        {unreadCount > 0 && (
          <button type="button" onClick={onMarkAllRead} style={styles.linkButton}>
            Mark all read
          </button>
        )}
      </div>
      <div style={styles.list}>{body}</div>
    </div>
  )
}