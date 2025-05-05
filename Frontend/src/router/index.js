import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import LoginView from '@/views/LoginView.vue'
import ShowInventories from '@/views/Inventories/ShowInventories.vue'
import OrderMenu from '@/views/OrderMenu.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'login', component: LoginView },
    { path: '/dashboard', name: 'dashboard', component: DashboardView },
    { path: '/inventories', name: 'inventories', component: ShowInventories },
    { path: '/order', name: 'order-menu', component: OrderMenu },
  ],
})

export default router
