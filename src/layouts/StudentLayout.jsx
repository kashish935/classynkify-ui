import { useState, useEffect, useRef, useMemo } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { getStudentNotifications } from '../services/studentService'
import { useAuth } from '../context/AuthContext'

const NAV_ITEMS = [
  {
    to: '/student/dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7"/>
        <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7"/>
        <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7"/>
      </svg>
    )
  },
  {
    to: '/student/assignments',
    label: 'Assignments',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.7"/>
        <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
        <path d="M9 13h6M9 17h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    to: '/student/grades',
    label: 'Grades',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
        <line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
        <line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    to: '/student/doubt-solver',
    label: 'Doubt Solver',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" stroke="currentColor" strokeWidth="1.7"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
        <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  },
  {
  to: '/student/courses',
  label: 'Courses',
  icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      <path d="M9 7h6M9 11h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  )
  },
  {
    to: '/student/profile',
    label: 'Profile',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.7"/>
      </svg>
    )
  },
]

const timeAgo = (date) => {
  const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000)
  if (Number.isNaN(mins) || mins < 1) return 'Just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hour${hrs !== 1 ? 's' : ''} ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function StudentLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Hide sidebar/nav on the course player route
  const isCoursePlayer = location.pathname.includes('/student/courses/')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'
  const firstName = user?.name?.split(' ')[0] || 'Student'

  const [notifOpen, setNotifOpen] = useState(false)
  const [selectedNotif, setSelectedNotif] = useState(null)
  const [rawNotifs, setRawNotifs] = useState([])
  const notifRef = useRef(null)

  // Which notifications were read is remembered per user in this browser
  const readKey = `classynkify_read_notifs_${user?._id || 'me'}`
  const [readIds, setReadIds] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem(readKey) || '[]')) } catch { return new Set() }
  })
  const saveReadIds = (set) => {
    setReadIds(set)
    try { localStorage.setItem(readKey, JSON.stringify([...set])) } catch { /* storage unavailable */ }
  }

  // Load real notifications now, whenever the page changes, and every minute
  useEffect(() => {
    let cancelled = false
    const load = () =>
      getStudentNotifications()
        .then(list => { if (!cancelled) setRawNotifs(list) })
        .catch(() => { /* keep the previous list if the request fails */ })
    load()
    const timer = setInterval(load, 60000)
    return () => { cancelled = true; clearInterval(timer) }
  }, [location.pathname])

  const notifications = useMemo(
    () => rawNotifs.map(n => ({ ...n, read: readIds.has(n.id), time: timeAgo(n.createdAt) })),
    [rawNotifs, readIds]
  )
  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false)
        setSelectedNotif(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const markAllRead = () => saveReadIds(new Set([...readIds, ...rawNotifs.map(n => n.id)]))
  const markRead = (id) => saveReadIds(new Set([...readIds, id]))
  const openNotif = (n) => { markRead(n.id); setSelectedNotif(n) }
  const closeDetail = () => setSelectedNotif(null)

  // Type colours for notification detail
  const TYPE_COLORS = { assignment: '#f59e0b', grade: '#10b981', course: '#6366f1', announcement: '#ef4444' }

  if (isCoursePlayer) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <Outlet />
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex', minHeight: '100vh',
      background: '#f1f5f9',
      fontFamily: "'DM Sans', system-ui, sans-serif"
    }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: '240px',
        minHeight: '100vh',
        background: '#ffffff',
        borderRight: '1px solid #e8ecf0',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 40,
        boxShadow: '2px 0 12px rgba(0,0,0,0.04)'
      }}>

        {/* Logo */}
        <div style={{
          height: '64px',
          display: 'flex', alignItems: 'center',
          padding: '0 20px',
          borderBottom: '1px solid #f1f5f9',
          gap: '10px', flexShrink: 0
        }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white"/>
              <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.3px' }}>
            Classynkify
          </span>
        </div>

        {/* User card */}
        <div style={{
          margin: '16px 12px',
          padding: '12px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #f0f0ff, #faf5ff)',
          border: '1px solid #e9d5ff',
          display: 'flex', alignItems: 'center', gap: '10px'
        }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', fontWeight: '700', color: '#fff', flexShrink: 0
          }}>{initials}</div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: '13px', fontWeight: '700', color: '#1e1b4b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name}
            </p>
            <p style={{ fontSize: '11px', color: '#7c3aed', fontWeight: '500' }}>Student</p>
          </div>
        </div>

        {/* Nav label */}
        <p style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 20px 6px' }}>
          Main Menu
        </p>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '0 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 12px', borderRadius: '10px',
                textDecoration: 'none', transition: 'all 0.15s',
                background: isActive ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
                color: isActive ? '#fff' : '#475569',
                fontWeight: isActive ? '600' : '500',
                fontSize: '13.5px',
                boxShadow: isActive ? '0 2px 10px rgba(99,102,241,0.3)' : 'none',
                position: 'relative'
              })}
              onMouseEnter={e => {
                const a = e.currentTarget
                if (!a.className.includes('active') && a.style.background === 'transparent') {
                  a.style.background = '#f5f3ff'
                  a.style.color = '#6366f1'
                }
              }}
              onMouseLeave={e => {
                const a = e.currentTarget
                // re-check active state
                if (a.getAttribute('aria-current') !== 'page') {
                  a.style.background = 'transparent'
                  a.style.color = '#475569'
                }
              }}
            >
              <span style={{ display: 'flex', flexShrink: 0 }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid #f1f5f9', flexShrink: 0 }}>
          <button onClick={handleLogout} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 12px', borderRadius: '10px',
            border: 'none', background: 'transparent',
            cursor: 'pointer', fontSize: '13.5px', fontWeight: '500',
            color: '#ef4444', transition: 'all 0.15s',
            fontFamily: 'inherit'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
              <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div style={{ flex: 1, marginLeft: '240px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        {/* ── Top Header ── */}
        <header style={{
          height: '64px', background: '#ffffff',
          borderBottom: '1px solid #e8ecf0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 32px',
          position: 'sticky', top: 0, zIndex: 30,
          boxShadow: '0 1px 8px rgba(0,0,0,0.04)'
        }}>
          {/* Page title from route */}
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
              {NAV_ITEMS.find(n => location.pathname === n.to)?.label || 'Classynkify'}
            </h2>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
              Welcome back, {firstName}!
            </p>
          </div>

          {/* Right: notifications + profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Bell with dropdown */}
            <div ref={notifRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setNotifOpen(o => !o)}
                style={{
                  width: '38px', height: '38px', borderRadius: '10px',
                  border: notifOpen ? '1px solid #c7d2fe' : '1px solid #e8ecf0',
                  background: notifOpen ? '#eef2ff' : 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: notifOpen ? '#6366f1' : '#64748b',
                  position: 'relative', transition: 'all 0.15s'
                }}
                onMouseEnter={e => { if (!notifOpen) { e.currentTarget.style.background = '#f5f3ff'; e.currentTarget.style.borderColor = '#c7d2fe' } }}
                onMouseLeave={e => { if (!notifOpen) { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#e8ecf0' } }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                </svg>
                {unreadCount > 0 && (
                  <div style={{
                    position: 'absolute', top: '6px', right: '6px',
                    minWidth: '16px', height: '16px', borderRadius: '999px',
                    background: '#ef4444', border: '2px solid white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '9px', fontWeight: '800', color: '#fff',
                    padding: '0 3px', lineHeight: 1,
                  }}>{unreadCount}</div>
                )}
              </button>

              {/* Notification dropdown */}
              {notifOpen && (
                <div style={{ position: 'absolute', top: '46px', right: 0, width: '360px', background: '#fff', borderRadius: '16px', border: '1px solid #e8ecf0', boxShadow: '0 8px 32px rgba(0,0,0,0.14)', zIndex: 100, overflow: 'hidden', animation: 'notifSlide 0.15s ease' }}>
                  <style>{`@keyframes notifSlide { from { opacity:0; transform:translateY(-8px) } to { opacity:1; transform:translateY(0) } } @keyframes detailPop { from { opacity:0; transform:translateX(16px) } to { opacity:1; transform:translateX(0) } }`}</style>

                  {/* ── Detail view ── */}
                  {selectedNotif ? (
                    <div style={{ animation: 'detailPop 0.18s ease' }}>
                      {/* Detail header */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', borderBottom: '1px solid #f1f5f9' }}>
                        <button onClick={closeDetail} style={{ width: '28px', height: '28px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="#475569" strokeWidth="2" strokeLinecap="round"/></svg>
                        </button>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Notification Detail</span>
                      </div>

                      {/* Detail body */}
                      <div style={{ padding: '20px' }}>
                        {/* Icon + type strip */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: (TYPE_COLORS[selectedNotif.type] || '#6366f1') + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', flexShrink: 0 }}>
                            {selectedNotif.icon}
                          </div>
                          <div>
                            <span style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: TYPE_COLORS[selectedNotif.type] || '#6366f1', display: 'block', marginBottom: '3px' }}>{selectedNotif.type}</span>
                            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: 0 }}>{selectedNotif.title}</h3>
                          </div>
                        </div>

                        {/* Message card */}
                        <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px 16px', marginBottom: '14px', border: '1px solid #f1f5f9' }}>
                          <p style={{ fontSize: '14px', color: '#334155', lineHeight: 1.6, margin: 0 }}>{selectedNotif.message}</p>
                        </div>

                        {/* Time */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#94a3b8" strokeWidth="2"/><path d="M12 6v6l4 2" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/></svg>
                          <span style={{ fontSize: '12px', color: '#94a3b8' }}>{selectedNotif.time}</span>
                          <span style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: '600', color: '#22c55e', background: '#f0fdf4', padding: '2px 8px', borderRadius: '999px' }}>✓ Read</span>
                        </div>
                      </div>

                      {/* Footer */}
                      <div style={{ padding: '12px 16px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '8px' }}>
                        <button onClick={closeDetail} style={{ flex: 1, padding: '9px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '10px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
                          ← Back
                        </button>
                        <button onClick={() => { closeDetail(); setNotifOpen(false) }} style={{ flex: 1, padding: '9px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
                          Done
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ── List view ── */
                    <>
                      {/* Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Notifications</span>
                          {unreadCount > 0 && <span style={{ background: '#6366f1', color: '#fff', fontSize: '10px', fontWeight: '700', borderRadius: '999px', padding: '1px 7px' }}>{unreadCount} new</span>}
                        </div>
                        {unreadCount > 0 && <button onClick={markAllRead} style={{ fontSize: '11px', color: '#6366f1', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Mark all read</button>}
                      </div>

                      {/* List */}
                      <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                        {notifications.length === 0 && (
                          <div style={{ padding: '32px 16px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                            🎉 You're all caught up. No notifications yet.
                          </div>
                        )}
                        {notifications.map(n => (
                          <div key={n.id} onClick={() => openNotif(n)}
                            style={{ display: 'flex', gap: '12px', padding: '12px 16px', borderBottom: '1px solid #f8fafc', cursor: 'pointer', background: n.read ? '#fff' : '#fafaff', transition: 'background 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#f5f3ff'}
                            onMouseLeave={e => e.currentTarget.style.background = n.read ? '#fff' : '#fafaff'}
                          >
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: (TYPE_COLORS[n.type] || '#6366f1') + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                              {n.icon}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                                <p style={{ fontSize: '13px', fontWeight: n.read ? '500' : '700', color: '#0f172a', margin: 0 }}>{n.title}</p>
                                {!n.read && <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#6366f1', flexShrink: 0, marginTop: '4px' }}/>}
                              </div>
                              <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 3px', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.message}</p>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>{n.time}</p>
                                <span style={{ fontSize: '10px', color: '#6366f1', fontWeight: '600' }}>View →</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Footer */}
                      <div style={{ padding: '10px 16px', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
                        <button onClick={() => setNotifOpen(false)} style={{ fontSize: '12px', color: '#6366f1', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Close</button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Avatar + name — clicks to profile */}
            <button
              onClick={() => navigate('/student/profile')}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#f5f3ff'
                e.currentTarget.style.borderColor = '#c4b5fd'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'white'
               e.currentTarget.style.borderColor = '#e8ecf0'
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '6px 12px 6px 6px',
                border: '1px solid #e8ecf0', borderRadius: '12px',
                background: 'white', cursor: 'pointer',
                fontFamily: 'inherit', transition: 'all 0.15s'
      }}
>
            <div style={{
              width: '30px', height: '30px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: '700', color: '#fff'
            }}>{initials}</div>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>{firstName}</span>
            </button>
          </div>
        </header>

        {/* ── Page Content ── */}
        <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
