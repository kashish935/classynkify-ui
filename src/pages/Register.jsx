import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const inputStyle = {
  width: '100%',
  paddingRight: '16px',
  paddingTop: '12px',
  paddingBottom: '12px',
  background: '#f8fafc',
  border: '1.5px solid #e2e8f0',
  borderRadius: '12px',
  fontSize: '14px',
  color: '#0f172a',
  outline: 'none',
  transition: 'all 0.2s',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
}

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '500',
  color: '#374151',
  marginBottom: '6px',
}

const iconBox = {
  position: 'absolute',
  left: '14px',
  top: '50%',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
}

const focusIn = (e) => {
  e.target.style.borderColor = '#2563eb'
  e.target.style.background = '#fff'
}
const focusOut = (e) => {
  e.target.style.borderColor = '#e2e8f0'
  e.target.style.background = '#f8fafc'
}

const roles = [
  { value: 'student', label: 'Student', desc: 'Learn and submit work' },
  { value: 'teacher', label: 'Teacher', desc: 'Create and manage courses' },
]

const Register = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'student',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const digits = formData.phone.replace(/\D/g, '').slice(-10)
    if (digits.length !== 10) {
      setError('Enter a valid 10-digit phone number.')
      return
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setError('')
    setLoading(true)

    try {
      const res = await api.post('/auth/register', { ...formData, phone: digits })
      const data = res.data
      const token = data.token || data.data?.token
      const user = data.user || data.data?.user

      if (!token || !user) {
        setError('Account created. Please sign in.')
        navigate('/login')
        return
      }

      login(user, token)
      navigate(user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard')
    } catch (err) {
      console.error('Register error:', err.response?.data)
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* ── Left: Form Panel ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px',
          background: '#ffffff',
          overflowY: 'auto',
        }}
      >
        <div style={{ width: '100%', maxWidth: '420px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #2563eb, #0d9488)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" />
                <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.3px' }}>
              Classynkify
            </span>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>
              Create your account
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b' }}>
              Join Classynkify and start learning today
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                fontSize: '13px',
                padding: '12px 16px',
                borderRadius: '12px',
                marginBottom: '20px',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" stroke="#dc2626" strokeWidth="2" />
                <path d="M12 8v4M12 16h.01" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Role */}
            <div>
              <label style={labelStyle}>I am a</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {roles.map((r) => {
                  const selected = formData.role === r.value
                  return (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: r.value })}
                      style={{
                        flex: 1,
                        textAlign: 'left',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        border: selected ? '2px solid #2563eb' : '1.5px solid #e2e8f0',
                        background: selected ? '#eff6ff' : '#f8fafc',
                      }}
                    >
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{r.label}</div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{r.desc}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Name */}
            <div>
              <label style={labelStyle}>Full name</label>
              <div style={{ position: 'relative' }}>
                <div style={iconBox}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="12" cy="7" r="4" stroke="#94a3b8" strokeWidth="1.5" />
                  </svg>
                </div>
                <input
                  type="text" name="name" value={formData.name}
                  onChange={handleChange} required placeholder="Your full name"
                  style={{ ...inputStyle, paddingLeft: '42px' }}
                  onFocus={focusIn} onBlur={focusOut}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>Email address</label>
              <div style={{ position: 'relative' }}>
                <div style={iconBox}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#94a3b8" strokeWidth="1.5" />
                    <polyline points="22,6 12,13 2,6" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <input
                  type="email" name="email" value={formData.email}
                  onChange={handleChange} required placeholder="you@school.edu"
                  style={{ ...inputStyle, paddingLeft: '42px' }}
                  onFocus={focusIn} onBlur={focusOut}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label style={labelStyle}>Phone number</label>
              <div style={{ position: 'relative' }}>
                <div style={iconBox}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <input
                  type="tel" name="phone" value={formData.phone}
                  onChange={handleChange} required placeholder="10-digit mobile number"
                  style={{ ...inputStyle, paddingLeft: '42px' }}
                  onFocus={focusIn} onBlur={focusOut}
                />
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
                Used to send an OTP if you forget your password.
              </p>
            </div>

            {/* Password */}
            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <div style={iconBox}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="11" width="18" height="11" rx="2" stroke="#94a3b8" strokeWidth="1.5" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'} name="password"
                  value={formData.password} onChange={handleChange}
                  required placeholder="At least 6 characters"
                  style={{ ...inputStyle, paddingLeft: '42px', paddingRight: '44px' }}
                  onFocus={focusIn} onBlur={focusOut}
                />
                <button
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center' }}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              style={{
                width: '100%',
                padding: '13px',
                background: loading ? '#93c5fd' : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '4px',
                boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
                fontFamily: 'inherit',
              }}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#64748b', marginTop: '24px' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* ── Right: Visual Panel ── */}
      <div
        className="right-panel"
        style={{
          flex: 1,
          display: 'none',
          background: 'linear-gradient(145deg, #1e40af 0%, #2563eb 45%, #0d9488 100%)',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '280px', height: '280px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '380px' }}>
          <h2 style={{ color: '#fff', fontSize: '26px', fontWeight: '700', marginBottom: '12px', lineHeight: '1.3' }}>
            Everything your classroom needs.<br />In one place.
          </h2>
          <p style={{ color: 'rgba(219,234,254,0.85)', fontSize: '14px', lineHeight: '1.7', marginBottom: '28px' }}>
            Live classes, recorded lectures, assignments and an AI doubt solver, built for your school.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
            {['Live Classes', 'HD Lectures', 'Assignments', 'AI Doubt Solver'].map((f) => (
              <span
                key={f}
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  fontSize: '12px',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontWeight: '500',
                }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .right-panel { display: flex !important; }
        }
      `}</style>
    </div>
  )
}

export default Register