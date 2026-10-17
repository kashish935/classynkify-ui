import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../../services/api'
import { toCourse, subjectInfo, MAX_ENROLLMENT } from '../../utils/courseUtils'

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'draft', label: 'Draft' },
]

const chipStyle = {
  padding: '5px 10px',
  borderRadius: '8px',
  background: '#f1f5f9',
  color: '#475569',
  fontSize: '12px',
  fontWeight: '500',
}

function CourseCard({ course, onManage, onToggleStatus, onDelete }) {
  const [hovered, setHovered] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const info = subjectInfo(course.subject)
  const enrolled = course.students.length
  const pct = Math.min(100, Math.round((enrolled / MAX_ENROLLMENT) * 100))
  const isActive = course.status === 'active'

  useEffect(() => {
    if (!menuOpen) return
    const onDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [menuOpen])

  const menuItem = (color = '#334155') => ({
    width: '100%',
    textAlign: 'left',
    padding: '10px 12px',
    background: 'transparent',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    cursor: 'pointer',
    color,
  })

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '20px',
        overflow: 'visible',
        boxShadow: hovered ? '0 12px 28px rgba(15, 23, 42, 0.12)' : '0 1px 3px rgba(15, 23, 42, 0.06)',
        transform: hovered ? 'translateY(-2px)' : 'none',
        transition: 'all 0.2s',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          position: 'relative',
          height: '126px',
          background: info.bg,
          borderRadius: '20px 20px 0 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span style={{ fontSize: '52px' }}>{info.emoji}</span>
        )}

        <span
          style={{
            position: 'absolute', top: '12px', left: '12px',
            padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600',
            background: isActive ? '#dcfce7' : '#ffffff',
            color: isActive ? '#15803d' : '#64748b',
          }}
        >
          {isActive ? '● Active' : '○ Draft'}
        </span>
      </div>

      {/* Menu (outside the clipped header so the dropdown can overflow) */}
      <div ref={menuRef} style={{ position: 'absolute', top: '12px', right: '12px' }}>
        <button
          type="button"
          aria-label="Course options"
          onClick={() => setMenuOpen((o) => !o)}
          style={{
            width: '32px', height: '32px', borderRadius: '8px', border: 'none',
            background: '#ffffff', cursor: 'pointer', fontSize: '18px', color: '#475569',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.15)',
          }}
        >
          ⋮
        </button>
        {menuOpen && (
          <div
            style={{
              position: 'absolute', top: '38px', right: 0, minWidth: '190px', padding: '6px',
              background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(15, 23, 42, 0.18)', zIndex: 20,
            }}
          >
            <button type="button" style={menuItem()} onClick={() => { setMenuOpen(false); onManage(course._id) }}>
              Manage Lectures
            </button>
            <button type="button" style={menuItem()} onClick={() => { setMenuOpen(false); onToggleStatus(course._id) }}>
              {isActive ? 'Set as Draft' : 'Set as Active'}
            </button>
            <button type="button" style={menuItem('#dc2626')} onClick={() => { setMenuOpen(false); onDelete(course) }}>
              Delete Course
            </button>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        <span
          style={{
            alignSelf: 'flex-start', padding: '4px 10px', borderRadius: '8px',
            background: info.chipBg, color: info.fg, fontSize: '12px', fontWeight: '600',
          }}
        >
          {info.label}{course.grade ? ` · ${course.grade}` : ''}
        </span>

        <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: '#0f172a' }}>{course.title}</h3>

        <p
          style={{
            margin: 0, fontSize: '14px', lineHeight: '1.5', color: '#64748b',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            minHeight: '42px',
          }}
        >
          {course.description}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
          <span style={chipStyle}>{enrolled} Students</span>
          <span style={chipStyle}>{course.lessons.length} Lectures</span>
          <span style={chipStyle}>{course.language}</span>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>
            <span>Enrollment</span>
            <span style={{ fontWeight: '600', color: '#0f172a' }}>{enrolled}/{MAX_ENROLLMENT}</span>
          </div>
          <div style={{ height: '6px', borderRadius: '999px', background: '#e2e8f0', overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: info.fg, borderRadius: '999px' }} />
          </div>
        </div>

        <button
          type="button"
          onClick={() => onManage(course._id)}
          style={{
            marginTop: 'auto', width: '100%', padding: '12px', borderRadius: '12px',
            border: '1.5px solid #2563eb', background: '#ffffff', color: '#2563eb',
            fontSize: '14px', fontWeight: '600', fontFamily: 'inherit', cursor: 'pointer',
          }}
        >
          Manage Course
        </button>
      </div>
    </div>
  )
}

export default function MyCourses() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    api
      .get('/teacher/courses')
      .then((res) => setCourses((res.data.courses || []).map(toCourse)))
      .catch((err) => toast.error(err.response?.data?.message || 'Failed to load courses.'))
      .finally(() => setLoading(false))
  }, [])

  const goCreate = () => navigate('/teacher/courses/create')
  const goManage = (id) => navigate(`/teacher/courses/${id}`)

  const handleToggleStatus = async (id) => {
    const course = courses.find((c) => c._id === id)
    if (!course) return
    const makeActive = course.status !== 'active'
    try {
      await api.patch(`/teacher/courses/${id}/status`, { isPublished: makeActive })
      setCourses((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: makeActive ? 'active' : 'draft' } : c))
      )
      toast.success(makeActive ? 'Course is now active.' : 'Course moved to draft.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status.')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await api.delete(`/teacher/courses/${deleteTarget._id}`)
      setCourses((prev) => prev.filter((c) => c._id !== deleteTarget._id))
      toast.success('Course deleted successfully.')
      setDeleteTarget(null)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete course.')
    } finally {
      setDeleting(false)
    }
  }

  const counts = {
    all: courses.length,
    active: courses.filter((c) => c.status === 'active').length,
    draft: courses.filter((c) => c.status === 'draft').length,
  }

  const q = search.trim().toLowerCase()
  const filtered = courses.filter((c) => {
    const matchFilter = filter === 'all' || c.status === filter
    const matchSearch =
      !q ||
      c.title.toLowerCase().includes(q) ||
      subjectInfo(c.subject).label.toLowerCase().includes(q) ||
      c.grade.toLowerCase().includes(q)
    return matchFilter && matchSearch
  })

  const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '30px', fontWeight: '700', color: '#0f172a' }}>My Courses</h1>
          <p style={{ margin: '6px 0 0', fontSize: '15px', color: '#64748b' }}>
            {plural(counts.all, 'course')} · {counts.active} active · {counts.draft} draft
          </p>
        </div>
        <button
          type="button"
          onClick={goCreate}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 24px', border: 'none',
            borderRadius: '14px', color: '#fff', fontSize: '15px', fontWeight: '600', fontFamily: 'inherit',
            cursor: 'pointer', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            boxShadow: '0 6px 18px rgba(37, 99, 235, 0.35)',
          }}
        >
          <span style={{ fontSize: '20px', lineHeight: 1 }}>+</span> New Course
        </button>
      </div>

      {/* Search + filter */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '28px' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            style={{
              width: '100%', boxSizing: 'border-box', padding: '14px 16px 14px 44px', fontSize: '15px',
              border: '1px solid #e2e8f0', borderRadius: '14px', background: '#f8fafc', color: '#0f172a',
              outline: 'none', fontFamily: 'inherit',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '4px', padding: '6px', border: '1px solid #e2e8f0', borderRadius: '14px', background: '#ffffff' }}>
          {FILTERS.map((f) => {
            const active = filter === f.key
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', border: 'none',
                  borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', fontFamily: 'inherit',
                  background: active ? '#2563eb' : 'transparent', color: active ? '#ffffff' : '#475569',
                }}
              >
                {f.label}
                <span
                  style={{
                    padding: '1px 8px', borderRadius: '999px', fontSize: '12px',
                    background: active ? 'rgba(255, 255, 255, 0.25)' : '#e2e8f0',
                    color: active ? '#ffffff' : '#475569',
                  }}
                >
                  {counts[f.key]}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <p style={{ color: '#64748b', textAlign: 'center', padding: '60px 0' }}>Loading courses…</p>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px' }}>
          <div style={{ fontSize: '44px', marginBottom: '10px' }}>📚</div>
          {courses.length === 0 ? (
            <>
              <h3 style={{ margin: '0 0 6px', color: '#0f172a' }}>No courses yet</h3>
              <p style={{ margin: '0 0 20px', color: '#64748b' }}>Create your first course to get started</p>
              <button
                type="button"
                onClick={goCreate}
                style={{
                  padding: '12px 22px', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: '600',
                  fontFamily: 'inherit', cursor: 'pointer', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                }}
              >
                + Create First Course
              </button>
            </>
          ) : (
            <>
              <h3 style={{ margin: '0 0 6px', color: '#0f172a' }}>No courses found</h3>
              <p style={{ margin: 0, color: '#64748b' }}>
                {q ? `No results for "${search}"` : `You have no ${filter} courses.`}
              </p>
            </>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {filtered.map((c) => (
            <div key={c._id} style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
              <CourseCard
                course={c}
                onManage={goManage}
                onToggleStatus={handleToggleStatus}
                onDelete={setDeleteTarget}
              />
            </div>
          ))}
        </div>
      )}

      {/* Delete modal */}
      {deleteTarget && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
          }}
          onClick={() => !deleting && setDeleteTarget(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: '100%', maxWidth: '400px', background: '#ffffff', borderRadius: '20px', padding: '28px', boxShadow: '0 20px 50px rgba(15, 23, 42, 0.3)' }}
          >
            <h3 style={{ margin: '0 0 8px', fontSize: '19px', color: '#0f172a' }}>Delete course?</h3>
            <p style={{ margin: '0 0 22px', fontSize: '14px', lineHeight: '1.6', color: '#64748b' }}>
              “{deleteTarget.title}” and all its lectures will be permanently deleted. This can’t be undone.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                style={{ padding: '10px 18px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#ffffff', color: '#334155', fontWeight: '600', fontFamily: 'inherit', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
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