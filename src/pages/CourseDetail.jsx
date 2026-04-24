import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'

const mockCourse = {
  _id: '1', title: 'Mathematics — Grade 10', subject: 'mathematics',
  grade: 'Grade 10', language: 'English', duration: '12 weeks',
  description: 'A comprehensive mathematics course covering algebra, geometry, and trigonometry for Grade 10 students.',
  status: 'active', students: Array(38).fill(null), thumbnail: '',
  lectures: [
    { _id: 'l1', title: 'Introduction to Algebra', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '45 min', description: 'Basics of algebraic expressions', createdAt: '2026-04-01' },
    { _id: 'l2', title: 'Linear Equations', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '52 min', description: 'Solving one and two variable equations', createdAt: '2026-04-05' },
    { _id: 'l3', title: 'Quadratic Equations', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '60 min', description: 'Factoring and the quadratic formula', createdAt: '2026-04-10' },
  ],
}

const EMOJIS = {
  mathematics: '📐', physics: '⚛️', chemistry: '🧪', biology: '🧬',
  english: '📖', history: '🏛️', geography: '🌍', computer_science: '💻', economics: '📊', other: '📚',
}

const getYouTubeId = (url) => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  return match ? match[1] : null
}

const getYTThumb = (url) => {
  const id = getYouTubeId(url)
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null
}

// ── Delete Modal ──
const DeleteModal = ({ title, onConfirm, onCancel }) => (
  <div style={{
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px'
  }}>
    <div style={{
      background: 'white', borderRadius: '20px', padding: '28px',
      maxWidth: '400px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
    }}>
      <div style={{
        width: '48px', height: '48px', borderRadius: '12px', background: '#fef2f2',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px'
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <polyline points="3 6 5 6 21 6" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
          <path d="M10 11v6M14 11v6" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="#ef4444" strokeWidth="2"/>
        </svg>
      </div>
      <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>Delete lecture?</h3>
      <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '6px', lineHeight: '1.5' }}>
        <strong>"{title}"</strong> will be permanently removed.
      </p>
      <p style={{ fontSize: '12px', color: '#ef4444', marginBottom: '24px' }}>This cannot be undone.</p>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={onCancel} style={{
          flex: 1, padding: '11px', background: 'white', border: '1.5px solid #e2e8f0',
          borderRadius: '10px', fontSize: '13px', fontWeight: '600', color: '#374151',
          cursor: 'pointer', fontFamily: 'inherit'
        }}>Cancel</button>
        <button onClick={onConfirm} style={{
          flex: 1, padding: '11px', background: '#ef4444', border: 'none',
          borderRadius: '10px', fontSize: '13px', fontWeight: '600', color: 'white',
          cursor: 'pointer', fontFamily: 'inherit'
        }}>Delete</button>
      </div>
    </div>
  </div>
)

// ── Lecture Row ──
const LectureRow = ({ lecture, index, isLast, onDelete }) => {
  const [hovered, setHovered] = useState(false)
  const thumb = getYTThumb(lecture.videoUrl)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 20px',
        borderBottom: isLast ? 'none' : '1px solid #f8fafc',
        background: hovered ? '#fafafa' : 'white', transition: 'background 0.15s'
      }}
    >
      {/* Number */}
      <div style={{
        width: '28px', height: '28px', borderRadius: '8px', background: '#f1f5f9',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '12px', fontWeight: '700', color: '#64748b', flexShrink: 0
      }}>{index + 1}</div>

      {/* Thumbnail */}
      <div style={{
        width: '72px', height: '42px', borderRadius: '8px', background: '#f1f5f9',
        flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {thumb
          ? <img src={thumb} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
          : <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <polygon points="23 7 16 12 23 17 23 7" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round"/>
              <rect x="1" y="5" width="15" height="14" rx="2" stroke="#cbd5e1" strokeWidth="1.5"/>
            </svg>
        }
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '3px',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
        }}>{lecture.title}</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          {lecture.duration && (
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>⏱ {lecture.duration}</span>
          )}
          {lecture.description && (
            <span style={{
              fontSize: '11px', color: '#94a3b8', whiteSpace: 'nowrap',
              overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px'
            }}>{lecture.description}</span>
          )}
        </div>
      </div>

      {/* Date */}
      <span style={{ fontSize: '11px', color: '#cbd5e1', flexShrink: 0 }}>{lecture.createdAt}</span>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
        <a href={lecture.videoUrl} target="_blank" rel="noreferrer"
          style={{
            width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e2e8f0',
            background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#64748b', textDecoration: 'none', transition: 'all 0.15s'
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.color = '#2563eb'; e.currentTarget.style.background = '#eff6ff' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'white' }}
          title="Open video"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <polyline points="15,3 21,3 21,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </a>
        <button onClick={onDelete} style={{
          width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e2e8f0',
          background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#64748b', cursor: 'pointer', transition: 'all 0.15s'
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#fecaca'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = '#fef2f2' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'white' }}
          title="Delete"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

// ── Main Component ──
const CourseDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(mockCourse)
  const [activeTab, setActiveTab] = useState('lectures')
  const [showAddForm, setShowAddForm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [saving, setSaving] = useState(false)
  const [lectureError, setLectureError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [focused, setFocused] = useState('')
  const [newLecture, setNewLecture] = useState({ title: '', videoUrl: '', duration: '', description: '' })

  const showSuccess = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000) }

  const handleChange = (e) => {
    setNewLecture({ ...newLecture, [e.target.name]: e.target.value })
    if (lectureError) setLectureError('')
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newLecture.title.trim()) { setLectureError('Title is required.'); return }
    if (!newLecture.videoUrl.trim()) { setLectureError('Video URL is required.'); return }
    if (!newLecture.videoUrl.startsWith('http')) { setLectureError('Enter a valid URL.'); return }
    setSaving(true)
    await new Promise(r => setTimeout(r, 500))
    setCourse(prev => ({
      ...prev,
      lectures: [...prev.lectures, { _id: `l${Date.now()}`, ...newLecture, createdAt: new Date().toISOString().split('T')[0] }]
    }))
    setNewLecture({ title: '', videoUrl: '', duration: '', description: '' })
    setShowAddForm(false)
    setSaving(false)
    showSuccess('Lecture added successfully!')
  }

  const handleDelete = () => {
    setCourse(prev => ({ ...prev, lectures: prev.lectures.filter(l => l._id !== deleteTarget._id) }))
    setDeleteTarget(null)
    showSuccess('Lecture deleted.')
  }

  const iStyle = (field) => ({
    width: '100%', padding: '11px 14px',
    background: focused === field ? '#fff' : '#f8fafc',
    border: `1.5px solid ${focused === field ? '#2563eb' : '#e2e8f0'}`,
    borderRadius: '10px', fontSize: '13px', color: '#0f172a',
    outline: 'none', transition: 'all 0.2s',
    fontFamily: 'Inter, system-ui, sans-serif', boxSizing: 'border-box'
  })

  const tabs = [
    { key: 'lectures', label: 'Lectures', count: course.lectures.length },
    { key: 'students', label: 'Students', count: course.students.length },
    { key: 'details', label: 'Course Info', count: null },
  ]

  return (
    <MainLayout>
      <div style={{ maxWidth: '1000px', margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif' }}>

        {/* Toast */}
        {successMsg && (
          <div style={{
            position: 'fixed', top: '80px', right: '24px', zIndex: 90,
            background: '#0d9488', color: 'white', fontSize: '13px', fontWeight: '500',
            padding: '12px 20px', borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(13,148,136,0.3)',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <polyline points="20 6 9 17 4 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {successMsg}
          </div>
        )}

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
          <button onClick={() => navigate('/my-courses')} style={{
            width: '38px', height: '38px', borderRadius: '10px', border: '1.5px solid #e2e8f0',
            background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#64748b', flexShrink: 0, transition: 'all 0.15s'
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.color = '#2563eb' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <polyline points="15,18 9,12 15,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div style={{
            width: '52px', height: '52px', borderRadius: '14px', flexShrink: 0,
            background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px'
          }}>
            {course.thumbnail
              ? <img src={course.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '14px' }}/>
              : EMOJIS[course.subject] || '📚'
            }
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>{course.title}</h1>
              <span style={{
                fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '999px',
                background: course.status === 'active' ? '#f0fdf4' : '#f8fafc',
                color: course.status === 'active' ? '#16a34a' : '#94a3b8',
              }}>
                {course.status === 'active' ? 'Active' : 'Draft'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {[
                `🎓 ${course.students.length} Students`,
                `🎬 ${course.lectures.length} Lectures`,
                `📅 ${course.grade}`,
                `🌐 ${course.language}`,
              ].map(t => (
                <span key={t} style={{ fontSize: '12px', color: '#64748b' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: '4px', background: 'white',
          border: '1px solid #e2e8f0', borderRadius: '14px',
          padding: '5px', marginBottom: '20px'
        }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              flex: 1, padding: '9px 16px', borderRadius: '10px', border: 'none',
              cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', fontWeight: '600',
              background: activeTab === tab.key ? '#2563eb' : 'transparent',
              color: activeTab === tab.key ? 'white' : '#64748b', transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
            }}>
              {tab.label}
              {tab.count !== null && (
                <span style={{
                  fontSize: '11px', fontWeight: '700', padding: '1px 7px', borderRadius: '999px',
                  background: activeTab === tab.key ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                  color: activeTab === tab.key ? 'white' : '#64748b'
                }}>{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── Lectures Tab ── */}
        {activeTab === 'lectures' && (
          <div>
            {!showAddForm && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                <button onClick={() => setShowAddForm(true)} style={{
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px',
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white',
                  border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '600',
                  cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(37,99,235,0.25)'
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <line x1="12" y1="5" x2="12" y2="19" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                    <line x1="5" y1="12" x2="19" y2="12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                  Add Lecture
                </button>
              </div>
            )}

            {/* Add Form */}
            {showAddForm && (
              <div style={{
                background: 'white', borderRadius: '16px', border: '2px solid #2563eb',
                padding: '24px', marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '10px', background: '#eff6ff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <polygon points="23 7 16 12 23 17 23 7" stroke="#2563eb" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                        <rect x="1" y="5" width="15" height="14" rx="2" stroke="#2563eb" strokeWidth="1.7"/>
                      </svg>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>New Lecture</h3>
                      <p style={{ fontSize: '11px', color: '#94a3b8' }}>Lecture {course.lectures.length + 1}</p>
                    </div>
                  </div>
                  <button onClick={() => { setShowAddForm(false); setLectureError(''); setNewLecture({ title: '', videoUrl: '', duration: '', description: '' }) }}
                    style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                    ✕
                  </button>
                </div>

                {lectureError && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px', background: '#fef2f2',
                    border: '1px solid #fecaca', color: '#dc2626', fontSize: '12px',
                    padding: '10px 14px', borderRadius: '10px', marginBottom: '16px'
                  }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="#dc2626" strokeWidth="2"/>
                      <path d="M12 8v4M12 16h.01" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    {lectureError}
                  </div>
                )}

                <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>
                        Lecture Title <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input type="text" name="title" value={newLecture.title} onChange={handleChange}
                        onFocus={() => setFocused('title')} onBlur={() => setFocused('')}
                        placeholder="e.g. Introduction to Algebra" style={iStyle('title')}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>Duration</label>
                      <input type="text" name="duration" value={newLecture.duration} onChange={handleChange}
                        onFocus={() => setFocused('duration')} onBlur={() => setFocused('')}
                        placeholder="e.g. 45 min" style={iStyle('duration')}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>
                      Video URL <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                          <polygon points="23 7 16 12 23 17 23 7" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <rect x="1" y="5" width="15" height="14" rx="2" stroke="#94a3b8" strokeWidth="1.5"/>
                        </svg>
                      </div>
                      <input type="url" name="videoUrl" value={newLecture.videoUrl} onChange={handleChange}
                        onFocus={() => setFocused('videoUrl')} onBlur={() => setFocused('')}
                        placeholder="https://youtube.com/watch?v=..."
                        style={{ ...iStyle('videoUrl'), paddingLeft: '38px' }}
                      />
                    </div>
                    {newLecture.videoUrl && getYouTubeId(newLecture.videoUrl) && (
                      <div style={{
                        marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px',
                        background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '8px 12px'
                      }}>
                        <img src={getYTThumb(newLecture.videoUrl)} alt="preview"
                          style={{ width: '60px', height: '34px', borderRadius: '4px', objectFit: 'cover' }}/>
                        <p style={{ fontSize: '12px', color: '#16a34a', fontWeight: '500' }}>✓ YouTube video detected</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>
                      Description <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '400' }}>(optional)</span>
                    </label>
                    <textarea name="description" value={newLecture.description} onChange={handleChange}
                      onFocus={() => setFocused('description')} onBlur={() => setFocused('')}
                      placeholder="What will students learn?" rows={2}
                      style={{ ...iStyle('description'), resize: 'vertical', lineHeight: '1.6' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="button" onClick={() => { setShowAddForm(false); setLectureError('') }} style={{
                      flex: 1, padding: '11px', background: 'white', border: '1.5px solid #e2e8f0',
                      borderRadius: '10px', fontSize: '13px', fontWeight: '600', color: '#374151',
                      cursor: 'pointer', fontFamily: 'inherit'
                    }}>Cancel</button>
                    <button type="submit" disabled={saving} style={{
                      flex: 2, padding: '11px',
                      background: saving ? '#93c5fd' : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                      color: 'white', border: 'none', borderRadius: '10px',
                      fontSize: '13px', fontWeight: '600', cursor: saving ? 'not-allowed' : 'pointer',
                      fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                    }}>
                      {saving ? (
                        <>
                          <svg style={{ animation: 'spin 1s linear infinite' }} width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3"/>
                            <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                          </svg>
                          Saving...
                        </>
                      ) : 'Save Lecture'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Lecture list */}
            {course.lectures.length === 0 && !showAddForm ? (
              <div style={{
                background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0',
                padding: '60px 20px', textAlign: 'center'
              }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎬</div>
                <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', marginBottom: '6px' }}>No lectures yet</h3>
                <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>
                  Add your first lecture by clicking the button above
                </p>
                <button onClick={() => setShowAddForm(true)} style={{
                  padding: '10px 20px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  color: 'white', border: 'none', borderRadius: '10px',
                  fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit'
                }}>+ Add First Lecture</button>
              </div>
            ) : (
              <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                {course.lectures.map((lecture, i) => (
                  <LectureRow key={lecture._id} lecture={lecture} index={i}
                    isLast={i === course.lectures.length - 1}
                    onDelete={() => setDeleteTarget(lecture)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Students Tab ── */}
        {activeTab === 'students' && (
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            {course.students.length === 0 ? (
              <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>👥</div>
                <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', marginBottom: '6px' }}>No students enrolled yet</h3>
                <p style={{ fontSize: '13px', color: '#94a3b8' }}>Students will appear here once they enroll</p>
              </div>
            ) : (
              <div style={{ padding: '20px 24px' }}>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
                  {course.students.length} students enrolled
                </p>
                {Array.from({ length: Math.min(course.students.length, 10) }, (_, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '10px 0', borderBottom: i < 9 ? '1px solid #f8fafc' : 'none'
                  }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      background: `hsl(${i * 40}, 55%, 85%)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '13px', fontWeight: '700', color: `hsl(${i * 40}, 55%, 30%)`
                    }}>
                      {String.fromCharCode(65 + (i % 26))}
                    </div>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: '500', color: '#0f172a' }}>Student {i + 1}</p>
                      <p style={{ fontSize: '11px', color: '#94a3b8' }}>student{i + 1}@school.edu</p>
                    </div>
                    <span style={{
                      marginLeft: 'auto', fontSize: '11px', fontWeight: '600',
                      background: '#f0fdf4', color: '#16a34a', padding: '2px 8px', borderRadius: '999px'
                    }}>Enrolled</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Details Tab ── */}
        {activeTab === 'details' && (
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '20px' }}>Course Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              {[
                { label: 'Subject', value: course.subject },
                { label: 'Grade Level', value: course.grade },
                { label: 'Language', value: course.language },
                { label: 'Duration', value: course.duration || '—' },
                { label: 'Status', value: course.status },
                { label: 'Total Lectures', value: course.lectures.length },
              ].map(item => (
                <div key={item.label} style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px 16px' }}>
                  <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {item.label}
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', textTransform: 'capitalize' }}>
                    {String(item.value)}
                  </p>
                </div>
              ))}
            </div>
            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px' }}>
              <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Description</p>
              <p style={{ fontSize: '13px', color: '#374151', lineHeight: '1.7' }}>{course.description}</p>
            </div>
          </div>
        )}

      </div>

      {deleteTarget && (
        <DeleteModal
          title={deleteTarget.title}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </MainLayout>
  )
}

export default CourseDetail