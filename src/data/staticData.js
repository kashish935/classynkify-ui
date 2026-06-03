/**
 * ============================================================
 *  CLASSYNKIFY — STATIC SHOWCASE DATA
 *  Use this while the backend / API is not yet connected.
 *  Every page imports from here, so you only edit one place.
 * ============================================================
 */

// ─────────────────────────────────────────────────────────────
//  AUTH / USER
// ─────────────────────────────────────────────────────────────

export const MOCK_TEACHER = {
  _id: 't1',
  name: 'Ananya Kapoor',
  email: 'ananya.kapoor@classynkify.edu',
  role: 'teacher',
  phone: '+91 98765 43210',
  bio: 'Senior educator with 10 years of experience in Mathematics and Science.',
  avatar: null,
}

export const MOCK_STUDENT_USER = {
  _id: 's1',
  name: 'Rohan Sharma',
  email: 'rohan.sharma@classynkify.edu',
  role: 'student',
  phone: '+91 99887 76655',
  bio: 'Grade 10 student passionate about mathematics and physics.',
  avatar: null,
}

// ─────────────────────────────────────────────────────────────
//  COURSES (used by both teacher + student pages)
// ─────────────────────────────────────────────────────────────

export const MOCK_COURSES = [
  {
    _id: 'c1',
    title: 'Mathematics — Grade 10',
    subject: 'mathematics',
    grade: 'Grade 10',
    language: 'English',
    duration: '12 weeks',
    description: 'A comprehensive course covering algebra, geometry, and trigonometry. Builds a strong foundation for competitive exams.',
    status: 'active',
    students: Array(38).fill(null),
    lectures: MOCK_LESSONS_C1(),   // defined below with forward-ref trick
    thumbnail: '',
    color: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
    emoji: '📐',
    instructor: 'Ananya Kapoor',
    // Student-specific
    progress: 72,
    enrolledAt: '2026-01-10',
  },
  {
    _id: 'c2',
    title: 'Physics Fundamentals',
    subject: 'physics',
    grade: 'Grade 11',
    language: 'English',
    duration: '10 weeks',
    description: 'Core physics concepts including mechanics, waves, thermodynamics and optics.',
    status: 'active',
    students: Array(29).fill(null),
    lectures: MOCK_LESSONS_C2(),
    thumbnail: '',
    color: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
    emoji: '⚛️',
    instructor: 'Ananya Kapoor',
    progress: 45,
    enrolledAt: '2026-01-15',
  },
  {
    _id: 'c3',
    title: 'English Literature',
    subject: 'english',
    grade: 'Grade 10',
    language: 'English',
    duration: '14 weeks',
    description: 'Exploring classic and modern literature through critical analysis and creative writing.',
    status: 'active',
    students: Array(41).fill(null),
    lectures: MOCK_LESSONS_C3(),
    thumbnail: '',
    color: 'linear-gradient(135deg, #db2777, #be185d)',
    emoji: '📖',
    instructor: 'Ananya Kapoor',
    progress: 88,
    enrolledAt: '2026-01-08',
  },
  {
    _id: 'c4',
    title: 'Chemistry Basics',
    subject: 'chemistry',
    grade: 'Grade 9',
    language: 'English',
    duration: '8 weeks',
    description: 'Introduction to atoms, molecules, the periodic table and basic chemical reactions.',
    status: 'draft',
    students: Array(0).fill(null),
    lectures: [],
    thumbnail: '',
    color: 'linear-gradient(135deg, #d97706, #b45309)',
    emoji: '🧪',
    instructor: 'Ananya Kapoor',
    progress: 0,
    enrolledAt: null,
  },
  {
    _id: 'c5',
    title: 'Computer Science — Grade 12',
    subject: 'computer_science',
    grade: 'Grade 12',
    language: 'English',
    duration: '16 weeks',
    description: 'Data structures, algorithms, OOP, and programming fundamentals for board and competitive exams.',
    status: 'active',
    students: Array(22).fill(null),
    lectures: MOCK_LESSONS_C5(),
    thumbnail: '',
    color: 'linear-gradient(135deg, #0284c7, #0369a1)',
    emoji: '💻',
    instructor: 'Ananya Kapoor',
    progress: 30,
    enrolledAt: '2026-02-01',
  },
  {
    _id: 'c6',
    title: 'Biology — Grade 11',
    subject: 'science',
    grade: 'Grade 11',
    language: 'English',
    duration: '12 weeks',
    description: 'Cells, genetics, human physiology, and ecosystems. Covers all major topics for board exams and Olympiad prep.',
    status: 'active',
    students: Array(34).fill(null),
    lectures: [],
    thumbnail: '',
    color: 'linear-gradient(135deg, #16a34a, #15803d)',
    emoji: '🧬',
    instructor: 'Ananya Kapoor',
    progress: 0,
    enrolledAt: null,
  },
  {
    _id: 'c7',
    title: 'Web Development Basics',
    subject: 'programming',
    grade: 'Grade 12',
    language: 'English',
    duration: '10 weeks',
    description: 'HTML, CSS, and JavaScript from scratch. Build real-world web pages and understand browser fundamentals.',
    status: 'active',
    students: Array(47).fill(null),
    lectures: [],
    thumbnail: '',
    color: 'linear-gradient(135deg, #f97316, #ea580c)',
    emoji: '🌐',
    instructor: 'Ananya Kapoor',
    progress: 0,
    enrolledAt: null,
  },
  {
    _id: 'c8',
    title: 'Environmental Science',
    subject: 'science',
    grade: 'Grade 9',
    language: 'English',
    duration: '8 weeks',
    description: 'Climate change, biodiversity, pollution and sustainable development. Perfect for general studies and awareness.',
    status: 'active',
    students: Array(19).fill(null),
    lectures: [],
    thumbnail: '',
    color: 'linear-gradient(135deg, #0d9488, #0f766e)',
    emoji: '🌍',
    instructor: 'Ananya Kapoor',
    progress: 0,
    enrolledAt: null,
  },
]

// Lessons helpers (avoids circular reference with MOCK_COURSES)
function MOCK_LESSONS_C1() {
  return [
    { _id: 'l1_1', title: 'Introduction to Algebra', description: 'Variables, constants and expressions.', videoUrl: 'https://www.youtube.com/embed/NybHckSEQBI', duration: '18 min', order: 1 },
    { _id: 'l1_2', title: 'Linear Equations', description: 'Solving one and two variable equations.', videoUrl: 'https://www.youtube.com/embed/SkMNREAMNvc', duration: '22 min', order: 2 },
    { _id: 'l1_3', title: 'Quadratic Equations', description: 'Factoring and the quadratic formula.', videoUrl: 'https://www.youtube.com/embed/i7idZfS8t8w', duration: '25 min', order: 3 },
    { _id: 'l1_4', title: 'Polynomials', description: 'Operations on polynomials.', videoUrl: 'https://www.youtube.com/embed/v-pyuaThp-c', duration: '20 min', order: 4 },
    { _id: 'l1_5', title: 'Coordinate Geometry', description: 'Points, lines, and slopes.', videoUrl: 'https://www.youtube.com/embed/FXgV9ySNusc', duration: '30 min', order: 5 },
    { _id: 'l1_6', title: 'Triangles & Congruence', description: 'Properties and congruence rules.', videoUrl: 'https://www.youtube.com/embed/9kqhXrFNPk8', duration: '28 min', order: 6 },
    { _id: 'l1_7', title: 'Circles', description: 'Arcs, chords, and tangents.', videoUrl: 'https://www.youtube.com/embed/YPKeLM3-TTs', duration: '24 min', order: 7 },
    { _id: 'l1_8', title: 'Trigonometry Basics', description: 'Sine, cosine, tangent ratios.', videoUrl: 'https://www.youtube.com/embed/F21S9Wpi0y8', duration: '32 min', order: 8 },
    { _id: 'l1_9', title: 'Heights and Distances', description: 'Applying trig to real-world problems.', videoUrl: 'https://www.youtube.com/embed/P8e-U4mBJoU', duration: '20 min', order: 9 },
    { _id: 'l1_10', title: 'Statistics & Probability', description: 'Mean, median, mode and basic probability.', videoUrl: 'https://www.youtube.com/embed/SzZ6GpcfoQY', duration: '26 min', order: 10 },
    { _id: 'l1_11', title: 'Revision — Algebra', description: 'Quick revision of all algebra topics.', videoUrl: 'https://www.youtube.com/embed/NybHckSEQBI', duration: '15 min', order: 11 },
    { _id: 'l1_12', title: 'Revision — Geometry', description: 'Quick revision of geometry and trig.', videoUrl: 'https://www.youtube.com/embed/9kqhXrFNPk8', duration: '15 min', order: 12 },
  ]
}

function MOCK_LESSONS_C2() {
  return [
    { _id: 'l2_1', title: 'Introduction to Physics', description: 'Scope and measurement.', videoUrl: 'https://www.youtube.com/embed/ZM8ECpBuQYE', duration: '20 min', order: 1 },
    { _id: 'l2_2', title: 'Motion in a Straight Line', description: 'Kinematics fundamentals.', videoUrl: 'https://www.youtube.com/embed/wWnfJ0-xXRE', duration: '28 min', order: 2 },
    { _id: 'l2_3', title: "Newton's Laws of Motion", description: 'Forces and inertia.', videoUrl: 'https://www.youtube.com/embed/ZM8ECpBuQYE', duration: '24 min', order: 3 },
    { _id: 'l2_4', title: 'Work, Energy & Power', description: 'Energy transformations.', videoUrl: 'https://www.youtube.com/embed/wWnfJ0-xXRE', duration: '22 min', order: 4 },
    { _id: 'l2_5', title: 'Thermodynamics', description: 'Heat and temperature.', videoUrl: 'https://www.youtube.com/embed/ZM8ECpBuQYE', duration: '30 min', order: 5 },
    { _id: 'l2_6', title: 'Waves and Oscillation', description: 'Properties of waves.', videoUrl: 'https://www.youtube.com/embed/wWnfJ0-xXRE', duration: '26 min', order: 6 },
    { _id: 'l2_7', title: 'Optics', description: 'Reflection, refraction and lenses.', videoUrl: 'https://www.youtube.com/embed/ZM8ECpBuQYE', duration: '28 min', order: 7 },
    { _id: 'l2_8', title: 'Electrostatics', description: 'Charge, field and potential.', videoUrl: 'https://www.youtube.com/embed/wWnfJ0-xXRE', duration: '32 min', order: 8 },
  ]
}

function MOCK_LESSONS_C3() {
  return [
    { _id: 'l3_1', title: 'Introduction to Literature', description: 'What is literary analysis?', videoUrl: 'https://www.youtube.com/embed/MSYw502dJNY', duration: '16 min', order: 1 },
    { _id: 'l3_2', title: 'Reading Prose', description: 'Narrative techniques in fiction.', videoUrl: 'https://www.youtube.com/embed/MSYw502dJNY', duration: '22 min', order: 2 },
    { _id: 'l3_3', title: 'Poetry Analysis', description: 'Form, meter and meaning.', videoUrl: 'https://www.youtube.com/embed/MSYw502dJNY', duration: '25 min', order: 3 },
    { _id: 'l3_4', title: 'Drama & Plays', description: 'Shakespeare and modern drama.', videoUrl: 'https://www.youtube.com/embed/MSYw502dJNY', duration: '28 min', order: 4 },
    { _id: 'l3_5', title: 'Critical Writing', description: 'Essay structure and arguments.', videoUrl: 'https://www.youtube.com/embed/MSYw502dJNY', duration: '20 min', order: 5 },
  ]
}

function MOCK_LESSONS_C5() {
  return [
    { _id: 'l5_1', title: 'Introduction to Programming', description: 'Hello World, variables and data types.', videoUrl: 'https://www.youtube.com/embed/zOjov-2OZ0E', duration: '20 min', order: 1 },
    { _id: 'l5_2', title: 'Control Flow', description: 'If-else, loops and switch.', videoUrl: 'https://www.youtube.com/embed/zOjov-2OZ0E', duration: '25 min', order: 2 },
    { _id: 'l5_3', title: 'Functions & Recursion', description: 'Defining and calling functions.', videoUrl: 'https://www.youtube.com/embed/zOjov-2OZ0E', duration: '30 min', order: 3 },
    { _id: 'l5_4', title: 'Arrays and Strings', description: 'Data storage and manipulation.', videoUrl: 'https://www.youtube.com/embed/zOjov-2OZ0E', duration: '28 min', order: 4 },
    { _id: 'l5_5', title: 'OOP Concepts', description: 'Classes, objects, inheritance.', videoUrl: 'https://www.youtube.com/embed/zOjov-2OZ0E', duration: '35 min', order: 5 },
    { _id: 'l5_6', title: 'Sorting Algorithms', description: 'Bubble, merge and quicksort.', videoUrl: 'https://www.youtube.com/embed/zOjov-2OZ0E', duration: '32 min', order: 6 },
  ]
}

// ─────────────────────────────────────────────────────────────
//  TEACHER DASHBOARD STATS
// ─────────────────────────────────────────────────────────────

export const MOCK_TEACHER_STATS = {
  totalCourses: 8,
  totalStudents: 142,
  pendingAssignments: 6,
  avgCompletion: 76,
}

export const MOCK_TEACHER_ACTIVITY = [
  { id: 1, text: 'Rohan Sharma submitted Assignment 3', time: '5 min ago', type: 'submission' },
  { id: 2, text: 'New student enrolled in Physics', time: '1 hr ago', type: 'enroll' },
  { id: 3, text: 'Priya Mehta submitted Assignment 2', time: '2 hr ago', type: 'submission' },
  { id: 4, text: 'You uploaded Lecture 9 in Maths', time: '3 hr ago', type: 'upload' },
  { id: 5, text: '3 new students joined English Lit', time: 'Yesterday', type: 'enroll' },
]

// ─────────────────────────────────────────────────────────────
//  STUDENTS (Teacher view)
// ─────────────────────────────────────────────────────────────

export const MOCK_STUDENTS = [
  { _id: 's1', name: 'Rohan Sharma',    email: 'rohan@classynkify.edu',   enrolledCourses: ['c1', 'c2'],       avgProgress: 82, createdAt: '2026-01-15', lastActive: new Date().toISOString() },
  { _id: 's2', name: 'Priya Patel',     email: 'priya@classynkify.edu',   enrolledCourses: ['c1', 'c3'],       avgProgress: 67, createdAt: '2026-01-18', lastActive: new Date().toISOString() },
  { _id: 's3', name: 'Arjun Mehta',     email: 'arjun@classynkify.edu',   enrolledCourses: ['c2'],             avgProgress: 91, createdAt: '2026-01-20', lastActive: new Date().toISOString() },
  { _id: 's4', name: 'Sneha Gupta',     email: 'sneha@classynkify.edu',   enrolledCourses: ['c1', 'c2', 'c3'], avgProgress: 45, createdAt: '2026-02-01' },
  { _id: 's5', name: 'Karan Singh',     email: 'karan@classynkify.edu',   enrolledCourses: ['c3'],             avgProgress: 73, createdAt: '2026-02-05', lastActive: new Date().toISOString() },
  { _id: 's6', name: 'Ananya Verma',    email: 'ananya@classynkify.edu',  enrolledCourses: ['c1'],             avgProgress: 88, createdAt: '2026-02-10', lastActive: new Date().toISOString() },
  { _id: 's7', name: 'Dev Chopra',      email: 'dev@classynkify.edu',     enrolledCourses: ['c2', 'c3'],       avgProgress: 34, createdAt: '2026-02-14' },
  { _id: 's8', name: 'Meera Joshi',     email: 'meera@classynkify.edu',   enrolledCourses: ['c1', 'c5'],       avgProgress: 79, createdAt: '2026-02-18', lastActive: new Date().toISOString() },
  { _id: 's9', name: 'Rahul Kumar',     email: 'rahul@classynkify.edu',   enrolledCourses: ['c5'],             avgProgress: 55, createdAt: '2026-03-01' },
  { _id: 's10', name: 'Anjali Das',     email: 'anjali@classynkify.edu',  enrolledCourses: ['c1', 'c3'],       avgProgress: 93, createdAt: '2026-03-05', lastActive: new Date().toISOString() },
  { _id: 's11', name: 'Vikram Nair',    email: 'vikram@classynkify.edu',  enrolledCourses: ['c2', 'c5'],       avgProgress: 61, createdAt: '2026-03-10', lastActive: new Date().toISOString() },
  { _id: 's12', name: 'Ishaan Bose',    email: 'ishaan@classynkify.edu',  enrolledCourses: ['c1'],             avgProgress: 47, createdAt: '2026-03-12' },
]

// ─────────────────────────────────────────────────────────────
//  ASSIGNMENTS (Teacher + Student views)
// ─────────────────────────────────────────────────────────────

export const MOCK_ASSIGNMENTS_TEACHER = [
  {
    _id: 'a1',
    title: 'Algebra Problem Set 1',
    course: { _id: 'c1', title: 'Mathematics — Grade 10' },
    description: 'Solve all 20 problems from Chapter 3. Show all working steps clearly.',
    dueDate: '2026-06-15',
    totalMarks: 100,
    status: 'active',
    createdAt: '2026-05-20',
    submissions: [
      { _id: 'sub1', student: { name: 'Rohan Sharma',  email: 'rohan@classynkify.edu'  }, submittedAt: '2026-05-25', content: 'All 20 problems solved. Showed all working steps as required.', grade: null },
      { _id: 'sub2', student: { name: 'Priya Patel',   email: 'priya@classynkify.edu'  }, submittedAt: '2026-05-24', content: 'Completed all questions. Some methods differ from textbook.', grade: 88 },
      { _id: 'sub3', student: { name: 'Sneha Gupta',   email: 'sneha@classynkify.edu'  }, submittedAt: '2026-05-26', content: 'Done! Struggled with Q15 and Q18 but attempted all.', grade: null },
    ],
  },
  {
    _id: 'a2',
    title: "Newton's Laws — Lab Report",
    course: { _id: 'c2', title: 'Physics Fundamentals' },
    description: 'Write a detailed lab report on your observations from the pendulum experiment.',
    dueDate: '2026-06-20',
    totalMarks: 50,
    status: 'active',
    createdAt: '2026-05-18',
    submissions: [
      { _id: 'sub4', student: { name: 'Arjun Mehta', email: 'arjun@classynkify.edu' }, submittedAt: '2026-05-22', content: 'Lab report with data table, graph and conclusion attached.', grade: 45 },
    ],
  },
  {
    _id: 'a3',
    title: 'Essay: To Kill a Mockingbird',
    course: { _id: 'c3', title: 'English Literature' },
    description: 'Write a 1000-word critical analysis essay on the themes of justice and morality.',
    dueDate: '2026-06-10',
    totalMarks: 80,
    status: 'active',
    createdAt: '2026-05-15',
    submissions: [],
  },
  {
    _id: 'a4',
    title: 'Periodic Table Quiz',
    course: { _id: 'c4', title: 'Chemistry Basics' },
    description: 'Fill in the first 20 elements with their symbols and atomic numbers.',
    dueDate: '2026-05-10',
    totalMarks: 40,
    status: 'closed',
    createdAt: '2026-04-28',
    submissions: [
      { _id: 'sub5', student: { name: 'Rahul Kumar', email: 'rahul@classynkify.edu' }, submittedAt: '2026-05-08', content: 'Completed the periodic table quiz.', grade: 36 },
      { _id: 'sub6', student: { name: 'Anjali Das',  email: 'anjali@classynkify.edu' }, submittedAt: '2026-05-09', content: 'All 20 elements filled correctly.', grade: 40 },
    ],
  },
  {
    _id: 'a5',
    title: 'Sorting Algorithms Implementation',
    course: { _id: 'c5', title: 'Computer Science — Grade 12' },
    description: 'Implement bubble sort, merge sort and quicksort in Python. Include time complexity analysis.',
    dueDate: '2026-06-25',
    totalMarks: 60,
    status: 'active',
    createdAt: '2026-05-22',
    submissions: [
      { _id: 'sub7', student: { name: 'Meera Joshi',  email: 'meera@classynkify.edu'  }, submittedAt: '2026-05-27', content: 'GitHub link: https://github.com/meera/sorting-algos', grade: null },
      { _id: 'sub8', student: { name: 'Vikram Nair',  email: 'vikram@classynkify.edu' }, submittedAt: '2026-05-26', content: 'All three algorithms with O(n) analysis in comments.', grade: 54 },
    ],
  },
]

// Student-view assignments (for logged-in student Rohan Sharma who is enrolled in c1, c2)
export const MOCK_ASSIGNMENTS_STUDENT = [
  {
    _id: 'a1',
    title: 'Algebra Problem Set 1',
    course: 'Mathematics — Grade 10',
    description: 'Solve all 20 problems from Chapter 3. Show all working steps clearly.',
    dueDate: '2026-06-15',
    totalMarks: 100,
    status: 'pending',
    grade: null,
  },
  {
    _id: 'a2',
    title: "Newton's Laws — Lab Report",
    course: 'Physics Fundamentals',
    description: 'Write a detailed lab report on your observations from the pendulum experiment.',
    dueDate: '2026-06-20',
    totalMarks: 50,
    status: 'submitted',
    grade: null,
    submittedAt: '2026-05-22',
  },
  {
    _id: 'a6',
    title: 'Mid-Term: Linear Equations',
    course: 'Mathematics — Grade 10',
    description: 'Answer all 15 questions. Attempt questions 11–15 for bonus marks.',
    dueDate: '2026-05-01',
    totalMarks: 100,
    status: 'graded',
    grade: 85,
    submittedAt: '2026-04-28',
    feedback: 'Good work overall. Needs improvement on word problems.',
  },
  {
    _id: 'a7',
    title: 'Forces & Motion — Worksheet',
    course: 'Physics Fundamentals',
    description: 'Complete the worksheet on Newton\'s three laws with diagrams.',
    dueDate: '2026-04-15',
    totalMarks: 30,
    status: 'overdue',
    grade: null,
  },
  {
    _id: 'a8',
    title: 'Chapter 2 — Velocity Problems',
    course: 'Physics Fundamentals',
    description: 'Solve 10 velocity-time graph problems. Draw graphs neatly.',
    dueDate: '2026-04-05',
    totalMarks: 50,
    status: 'graded',
    grade: 42,
    submittedAt: '2026-04-04',
    feedback: 'Excellent graphs! Minor calculation error on Q7.',
  },
]

// ─────────────────────────────────────────────────────────────
//  GRADES (Student view)
// ─────────────────────────────────────────────────────────────

export const MOCK_GRADES = [
  {
    _id: 'g1',
    assignmentTitle: 'Mid-Term: Linear Equations',
    course: 'Mathematics — Grade 10',
    score: 85,
    submittedAt: '2026-04-28T10:00:00Z',
    feedback: 'Good work overall. Needs improvement on word problems.',
  },
  {
    _id: 'g2',
    assignmentTitle: 'Chapter 2 — Velocity Problems',
    course: 'Physics Fundamentals',
    score: 42,
    submittedAt: '2026-04-04T14:30:00Z',
    feedback: 'Excellent graphs! Minor calculation error on Q7.',
  },
  {
    _id: 'g3',
    assignmentTitle: 'Algebra Basics Quiz',
    course: 'Mathematics — Grade 10',
    score: 92,
    submittedAt: '2026-03-20T09:15:00Z',
    feedback: 'Outstanding performance!',
  },
  {
    _id: 'g4',
    assignmentTitle: 'Introduction to Kinematics',
    course: 'Physics Fundamentals',
    score: 78,
    submittedAt: '2026-03-10T11:00:00Z',
    feedback: 'Good understanding of concepts. Work on showing units.',
  },
  {
    _id: 'g5',
    assignmentTitle: 'Coordinate Geometry Problem Set',
    course: 'Mathematics — Grade 10',
    score: 70,
    submittedAt: '2026-02-25T08:45:00Z',
    feedback: 'Revisit section on slope formulas.',
  },
  {
    _id: 'g6',
    assignmentTitle: "Newton's Laws — Short Answer",
    course: 'Physics Fundamentals',
    score: null,  // pending
    submittedAt: '2026-05-22T16:00:00Z',
    feedback: null,
  },
  {
    _id: 'g7',
    assignmentTitle: 'Algebra Problem Set 1',
    course: 'Mathematics — Grade 10',
    score: null,  // pending
    submittedAt: null,
    feedback: null,
  },
]

// ─────────────────────────────────────────────────────────────
//  STUDENT DASHBOARD SUMMARY
// ─────────────────────────────────────────────────────────────

// Courses the logged-in student (Rohan) is enrolled in
export const MOCK_STUDENT_ENROLLED_COURSES = MOCK_COURSES.filter(c =>
  ['c1', 'c2', 'c3', 'c5'].includes(c._id)
)

export const MOCK_STUDENT_DASHBOARD = {
  enrolledCourses: MOCK_STUDENT_ENROLLED_COURSES,
  pendingAssignments: MOCK_ASSIGNMENTS_STUDENT.filter(a => a.status === 'pending').length,
  completedLessons: 14,
  avgGrade: '81%',
}

// ─────────────────────────────────────────────────────────────
//  COURSE PLAYER (single course detail for student)
//  Returns a course + which lesson IDs are completed
// ─────────────────────────────────────────────────────────────

export function getMockCourseForPlayer(courseId) {
  const course = MOCK_COURSES.find(c => c._id === courseId)
  if (!course) return null
  // Rohan has completed the first few lessons of c1, first 2 of c2
  const completedMap = {
    c1: ['l1_1', 'l1_2', 'l1_3', 'l1_4', 'l1_5', 'l1_6', 'l1_7', 'l1_8'],
    c2: ['l2_1', 'l2_2'],
    c3: [],
    c4: [],
    c5: ['l5_1'],
  }
  return {
    course: {
      ...course,
      lessons: course.lectures,
    },
    completedLessonIds: completedMap[courseId] || [],
  }
}

// ─────────────────────────────────────────────────────────────
//  STUDENT DETAIL (for teacher's student detail page)
// ─────────────────────────────────────────────────────────────

export function getMockStudentDetail(studentId) {
  const student = MOCK_STUDENTS.find(s => s._id === studentId)
  if (!student) return null
  const enrolledCourses = MOCK_COURSES.filter(c => student.enrolledCourses.includes(c._id))
  return {
    ...student,
    enrolledCourseDetails: enrolledCourses,
    recentSubmissions: MOCK_ASSIGNMENTS_TEACHER
      .flatMap(a => a.submissions.filter(() => Math.random() > 0.5))
      .slice(0, 3),
  }
}

// ─────────────────────────────────────────────────────────────
//  BROWSE COURSES (full catalog for the Courses page)
//  These mirror MOCK_COURSES but use the shape CoursesPage expects
//  (with .teacher, .price, .category, .enrolledStudents, .lessons)
// ─────────────────────────────────────────────────────────────

export const MOCK_BROWSE_COURSES = [
  {
    _id: 'c1',
    title: 'Mathematics — Grade 10',
    description: 'Comprehensive algebra, geometry, and trigonometry. Builds a strong foundation for competitive exams.',
    category: 'Mathematics',
    teacher: { name: 'Ananya Kapoor' },
    lessons: Array(12).fill(null),
    enrolledStudents: Array(38).fill(null),
    price: 0,
    isFree: true,
    thumbnail: '',
    color: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
    emoji: '📐',
  },
  {
    _id: 'c2',
    title: 'Physics Fundamentals',
    description: 'Core physics — mechanics, waves, thermodynamics, optics and electrostatics.',
    category: 'Physics',
    teacher: { name: 'Ananya Kapoor' },
    lessons: Array(8).fill(null),
    enrolledStudents: Array(29).fill(null),
    price: 0,
    isFree: true,
    thumbnail: '',
  },
  {
    _id: 'c3',
    title: 'English Literature',
    description: 'Classic and modern literature through critical analysis and creative writing techniques.',
    category: 'General',
    teacher: { name: 'Ananya Kapoor' },
    lessons: Array(5).fill(null),
    enrolledStudents: Array(41).fill(null),
    price: 0,
    isFree: true,
    thumbnail: '',
  },
  {
    _id: 'c4',
    title: 'Chemistry Basics',
    description: 'Atoms, molecules, the periodic table and fundamental chemical reactions for Grade 9.',
    category: 'Science',
    teacher: { name: 'Ananya Kapoor' },
    lessons: Array(7).fill(null),
    enrolledStudents: Array(15).fill(null),
    price: 0,
    isFree: true,
    thumbnail: '',
  },
  {
    _id: 'c5',
    title: 'Computer Science — Grade 12',
    description: 'Data structures, algorithms, OOP and programming fundamentals for board and competitive exams.',
    category: 'Programming',
    teacher: { name: 'Ananya Kapoor' },
    lessons: Array(6).fill(null),
    enrolledStudents: Array(22).fill(null),
    price: 0,
    isFree: true,
    thumbnail: '',
  },
  {
    _id: 'c6',
    title: 'Biology — Grade 11',
    description: 'Cells, genetics, human physiology and ecosystems. Board exam and Olympiad preparation.',
    category: 'Science',
    teacher: { name: 'Ananya Kapoor' },
    lessons: Array(10).fill(null),
    enrolledStudents: Array(34).fill(null),
    price: 0,
    isFree: true,
    thumbnail: '',
  },
  {
    _id: 'c7',
    title: 'Web Development Basics',
    description: 'HTML, CSS and JavaScript from scratch. Build real-world web pages and understand browser fundamentals.',
    category: 'Programming',
    teacher: { name: 'Ananya Kapoor' },
    lessons: Array(9).fill(null),
    enrolledStudents: Array(47).fill(null),
    price: 0,
    isFree: true,
    thumbnail: '',
  },
  {
    _id: 'c8',
    title: 'Environmental Science',
    description: 'Climate change, biodiversity, pollution and sustainable development for general studies.',
    category: 'Science',
    teacher: { name: 'Ananya Kapoor' },
    lessons: Array(6).fill(null),
    enrolledStudents: Array(19).fill(null),
    price: 0,
    isFree: true,
    thumbnail: '',
  },
]

// ─────────────────────────────────────────────────────────────
//  NOTIFICATIONS
// ─────────────────────────────────────────────────────────────

export const MOCK_NOTIFICATIONS = [
  {
    id: 'n1',
    type: 'assignment',
    title: 'Assignment Due Soon',
    message: 'Algebra Problem Set 1 is due on June 15.',
    time: '2 hours ago',
    read: false,
    icon: '📋',
  },
  {
    id: 'n2',
    type: 'grade',
    title: 'Grade Posted',
    message: 'You scored 85/100 on Mid-Term: Linear Equations.',
    time: '1 day ago',
    read: false,
    icon: '🎯',
  },
  {
    id: 'n3',
    type: 'course',
    title: 'New Lesson Available',
    message: 'Lesson 9 — Heights and Distances added to Mathematics.',
    time: '2 days ago',
    read: true,
    icon: '📚',
  },
  {
    id: 'n4',
    type: 'announcement',
    title: 'Class Announcement',
    message: 'Physics lab session rescheduled to Friday 10 AM.',
    time: '3 days ago',
    read: true,
    icon: '📢',
  },
  {
    id: 'n5',
    type: 'grade',
    title: 'Assignment Graded',
    message: "Newton's Laws Lab Report graded — check your feedback.",
    time: '4 days ago',
    read: true,
    icon: '✅',
  },
]