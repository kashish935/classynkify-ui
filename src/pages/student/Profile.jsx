import { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import api from '../../api/axiosInstance'
import { useAuth } from '../../context/AuthContext'

const TABS = ['Personal Info', 'Change Password']

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState('Personal Info')

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile & Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your personal information and security</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors
              ${activeTab === tab
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Personal Info' && (
        <PersonalInfoTab user={user} updateUser={updateUser} />
      )}
      {activeTab === 'Change Password' && (
        <ChangePasswordTab />
      )}
    </div>
  )
}

// ─── Personal Info Tab ────────────────────────────────────────────────────────

function PersonalInfoTab({ user, updateUser }) {
  const fileRef = useRef(null)

  const [form, setForm] = useState({
    firstName: user?.firstName ?? '',
    lastName:  user?.lastName  ?? '',
    email:     user?.email     ?? '',
    phone:     user?.phone     ?? '',
    bio:       user?.bio       ?? '',
  })
  const [avatar,         setAvatar]         = useState(user?.avatar ?? null)
  const [avatarFile,     setAvatarFile]     = useState(null)
  const [avatarPreview,  setAvatarPreview]  = useState(null)
  const [saving,         setSaving]         = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  const initials = `${form.firstName?.[0] ?? ''}${form.lastName?.[0] ?? ''}`.toUpperCase()

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleAvatarChange = e => {
    const file = e.target.files[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleAvatarUpload = async () => {
    if (!avatarFile) return
    const fd = new FormData()
    fd.append('avatar', avatarFile)

    setUploadingAvatar(true)
    try {
      const { data } = await api.post('/student/profile/avatar', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setAvatar(data.avatarUrl)
      setAvatarPreview(null)
      setAvatarFile(null)
      updateUser({ avatar: data.avatarUrl })
      toast.success('Avatar updated!')
    } catch {
      toast.error('Avatar upload failed')
    } finally {
      setUploadingAvatar(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const handleSave = async e => {
    e.preventDefault()
    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast.error('First and last name are required')
      return
    }
    setSaving(true)
    try {
      const { data } = await api.put('/student/profile', form)
      updateUser(data.user)
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">

      {/* Avatar section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Profile Picture</h2>
        <div className="flex items-center gap-5 flex-wrap">

          {/* Avatar display */}
          <div className="relative shrink-0">
            {avatarPreview || avatar ? (
              <img
                src={avatarPreview ?? avatar}
                alt="avatar"
                className="h-20 w-20 rounded-full object-cover border-2 border-indigo-200"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold border-2 border-indigo-200">
                {initials || '?'}
              </div>
            )}
            {/* Camera overlay */}
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center text-gray-500 hover:bg-gray-50 text-xs"
            >
              ✎
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs text-gray-400">JPG, PNG up to 5MB</p>
            <div className="flex gap-2">
              <button
                onClick={() => fileRef.current?.click()}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Choose Photo
              </button>
              {avatarFile && (
                <button
                  onClick={handleAvatarUpload}
                  disabled={uploadingAvatar}
                  className="px-3 py-1.5 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {uploadingAvatar ? 'Uploading…' : 'Upload'}
                </button>
              )}
            </div>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
      </div>

      {/* Info form */}
      <form onSubmit={handleSave} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h2 className="text-sm font-semibold text-gray-700">Personal Information</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="First Name"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            required
          />
          <Field
            label="Last Name"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <Field
          label="Email Address"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          disabled
          hint="Email cannot be changed"
        />

        <Field
          label="Phone Number"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder="+91 98765 43210"
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={3}
            maxLength={300}
            placeholder="Tell your teachers a little about yourself…"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800
              focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none placeholder-gray-300"
          />
          <p className="text-xs text-gray-400 text-right">{form.bio.length}/300</p>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium
              hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}

// ─── Change Password Tab ──────────────────────────────────────────────────────

function ChangePasswordTab() {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
  })
  const [show,   setShow]   = useState({ current: false, new: false, confirm: false })
  const [saving, setSaving] = useState(false)

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const strength = passwordStrength(form.newPassword)

  const handleSubmit = async e => {
    e.preventDefault()
    if (form.newPassword !== form.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    if (form.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    setSaving(true)
    try {
      await api.put('/student/profile/password', {
        currentPassword: form.currentPassword,
        newPassword:     form.newPassword,
      })
      toast.success('Password changed successfully!')
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Password change failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
      <h2 className="text-sm font-semibold text-gray-700">Change Password</h2>

      <PasswordField
        label="Current Password"
        name="currentPassword"
        value={form.currentPassword}
        onChange={handleChange}
        show={show.current}
        onToggle={() => setShow(s => ({ ...s, current: !s.current }))}
        required
      />

      <PasswordField
        label="New Password"
        name="newPassword"
        value={form.newPassword}
        onChange={handleChange}
        show={show.new}
        onToggle={() => setShow(s => ({ ...s, new: !s.new }))}
        required
      />

      {/* Strength indicator */}
      {form.newPassword && (
        <div className="space-y-1 -mt-2">
          <div className="flex gap-1">
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors
                  ${i < strength.score
                    ? strength.score <= 1 ? 'bg-red-400'
                    : strength.score <= 2 ? 'bg-amber-400'
                    : strength.score <= 3 ? 'bg-yellow-400'
                    : 'bg-green-500'
                    : 'bg-gray-100'
                  }`}
              />
            ))}
          </div>
          <p className={`text-xs font-medium ${strength.color}`}>{strength.label}</p>
        </div>
      )}

      <PasswordField
        label="Confirm New Password"
        name="confirmPassword"
        value={form.confirmPassword}
        onChange={handleChange}
        show={show.confirm}
        onToggle={() => setShow(s => ({ ...s, confirm: !s.confirm }))}
        required
      />

      {/* Match indicator */}
      {form.confirmPassword && (
        <p className={`text-xs -mt-2 font-medium ${
          form.newPassword === form.confirmPassword ? 'text-green-500' : 'text-red-400'
        }`}>
          {form.newPassword === form.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
        </p>
      )}

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium
            hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Updating…' : 'Update Password'}
        </button>
      </div>
    </form>
  )
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function Field({ label, hint, disabled, ...props }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        {...props}
        disabled={disabled}
        className={`w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800
          focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-300
          ${disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''}`}
      />
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  )
}

function PasswordField({ label, name, value, onChange, show, onToggle, required }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 pr-10 text-sm text-gray-800
            focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
        >
          {show ? 'Hide' : 'Show'}
        </button>
      </div>
    </div>
  )
}

function passwordStrength(pwd) {
  if (!pwd) return { score: 0, label: '', color: '' }
  let score = 0
  if (pwd.length >= 8)              score++
  if (/[A-Z]/.test(pwd))           score++
  if (/[0-9]/.test(pwd))           score++
  if (/[^A-Za-z0-9]/.test(pwd))    score++
  const map = [
    { label: 'Too weak',  color: 'text-red-400'   },
    { label: 'Weak',      color: 'text-red-400'   },
    { label: 'Fair',      color: 'text-amber-500' },
    { label: 'Good',      color: 'text-yellow-500'},
    { label: 'Strong',    color: 'text-green-500' },
  ]
  return { score, ...map[score] }
}