import { createRouter, createWebHistory } from 'vue-router'
// import { useAuthStore } from '@/stores/auth'
import DashboardView from '@/views/DashboardView.vue'
import LoginView from '@/views/LoginView.vue'
import ShowInventories from '@/views/Admin/Inventories/ShowInventories.vue'

import ShowProduct from '@/views/Admin/Product/ShowProduct.vue'
import CreateProduct from '@/views/Admin/Product/CreateProduct.vue'

import OrderMenu from '@/views/Cashier/OrderMenu.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'login', component: LoginView },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: '/inventories',
      name: 'inventories',
      component: ShowInventories,
      meta: { requiresAuth: true },
    },
    {
      path: '/order',
      name: 'order-menu',
      component: OrderMenu,
      meta: { requiresAuth: true },
    },
    {
      path: '/products',
      name: 'products',
      component: ShowProduct,
      meta: { requiresAuth: true },
    },
    {
      path: '/products/create',
      name: 'create-product',
      component: CreateProduct,
      meta: { requiresAuth: true },
    },
  ],
})

export default router

// router.beforeEach(async (to, from, next) => {
//   const auth = useAuthStore()

//   // Jika belum ambil user
//   if (!auth.user && localStorage.getItem('accessToken')) {
//     await auth.fetchUser()
//   }

//   // Jika butuh auth tapi belum login
//   if (to.meta.requiresAuth && !auth.isAuthenticated) {
//     next('/')
//   } else {
//     next()
//   }
// })
