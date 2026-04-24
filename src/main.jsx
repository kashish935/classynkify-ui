import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import TeacherDashboard from './pages/TeacherDashboard'
import MyCourses from './pages/MyCourses'
import CreateCourse from './pages/CreateCourse'
import CourseDetail from './pages/CourseDetail'
import './index.css'
import Assignments from './pages/Assignments'
import Students from "./pages/Students";
import StudentDetail from "./pages/StudentDetail";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";


const Unauthorized = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <h1 style={{ fontSize: '22px', color: '#ef4444' }}>Access Denied</h1>
  </div>
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Teacher */}
          <Route path="/dashboard" element={
            <PrivateRoute allowedRole="teacher">
              <TeacherDashboard />
            </PrivateRoute>
          } />
          <Route path="/my-courses" element={
            <PrivateRoute allowedRole="teacher">
              <MyCourses />
            </PrivateRoute>
          } />
          <Route path="/assignments" element={
            <PrivateRoute allowedRole="teacher">
              <Assignments />
            </PrivateRoute>
          } />
          <Route path="/create-course" element={
            <PrivateRoute allowedRole="teacher">
              <CreateCourse />
            </PrivateRoute>
          } />
          <Route path="/course/:id" element={
            <PrivateRoute allowedRole="teacher">
              <CourseDetail />
            </PrivateRoute>
          } />

          <Route path="/students" element={
            <PrivateRoute role="teacher">
            <Students />
            </PrivateRoute>
            } />

          <Route path="/students/:studentId" element={
            <PrivateRoute role="teacher">
            <StudentDetail />
            </PrivateRoute>
            } />

            <Route path="/profile"  element={
              <PrivateRoute>
              <Profile />
              </PrivateRoute>
              } />
              
            <Route path="/settings" element={
              <PrivateRoute>
              <Settings />
              </PrivateRoute>
              } />

          {/* Default */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)