<template>
  <div class="h-full grid md:grid-cols-[16rem_1fr] bg-gray-100">
    <Sidebar :isOpen="isSidebarOpen" @toggle-sidebar="toggleSidebar" />
    <!-- Main area -->
    <div class="flex flex-col">
      <Navbar @toggle-sidebar="toggleSidebar" @logout="logout" />
      <main class="flex-1 p-6">
        <slot />
      </main>
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
