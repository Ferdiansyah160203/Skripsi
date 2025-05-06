<template>
  <div class="min-h-screen grid grid-cols-1 md:grid-cols-2">
    <!-- Left Side - Gambar -->
    <div class="hidden md:flex items-center justify-center bg-blue-600 text-white">
      <img src="@/assets/login.jpg" alt="POS Illustration" class="w-full h-full object-cover" />
    </div>

    <!-- Right Side - Login Form -->
    <div class="flex items-center justify-center bg-gradient-to-r from-sky-300 to-indigo-300 p-6">
      <div class="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Login ke POS</h2>
        <form @submit.prevent="loginAdmin" class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              v-model="email"
              id="email"
              type="email"
              required
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              v-model="password"
              id="password"
              type="password"
              required
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
          <button
            type="submit"
            class="w-full bg-sky-600 text-white font-semibold py-2 px-4 rounded-xl hover:bg-sky-700 transition"
          >
            Login
          </button>
          <p v-if="msg" class="text-red-500 text-sm mt-2 text-center">{{ msg }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import api from '/utils/axios.js'

export default {
  name: 'LoginAdmin',
  data() {
    return {
      email: '',
      password: '',
      msg: '',
    }
  },
  methods: {
    async loginAdmin() {
      // Validate input fields
      if (!this.email || !this.password) {
        this.msg = 'Email dan password wajib diisi!'
        return
      }

      // Basic email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.email)) {
        this.msg = 'Format email tidak valid!'
        return
      }

      try {
        // Step 1: Login untuk mendapatkan token
        const loginResponse = await api.post('api/users/login', {
          email: this.email,
          password: this.password,
        })

        const token = loginResponse.data.accessToken
        if (!token) {
          this.msg = 'Login gagal. Token tidak ditemukan.'
          return
        }

        // Simpan token
        localStorage.setItem('accessToken', token)

        console.log('Token:', token)
        const userResponse = await api.get('api/users/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const role = userResponse.data.role
        localStorage.setItem('userRole', role)

        if (role === 'admin') {
          this.$router.push('/dashboard')
        } else if (role === 'cashier') {
          this.$router.push('/order')
        } else {
          this.msg = 'Role tidak dikenali.'
        }
      } catch (error) {
        console.error(error)

        // Handle specific error scenarios
        if (error.response) {
          if (error.response.status === 401) {
            this.msg = 'Email atau password salah.'
          } else if (error.response.status === 403) {
            this.msg = 'Akses ditolak. Hubungi admin.'
          } else {
            this.msg = error.response.data.message || 'Login gagal. Silakan coba lagi.'
          }
        } else {
          this.msg = 'Terjadi kesalahan jaringan. Silakan coba lagi.'
        }
      } finally {
        // Clear sensitive data
        this.password = ''
      }
    },
  },
}
</script>
