<template>
  <div class="h-screen flex overflow-hidden">
    <!-- Sidebar -->
    <Sidebar :isOpen="isSidebarOpen" @toggle-sidebar="toggleSidebar" />

    <!-- Navbar fixed -->
    <Navbar
      @toggle-sidebar="toggleSidebar"
      @logout="logout"
      :class="[
        'fixed top-0 h-16 z-20 transition-all duration-300',
        isSidebarOpen ? 'left-0 right-0 md:left-64 md:right-0' : 'left-0 right-0',
      ]"
    />
    <!-- Main content -->
    <div
      :class="[
        'flex-1 mt-16 overflow-y-auto bg-gray-100 transition-all duration-300',
        isSidebarOpen ? 'md:ml-64' : 'md:ml-0',
      ]"
    >
      <slot />
    </div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/SidebarAdmin.vue'
import Navbar from '@/components/NavbarAdmin.vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const isSidebarOpen = ref(false)

// Function to check if screen is mobile
const checkMobile = () => {
  return window.innerWidth < 768
}

// Initialize sidebar state based on screen size
onMounted(() => {
  isSidebarOpen.value = !checkMobile()

  // Listen for window resize
  window.addEventListener('resize', () => {
    // Only close sidebar automatically on mobile when it's open
    if (checkMobile() && isSidebarOpen.value) {
      isSidebarOpen.value = false
    }
    // On desktop, keep the previous state
  })
})

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const router = useRouter()
const logout = () => {
  localStorage.removeItem('accessToken')
  router.push('/')
}
</script>
