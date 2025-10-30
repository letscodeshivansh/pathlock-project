import axios from 'axios';

import {
  clearToken,
  getToken,
} from './auth';

const api = axios.create({
  baseURL: 'http://localhost:5000',
})

api.interceptors.request.use(cfg => {
  const token = getToken()
  if (token) {
  const headers: any = cfg.headers ?? {}
  headers['Authorization'] = `Bearer ${token}`
  cfg.headers = headers
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
