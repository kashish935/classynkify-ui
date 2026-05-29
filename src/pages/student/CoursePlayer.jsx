// // src/pages/student/CoursePlayer.jsx
// import { useState, useEffect } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import { toast } from 'react-toastify'
// import api from '../../api/axiosInstance'
// import LessonSidebar from '../../components/student/LessonSidebar'

// export default function CoursePlayer() {
//   const { courseId } = useParams()   // ← fixed: was `id`
//   const navigate = useNavigate()

//   const [course, setCourse]           = useState(null)
//   const [loading, setLoading]         = useState(true)
//   const [activeIndex, setActiveIndex] = useState(0)
//   const [completedSet, setCompletedSet] = useState(new Set())
//   const [marking, setMarking]         = useState(false)

//   useEffect(() => {
//     const fetchCourse = async () => {
//       try {
//         const { data } = await api.get(`/student/courses/${courseId}`)
//         setCourse(data.course)
//         setCompletedSet(new Set(data.completedLessonIds ?? []))
//       } catch {
//         toast.error('Failed to load course')
//         navigate('/student/dashboard')
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchCourse()
//   }, [courseId])

//   const activeLesson = course?.lessons[activeIndex]

//   const handleMarkComplete = async () => {
//     if (marking) return
//     const lessonId  = activeLesson._id
//     const nowDone   = !completedSet.has(lessonId)

//     // Optimistic update
//     setCompletedSet(prev => {
//       const next = new Set(prev)
//       nowDone ? next.add(lessonId) : next.delete(lessonId)
//       return next
//     })

//     try {
//       setMarking(true)
//       await api.post(`/student/courses/${courseId}/lessons/${lessonId}/complete`, {
//         completed: nowDone,
//       })
//     } catch {
//       // Rollback on failure
//       setCompletedSet(prev => {
//         const next = new Set(prev)
//         nowDone ? next.delete(lessonId) : next.add(lessonId)
//         return next
//       })
//       toast.error('Could not update progress')
//     } finally {
//       setMarking(false)
//     }
//   }

//   const goNext = () => { if (activeIndex < course.lessons.length - 1) setActiveIndex(i => i + 1) }
//   const goPrev = () => { if (activeIndex > 0) setActiveIndex(i => i - 1) }

//   const progressPercent = course
//     ? Math.round((completedSet.size / course.lessons.length) * 100)
//     : 0

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64 text-gray-400 text-sm animate-pulse">
//         Loading course...
//       </div>
//     )
//   }

//   return (
//     <div className="flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>

//       {/* Top bar */}
//       <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shrink-0">
//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => navigate('/student/dashboard')}
//             className="text-sm text-indigo-600 hover:underline"
//           >
//             ← Dashboard
//           </button>
//           <span className="text-gray-300">|</span>
//           <h1 className="text-sm font-semibold text-gray-800">{course.title}</h1>
//           <span className="text-xs text-gray-400">by {course.instructor}</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
//             <div
//               className="h-full bg-indigo-500 rounded-full transition-all duration-300"
//               style={{ width: `${progressPercent}%` }}
//             />
//           </div>
//           <span className="text-xs text-gray-500 font-medium">{progressPercent}%</span>
//         </div>
//       </div>

//       {/* Main */}
//       <div className="flex flex-1 overflow-hidden">

//         {/* Video + details */}
//         <div className="flex flex-col flex-1 overflow-y-auto bg-gray-50 p-6 gap-5">
//           <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
//             <iframe
//               key={activeLesson._id}
//               src={activeLesson.videoUrl}
//               title={activeLesson.title}
//               className="w-full h-full"
//               allowFullScreen
//               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//             />
//           </div>

//           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
//             <div className="flex items-start justify-between gap-4 flex-wrap">
//               <div>
//                 <p className="text-xs text-indigo-500 font-semibold uppercase tracking-wide mb-1">
//                   Lesson {activeIndex + 1} of {course.lessons.length}
//                 </p>
//                 <h2 className="text-xl font-bold text-gray-900">{activeLesson.title}</h2>
//                 <p className="text-sm text-gray-500 mt-1">{activeLesson.description}</p>
//               </div>
//               <button
//                 onClick={handleMarkComplete}
//                 disabled={marking}
//                 className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60
//                   ${completedSet.has(activeLesson._id)
//                     ? 'bg-green-100 text-green-700 hover:bg-green-200'
//                     : 'bg-indigo-600 text-white hover:bg-indigo-700'
//                   }`}
//               >
//                 {completedSet.has(activeLesson._id) ? '✓ Completed' : 'Mark as Complete'}
//               </button>
//             </div>

//             <div className="flex gap-3 mt-5 pt-5 border-t border-gray-100">
//               <button onClick={goPrev} disabled={activeIndex === 0}
//                 className="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600
//                   hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
//                 ← Previous
//               </button>
//               <button onClick={goNext} disabled={activeIndex === course.lessons.length - 1}
//                 className="flex-1 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium
//                   hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
//                 Next →
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Sidebar */}
//         <div className="w-72 shrink-0 overflow-hidden flex flex-col border-l border-gray-200">
//           <LessonSidebar
//             lessons={course.lessons}
//             activeIndex={activeIndex}
//             onSelect={setActiveIndex}
//             completedSet={completedSet}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../../api/axiosInstance'
import { getMockCourseForPlayer } from '../../data/staticData'

function LessonSidebar({ lessons, activeIndex, onSelect, completedSet }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      background: '#fff', borderLeft: '1px solid #e8ecf0'
    }}>
      {/* Sidebar header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', flexShrink: 0 }}>
        <h3 style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px' }}>
          Course Lessons
        </h3>
        <p style={{ fontSize: '12px', color: '#94a3b8' }}>
          {completedSet.size} / {lessons.length} completed
        </p>
        {/* Overall progress bar */}
        <div style={{ height: '4px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden', marginTop: '10px' }}>
          <div style={{
            height: '100%', borderRadius: '999px',
            width: `${Math.round((completedSet.size / lessons.length) * 100)}%`,
            background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
            transition: 'width 0.4s ease'
          }}/>
        </div>
      </div>

      {/* Lesson list */}
      <ul style={{ flex: 1, overflowY: 'auto', margin: 0, padding: '8px', listStyle: 'none' }}>
        {lessons.map((lesson, idx) => {
          const isActive = idx === activeIndex
          const isDone = completedSet.has(lesson._id)
          return (
            <li
              key={lesson._id}
              onClick={() => onSelect(idx)}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '10px',
                padding: '10px 12px', borderRadius: '10px', cursor: 'pointer',
                marginBottom: '2px',
                background: isActive ? '#f0f0ff' : 'transparent',
                borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent',
                transition: 'all 0.15s'
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#f8fafc' }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
            >
              {/* Status circle */}
              <div style={{ marginTop: '1px', flexShrink: 0 }}>
                {isDone ? (
                  <div style={{
                    width: '22px', height: '22px', borderRadius: '50%',
                    background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                      <polyline points="20 6 9 17 4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                ) : (
                  <div style={{
                    width: '22px', height: '22px', borderRadius: '50%',
                    border: `2px solid ${isActive ? '#6366f1' : '#e2e8f0'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '10px', fontWeight: '700',
                    color: isActive ? '#6366f1' : '#94a3b8'
                  }}>{idx + 1}</div>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: '13px', fontWeight: isActive ? '700' : '500',
                  color: isActive ? '#3730a3' : '#374151',
                  lineHeight: 1.3, marginBottom: '2px',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }}>{lesson.title}</p>
                <p style={{ fontSize: '11px', color: '#94a3b8' }}>{lesson.duration}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default function CoursePlayer() {
  const { courseId } = useParams()
  const navigate = useNavigate()

  const [course, setCourse]               = useState(null)
  const [loading, setLoading]             = useState(true)
  const [activeIndex, setActiveIndex]     = useState(0)
  const [completedSet, setCompletedSet]   = useState(new Set())
  const [marking, setMarking]             = useState(false)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await api.get(`/student/courses/${courseId}`)
        setCourse(data.course)
        setCompletedSet(new Set(data.completedLessonIds ?? []))
      } catch {
        const fallback = getMockCourseForPlayer(courseId)
        if (fallback) {
          setCourse(fallback.course)
          setCompletedSet(new Set(fallback.completedLessonIds))
        } else {
          toast.error('Course not found')
          navigate('/student/dashboard')
        }
      } finally { setLoading(false) }
    }
    fetchCourse()
  }, [courseId])

  const activeLesson = course?.lessons[activeIndex]

  const handleMarkComplete = async () => {
    if (marking) return
    const lessonId = activeLesson._id
    const nowDone  = !completedSet.has(lessonId)
    setCompletedSet(prev => {
      const next = new Set(prev)
      nowDone ? next.add(lessonId) : next.delete(lessonId)
      return next
    })
    try {
      setMarking(true)
      await api.post(`/student/courses/${courseId}/lessons/${lessonId}/complete`, { completed: nowDone })
    } catch {
      setCompletedSet(prev => {
        const next = new Set(prev)
        nowDone ? next.delete(lessonId) : next.add(lessonId)
        return next
      })
      toast.error('Could not update progress')
    } finally { setMarking(false) }
  }

  const goNext = () => { if (activeIndex < course.lessons.length - 1) setActiveIndex(i => i + 1) }
  const goPrev = () => { if (activeIndex > 0) setActiveIndex(i => i - 1) }

  const progressPct = course ? Math.round((completedSet.size / course.lessons.length) * 100) : 0
  const isDone = activeLesson && completedSet.has(activeLesson._id)

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '12px', background: '#f8fafc' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #ede9fe', borderTopColor: '#6366f1', animation: 'spin 0.8s linear infinite' }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <p style={{ color: '#94a3b8', fontSize: '14px' }}>Loading course…</p>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: "'DM Sans', system-ui, sans-serif", background: '#0f172a' }}>

      {/* ── Top bar ── */}
      <div style={{
        height: '60px', background: '#1e293b',
        borderBottom: '1px solid #334155',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate('/student/dashboard')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '7px 14px', borderRadius: '8px',
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#94a3b8', fontSize: '13px', fontWeight: '500',
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <polyline points="15 18 9 12 15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Dashboard
          </button>
          <div style={{ width: '1px', height: '20px', background: '#334155' }}/>
          <div>
            <h1 style={{ fontSize: '14px', fontWeight: '700', color: '#f1f5f9', margin: 0 }}>{course.title}</h1>
            <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>by {course.instructor}</p>
          </div>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '12px', color: '#64748b' }}>{completedSet.size}/{course.lessons.length} lessons</span>
          <div style={{ width: '120px', height: '6px', background: '#334155', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${progressPct}%`,
              background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
              borderRadius: '999px', transition: 'width 0.4s ease'
            }}/>
          </div>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#a5b4fc' }}>{progressPct}%</span>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ── Video + info ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#0f172a' }}>

          {/* Video */}
          <div style={{ flex: 1, background: '#000', overflow: 'hidden' }}>
            <iframe
              key={activeLesson._id}
              src={activeLesson.videoUrl}
              title={activeLesson.title}
              style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>

          {/* Lesson info panel */}
          <div style={{
            background: '#1e293b', borderTop: '1px solid #334155',
            padding: '16px 24px', flexShrink: 0
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontSize: '11px', color: '#6366f1', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px' }}>
                  Lesson {activeIndex + 1} of {course.lessons.length}
                </p>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#f1f5f9', marginBottom: '4px' }}>{activeLesson.title}</h2>
                <p style={{ fontSize: '13px', color: '#64748b' }}>{activeLesson.description}</p>
              </div>

              {/* Mark complete */}
              <button
                onClick={handleMarkComplete}
                disabled={marking}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 20px', borderRadius: '12px',
                  border: 'none', cursor: marking ? 'not-allowed' : 'pointer',
                  fontSize: '13px', fontWeight: '700', fontFamily: 'inherit',
                  background: isDone ? '#166534' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: '#fff', opacity: marking ? 0.7 : 1,
                  transition: 'all 0.2s',
                  boxShadow: isDone ? 'none' : '0 4px 14px rgba(99,102,241,0.4)',
                  flexShrink: 0
                }}
              >
                {isDone ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <polyline points="20 6 9 17 4 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Completed
                  </>
                ) : 'Mark as Complete'}
              </button>
            </div>

            {/* Prev / Next */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
              <button onClick={goPrev} disabled={activeIndex === 0} style={{
                flex: 1, padding: '10px', borderRadius: '10px',
                border: '1px solid #334155', background: 'transparent',
                fontSize: '13px', fontWeight: '600', color: activeIndex === 0 ? '#475569' : '#94a3b8',
                cursor: activeIndex === 0 ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', transition: 'all 0.15s'
              }}
              onMouseEnter={e => { if (activeIndex > 0) e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#a5b4fc' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#334155'; e.currentTarget.style.color = activeIndex === 0 ? '#475569' : '#94a3b8' }}
              >
                ← Previous
              </button>
              <button onClick={goNext} disabled={activeIndex === course.lessons.length - 1} style={{
                flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
                background: activeIndex === course.lessons.length - 1 ? '#334155' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                fontSize: '13px', fontWeight: '700', color: '#fff',
                cursor: activeIndex === course.lessons.length - 1 ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', transition: 'all 0.15s'
              }}>
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div style={{ width: '300px', flexShrink: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <LessonSidebar
            lessons={course.lessons}
            activeIndex={activeIndex}
            onSelect={setActiveIndex}
            completedSet={completedSet}
          />
        </div>
      </div>
    </div>
  )
}
