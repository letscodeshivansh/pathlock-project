import axios from 'axios'
import { getToken, clearToken } from './auth'

const api = axios.create({
  baseURL: 'http://localhost:5000',
})

api.interceptors.request.use(cfg => {
  const token = getToken()
  if (token) {
    if (!cfg.headers) cfg.headers = {}
    // @ts-ignore simple assignment to headers
    cfg.headers['Authorization'] = `Bearer ${token}`
  }
  return cfg
})

// If unauthorized, clear token so UI can react
api.interceptors.response.use(
  res => res,
  err => {
    if (err?.response?.status === 401) {
      clearToken()
      // optional: window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
