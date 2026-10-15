import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import axiosInstance from '../api/axiosInstance'
import { toast } from 'react-toastify'

const AVATAR_COLORS = [
  { bg: '#dbeafe', fg: '#1d4ed8' },
  { bg: '#dcfce7', fg: '#15803d' },
  { bg: '#fef3c7', fg: '#b45309' },
  { bg: '#fce7f3', fg: '#be185d' },
  { bg: '#ede9fe', fg: '#6d28d9' },
  { bg: '#ccfbf1', fg: '#0f766e' },
]

const getAvatarColor = (name = '') =>
  AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length]

const initialsOf = (name = '') =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('') || '?'

function Avatar({ name, size = 80 }) {
  const c = getAvatarColor(name)
  return (
    <div
      style={{
        width: size, height: size, borderRadius: '50%',
        background: c.bg, color: c.fg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.36, fontWeight: 700, margin: '0 auto',
      }}
    >
      {initialsOf(name)}
    </div>
  )
}

function Card({ title, children }) {
  return (
    <div style={{ background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 1px 3px rgba(15,23,42,0.06)' }}>
      <h3 style={{ margin: '0 0 20px', fontSize: 17, color: '#0f172a' }}>{title}</h3>
      {children}
    </div>
  )
}

function Field({ label, required, error, hint, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      {children}
      {error && <div style={{ color: '#ef4444', fontSize: 12, marginTop: 6 }}>{error}</div>}
      {hint && !error && <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 6 }}>{hint}</div>}
    </div>
  )
}

const inputStyle = (error) => ({
  width: '100%', boxSizing: 'border-box', padding: '12px 14px', fontSize: 14,
  border: `1.5px solid ${error ? '#ef4444' : '#e2e8f0'}`, borderRadius: 12,
  outline: 'none', fontFamily: 'inherit', background: '#fff', color: '#0f172a',
})

const Spinner = () => (
  <span
    style={{
      width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)',
      borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block',
      animation: 'profile-spin 0.8s linear infinite',
    }}
  />
)

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  })
  const [saved, setSaved] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  // Load the latest saved profile so phone and bio always show
  useEffect(() => {
    axiosInstance
      .get('/auth/profile')
      .then((res) => {
        const u = res.data.user
        const next = {
          name: u.name || '',
          email: u.email || '',
          phone: u.phone || '',
          bio: u.bio || '',
        }
        setForm(next)
        setSaved(next)
      })
      .catch(() => {})
  }, [])

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = 'Enter a valid email'
    const digits = form.phone.replace(/\D/g, '')
    if (digits && digits.slice(-10).length !== 10) e.phone = 'Enter a valid 10-digit phone number'
    return e
  }

  const hasChanges =
    form.name.trim() !== saved.name ||
    form.email.trim() !== saved.email ||
    form.phone.trim() !== saved.phone ||
    form.bio.trim() !== saved.bio

  const handleSave = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setSaving(true)
    try {
      const u = await updateProfile({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        bio: form.bio.trim(),
      })
      const next = {
        name: u.name || '',
        email: u.email || '',
        phone: u.phone || '',
        bio: u.bio || '',
      }
      setForm(next)
      setSaved(next)
      toast.success('Profile updated successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const disabled = saving || !hasChanges

  return (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', padding: '24px 16px', alignItems: 'flex-start' }}>
      <style>{`@keyframes profile-spin { to { transform: rotate(360deg); } }`}</style>

      {/* Left: summary */}
      <div style={{ flex: '1 1 260px', maxWidth: 320 }}>
        <Card title="Profile">
          <Avatar name={form.name || user?.name} size={88} />
          <div style={{ textAlign: 'center', marginTop: 14 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>{saved.name || user?.name}</div>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{saved.email || user?.email}</div>
            <span
              style={{
                display: 'inline-block', marginTop: 12, padding: '4px 12px', borderRadius: 999,
                fontSize: 12, fontWeight: 600, background: '#e0e7ff', color: '#4338ca',
              }}
            >
              🎓 Teacher
            </span>
          </div>
          <div style={{ marginTop: 20, fontSize: 13, color: '#475569', display: 'grid', gap: 10 }}>
            <div>✉️ {saved.email || '—'}</div>
            <div>📞 {saved.phone || 'No phone number added'}</div>
          </div>
        </Card>
      </div>

      {/* Right: form */}
      <form onSubmit={handleSave} style={{ flex: '2 1 420px', minWidth: 0 }}>
        <Card title="Personal Information">
          <Field label="Full name" required error={errors.name}>
            <input
              style={inputStyle(errors.name)} value={form.name}
              onChange={handleChange('name')} placeholder="Your full name"
            />
          </Field>

          <Field label="Email address" required error={errors.email}>
            <input
              style={inputStyle(errors.email)} type="email" value={form.email}
              onChange={handleChange('email')} placeholder="your@email.com"
            />
          </Field>

          <Field
            label="Phone number" error={errors.phone}
            hint="Used to send an OTP if you forget your password."
          >
            <input
              style={inputStyle(errors.phone)} type="tel" value={form.phone}
              onChange={handleChange('phone')} placeholder="10-digit mobile number"
            />
          </Field>

          <Field label="Bio">
            <textarea
              style={{ ...inputStyle(false), minHeight: 110, resize: 'vertical' }}
              value={form.bio}
              onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value.slice(0, 300) }))}
              placeholder="Tell your students a little about yourself..."
            />
            <div style={{ textAlign: 'right', fontSize: 12, color: '#94a3b8', marginTop: 6 }}>
              {form.bio.length}/300
            </div>
          </Field>

          <Field label="Role">
            <input style={{ ...inputStyle(false), background: '#f8fafc', color: '#94a3b8' }} value="Teacher" disabled />
          </Field>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit" disabled={disabled}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '12px 28px',
                fontSize: 14, fontWeight: 600, border: 'none', borderRadius: 12,
                cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                background: disabled ? '#e2e8f0' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: disabled ? '#94a3b8' : '#fff',
              }}
            >
              {saving && <Spinner />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </Card>
      </form>
    </div>
  )
}