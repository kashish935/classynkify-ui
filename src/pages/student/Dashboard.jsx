import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axiosInstance'
import StatsRow from '../../components/student/StatsRow'
import EnrolledCourses from '../../components/student/EnrolledCourses'
import Announcements from '../../components/student/Announcements'
import { toast } from 'react-toastify'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats]               = useState(null)
  const [courses, setCourses]           = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get('/student/dashboard')
        setStats(data.stats)
        setCourses(data.courses)
        setAnnouncements(data.announcements || [])
      } catch (err) {
        toast.error('Could not load dashboard')
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-400">
      Loading dashboard...
    </div>
  )

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Here's what's happening with your courses today.
        </p>
      </div>

      <StatsRow stats={stats} />
      <EnrolledCourses courses={courses} />
      <Announcements announcements={announcements} />
    </div>
  )
}