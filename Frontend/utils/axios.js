import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// Tambahkan interceptor untuk request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Tambahkan interceptor untuk response
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Jika token kedaluwarsa
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/token`, {
          refreshToken,
        })

        const newToken = response.data.token
        localStorage.setItem('token', newToken)

        // Tambahkan token baru ke header dan ulangi request
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError)
        // Redirect ke login jika refresh token gagal
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  },
)

export default api
