import api from './api'

// Same axios instance your teacher pages already use, so the login token is sent
export async function fetchNotifications(role = 'teacher') {
  const { data } = await api.get(`/${role}/notifications`)
  return Array.isArray(data) ? data : data?.notifications || []
}