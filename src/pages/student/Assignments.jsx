import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { getStudentAssignments, submitAssignment, apiError } from '../../services/studentService'

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   bg: '#fff7ed', color: '#ea580c', dot: '#f97316', border: '#fed7aa' },
  submitted: { label: 'Submitted', bg: '#f0fdf4', color: '#16a34a', dot: '#22c55e', border: '#bbf7d0' },
  graded:    { label: 'Graded',    bg: '#eff6ff', color: '#2563eb', dot: '#3b82f6', border: '#bfdbfe' },
  overdue:   { label: 'Overdue',   bg: '#fef2f2', color: '#dc2626', dot: '#ef4444', border: '#fecaca' },
}

const getDaysLeft = (due) => {
  if (!due) return null
  return Math.ceil((new Date(due) - new Date()) / (1000 * 60 * 60 * 24))
}

function AssignmentCard({ assignment, onSubmit }) {
  const status = assignment.status || 'pending'
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending
  const daysLeft = getDaysLeft(assignment.dueDate)
  const [expanded, setExpanded] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [text, setText] = useState('')

  const handleSubmit = async () => {
    if (!text.trim()) return
    setSubmitting(true)
    try { await onSubmit(assignment._id, text); setText(''); setExpanded(false) }
    finally { setSubmitting(false) }
  }

  const dueLabel = daysLeft === null ? '' :
    daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` :
    daysLeft === 0 ? 'Due today' : `${daysLeft}d left`

  const dueColor = daysLeft !== null && daysLeft < 0 ? '#ef4444' :
    daysLeft === 0 ? '#d97706' : '#64748b'

  return (
    <div style={{
      background: '#fff', borderRadius: '16px',
      border: '1px solid #f0f0f0',
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      overflow: 'hidden', transition: 'box-shadow 0.2s, transform 0.2s'
    }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      {/* Colour strip */}
      <div style={{ height: '4px', background: cfg.dot }}/>

      <div style={{ padding: '20px 22px' }}>
        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
          <div style={{ flex: 1 }}>
            {/* Badges row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                fontSize: '11px', fontWeight: '700',
                padding: '3px 10px', borderRadius: '999px',
                background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: cfg.dot, display: 'inline-block' }}/>
                {cfg.label}
              </span>
              {assignment.course && (
                <span style={{ fontSize: '11px', color: '#6366f1', fontWeight: '600', background: '#f5f3ff', padding: '3px 10px', borderRadius: '999px' }}>
                  {assignment.course}
                </span>
              )}
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '5px', lineHeight: 1.3 }}>
              {assignment.title}
            </h3>
            {assignment.description && (
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>{assignment.description}</p>
            )}
          </div>

          {/* Grade badge */}
          {assignment.grade != null && (
            <div style={{
              textAlign: 'center', flexShrink: 0,
              background: '#eff6ff', borderRadius: '14px', padding: '10px 16px',
              border: '1.5px solid #bfdbfe'
            }}>
              <p style={{ fontSize: '22px', fontWeight: '900', color: '#2563eb', lineHeight: 1 }}>{assignment.grade}</p>
              <p style={{ fontSize: '10px', color: '#93c5fd', fontWeight: '600', marginTop: '2px' }}>/ {assignment.totalMarks || 100}</p>
            </div>
          )}
        </div>

        {/* Your submission */}
        {assignment.content && status !== 'pending' && (
          <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '10px 14px', marginBottom: '12px', border: '1px solid #f1f5f9' }}>
            <p style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your submission</p>
            <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{assignment.content}</p>
          </div>
        )}

        {/* Feedback */}
        {assignment.feedback && (
          <div style={{
            background: '#f5f3ff', borderRadius: '10px', padding: '10px 14px',
            marginBottom: '12px', border: '1px solid #ede9fe'
          }}>
            <p style={{ fontSize: '11px', fontWeight: '700', color: '#7c3aed', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Instructor Feedback</p>
            <p style={{ fontSize: '13px', color: '#4c1d95', lineHeight: 1.5, fontStyle: 'italic' }}>"{assignment.feedback}"</p>
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #f8fafc' }}>
          {assignment.dueDate && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="3" stroke={dueColor} strokeWidth="2"/>
                <path d="M8 2v4M16 2v4M3 10h18" stroke={dueColor} strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span style={{ fontSize: '12px', fontWeight: '600', color: dueColor }}>{dueLabel}</span>
            </div>
          )}
          {status === 'pending' && (
            <button onClick={() => setExpanded(!expanded)} style={{
              padding: '8px 20px',
              background: expanded ? '#f8fafc' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: expanded ? '#64748b' : '#fff',
              border: expanded ? '1px solid #e2e8f0' : 'none',
              borderRadius: '10px', fontSize: '13px', fontWeight: '600',
              cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit'
            }}>
              {expanded ? 'Cancel' : '+ Submit'}
            </button>
          )}
        </div>

        {/* Submission panel */}
        {expanded && (
          <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
            <textarea
              value={text} onChange={e => setText(e.target.value)}
              placeholder="Write your answer or paste a link here..."
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
                padding: '10px 24px',
                background: submitting || !text.trim() ? '#c7d2fe' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff', border: 'none', borderRadius: '10px',
                fontSize: '13px', fontWeight: '600',
                cursor: submitting || !text.trim() ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit'
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
  const [error, setError] = useState('')

  useEffect(() => {
    getStudentAssignments()
      .then(setAssignments)
      .catch(err => setError(apiError(err, 'Could not load assignments. Is the server running?')))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (id, content) => {
    try {
      await submitAssignment(id, content)
      setAssignments(prev => prev.map(a =>
        a._id === id ? { ...a, status: 'submitted', content, submittedAt: new Date().toISOString() } : a
      ))
      toast.success('Assignment submitted!')
    } catch (err) {
      toast.error(apiError(err, 'Submission failed. Try again.'))
    }
  }

  const counts = {
    pending: assignments.filter(a => a.status === 'pending').length,
    submitted: assignments.filter(a => a.status === 'submitted').length,
    graded: assignments.filter(a => a.status === 'graded').length,
    overdue: assignments.filter(a => a.status === 'overdue').length,
  }

  const FILTERS = [
    { key: 'all', label: 'All', count: assignments.length },
    { key: 'pending', label: 'Pending', count: counts.pending },
    { key: 'submitted', label: 'Submitted', count: counts.submitted },
    { key: 'graded', label: 'Graded', count: counts.graded },
    { key: 'overdue', label: 'Overdue', count: counts.overdue },
  ]

  const filtered = filter === 'all' ? assignments : assignments.filter(a => a.status === filter)

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: '12px' }}>
      <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '3px solid #ede9fe', borderTopColor: '#6366f1', animation: 'spin 0.8s linear infinite' }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '4px' }}>
          Assignments
        </h1>
        <p style={{ fontSize: '14px', color: '#94a3b8' }}>
          {counts.pending} pending · {counts.submitted} submitted · {counts.graded} graded
        </p>
      </div>

      {/* Summary strip */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px'
      }}>
        {[
          { label: 'Pending',   val: counts.pending,   color: '#f97316', bg: '#fff7ed', border: '#fed7aa' },
          { label: 'Submitted', val: counts.submitted, color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
          { label: 'Graded',    val: counts.graded,    color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
          { label: 'Overdue',   val: counts.overdue,   color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
        ].map(s => (
          <div key={s.label} style={{
            background: s.bg, borderRadius: '14px', padding: '16px 18px',
            border: `1px solid ${s.border}`, textAlign: 'center'
          }}>
            <p style={{ fontSize: '26px', fontWeight: '800', color: s.color, lineHeight: 1, marginBottom: '4px' }}>{s.val}</p>
            <p style={{ fontSize: '12px', fontWeight: '600', color: s.color, opacity: 0.7 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{
        display: 'flex', gap: '6px', marginBottom: '24px',
        background: '#fff', padding: '5px', borderRadius: '12px',
        border: '1px solid #f1f5f9', width: 'fit-content',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
      }}>
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            padding: '7px 16px',
            background: filter === f.key ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
            color: filter === f.key ? '#fff' : '#64748b',
            border: 'none', borderRadius: '8px',
            fontSize: '13px', fontWeight: '600',
            cursor: 'pointer', transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', gap: '6px',
            fontFamily: 'inherit'
          }}>
            {f.label}
            {f.count > 0 && (
              <span style={{
                fontSize: '11px', padding: '1px 7px', borderRadius: '999px',
                background: filter === f.key ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                color: filter === f.key ? '#fff' : '#64748b'
              }}>{f.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div style={{
          background: '#fff', borderRadius: '16px', border: '1px dashed #e2e8f0',
          padding: '64px 24px', textAlign: 'center'
        }}>
          <div style={{ fontSize: '44px', marginBottom: '14px', opacity: 0.35 }}>📭</div>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>No assignments here</h3>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>
            {error || (filter === 'all' ? 'Assignments from your enrolled courses will appear here.' : `No ${filter} assignments.`)}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filtered.map(a => <AssignmentCard key={a._id} assignment={a} onSubmit={handleSubmit}/>)}
        </div>
      )}
    </div>
  )
}
