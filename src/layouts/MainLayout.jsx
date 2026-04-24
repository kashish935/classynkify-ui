import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
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
    label: 'My Courses',
    path: '/my-courses',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="1.7"/>
        <path d="M9 7h6M9 11h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    label: 'Students',
    path: '/students',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.7"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    label: 'Assignments',
    path: '/assignments',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.7"/>
        <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 13h6M9 17h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    label: 'Live Classes',
    path: '/live',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <polygon points="23 7 16 12 23 17 23 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="1" y="5" width="15" height="14" rx="2" stroke="currentColor" strokeWidth="1.7"/>
      </svg>
    ),
    badge: 'Soon'
  },
  {
    label: 'Analytics',
    path: '/analytics',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
        <line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
        <line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      </svg>
    ),
    badge: 'Soon'
  },
]

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [profileOpen, setProfileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: sidebarOpen ? '240px' : '68px',
        minHeight: '100vh',
        background: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.25s ease',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 40,
        overflow: 'hidden'
      }}>

        {/* Sidebar Logo */}
        <div style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          padding: sidebarOpen ? '0 20px' : '0 14px',
          borderBottom: '1px solid #f1f5f9',
          gap: '10px',
          flexShrink: 0
        }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #2563eb, #0d9488)',
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
            <span style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.3px', whiteSpace: 'nowrap' }}>
              Classynkify
            </span>
          )}
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {navItems.map(item => {
            const isActive = location.pathname === item.path
            const isSoon = !!item.badge
            return (
              <Link
                key={item.path}
                to={isSoon ? '#' : item.path}
                onClick={e => isSoon && e.preventDefault()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 10px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  transition: 'all 0.15s',
                  background: isActive ? '#eff6ff' : 'transparent',
                  color: isActive ? '#2563eb' : isSoon ? '#cbd5e1' : '#475569',
                  cursor: isSoon ? 'default' : 'pointer',
                  position: 'relative',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={e => { if (!isActive && !isSoon) e.currentTarget.style.background = '#f8fafc' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ flexShrink: 0, display: 'flex' }}>{item.icon}</span>
                {sidebarOpen && (
                  <>
                    <span style={{ fontSize: '13.5px', fontWeight: isActive ? '600' : '500', flex: 1 }}>
                      {item.label}
                    </span>
                    {item.badge && (
                      <span style={{
                        fontSize: '10px', fontWeight: '600',
                        background: '#f1f5f9', color: '#94a3b8',
                        padding: '2px 7px', borderRadius: '999px'
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {isActive && (
                  <div style={{
                    position: 'absolute', left: 0, top: '20%', bottom: '20%',
                    width: '3px', borderRadius: '0 3px 3px 0',
                    background: '#2563eb'
                  }}/>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div style={{
          padding: '12px 10px',
          borderTop: '1px solid #f1f5f9',
          flexShrink: 0
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px', borderRadius: '10px',
            background: '#f8fafc'
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #2563eb, #0d9488)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: '700', color: 'white', flexShrink: 0
            }}>
              {initials}
            </div>
            {sidebarOpen && (
              <div style={{ overflow: 'hidden', flex: 1 }}>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.name}
                </p>
                <p style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'capitalize' }}>
                  {user?.role}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main Area ── */}
      <div style={{
        flex: 1,
        marginLeft: sidebarOpen ? '240px' : '68px',
        transition: 'margin-left 0.25s ease',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}>

        {/* ── Top Navbar ── */}
        <header style={{
          height: '64px',
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          position: 'sticky',
          top: 0,
          zIndex: 30
        }}>

          {/* Left: Toggle + Page title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                width: '36px', height: '36px', borderRadius: '8px',
                border: '1px solid #e2e8f0', background: 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#64748b', transition: 'all 0.15s'
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

            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '13px', color: '#94a3b8' }}>Classynkify</span>
              <span style={{ fontSize: '13px', color: '#cbd5e1' }}>/</span>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', textTransform: 'capitalize' }}>
                {location.pathname.replace('/', '') || 'Dashboard'}
              </span>
            </div>
          </div>

          {/* Right: Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

            {/* Notification bell */}
            <button style={{
              width: '36px', height: '36px', borderRadius: '8px',
              border: '1px solid #e2e8f0', background: 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#64748b', position: 'relative', transition: 'all 0.15s'
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
              </svg>
              {/* Notification dot */}
              <div style={{
                position: 'absolute', top: '8px', right: '8px',
                width: '7px', height: '7px', borderRadius: '50%',
                background: '#ef4444', border: '1.5px solid white'
              }}/>
            </button>

            {/* Profile dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '6px 10px 6px 6px',
                  border: '1px solid #e2e8f0', borderRadius: '10px',
                  background: 'transparent', cursor: 'pointer', transition: 'all 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2563eb, #0d9488)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: '700', color: 'white'
                }}>
                  {initials}
                </div>
                <span style={{ fontSize: '13px', fontWeight: '500', color: '#374151' }}>
                  {user?.name?.split(' ')[0]}
                </span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ color: '#94a3b8' }}>
                  <polyline points="6 9 12 15 18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                  background: 'white', border: '1px solid #e2e8f0',
                  borderRadius: '14px', padding: '6px',
                  minWidth: '200px', zIndex: 50,
                  boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
                }}>
                  {/* User info */}
                  <div style={{ padding: '10px 12px 12px', borderBottom: '1px solid #f1f5f9', marginBottom: '4px' }}>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>{user?.name}</p>
                    <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{user?.email}</p>
                  </div>

                  {[
                    { label: 'My Profile', icon: '👤' },
                    { label: 'Settings', icon: '⚙️' },
                  ].map(item => (
                    <button key={item.label} style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '9px 12px', borderRadius: '8px', border: 'none',
                      background: 'transparent', cursor: 'pointer', fontSize: '13px',
                      color: '#374151', fontFamily: 'inherit', transition: 'all 0.15s'
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span style={{ fontSize: '14px' }}>{item.icon}</span>
                      {item.label}
                    </button>
                  ))}

                  <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '4px', paddingTop: '4px' }}>
                    <button onClick={handleLogout} style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '9px 12px', borderRadius: '8px', border: 'none',
                      background: 'transparent', cursor: 'pointer', fontSize: '13px',
                      color: '#ef4444', fontFamily: 'inherit', transition: 'all 0.15s'
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                        <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── Page Content ── */}
        <main style={{ flex: 1, padding: '28px 28px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>

      {/* Click outside to close dropdown */}
      {profileOpen && (
        <div
          onClick={() => setProfileOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 25 }}
        />
      )}
    </div>
  )
}

export default MainLayout