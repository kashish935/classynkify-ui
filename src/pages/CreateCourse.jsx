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

const GRADES = ['Grade 6','Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12','College']

const CreateCourse = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({
    title: '', description: '', subject: '', grade: '', duration: '', language: 'English',
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
    if (!file.type.startsWith('image/')) { setError('Please upload an image file.'); return }
    if (file.size > 5 * 1024 * 1024) { setError('Image must be under 5MB.'); return }
    setThumbnail(file)
    setThumbnailPreview(URL.createObjectURL(file))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) { setError('Course title is required.'); return }
    if (!formData.subject) { setError('Please select a subject.'); return }
    if (!formData.grade) { setError('Please select a grade.'); return }
    if (!formData.description.trim()) { setError('Please add a description.'); return }
    setLoading(true)
    setError('')
    try {
      const payload = new FormData()
      Object.entries(formData).forEach(([k, v]) => payload.append(k, v))
      if (thumbnail) payload.append('thumbnail', thumbnail)
      await api.post('/courses', payload, { headers: { 'Content-Type': 'multipart/form-data' } })
      navigate('/my-courses')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course.')
    } finally {
      setLoading(false)
    }
  }

  const iStyle = (field) => ({
    width: '100%', padding: '11px 14px',
    background: focused === field ? '#fff' : '#f8fafc',
    border: `1.5px solid ${focused === field ? '#2563eb' : '#e2e8f0'}`,
    borderRadius: '10px', fontSize: '14px', color: '#0f172a',
    outline: 'none', transition: 'all 0.2s',
    fontFamily: 'Inter, system-ui, sans-serif', boxSizing: 'border-box',
  })

  const selectedSubject = SUBJECTS.find(s => s.value === formData.subject)

  return (
    <MainLayout>
      <div style={{ maxWidth: '900px', margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
          <button onClick={() => navigate('/my-courses')} style={{
            width: '36px', height: '36px', borderRadius: '10px', border: '1.5px solid #e2e8f0',
            background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#64748b', flexShrink: 0
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <polyline points="15,18 9,12 15,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>Create New Course</h1>
            <p style={{ fontSize: '13px', color: '#64748b' }}>Fill in the details to publish your course</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 290px', gap: '20px', alignItems: 'start' }}>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {error && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px', background: '#fef2f2',
                border: '1px solid #fecaca', color: '#dc2626', fontSize: '13px',
                padding: '12px 16px', borderRadius: '12px'
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#dc2626" strokeWidth="2"/>
                  <path d="M12 8v4M12 16h.01" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                {error}
              </div>
            )}

            {/* Basic Info */}
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
                <span style={{ fontSize: '16px' }}>📝</span>
                <h2 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Basic Information</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Course Title <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange}
                    onFocus={() => setFocused('title')} onBlur={() => setFocused('')}
                    placeholder="e.g. Mathematics — Grade 10" maxLength={80} style={iStyle('title')}
                  />
                  <div style={{ textAlign: 'right', marginTop: '3px' }}>
                    <span style={{ fontSize: '11px', color: '#cbd5e1' }}>{formData.title.length}/80</span>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Description <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <textarea name="description" value={formData.description} onChange={handleChange}
                    onFocus={() => setFocused('description')} onBlur={() => setFocused('')}
                    placeholder="What will students learn in this course?" rows={4} maxLength={500}
                    style={{ ...iStyle('description'), resize: 'vertical', lineHeight: '1.6' }}
                  />
                  <div style={{ textAlign: 'right', marginTop: '3px' }}>
                    <span style={{ fontSize: '11px', color: '#cbd5e1' }}>{formData.description.length}/500</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Details */}
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
                <span style={{ fontSize: '16px' }}>🎯</span>
                <h2 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Course Details</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Subject grid */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Subject <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                    {SUBJECTS.map(s => (
                      <button key={s.value} type="button"
                        onClick={() => setFormData({ ...formData, subject: s.value })}
                        style={{
                          padding: '10px 6px', borderRadius: '10px', cursor: 'pointer',
                          border: formData.subject === s.value ? '2px solid #2563eb' : '1.5px solid #e2e8f0',
                          background: formData.subject === s.value ? '#eff6ff' : '#f8fafc',
                          display: 'flex', flexDirection: 'column', alignItems: 'center',
                          gap: '4px', fontFamily: 'inherit', transition: 'all 0.15s'
                        }}>
                        <span style={{ fontSize: '20px' }}>{s.emoji}</span>
                        <span style={{
                          fontSize: '10px', fontWeight: '500', textAlign: 'center',
                          color: formData.subject === s.value ? '#1d4ed8' : '#64748b'
                        }}>{s.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grade + Duration */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Grade Level <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <select name="grade" value={formData.grade} onChange={handleChange}
                      onFocus={() => setFocused('grade')} onBlur={() => setFocused('')}
                      style={{ ...iStyle('grade'), appearance: 'none', cursor: 'pointer' }}>
                      <option value="">Select grade</option>
                      {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Duration
                    </label>
                    <input type="text" name="duration" value={formData.duration} onChange={handleChange}
                      onFocus={() => setFocused('duration')} onBlur={() => setFocused('')}
                      placeholder="e.g. 12 weeks" style={iStyle('duration')}
                    />
                  </div>
                </div>

                {/* Language */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Language
                  </label>
                  <select name="language" value={formData.language} onChange={handleChange}
                    onFocus={() => setFocused('language')} onBlur={() => setFocused('')}
                    style={{ ...iStyle('language'), appearance: 'none', cursor: 'pointer' }}>
                    {['English','Hindi','Tamil','Telugu','Marathi','Bengali','Other'].map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Thumbnail */}
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ fontSize: '16px' }}>🖼️</span>
                <h2 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Course Thumbnail</h2>
              </div>
              <div
                onClick={() => fileInputRef.current.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); handleThumbnail(e.dataTransfer.files[0]) }}
                style={{
                  border: `2px dashed ${dragOver ? '#2563eb' : thumbnailPreview ? '#0d9488' : '#cbd5e1'}`,
                  borderRadius: '14px', background: dragOver ? '#eff6ff' : thumbnailPreview ? '#f0fdfa' : '#fafafa',
                  padding: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s',
                  minHeight: '140px', position: 'relative', overflow: 'hidden'
                }}>
                {thumbnailPreview ? (
                  <>
                    <img src={thumbnailPreview} alt="preview"
                      style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '10px' }}/>
                    <div style={{
                      position: 'absolute', bottom: '12px', right: '12px',
                      background: 'rgba(0,0,0,0.6)', color: 'white',
                      fontSize: '11px', padding: '4px 10px', borderRadius: '6px'
                    }}>Click to change</div>
                  </>
                ) : (
                  <>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '12px', background: '#eff6ff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px'
                    }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="#2563eb" strokeWidth="1.7"/>
                        <circle cx="8.5" cy="8.5" r="1.5" stroke="#2563eb" strokeWidth="1.5"/>
                        <polyline points="21,15 16,10 5,21" stroke="#2563eb" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p style={{ fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                      Drop your thumbnail here
                    </p>
                    <p style={{ fontSize: '12px', color: '#94a3b8' }}>JPG, PNG, WebP · Max 5MB</p>
                  </>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*"
                onChange={e => handleThumbnail(e.target.files[0])} style={{ display: 'none' }}/>
              {thumbnailPreview && (
                <button type="button" onClick={() => { setThumbnail(null); setThumbnailPreview(null) }}
                  style={{ marginTop: '8px', fontSize: '12px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                  Remove thumbnail
                </button>
              )}
            </div>

            {/* Submit */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" onClick={() => navigate('/my-courses')} style={{
                flex: 1, padding: '13px', background: 'white', color: '#374151',
                border: '1.5px solid #e2e8f0', borderRadius: '12px',
                fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit'
              }}>Cancel</button>
              <button type="submit" disabled={loading} style={{
                flex: 2, padding: '13px',
                background: loading ? '#93c5fd' : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: 'white', border: 'none', borderRadius: '12px',
                fontSize: '14px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', boxShadow: loading ? 'none' : '0 4px 14px rgba(37,99,235,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}>
                {loading ? (
                  <>
                    <svg style={{ animation: 'spin 1s linear infinite' }} width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3"/>
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    Creating...
                  </>
                ) : 'Create Course'}
              </button>
            </div>
          </form>

          {/* Live Preview */}
          <div style={{ position: 'sticky', top: '88px' }}>
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }}/>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Live Preview</span>
              </div>
              <div style={{ position: 'relative' }}>
                {thumbnailPreview
                  ? <img src={thumbnailPreview} alt="preview" style={{ width: '100%', height: '130px', objectFit: 'cover', display: 'block' }}/>
                  : <div style={{
                      height: '130px', background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '44px'
                    }}>{selectedSubject?.emoji || '📚'}</div>
                }
              </div>
              <div style={{ padding: '14px' }}>
                <p style={{ fontSize: '14px', fontWeight: '700', color: formData.title ? '#0f172a' : '#cbd5e1', marginBottom: '6px' }}>
                  {formData.title || 'Course title...'}
                </p>
                <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5', marginBottom: '10px',
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                }}>
                  {formData.description || 'Description will appear here...'}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {formData.subject && (
                    <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '999px', background: '#eff6ff', color: '#2563eb' }}>
                      {selectedSubject?.emoji} {selectedSubject?.label}
                    </span>
                  )}
                  {formData.grade && (
                    <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '999px', background: '#f0fdfa', color: '#0d9488' }}>
                      {formData.grade}
                    </span>
                  )}
                  {formData.duration && (
                    <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '999px', background: '#f5f3ff', color: '#7c3aed' }}>
                      {formData.duration}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Tips */}
            <div style={{ marginTop: '14px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '14px', padding: '16px' }}>
              <p style={{ fontSize: '12px', fontWeight: '600', color: '#92400e', marginBottom: '8px' }}>💡 Tips for a great course</p>
              {['Use a clear, specific title', 'Add a high-quality thumbnail', 'Write a detailed description', 'Specify the exact grade level'].map(tip => (
                <div key={tip} style={{ display: 'flex', gap: '6px', marginBottom: '5px' }}>
                  <span style={{ color: '#d97706', fontSize: '12px' }}>•</span>
                  <p style={{ fontSize: '12px', color: '#78350f' }}>{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </MainLayout>
  )
}

export default CreateCourse