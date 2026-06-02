import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axiosInstance from '../../api/axiosInstance'
import { toast } from 'react-toastify'

const CATEGORIES = ['All', 'Mathematics', 'Science', 'Programming', 'Physics', 'General']

const CategoryIcon = ({ category }) => {
  const icons = {
    Mathematics: '📐', Science: '🔬', Programming: '💻',
    Physics: '⚛️', General: '📚', All: '🌟',
  }
  return <span>{icons[category] || '📖'}</span>
}

const CourseCard = ({ course, isEnrolled, onEnroll, enrolling }) => {
  const navigate = useNavigate()
  const lessonCount = course.lessons?.length || 0
  const studentCount = course.enrolledStudents?.length || 0
  const teacherName = course.teacher?.name || 'Unknown Teacher'
  const initials = teacherName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '16px',
        border: '1px solid #e8ecf0',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.12)'
        e.currentTarget.style.borderColor = '#c7d2fe'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'
        e.currentTarget.style.borderColor = '#e8ecf0'
      }}
    >
      {/* Thumbnail */}
      <div style={{
        height: '140px',
        background: course.thumbnail
          ? `url(${course.thumbnail}) center/cover`
          : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)',
        position: 'relative',
        flexShrink: 0,
      }}>
        {/* Price badge */}
        <div style={{
          position: 'absolute', top: '12px', right: '12px',
          background: course.isFree || course.price === 0 ? '#22c55e' : '#6366f1',
          color: '#fff', borderRadius: '20px',
          padding: '4px 12px', fontSize: '12px', fontWeight: '700',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}>
          {course.isFree || course.price === 0 ? 'FREE' : `₹${course.price}`}
        </div>

        {/* Category badge */}
        {course.category && (
          <div style={{
            position: 'absolute', bottom: '12px', left: '12px',
            background: 'rgba(255,255,255,0.9)',
            borderRadius: '8px', padding: '3px 10px',
            fontSize: '11px', fontWeight: '600', color: '#475569',
            backdropFilter: 'blur(4px)',
          }}>
            <CategoryIcon category={course.category} /> {course.category}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <h3 style={{
            fontSize: '15px', fontWeight: '700', color: '#0f172a',
            lineHeight: 1.4, marginBottom: '6px',
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {course.title}
          </h3>
          <p style={{
            fontSize: '12.5px', color: '#64748b', lineHeight: 1.5,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {course.description}
          </p>
        </div>

        {/* Teacher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '26px', height: '26px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '10px', fontWeight: '700', color: '#fff', flexShrink: 0,
          }}>{initials}</div>
          <span style={{ fontSize: '12px', color: '#475569', fontWeight: '500' }}>{teacherName}</span>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'flex', gap: '16px',
          padding: '10px 0',
          borderTop: '1px solid #f1f5f9',
          borderBottom: '1px solid #f1f5f9',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#94a3b8" strokeWidth="2"/>
              <polyline points="14 2 14 8 20 8" stroke="#94a3b8" strokeWidth="2"/>
            </svg>
            <span style={{ fontSize: '12px', color: '#64748b' }}>{lessonCount} lessons</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#94a3b8" strokeWidth="2"/>
              <circle cx="9" cy="7" r="4" stroke="#94a3b8" strokeWidth="2"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="#94a3b8" strokeWidth="2"/>
            </svg>
            <span style={{ fontSize: '12px', color: '#64748b' }}>{studentCount} enrolled</span>
          </div>
        </div>

        {/* Action button */}
        {isEnrolled ? (
          <button
            onClick={() => navigate(`/student/courses/${course._id}`)}
            style={{
              width: '100%', padding: '10px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff', border: 'none', borderRadius: '10px',
              fontSize: '13px', fontWeight: '700', cursor: 'pointer',
              fontFamily: 'inherit', transition: 'opacity 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <polygon points="5 3 19 12 5 21 5 3" fill="white"/>
            </svg>
            Continue Learning
          </button>
        ) : (
          <button
            onClick={() => onEnroll(course._id)}
            disabled={enrolling === course._id}
            style={{
              width: '100%', padding: '10px',
              background: enrolling === course._id ? '#e2e8f0' : '#f0f0ff',
              color: enrolling === course._id ? '#94a3b8' : '#6366f1',
              border: '1.5px solid',
              borderColor: enrolling === course._id ? '#e2e8f0' : '#c7d2fe',
              borderRadius: '10px',
              fontSize: '13px', fontWeight: '700', cursor: enrolling === course._id ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              if (enrolling !== course._id) {
                e.currentTarget.style.background = 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                e.currentTarget.style.color = '#fff'
                e.currentTarget.style.borderColor = 'transparent'
              }
            }}
            onMouseLeave={e => {
              if (enrolling !== course._id) {
                e.currentTarget.style.background = '#f0f0ff'
                e.currentTarget.style.color = '#6366f1'
                e.currentTarget.style.borderColor = '#c7d2fe'
              }
            }}
          >
            {enrolling === course._id ? 'Enrolling…' : '+ Enroll Now'}
          </button>
        )}
      </div>
    </div>
  )
}

export default function CoursesPage() {
  const { user } = useAuth()
  const [allCourses, setAllCourses] = useState([])
  const [enrolledIds, setEnrolledIds] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(null) // courseId being enrolled
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [allRes, enrolledRes] = await Promise.all([
        axiosInstance.get('/student/courses'),
        axiosInstance.get('/student/courses/enrolled'),
      ])
      setAllCourses(allRes.data?.courses || [])
      const ids = new Set((enrolledRes.data?.courses || []).map(c => c._id))
      setEnrolledIds(ids)
    } catch {
      // empty state handles this silently
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async (courseId) => {
    setEnrolling(courseId)
    try {
      await axiosInstance.post(`/student/courses/${courseId}/enroll`)
      setEnrolledIds(prev => new Set([...prev, courseId]))
      toast.success('🎉 Enrolled successfully!')
    } catch (err) {
      const msg = err?.response?.data?.message || 'Enrollment failed. Try again.'
      toast.error(msg)
    } finally {
      setEnrolling(null)
    }
  }

  const filtered = allCourses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase()) ||
      c.teacher?.name?.toLowerCase().includes(search.toLowerCase())
    const matchCategory = activeCategory === 'All' || c.category === activeCategory
    return matchSearch && matchCategory
  })

  const enrolledCount = enrolledIds.size
  const availableCount = allCourses.length - enrolledCount

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Page Header */}
      <div style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        borderRadius: '20px', padding: '28px 32px', marginBottom: '28px',
        color: '#fff', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-40px', right: '-40px',
          width: '180px', height: '180px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
        }}/>
        <div style={{
          position: 'absolute', bottom: '-20px', right: '120px',
          width: '100px', height: '100px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
        }}/>
        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '6px', letterSpacing: '-0.4px' }}>
          Browse Courses 📚
        </h1>
        <p style={{ fontSize: '14px', opacity: 0.85, marginBottom: '20px' }}>
          Discover and enroll in courses to expand your knowledge
        </p>
        <div style={{ display: 'flex', gap: '20px' }}>
          {[
            { label: 'Total Courses', value: allCourses.length },
            { label: 'Enrolled', value: enrolledCount },
            { label: 'Available', value: availableCount },
          ].map(stat => (
            <div key={stat.label} style={{
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '12px', padding: '10px 20px',
              backdropFilter: 'blur(8px)',
            }}>
              <p style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>{stat.value}</p>
              <p style={{ fontSize: '11px', opacity: 0.8, margin: 0 }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search + Filter */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
          <svg style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
            width="15" height="15" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="#94a3b8" strokeWidth="2"/>
            <path d="m21 21-4.35-4.35" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search courses, teachers…"
            style={{
              width: '100%', padding: '10px 14px 10px 40px',
              border: '1.5px solid #e2e8f0', borderRadius: '12px',
              fontSize: '13.5px', color: '#0f172a', outline: 'none',
              fontFamily: 'inherit', background: '#fff',
              boxSizing: 'border-box', transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = '#6366f1'}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 16px', borderRadius: '20px',
                fontSize: '12.5px', fontWeight: '600', cursor: 'pointer',
                fontFamily: 'inherit', transition: 'all 0.15s', border: '1.5px solid',
                background: activeCategory === cat ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#fff',
                color: activeCategory === cat ? '#fff' : '#64748b',
                borderColor: activeCategory === cat ? 'transparent' : '#e2e8f0',
                boxShadow: activeCategory === cat ? '0 2px 8px rgba(99,102,241,0.3)' : 'none',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} style={{
              height: '340px', borderRadius: '16px',
              background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
            }}/>
          ))}
          <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '64px 24px',
          background: '#fff', borderRadius: '20px',
          border: '1px solid #e8ecf0',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
            No courses found
          </h3>
          <p style={{ fontSize: '14px', color: '#94a3b8' }}>
            {search ? `No results for "${search}"` : 'No courses available yet. Check back soon!'}
          </p>
          {search && (
            <button onClick={() => setSearch('')} style={{
              marginTop: '16px', padding: '10px 24px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff', border: 'none', borderRadius: '10px',
              fontSize: '13px', fontWeight: '600', cursor: 'pointer',
              fontFamily: 'inherit',
            }}>
              Clear search
            </button>
          )}
        </div>
      )}

      {/* Course Grid */}
      {!loading && filtered.length > 0 && (
        <>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px' }}>
            Showing {filtered.length} course{filtered.length !== 1 ? 's' : ''}
            {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
          }}>
            {filtered.map(course => (
              <CourseCard
                key={course._id}
                course={course}
                isEnrolled={enrolledIds.has(course._id)}
                onEnroll={handleEnroll}
                enrolling={enrolling}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}