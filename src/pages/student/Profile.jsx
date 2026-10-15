import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';

const labelStyle = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: '#475569',
  marginBottom: 8,
};

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '16px 18px',
  fontSize: 16,
  color: '#0f172a',
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: 14,
  outline: 'none',
  fontFamily: 'inherit',
};

const disabledStyle = {
  ...inputStyle,
  background: '#f8fafc',
  color: '#94a3b8',
  cursor: 'not-allowed',
};

const splitName = (full = '') => {
  const parts = full.trim().split(/\s+/);
  return { firstName: parts[0] || '', lastName: parts.slice(1).join(' ') };
};

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    ...splitName(user?.name),
    phone: user?.phone || '',
    bio: user?.bio || '',
  });

  // Load the saved profile from the server so phone/bio persist after refresh/login
  useEffect(() => {
    axiosInstance
      .get('/auth/profile')
      .then((res) => {
        const u = res.data.user;
        setForm({ ...splitName(u.name), phone: u.phone || '', bio: u.bio || '' });
        updateUser(u);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    const name = `${form.firstName} ${form.lastName}`.trim();
    if (!name) {
      toast.error('Please enter your name.');
      return;
    }
    setSaving(true);
    try {
      const res = await axiosInstance.put('/auth/profile', {
        name,
        phone: form.phone,
        bio: form.bio,
      });
      updateUser(res.data.user);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 16px' }}>
      <form
        onSubmit={handleSave}
        style={{
          width: '100%',
          maxWidth: 850,
          background: '#fff',
          borderRadius: 28,
          padding: 40,
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.06)',
        }}
      >
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 24 }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <label style={labelStyle}>First Name</label>
            <input
              style={inputStyle}
              value={form.firstName}
              onChange={handleChange('firstName')}
              placeholder="John"
            />
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <label style={labelStyle}>Last Name</label>
            <input
              style={inputStyle}
              value={form.lastName}
              onChange={handleChange('lastName')}
              placeholder="Doe"
            />
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Email Address</label>
          <input style={disabledStyle} value={user?.email || ''} disabled readOnly />
          <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 6 }}>
            This field cannot be changed
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Phone Number</label>
          <input
            style={inputStyle}
            type="tel"
            value={form.phone}
            onChange={handleChange('phone')}
            placeholder="+91 98765 43210"
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={labelStyle}>Bio</label>
          <textarea
            style={{ ...inputStyle, minHeight: 140, resize: 'vertical' }}
            rows={5}
            value={form.bio}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, bio: e.target.value.slice(0, 300) }))
            }
            placeholder="Tell your teachers a little about yourself..."
          />
          <div style={{ textAlign: 'right', fontSize: 13, color: '#94a3b8', marginTop: 8 }}>
            {form.bio.length}/300
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: '16px 36px',
              fontSize: 16,
              fontWeight: 600,
              color: '#fff',
              border: 'none',
              borderRadius: 14,
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
            }}
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}