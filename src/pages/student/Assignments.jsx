import { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import api from '../../api/axiosInstance'

const STATUS_STYLES = {
  submitted: 'bg-green-100 text-green-700',
  pending:   'bg-amber-100  text-amber-700',
  overdue:   'bg-red-100   text-red-600',
  graded:    'bg-indigo-100 text-indigo-700',
}

const STATUS_LABEL = {
  submitted: 'Submitted',
  pending:   'Pending',
  overdue:   'Overdue',
  graded:    'Graded',
}

function statusOf(assignment) {
  if (assignment.grade != null)     return 'graded'
  if (assignment.submittedAt)       return 'submitted'
  if (new Date(assignment.dueDate) < new Date()) return 'overdue'
  return 'pending'
}

export default function Assignments() {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading]         = useState(true)
  const [uploading, setUploading]     = useState(null)   // assignment _id being uploaded
  const fileRefs = useRef({})                            // map of _id → input ref

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/student/assignments')
        setAssignments(data.assignments)
      } catch {
        toast.error('Failed to load assignments')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const handleSubmit = async (assignmentId, file) => {
    if (!file) return
    const form = new FormData()
    form.append('file', file)

    setUploading(assignmentId)
    try {
      const { data } = await api.post(
        `/student/assignments/${assignmentId}/submit`,
        form,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      // Update that specific assignment in state
      setAssignments(prev =>
        prev.map(a => a._id === assignmentId ? { ...a, ...data.assignment } : a)
      )
      toast.success('Assignment submitted!')
      // Reset file input
      if (fileRefs.current[assignmentId]) {
        fileRefs.current[assignmentId].value = ''
      }
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Submission failed')
    } finally {
      setUploading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm animate-pulse">
        Loading assignments...
      </div>
    )
  }

  const groups = {
    pending:   assignments.filter(a => statusOf(a) === 'pending'),
    overdue:   assignments.filter(a => statusOf(a) === 'overdue'),
    submitted: assignments.filter(a => statusOf(a) === 'submitted'),
    graded:    assignments.filter(a => statusOf(a) === 'graded'),
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
        <p className="text-sm text-gray-500 mt-1">
          {groups.pending.length + groups.overdue.length} pending ·{' '}
          {groups.submitted.length + groups.graded.length} submitted
        </p>
      </div>

      {assignments.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-sm">No assignments yet</p>
        </div>
      ) : (
        ['overdue', 'pending', 'submitted', 'graded'].map(status => {
          const list = groups[status]
          if (!list.length) return null
          return (
            <section key={status}>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                {STATUS_LABEL[status]}
              </h2>
              <div className="space-y-3">
                {list.map(a => (
                  <AssignmentCard
                    key={a._id}
                    assignment={a}
                    status={status}
                    uploading={uploading === a._id}
                    fileRef={el => (fileRefs.current[a._id] = el)}
                    onSubmit={handleSubmit}
                  />
                ))}
              </div>
            </section>
          )
        })
      )}
    </div>
  )
}

function AssignmentCard({ assignment: a, status, uploading, fileRef, onSubmit }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const canSubmit = status === 'pending' || status === 'overdue'

  const due = new Date(a.dueDate)
  const isOverdue = status === 'overdue'

  return (
    <div className={`bg-white rounded-xl border p-5 shadow-sm
      ${isOverdue ? 'border-red-200' : 'border-gray-100'}`}>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-semibold text-gray-900 truncate">{a.title}</h3>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[status]}`}>
              {STATUS_LABEL[status]}
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-1">{a.courseName}</p>
          <p className={`text-xs ${isOverdue ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
            Due: {due.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            {isOverdue && ' · OVERDUE'}
          </p>
          {a.description && (
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">{a.description}</p>
          )}
        </div>

        {/* Grade badge (if graded) */}
        {status === 'graded' && (
          <div className="text-center shrink-0">
            <p className="text-2xl font-bold text-indigo-600">{a.grade}</p>
            <p className="text-xs text-gray-400">/ {a.totalMarks ?? 100}</p>
          </div>
        )}
      </div>

      {/* Submitted file link */}
      {a.submissionUrl && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
          <span className="text-xs text-gray-400">Your submission:</span>
          <a
            href={a.submissionUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-indigo-600 hover:underline font-medium"
          >
            View file ↗
          </a>
        </div>
      )}

      {/* Upload area (pending / overdue) */}
      {canSubmit && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3 flex-wrap">
          <label className="flex-1 cursor-pointer">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed text-sm transition-colors
              ${selectedFile
                ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 bg-gray-50 text-gray-400 hover:border-indigo-300'
              }`}>
              <span>📎</span>
              <span className="truncate">
                {selectedFile ? selectedFile.name : 'Choose file to submit…'}
              </span>
            </div>
            <input
              type="file"
              className="hidden"
              ref={fileRef}
              onChange={e => setSelectedFile(e.target.files[0] ?? null)}
              accept=".pdf,.doc,.docx,.zip,.png,.jpg"
            />
          </label>

          <button
            onClick={() => onSubmit(a._id, selectedFile)}
            disabled={!selectedFile || uploading}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium
              hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            {uploading ? 'Uploading…' : 'Submit'}
          </button>
        </div>
      )}
    </div>
  )
}