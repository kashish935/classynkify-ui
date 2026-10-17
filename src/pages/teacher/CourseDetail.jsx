import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../../services/api'
import { toCourse, subjectInfo, formatDate } from '../../utils/courseUtils'

const TABS = ['Lectures', 'Students', 'Course Info']

const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }

const inputStyle = {
  width: '100%', boxSizing: 'border-box', padding: '12px 14px', fontSize: '14px',
  background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px',
  color: '#0f172a', outline: 'none', fontFamily: 'inherit',
}

const focusIn = (e) => { e.target.style.borderColor = '#2563eb' }
const focusOut = (e) => { e.target.style.borderColor = '#e2e8f0' }

const youtubeId = (url = '') => {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/)
  return m ? m[1] : null
}

const EMPTY_LECTURE = { title: '', videoUrl: '', duration: '', description: '' }

export default function CourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [tab, setTab] = useState('Lectures')
  const [lecture, setLecture] = useState(EMPTY_LECTURE)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [statusBusy, setStatusBusy] = useState(false)

  useEffect(() => {
    api
      .get(`/teacher/courses/${id}`)
      .then((res) => setCourse(toCourse(res.data.course)))
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Course not found.')
        navigate('/teacher/courses')
      })
  }, [id, navigate])

  if (!course) {
    return <p style={{ color: '#64748b', textAlign: 'center', padding: '60px 0' }}>Loading course…</p>
  }

  const info = subjectInfo(course.subject)
  const isActive = course.status === 'active'

  const handleToggleStatus = async () => {
    setStatusBusy(true)
    try {
      const res = await api.patch(`/teacher/courses/${id}/status`, { isPublished: !isActive })
      setCourse(toCourse(res.data.course))
      toast.success(!isActive ? 'Course is now active.' : 'Course moved to draft.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status.')
    } finally {
      setStatusBusy(false)
    }
  }

  const handleLectureChange = (e) => {
    setLecture((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (formError) setFormError('')
  }

  const handleAddLecture = async (e) => {
    e.preventDefault()
    if (!lecture.title.trim()) return setFormError('Please enter a lecture title.')
    if (!/^https?:\/\//i.test(lecture.videoUrl.trim())) {
      return setFormError('Please enter a valid video URL (starting with http).')
    }
    setSaving(true)
    try {
      const res = await api.post(`/teacher/courses/${id}/lessons`, lecture)
      setCourse(toCourse(res.data.course))
      setLecture(EMPTY_LECTURE)
      toast.success('Lecture added.')
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add lecture.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteLecture = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await api.delete(`/teacher/courses/${id}/lessons/${deleteTarget._id}`)
      setCourse(toCourse(res.data.course))
      toast.success('Lecture deleted.')
      setDeleteTarget(null)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete lecture.')
    } finally {
      setDeleting(false)
    }
  }

  const card = { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '24px' }

  return (
    <div>
      {/* Header */}
      <div style={{ ...card, display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <button
          type="button"
          aria-label="Back to courses"
          onClick={() => navigate('/teacher/courses')}
          style={{ width: '40px', height: '40px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#ffffff', color: '#334155', cursor: 'pointer', fontSize: '18px' }}
        >
          ←
        </button>

        <div
          style={{
            width: '64px', height: '64px', borderRadius: '16px', background: info.bg, overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', flexShrink: 0,
          }}
        >
          {course.thumbnail ? (
            <img src={course.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            info.emoji
          )}
        </div>

        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>{course.title}</h1>
            <span
              style={{
                padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600',
                background: isActive ? '#dcfce7' : '#e2e8f0', color: isActive ? '#15803d' : '#475569',
              }}
            >
              {isActive ? 'Active' : 'Draft'}
            </span>
          </div>
          <p style={{ margin: '6px 0 0', fontSize: '14px', color: '#64748b' }}>
            {course.students.length} students · {course.lessons.length} lectures
            {course.grade ? ` · ${course.grade}` : ''} · {course.language}
          </p>
        </div>

        <button
          type="button"
          disabled={statusBusy}
          onClick={handleToggleStatus}
          style={{
            padding: '11px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: '600', fontFamily: 'inherit',
            cursor: statusBusy ? 'not-allowed' : 'pointer', opacity: statusBusy ? 0.7 : 1,
            border: isActive ? '1.5px solid #e2e8f0' : 'none',
            background: isActive ? '#ffffff' : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            color: isActive ? '#334155' : '#ffffff',
          }}
        >
          {isActive ? 'Set as Draft' : 'Publish Course'}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            style={{
              padding: '12px 18px', border: 'none', background: 'transparent', cursor: 'pointer',
              fontSize: '14px', fontWeight: '600', fontFamily: 'inherit',
              color: tab === t ? '#2563eb' : '#64748b',
              borderBottom: tab === t ? '2px solid #2563eb' : '2px solid transparent',
              marginBottom: '-1px',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Lectures */}
      {tab === 'Lectures' && (
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <form onSubmit={handleAddLecture} style={{ ...card, flex: '1 1 320px', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '17px', color: '#0f172a' }}>Add Lecture</h3>

            {formError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '13px', padding: '10px 14px', borderRadius: '10px' }}>
                {formError}
              </div>
            )}

            <div>
              <label style={labelStyle}>Title *</label>
              <input name="title" value={lecture.title} onChange={handleLectureChange} placeholder="e.g. Introduction to Algebra" style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
            </div>
            <div>
              <label style={labelStyle}>Video URL *</label>
              <input name="videoUrl" value={lecture.videoUrl} onChange={handleLectureChange} placeholder="https://youtube.com/watch?v=..." style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
            </div>
            <div>
              <label style={labelStyle}>Duration (minutes)</label>
              <input name="duration" type="number" min="0" value={lecture.duration} onChange={handleLectureChange} placeholder="e.g. 45" style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
            </div>
            <div>
              <label style={labelStyle}>Description</label>
              <textarea name="description" value={lecture.description} onChange={handleLectureChange} rows={3} placeholder="What does this lecture cover?" style={{ ...inputStyle, resize: 'vertical' }} onFocus={focusIn} onBlur={focusOut} />
            </div>

            <button
              type="submit"
              disabled={saving}
              style={{
                padding: '12px', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '14px', fontWeight: '600',
                fontFamily: 'inherit', cursor: saving ? 'not-allowed' : 'pointer',
                background: saving ? '#93c5fd' : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              }}
            >
              {saving ? 'Adding…' : 'Add Lecture'}
            </button>
          </form>

          <div style={{ flex: '2 1 380px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {course.lessons.length === 0 ? (
              <div style={{ ...card, textAlign: 'center', padding: '50px 20px' }}>
                <div style={{ fontSize: '40px', marginBottom: '8px' }}>🎬</div>
                <h3 style={{ margin: '0 0 6px', color: '#0f172a' }}>No lectures yet</h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Add your first lecture using the form.</p>
              </div>
            ) : (
              course.lessons.map((l, i) => {
                const yt = youtubeId(l.videoUrl)
                return (
                  <div key={l._id} style={{ ...card, padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '34px', height: '34px', borderRadius: '10px', background: '#eff6ff', color: '#1d4ed8',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px', flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </div>

                    {yt && (
                      <img
                        src={`https://img.youtube.com/vi/${yt}/mqdefault.jpg`}
                        alt=""
                        style={{ width: '120px', height: '68px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0 }}
                      />
                    )}

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: '600', fontSize: '15px', color: '#0f172a' }}>{l.title}</div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>
                        {l.duration ? `${l.duration} min · ` : ''}Added {formatDate(l.createdAt || course.createdAt)}
                      </div>
                      {l.description && (
                        <div style={{ fontSize: '13px', color: '#64748b', marginTop: '6px', lineHeight: '1.5' }}>{l.description}</div>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                      <a
                        href={l.videoUrl} target="_blank" rel="noreferrer"
                        style={{ padding: '7px 14px', borderRadius: '10px', border: '1.5px solid #2563eb', color: '#2563eb', fontSize: '13px', fontWeight: '600', textDecoration: 'none', textAlign: 'center' }}
                      >
                        Watch
                      </a>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(l)}
                        style={{ padding: '7px 14px', borderRadius: '10px', border: '1.5px solid #fecaca', background: '#ffffff', color: '#dc2626', fontSize: '13px', fontWeight: '600', fontFamily: 'inherit', cursor: 'pointer' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}

      {/* Students */}
      {tab === 'Students' && (
        <div style={card}>
          <h3 style={{ margin: '0 0 16px', fontSize: '17px', color: '#0f172a' }}>
            Enrolled students ({course.students.length})
          </h3>
          {course.students.length === 0 ? (
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
              No students have enrolled in this course yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {course.students.map((s, i) => (
                <div
                  key={s._id || i}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                >
                  <div
                    style={{
                      width: '38px', height: '38px', borderRadius: '50%', background: '#ccfbf1', color: '#0f766e',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700',
                    }}
                  >
                    {(s.name || 'S')[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '14px', color: '#0f172a' }}>{s.name || `Student ${i + 1}`}</div>
                    {s.email && <div style={{ fontSize: '12px', color: '#64748b' }}>{s.email}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Course info */}
      {tab === 'Course Info' && (
        <div style={card}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '22px' }}>
            {[
              ['Subject', info.label],
              ['Grade', course.grade || '—'],
              ['Language', course.language],
              ['Status', isActive ? 'Active' : 'Draft'],
              ['Lectures', String(course.lessons.length)],
              ['Created', formatDate(course.createdAt)],
            ].map(([k, v]) => (
              <div key={k} style={{ padding: '14px 16px', borderRadius: '14px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>{k}</div>
                <div style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a' }}>{v}</div>
              </div>
            ))}
          </div>
          <h4 style={{ margin: '0 0 8px', fontSize: '15px', color: '#0f172a' }}>Description</h4>
          <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.7', color: '#64748b' }}>{course.description}</p>
        </div>
      )}

      {/* Delete lecture modal */}
      {deleteTarget && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
          onClick={() => !deleting && setDeleteTarget(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: '100%', maxWidth: '400px', background: '#ffffff', borderRadius: '20px', padding: '28px', boxShadow: '0 20px 50px rgba(15, 23, 42, 0.3)' }}
          >
            <h3 style={{ margin: '0 0 8px', fontSize: '19px', color: '#0f172a' }}>Delete lecture?</h3>
            <p style={{ margin: '0 0 22px', fontSize: '14px', lineHeight: '1.6', color: '#64748b' }}>
              “{deleteTarget.title}” will be removed from this course.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button" disabled={deleting} onClick={() => setDeleteTarget(null)}
                style={{ padding: '10px 18px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#ffffff', color: '#334155', fontWeight: '600', fontFamily: 'inherit', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button" disabled={deleting} onClick={handleDeleteLecture}
                style={{ padding: '10px 18px', borderRadius: '10px', border: 'none', background: '#dc2626', color: '#fff', fontWeight: '600', fontFamily: 'inherit', cursor: deleting ? 'not-allowed' : 'pointer', opacity: deleting ? 0.7 : 1 }}
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}