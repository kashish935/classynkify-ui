import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import axiosInstance from '../../api/axiosInstance'
import { toast } from 'react-toastify'

const InputField = ({ label, value, onChange, placeholder, disabled, type = 'text' }) => (
  <div>
    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
      {label}
    </label>
    <input
      type={type} value={value} onChange={onChange}
      placeholder={placeholder} disabled={disabled}
      style={{
        width: '100%', padding: '11px 14px',
        background: disabled ? '#f8fafc' : '#fff',
        border: '1.5px solid #e2e8f0', borderRadius: '12px',
        fontSize: '14px', color: disabled ? '#94a3b8' : '#0f172a',
        outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
        cursor: disabled ? 'not-allowed' : 'text', transition: 'border-color 0.2s'
      }}
      onFocus={e => { if (!disabled) e.target.style.borderColor = '#6366f1' }}
      onBlur={e => { e.target.style.borderColor = '#e2e8f0' }}
    />
    {disabled && <p style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '4px' }}>This field cannot be changed</p>}
  </div>
)

const TabBtn = ({ label, active, onClick }) => (
  <button onClick={onClick} style={{
    padding: '10px 22px', borderRadius: '12px', fontSize: '14px', fontWeight: '600',
    background: active ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
    color: active ? '#fff' : '#64748b',
    border: 'none', cursor: 'pointer', transition: 'all 0.2s'
  }}>
    {label}
  </button>
)

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [tab, setTab] = useState('info')
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  })

  const [passwords, setPasswords] = useState({
    current: '', newPass: '', confirm: ''
  })
  const [showPwd, setShowPwd] = useState({ current: false, newPass: false, confirm: false })

  const handleSaveInfo = async () => {
    setSaving(true)
    try {
      const name = `${form.firstName} ${form.lastName}`.trim()
      const res = await axiosInstance.put('/student/profile', { name, phone: form.phone, bio: form.bio })
      updateUser(res.data?.user || { name, phone: form.phone, bio: form.bio })
      toast.success('Profile updated!')
    } catch {
      toast.error('Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwords.newPass !== passwords.confirm) {
      toast.error('Passwords do not match.'); return
    }
    if (passwords.newPass.length < 6) {
      toast.error('Password must be at least 6 characters.'); return
    }
    setSaving(true)
    try {
      await axiosInstance.put('/student/profile/password', {
        currentPassword: passwords.current,
        newPassword: passwords.newPass
      })
      toast.success('Password changed!')
      setPasswords({ current: '', newPass: '', confirm: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password.')
    } finally {
      setSaving(false)
    }
  }

  const initials = ((form.firstName[0] || '') + (form.lastName[0] || '')).toUpperCase() || user?.name?.[0]?.toUpperCase() || '?'

  return (
    <div style={{ padding: '32px 40px', maxWidth: '760px', margin: '0 auto', fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '4px' }}>
          👤 Profile & Settings
        </h1>
        <p style={{ fontSize: '14px', color: '#94a3b8' }}>Manage your personal information and security</p>
      </div>

      {/* Profile hero */}
      <div style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        borderRadius: '24px', padding: '28px 32px', marginBottom: '28px',
        display: 'flex', alignItems: 'center', gap: '24px',
        boxShadow: '0 8px 32px rgba(99,102,241,0.25)'
      }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)',
          border: '3px solid rgba(255,255,255,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', fontWeight: '800', color: '#fff', flexShrink: 0,
          position: 'relative'
        }}>
          {initials}
          <label htmlFor="avatar-upload" style={{
            position: 'absolute', bottom: '-2px', right: '-2px',
            width: '26px', height: '26px', borderRadius: '50%',
            background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <input id="avatar-upload" type="file" accept="image/*" style={{ display: 'none' }} />
          </label>
        </div>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>
            {user?.name || 'Student'}
          </h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', marginBottom: '8px' }}>{user?.email}</p>
          <span style={{
            fontSize: '12px', fontWeight: '600', color: '#6366f1',
            background: '#fff', padding: '3px 12px', borderRadius: '999px'
          }}>
            {user?.role || 'Student'}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: '4px', padding: '4px',
        background: '#f8fafc', borderRadius: '14px', marginBottom: '28px',
        width: 'fit-content'
      }}>
        <TabBtn label="Personal Info" active={tab === 'info'} onClick={() => setTab('info')} />
        <TabBtn label="Change Password" active={tab === 'password'} onClick={() => setTab('password')} />
      </div>

      {/* Content */}
      <div style={{
        background: '#fff', borderRadius: '24px', padding: '32px',
        border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
      }}>

        {tab === 'info' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <InputField label="First Name" value={form.firstName}
                onChange={e => setForm({ ...form, firstName: e.target.value })}
                placeholder="John" />
              <InputField label="Last Name" value={form.lastName}
                onChange={e => setForm({ ...form, lastName: e.target.value })}
                placeholder="Doe" />
            </div>

            <InputField label="Email Address" value={user?.email || ''} disabled />

            <InputField label="Phone Number" value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              placeholder="+91 98765 43210" type="tel" />

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                Bio
              </label>
              <textarea
                value={form.bio}
                onChange={e => setForm({ ...form, bio: e.target.value.slice(0, 300) })}
                placeholder="Tell your teachers a little about yourself..."
                rows={4}
                style={{
                  width: '100%', padding: '11px 14px',
                  background: '#fff', border: '1.5px solid #e2e8f0',
                  borderRadius: '12px', fontSize: '14px', color: '#0f172a',
                  resize: 'vertical', outline: 'none', fontFamily: 'inherit',
                  boxSizing: 'border-box', lineHeight: 1.6, transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
              <p style={{ fontSize: '11px', color: '#cbd5e1', textAlign: 'right', marginTop: '4px' }}>
                {form.bio.length}/300
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '4px' }}>
              <button onClick={handleSaveInfo} disabled={saving} style={{
                padding: '12px 28px',
                background: saving ? '#c7d2fe' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff', border: 'none', borderRadius: '12px',
                fontSize: '14px', fontWeight: '700', cursor: saving ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(99,102,241,0.3)'
              }}>
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {tab === 'password' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{
              background: '#eff6ff', border: '1px solid #bfdbfe',
              borderRadius: '12px', padding: '14px 16px', marginBottom: '4px'
            }}>
              <p style={{ fontSize: '13px', color: '#2563eb' }}>
                🔒 Use a strong password with at least 8 characters, including numbers and symbols.
              </p>
            </div>

            {[
              { key: 'current', label: 'Current Password' },
              { key: 'newPass', label: 'New Password' },
              { key: 'confirm', label: 'Confirm New Password' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                  {label}
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPwd[key] ? 'text' : 'password'}
                    value={passwords[key]}
                    onChange={e => setPasswords({ ...passwords, [key]: e.target.value })}
                    placeholder="••••••••"
                    style={{
                      width: '100%', padding: '11px 44px 11px 14px',
                      background: '#fff', border: '1.5px solid #e2e8f0',
                      borderRadius: '12px', fontSize: '14px', color: '#0f172a',
                      outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={e => e.target.style.borderColor = '#6366f1'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                  <button type="button"
                    onClick={() => setShowPwd(p => ({ ...p, [key]: !p[key] }))}
                    style={{
                      position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8',
                      display: 'flex', alignItems: 'center'
                    }}>
                    {showPwd[key] ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/></svg>
                    )}
                  </button>
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '4px' }}>
              <button onClick={handleChangePassword} disabled={saving || !passwords.current || !passwords.newPass || !passwords.confirm}
                style={{
                  padding: '12px 28px',
                  background: (saving || !passwords.current || !passwords.newPass || !passwords.confirm) ? '#c7d2fe' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: '#fff', border: 'none', borderRadius: '12px',
                  fontSize: '14px', fontWeight: '700',
                  cursor: (saving || !passwords.current || !passwords.newPass || !passwords.confirm) ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px rgba(99,102,241,0.3)'
                }}>
                {saving ? 'Updating…' : 'Change Password'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}