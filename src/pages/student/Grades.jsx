// src/pages/student/Grades.jsx
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import api from '../../api/axiosInstance'

function gradeLabel(score, total) {
  const pct = (score / total) * 100
  if (pct >= 90) return { label: 'A+', color: 'text-green-600' }
  if (pct >= 80) return { label: 'A',  color: 'text-green-500' }
  if (pct >= 70) return { label: 'B',  color: 'text-indigo-600' }
  if (pct >= 60) return { label: 'C',  color: 'text-amber-600' }
  if (pct >= 50) return { label: 'D',  color: 'text-orange-500' }
  return          { label: 'F',  color: 'text-red-600' }
}

export default function Grades() {
  const [grades, setGrades]       = useState([])
  const [summary, setSummary]     = useState(null)
  const [loading, setLoading]     = useState(true)
  const [activeTab, setActiveTab] = useState('all')   // course _id or 'all'
  const [courses, setCourses]     = useState([])

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/student/grades')
        // Expected shape: { grades: [...], summary: { average, totalAssignments, graded } }
        setGrades(data.grades)
        setSummary(data.summary)
        // Derive unique courses from grades
        const seen = new Map()
        data.grades.forEach(g => {
          if (!seen.has(g.courseId)) seen.set(g.courseId, g.courseName)
        })
        setCourses([...seen.entries()].map(([id, name]) => ({ id, name })))
      } catch {
        toast.error('Failed to load grades')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const displayed = activeTab === 'all'
    ? grades
    : grades.filter(g => g.courseId === activeTab)

  const scored    = displayed.filter(g => g.score != null)
  const avgScore  = scored.length
    ? Math.round(scored.reduce((s, g) => s + (g.score / g.totalMarks) * 100, 0) / scored.length)
    : null

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm animate-pulse">
        Loading grades...
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Grades</h1>
        <p className="text-sm text-gray-500 mt-1">
          {summary?.graded ?? 0} of {summary?.totalAssignments ?? 0} assignments graded
        </p>
      </div>

      {/* Summary cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Overall Average', value: `${summary.average ?? '--'}%`, color: 'text-indigo-600' },
            { label: 'Assignments',     value: summary.totalAssignments,       color: 'text-gray-800' },
            { label: 'Graded',          value: summary.graded,                 color: 'text-green-600' },
            { label: 'Pending',         value: summary.totalAssignments - summary.graded, color: 'text-amber-600' },
          ].map(card => (
            <div key={card.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
              <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
              <p className="text-xs text-gray-400 mt-1">{card.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Course filter tabs */}
      {courses.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[{ id: 'all', name: 'All Courses' }, ...courses].map(c => (
            <button
              key={c.id}
              onClick={() => setActiveTab(c.id)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors
                ${activeTab === c.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Grades table */}
      {displayed.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📊</p>
          <p className="text-sm">No grades available yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Filtered avg bar */}
          {avgScore !== null && (
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-gray-50">
              <span className="text-xs text-gray-500 font-medium">
                Showing {displayed.length} assignment{displayed.length !== 1 ? 's' : ''}
              </span>
              <span className="text-xs font-semibold text-indigo-600">
                Average: {avgScore}%
              </span>
            </div>
          )}

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Assignment', 'Course', 'Submitted', 'Score', 'Grade'].map(h => (
                  <th
                    key={h}
                    className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-3"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {displayed.map(g => {
                const hasScore = g.score != null
                const { label, color } = hasScore
                  ? gradeLabel(g.score, g.totalMarks)
                  : { label: '—', color: 'text-gray-300' }
                const submittedDate = g.submittedAt
                  ? new Date(g.submittedAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })
                  : '—'

                return (
                  <tr key={g._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{g.assignmentTitle}</td>
                    <td className="px-6 py-4 text-gray-500">{g.courseName}</td>
                    <td className="px-6 py-4 text-gray-400 text-xs">{submittedDate}</td>
                    <td className="px-6 py-4">
                      {hasScore ? (
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-500 rounded-full"
                              style={{ width: `${(g.score / g.totalMarks) * 100}%` }}
                            />
                          </div>
                          <span className="text-gray-700 font-medium">
                            {g.score}/{g.totalMarks}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-300 text-xs">Not graded</span>
                      )}
                    </td>
                    <td className={`px-6 py-4 font-bold text-base ${color}`}>{label}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}