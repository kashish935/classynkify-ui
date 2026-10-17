import axiosInstance from '../api/axiosInstance'

// All teacher-side assignment calls live here.

export const getTeacherAssignments = async () => {
  const { data } = await axiosInstance.get('/teacher/assignments')
  return data.assignments || []
}

export const getTeacherCourseOptions = async () => {
  const { data } = await axiosInstance.get('/teacher/courses')
  return (data.courses || []).map((c) => ({ _id: c._id, title: c.title }))
}

export const createTeacherAssignment = async (form) => {
  const { data } = await axiosInstance.post('/teacher/assignments', {
    title: form.title,
    courseId: form.courseId,
    courseName: form.courseName,
    description: form.description,
    dueDate: form.dueDate,
    totalMarks: form.totalMarks,
  })
  return data.assignment
}

export const setTeacherAssignmentStatus = async (id, status) => {
  const { data } = await axiosInstance.patch(`/teacher/assignments/${id}/status`, { status })
  return data
}

export const deleteTeacherAssignment = async (id) => {
  const { data } = await axiosInstance.delete(`/teacher/assignments/${id}`)
  return data
}

export const gradeTeacherSubmission = async (assignmentId, submissionId, grade, feedback) => {
  const { data } = await axiosInstance.put(
    `/teacher/assignments/${assignmentId}/submissions/${submissionId}/grade`,
    { grade, feedback }
  )
  return data // { _id, grade, feedback }
}

export const apiError = (err, fallback = 'Something went wrong') =>
  err?.response?.data?.message || fallback
