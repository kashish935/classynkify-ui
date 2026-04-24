import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'

// ── Mock Data ──
const mockAssignments = [
  {
    _id: 'a1',
    title: 'Algebra Problem Set 1',
    course: { _id: '1', title: 'Mathematics — Grade 10' },
    description: 'Solve all 20 problems from Chapter 3. Show all working steps clearly.',
    dueDate: '2026-04-28',
    totalMarks: 100,
    status: 'active',
    submissions: [
      { _id: 's1', student: { name: 'Rohan Sharma', email: 'rohan@school.edu' }, submittedAt: '2026-04-20', content: 'My solutions are attached.', grade: null },
      { _id: 's2', student: { name: 'Priya Mehta', email: 'priya@school.edu' }, submittedAt: '2026-04-21', content: 'Completed all 20 problems.', grade: 88 },
      { _id: 's3', student: { name: 'Arjun Singh', email: 'arjun@school.edu' }, submittedAt: '2026-04-22', content: 'Done. Please check.', grade: null },
    ],
    createdAt: '2026-04-15',
  },
  {
    _id: 'a2',
    title: 'Newton\'s Laws — Lab Report',
    course: { _id: '2', title: 'Physics Fundamentals' },
    description: 'Write a detailed lab report on your observations from the pendulum experiment.',
    dueDate: '2026-04-30',
    totalMarks: 50,
    status: 'active',
    submissions: [
      { _id: 's4', student: { name: 'Sneha Patel', email: 'sneha@school.edu' }, submittedAt: '2026-04-22', content: 'Lab report attached.', grade: 45 },
    ],
    createdAt: '2026-04-16',
  },
  {
    _id: 'a3',
    title: 'Essay: To Kill a Mockingbird',
    course: { _id: '3', title: 'English Literature' },
    description: 'Write a 1000-word critical analysis essay on the themes of justice and morality.',
    dueDate: '2026-04-25',
    totalMarks: 80,
    status: 'active',
    submissions: [],
    createdAt: '2026-04-17',
  },
  {
    _id: 'a4',
    title: 'Periodic Table Quiz',
    course: { _id: '4', title: 'Chemistry Basics' },
    description: 'Fill in the first 20 elements of the periodic table with their symbols and atomic numbers.',
    dueDate: '2026-04-20',
    totalMarks: 40,
    status: 'closed',
    submissions: [
      { _id: 's5', student: { name: 'Rahul Kumar', email: 'rahul@school.edu' }, submittedAt: '2026-04-18', content: 'Completed.', grade: 36 },
      { _id: 's6', student: { name: 'Anjali Das', email: 'anjali@school.edu' }, submittedAt: '2026-04-19', content: 'Done.', grade: 40 },
    ],
    createdAt: '2026-04-10',
  },
]

const mockCourses = [
  { _id: '1', title: 'Mathematics — Grade 10' },
  { _id: '2', title: 'Physics Fundamentals' },
  { _id: '3', title: 'English Literature' },
  { _id: '4', title: 'Chemistry Basics' },
  { _id: '5', title: 'Computer Science — Grade 12' },
]

// ── Helpers ──
const getDaysLeft = (dueDate) => {
  const diff = new Date(dueDate) - new Date()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  return days
}

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

// ── Create Assignment Modal ──
const CreateModal = ({ courses, onSave, onCancel }) => {
  const [form, setForm] = useState({
    title: '', courseId: '', description: '', dueDate: '', totalMarks: '100'
  })
  const [focused, setFocused] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) { setError('Assignment title is required.'); return }
    if (!form.courseId) { setError('Please select a course.'); return }
    if (!form.dueDate) { setError('Please set a due date.'); return }
    if (!form.description.trim()) { setError('Please add a description.'); return }
    onSave(form)
  }

  const iStyle = (field) => ({
    width: '100%', padding: '11px 14px',
    background: focused === field ? '#fff' : '#f8fafc',
    border: `1.5px solid ${focused === field ? '#2563eb' : '#e2e8f0'}`,
    borderRadius: '10px', fontSize: '13px', color: '#0f172a',
    outline: 'none', transition: 'all 0.2s',
    fontFamily: 'Inter, system-ui, sans-serif', boxSizing: 'border-box'
  })

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, padding: '20px'
    }}>
      <div style={{
        background: 'white', borderRadius: '20px', padding: '28px',
        maxWidth: '520px', width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        maxHeight: '90vh', overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px', background: '#eff6ff',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#2563eb" strokeWidth="1.7"/>
                <polyline points="14,2 14,8 20,8" stroke="#2563eb" strokeWidth="1.7" strokeLinejoin="round"/>
                <line x1="9" y1="13" x2="15" y2="13" stroke="#2563eb" strokeWidth="1.7" strokeLinecap="round"/>
                <line x1="9" y1="17" x2="12" y2="17" stroke="#2563eb" strokeWidth="1.7" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>Create Assignment</h3>
              <p style={{ fontSize: '12px', color: '#94a3b8' }}>Fill in the details below</p>
            </div>
          </div>
          <button onClick={onCancel} style={{
            width: '32px', height: '32px', borderRadius: '8px',
            border: '1px solid #e2e8f0', background: 'white',
            cursor: 'pointer', color: '#64748b', fontSize: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>✕</button>
        </div>

        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px', background: '#fef2f2',
            border: '1px solid #fecaca', color: '#dc2626', fontSize: '12px',
            padding: '10px 14px', borderRadius: '10px', marginBottom: '16px'
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#dc2626" strokeWidth="2"/>
              <path d="M12 8v4M12 16h.01" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>
              Assignment Title <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input type="text" name="title" value={form.title} onChange={handleChange}
              onFocus={() => setFocused('title')} onBlur={() => setFocused('')}
              placeholder="e.g. Algebra Problem Set 1"
              style={iStyle('title')}
            />
          </div>

          {/* Course */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>
              Course <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select name="courseId" value={form.courseId} onChange={handleChange}
              onFocus={() => setFocused('courseId')} onBlur={() => setFocused('')}
              style={{ ...iStyle('courseId'), appearance: 'none', cursor: 'pointer' }}
            >
              <option value="">Select a course</option>
              {courses.map(c => (
                <option key={c._id} value={c._id}>{c.title}</option>
              ))}
            </select>
          </div>

          {/* Due date + Total marks */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>
                Due Date <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange}
                onFocus={() => setFocused('dueDate')} onBlur={() => setFocused('')}
                style={iStyle('dueDate')}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>
                Total Marks
              </label>
              <input type="number" name="totalMarks" value={form.totalMarks} onChange={handleChange}
                onFocus={() => setFocused('totalMarks')} onBlur={() => setFocused('')}
                placeholder="100" min="1" max="1000"
                style={iStyle('totalMarks')}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '5px' }}>
              Description <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <textarea name="description" value={form.description} onChange={handleChange}
              onFocus={() => setFocused('description')} onBlur={() => setFocused('')}
              placeholder="Describe what students need to do..."
              rows={4}
              style={{ ...iStyle('description'), resize: 'vertical', lineHeight: '1.6' }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
            <button type="button" onClick={onCancel} style={{
              flex: 1, padding: '12px', background: 'white', border: '1.5px solid #e2e8f0',
              borderRadius: '10px', fontSize: '13px', fontWeight: '600', color: '#374151',
              cursor: 'pointer', fontFamily: 'inherit'
            }}>Cancel</button>
            <button type="submit" style={{
              flex: 2, padding: '12px',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: 'white', border: 'none', borderRadius: '10px',
              fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: '0 4px 14px rgba(37,99,235,0.3)'
            }}>Create Assignment</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Grade Modal ──
const GradeModal = ({ submission, totalMarks, onSave, onCancel }) => {
  const [grade, setGrade] = useState(submission.grade ?? '')
  const [feedback, setFeedback] = useState('')
  const [focused, setFocused] = useState('')

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, padding: '20px'
    }}>
      <div style={{
        background: 'white', borderRadius: '20px', padding: '28px',
        maxWidth: '460px', width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: '#eff6ff', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '16px', fontWeight: '700', color: '#2563eb'
          }}>
            {submission.student.name.charAt(0)}
          </div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>
              Grade Submission
            </h3>
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>{submission.student.name}</p>
          </div>
        </div>

        {/* Submission content */}
        <div style={{
          background: '#f8fafc', borderRadius: '12px', padding: '14px',
          marginBottom: '18px'
        }}>
          <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Student's Submission
          </p>
          <p style={{ fontSize: '13px', color: '#374151', lineHeight: '1.6' }}>
            {submission.content}
          </p>
          <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '8px' }}>
            Submitted on {formatDate(submission.submittedAt)}
          </p>
        </div>

        {/* Grade input */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
            Grade (out of {totalMarks})
          </label>
          <input
            type="number" value={grade}
            onChange={e => setGrade(e.target.value)}
            onFocus={() => setFocused('grade')} onBlur={() => setFocused('')}
            placeholder={`0 – ${totalMarks}`}
            min="0" max={totalMarks}
            style={{
              width: '100%', padding: '11px 14px',
              background: focused === 'grade' ? '#fff' : '#f8fafc',
              border: `1.5px solid ${focused === 'grade' ? '#2563eb' : '#e2e8f0'}`,
              borderRadius: '10px', fontSize: '14px', fontWeight: '600', color: '#0f172a',
              outline: 'none', transition: 'all 0.2s',
              fontFamily: 'inherit', boxSizing: 'border-box'
            }}
          />
          {grade !== '' && (
            <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ flex: 1, height: '4px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: '999px', transition: 'width 0.3s',
                  width: `${Math.min(100, (grade / totalMarks) * 100)}%`,
                  background: grade / totalMarks >= 0.75 ? '#0d9488'
                    : grade / totalMarks >= 0.5 ? '#2563eb' : '#f59e0b'
                }}/>
              </div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>
                {Math.round((grade / totalMarks) * 100)}%
              </span>
            </div>
          )}
        </div>

        {/* Feedback */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
            Feedback <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '400' }}>(optional)</span>
          </label>
          <textarea value={feedback} onChange={e => setFeedback(e.target.value)}
            onFocus={() => setFocused('feedback')} onBlur={() => setFocused('')}
            placeholder="Add feedback for the student..."
            rows={3}
            style={{
              width: '100%', padding: '11px 14px',
              background: focused === 'feedback' ? '#fff' : '#f8fafc',
              border: `1.5px solid ${focused === 'feedback' ? '#2563eb' : '#e2e8f0'}`,
              borderRadius: '10px', fontSize: '13px', color: '#0f172a',
              outline: 'none', resize: 'vertical', lineHeight: '1.6',
              fontFamily: 'inherit', boxSizing: 'border-box', transition: 'all 0.2s'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: '12px', background: 'white', border: '1.5px solid #e2e8f0',
            borderRadius: '10px', fontSize: '13px', fontWeight: '600', color: '#374151',
            cursor: 'pointer', fontFamily: 'inherit'
          }}>Cancel</button>
          <button
            onClick={() => onSave(submission._id, Number(grade), feedback)}
            disabled={grade === ''}
            style={{
              flex: 2, padding: '12px',
              background: grade === '' ? '#e2e8f0' : 'linear-gradient(135deg, #0d9488, #0f766e)',
              color: grade === '' ? '#94a3b8' : 'white',
              border: 'none', borderRadius: '10px',
              fontSize: '13px', fontWeight: '600',
              cursor: grade === '' ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', transition: 'all 0.2s'
            }}>
            Save Grade
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Assignment Card ──
const AssignmentCard = ({ assignment, onViewSubmissions, onDelete, onToggleStatus }) => {
  const [hovered, setHovered] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const daysLeft = getDaysLeft(assignment.dueDate)
  const gradedCount = assignment.submissions.filter(s => s.grade !== null).length
  const ungradedCount = assignment.submissions.length - gradedCount

  const dueBadge = () => {
    if (assignment.status === 'closed') return { label: 'Closed', bg: '#f1f5f9', color: '#94a3b8' }
    if (daysLeft < 0) return { label: 'Overdue', bg: '#fef2f2', color: '#ef4444' }
    if (daysLeft === 0) return { label: 'Due today', bg: '#fef3c7', color: '#d97706' }
    if (daysLeft <= 3) return { label: `${daysLeft}d left`, bg: '#fef3c7', color: '#d97706' }
    return { label: `${daysLeft}d left`, bg: '#f0fdf4', color: '#16a34a' }
  }

  const badge = dueBadge()

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMenuOpen(false) }}
      style={{
        background: 'white', borderRadius: '16px',
        border: `1px solid ${hovered ? '#dbeafe' : '#e2e8f0'}`,
        padding: '20px', transition: 'all 0.2s',
        boxShadow: hovered ? '0 4px 20px rgba(37,99,235,0.07)' : 'none',
        position: 'relative'
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ flex: 1, minWidth: 0, paddingRight: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
            <h3 style={{
              fontSize: '14px', fontWeight: '700', color: '#0f172a',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
            }}>
              {assignment.title}
            </h3>
            <span style={{
              fontSize: '10px', fontWeight: '600', padding: '2px 8px',
              borderRadius: '999px', background: badge.bg, color: badge.color, flexShrink: 0
            }}>
              {badge.label}
            </span>
          </div>
          <p style={{ fontSize: '12px', color: '#2563eb', fontWeight: '500', marginBottom: '6px' }}>
            {assignment.course.title}
          </p>
          <p style={{
            fontSize: '12px', color: '#64748b', lineHeight: '1.5',
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden'
          }}>
            {assignment.description}
          </p>
        </div>

        {/* 3-dot menu */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{
            width: '30px', height: '30px', borderRadius: '8px',
            border: '1px solid #e2e8f0', background: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#64748b'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
            </svg>
          </button>
          {menuOpen && (
            <div style={{
              position: 'absolute', right: 0, top: '36px', background: 'white',
              border: '1px solid #e2e8f0', borderRadius: '12px', padding: '5px',
              minWidth: '170px', zIndex: 50, boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
            }}>
              <button onClick={() => { onToggleStatus(assignment._id); setMenuOpen(false) }}
                style={{
                  width: '100%', padding: '8px 10px', borderRadius: '8px', border: 'none',
                  background: 'transparent', cursor: 'pointer', fontSize: '12px',
                  color: '#374151', fontFamily: 'inherit', textAlign: 'left'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {assignment.status === 'active' ? 'Close Assignment' : 'Reopen Assignment'}
              </button>
              <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '3px', paddingTop: '3px' }}>
                <button onClick={() => { onDelete(assignment._id); setMenuOpen(false) }}
                  style={{
                    width: '100%', padding: '8px 10px', borderRadius: '8px', border: 'none',
                    background: 'transparent', cursor: 'pointer', fontSize: '12px',
                    color: '#ef4444', fontFamily: 'inherit', textAlign: 'left'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >Delete Assignment</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div style={{
        display: 'flex', gap: '8px', marginBottom: '14px',
        paddingTop: '12px', borderTop: '1px solid #f8fafc',
        flexWrap: 'wrap'
      }}>
        {[
          { label: `${assignment.submissions.length} Submissions`, bg: '#eff6ff', color: '#2563eb' },
          { label: `${gradedCount} Graded`, bg: '#f0fdf4', color: '#16a34a' },
          { label: ungradedCount > 0 ? `${ungradedCount} Pending` : 'All Graded', bg: ungradedCount > 0 ? '#fef3c7' : '#f0fdf4', color: ungradedCount > 0 ? '#d97706' : '#16a34a' },
          { label: `${assignment.totalMarks} Marks`, bg: '#f5f3ff', color: '#7c3aed' },
        ].map(s => (
          <span key={s.label} style={{
            fontSize: '11px', fontWeight: '500', padding: '3px 9px',
            borderRadius: '999px', background: s.bg, color: s.color
          }}>{s.label}</span>
        ))}
      </div>

      {/* Due date + button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '11px', color: '#94a3b8' }}>Due date</p>
          <p style={{ fontSize: '12px', fontWeight: '600', color: '#374151' }}>
            {formatDate(assignment.dueDate)}
          </p>
        </div>
        <button onClick={() => onViewSubmissions(assignment)}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '9px 16px',
            background: hovered ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : 'white',
            color: hovered ? 'white' : '#2563eb',
            border: '1.5px solid #2563eb', borderRadius: '10px',
            fontSize: '12px', fontWeight: '600', cursor: 'pointer',
            fontFamily: 'inherit', transition: 'all 0.2s'
          }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
            <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
          View Submissions
        </button>
      </div>
    </div>
  )
}

// ── Submissions Panel ──
const SubmissionsPanel = ({ assignment, onClose, onGrade }) => {
  const [gradeTarget, setGradeTarget] = useState(null)
  const [localSubs, setLocalSubs] = useState(assignment.submissions)

  const handleSaveGrade = (subId, grade, feedback) => {
    setLocalSubs(prev => prev.map(s => s._id === subId ? { ...s, grade } : s))
    setGradeTarget(null)
  }

  return (
    <>
      <div style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 90
      }} onClick={onClose}/>
      <div style={{
        position: 'fixed', right: 0, top: 0, bottom: 0,
        width: '480px', background: 'white', zIndex: 95,
        boxShadow: '-4px 0 40px rgba(0,0,0,0.12)',
        display: 'flex', flexDirection: 'column',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        {/* Panel header */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid #f1f5f9',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>
              Submissions
            </h2>
            <p style={{ fontSize: '12px', color: '#64748b' }}>
              {assignment.title}
            </p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <span style={{ fontSize: '11px', background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '999px', fontWeight: '500' }}>
                {localSubs.length} Total
              </span>
              <span style={{ fontSize: '11px', background: '#f0fdf4', color: '#16a34a', padding: '2px 8px', borderRadius: '999px', fontWeight: '500' }}>
                {localSubs.filter(s => s.grade !== null).length} Graded
              </span>
              <span style={{ fontSize: '11px', background: '#fef3c7', color: '#d97706', padding: '2px 8px', borderRadius: '999px', fontWeight: '500' }}>
                {localSubs.filter(s => s.grade === null).length} Pending
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{
            width: '32px', height: '32px', borderRadius: '8px',
            border: '1px solid #e2e8f0', background: 'white',
            cursor: 'pointer', color: '#64748b', fontSize: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>✕</button>
        </div>

        {/* Submissions list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {localSubs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>📭</div>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '6px' }}>
                No submissions yet
              </h3>
              <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                Students haven't submitted this assignment yet
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {localSubs.map(sub => (
                <div key={sub._id} style={{
                  background: '#f8fafc', borderRadius: '14px',
                  padding: '16px', border: '1px solid #e2e8f0'
                }}>
                  {/* Student info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '13px', fontWeight: '700', color: '#2563eb', flexShrink: 0
                    }}>
                      {sub.student.name.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>
                        {sub.student.name}
                      </p>
                      <p style={{ fontSize: '11px', color: '#94a3b8' }}>
                        Submitted {formatDate(sub.submittedAt)}
                      </p>
                    </div>
                    {/* Grade badge */}
                    {sub.grade !== null ? (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{
                          fontSize: '16px', fontWeight: '700',
                          color: sub.grade / assignment.totalMarks >= 0.75 ? '#0d9488'
                            : sub.grade / assignment.totalMarks >= 0.5 ? '#2563eb' : '#f59e0b'
                        }}>
                          {sub.grade}/{assignment.totalMarks}
                        </div>
                        <div style={{ fontSize: '10px', color: '#94a3b8' }}>Graded</div>
                      </div>
                    ) : (
                      <span style={{
                        fontSize: '10px', fontWeight: '600', padding: '3px 8px',
                        borderRadius: '999px', background: '#fef3c7', color: '#d97706'
                      }}>Pending</span>
                    )}
                  </div>

                  {/* Submission content */}
                  <div style={{
                    background: 'white', borderRadius: '10px', padding: '12px',
                    fontSize: '12px', color: '#374151', lineHeight: '1.6',
                    border: '1px solid #e2e8f0', marginBottom: '12px'
                  }}>
                    {sub.content}
                  </div>

                  {/* Grade button */}
                  <button onClick={() => setGradeTarget(sub)} style={{
                    width: '100%', padding: '9px',
                    background: sub.grade !== null
                      ? 'white'
                      : 'linear-gradient(135deg, #0d9488, #0f766e)',
                    color: sub.grade !== null ? '#0d9488' : 'white',
                    border: sub.grade !== null ? '1.5px solid #0d9488' : 'none',
                    borderRadius: '8px', fontSize: '12px', fontWeight: '600',
                    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s'
                  }}>
                    {sub.grade !== null ? 'Update Grade' : 'Grade Submission'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grade modal inside panel */}
      {gradeTarget && (
        <GradeModal
          submission={gradeTarget}
          totalMarks={assignment.totalMarks}
          onSave={handleSaveGrade}
          onCancel={() => setGradeTarget(null)}
        />
      )}
    </>
  )
}

// ── Main Page ──
const Assignments = () => {
  const [assignments, setAssignments] = useState(mockAssignments)
  const [showCreate, setShowCreate] = useState(false)
  const [viewTarget, setViewTarget] = useState(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const showSuccess = (msg) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  const handleCreate = (form) => {
    const course = mockCourses.find(c => c._id === form.courseId)
    const newA = {
      _id: `a${Date.now()}`,
      title: form.title,
      course: { _id: form.courseId, title: course?.title || '' },
      description: form.description,
      dueDate: form.dueDate,
      totalMarks: Number(form.totalMarks),
      status: 'active',
      submissions: [],
      createdAt: new Date().toISOString().split('T')[0],
    }
    setAssignments(prev => [newA, ...prev])
    setShowCreate(false)
    showSuccess('Assignment created successfully!')
  }

  const handleDelete = (id) => {
    setAssignments(prev => prev.filter(a => a._id !== id))
    showSuccess('Assignment deleted.')
  }

  const handleToggleStatus = (id) => {
    setAssignments(prev => prev.map(a =>
      a._id === id ? { ...a, status: a.status === 'active' ? 'closed' : 'active' } : a
    ))
    showSuccess('Assignment status updated.')
  }

  const counts = {
    all: assignments.length,
    active: assignments.filter(a => a.status === 'active').length,
    closed: assignments.filter(a => a.status === 'closed').length,
  }

  const filtered = assignments.filter(a => {
    const matchFilter = filter === 'all' || a.status === filter
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.course.title.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const totalPending = assignments.reduce((acc, a) =>
    acc + a.submissions.filter(s => s.grade === null).length, 0)

  return (
    <MainLayout>
      <div style={{ maxWidth: '1100px', margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif' }}>

        {/* Toast */}
        {successMsg && (
          <div style={{
            position: 'fixed', top: '80px', right: '24px', zIndex: 90,
            background: '#0d9488', color: 'white', fontSize: '13px', fontWeight: '500',
            padding: '12px 20px', borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(13,148,136,0.3)',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <polyline points="20 6 9 17 4 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {successMsg}
          </div>
        )}

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '24px', flexWrap: 'wrap', gap: '14px'
        }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>
              Assignments
            </h1>
            <p style={{ fontSize: '13px', color: '#64748b' }}>
              {assignments.length} total · {totalPending > 0
                ? <span style={{ color: '#d97706', fontWeight: '600' }}>{totalPending} submissions pending review</span>
                : <span style={{ color: '#16a34a', fontWeight: '600' }}>All submissions graded ✓</span>
              }
            </p>
          </div>
          <button onClick={() => setShowCreate(true)} style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white',
            border: 'none', borderRadius: '12px', fontSize: '13px', fontWeight: '600',
            cursor: 'pointer', fontFamily: 'inherit',
            boxShadow: '0 4px 14px rgba(37,99,235,0.3)'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <line x1="12" y1="5" x2="12" y2="19" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="5" y1="12" x2="19" y2="12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            Create Assignment
          </button>
        </div>

        {/* Pending review banner */}
        {totalPending > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            background: '#fffbeb', border: '1px solid #fde68a',
            borderRadius: '14px', padding: '14px 18px', marginBottom: '20px'
          }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px', background: '#fef3c7',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#d97706" strokeWidth="1.7"/>
                <path d="M12 8v4M12 16h.01" stroke="#d97706" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <p style={{ fontSize: '13px', fontWeight: '600', color: '#92400e', marginBottom: '2px' }}>
                {totalPending} submission{totalPending > 1 ? 's' : ''} waiting for review
              </p>
              <p style={{ fontSize: '12px', color: '#b45309' }}>
                Click "View Submissions" on any assignment to grade them
              </p>
            </div>
          </div>
        )}

        {/* Search + Filter */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="#94a3b8" strokeWidth="1.7"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="#94a3b8" strokeWidth="1.7" strokeLinecap="round"/>
              </svg>
            </div>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
              placeholder="Search assignments..."
              style={{
                width: '100%', padding: '10px 14px 10px 38px',
                background: searchFocused ? 'white' : '#f8fafc',
                border: `1.5px solid ${searchFocused ? '#2563eb' : '#e2e8f0'}`,
                borderRadius: '10px', fontSize: '13px', color: '#0f172a',
                outline: 'none', transition: 'all 0.2s', fontFamily: 'inherit', boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{
            display: 'flex', background: 'white', border: '1px solid #e2e8f0',
            borderRadius: '10px', padding: '4px', gap: '2px'
          }}>
            {[{ key: 'all', label: 'All' }, { key: 'active', label: 'Active' }, { key: 'closed', label: 'Closed' }].map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)} style={{
                padding: '7px 14px', borderRadius: '8px', border: 'none',
                cursor: 'pointer', fontFamily: 'inherit', fontSize: '12px', fontWeight: '600',
                background: filter === f.key ? '#2563eb' : 'transparent',
                color: filter === f.key ? 'white' : '#64748b', transition: 'all 0.15s'
              }}>
                {f.label} <span style={{
                  marginLeft: '4px', fontSize: '10px', padding: '1px 6px', borderRadius: '999px',
                  background: filter === f.key ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                  color: filter === f.key ? 'white' : '#94a3b8'
                }}>{counts[f.key]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{
            background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0',
            padding: '60px 20px', textAlign: 'center'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>{search ? '🔍' : '📝'}</div>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', marginBottom: '6px' }}>
              {search ? 'No assignments found' : 'No assignments yet'}
            </h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>
              {search ? `No results for "${search}"` : 'Create your first assignment'}
            </p>
            {!search && (
              <button onClick={() => setShowCreate(true)} style={{
                padding: '10px 20px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: 'white', border: 'none', borderRadius: '10px',
                fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit'
              }}>+ Create Assignment</button>
            )}
          </div>
        ) : (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px'
          }}>
            {filtered.map(a => (
              <AssignmentCard key={a._id} assignment={a}
                onViewSubmissions={a => setViewTarget(a)}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreate && (
        <CreateModal
          courses={mockCourses}
          onSave={handleCreate}
          onCancel={() => setShowCreate(false)}
        />
      )}

      {viewTarget && (
        <SubmissionsPanel
          assignment={viewTarget}
          onClose={() => setViewTarget(null)}
          onGrade={() => {}}
        />
      )}
    </MainLayout>
  )
}

export default Assignments