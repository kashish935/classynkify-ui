import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import axiosInstance from '../../api/axiosInstance'
import { toast } from 'react-toastify'

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   bg: '#fff7ed', color: '#ea580c', dot: '#f97316' },
  submitted: { label: 'Submitted', bg: '#f0fdf4', color: '#16a34a', dot: '#22c55e' },
  graded:    { label: 'Graded',    bg: '#eff6ff', color: '#2563eb', dot: '#3b82f6' },
  overdue:   { label: 'Overdue',   bg: '#fef2f2', color: '#dc2626', dot: '#ef4444' },
}

const getDaysLeft = (due) => {
  if (!due) return null
  const diff = Math.ceil((new Date(due) - new Date()) / (1000 * 60 * 60 * 24))
  return diff
}

const AssignmentCard = ({ assignment, onSubmit }) => {
  const status = assignment.status || 'pending'
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending
  const daysLeft = getDaysLeft(assignment.dueDate)
  const [expanded, setExpanded] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [text, setText] = useState('')

  const handleSubmit = async () => {
    if (!text.trim()) return
    setSubmitting(true)
    try {
      await onSubmit(assignment._id, text)
      setText('')
      setExpanded(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{
      background: '#fff',
      borderRadius: '20px',
      border: '1px solid #f1f5f9',
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      overflow: 'hidden',
      transition: 'box-shadow 0.2s',
    }}>
      {/* Top accent */}
      <div style={{ height: '4px', background: cfg.dot }} />

      <div style={{ padding: '22px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{
                fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em',
                padding: '3px 10px', borderRadius: '999px',
                background: cfg.bg, color: cfg.color
              }}>
                <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: cfg.dot, marginRight: '5px', verticalAlign: 'middle' }} />
                {cfg.label}
              </span>
              {assignment.course && (
                <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>
                  {assignment.course}
                </span>
              )}
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '6px', lineHeight: 1.3 }}>
              {assignment.title || 'Untitled Assignment'}
            </h3>

            {assignment.description && (
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>
                {assignment.description}
              </p>
            )}
          </div>

          {assignment.grade != null && (
            <div style={{
              textAlign: 'center', flexShrink: 0,
              background: '#eff6ff', borderRadius: '14px',
              padding: '10px 16px'
            }}>
              <p style={{ fontSize: '22px', fontWeight: '800', color: '#2563eb', lineHeight: 1 }}>
                {assignment.grade}
              </p>
              <p style={{ fontSize: '10px', color: '#93c5fd', fontWeight: '600', marginTop: '2px' }}>/ 100</p>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {assignment.dueDate && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="3" stroke="#94a3b8" strokeWidth="2"/>
                  <path d="M8 2v4M16 2v4M3 10h18" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span style={{ fontSize: '12px', color: daysLeft !== null && daysLeft < 0 ? '#ef4444' : '#64748b' }}>
                  {daysLeft !== null
                    ? daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : daysLeft === 0 ? 'Due today' : `${daysLeft}d left`
                    : new Date(assignment.dueDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          {status === 'pending' && (
            <button onClick={() => setExpanded(!expanded)} style={{
              padding: '8px 18px',
              background: expanded ? '#f8fafc' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: expanded ? '#64748b' : '#fff',
              border: expanded ? '1px solid #e2e8f0' : 'none',
              borderRadius: '10px', fontSize: '13px', fontWeight: '600',
              cursor: 'pointer', transition: 'all 0.2s'
            }}>
              {expanded ? 'Cancel' : 'Submit'}
            </button>
          )}
        </div>

        {/* Submission panel */}
        {expanded && (
          <div style={{ marginTop: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Write your answer or paste your submission link here..."
              rows={4}
              style={{
                width: '100%', padding: '12px 14px',
                background: '#f8fafc', border: '1.5px solid #e2e8f0',
                borderRadius: '12px', fontSize: '13px', color: '#0f172a',
                resize: 'vertical', outline: 'none', fontFamily: 'inherit',
                boxSizing: 'border-box', lineHeight: 1.6
              }}
              onFocus={e => e.target.style.borderColor = '#6366f1'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button onClick={handleSubmit} disabled={submitting || !text.trim()} style={{
                padding: '10px 22px',
                background: submitting || !text.trim() ? '#c7d2fe' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff', border: 'none', borderRadius: '10px',
                fontSize: '13px', fontWeight: '600',
                cursor: submitting || !text.trim() ? 'not-allowed' : 'pointer'
              }}>
                {submitting ? 'Submitting…' : 'Submit Assignment'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Assignments() {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    axiosInstance.get('/student/assignments')
      .then(res => setAssignments(res.data?.assignments || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (id, content) => {
    try {
      await axiosInstance.post(`/student/assignments/${id}/submit`, { content })
      setAssignments(prev => prev.map(a => a._id === id ? { ...a, status: 'submitted' } : a))
      toast.success('Assignment submitted!')
    } catch {
      toast.error('Submission failed. Try again.')
    }
  }

  const filters = ['all', 'pending', 'submitted', 'graded', 'overdue']
  const filtered = filter === 'all' ? assignments : assignments.filter(a => a.status === filter)

  const counts = {
    pending: assignments.filter(a => a.status === 'pending').length,
    submitted: assignments.filter(a => a.status === 'submitted').length,
    graded: assignments.filter(a => a.status === 'graded').length,
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: '12px' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #eef2ff', borderTopColor: '#6366f1', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  return (
    <div style={{ padding: '32px 40px', maxWidth: '900px', margin: '0 auto', fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '4px' }}>
          📋 Assignments
        </h1>
        <p style={{ fontSize: '14px', color: '#94a3b8' }}>
          {counts.pending} pending · {counts.submitted} submitted · {counts.graded} graded
        </p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '8px 18px',
            background: filter === f ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#fff',
            color: filter === f ? '#fff' : '#64748b',
            border: filter === f ? 'none' : '1px solid #e2e8f0',
            borderRadius: '10px', fontSize: '13px', fontWeight: '600',
            cursor: 'pointer', transition: 'all 0.2s',
            textTransform: 'capitalize'
          }}>
            {f}
            {f !== 'all' && assignments.filter(a => a.status === f).length > 0 && (
              <span style={{
                marginLeft: '6px', background: filter === f ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                color: filter === f ? '#fff' : '#64748b',
                borderRadius: '999px', padding: '1px 7px', fontSize: '11px'
              }}>
                {assignments.filter(a => a.status === f).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div style={{
          background: '#fff', borderRadius: '20px', border: '1px dashed #e2e8f0',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: '64px 24px', textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.4 }}>📭</div>
          <h3 style={{ fontSize: '17px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>No assignments here</h3>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>
            {filter === 'all' ? 'Your assignments will appear here once assigned.' : `No ${filter} assignments.`}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map(a => (
            <AssignmentCard key={a._id} assignment={a} onSubmit={handleSubmit} />
          ))}
        </div>
      )}
    </div>
  )
}