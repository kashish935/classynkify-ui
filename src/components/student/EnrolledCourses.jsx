import { useNavigate } from 'react-router-dom'

export default function EnrolledCourses({ courses }) {
  const navigate = useNavigate()

  if (!courses.length) return (
    <div className="text-center py-10 text-gray-400">
      You haven't enrolled in any courses yet.
    </div>
  )

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-700 mb-4">My Courses</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map(course => (
          <div
            key={course._id}
            onClick={() => navigate(`/student/courses/${course._id}`)}
            className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
          >
            {/* Thumbnail */}
            <div className="h-36 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              {course.thumbnail
                ? <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                : <span className="text-4xl">📚</span>
              }
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="font-medium text-gray-800 truncate">{course.title}</h3>
              <p className="text-sm text-gray-400 mt-0.5">{course.instructor}</p>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{course.progress ?? 0}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${course.progress ?? 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}