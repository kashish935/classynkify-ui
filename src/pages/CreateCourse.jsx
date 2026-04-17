import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import api from '../services/api'

const SUBJECTS = [
  { value: 'mathematics', label: 'Mathematics', emoji: '📐' },
  { value: 'physics', label: 'Physics', emoji: '⚛️' },
  { value: 'chemistry', label: 'Chemistry', emoji: '🧪' },
  { value: 'biology', label: 'Biology', emoji: '🧬' },
  { value: 'english', label: 'English', emoji: '📖' },
  { value: 'history', label: 'History', emoji: '🏛️' },
  { value: 'geography', label: 'Geography', emoji: '🌍' },
  { value: 'computer_science', label: 'Computer Science', emoji: '💻' },
  { value: 'economics', label: 'Economics', emoji: '📊' },
  { value: 'other', label: 'Other', emoji: '📚' },
]

const GRADES = [
  'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9',
  'Grade 10', 'Grade 11', 'Grade 12', 'College'
]

const InputField = ({ label, required, children, hint }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    <label style={{
      fontSize: '13px', fontWeight: '500', color: '#374151',
      display: 'flex', alignItems: 'center', gap: '4px'
    }}>
      {label}
      {required && <span style={{ color: '#ef4444', fontSize: '13px' }}>*</span>}
    </label>
    {children}
    {hint && <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{hint}</p>}
  </div>
)

const inputStyle = (focused) => ({
  width: '100%',
  padding: '11px 14px',
  background: focused ? '#fff' : '#f8fafc',
  border: `1.5px solid ${focused ? '#2563eb' : '#e2e8f0'}`,
  borderRadius: '10px',
  fontSize: '14px',
  color: '#0f172a',
  outline: 'none',
  transition: 'all 0.2s',
  fontFamily: 'Inter, system-ui, sans-serif',
  boxSizing: 'border-box',
})

const CreateCourse = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    grade: '',
    duration: '',
    language: 'English',
  })

  const [thumbnail, setThumbnail] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [focused, setFocused] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  const handleThumbnail = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, WebP).')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB.')
      return
    }
    setThumbnail(file)
    setThumbnailPreview(URL.createObjectURL(file))
    setError('')
  }

  const handleFileInput = (e) => handleThumbnail(e.target.files[0])

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleThumbnail(e.dataTransfer.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) { setError('Course title is required.'); return }
    if (!formData.subject) { setError('Please select a subject.'); return }
    if (!formData.grade) { setError('Please select a grade level.'); return }
    if (!formData.description.trim()) { setError('Please add a course description.'); return }

    setLoading(true)
    setError('')

    try {
      // Build FormData for file upload
      const payload = new FormData()
      payload.append('title', formData.title)
      payload.append('description', formData.description)
      payload.append('subject', formData.subject)
      payload.append('grade', formData.grade)
      payload.append('duration', formData.duration)
      payload.append('language', formData.language)
      if (thumbnail) payload.append('thumbnail', thumbnail)

      // 🔁 Swap this URL with your actual endpoint when ready
      await api.post('/courses', payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      navigate('/my-courses')

    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to create course. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const selectedSubject = SUBJECTS.find(s => s.value === formData.subject)

  return (
    <MainLayout>
      <div style={{ maxWidth: '900px', margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif' }}>

        {/* ── Page Header ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              width: '36px', height: '36px', borderRadius: '10px',
              border: '1.5px solid #e2e8f0', background: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#64748b', transition: 'all 0.15s', flexShrink: 0
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.color = '#2563eb' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <polyline points="15 18 9 12 15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>
              Create New Course
            </h1>
            <p style={{ fontSize: '13px', color: '#64748b' }}>
              Fill in the details below to publish your course
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', alignItems: 'start' }}>

          {/* ── Left: Main Form ── */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

            {/* Error banner */}
            {error && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: '#fef2f2', border: '1px solid #fecaca',
                color: '#dc2626', fontSize: '13px',
                padding: '12px 16px', borderRadius: '12px', marginBottom: '16px'
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10" stroke="#dc2626" strokeWidth="2"/>
                  <path d="M12 8v4M12 16h.01" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                {error}
              </div>
            )}

            {/* ── Section: Basic Info ── */}
            <div style={{
              background: 'white', borderRadius: '16px',
              border: '1px solid #e2e8f0', padding: '24px',
              marginBottom: '16px'
            }}>
              <SectionTitle icon="📝" title="Basic Information" />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

                <InputField label="Course Title" required>
                  <input
                    type="text" name="title" value={formData.title}
                    onChange={handleChange}
                    onFocus={() => setFocused('title')}
                    onBlur={() => setFocused('')}
                    placeholder="e.g. Mathematics — Grade 10"
                    style={inputStyle(focused === 'title')}
                    maxLength={80}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '11px', color: '#cbd5e1' }}>
                      {formData.title.length}/80
                    </span>
                  </div>
                </InputField>

                <InputField label="Description" required hint="Describe what students will learn in this course">
                  <textarea
                    name="description" value={formData.description}
                    onChange={handleChange}
                    onFocus={() => setFocused('description')}
                    onBlur={() => setFocused('')}
                    placeholder="This course covers..."
                    rows={4}
                    maxLength={500}
                    style={{
                      ...inputStyle(focused === 'description'),
                      resize: 'vertical', lineHeight: '1.6', minHeight: '100px'
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '11px', color: '#cbd5e1' }}>
                      {formData.description.length}/500
                    </span>
                  </div>
                </InputField>

              </div>
            </div>

            {/* ── Section: Course Details ── */}
            <div style={{
              background: 'white', borderRadius: '16px',
              border: '1px solid #e2e8f0', padding: '24px',
              marginBottom: '16px'
            }}>
              <SectionTitle icon="🎯" title="Course Details" />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

                {/* Subject */}
                <InputField label="Subject" required>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                    {SUBJECTS.map(s => (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, subject: s.value })}
                        style={{
                          padding: '10px 6px',
                          borderRadius: '10px',
                          border: formData.subject === s.value
                            ? '2px solid #2563eb'
                            : '1.5px solid #e2e8f0',
                          background: formData.subject === s.value ? '#eff6ff' : '#f8fafc',
                          cursor: 'pointer', transition: 'all 0.15s',
                          display: 'flex', flexDirection: 'column',
                          alignItems: 'center', gap: '4px',
                          fontFamily: 'inherit'
                        }}
                      >
                        <span style={{ fontSize: '20px' }}>{s.emoji}</span>
                        <span style={{
                          fontSize: '10px', fontWeight: '500',
                          color: formData.subject === s.value ? '#1d4ed8' : '#64748b',
                          textAlign: 'center', lineHeight: '1.2'
                        }}>
                          {s.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </InputField>

                {/* Grade + Duration row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <InputField label="Grade Level" required>
                    <select
                      name="grade" value={formData.grade}
                      onChange={handleChange}
                      onFocus={() => setFocused('grade')}
                      onBlur={() => setFocused('')}
                      style={{
                        ...inputStyle(focused === 'grade'),
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none'%3E%3Cpolyline points='6 9 12 15 18 9' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 14px center',
                        paddingRight: '36px',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="">Select grade</option>
                      {GRADES.map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </InputField>

                  <InputField label="Duration" hint="e.g. 8 weeks, 3 months">
                    <input
                      type="text" name="duration" value={formData.duration}
                      onChange={handleChange}
                      onFocus={() => setFocused('duration')}
                      onBlur={() => setFocused('')}
                      placeholder="e.g. 12 weeks"
                      style={inputStyle(focused === 'duration')}
                    />
                  </InputField>
                </div>

                {/* Language */}
                <InputField label="Language of Instruction">
                  <select
                    name="language" value={formData.language}
                    onChange={handleChange}
                    onFocus={() => setFocused('language')}
                    onBlur={() => setFocused('')}
                    style={{
                      ...inputStyle(focused === 'language'),
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none'%3E%3Cpolyline points='6 9 12 15 18 9' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 14px center',
                      paddingRight: '36px',
                      cursor: 'pointer'
                    }}
                  >
                    {['English', 'Hindi', 'Tamil', 'Telugu', 'Marathi', 'Bengali', 'Other'].map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </InputField>

              </div>
            </div>

            {/* ── Section: Thumbnail ── */}
            <div style={{
              background: 'white', borderRadius: '16px',
              border: '1px solid #e2e8f0', padding: '24px',
              marginBottom: '20px'
            }}>
              <SectionTitle icon="🖼️" title="Course Thumbnail" />

              {/* Drop zone */}
              <div
                onClick={() => fileInputRef.current.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                style={{
                  border: `2px dashed ${dragOver ? '#2563eb' : thumbnailPreview ? '#0d9488' : '#cbd5e1'}`,
                  borderRadius: '14px',
                  background: dragOver ? '#eff6ff' : thumbnailPreview ? '#f0fdfa' : '#fafafa',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  minHeight: '160px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {thumbnailPreview ? (
                  <>
                    <img
                      src={thumbnailPreview} alt="Thumbnail preview"
                      style={{
                        width: '100%', height: '160px',
                        objectFit: 'cover', borderRadius: '10px'
                      }}
                    />
                    <div style={{
                      position: 'absolute', bottom: '12px', right: '12px',
                      background: 'rgba(0,0,0,0.6)', color: 'white',
                      fontSize: '11px', fontWeight: '500',
                      padding: '4px 10px', borderRadius: '6px'
                    }}>
                      Click to change
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '12px',
                      background: '#eff6ff', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      marginBottom: '12px'
                    }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="#2563eb" strokeWidth="1.7"/>
                        <circle cx="8.5" cy="8.5" r="1.5" stroke="#2563eb" strokeWidth="1.5"/>
                        <polyline points="21 15 16 10 5 21" stroke="#2563eb" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                      Drop your thumbnail here
                    </p>
                    <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                      or click to browse — JPG, PNG, WebP · Max 5MB
                    </p>
                  </>
                )}
              </div>

              <input
                ref={fileInputRef} type="file"
                accept="image/*" onChange={handleFileInput}
                style={{ display: 'none' }}
              />

              {thumbnailPreview && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setThumbnail(null)
                    setThumbnailPreview(null)
                    fileInputRef.current.value = ''
                  }}
                  style={{
                    marginTop: '10px', fontSize: '12px', color: '#ef4444',
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: 'inherit', padding: '4px 0'
                  }}
                >
                  Remove thumbnail
                </button>
              )}
            </div>

            {/* ── Submit Buttons ── */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                style={{
                  flex: 1, padding: '13px',
                  background: 'white', color: '#374151',
                  border: '1.5px solid #e2e8f0', borderRadius: '12px',
                  fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                  fontFamily: 'inherit', transition: 'all 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#94a3b8'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
              >
                Cancel
              </button>

              <button
                type="submit" disabled={loading}
                style={{
                  flex: 2, padding: '13px',
                  background: loading ? '#93c5fd' : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  color: 'white', border: 'none', borderRadius: '12px',
                  fontSize: '14px', fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit', transition: 'all 0.2s',
                  boxShadow: loading ? 'none' : '0 4px 14px rgba(37,99,235,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}
              >
                {loading ? (
                  <>
                    <svg style={{ animation: 'spin 1s linear infinite' }} width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3"/>
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    Creating Course...
                  </>
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <polyline points="20 6 9 17 4 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Create Course
                  </>
                )}
              </button>
            </div>

          </form>

          {/* ── Right: Live Preview ── */}
          <div style={{ position: 'sticky', top: '88px' }}>
            <div style={{
              background: 'white', borderRadius: '16px',
              border: '1px solid #e2e8f0', overflow: 'hidden'
            }}>
              {/* Preview label */}
              <div style={{
                padding: '14px 18px', borderBottom: '1px solid #f1f5f9',
                display: 'flex', alignItems: 'center', gap: '8px'
              }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }}/>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Live Preview</span>
              </div>

              {/* Thumbnail preview */}
              <div style={{ position: 'relative' }}>
                {thumbnailPreview ? (
                  <img src={thumbnailPreview} alt="preview"
                    style={{ width: '100%', height: '150px', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <div style={{
                    height: '150px', background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '48px'
                  }}>
                    {selectedSubject?.emoji || '📚'}
                  </div>
                )}
                <div style={{
                  position: 'absolute', top: '10px', right: '10px',
                  background: '#22c55e', color: 'white',
                  fontSize: '10px', fontWeight: '700',
                  padding: '3px 9px', borderRadius: '999px'
                }}>
                  Active
                </div>
              </div>

              {/* Preview content */}
              <div style={{ padding: '16px' }}>
                <p style={{
                  fontSize: '14px', fontWeight: '700', color: '#0f172a',
                  marginBottom: '6px', lineHeight: '1.4',
                  minHeight: '20px'
                }}>
                  {formData.title || <span style={{ color: '#cbd5e1' }}>Course title...</span>}
                </p>
                <p style={{
                  fontSize: '12px', color: '#64748b', lineHeight: '1.5',
                  marginBottom: '12px', minHeight: '16px',
                  display: '-webkit-box', WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical', overflow: 'hidden'
                }}>
                  {formData.description || <span style={{ color: '#e2e8f0' }}>Description will appear here...</span>}
                </p>

                {/* Tags row */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                  {formData.subject && (
                    <span style={{
                      fontSize: '11px', padding: '3px 9px', borderRadius: '999px',
                      background: '#eff6ff', color: '#2563eb', fontWeight: '500'
                    }}>
                      {selectedSubject?.emoji} {selectedSubject?.label}
                    </span>
                  )}
                  {formData.grade && (
                    <span style={{
                      fontSize: '11px', padding: '3px 9px', borderRadius: '999px',
                      background: '#f0fdfa', color: '#0d9488', fontWeight: '500'
                    }}>
                      {formData.grade}
                    </span>
                  )}
                  {formData.duration && (
                    <span style={{
                      fontSize: '11px', padding: '3px 9px', borderRadius: '999px',
                      background: '#f5f3ff', color: '#7c3aed', fontWeight: '500'
                    }}>
                      {formData.duration}
                    </span>
                  )}
                </div>

                {/* Divider */}
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>0</p>
                      <p style={{ fontSize: '10px', color: '#94a3b8' }}>Students</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>0</p>
                      <p style={{ fontSize: '10px', color: '#94a3b8' }}>Lectures</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>—</p>
                      <p style={{ fontSize: '10px', color: '#94a3b8' }}>Language</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips card */}
            <div style={{
              marginTop: '14px', background: '#fffbeb',
              border: '1px solid #fde68a', borderRadius: '14px', padding: '16px'
            }}>
              <p style={{ fontSize: '12px', fontWeight: '600', color: '#92400e', marginBottom: '8px' }}>
                💡 Tips for a great course
              </p>
              {[
                'Use a clear, specific title',
                'Add a high-quality thumbnail',
                'Write a detailed description',
                'Specify the exact grade level',
              ].map(tip => (
                <div key={tip} style={{ display: 'flex', gap: '6px', marginBottom: '5px' }}>
                  <span style={{ color: '#d97706', fontSize: '12px', flexShrink: 0 }}>•</span>
                  <p style={{ fontSize: '12px', color: '#78350f' }}>{tip}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </MainLayout>
  )
}

// Section title helper
const SectionTitle = ({ icon, title }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
    <span style={{ fontSize: '16px' }}>{icon}</span>
    <h2 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{title}</h2>
  </div>
)

export default CreateCourse