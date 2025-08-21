import axios from 'axios'

const API_BASE = '/api'

const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.reload()
    }
    return Promise.reject(error.response?.data || error)
  }
)

export const api = {
  login: (email, password) => axiosInstance.post('/auth/login', { email, password }),
  getMe: () => axiosInstance.get('/auth/me'),
  getUsers: () => axiosInstance.get('/users'),
  createUser: (userData) => axiosInstance.post('/users', userData),
  deleteUser: (id) => axiosInstance.delete(`/users/${id}`),
  getPayouts: () => axiosInstance.get('/payouts'),
  createPayout: (payoutData) => axiosInstance.post('/payouts', payoutData),
  refreshPayoutStatus: (id) => axiosInstance.post(`/payouts/${id}/refresh`)
}
