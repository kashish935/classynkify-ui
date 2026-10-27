import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getEnrolledCourses, apiError } from '../../services/studentService'
import { generateQuiz, submitQuiz, getQuizHistory } from '../../services/quizservice'
import './quiz.css'

const DIFFICULTIES = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
]
const COUNTS = [
  { value: 5, label: '5' },
  { value: 10, label: '10' },
  { value: 15, label: '15' },
]
const SCOPES = [
  { value: 'all', label: 'Whole course' },
  { value: 'completed', label: 'Lessons I\u2019ve completed' },
]
const LETTERS = ['A', 'B', 'C', 'D']

function Chips({ options, value, onChange }) {
  return (
    <div className="qz-seg">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className="qz-chip"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export default function Quiz() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [stage, setStage] = useState('setup') // setup | loading | taking | result
  const [courses, setCourses] = useState([])
  const [coursesLoading, setCoursesLoading] = useState(true)
  const [history, setHistory] = useState([])

  const [form, setForm] = useState({
    courseId: searchParams.get('courseId') || '',
    scope: 'all',
    difficulty: 'medium',
    count: 5,
    topic: '',
  })
  const setField = (key) => (value) => setForm((f) => ({ ...f, [key]: value }))

  const [quiz, setQuiz] = useState(null)
  const [answers, setAnswers] = useState([])
  const [current, setCurrent] = useState(0)
  const [result, setResult] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // Enrolled courses (for the dropdown) and past quizzes
  useEffect(() => {
    let cancelled = false
    getEnrolledCourses()
      .then((list) => {
        if (cancelled) return
        setCourses(list)
        setForm((f) => ({
          ...f,
          courseId: list.some((c) => c._id === f.courseId) ? f.courseId : list[0]?._id || '',
        }))
      })
      .catch((err) => toast.error(apiError(err, 'Could not load your courses')))
      .finally(() => { if (!cancelled) setCoursesLoading(false) })

    getQuizHistory()
      .then((list) => { if (!cancelled) setHistory(list) })
      .catch(() => { /* history is optional */ })

    return () => { cancelled = true }
  }, [])

  const selectedCourse = courses.find((c) => c._id === form.courseId)

  const handleGenerate = async (e) => {
    e?.preventDefault()
    if (!form.courseId) return
    setStage('loading')
    try {
      const q = await generateQuiz({
        courseId: form.courseId,
        scope: form.scope,
        difficulty: form.difficulty,
        count: form.count,
        topic: form.topic.trim(),
      })
      setQuiz(q)
      setAnswers(new Array(q.questions.length).fill(-1))
      setCurrent(0)
      setResult(null)
      setStage('taking')
    } catch (err) {
      toast.error(apiError(err, 'Could not generate the quiz. Please try again.'))
      setStage('setup')
    }
  }

  const choose = (optionIndex) =>
    setAnswers((prev) => prev.map((a, i) => (i === current ? optionIndex : a)))

  const unanswered = answers.filter((a) => a === -1).length

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const r = await submitQuiz(quiz._id, answers)
      setResult(r)
      setStage('result')
      getQuizHistory().then(setHistory).catch(() => {})
    } catch (err) {
      toast.error(apiError(err, 'Could not submit the quiz. Please try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  /* ───────────── Loading ───────────── */
  if (stage === 'loading') {
    return (
      <div className="qz-root">
        <div className="qz-card qz-center">
          <div className="qz-spinner" />
          <h2 className="qz-title">Writing your quiz…</h2>
          <p className="qz-sub">
            Building {form.count} {form.difficulty} questions
            {selectedCourse ? ` from ${selectedCourse.title}` : ''}. This takes a few seconds.
          </p>
        </div>
      </div>
    )
  }

  /* ───────────── Taking ───────────── */
  if (stage === 'taking' && quiz) {
    const q = quiz.questions[current]
    const isLast = current === quiz.questions.length - 1
    const progress = ((current + 1) / quiz.questions.length) * 100

    return (
      <div className="qz-root">
        <div className="qz-card">
          <div className="qz-meta">
            <span>
              Question <strong>{current + 1}</strong> of {quiz.questions.length}
            </span>
            <span>
              {selectedCourse?.title ? `${selectedCourse.title} · ` : ''}
              <span style={{ textTransform: 'capitalize' }}>{quiz.difficulty}</span>
            </span>
          </div>
          <div className="qz-track">
            <div className="qz-fill" style={{ width: `${progress}%` }} />
          </div>

          <h2 className="qz-question">{q.question}</h2>

          <div className="qz-opts">
            {q.options.map((opt, i) => (
              <button
                key={i}
                type="button"
                className="qz-opt"
                aria-pressed={answers[current] === i}
                onClick={() => choose(i)}
              >
                <span className="qz-letter">{LETTERS[i]}</span>
                <span>{opt}</span>
              </button>
            ))}
          </div>

          <div className="qz-nav">
            <button
              type="button"
              className="qz-btn qz-btn--ghost"
              disabled={current === 0}
              onClick={() => setCurrent((c) => c - 1)}
            >
              ← Previous
            </button>

            {isLast ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {unanswered > 0 && (
                  <span className="qz-unanswered">{unanswered} unanswered</span>
                )}
                <button type="button" className="qz-btn" disabled={submitting} onClick={handleSubmit}>
                  {submitting ? 'Submitting…' : 'Submit quiz'}
                </button>
              </div>
            ) : (
              <button type="button" className="qz-btn" onClick={() => setCurrent((c) => c + 1)}>
                Next →
              </button>
            )}
          </div>

          <div className="qz-dots" role="group" aria-label="Jump to question">
            {quiz.questions.map((_, i) => (
              <button
                key={i}
                type="button"
                className="qz-dot"
                data-answered={answers[i] !== -1}
                aria-current={i === current ? 'step' : undefined}
                aria-label={`Question ${i + 1}${answers[i] !== -1 ? ' (answered)' : ''}`}
                onClick={() => setCurrent(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  /* ───────────── Result ───────────── */
  if (stage === 'result' && result) {
    const pct = result.total ? Math.round((result.score / result.total) * 100) : 0
    const verdict =
      pct >= 80 ? 'Excellent work!' : pct >= 50 ? 'Good effort, keep practising.' : 'Review the lessons and try again.'

    return (
      <div className="qz-root">
        <div className="qz-card">
          <div className="qz-result">
            <div className="qz-ring" style={{ '--pct': pct }}>
              <div className="qz-ring-inner">
                <b>{pct}%</b>
                <span>{result.score}/{result.total} correct</span>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: '220px' }}>
              <h2 className="qz-title">{verdict}</h2>
              <p className="qz-sub">
                {selectedCourse?.title ? `${selectedCourse.title} · ` : ''}
                <span style={{ textTransform: 'capitalize' }}>{quiz?.difficulty}</span> quiz
              </p>
              <div className="qz-actions">
                <button type="button" className="qz-btn" onClick={handleGenerate}>
                  Try a new quiz
                </button>
                <button type="button" className="qz-btn qz-btn--ghost" onClick={() => setStage('setup')}>
                  Change settings
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="qz-card">
          <h3 className="qz-h3">Review your answers</h3>
          {result.review.map((r, qi) => (
            <div className="qz-review-q" key={qi}>
              <p className="qz-question">{qi + 1}. {r.question}</p>
              <div className="qz-opts">
                {r.options.map((opt, i) => {
                  const isCorrect = i === r.correctIndex
                  const isWrongPick = i === r.yourAnswer && !isCorrect
                  return (
                    <div
                      key={i}
                      className={`qz-opt${isCorrect ? ' qz-opt--correct' : ''}${isWrongPick ? ' qz-opt--wrong' : ''}`}
                    >
                      <span className="qz-letter">{LETTERS[i]}</span>
                      <span>{opt}</span>
                      {isCorrect && <span className="qz-tag">{r.yourAnswer === i ? '✓ Your answer' : '✓ Correct'}</span>}
                      {isWrongPick && <span className="qz-tag">✗ Your answer</span>}
                    </div>
                  )
                })}
              </div>
              {r.yourAnswer === -1 && <p className="qz-sub">You skipped this question.</p>}
              {r.explanation && (
                <div className="qz-explain"><b>Why: </b>{r.explanation}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  /* ───────────── Setup ───────────── */
  return (
    <div className="qz-root">
      <form className="qz-card" onSubmit={handleGenerate}>
        <h2 className="qz-title">Create a practice quiz</h2>
        <p className="qz-sub">
          Pick one of your courses and Gemini will write a fresh quiz from its lessons.
        </p>

        {coursesLoading ? (
          <p className="qz-sub" style={{ marginTop: 20 }}>Loading your courses…</p>
        ) : courses.length === 0 ? (
          <div className="qz-field">
            <p className="qz-sub">You haven&rsquo;t enrolled in any courses yet, so there&rsquo;s nothing to quiz on.</p>
            <button type="button" className="qz-btn" style={{ marginTop: 12 }} onClick={() => navigate('/student/courses')}>
              Browse courses
            </button>
          </div>
        ) : (
          <>
            <div className="qz-field">
              <label className="qz-label" htmlFor="qz-course">Course</label>
              <select
                id="qz-course"
                className="qz-select"
                value={form.courseId}
                onChange={(e) => setField('courseId')(e.target.value)}
              >
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>{c.title}</option>
                ))}
              </select>
            </div>

            <div className="qz-field">
              <span className="qz-label">Questions from</span>
              <Chips options={SCOPES} value={form.scope} onChange={setField('scope')} />
            </div>

            <div className="qz-field">
              <span className="qz-label">Difficulty</span>
              <Chips options={DIFFICULTIES} value={form.difficulty} onChange={setField('difficulty')} />
            </div>

            <div className="qz-field">
              <span className="qz-label">Number of questions</span>
              <Chips options={COUNTS} value={form.count} onChange={setField('count')} />
            </div>

            <div className="qz-field">
              <label className="qz-label" htmlFor="qz-topic">
                Focus topic <span className="qz-hint">(optional)</span>
              </label>
              <input
                id="qz-topic"
                className="qz-input"
                type="text"
                maxLength={100}
                placeholder="e.g. React hooks, binary trees, normalisation"
                value={form.topic}
                onChange={(e) => setField('topic')(e.target.value)}
              />
            </div>

            <button type="submit" className="qz-btn qz-btn--full" disabled={!form.courseId}>
              Generate quiz
            </button>
          </>
        )}
      </form>

      {history.length > 0 && (
        <div className="qz-card">
          <h3 className="qz-h3">Recent quizzes</h3>
          <ul className="qz-history">
            {history.map((h) => (
              <li key={h._id}>
                <div style={{ minWidth: 0 }}>
                  <div className="qz-history-title">{h.courseTitle}{h.topic ? ` · ${h.topic}` : ''}</div>
                  <div className="qz-history-sub">
                    {h.difficulty} · {new Date(h.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
                <span className="qz-score">{h.score}/{h.total}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}