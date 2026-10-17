import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../../services/api'
import { SUBJECTS, GRADES, LANGUAGES, subjectInfo } from '../../utils/courseUtils'

const labelStyle = {
  display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px',
}

const inputStyle = {
  width: '100%', boxSizing: 'border-box', padding: '13px 16px', fontSize: '15px',
  background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px',
  color: '#0f172a', outline: 'none', fontFamily: 'inherit',
}

const focusIn = (e) => { e.target.style.borderColor = '#2563eb' }
const focusOut = (e) => { e.target.style.borderColor = '#e2e8f0' }

const counter = { fontSize: '12px', color: '#94a3b8', textAlign: 'right', marginTop: '6px' }

export default function CreateCourse() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [form, setForm] = useState({
    title: '', description: '', subject: '', grade: '', language: 'English',
  })
  const [thumbnail, setThumbnail] = useState(null)
  const [preview, setPreview] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError('')
  }

  const handleThumbnail = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be 5 MB or smaller.')
      return
    }
    setError('')
    setThumbnail(file)
    setPreview(URL.createObjectURL(file))
  }

  const removeThumbnail = () => {
    setThumbnail(null)
    setPreview('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return setError('Please enter a course title.')
    if (!form.subject) return setError('Please choose a subject.')
    if (!form.grade) return setError('Please choose a grade.')
    if (!form.description.trim()) return setError('Please add a course description.')

    setLoading(true)
    setError('')
    try {
      const payload = new FormData()
      payload.append('title', form.title.trim())
      payload.append('description', form.description.trim())
      payload.append('subject', form.subject)
      payload.append('grade', form.grade)
      payload.append('language', form.language)
      if (thumbnail) payload.append('thumbnail', thumbnail)

      await api.post('/teacher/courses', payload)
      toast.success('Course created successfully!')
      navigate('/teacher/courses')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course.')
    } finally {
      setLoading(false)
    }
  }

  const info = subjectInfo(form.subject || 'other')

  return (
    <div style={{ maxWidth: '1000px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
        <button
          type="button"
          aria-label="Back to courses"
          onClick={() => navigate('/teacher/courses')}
          style={{
            width: '40px', height: '40px', borderRadius: '12px', border: '1px solid #e2e8f0',
            background: '#ffffff', color: '#334155', cursor: 'pointer', fontSize: '18px',
          }}
        >
          ←
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '700', color: '#0f172a' }}>Create New Course</h1>
          <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#64748b' }}>
            Fill in the details below. You can add lectures after creating the course.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            flex: '2 1 480px', minWidth: 0, background: '#ffffff', border: '1px solid #e2e8f0',
            borderRadius: '20px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '22px',
          }}
        >
          {error && (
            <div
              style={{
                background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626',
                fontSize: '13px', padding: '12px 16px', borderRadius: '12px',
              }}
            >
              {error}
            </div>
          )}

          <div>
            <label style={labelStyle}>Course title *</label>
            <input
              name="title" value={form.title} onChange={handleChange} maxLength={80}
              placeholder="e.g. Mathematics — Grade 10" style={inputStyle}
              onFocus={focusIn} onBlur={focusOut}
            />
            <div style={counter}>{form.title.length}/80</div>
          </div>

          <div>
            <label style={labelStyle}>Subject *</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
              {SUBJECTS.map((s) => {
                const selected = form.subject === s.value
                return (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => { setForm((p) => ({ ...p, subject: s.value })); if (error) setError('') }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px',
                      borderRadius: '12px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px',
                      fontWeight: '600', textAlign: 'left',
                      border: selected ? '2px solid #2563eb' : '1.5px solid #e2e8f0',
                      background: selected ? '#eff6ff' : '#f8fafc',
                      color: selected ? '#1d4ed8' : '#334155',
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>{s.emoji}</span>
                    {s.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 200px' }}>
              <label style={labelStyle}>Grade *</label>
              <select
                name="grade" value={form.grade} onChange={handleChange} style={inputStyle}
                onFocus={focusIn} onBlur={focusOut}
              >
                <option value="">Select grade</option>
                {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div style={{ flex: '1 1 200px' }}>
              <label style={labelStyle}>Language</label>
              <select
                name="language" value={form.language} onChange={handleChange} style={inputStyle}
                onFocus={focusIn} onBlur={focusOut}
              >
                {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Description *</label>
            <textarea
              name="description" value={form.description} onChange={handleChange} maxLength={500} rows={5}
              placeholder="What will students learn in this course?"
              style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
              onFocus={focusIn} onBlur={focusOut}
            />
            <div style={counter}>{form.description.length}/500</div>
          </div>

          <div>
            <label style={labelStyle}>Thumbnail (optional)</label>
            {preview ? (
              <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                <img src={preview} alt="Thumbnail preview" style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', display: 'block' }} />
                <button
                  type="button"
                  onClick={removeThumbnail}
                  style={{
                    position: 'absolute', top: '10px', right: '10px', padding: '6px 12px', border: 'none',
                    borderRadius: '8px', background: '#ffffff', color: '#dc2626', fontWeight: '600',
                    fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); handleThumbnail(e.dataTransfer.files?.[0]) }}
                style={{
                  padding: '28px', textAlign: 'center', cursor: 'pointer', borderRadius: '14px',
                  border: `2px dashed ${dragOver ? '#2563eb' : '#cbd5e1'}`,
                  background: dragOver ? '#eff6ff' : '#f8fafc', color: '#64748b', fontSize: '14px',
                }}
              >
                <div style={{ fontSize: '28px', marginBottom: '6px' }}>🖼️</div>
                Drag an image here or <span style={{ color: '#2563eb', fontWeight: '600' }}>browse</span>
                <div style={{ fontSize: '12px', marginTop: '4px' }}>PNG or JPG, up to 5 MB</div>
              </div>
            )}
            <input
              ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={(e) => handleThumbnail(e.target.files?.[0])}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => navigate('/teacher/courses')}
              style={{
                padding: '13px 24px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#ffffff',
                color: '#334155', fontSize: '15px', fontWeight: '600', fontFamily: 'inherit', cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '13px 28px', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '15px',
                fontWeight: '600', fontFamily: 'inherit', cursor: loading ? 'not-allowed' : 'pointer',
                background: loading ? '#93c5fd' : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                boxShadow: '0 6px 18px rgba(37, 99, 235, 0.3)',
              }}
            >
              {loading ? 'Creating…' : 'Create Course'}
            </button>
          </div>
        </form>

        {/* Preview + tips */}
        <div style={{ flex: '1 1 280px', maxWidth: '360px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', overflow: 'hidden' }}>
            <div
              style={{
                height: '120px', background: info.bg, display: 'flex', alignItems: 'center',
                justifyContent: 'center', overflow: 'hidden',
              }}
            >
              {preview ? (
                <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '48px' }}>{info.emoji}</span>
              )}
            </div>
            <div style={{ padding: '16px 18px 18px' }}>
              <span
                style={{
                  display: 'inline-block', padding: '3px 10px', borderRadius: '8px',
                  background: info.chipBg, color: info.fg, fontSize: '12px', fontWeight: '600',
                }}
              >
                {form.subject ? info.label : 'Subject'}{form.grade ? ` · ${form.grade}` : ''}
              </span>
              <h3 style={{ margin: '10px 0 6px', fontSize: '16px', color: '#0f172a' }}>
                {form.title.trim() || 'Course title'}
              </h3>
              <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.5', color: '#64748b' }}>
                {form.description.trim() || 'Your course description will appear here.'}
              </p>
            </div>
          </div>

          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '16px', padding: '18px', fontSize: '13px', lineHeight: '1.7', color: '#475569' }}>
            <div style={{ fontWeight: '700', color: '#1d4ed8', marginBottom: '6px' }}>Tips</div>
            • Use a clear title that includes the grade.<br />
            • Describe what students will learn.<br />
            • New courses start as Draft. Set them to Active when ready.
          </div>
        </div>
      </div>
    </div>
  )
}