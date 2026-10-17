import axiosInstance from '../api/axiosInstance'

// All student-side calls to the backend live here.

export const getBrowseCourses = async () => {
  const { data } = await axiosInstance.get('/student/courses')
  return data.courses || []
}

export const getEnrolledCourses = async () => {
  const { data } = await axiosInstance.get('/student/courses/enrolled')
  return data.courses || []
}

export const enrollInCourse = async (courseId) => {
  const { data } = await axiosInstance.post(`/student/courses/${courseId}/enroll`)
  return data
}

export const getCoursePlayer = async (courseId) => {
  const { data } = await axiosInstance.get(`/student/courses/${courseId}`)
  return data // { course, completedLessonIds, progress, lastLessonId }
}

export const setLessonComplete = async (courseId, lessonId, completed) => {
  const { data } = await axiosInstance.post(
    `/student/courses/${courseId}/lessons/${lessonId}/complete`,
    { completed }
  )
  return data // { completedLessonIds, progress, courseCompleted }
}

export const getStudentDashboard = async () => {
  const { data } = await axiosInstance.get('/student/dashboard')
  return data // { enrolledCourses, stats }
}

export const getStudentNotifications = async () => {
  const { data } = await axiosInstance.get('/student/notifications')
  return data.notifications || []
}

export const apiError = (err, fallback = 'Something went wrong') =>
  err?.response?.data?.message || fallback

export const getStudentAssignments = async () => {
  const { data } = await axiosInstance.get('/student/assignments')
  return data.assignments || []
}

export const submitAssignment = async (assignmentId, content) => {
  const { data } = await axiosInstance.post(`/student/assignments/${assignmentId}/submit`, { content })
  return data
}

export const getStudentGrades = async () => {
  const { data } = await axiosInstance.get('/student/grades')
  return data.grades || []
}
