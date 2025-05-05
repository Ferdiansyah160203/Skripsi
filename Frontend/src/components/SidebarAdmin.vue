<template>
  <!-- Desktop Sidebar -->
  <aside class="bg-white shadow-lg w-64 h-screen hidden md:flex flex-col">
    <div class="p-4">
      <h2
        class="text-2xl font-bold bg-gradient-to-r from-sky-400 to-purple-500 text-transparent bg-clip-text"
      >
        Kedai Delima
      </h2>
    </div>
    <nav class="flex-1 overflow-y-auto">
      <ul class="py-4 space-y-1">
        <li v-for="item in navItems" :key="item.to">
          <div>
            <router-link
              :to="item.to"
              class="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              :class="{ 'bg-indigo-100 text-indigo-700 font-semibold': isActiveRoute(item.to) }"
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
    class="fixed left-0 top-0 z-50 w-64 h-full bg-white shadow-lg p-4 flex flex-col md:hidden transition-transform duration-300"
  >
    <div class="flex justify-between items-center border-b pb-2">
      <h2 class="text-xl font-bold text-indigo-600">POS Admin</h2>
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
              :class="{ 'bg-indigo-100 text-indigo-700 font-semibold': isActiveRoute(item.to) }"
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
                    'bg-indigo-100 text-indigo-700 font-semibold': isActiveRoute(child.to),
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
import { useRoute } from 'vue-router'
import {
  LayoutDashboard,
  Users,
  Settings,
  PackageSearch,
  Box,
  Tag,
  ShoppingCart,
  Boxes,
  SendToBack,
} from 'lucide-vue-next' // Pastikan kamu sudah install: `npm i lucide-vue-next`

defineProps({
  isOpen: Boolean,
})

const route = useRoute()

function isActiveRoute(path) {
  return route.path.startsWith(path)
}

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Order', to: '/order', icon: SendToBack },
  {
    label: 'Products',
    to: '/admin/products',
    icon: PackageSearch,
    children: [
      { label: 'All Products', to: '/admin/products/all', icon: Box },
      { label: 'Categories', to: '/admin/products/categories', icon: Tag },
    ],
  },
  { label: 'Inventories', to: '/inventories', icon: Boxes },
  { label: 'Transactions', to: '/admin/transactions', icon: ShoppingCart },
  { label: 'Member', to: '/admin/users', icon: Users },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
]
</script>
