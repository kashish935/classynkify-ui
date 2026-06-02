import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'

import Login    from './pages/Login'
import Register from './pages/Register'

// Student
import StudentLayout from './layouts/StudentLayout'
import Dashboard     from './pages/student/Dashboard'
import CoursePlayer  from './pages/student/CoursePlayer'
import Assignments   from './pages/student/Assignments'
import Grades        from './pages/student/Grades'
import Profile       from './pages/student/Profile'
import DoubtSolver   from './pages/student/DoubtSolver'
import CoursesPage   from './pages/student/CoursesPage'

// Teacher
import TeacherLayout      from './layouts/TeacherLayout'
import TeacherDashboard   from './pages/teacher/TeacherDashboard'
import MyCourses          from './pages/teacher/MyCourses'
import CreateCourse       from './pages/teacher/CreateCourse'
import CourseDetail       from './pages/teacher/CourseDetail'
import TeacherAssignments from './pages/teacher/Assignments'
import TeacherProfile     from './pages/Profile'
import Students           from './pages/Students'
import StudentDetail      from './pages/StudentDetail'
import Settings           from './pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Root → login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ─── Student (protected + nested) ─── */}
          <Route
            path="/student"
            element={
              <PrivateRoute allowedRole="student">
                <StudentLayout />
              </PrivateRoute>
            }
          >
            <Route index                    element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"         element={<Dashboard />} />
            <Route path="courses"           element={<CoursesPage />} />
            <Route path="courses/:courseId" element={<CoursePlayer />} />
            <Route path="assignments"       element={<Assignments />} />
            <Route path="grades"            element={<Grades />} />
            <Route path="profile"           element={<Profile />} />
            <Route path="doubt-solver"      element={<DoubtSolver />} />
          </Route>

          {/* ─── Teacher (protected + nested) ─── */}
          <Route
            path="/teacher"
            element={
              <PrivateRoute allowedRole="teacher">
                <TeacherLayout />
              </PrivateRoute>
            }
          >
            <Route index                        element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"             element={<TeacherDashboard />} />
            <Route path="courses"               element={<MyCourses />} />
            <Route path="courses/create"        element={<CreateCourse />} />
            <Route path="courses/:id"           element={<CourseDetail />} />
            <Route path="assignments"           element={<TeacherAssignments />} />
            <Route path="students"              element={<Students />} />
            <Route path="students/:studentId"   element={<StudentDetail />} />
            <Route path="profile"               element={<TeacherProfile />} />
            <Route path="settings"              element={<Settings />} />
          </Route>

          {/* Unauthorized */}
          <Route
            path="/unauthorized"
            element={
              <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#ef4444', fontSize: '18px' }}>
                  ⛔ You are not authorized to view this page.
                </p>
              </div>
            }
          />

          {/* Catch-all → login */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>

        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </BrowserRouter>
  )
}