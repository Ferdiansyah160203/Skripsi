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
        <form @submit.prevent="handleLogin" class="space-y-4">
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
          <p v-if="error" class="text-red-500 text-sm mt-2 text-center">{{ error }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const handleLogin = async () => {
  try {
    const res = await axios.post('/api/login', {
      email: email.value,
      password: password.value,
    })

    const { accessToken } = res.data
    localStorage.setItem('accessToken', accessToken)

    router.push('/dashboard')
  } catch (err) {
    err.value = 'Login gagal. Periksa email dan password.'
  }
}
</script>
