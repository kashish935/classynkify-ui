import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'

const mockCourses = [
  {
    _id: '1', title: 'Mathematics — Grade 10', subject: 'mathematics',
    grade: 'Grade 10', language: 'English', duration: '12 weeks',
    description: 'A comprehensive mathematics course covering algebra, geometry, and trigonometry.',
    status: 'active', students: Array(38).fill(null), lectures: Array(12).fill(null), thumbnail: '',
  },
  {
    _id: '2', title: 'Physics Fundamentals', subject: 'physics',
    grade: 'Grade 11', language: 'English', duration: '10 weeks',
    description: 'Core physics concepts including mechanics, waves, and thermodynamics.',
    status: 'active', students: Array(29).fill(null), lectures: Array(8).fill(null), thumbnail: '',
  },
  {
    _id: '3', title: 'English Literature', subject: 'english',
    grade: 'Grade 10', language: 'English', duration: '14 weeks',
    description: 'Exploring classic and modern literature with critical analysis skills.',
    status: 'active', students: Array(41).fill(null), lectures: Array(15).fill(null), thumbnail: '',
  },
  {
    _id: '4', title: 'Chemistry Basics', subject: 'chemistry',
    grade: 'Grade 9', language: 'English', duration: '8 weeks',
    description: 'Introduction to atoms, molecules, periodic table and basic reactions.',
    status: 'draft', students: Array(0).fill(null), lectures: Array(6).fill(null), thumbnail: '',
  },
  {
    _id: '5', title: 'Computer Science — Grade 12', subject: 'computer_science',
    grade: 'Grade 12', language: 'English', duration: '16 weeks',
    description: 'Data structures, algorithms, and programming fundamentals.',
    status: 'active', students: Array(22).fill(null), lectures: Array(20).fill(null), thumbnail: '',
  },
]

const EMOJIS = {
  mathematics: '📐', physics: '⚛️', chemistry: '🧪', biology: '🧬',
  english: '📖', history: '🏛️', geography: '🌍', computer_science: '💻',
  economics: '📊', other: '📚',
}

const COLORS = {
  mathematics: { bg: '#eff6ff', color: '#2563eb' },
  physics: { bg: '#f5f3ff', color: '#7c3aed' },
  chemistry: { bg: '#fef3c7', color: '#d97706' },
  biology: { bg: '#f0fdf4', color: '#16a34a' },
  english: { bg: '#fdf2f8', color: '#db2777' },
  history: { bg: '#fff7ed', color: '#ea580c' },
  geography: { bg: '#ecfdf5', color: '#059669' },
  computer_science: { bg: '#eff6ff', color: '#2563eb' },
  economics: { bg: '#f0fdfa', color: '#0d9488' },
  other: { bg: '#f8fafc', color: '#64748b' },
}

const DeleteModal = ({ course, onConfirm, onCancel }) => (
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
      <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>Delete course?</h3>
      <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '6px', lineHeight: '1.5' }}>
        <strong>"{course.title}"</strong> and all its lectures will be permanently deleted.
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

const CourseCard = ({ course, onManage, onDelete, onToggleStatus }) => {
  const [hovered, setHovered] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const sc = COLORS[course.subject] || COLORS.other
  const emoji = EMOJIS[course.subject] || '📚'
  const enrollRate = Math.min(100, Math.round((course.students.length / 50) * 100))

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMenuOpen(false) }}
      style={{
        background: 'white', borderRadius: '16px',
        border: `1px solid ${hovered ? '#dbeafe' : '#e2e8f0'}`,
        overflow: 'hidden', transition: 'all 0.2s',
        boxShadow: hovered ? '0 8px 24px rgba(37,99,235,0.08)' : 'none',
        display: 'flex', flexDirection: 'column'
      }}
    >
      {/* Banner */}
      <div style={{
        height: '100px', position: 'relative',
        background: course.thumbnail ? 'transparent' : `linear-gradient(135deg, ${sc.bg}, ${sc.bg}cc)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
      }}>
        {course.thumbnail
          ? <img src={course.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
          : <span style={{ fontSize: '42px' }}>{emoji}</span>
        }
        {/* Status badge */}
        <div style={{
          position: 'absolute', top: '10px', left: '10px',
          fontSize: '10px', fontWeight: '700', padding: '3px 10px', borderRadius: '999px',
          background: course.status === 'active' ? '#dcfce7' : '#f1f5f9',
          color: course.status === 'active' ? '#16a34a' : '#94a3b8',
        }}>
          {course.status === 'active' ? '● Active' : '○ Draft'}
        </div>

        {/* 3-dot menu */}
        <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
          <button onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
            style={{
              width: '28px', height: '28px', borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.85)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#374151'
            }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
            </svg>
          </button>
          {menuOpen && (
            <div style={{
              position: 'absolute', right: 0, top: '34px', background: 'white',
              border: '1px solid #e2e8f0', borderRadius: '12px', padding: '5px',
              minWidth: '170px', zIndex: 50, boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
            }}>
              {[
                { label: 'Manage Lectures', action: () => { onManage(course._id); setMenuOpen(false) } },
                { label: course.status === 'active' ? 'Set as Draft' : 'Set as Active', action: () => { onToggleStatus(course._id); setMenuOpen(false) } },
              ].map(item => (
                <button key={item.label} onClick={item.action} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 10px', borderRadius: '8px', border: 'none',
                  background: 'transparent', cursor: 'pointer', fontSize: '12px',
                  color: '#374151', fontFamily: 'inherit', textAlign: 'left'
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >{item.label}</button>
              ))}
              <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '3px', paddingTop: '3px' }}>
                <button onClick={() => { onDelete(course); setMenuOpen(false) }} style={{
                  width: '100%', padding: '8px 10px', borderRadius: '8px', border: 'none',
                  background: 'transparent', cursor: 'pointer', fontSize: '12px',
                  color: '#ef4444', fontFamily: 'inherit', textAlign: 'left'
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >Delete Course</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <span style={{
          display: 'inline-block', fontSize: '10px', fontWeight: '600',
          padding: '3px 9px', borderRadius: '999px', marginBottom: '8px',
          background: sc.bg, color: sc.color, width: 'fit-content', textTransform: 'capitalize'
        }}>
          {course.subject.replace('_', ' ')} · {course.grade}
        </span>

        <h3 style={{
          fontSize: '14px', fontWeight: '700', color: '#0f172a',
          marginBottom: '6px', lineHeight: '1.4',
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden'
        }}>{course.title}</h3>

        <p style={{
          fontSize: '12px', color: '#64748b', lineHeight: '1.6',
          marginBottom: '14px', flex: 1,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden'
        }}>{course.description}</p>

        {/* Stats */}
        <div style={{
          display: 'flex', gap: '8px', paddingTop: '12px',
          borderTop: '1px solid #f1f5f9', marginBottom: '12px'
        }}>
          {[
            { label: `${course.students.length} Students` },
            { label: `${course.lectures.length} Lectures` },
            { label: course.language },
          ].map(s => (
            <span key={s.label} style={{
              fontSize: '11px', color: '#64748b',
              background: '#f8fafc', padding: '3px 8px',
              borderRadius: '6px', fontWeight: '500'
            }}>{s.label}</span>
          ))}
        </div>

        {/* Progress */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Enrollment</span>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#0f172a' }}>
              {course.students.length}/50
            </span>
          </div>
          <div style={{ height: '4px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '999px', transition: 'width 0.6s ease',
              width: `${enrollRate}%`,
              background: enrollRate >= 75 ? '#0d9488' : enrollRate >= 40 ? '#2563eb' : '#f59e0b'
            }}/>
          </div>
        </div>

        {/* Manage button */}
        <button onClick={() => onManage(course._id)} style={{
          width: '100%', padding: '10px',
          background: hovered ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : 'white',
          color: hovered ? 'white' : '#2563eb',
          border: '1.5px solid #2563eb', borderRadius: '10px',
          fontSize: '13px', fontWeight: '600', cursor: 'pointer',
          fontFamily: 'inherit', transition: 'all 0.2s'
        }}>
          Manage Course
        </button>
      </div>
    </div>
  )
}

const MyCourses = () => {
  const navigate = useNavigate()
  const [courses, setCourses] = useState(mockCourses)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const showSuccess = (msg) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  const handleDelete = () => {
    setCourses(prev => prev.filter(c => c._id !== deleteTarget._id))
    setDeleteTarget(null)
    showSuccess('Course deleted successfully.')
  }

  const handleToggleStatus = (id) => {
    setCourses(prev => prev.map(c =>
      c._id === id ? { ...c, status: c.status === 'active' ? 'draft' : 'active' } : c
    ))
    showSuccess('Course status updated.')
  }

  const counts = {
    all: courses.length,
    active: courses.filter(c => c.status === 'active').length,
    draft: courses.filter(c => c.status === 'draft').length,
  }

  const filtered = courses.filter(c => {
    const matchFilter = filter === 'all' || c.status === filter
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <MainLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif' }}>

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
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '24px', flexWrap: 'wrap', gap: '14px'
        }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>
              My Courses
            </h1>
            <p style={{ fontSize: '13px', color: '#64748b' }}>
              {courses.length} courses · {counts.active} active · {counts.draft} draft
            </p>
          </div>
          <button onClick={() => navigate('/create-course')} style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white',
            border: 'none', borderRadius: '12px', fontSize: '13px', fontWeight: '600',
            cursor: 'pointer', fontFamily: 'inherit',
            boxShadow: '0 4px 14px rgba(37,99,235,0.3)'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <line x1="12" y1="5" x2="12" y2="19" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="5" y1="12" x2="19" y2="12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            New Course
          </button>
        </div>

        {/* Search + Filter */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="#94a3b8" strokeWidth="1.7"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="#94a3b8" strokeWidth="1.7" strokeLinecap="round"/>
              </svg>
            </div>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
              placeholder="Search courses..."
              style={{
                width: '100%', padding: '10px 14px 10px 38px',
                background: searchFocused ? 'white' : '#f8fafc',
                border: `1.5px solid ${searchFocused ? '#2563eb' : '#e2e8f0'}`,
                borderRadius: '10px', fontSize: '13px', color: '#0f172a',
                outline: 'none', transition: 'all 0.2s', fontFamily: 'inherit', boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{
            display: 'flex', background: 'white', border: '1px solid #e2e8f0',
            borderRadius: '10px', padding: '4px', gap: '2px'
          }}>
            {[{ key: 'all', label: 'All' }, { key: 'active', label: 'Active' }, { key: 'draft', label: 'Draft' }].map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)} style={{
                padding: '7px 14px', borderRadius: '8px', border: 'none',
                cursor: 'pointer', fontFamily: 'inherit', fontSize: '12px', fontWeight: '600',
                background: filter === f.key ? '#2563eb' : 'transparent',
                color: filter === f.key ? 'white' : '#64748b', transition: 'all 0.15s'
              }}>
                {f.label} <span style={{
                  marginLeft: '4px', fontSize: '10px', padding: '1px 6px', borderRadius: '999px',
                  background: filter === f.key ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                  color: filter === f.key ? 'white' : '#94a3b8'
                }}>{counts[f.key]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{
            background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0',
            padding: '60px 20px', textAlign: 'center'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>{search ? '🔍' : '📚'}</div>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', marginBottom: '6px' }}>
              {search ? 'No courses found' : 'No courses yet'}
            </h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>
              {search ? `No results for "${search}"` : 'Create your first course to get started'}
            </p>
            {!search && (
              <button onClick={() => navigate('/create-course')} style={{
                padding: '10px 20px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: 'white', border: 'none', borderRadius: '10px',
                fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit'
              }}>+ Create First Course</button>
            )}
          </div>
        ) : (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '18px'
          }}>
            {filtered.map(course => (
              <CourseCard key={course._id} course={course}
                onManage={id => navigate(`/course/${id}`)}
                onDelete={course => setDeleteTarget(course)}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        )}
      </div>

      {deleteTarget && (
        <DeleteModal course={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)}/>
      )}
    </MainLayout>
  )
}

export default MyCourses