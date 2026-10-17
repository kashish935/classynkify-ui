import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getBrowseCourses, enrollInCourse, apiError } from '../../services/studentService'
import { assetUrl, subjectInfo } from '../../utils/courseUtils'

const GRADIENTS = [
  'linear-gradient(135deg,#2563eb,#1d4ed8)',
  'linear-gradient(135deg,#7c3aed,#6d28d9)',
  'linear-gradient(135deg,#db2777,#be185d)',
  'linear-gradient(135deg,#d97706,#b45309)',
  'linear-gradient(135deg,#0284c7,#0369a1)',
  'linear-gradient(135deg,#16a34a,#15803d)',
  'linear-gradient(135deg,#f97316,#ea580c)',
  'linear-gradient(135deg,#0d9488,#0f766e)',
]

// Same category always gets the same colour
const gradientFor = (course) => {
  const key = String(course.category || course._id || '')
  let hash = 0
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  return GRADIENTS[hash % GRADIENTS.length]
}

// ─────────────────────────────────────────────────────────────
//  CourseCard
// ─────────────────────────────────────────────────────────────
function CourseCard({ course, isEnrolled, onEnroll, enrolling }) {
  const navigate = useNavigate()
  const lessonCount = course.lessonCount || 0
  const studentCount = course.enrolledCount || 0
  const teacherName = course.instructor || 'Instructor'
  const initials = teacherName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const bg = gradientFor(course)
  const subject = subjectInfo(course.category)
  const thumb = assetUrl(course.thumbnail)

  return (
    <div
      style={{
        background: '#fff', borderRadius: '16px', border: '1px solid #e8ecf0',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        transition: 'all 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.12)'; e.currentTarget.style.borderColor = '#c7d2fe' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = '#e8ecf0' }}
    >
      {/* Thumbnail */}
      <div style={{ height: '160px', background: thumb ? `url(${thumb}) center/cover no-repeat` : bg, position: 'relative', flexShrink: 0, overflow: 'hidden' }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.10)', pointerEvents: 'none' }}/>
        <div style={{ position: 'absolute', bottom: '-30px', left: '30px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }}/>
        <div style={{ position: 'absolute', top: '50px', right: '60px', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }}/>

        {/* Big centred emoji — only when no real image */}
        {!thumb && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '52px', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))', lineHeight: 1 }}>
              {subject.emoji}
            </span>
          </div>
        )}

        {/* FREE badge */}
        <div style={{ position: 'absolute', top: '12px', right: '12px', background: course.isFree || !course.price ? '#22c55e' : '#6366f1', color: '#fff', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', fontWeight: '700', boxShadow: '0 2px 8px rgba(0,0,0,0.20)' }}>
          {course.isFree || !course.price ? 'FREE' : `₹${course.price}`}
        </div>
        {/* Category */}
        {course.category && (
          <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(255,255,255,0.92)', borderRadius: '8px', padding: '3px 10px', fontSize: '11px', fontWeight: '600', color: '#475569', backdropFilter: 'blur(4px)' }}>
            {subject.emoji} {subject.label}
          </div>
        )}
        {/* Enrolled badge */}
        {isEnrolled && (
          <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(99,102,241,0.92)', color: '#fff', borderRadius: '8px', padding: '3px 10px', fontSize: '11px', fontWeight: '700', backdropFilter: 'blur(4px)' }}>
            ✓ Enrolled
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', lineHeight: 1.4, marginBottom: '6px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {course.title}
          </h3>
          <p style={{ fontSize: '12.5px', color: '#64748b', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {course.description}
          </p>
        </div>

        {/* Teacher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700', color: '#fff', flexShrink: 0 }}>{initials}</div>
          <span style={{ fontSize: '12px', color: '#475569', fontWeight: '500' }}>{teacherName}</span>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '16px', padding: '10px 0', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#94a3b8" strokeWidth="2"/><polyline points="14 2 14 8 20 8" stroke="#94a3b8" strokeWidth="2"/></svg>
            <span style={{ fontSize: '12px', color: '#64748b' }}>{lessonCount} lessons</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#94a3b8" strokeWidth="2"/><circle cx="9" cy="7" r="4" stroke="#94a3b8" strokeWidth="2"/></svg>
            <span style={{ fontSize: '12px', color: '#64748b' }}>{studentCount} enrolled</span>
          </div>
        </div>

        {/* CTA */}
        {isEnrolled ? (
          <button
            onClick={() => navigate(`/student/courses/${course._id}`)}
            style={{ width: '100%', padding: '10px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polygon points="5 3 19 12 5 21 5 3" fill="white"/></svg>
            Continue Learning
          </button>
        ) : (
          <button
            onClick={() => onEnroll(course)}
            disabled={enrolling === course._id}
            style={{ width: '100%', padding: '10px', background: enrolling === course._id ? '#e2e8f0' : '#f0f0ff', color: enrolling === course._id ? '#94a3b8' : '#6366f1', border: '1.5px solid', borderColor: enrolling === course._id ? '#e2e8f0' : '#c7d2fe', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: enrolling === course._id ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
            onMouseEnter={e => { if (enrolling !== course._id) { e.currentTarget.style.background = 'linear-gradient(135deg,#6366f1,#8b5cf6)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'transparent' } }}
            onMouseLeave={e => { if (enrolling !== course._id) { e.currentTarget.style.background = '#f0f0ff'; e.currentTarget.style.color = '#6366f1'; e.currentTarget.style.borderColor = '#c7d2fe' } }}
          >
            {enrolling === course._id ? 'Enrolling…' : '+ Enroll Now'}
          </button>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  EnrollConfirmModal
// ─────────────────────────────────────────────────────────────
function EnrollModal({ course, onConfirm, onCancel }) {
  if (!course) return null
  const bg = gradientFor(course)
  const subject = subjectInfo(course.category)
  const thumb = assetUrl(course.thumbnail)
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backdropFilter: 'blur(4px)' }}
      onClick={onCancel}>
      <div style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '420px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.18)', animation: 'modalPop 0.2s ease' }}
        onClick={e => e.stopPropagation()}>
        <style>{`@keyframes modalPop { from{opacity:0;transform:scale(0.94)} to{opacity:1;transform:scale(1)} }`}</style>
        {/* Banner */}
        <div style={{ height: '110px', background: thumb ? `url(${thumb}) center/cover no-repeat` : bg, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-15px', right: '-15px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.10)' }}/>
          <div style={{ position: 'absolute', bottom: '-20px', left: '20px', width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }}/>
          {!thumb && (
            <span style={{ fontSize: '44px', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))', position: 'relative', zIndex: 1 }}>
              {subject.emoji}
            </span>
          )}
        </div>
        <div style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>{course.title}</h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>👤 {course.instructor || 'Instructor'}</p>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px', lineHeight: 1.5 }}>{course.description}</p>
          <div style={{ display: 'flex', gap: '20px', background: '#f8fafc', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>{course.lessonCount || 0}</p>
              <p style={{ fontSize: '11px', color: '#94a3b8' }}>Lessons</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>{course.enrolledCount || 0}</p>
              <p style={{ fontSize: '11px', color: '#94a3b8' }}>Students</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '18px', fontWeight: '800', color: '#22c55e' }}>{course.isFree || !course.price ? 'FREE' : `₹${course.price}`}</p>
              <p style={{ fontSize: '11px', color: '#94a3b8' }}>Price</p>
            </div>
          </div>
          <p style={{ fontSize: '13px', color: '#475569', marginBottom: '20px', textAlign: 'center' }}>
            Enroll now to add this course to your <strong>Dashboard → My Courses</strong>.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onCancel} style={{ flex: 1, padding: '11px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
              Cancel
            </button>
            <button onClick={onConfirm} style={{ flex: 2, padding: '11px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
              ✓ Confirm Enroll
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  CoursesPage
// ─────────────────────────────────────────────────────────────
export default function CoursesPage() {
  const [allCourses, setAllCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [enrolling, setEnrolling] = useState(null)
  const [pendingCourse, setPendingCourse] = useState(null)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const load = async () => {
    setLoading(true)
    setLoadError('')
    try {
      setAllCourses(await getBrowseCourses())
    } catch (err) {
      setLoadError(apiError(err, 'Could not load courses. Is the server running?'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  // Categories come from the courses that actually exist
  const categories = useMemo(() => {
    const keys = [...new Set(allCourses.map(c => c.category).filter(Boolean))]
    return ['All', ...keys]
  }, [allCourses])

  const categoryLabel = (cat) => (cat === 'All' ? 'All' : subjectInfo(cat).label)
  const categoryIcon = (cat) => (cat === 'All' ? '🌟' : subjectInfo(cat).emoji)

  // Called when user clicks "Enroll Now" — opens confirm modal
  const handleEnrollClick = (course) => {
    setPendingCourse(course)
  }

  // Called when user confirms in the modal
  const handleConfirmEnroll = async () => {
    if (!pendingCourse) return
    const courseId = pendingCourse._id
    setEnrolling(courseId)
    setPendingCourse(null)

    try {
      await enrollInCourse(courseId)
      setAllCourses(prev => prev.map(c =>
        c._id === courseId
          ? { ...c, isEnrolled: true, enrolledCount: (c.enrolledCount || 0) + 1 }
          : c
      ))
      toast.success('🎉 Enrolled! Check your Dashboard → My Courses.', { position: 'top-right', autoClose: 3000 })
    } catch (err) {
      toast.error(apiError(err, 'Could not enroll. Please try again.'))
      // The course may already be enrolled / full — refresh from the server
      load()
    } finally {
      setEnrolling(null)
    }
  }

  const filtered = allCourses.filter(c => {
    const s = search.toLowerCase()
    const matchSearch = c.title?.toLowerCase().includes(s) || c.description?.toLowerCase().includes(s) || (c.instructor || '').toLowerCase().includes(s)
    const matchCategory = activeCategory === 'All' || c.category === activeCategory
    return matchSearch && matchCategory
  })

  const enrolledCount = allCourses.filter(c => c.isEnrolled).length
  const availableCount = allCourses.length - enrolledCount

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Enroll confirm modal */}
      <EnrollModal course={pendingCourse} onConfirm={handleConfirmEnroll} onCancel={() => setPendingCourse(null)} />

      {/* Page Header */}
      <div style={{ background: 'linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)', borderRadius: '20px', padding: '28px 32px', marginBottom: '28px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }}/>
        <div style={{ position: 'absolute', bottom: '-20px', right: '120px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }}/>
        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '6px', letterSpacing: '-0.4px' }}>Browse Courses 📚</h1>
        <p style={{ fontSize: '14px', opacity: 0.85, marginBottom: '20px' }}>Discover and enroll in courses to expand your knowledge</p>
        <div style={{ display: 'flex', gap: '20px' }}>
          {[{ label: 'Total Courses', value: allCourses.length }, { label: 'Enrolled', value: enrolledCount }, { label: 'Available', value: availableCount }].map(stat => (
            <div key={stat.label} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '10px 20px', backdropFilter: 'blur(8px)' }}>
              <p style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>{stat.value}</p>
              <p style={{ fontSize: '11px', opacity: 0.8, margin: 0 }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search + Filter */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
          <svg style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} width="15" height="15" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="#94a3b8" strokeWidth="2"/>
            <path d="m21 21-4.35-4.35" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses, teachers…"
            style={{ width: '100%', padding: '10px 14px 10px 40px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '13.5px', color: '#0f172a', outline: 'none', fontFamily: 'inherit', background: '#fff', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
            onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '12.5px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', border: '1.5px solid', background: activeCategory === cat ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#fff', color: activeCategory === cat ? '#fff' : '#64748b', borderColor: activeCategory === cat ? 'transparent' : '#e2e8f0', boxShadow: activeCategory === cat ? '0 2px 8px rgba(99,102,241,0.3)' : 'none' }}>
              {categoryIcon(cat)} {categoryLabel(cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Shimmer loading */}
      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {[1,2,3,4,5,6].map(i => <div key={i} style={{ height: '340px', borderRadius: '16px', background: 'linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }}/>)}
          <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
        </div>
      )}

      {/* Load error */}
      {!loading && loadError && (
        <div style={{ textAlign: 'center', padding: '48px 24px', background: '#fff', borderRadius: '20px', border: '1px solid #fecaca' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>⚠️</div>
          <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>Couldn't load courses</h3>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>{loadError}</p>
          <button onClick={load} style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>Try again</button>
        </div>
      )}

      {/* Empty */}
      {!loading && !loadError && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '64px 24px', background: '#fff', borderRadius: '20px', border: '1px solid #e8ecf0' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>No courses found</h3>
          <p style={{ fontSize: '14px', color: '#94a3b8' }}>{search ? `No results for "${search}"` : 'No courses available yet.'}</p>
          {search && <button onClick={() => setSearch('')} style={{ marginTop: '16px', padding: '10px 24px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>Clear search</button>}
        </div>
      )}

      {/* Grid */}
      {!loading && !loadError && filtered.length > 0 && (
        <>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px' }}>
            Showing {filtered.length} course{filtered.length !== 1 ? 's' : ''}{activeCategory !== 'All' ? ` in ${categoryLabel(activeCategory)}` : ''}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {filtered.map(course => (
              <CourseCard key={course._id} course={course} isEnrolled={course.isEnrolled} onEnroll={handleEnrollClick} enrolling={enrolling} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
