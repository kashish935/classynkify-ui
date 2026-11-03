import axiosInstance from '../api/axiosInstance'

// Uploaded photos are saved by the backend as "/uploads/..." and served from the
// same host as the API (without the "/api" part). This turns a saved path into a full URL.
export const fileUrl = (p) => {
  if (!p) return ''
  if (/^https?:\/\//i.test(p)) return p
  const origin = String(axiosInstance.defaults.baseURL || '').replace(/\/api\/?$/, '')
  return origin + p
}