import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'

import Login        from './pages/Login'
import Register     from './pages/Register'

import StudentLayout from './layouts/StudentLayout'
import Dashboard     from './pages/student/Dashboard'
import CoursePlayer  from './pages/student/CoursePlayer'
import Assignments   from './pages/student/Assignments'
import Grades        from './pages/student/Grades'
import Profile       from './pages/student/Profile'
import DoubtSolver   from './pages/student/DoubtSolver'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Public */}
          <Route path="/login"        element={<Login />} />
          <Route path="/register"     element={<Register />} />

          {/* Student (protected + nested) */}
          <Route
            path="/student"
            element={
              <PrivateRoute allowedRole="student">
                <StudentLayout />
              </PrivateRoute>
            }
          >
            {/* /student → /student/dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />

            <Route path="dashboard"          element={<Dashboard />} />
            <Route path="courses/:courseId"  element={<CoursePlayer />} />
            <Route path="assignments"        element={<Assignments />} />
            <Route path="grades"             element={<Grades />} />
            <Route path="profile"            element={<Profile />} />
            <Route path="doubt-solver"       element={<DoubtSolver />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/student/dashboard" replace />} />

        </Routes>

        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </BrowserRouter>
  )
}