import api from '../services/api'

export const MAX_ENROLLMENT = 50

export const GRADES = [
  'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9',
  'Grade 10', 'Grade 11', 'Grade 12', 'College',
]

export const LANGUAGES = ['English', 'Hindi', 'Tamil', 'Telugu', 'Marathi', 'Bengali', 'Other']

export const SUBJECTS = [
  { value: 'mathematics',      label: 'Mathematics',      emoji: '📐', bg: '#eff6ff', chipBg: '#dbeafe', fg: '#1d4ed8' },
  { value: 'physics',          label: 'Physics',          emoji: '⚛️', bg: '#f5f3ff', chipBg: '#ede9fe', fg: '#6d28d9' },
  { value: 'chemistry',        label: 'Chemistry',        emoji: '🧪', bg: '#fefce8', chipBg: '#fef3c7', fg: '#b45309' },
  { value: 'biology',          label: 'Biology',          emoji: '🧬', bg: '#f0fdf4', chipBg: '#dcfce7', fg: '#15803d' },
  { value: 'english',          label: 'English',          emoji: '📖', bg: '#fdf2f8', chipBg: '#fce7f3', fg: '#be185d' },
  { value: 'computer_science', label: 'Computer Science', emoji: '💻', bg: '#ecfeff', chipBg: '#cffafe', fg: '#0e7490' },
  { value: 'history',          label: 'History',          emoji: '🏛️', bg: '#fff7ed', chipBg: '#ffedd5', fg: '#c2410c' },
  { value: 'geography',        label: 'Geography',        emoji: '🌍', bg: '#f0fdfa', chipBg: '#ccfbf1', fg: '#0f766e' },
  { value: 'economics',        label: 'Economics',        emoji: '📊', bg: '#fefce8', chipBg: '#fef9c3', fg: '#a16207' },
  { value: 'other',            label: 'Other',            emoji: '📚', bg: '#f8fafc', chipBg: '#e2e8f0', fg: '#475569' },
]

export const subjectInfo = (key) => {
  const normalized = String(key || 'other').toLowerCase().trim().replace(/\s+/g, '_')
  const found = SUBJECTS.find((s) => s.value === normalized)
  if (found) return found
  const fallback = SUBJECTS[SUBJECTS.length - 1]
  const label = normalized.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  return { ...fallback, value: normalized, label }
}

const origin = String(api.defaults?.baseURL || 'http://localhost:5000/api').replace(/\/api\/?$/, '')

export const assetUrl = (p) => {
  if (!p) return ''
  return /^https?:\/\//i.test(p) ? p : `${origin}${p}`
}

export const formatDate = (d) => {
  if (!d) return '—'
  const date = new Date(d)
  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

// Converts a course from the API into the shape the pages use
export const toCourse = (c) => {
  const tags = c.tags || []
  const students = (c.enrolledStudents || []).map((s) =>
    typeof s === 'object' && s !== null ? s : { _id: s }
  )
  return {
    _id: c._id,
    title: c.title || '',
    description: c.description || '',
    subject: String(c.category || 'other'),
    grade: tags.find((t) => !LANGUAGES.includes(t)) || '',
    language: tags.find((t) => LANGUAGES.includes(t)) || 'English',
    status: c.isPublished ? 'active' : 'draft',
    students,
    lessons: (c.lessons || []).slice().sort((a, b) => (a.order || 0) - (b.order || 0)),
    thumbnail: assetUrl(c.thumbnail),
    createdAt: c.createdAt,
  }
}