import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import { toCourse, subjectInfo, MAX_ENROLLMENT } from '../../utils/courseUtils'

const card = {
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '20px',
}

const greeting = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function StatCard({ icon, iconBg, value, label, note, noteColor }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...card,
        padding: '24px',
        boxShadow: hovered ? '0 12px 28px rgba(15, 23, 42, 0.1)' : '0 1px 3px rgba(15, 23, 42, 0.05)',
        transform: hovered ? 'translateY(-2px)' : 'none',
        transition: 'all 0.2s',
      }}
    >
      <div
        style={{
          width: '48px', height: '48px', borderRadius: '14px', background: iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '18px',
        }}
      >
        {icon}
      </div>
      <div style={{ fontSize: '38px', fontWeight: '700', color: '#0f172a', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '15px', color: '#64748b', margin: '8px 0 14px' }}>{label}</div>
      <div style={{ fontSize: '13px', fontWeight: '600', color: noteColor }}>{note}</div>
    </div>
  )
}

function CourseRow({ course, onManage }) {
  const info = subjectInfo(course.subject)
  const enrolled = course.students.length
  const pct = Math.min(100, Math.round((enrolled / MAX_ENROLLMENT) * 100))
  const isActive = course.status === 'active'

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 24px',
        borderTop: '1px solid #f1f5f9', flexWrap: 'wrap',
      }}
    >
      <div
        style={{
          width: '48px', height: '48px', borderRadius: '14px', background: info.bg, overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0,
        }}
      >
        {course.thumbnail ? (
          <img src={course.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          info.emoji
        )}
      </div>

      <div style={{ flex: '1 1 200px', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>{course.title}</span>
          <span
            style={{
              padding: '2px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600',
              background: isActive ? '#dcfce7' : '#f1f5f9', color: isActive ? '#15803d' : '#64748b',
            }}
          >
            {isActive ? 'Active' : 'Draft'}
          </span>
        </div>
        <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
          {enrolled} students &nbsp; {course.lessons.length} lectures
        </div>
      </div>

      <div style={{ width: '150px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>
          <span>Enrollment</span>
          <span style={{ fontWeight: '700', color: '#0f172a' }}>{enrolled}/{MAX_ENROLLMENT}</span>
        </div>
        <div style={{ height: '6px', borderRadius: '999px', background: '#e2e8f0', overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: info.fg, borderRadius: '999px' }} />
        </div>
      </div>

      <button
        type="button"
        onClick={() => onManage(course._id)}
        style={{
          padding: '10px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#ffffff',
          color: '#0f172a', fontSize: '14px', fontWeight: '600', fontFamily: 'inherit', cursor: 'pointer',
        }}
      >
        Manage
      </button>
    </div>
  )
}

function QuickAction({ label, onClick, disabled, tone }) {
  const tones = {
    teal: { bg: '#f0fdfa', border: '#99f6e4', fg: '#0f766e' },
    blue: { bg: '#eff6ff', border: '#bfdbfe', fg: '#1d4ed8' },
    purple: { bg: '#f5f3ff', border: '#ddd6fe', fg: '#7c3aed' },
  }
  const t = tones[tone]
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 18px', borderRadius: '14px', fontSize: '15px', fontWeight: '600', fontFamily: 'inherit',
        background: t.bg, border: `1px solid ${t.border}`, color: t.fg,
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1,
      }}
    >
      <span>{label}</span>
      {disabled ? <span style={{ fontSize: '12px', fontWeight: '500' }}>Soon</span> : <span>›</span>}
    </button>
  )
}

export default function TeacherDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  const firstName = user?.name?.split(' ')[0] || 'Teacher'

  useEffect(() => {
    api
      .get('/teacher/courses')
      .then((res) => setCourses((res.data.courses || []).map(toCourse)))
      .catch((err) => toast.error(err.response?.data?.message || 'Failed to load your courses.'))
      .finally(() => setLoading(false))
  }, [])

  const uniqueStudents = new Set(
    courses.flatMap((c) => c.students.map((s) => String(s._id || s)))
  ).size
  const totalLectures = courses.reduce((sum, c) => sum + c.lessons.length, 0)
  const activeCourses = courses.filter((c) => c.status === 'active').length

  const goManage = (id) => navigate(`/teacher/courses/${id}`)
  const goCreate = () => navigate('/teacher/courses/create')

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Greeting */}
      <div
        style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          gap: '16px', flexWrap: 'wrap', marginBottom: '28px',
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: '30px', fontWeight: '700', color: '#0f172a' }}>
            {greeting()}, {firstName} 👋
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: '15px', color: '#64748b' }}>
            Here&apos;s what&apos;s happening in your classroom today.
          </p>
        </div>
        <button
          type="button"
          onClick={goCreate}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 24px', border: 'none',
            borderRadius: '14px', color: '#fff', fontSize: '15px', fontWeight: '600', fontFamily: 'inherit',
            cursor: 'pointer', background: 'linear-gradient(135deg, #0d9488, #0891b2)',
            boxShadow: '0 6px 18px rgba(13, 148, 136, 0.35)',
          }}
        >
          <span style={{ fontSize: '20px', lineHeight: 1 }}>+</span> Create New Course
        </button>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px', marginBottom: '28px',
        }}
      >
        <StatCard icon="📘" iconBg="#eff6ff" value={courses.length} label="Total Courses"
          note={`${activeCourses} active`} noteColor="#0d9488" />
        <StatCard icon="👥" iconBg="#f0fdfa" value={uniqueStudents} label="Total Students"
          note="Across all courses" noteColor="#0d9488" />
        <StatCard icon="🎬" iconBg="#fff7ed" value={totalLectures} label="Total Lectures"
          note="Uploaded so far" noteColor="#d97706" />
        <StatCard icon="🚀" iconBg="#f5f3ff" value={courses.length - activeCourses} label="Draft Courses"
          note={courses.length - activeCourses > 0 ? 'Ready to publish?' : 'All published'} noteColor="#7c3aed" />
      </div>

      {/* Bottom grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'start' }}>
        {/* My courses */}
        <div style={{ ...card, gridColumn: 'span 2', minWidth: 0, overflow: 'hidden' }}>
          <div
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '22px 24px', gap: '12px',
            }}
          >
            <div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>My Courses</div>
              <div style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
                {courses.length} {courses.length === 1 ? 'course' : 'courses'} in total
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/teacher/courses')}
              style={{
                background: 'none', border: 'none', color: '#0d9488', fontSize: '14px',
                fontWeight: '600', fontFamily: 'inherit', cursor: 'pointer',
              }}
            >
              View all ›
            </button>
          </div>

          {loading ? (
            <div style={{ padding: '40px 24px', textAlign: 'center', color: '#64748b', borderTop: '1px solid #f1f5f9' }}>
              Loading your courses…
            </div>
          ) : courses.length === 0 ? (
            <div style={{ padding: '40px 24px', textAlign: 'center', borderTop: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '40px', marginBottom: '8px' }}>📚</div>
              <div style={{ fontWeight: '600', color: '#0f172a', marginBottom: '6px' }}>No courses yet</div>
              <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px' }}>
                Create your first course to get started.
              </div>
              <button
                type="button"
                onClick={goCreate}
                style={{
                  padding: '11px 22px', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: '600',
                  fontFamily: 'inherit', cursor: 'pointer', background: 'linear-gradient(135deg, #0d9488, #0891b2)',
                }}
              >
                + Create Course
              </button>
            </div>
          ) : (
            courses.slice(0, 5).map((c) => <CourseRow key={c._id} course={c} onManage={goManage} />)
          )}
        </div>

        {/* Quick actions */}
        <div style={{ ...card, padding: '22px 24px' }}>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>
            Quick Actions
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <QuickAction label="Upload New Lecture" tone="teal" onClick={() => navigate('/teacher/courses')} />
            <QuickAction label="Create Assignment" tone="blue" onClick={() => navigate('/teacher/assignments')} />
            <QuickAction label="Schedule Live Class" tone="purple" disabled />
          </div>
        </div>
      </div>
    </div>
  )
}