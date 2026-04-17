import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import MainLayout from '../layouts/MainLayout'

// ── Mock data (replace with API calls once backend is ready) ──
const mockStats = {
  totalCourses: 8,
  totalStudents: 142,
  pendingAssignments: 6,
  avgCompletion: 76,
}

const mockCourses = [
  { id: 1, title: 'Mathematics — Grade 10', subject: '📐', students: 38, lectures: 12, completion: 82, status: 'active' },
  { id: 2, title: 'Physics Fundamentals', subject: '⚛️', students: 29, lectures: 8, completion: 61, status: 'active' },
  { id: 3, title: 'English Literature', subject: '📖', students: 41, lectures: 15, completion: 90, status: 'active' },
  { id: 4, title: 'Chemistry Basics', subject: '🧪', students: 34, lectures: 6, completion: 44, status: 'draft' },
]

const mockActivity = [
  { id: 1, text: 'Rohan Sharma submitted Assignment 3', time: '5 min ago', type: 'submission' },
  { id: 2, text: 'New student enrolled in Physics', time: '1 hr ago', type: 'enroll' },
  { id: 3, text: 'Priya Mehta submitted Assignment 2', time: '2 hr ago', type: 'submission' },
  { id: 4, text: 'You uploaded Lecture 9 in Maths', time: '3 hr ago', type: 'upload' },
  { id: 5, text: '3 new students joined English Lit', time: 'Yesterday', type: 'enroll' },
]

// ── Reusable sub-components ──

const StatCard = ({ label, value, change, positive, color, bg, icon }) => {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'white',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        padding: '20px',
        transition: 'all 0.2s',
        boxShadow: hovered ? '0 4px 20px rgba(0,0,0,0.07)' : 'none',
        cursor: 'default'
      }}
    >
      <div style={{
        width: '44px', height: '44px', borderRadius: '12px',
        background: bg, display: 'flex', alignItems: 'center',
        justifyContent: 'center', marginBottom: '16px'
      }}>
        {icon}
      </div>
      <p style={{ fontSize: '30px', fontWeight: '700', color: '#0f172a', lineHeight: 1, marginBottom: '4px' }}>
        {value}
      </p>
      <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>{label}</p>
      <p style={{ fontSize: '11px', fontWeight: '600', color: positive ? '#0d9488' : '#f59e0b' }}>
        {change}
      </p>
    </div>
  )
}

const ActivityDot = ({ type }) => {
  const map = {
    submission: { bg: '#eff6ff', color: '#2563eb' },
    enroll: { bg: '#f0fdfa', color: '#0d9488' },
    upload: { bg: '#f5f3ff', color: '#8b5cf6' },
  }
  const c = map[type] || map.upload
  const icons = {
    submission: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
        <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M9 13h6M9 17h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    enroll: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    upload: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <polyline points="16 16 12 12 8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="12" y1="12" x2="12" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
  return (
    <div style={{
      width: '32px', height: '32px', borderRadius: '8px',
      background: c.bg, color: c.color,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
    }}>
      {icons[type]}
    </div>
  )
}

// ── Main Dashboard ──
const TeacherDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(mockStats)
  const [courses, setCourses] = useState(mockCourses)
  const [activity, setActivity] = useState(mockActivity)
  const [loading, setLoading] = useState(false)

  // 🔁 When backend is ready, replace this with real API calls:
  // useEffect(() => {
  //   const fetchDashboard = async () => {
  //     setLoading(true)
  //     try {
  //       const [statsRes, coursesRes] = await Promise.all([
  //         api.get('/teacher/stats'),
  //         api.get('/courses/my'),
  //       ])
  //       setStats(statsRes.data)
  //       setCourses(coursesRes.data)
  //     } catch (err) {
  //       console.error(err)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }
  //   fetchDashboard()
  // }, [])

  const getGreeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const firstName = user?.name?.split(' ')[0] || 'Teacher'

  const statCards = [
    {
      label: 'Total Courses',
      value: stats.totalCourses,
      change: '+2 this month',
      positive: true,
      color: '#2563eb', bg: '#eff6ff',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#2563eb" strokeWidth="1.7" strokeLinecap="round"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="#2563eb" strokeWidth="1.7"/>
        </svg>
      )
    },
    {
      label: 'Total Students',
      value: stats.totalStudents,
      change: '+18 this week',
      positive: true,
      color: '#0d9488', bg: '#f0fdfa',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#0d9488" strokeWidth="1.7" strokeLinecap="round"/>
          <circle cx="9" cy="7" r="4" stroke="#0d9488" strokeWidth="1.7"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="#0d9488" strokeWidth="1.7" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      label: 'Pending Reviews',
      value: stats.pendingAssignments,
      change: 'Assignments to grade',
      positive: false,
      color: '#f59e0b', bg: '#fffbeb',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#f59e0b" strokeWidth="1.7"/>
          <polyline points="14 2 14 8 20 8" stroke="#f59e0b" strokeWidth="1.7" strokeLinejoin="round"/>
          <path d="M9 13h6M9 17h4" stroke="#f59e0b" strokeWidth="1.7" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      label: 'Avg. Completion',
      value: `${stats.avgCompletion}%`,
      change: '+4% from last week',
      positive: true,
      color: '#8b5cf6', bg: '#f5f3ff',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <line x1="18" y1="20" x2="18" y2="10" stroke="#8b5cf6" strokeWidth="1.7" strokeLinecap="round"/>
          <line x1="12" y1="20" x2="12" y2="4" stroke="#8b5cf6" strokeWidth="1.7" strokeLinecap="round"/>
          <line x1="6" y1="20" x2="6" y2="14" stroke="#8b5cf6" strokeWidth="1.7" strokeLinecap="round"/>
        </svg>
      )
    },
  ]

  return (
    <MainLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif' }}>

        {/* ── Page Header ── */}
        <div style={{
          display: 'flex', alignItems: 'flex-start',
          justifyContent: 'space-between', marginBottom: '28px',
          flexWrap: 'wrap', gap: '16px'
        }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>
              {getGreeting()}, {firstName} 👋
            </h1>
            <p style={{ fontSize: '13px', color: '#64748b' }}>
              Here's what's happening in your classroom today.
            </p>
          </div>
          <button
            onClick={() => navigate('/create-course')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: 'white', border: 'none', borderRadius: '12px',
              fontSize: '13px', fontWeight: '600', cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
              fontFamily: 'inherit', transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(37,99,235,0.45)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 14px rgba(37,99,235,0.3)'}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <line x1="12" y1="5" x2="12" y2="19" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="5" y1="12" x2="19" y2="12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            Create New Course
          </button>
        </div>

        {/* ── Stat Cards ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginBottom: '24px'
        }}>
          {statCards.map(s => <StatCard key={s.label} {...s} />)}
        </div>

        {/* ── Bottom Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>

          {/* ── Courses Table ── */}
          <div style={{
            background: 'white', borderRadius: '16px',
            border: '1px solid #e2e8f0', overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 22px', borderBottom: '1px solid #f1f5f9'
            }}>
              <div>
                <h2 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>
                  My Courses
                </h2>
                <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                  {courses.length} courses this semester
                </p>
              </div>
              <button
                onClick={() => navigate('/my-courses')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  fontSize: '12px', fontWeight: '600', color: '#2563eb',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'inherit', padding: 0
                }}
              >
                View all
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <polyline points="9 18 15 12 9 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Course rows */}
            {courses.map((course, i) => (
              <CourseRow
                key={course.id}
                course={course}
                isLast={i === courses.length - 1}
              />
            ))}
          </div>

          {/* ── Right Column ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Quick Actions */}
            <div style={{
              background: 'white', borderRadius: '16px',
              border: '1px solid #e2e8f0', padding: '18px'
            }}>
              <h2 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>
                Quick Actions
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { label: 'Upload New Lecture', color: '#2563eb', bg: '#eff6ff', border: '#dbeafe', onClick: () => navigate('/my-courses') },
                  { label: 'Create Assignment', color: '#0d9488', bg: '#f0fdfa', border: '#ccfbf1', onClick: () => navigate('/assignments') },
                  { label: 'Schedule Live Class', color: '#8b5cf6', bg: '#f5f3ff', border: '#ede9fe', soon: true },
                ].map(a => (
                  <QuickAction key={a.label} {...a} />
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            <div style={{
              background: 'white', borderRadius: '16px',
              border: '1px solid #e2e8f0', padding: '18px', flex: 1
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h2 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
                  Recent Activity
                </h2>
                <span style={{
                  fontSize: '10px', fontWeight: '700',
                  background: '#fef2f2', color: '#ef4444',
                  padding: '3px 8px', borderRadius: '999px',
                  display: 'flex', alignItems: 'center', gap: '4px'
                }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }}/>
                  Live
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {activity.map((a, i) => (
                  <div key={a.id} style={{
                    display: 'flex', gap: '10px', paddingTop: '10px', paddingBottom: '10px',
                    borderBottom: i < activity.length - 1 ? '1px solid #f8fafc' : 'none'
                  }}>
                    <ActivityDot type={a.type} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '12px', color: '#374151', lineHeight: '1.5', marginBottom: '2px' }}>
                        {a.text}
                      </p>
                      <p style={{ fontSize: '11px', color: '#94a3b8' }}>{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  )
}

// ── Course Row Component ──
const CourseRow = ({ course, isLast }) => {
  const [hovered, setHovered] = useState(false)

  const progressColor = course.completion >= 75
    ? '#0d9488'
    : course.completion >= 50
    ? '#2563eb'
    : '#f59e0b'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '14px',
        padding: '14px 22px',
        borderBottom: isLast ? 'none' : '1px solid #f8fafc',
        background: hovered ? '#fafafa' : 'white',
        transition: 'background 0.15s'
      }}
    >
      {/* Icon */}
      <div style={{
        width: '42px', height: '42px', borderRadius: '12px',
        background: '#f0f9ff', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontSize: '20px', flexShrink: 0
      }}>
        {course.subject}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <p style={{
            fontSize: '13px', fontWeight: '600', color: '#0f172a',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
          }}>
            {course.title}
          </p>
          <span style={{
            fontSize: '10px', fontWeight: '600', padding: '2px 8px',
            borderRadius: '999px', flexShrink: 0,
            background: course.status === 'active' ? '#f0fdf4' : '#f8fafc',
            color: course.status === 'active' ? '#16a34a' : '#94a3b8',
          }}>
            {course.status === 'active' ? 'Active' : 'Draft'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>
            {course.students} students
          </span>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>
            {course.lectures} lectures
          </span>
        </div>
      </div>

      {/* Progress */}
      <div style={{ width: '90px', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span style={{ fontSize: '10px', color: '#94a3b8' }}>Progress</span>
          <span style={{ fontSize: '10px', fontWeight: '600', color: '#0f172a' }}>
            {course.completion}%
          </span>
        </div>
        <div style={{ height: '4px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${course.completion}%`,
            background: progressColor, borderRadius: '999px',
            transition: 'width 0.6s ease'
          }}/>
        </div>
      </div>

      {/* Manage button */}
      <ManageButton />
    </div>
  )
}

const ManageButton = () => {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '6px 14px', borderRadius: '8px', flexShrink: 0,
        border: hovered ? '1px solid #2563eb' : '1px solid #e2e8f0',
        background: hovered ? '#eff6ff' : 'white',
        fontSize: '12px', fontWeight: '500',
        color: hovered ? '#2563eb' : '#374151',
        cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s'
      }}
    >
      Manage
    </button>
  )
}

const QuickAction = ({ label, color, bg, border, soon, onClick }) => {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={soon ? undefined : onClick}
      onMouseEnter={() => !soon && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '11px 14px', borderRadius: '10px', width: '100%',
        border: `1px solid ${hovered ? color : border}`,
        background: hovered ? bg : bg,
        cursor: soon ? 'default' : 'pointer',
        fontFamily: 'inherit', transition: 'all 0.15s',
        opacity: soon ? 0.6 : 1
      }}
    >
      <span style={{ fontSize: '13px', fontWeight: '500', color }}>{label}</span>
      {soon
        ? <span style={{
            fontSize: '10px', fontWeight: '600', color: '#94a3b8',
            background: '#f1f5f9', padding: '2px 7px', borderRadius: '999px'
          }}>Soon</span>
        : <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <polyline points="9 18 15 12 9 6" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
      }
    </button>
  )
}

export default TeacherDashboard