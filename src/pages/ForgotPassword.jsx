import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../services/api'

const labelStyle = {
  display: 'block', fontSize: '13px', fontWeight: '500',
  color: '#374151', marginBottom: '6px',
}

const inputStyle = {
  width: '100%', boxSizing: 'border-box', padding: '12px 16px',
  background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px',
  fontSize: '14px', color: '#0f172a', outline: 'none',
  fontFamily: 'inherit', marginBottom: '18px',
}

const buttonStyle = (disabled) => ({
  width: '100%', padding: '13px', color: 'white', border: 'none',
  borderRadius: '12px', fontSize: '14px', fontWeight: '600',
  cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
  background: disabled ? '#93c5fd' : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
  boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
})

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1 = email, 2 = OTP + new password
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [hint, setHint] = useState('')
  const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const sendOtp = async (e) => {
    e?.preventDefault()
    if (!email.trim()) return toast.error('Please enter your email.')
    setLoading(true)
    try {
      const res = await api.post('/auth/forgot-password', { email: email.trim() })
      setHint(res.data.message)
      setStep(2)
      setCooldown(60)
      toast.success(res.data.message)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP.')
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (e) => {
    e.preventDefault()
    if (newPassword.length < 6) return toast.error('Password must be at least 6 characters.')
    if (newPassword !== confirm) return toast.error('Passwords do not match.')
    setLoading(true)
    try {
      await api.post('/auth/reset-password', { email: email.trim(), otp, newPassword })
      toast.success('Password reset successfully. Please log in.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password.')
    } finally {
      setLoading(false)
    }
  }

  const resetDisabled = loading || otp.length !== 6 || !newPassword || !confirm

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#f1f5f9', padding: '16px',
    }}>
      <div style={{
        width: '100%', maxWidth: '420px', background: '#fff', borderRadius: '20px',
        padding: '32px', boxShadow: '0 4px 24px rgba(15, 23, 42, 0.08)',
      }}>
        <h2 style={{ margin: '0 0 6px', fontSize: '24px', color: '#0f172a' }}>Forgot password</h2>
        <p style={{ margin: '0 0 24px', color: '#64748b', fontSize: '14px' }}>
          {step === 1
            ? 'Enter your email and we will send an OTP to the phone number on your account.'
            : hint}
        </p>

        {step === 1 ? (
          <form onSubmit={sendOtp}>
            <label style={labelStyle}>Email address</label>
            <input
              style={inputStyle} type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@school.edu" autoFocus
            />
            <button type="submit" disabled={loading} style={buttonStyle(loading)}>
              {loading ? 'Sending…' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={resetPassword}>
            <label style={labelStyle}>OTP</label>
            <input
              style={inputStyle} inputMode="numeric" maxLength={6} value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="6-digit OTP" autoFocus
            />

            <label style={labelStyle}>New password</label>
            <input
              style={inputStyle} type="password" value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <label style={labelStyle}>Confirm new password</label>
            <input
              style={inputStyle} type="password" value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />

            <button type="submit" disabled={resetDisabled} style={buttonStyle(resetDisabled)}>
              {loading ? 'Resetting…' : 'Reset password'}
            </button>

            <button
              type="button" onClick={sendOtp} disabled={cooldown > 0 || loading}
              style={{
                marginTop: '14px', width: '100%', background: 'none', border: 'none',
                color: cooldown > 0 ? '#94a3b8' : '#2563eb', fontWeight: '600',
                cursor: cooldown > 0 ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
              }}
            >
              {cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to="/login" style={{ color: '#2563eb', fontSize: '14px', textDecoration: 'none' }}>
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}