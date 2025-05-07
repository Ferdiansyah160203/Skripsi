<template>
  <header
    class="fixed top-0 left-0 right-0 h-16 bg-white shadow px-4 flex items-center justify-between z-20"
  >
    <!-- Toggle Sidebar Button (Mobile Only) -->
    <button
      @click="$emit('toggle-sidebar')"
      class="md:hidden text-gray-600 hover:text-gray-800 focus:outline-none"
    >
      <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <!-- Title -->
    <h1 class="text-lg font-semibold text-gray-800">Dashboard</h1>

    <!-- Logout -->
    <button
      @click="handleLogout"
      class="flex items-center space-x-2 text-sm text-red-500 hover:text-red-600 focus:outline-none"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
        />
      </svg>
      <span class="hidden md:inline font-medium">Logout</span>
    </button>
  </header>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  setup() {
    const router = useRouter()

    const handleLogout = () => {
      localStorage.removeItem('authToken') // Ganti jika pakai accessToken
      router.push('/')
    }

    return {
      handleLogout,
    }
  },
}
</script>
