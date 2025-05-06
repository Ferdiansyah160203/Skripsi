// utils/axios.js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

// Interceptor untuk attach Authorization
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor untuk refresh token jika token kadaluarsa
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/users/token`,
          {},
          { withCredentials: true },
        )
        const newToken = res.data.accessToken
        localStorage.setItem('accessToken', newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      } catch (err) {
        console.error('Gagal refresh token', err)
      }
    }
    return Promise.reject(error)
  },
)

export default api
