<template>
  <header
    class="fixed top-0 left-0 right-0 h-16 bg-white shadow px-4 flex items-center justify-between z-20"
  >
    <!-- Toggle Sidebar Button (Mobile & Desktop) -->
    <button
      @click="$emit('toggle-sidebar')"
      class="text-gray-600 hover:text-gray-800 focus:outline-none"
    >
      <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <!-- Title -->
    <h1 class="text-lg font-semibold text-gray-800">{{ currentPageTitle }}</h1>

    <!-- Right side buttons -->
    <div class="flex items-center space-x-2">
      <!-- Settings Button (Admin Only) -->
      <button
        v-if="userRole === 'admin'"
        @click="goToSettings"
        class="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
        title="Settings"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>

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
    </div>
  </header>
</template>

<script>
import { useRouter, useRoute } from 'vue-router'
import { ref, computed, onMounted } from 'vue'

export default {
  setup() {
    const router = useRouter()
    const route = useRoute()
    const userRole = ref('')

    onMounted(() => {
      userRole.value = localStorage.getItem('userRole') || ''
    })

    // Computed property to get current page title
    const currentPageTitle = computed(() => {
      const path = route.path

      // Map routes to their display names
      const routeTitles = {
        '/dashboard': 'Dashboard',
        '/products': 'Products',
        '/products/create': 'Create Product',
        '/inventories': 'Inventories',
        '/stock-opname': 'Stock Opname',
        '/stock-opname/create': 'Create Stock Opname',
        '/transactions': 'Report',
        '/order': 'Order',
        '/members': 'Member',
        '/transaction/cashier': 'Transaction',
        '/cek-point': 'Point Member',
      }

      // Check for exact match first
      if (routeTitles[path]) {
        return routeTitles[path]
      }

      // Check for partial matches (for routes with parameters)
      for (const [routePath, title] of Object.entries(routeTitles)) {
        if (path.startsWith(routePath)) {
          return title
        }
      }

      // Special cases for dynamic routes
      if (path.includes('/stock-opname/show/')) {
        return 'Stock Opname Detail'
      }
      if (path.includes('/order/')) {
        return 'Order'
      }
      if (path.includes('/payment/')) {
        return 'Payment'
      }

      // Default fallback
      return 'Dashboard'
    })

    const handleLogout = () => {
      localStorage.removeItem('authToken') // Ganti jika pakai accessToken
      localStorage.removeItem('userRole')
      router.push('/')
    }

    const goToSettings = () => {
      router.push('/admin/settings')
    }

    return {
      handleLogout,
      goToSettings,
      userRole,
      currentPageTitle,
    }
  },
}
</script>
