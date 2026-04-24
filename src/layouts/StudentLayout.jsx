// src/layouts/StudentLayout.jsx
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

const NAV = [
  { to: '/student/dashboard',    label: '🏠 Dashboard'    },
  { to: '/student/assignments',  label: '📝 Assignments'  },
  { to: '/student/grades',       label: '📊 Grades'       },
  { to: '/student/doubt-solver', label: '🤖 Doubt Solver' },
  { to: '/student/profile',      label: '👤 Profile'      },
]

export default function StudentLayout() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* Navbar */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 shadow-sm">
        <span className="text-lg font-bold text-indigo-600 tracking-tight">Classynkify</span>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                 ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 hidden sm:block">
            {user?.firstName} {user?.lastName}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-50 text-red-600 px-3 py-1.5 rounded-md hover:bg-red-100 transition-colors font-medium"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Page content — Outlet renders the matched child route */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>

    </div>
  )
}