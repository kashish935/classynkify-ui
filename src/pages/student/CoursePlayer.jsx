// src/pages/student/CoursePlayer.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../../api/axiosInstance'
import LessonSidebar from '../../components/student/LessonSidebar'

export default function CoursePlayer() {
  const { courseId } = useParams()   // ← fixed: was `id`
  const navigate = useNavigate()

  const [course, setCourse]           = useState(null)
  const [loading, setLoading]         = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const [completedSet, setCompletedSet] = useState(new Set())
  const [marking, setMarking]         = useState(false)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await api.get(`/student/courses/${courseId}`)
        setCourse(data.course)
        setCompletedSet(new Set(data.completedLessonIds ?? []))
      } catch {
        toast.error('Failed to load course')
        navigate('/student/dashboard')
      } finally {
        setLoading(false)
      }
    }
    fetchCourse()
  }, [courseId])

  const activeLesson = course?.lessons[activeIndex]

  const handleMarkComplete = async () => {
    if (marking) return
    const lessonId  = activeLesson._id
    const nowDone   = !completedSet.has(lessonId)

    // Optimistic update
    setCompletedSet(prev => {
      const next = new Set(prev)
      nowDone ? next.add(lessonId) : next.delete(lessonId)
      return next
    })

    try {
      setMarking(true)
      await api.post(`/student/courses/${courseId}/lessons/${lessonId}/complete`, {
        completed: nowDone,
      })
    } catch {
      // Rollback on failure
      setCompletedSet(prev => {
        const next = new Set(prev)
        nowDone ? next.delete(lessonId) : next.add(lessonId)
        return next
      })
      toast.error('Could not update progress')
    } finally {
      setMarking(false)
    }
  }

  const goNext = () => { if (activeIndex < course.lessons.length - 1) setActiveIndex(i => i + 1) }
  const goPrev = () => { if (activeIndex > 0) setActiveIndex(i => i - 1) }

  const progressPercent = course
    ? Math.round((completedSet.size / course.lessons.length) * 100)
    : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm animate-pulse">
        Loading course...
      </div>
    )
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="text-sm text-indigo-600 hover:underline"
          >
            ← Dashboard
          </button>
          <span className="text-gray-300">|</span>
          <h1 className="text-sm font-semibold text-gray-800">{course.title}</h1>
          <span className="text-xs text-gray-400">by {course.instructor}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 font-medium">{progressPercent}%</span>
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">

        {/* Video + details */}
        <div className="flex flex-col flex-1 overflow-y-auto bg-gray-50 p-6 gap-5">
          <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
            <iframe
              key={activeLesson._id}
              src={activeLesson.videoUrl}
              title={activeLesson.title}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="text-xs text-indigo-500 font-semibold uppercase tracking-wide mb-1">
                  Lesson {activeIndex + 1} of {course.lessons.length}
                </p>
                <h2 className="text-xl font-bold text-gray-900">{activeLesson.title}</h2>
                <p className="text-sm text-gray-500 mt-1">{activeLesson.description}</p>
              </div>
              <button
                onClick={handleMarkComplete}
                disabled={marking}
                className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60
                  ${completedSet.has(activeLesson._id)
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
              >
                {completedSet.has(activeLesson._id) ? '✓ Completed' : 'Mark as Complete'}
              </button>
            </div>

            <div className="flex gap-3 mt-5 pt-5 border-t border-gray-100">
              <button onClick={goPrev} disabled={activeIndex === 0}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600
                  hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                ← Previous
              </button>
              <button onClick={goNext} disabled={activeIndex === course.lessons.length - 1}
                className="flex-1 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium
                  hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-72 shrink-0 overflow-hidden flex flex-col border-l border-gray-200">
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