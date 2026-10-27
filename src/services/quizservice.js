import axiosInstance from '../api/axiosInstance'

// Quiz calls to the backend (mounted at /api/student/quiz).

// payload: { courseId, scope: 'all' | 'completed', difficulty, count, topic }
export const generateQuiz = async (payload) => {
  // Gemini can take a few seconds, so allow a longer timeout than usual
  const { data } = await axiosInstance.post('/student/quiz/generate', payload, { timeout: 60000 })
  return data.quiz // { _id, topic, difficulty, questions: [{ _id, question, options }] }
}

// answers: array with the chosen option index per question, -1 = unanswered
export const submitQuiz = async (quizId, answers) => {
  const { data } = await axiosInstance.post(`/student/quiz/${quizId}/submit`, { answers })
  return data // { score, total, review: [{ question, options, yourAnswer, correctIndex, explanation }] }
}

export const getQuizHistory = async () => {
  const { data } = await axiosInstance.get('/student/quiz/history')
  return data.history || []
}