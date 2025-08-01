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
import TransactionDetail from '@/views/Cashier/Transaction/TransactionDetail.vue'

import StockOpName from '@/views/Admin/StockOpName/StockOpNameCreate.vue'
import StockOpNameIndex from '@/views/Admin/StockOpName/StockOpNameIndex.vue'
import StockOpNameShow from '@/views/Admin/StockOpName/StockOpNameShow.vue'

import PurchaseList from '@/views/Admin/Purchase/PurchaseList.vue'
import PurchaseForm from '@/views/Admin/Purchase/PurchaseForm.vue'

import UserView from '@/views/Admin/User/UserView.vue'

import PointMember from '@/views/PointMember.vue'

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
      path: '/users',
      name: 'users',
      component: UserView,
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
      path: '/order/:id?',
      name: 'order-menu',
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
      path: '/transaction/cashier',
      name: 'transaction',
      component: TransactionDetail,
      meta: { requiresAuth: true, allowedRoles: ['cashier'] },
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: ShowTransaction,
      meta: { requiresAuth: true, allowedRoles: ['admin'] },
    },
    {
      path: '/stock-opname/create',
      name: 'stock-opname',
      component: StockOpName,
      meta: { requiresAuth: true, allowedRoles: ['admin'] },
    },
    {
      path: '/stock-opname/',
      name: 'stock-opname-index',
      component: StockOpNameIndex,
      meta: { requiresAuth: true, allowedRoles: ['admin'] },
    },
    {
      path: '/stock-opname/show/:session_id',
      name: 'stock-opname-show',
      component: StockOpNameShow,
      meta: { requiresAuth: true, allowedRoles: ['admin'] },
    },
    {
      path: '/purchases',
      name: 'purchases',
      component: PurchaseList,
      meta: { requiresAuth: true, allowedRoles: ['admin'] },
    },
    {
      path: '/purchases/create',
      name: 'purchase-create',
      component: PurchaseForm,
      meta: { requiresAuth: true, allowedRoles: ['admin'] },
    },
    {
      path: '/purchases/edit/:id',
      name: 'purchase-edit',
      component: PurchaseForm,
      meta: { requiresAuth: true, allowedRoles: ['admin'] },
    },
    {
      path: '/cek-point/',
      name: 'cek-point',
      component: PointMember,
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
