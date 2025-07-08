<template>
  <!-- Desktop Sidebar -->
  <aside
    :class="[
      'bg-white shadow-lg w-64 h-screen flex-col fixed top-0 left-0 z-30 transition-transform duration-300',
      'hidden md:flex',
      isOpen ? 'md:translate-x-0' : 'md:-translate-x-full',
    ]"
  >
    <div class="p-4 flex justify-between items-center">
      <h2
        class="text-2xl font-bold bg-gradient-to-r from-sky-400 to-purple-500 text-transparent bg-clip-text"
      >
        Kedai Delima
      </h2>
      <button
        @click="$emit('toggle-sidebar')"
        class="text-gray-500 hover:text-gray-700 focus:outline-none"
      ></button>
    </div>
    <nav class="flex-1 overflow-y-auto">
      <ul class="py-4 space-y-1">
        <li v-for="item in navItems" :key="item.to">
          <div>
            <router-link
              :to="item.to"
              class="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-[#db3a3feb] rounded-md"
              :class="{ 'bg-[#DB3A40] text-white font-semibold': isActiveRoute(item.to) }"
            >
              <component :is="item.icon" class="w-5 h-5" />
              {{ item.label }}
            </router-link>
            <!-- Submenu -->
            <ul v-if="item.children" class="ml-6 mt-2 space-y-1">
              <li v-for="child in item.children" :key="child.to">
                <router-link
                  :to="child.to"
                  class="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                  :class="{
                    'bg-indigo-100 text-indigo-700 font-semibold': isActiveRoute(child.to),
                  }"
                >
                  <component :is="child.icon" class="w-4 h-4" />
                  {{ child.label }}
                </router-link>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </nav>
  </aside>

  <!-- Mobile Sidebar Overlay -->
  <div
    v-if="isOpen"
    class="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
    @click="$emit('toggle-sidebar')"
  ></div>

  <!-- Mobile Sidebar Drawer -->
  <div
    v-if="isOpen"
    class="fixed left-0 top-0 z-50 w-64 h-full bg-white shadow-lg p-4 flex flex-col md:hidden transition-transform duration-300 transform"
  >
    <div class="flex justify-between items-center border-b pb-2">
      <h2
        class="text-xl font-bold bg-gradient-to-r from-sky-400 to-purple-500 text-transparent bg-clip-text"
      >
        Kedai Delima
      </h2>
      <button @click="$emit('toggle-sidebar')" class="text-gray-500 hover:text-red-500 text-2xl">
        ✖
      </button>
    </div>
    <nav class="mt-4 flex-1 overflow-y-auto">
      <ul class="space-y-1">
        <li v-for="item in navItems" :key="item.to">
          <div>
            <router-link
              :to="item.to"
              class="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              :class="{ 'bg-[#DB3A40] text-white font-semibold': isActiveRoute(item.to) }"
              @click="$emit('toggle-sidebar')"
            >
              <component :is="item.icon" class="w-5 h-5" />
              {{ item.label }}
            </router-link>
            <!-- Submenu -->
            <ul v-if="item.children" class="ml-6 mt-2 space-y-1">
              <li v-for="child in item.children" :key="child.to">
                <router-link
                  :to="child.to"
                  class="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                  :class="{
                    'bg-[#DB3A40] text-white font-semibold': isActiveRoute(child.to),
                  }"
                  @click="$emit('toggle-sidebar')"
                >
                  <component :is="child.icon" class="w-4 h-4" />
                  {{ child.label }}
                </router-link>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  LayoutDashboard,
  Users,
  FileText,
  ShoppingBasket,
  Box,
  SendToBack,
  PackageCheck,
} from 'lucide-vue-next'

defineProps({
  isOpen: Boolean,
})

const route = useRoute()

function isActiveRoute(path) {
  return route.path.startsWith(path)
}

// Ambil role dari localStorage (atau bisa pakai Pinia/Vuex kalau kamu pakai state management)
const userRole = ref('')

onMounted(() => {
  userRole.value = localStorage.getItem('userRole') || ''
})

// Buat menu berdasarkan role
const navItems = computed(() => {
  if (userRole.value === 'admin') {
    return [
      { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
      {
        label: 'Products',
        to: '/products',
        icon: ShoppingBasket,
      },
      { label: 'Inventories', to: '/inventories', icon: Box },
      { label: 'Stock Opname', to: '/stock-opname', icon: PackageCheck },
      { label: 'Report', to: '/transactions', icon: FileText },
    ]
  } else if (userRole.value === 'cashier') {
    return [
      { label: 'Order', to: '/order', icon: SendToBack },
      { label: 'Member', to: '/members', icon: Users },
      { label: 'Transaction', to: '/transaction/cashier', icon: FileText },
    ]
  } else {
    return [] // kosong jika tidak login atau role tidak dikenal
  }
})
</script>
