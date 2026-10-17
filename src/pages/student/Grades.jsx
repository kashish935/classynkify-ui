import { useState, useEffect } from 'react'
import { getStudentGrades } from '../../services/studentService'

const getLetterGrade = (score) => {
  if (score >= 90) return { letter: 'A', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' }
  if (score >= 80) return { letter: 'B', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' }
  if (score >= 70) return { letter: 'C', color: '#d97706', bg: '#fffbeb', border: '#fde68a' }
  if (score >= 60) return { letter: 'D', color: '#ea580c', bg: '#fff7ed', border: '#fed7aa' }
  return { letter: 'F', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' }
}

const RadialProgress = ({ value, size = 88, stroke = 8 }) => {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (value / 100) * circ
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="white"
        strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }}/>
    </svg>
  )
}

export default function Grades() {
  const [grades, setGrades] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStudentGrades()
      .then(setGrades)
      .catch(() => setGrades([]))
      .finally(() => setLoading(false))
  }, [])

  const scored = grades.filter(g => g.score != null)
  const avg = scored.length > 0
    ? Math.round(scored.reduce((a, g) => a + g.score, 0) / scored.length)
    : null
  const avgLg = avg !== null ? getLetterGrade(avg) : null
  const pending = grades.length - scored.length

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: '12px' }}>
      <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '3px solid #ede9fe', borderTopColor: '#6366f1', animation: 'spin 0.8s linear infinite' }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <p style={{ color: '#94a3b8', fontSize: '13px' }}>Loading grades…</p>
    </div>
  )

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Page header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '4px' }}>
          My Grades
        </h1>
        <p style={{ fontSize: '14px', color: '#94a3b8' }}>
          {scored.length} of {grades.length} submitted assignments graded
        </p>
      </div>

      {/* Summary banner */}
      {avg !== null && (
        <div style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          borderRadius: '20px', padding: '28px 32px', marginBottom: '24px',
          display: 'flex', alignItems: 'center', gap: '28px',
          boxShadow: '0 8px 32px rgba(99,102,241,0.25)'
        }}>
          {/* Radial */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <RadialProgress value={avg} size={88} stroke={8}/>
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <span style={{ fontSize: '20px', fontWeight: '800', color: '#fff', transform: 'rotate(90deg)' }}>{avg}</span>
            </div>
          </div>

          {/* Score */}
          <div>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '12px', fontWeight: '600', marginBottom: '4px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Overall Average</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span style={{ fontSize: '44px', fontWeight: '900', color: '#fff', lineHeight: 1 }}>{avg}%</span>
              <span style={{ fontSize: '18px', fontWeight: '800', color: '#fff', background: 'rgba(255,255,255,0.2)', borderRadius: '8px', padding: '2px 10px' }}>
                {avgLg.letter}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
            {[
              { icon: '✅', val: scored.length, label: 'Graded' },
              { icon: '⏳', val: pending, label: 'Pending' },
            ].map(s => (
              <div key={s.label} style={{
                background: 'rgba(255,255,255,0.12)', borderRadius: '14px',
                padding: '14px 20px', textAlign: 'center', minWidth: '80px'
              }}>
                <p style={{ fontSize: '20px', marginBottom: '4px' }}>{s.icon}</p>
                <p style={{ fontSize: '22px', fontWeight: '800', color: '#fff', lineHeight: 1 }}>{s.val}</p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', fontWeight: '500', marginTop: '2px' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grade Distribution */}
      {scored.length > 0 && (
        <div style={{
          background: '#fff', borderRadius: '16px', padding: '24px',
          border: '1px solid #f1f5f9', marginBottom: '20px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
        }}>
          <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '20px' }}>Grade Distribution</h2>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '80px' }}>
            {['A','B','C','D','F'].map(letter => {
              const ranges = { A:[90,100], B:[80,89], C:[70,79], D:[60,69], F:[0,59] }
              const colors = { A:'#16a34a', B:'#2563eb', C:'#d97706', D:'#ea580c', F:'#dc2626' }
              const bgs    = { A:'#f0fdf4', B:'#eff6ff', C:'#fffbeb', D:'#fff7ed', F:'#fef2f2' }
              const count = scored.filter(g => {
                const s = g.score
                return s >= ranges[letter][0] && s <= ranges[letter][1]
              }).length
              const pct = scored.length > 0 ? (count / scored.length) : 0
              const barH = Math.max(pct * 64, count > 0 ? 10 : 4)
              return (
                <div key={letter} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: count > 0 ? colors[letter] : '#cbd5e1' }}>{count}</span>
                  <div style={{
                    width: '100%', height: `${barH}px`,
                    background: count > 0 ? colors[letter] : '#f1f5f9',
                    borderRadius: '6px 6px 0 0',
                    transition: 'height 0.6s ease'
                  }}/>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    background: count > 0 ? bgs[letter] : '#f8fafc',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: '800',
                    color: count > 0 ? colors[letter] : '#cbd5e1'
                  }}>{letter}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Grades List */}
      <div style={{
        background: '#fff', borderRadius: '16px',
        border: '1px solid #f1f5f9',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f8fafc' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>All Assignments</h2>
        </div>

        {grades.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            <div style={{ fontSize: '44px', marginBottom: '12px', opacity: 0.35 }}>📈</div>
            <p style={{ fontSize: '15px', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>No grades yet</p>
            <p style={{ fontSize: '13px', color: '#94a3b8' }}>Grades will appear once your assignments are marked.</p>
          </div>
        ) : (
          grades.map((g, i) => {
            const lg = g.score != null ? getLetterGrade(g.score) : null
            return (
              <div key={g._id || i} style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '18px 24px',
                borderBottom: i < grades.length - 1 ? '1px solid #f8fafc' : 'none',
                transition: 'background 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Left: info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '3px' }}>
                    {g.assignmentTitle || g.title || 'Assignment'}
                  </p>
                  <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                    {g.course}{g.submittedAt ? ` · ${new Date(g.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}` : ''}
                  </p>
                  {g.feedback && (
                    <p style={{ fontSize: '12px', color: '#6366f1', marginTop: '5px', fontStyle: 'italic', background: '#f5f3ff', padding: '5px 10px', borderRadius: '8px', display: 'inline-block' }}>
                      "{g.feedback}"
                    </p>
                  )}
                </div>

                {/* Right: score */}
                {g.score != null ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
                    <div style={{ width: '110px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>{g.marks}/{g.totalMarks}</span>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: lg.color }}>{g.score}%</span>
                      </div>
                      <div style={{ height: '5px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', width: `${g.score}%`,
                          background: lg.color, borderRadius: '999px',
                          transition: 'width 0.6s ease'
                        }}/>
                      </div>
                    </div>
                    <div style={{
                      width: '42px', height: '42px', borderRadius: '12px',
                      background: lg.bg, border: `1.5px solid ${lg.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: '800', fontSize: '17px', color: lg.color
                    }}>
                      {lg.letter}
                    </div>
                  </div>
                ) : (
                  <span style={{
                    fontSize: '11px', fontWeight: '600', color: '#94a3b8',
                    background: '#f8fafc', border: '1px solid #e2e8f0',
                    padding: '5px 14px', borderRadius: '999px'
                  }}>Pending</span>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
