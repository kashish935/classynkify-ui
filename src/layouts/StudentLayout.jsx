import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV_ITEMS = [
  { to: '/student/dashboard',    label: 'Dashboard',    icon: '🏠' },
  { to: '/student/assignments',  label: 'Assignments',  icon: '📋' },
  { to: '/student/grades',       label: 'Grades',       icon: '📊' },
  { to: '/student/doubt-solver', label: 'Doubt Solver', icon: '🤖' },
  { to: '/student/profile',      label: 'Profile',      icon: '👤' },
]

export default function StudentLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #f1f5f9',
        boxShadow: '0 1px 12px rgba(0,0,0,0.04)'
      }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          padding: '0 40px',
          display: 'flex', alignItems: 'center', height: '64px', gap: '32px'
        }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white"/>
                <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.4px' }}>
              Classynkify
            </span>
          </div>

          {/* Nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
            {NAV_ITEMS.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '7px 14px', borderRadius: '10px',
                  fontSize: '13px', fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  background: isActive ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
                  color: isActive ? '#fff' : '#64748b',
                  boxShadow: isActive ? '0 2px 8px rgba(99,102,241,0.3)' : 'none'
                })}
              >
                <span style={{ fontSize: '15px' }}>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            {/* Avatar */}
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: '700', color: '#fff'
            }}>
              {initials}
            </div>

            {/* Logout */}
            <button onClick={handleLogout} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '7px 14px', borderRadius: '10px',
              background: '#fef2f2', border: 'none',
              color: '#dc2626', fontSize: '13px', fontWeight: '600',
              cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fef2f2' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main>
        <Outlet />
      </main>
    </div>
  )
}