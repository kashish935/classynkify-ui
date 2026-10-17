import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getStudentDashboard, apiError } from '../../services/studentService'
import { assetUrl, subjectInfo } from '../../utils/courseUtils'

const StatCard = ({ icon, label, value, sub, color }) => (
  <div style={{
    background: '#fff',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
    display: 'flex', alignItems: 'flex-start', gap: '16px',
    border: '1px solid #f1f5f9',
    transition: 'transform 0.2s, box-shadow 0.2s',
  }}
  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.08)' }}
  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)' }}
  >
    <div style={{
      width: '48px', height: '48px', borderRadius: '14px',
      background: color + '15',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '22px', flexShrink: 0
    }}>{icon}</div>
    <div>
      <p style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500', marginBottom: '4px', letterSpacing: '0.02em' }}>{label}</p>
      <p style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{sub}</p>}
    </div>
  </div>
)

const CourseCard = ({ course }) => {
  const progress = course.progress || 0
  const subject = subjectInfo(course.category)
  const thumb = assetUrl(course.thumbnail)
  const accent = 'linear-gradient(135deg, #6366f1, #8b5cf6)'
  return (
    <Link to={`/student/courses/${course._id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: '#fff',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid #f1f5f9',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer'
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)' }}
      >
        {/* Course color banner */}
        {thumb ? (
          <div style={{ height: '110px', background: `url(${thumb}) center/cover no-repeat` }} />
        ) : (
          <div style={{ height: '8px', background: accent }} />
        )}
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px'
            }}>{subject.emoji}</div>
            <span style={{
              fontSize: '11px', fontWeight: '600', color: '#6366f1',
              background: '#eef2ff', padding: '3px 10px', borderRadius: '999px'
            }}>{progress}% done</span>
          </div>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '4px', lineHeight: 1.3 }}>
            {course.title || 'Untitled Course'}
          </h3>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>
            {course.instructor || 'Instructor'}
            {' · '}{course.completedLessons || 0}/{course.lessonCount || 0} lessons
          </p>
          {/* Progress bar */}
          <div style={{ height: '5px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
              borderRadius: '999px',
              transition: 'width 0.6s ease'
            }} />
          </div>
        </div>
      </div>
    </Link>
  )
}

const EmptyState = ({ icon, title, subtitle, actionLabel, actionTo }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: '60px 24px', textAlign: 'center'
  }}>
    <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>{icon}</div>
    <h3 style={{ fontSize: '17px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>{title}</h3>
    <p style={{ fontSize: '13px', color: '#94a3b8', maxWidth: '260px', lineHeight: 1.6, marginBottom: '20px' }}>{subtitle}</p>
    {actionLabel && actionTo && (
      <Link to={actionTo} style={{
        padding: '10px 22px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        color: '#fff', borderRadius: '12px', fontSize: '13px', fontWeight: '600',
        textDecoration: 'none'
      }}>{actionLabel}</Link>
    )}
  </div>
)

const getGreeting = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getStudentDashboard()
      .then(setData)
      .catch(err => setError(apiError(err, 'Could not load your dashboard. Is the server running?')))
      .finally(() => setLoading(false))
  }, [])

  const courses = data?.enrolledCourses || []
  const stats = data?.stats || {}

  const firstName = user?.name?.split(' ')[0] || user?.name || 'Student'

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: '12px' }}>
      <div style={{
        width: '44px', height: '44px', borderRadius: '50%',
        border: '3px solid #eef2ff', borderTopColor: '#6366f1',
        animation: 'spin 0.8s linear infinite'
      }} />
      <p style={{ color: '#94a3b8', fontSize: '14px' }}>Loading your dashboard…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  return (
    <div style={{ padding: '4px 0', maxWidth: '100%', margin: '0 auto', fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: '700', fontSize: '16px'
          }}>
            {firstName[0]?.toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>
              {getGreeting()}, {firstName} 👋
            </h1>
            <p style={{ fontSize: '13px', color: '#94a3b8' }}>Here's what's happening with your courses today.</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '40px'
      }}>
        <StatCard icon="📖" label="Enrolled Courses" value={stats.enrolled ?? 0} sub="Courses you've joined" color="#6366f1" />
        <StatCard icon="📝" label="Pending Tasks" value={stats.pendingAssignments ?? 0} sub="Assignments to submit" color="#f59e0b" />
        <StatCard icon="✅" label="Lessons Done" value={stats.completedLessons ?? 0} sub="Keep it up!" color="#10b981" />
        <StatCard icon="🎯" label="Avg. Grade" value={stats.avgGrade != null ? `${stats.avgGrade}%` : '—'} sub="Across graded assignments" color="#3b82f6" />
      </div>

      {/* Courses */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.3px' }}>My Courses</h2>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{courses.length} enrolled</p>
          </div>
        </div>

        {courses.length === 0 ? (
          <div style={{
            background: '#fff', borderRadius: '20px',
            border: '1px dashed #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}>
            <EmptyState
              icon="🎓"
              title={error ? "Couldn't load courses" : "No courses yet"}
              subtitle={error || "You haven't enrolled in any courses yet. Browse the catalogue and pick one to get started."}
              actionLabel={error ? undefined : "Browse Courses"}
              actionTo="/student/courses"
            />
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '16px'
          }}>
            {courses.map(course => <CourseCard key={course._id} course={course} />)}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.3px', marginBottom: '16px' }}>
          Quick Actions
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
          {[
            { label: 'View Assignments', icon: '📋', to: '/student/assignments', color: '#f59e0b' },
            { label: 'Check Grades', icon: '📊', to: '/student/grades', color: '#10b981' },
            { label: 'AI Doubt Solver', icon: '🤖', to: '/student/doubt-solver', color: '#6366f1' },
            { label: 'Edit Profile', icon: '👤', to: '/student/profile', color: '#3b82f6' },
          ].map(item => (
            <Link key={item.to} to={item.to} style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#fff',
                border: '1px solid #f1f5f9',
                borderRadius: '16px',
                padding: '18px 20px',
                display: 'flex', alignItems: 'center', gap: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = item.color + '40'; e.currentTarget.style.background = item.color + '08'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <span style={{ fontSize: '22px' }}>{item.icon}</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#334155' }}>{item.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}
