import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   setError('')
  //   setLoading(true)
  //   try {
  //     const res = await api.post('/auth/login', formData)
  //     login(res.data.user, res.data.token)
  //     navigate(res.data.user.role === 'teacher' ? '/dashboard' : '/courses')
  //   } catch (err) {
  //     setError(err.response?.data?.message || 'Invalid email or password.')
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const handleSubmit = async (e) => {
  e.preventDefault()
  setError('')
  setLoading(true)

  try {
    const res = await api.post('/auth/login', formData)
    const data = res.data

    console.log('Login response:', data) // 👈 check this in console

    // Handle different response shapes from backend
    const token = data.token
    const user = data.user || {
      name: data.name || '',
      email: data.email || formData.email,
      role: data.role || 'student',
      _id: data._id || data.id
    }

    if (!token) {
      setError('Login succeeded but no token received.')
      return
    }

    login(user, token)
    navigate(user.role === 'teacher' ? '/dashboard' : '/courses')

  } catch (err) {
    console.error('Login error:', err.response?.data)
    setError(err.response?.data?.message || 'Invalid email or password.')
  } finally {
    setLoading(false)
  }
}

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* ── Left: Form Panel ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '48px 40px',
        background: '#ffffff',
        overflowY: 'auto'
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563eb, #0d9488)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white"/>
                <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.3px' }}>
              Classynkify
            </span>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>
              Welcome back
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b' }}>
              Sign in to continue your learning journey
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: '#fef2f2', border: '1px solid #fecaca',
              color: '#dc2626', fontSize: '13px',
              padding: '12px 16px', borderRadius: '12px', marginBottom: '20px'
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" stroke="#dc2626" strokeWidth="2"/>
                <path d="M12 8v4M12 16h.01" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Email address
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#94a3b8" strokeWidth="1.5"/>
                    <polyline points="22,6 12,13 2,6" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <input
                  type="email" name="email" value={formData.email}
                  onChange={handleChange} required placeholder="you@school.edu"
                  style={{
                    width: '100%', paddingLeft: '42px', paddingRight: '16px',
                    paddingTop: '12px', paddingBottom: '12px',
                    background: '#f8fafc', border: '1.5px solid #e2e8f0',
                    borderRadius: '12px', fontSize: '14px', color: '#0f172a',
                    outline: 'none', transition: 'all 0.2s', fontFamily: 'inherit'
                  }}
                  onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.background = '#fff' }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc' }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151' }}>Password</label>
                <a href="#" style={{ fontSize: '12px', color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>
                  Forgot password?
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="11" width="18" height="11" rx="2" stroke="#94a3b8" strokeWidth="1.5"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'} name="password"
                  value={formData.password} onChange={handleChange}
                  required placeholder="••••••••"
                  style={{
                    width: '100%', paddingLeft: '42px', paddingRight: '44px',
                    paddingTop: '12px', paddingBottom: '12px',
                    background: '#f8fafc', border: '1.5px solid #e2e8f0',
                    borderRadius: '12px', fontSize: '14px', color: '#0f172a',
                    outline: 'none', transition: 'all 0.2s', fontFamily: 'inherit'
                  }}
                  onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.background = '#fff' }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc' }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{
                width: '100%', padding: '13px',
                background: loading ? '#93c5fd' : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: 'white', border: 'none', borderRadius: '12px',
                fontSize: '14px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s', marginTop: '4px',
                boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
                fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}
              onMouseEnter={e => { if (!loading) e.target.style.boxShadow = '0 6px 20px rgba(37,99,235,0.45)' }}
              onMouseLeave={e => { e.target.style.boxShadow = '0 4px 14px rgba(37,99,235,0.35)' }}
            >
              {loading ? (
                <>
                  <svg style={{ animation: 'spin 1s linear infinite' }} width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                  Signing in...
                </>
              ) : 'Sign in'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#64748b', marginTop: '28px' }}>
            New to Classynkify?{' '}
            <Link to="/register" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* ── Right: Visual Panel ── */}
      <div style={{
        flex: 1, display: 'none',
        background: 'linear-gradient(145deg, #1e40af 0%, #2563eb 45%, #0d9488 100%)',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '48px', position: 'relative', overflow: 'hidden'
      }} className="right-panel">

        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '280px', height: '280px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', top: '40%', right: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(13,148,136,0.2)' }} />

        {/* Stat card top */}
        <div style={{
          position: 'absolute', top: '36px', left: '32px',
          background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '16px', padding: '14px 20px'
        }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', marginBottom: '4px' }}>Active Students</p>
          <p style={{ color: '#fff', fontWeight: '700', fontSize: '20px' }}>12,400+</p>
        </div>

        {/* Stat card bottom */}
        <div style={{
          position: 'absolute', bottom: '48px', right: '32px',
          background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '16px', padding: '14px 20px'
        }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', marginBottom: '4px' }}>Courses Available</p>
          <p style={{ color: '#fff', fontWeight: '700', fontSize: '20px' }}>340+</p>
        </div>

        {/* Main content */}
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '380px' }}>

          {/* Illustration */}
          <svg width="260" height="220" viewBox="0 0 260 220" fill="none" style={{ marginBottom: '32px', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.2))' }}>
            <rect x="30" y="10" width="200" height="140" rx="14" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
            <rect x="44" y="24" width="172" height="108" rx="8" fill="rgba(255,255,255,0.08)"/>
            <circle cx="130" cy="78" r="26" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
            <polygon points="123,68 123,88 145,78" fill="rgba(255,255,255,0.9)"/>
            <rect x="60" y="114" width="140" height="4" rx="2" fill="rgba(255,255,255,0.12)"/>
            <rect x="60" y="114" width="85" height="4" rx="2" fill="rgba(255,255,255,0.6)"/>
            <rect x="114" y="150" width="32" height="14" rx="2" fill="rgba(255,255,255,0.12)"/>
            <rect x="90" y="162" width="80" height="6" rx="3" fill="rgba(255,255,255,0.15)"/>
            <rect x="4" y="90" width="46" height="56" rx="6" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
            <rect x="10" y="98" width="34" height="3.5" rx="1.75" fill="rgba(255,255,255,0.5)"/>
            <rect x="10" y="106" width="26" height="2.5" rx="1.25" fill="rgba(255,255,255,0.25)"/>
            <rect x="10" y="112" width="30" height="2.5" rx="1.25" fill="rgba(255,255,255,0.25)"/>
            <rect x="10" y="118" width="22" height="2.5" rx="1.25" fill="rgba(255,255,255,0.25)"/>
            <rect x="210" y="86" width="46" height="36" rx="6" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
            <rect x="216" y="94" width="34" height="3" rx="1.5" fill="rgba(255,255,255,0.5)"/>
            <rect x="220" y="101" width="26" height="2.5" rx="1.25" fill="rgba(255,255,255,0.25)"/>
            <circle cx="233" cy="114" r="5" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
            <circle cx="24" cy="52" r="3" fill="rgba(255,255,255,0.35)"/>
            <circle cx="238" cy="40" r="2.5" fill="rgba(255,255,255,0.3)"/>
            <circle cx="16" cy="168" r="2" fill="rgba(255,255,255,0.3)"/>
            <circle cx="252" cy="148" r="3" fill="rgba(255,255,255,0.35)"/>
          </svg>

          <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: '700', marginBottom: '12px', lineHeight: '1.3' }}>
            Learn from the best.<br />Grow without limits.
          </h2>
          <p style={{ color: 'rgba(219,234,254,0.85)', fontSize: '14px', lineHeight: '1.7', marginBottom: '28px' }}>
            Access live classes, recorded lectures, and assignments — all in one place built for your school.
          </p>

          {/* Feature pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
            {['Live Classes', 'HD Lectures', 'Assignments', 'AI Doubt Solver'].map(f => (
              <span key={f} style={{
                background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff', fontSize: '12px', padding: '6px 14px',
                borderRadius: '999px', fontWeight: '500'
              }}>{f}</span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (min-width: 1024px) {
          .right-panel { display: flex !important; }
        }
      `}</style>
    </div>
  )
}

export default Login