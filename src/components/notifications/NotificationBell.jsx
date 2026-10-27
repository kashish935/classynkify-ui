import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import useNotifications from '../../hooks/useNotifications'
import useClickOutside from '../../hooks/useClickOutside'
import NotificationPanel from './NotificationPanel'
import { styles } from './notificationStyles'

export default function NotificationBell({ role = 'teacher' }) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)
  const navigate = useNavigate()
  const { items, loading, error, unreadCount, reload, markAllRead, markRead } = useNotifications(role)

  const close = useCallback(() => setOpen(false), [])
  useClickOutside(wrapperRef, close, open)

  const toggle = () => {
    if (!open) reload()
    setOpen((prev) => !prev)
  }

  // Mark it read, close the panel, and go to the page the notification points at
  const handleItemClick = (n) => {
    markRead(n.id ?? n._id)
    setOpen(false)
    if (n.link) navigate(n.link)
  }

  return (
    <div ref={wrapperRef} style={styles.wrapper}>
      <button
        type="button"
        onClick={toggle}
        aria-label="Notifications"
        aria-haspopup="true"
        aria-expanded={open}
        style={styles.bell(open)}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
        {unreadCount > 0 && <span style={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>}
      </button>

      {open && (
        <NotificationPanel
          items={items}
          loading={loading}
          error={error}
          unreadCount={unreadCount}
          onRetry={reload}
          onMarkAllRead={markAllRead}
          onItemClick={handleItemClick}
        />
      )}
    </div>
  )
}