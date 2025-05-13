import { createRouter, createWebHistory } from 'vue-router'

import DashboardView from '@/views/DashboardView.vue'
import LoginView from '@/views/LoginView.vue'
import ShowInventories from '@/views/Admin/Inventories/ShowInventories.vue'
import ShowProduct from '@/views/Admin/Product/ShowProduct.vue'
import CreateProduct from '@/views/Admin/Product/ProductModal.vue'

import OrderMenu from '@/views/Cashier/Order/OrderMenu.vue'
import PaymentMenu from '@/views/Cashier/Order/PaymentMenu.vue'
import ShowMember from '@/views/Cashier/Member/ShowMember.vue'

import ShowTransaction from '@/views/Admin/Transaction/ShowTransaction.vue'

// (Opsional) Halaman 403 jika ingin
import UnauthorizedView from '@/views/UnauthorizedView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'login', component: LoginView },

    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true, allowedRoles: ['admin'] },
    },
    {
      path: '/inventories',
      name: 'inventories',
      component: ShowInventories,
      meta: { requiresAuth: true, allowedRoles: ['admin'] },
    },
    {
      path: '/products',
      name: 'products',
      component: ShowProduct,
      meta: { requiresAuth: true, allowedRoles: ['admin'] },
    },
    {
      path: '/products/create',
      name: 'create-product',
      component: CreateProduct,
      meta: { requiresAuth: true, allowedRoles: ['admin'] },
    },

    {
      path: '/order',
      name: 'order-menu',
      component: OrderMenu,
      meta: { requiresAuth: true, allowedRoles: ['cashier'] },
    },

    {
      path: '/order/:id?',
      name: 'order-edit',
      component: OrderMenu,
      meta: { requiresAuth: true, allowedRoles: ['cashier'] },
    },
    {
      path: '/payment/:id',
      name: 'payment-menu',
      component: PaymentMenu,
      meta: { requiresAuth: true, allowedRoles: ['cashier'] },
    },
    {
      path: '/members',
      name: 'members',
      component: ShowMember,
      meta: { requiresAuth: true, allowedRoles: ['cashier'] },
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: ShowTransaction,
      meta: { requiresAuth: true, allowedRoles: ['admin'] },
    },

    // Untuk Akses yang tidak diizinkan
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: UnauthorizedView,
    },
  ],
})

// Middleware: Cek login dan role
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('accessToken')
  const userRole = localStorage.getItem('userRole') // bisa 'admin', 'cashier', atau null

  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      return next({ path: '/' }) // belum login
    }

    if (to.meta.allowedRoles && !to.meta.allowedRoles.includes(userRole)) {
      return next({ path: '/unauthorized' }) // tidak punya hak akses
    }
  }

  next()
})

export default router
