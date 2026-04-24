import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const Register = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   if (formData.password.length < 6) { setError('Password must be at least 6 characters.'); return }
  //   setError(''); setLoading(true)
  //   try {
  //     const res = await api.post('/auth/register', formData)
  //     login(res.data.user, res.data.token)
  //     navigate(res.data.user.role === 'teacher' ? '/dashboard' : '/courses')
  //   } catch (err) {
  //     setError(err.response?.data?.message || 'Registration failed. Try again.')
  //   } finally { setLoading(false) }
  // }

const handleSubmit = async (e) => {
  e.preventDefault()
  if (formData.password.length < 6) {
    setError('Password must be at least 6 characters.')
    return
  }
  setError('')
  setLoading(true)

  try {
    // Step 1: Register
    await api.post('/auth/register', formData)

    // Step 2: Immediately login with same credentials to get token
    const loginRes = await api.post('/auth/login', {
      email: formData.email,
      password: formData.password
    })

    const data = loginRes.data
    console.log('Login after register response:', data)

    // Extract token and user from whatever shape backend returns
    const token = data.token || data.data?.token
    const user = data.user || data.data?.user || data.data || {
      name: formData.name,
      email: formData.email,
      role: formData.role,
    }

    if (!token) {
      setError('Account created but login failed. Please login manually.')
      navigate('/login')
      return
    }

    login(user, token)
    navigate(user.role === 'teacher' ? '/dashboard' : '/courses')

  } catch (err) {
    console.error('Error:', err.response?.data)
    setError(err.response?.data?.message || 'Registration failed. Try again.')
  } finally {
    setLoading(false)
  }
}

  const inputStyle = {
    width: '100%', paddingTop: '12px', paddingBottom: '12px',
    paddingRight: '16px', background: '#f8fafc',
    border: '1.5px solid #e2e8f0', borderRadius: '12px',
    fontSize: '14px', color: '#0f172a', outline: 'none',
    transition: 'all 0.2s', fontFamily: 'inherit'
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* ── Left: Form ── */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: '48px 40px', background: '#ffffff', overflowY: 'auto'
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
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
            <span style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.3px' }}>Classynkify</span>
          </div>

          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>Create your account</h1>
            <p style={{ fontSize: '14px', color: '#64748b' }}>Join thousands of students and teachers on Classynkify</p>
          </div>

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

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

            {/* Role selector */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                I am joining as
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[
                  { value: 'student', label: 'Student', desc: 'Access courses & lectures' },
                  { value: 'teacher', label: 'Teacher', desc: 'Create & manage courses' }
                ].map(r => (
                  <button key={r.value} type="button"
                    onClick={() => setFormData({ ...formData, role: r.value })}
                    style={{
                      padding: '14px', borderRadius: '12px', textAlign: 'left', cursor: 'pointer',
                      border: formData.role === r.value ? '2px solid #2563eb' : '1.5px solid #e2e8f0',
                      background: formData.role === r.value ? '#eff6ff' : '#f8fafc',
                      transition: 'all 0.15s', fontFamily: 'inherit'
                    }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: formData.role === r.value ? '#1d4ed8' : '#374151', marginBottom: '3px' }}>
                      {r.label}
                    </div>
                    <div style={{ fontSize: '11px', color: formData.role === r.value ? '#3b82f6' : '#94a3b8', lineHeight: '1.4' }}>
                      {r.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Full name</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="12" cy="7" r="4" stroke="#94a3b8" strokeWidth="1.5"/>
                  </svg>
                </div>
                <input type="text" name="name" value={formData.name} onChange={handleChange}
                  required placeholder="John Doe"
                  style={{ ...inputStyle, paddingLeft: '42px' }}
                  onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.background = '#fff' }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc' }}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Email address</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#94a3b8" strokeWidth="1.5"/>
                    <polyline points="22,6 12,13 2,6" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  required placeholder="you@school.edu"
                  style={{ ...inputStyle, paddingLeft: '42px' }}
                  onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.background = '#fff' }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc' }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="11" width="18" height="11" rx="2" stroke="#94a3b8" strokeWidth="1.5"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <input type={showPassword ? 'text' : 'password'} name="password"
                  value={formData.password} onChange={handleChange}
                  required placeholder="Min. 6 characters"
                  style={{ ...inputStyle, paddingLeft: '42px', paddingRight: '44px' }}
                  onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.background = '#fff' }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc' }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', padding: 0 }}>
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
              {/* Password strength */}
              {formData.password.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{
                      height: '3px', flex: 1, borderRadius: '2px', transition: 'all 0.3s',
                      background: formData.password.length >= i * 3
                        ? formData.password.length >= 10 ? '#0d9488'
                          : formData.password.length >= 7 ? '#2563eb' : '#f59e0b'
                        : '#e2e8f0'
                    }}/>
                  ))}
                  <span style={{ fontSize: '11px', color: '#94a3b8', minWidth: '36px' }}>
                    {formData.password.length >= 10 ? 'Strong' : formData.password.length >= 7 ? 'Good' : 'Weak'}
                  </span>
                </div>
              )}
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{
                width: '100%', padding: '13px',
                background: loading ? '#93c5fd' : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: 'white', border: 'none', borderRadius: '12px',
                fontSize: '14px', fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s', boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
                fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}>
              {loading ? (
                <>
                  <svg style={{ animation: 'spin 1s linear infinite' }} width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                  Creating account...
                </>
              ) : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#64748b', marginTop: '24px' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>Sign in</Link>
          </p>
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#94a3b8', marginTop: '12px' }}>
            By creating an account, you agree to our{' '}
            <a href="#" style={{ textDecoration: 'underline', color: '#94a3b8' }}>Terms</a> and{' '}
            <a href="#" style={{ textDecoration: 'underline', color: '#94a3b8' }}>Privacy Policy</a>
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

        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}/>
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '280px', height: '280px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}/>

        {/* Stat card */}
        <div style={{
          position: 'absolute', top: '36px', right: '32px',
          background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '16px', padding: '14px 20px'
        }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', marginBottom: '4px' }}>Completion Rate</p>
          <p style={{ color: '#fff', fontWeight: '700', fontSize: '20px' }}>94.2%</p>
        </div>

        <div style={{
          position: 'absolute', bottom: '48px', left: '32px',
          background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '16px', padding: '14px 20px'
        }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', marginBottom: '4px' }}>Live Classes / Week</p>
          <p style={{ color: '#fff', fontWeight: '700', fontSize: '20px' }}>120+</p>
        </div>

        {/* Steps */}
        <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '340px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '36px' }}>
            {[
              { step: '01', title: 'Create your account', desc: 'Takes less than 2 minutes' },
              { step: '02', title: 'Browse your courses', desc: 'Assigned by your teachers' },
              { step: '03', title: 'Start learning', desc: 'Watch, submit, and grow' },
            ].map((item) => (
              <div key={item.step} style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '16px', padding: '16px 20px'
              }}>
                <span style={{ fontSize: '22px', fontWeight: '700', color: 'rgba(255,255,255,0.25)', width: '32px', flexShrink: 0 }}>
                  {item.step}
                </span>
                <div>
                  <p style={{ color: '#fff', fontWeight: '600', fontSize: '14px', marginBottom: '2px' }}>{item.title}</p>
                  <p style={{ color: 'rgba(219,234,254,0.8)', fontSize: '12px' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '10px', textAlign: 'center' }}>
            Your classroom, anywhere.
          </h2>
          <p style={{ color: 'rgba(219,234,254,0.85)', fontSize: '14px', lineHeight: '1.7', textAlign: 'center' }}>
            Everything your school needs — lectures, assignments, live sessions, and more.
          </p>
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

export default Register