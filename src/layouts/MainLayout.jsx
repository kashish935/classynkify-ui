import { useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV_ITEMS = [
  {
    to: '/teacher/dashboard',
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
    to: '/teacher/courses',
    label: 'My Courses',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="1.7"/>
        <path d="M9 7h6M9 11h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    to: '/teacher/students',
    label: 'Students',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.7"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    to: '/teacher/assignments',
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
    to: '/teacher/live',
    label: 'Live Classes',
    soon: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <polygon points="23 7 16 12 23 17 23 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="1" y="5" width="15" height="14" rx="2" stroke="currentColor" strokeWidth="1.7"/>
      </svg>
    )
  },
  {
    to: '/teacher/analytics',
    label: 'Analytics',
    soon: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
        <line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
        <line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      </svg>
    )
  },
]

export default function MainLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'
  const firstName = user?.name?.split(' ')[0] || 'Teacher'
  const currentPage = NAV_ITEMS.find(n => location.pathname === n.to)?.label || 'Dashboard'

  return (
    <div style={{
      display: 'flex', minHeight: '100vh',
      background: '#f1f5f9',
      fontFamily: "'DM Sans', system-ui, sans-serif"
    }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: sidebarOpen ? '240px' : '68px',
        minHeight: '100vh',
        background: '#ffffff',
        borderRight: '1px solid #e8ecf0',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 40,
        overflow: 'hidden',
        transition: 'width 0.25s ease',
        boxShadow: '2px 0 12px rgba(0,0,0,0.04)'
      }}>

        {/* Logo */}
        <div style={{
          height: '64px',
          display: 'flex', alignItems: 'center',
          padding: sidebarOpen ? '0 20px' : '0 16px',
          borderBottom: '1px solid #f1f5f9',
          gap: '10px', flexShrink: 0
        }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #0d9488, #0891b2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white"/>
              <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          {sidebarOpen && (
            <span style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.3px', whiteSpace: 'nowrap' }}>
              Classynkify
            </span>
          )}
        </div>

        {/* User card — only visible when expanded */}
        {sidebarOpen && (
          <div style={{
            margin: '16px 12px',
            padding: '12px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #f0fdfa, #ccfbf1)',
            border: '1px solid #99f6e4',
            display: 'flex', alignItems: 'center', gap: '10px'
          }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #0d9488, #0891b2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', fontWeight: '700', color: '#fff', flexShrink: 0
            }}>{initials}</div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{
                fontSize: '13px', fontWeight: '700', color: '#134e4a',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
              }}>
                {user?.name}
              </p>
              <p style={{ fontSize: '11px', color: '#0d9488', fontWeight: '600' }}>Teacher</p>
            </div>
          </div>
        )}

        {/* Collapsed avatar */}
        {!sidebarOpen && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #0d9488, #0891b2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: '700', color: '#fff'
            }}>{initials}</div>
          </div>
        )}

        {/* Nav label */}
        {sidebarOpen && (
          <p style={{
            fontSize: '10px', fontWeight: '700', color: '#94a3b8',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            padding: '0 20px 6px'
          }}>
            Main Menu
          </p>
        )}

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '0 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {NAV_ITEMS.map(item => {
            if (item.soon) {
              return (
                <div key={item.to} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 12px', borderRadius: '10px',
                  color: '#cbd5e1', cursor: 'default',
                  fontSize: '13.5px', fontWeight: '500',
                  whiteSpace: 'nowrap'
                }}>
                  <span style={{ display: 'flex', flexShrink: 0 }}>{item.icon}</span>
                  {sidebarOpen && (
                    <>
                      <span style={{ flex: 1 }}>{item.label}</span>
                      <span style={{
                        fontSize: '10px', fontWeight: '600',
                        background: '#f1f5f9', color: '#94a3b8',
                        padding: '2px 7px', borderRadius: '999px'
                      }}>Soon</span>
                    </>
                  )}
                </div>
              )
            }

            return (
              <NavLink
                key={item.to}
                to={item.to}
                title={!sidebarOpen ? item.label : undefined}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 12px', borderRadius: '10px',
                  textDecoration: 'none', transition: 'all 0.15s',
                  background: isActive ? 'linear-gradient(135deg, #0d9488, #0891b2)' : 'transparent',
                  color: isActive ? '#fff' : '#475569',
                  fontWeight: isActive ? '600' : '500',
                  fontSize: '13.5px',
                  boxShadow: isActive ? '0 2px 10px rgba(13,148,136,0.3)' : 'none',
                  whiteSpace: 'nowrap'
                })}
                onMouseEnter={e => {
                  if (e.currentTarget.getAttribute('aria-current') !== 'page') {
                    e.currentTarget.style.background = '#f0fdfa'
                    e.currentTarget.style.color = '#0d9488'
                  }
                }}
                onMouseLeave={e => {
                  if (e.currentTarget.getAttribute('aria-current') !== 'page') {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = '#475569'
                  }
                }}
              >
                <span style={{ display: 'flex', flexShrink: 0 }}>{item.icon}</span>
                {sidebarOpen && item.label}
              </NavLink>
            )
          })}
        </nav>

        {/* Sign Out */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid #f1f5f9', flexShrink: 0 }}>
          <button
            onClick={handleLogout}
            title={!sidebarOpen ? 'Sign Out' : undefined}
            style={{
              width: '100%', display: 'flex', alignItems: 'center',
              gap: '10px', padding: '10px 12px', borderRadius: '10px',
              border: 'none', background: 'transparent',
              cursor: 'pointer', fontSize: '13.5px', fontWeight: '500',
              color: '#ef4444', transition: 'all 0.15s',
              fontFamily: 'inherit', whiteSpace: 'nowrap'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
              <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
            </svg>
            {sidebarOpen && 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div style={{
        flex: 1,
        marginLeft: sidebarOpen ? '240px' : '68px',
        transition: 'margin-left 0.25s ease',
        display: 'flex', flexDirection: 'column',
        minHeight: '100vh'
      }}>

        {/* ── Top Header ── */}
        <header style={{
          height: '64px', background: '#ffffff',
          borderBottom: '1px solid #e8ecf0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 32px',
          position: 'sticky', top: 0, zIndex: 30,
          boxShadow: '0 1px 8px rgba(0,0,0,0.04)'
        }}>

          {/* Left: toggle + page title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setSidebarOpen(prev => !prev)}
              style={{
                width: '36px', height: '36px', borderRadius: '8px',
                border: '1px solid #e8ecf0', background: 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#64748b', transition: 'all 0.15s', flexShrink: 0
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>

            <div>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                {currentPage}
              </h2>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                Welcome back, {firstName}!
              </p>
            </div>
          </div>

          {/* Right: bell + avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button style={{
              width: '38px', height: '38px', borderRadius: '10px',
              border: '1px solid #e8ecf0', background: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#64748b', position: 'relative'
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'white' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
              </svg>
              <div style={{
                position: 'absolute', top: '8px', right: '8px',
                width: '7px', height: '7px', borderRadius: '50%',
                background: '#0d9488', border: '1.5px solid white'
              }}/>
            </button>

            <button
              onClick={() => navigate('/teacher/profile')}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#f0fdfa'
                e.currentTarget.style.borderColor = '#99f6e4'
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
                background: 'linear-gradient(135deg, #0d9488, #0891b2)',
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