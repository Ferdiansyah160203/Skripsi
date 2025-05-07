<template>
  <div class="h-screen flex overflow-hidden">
    <!-- Sidebar fixed -->
    <Sidebar
      :isOpen="isSidebarOpen"
      @toggle-sidebar="toggleSidebar"
      class="fixed top-0 left-0 w-64 h-screen z-30 hidden md:block"
    />
    <!-- Navbar fixed -->
    <Navbar
      @toggle-sidebar="toggleSidebar"
      @logout="logout"
      class="fixed top-0 left-64 right-0 h-16 z-20"
    />
    <!-- Main content -->
    <div class="flex-1 mt-16 overflow-y-auto bg-gray-100">
      <slot />
    </div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/SidebarAdmin.vue'
import Navbar from '@/components/NavbarAdmin.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const isSidebarOpen = ref(true)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const router = useRouter()
const logout = () => {
  localStorage.removeItem('accessToken')
  router.push('/')
}
</script>
