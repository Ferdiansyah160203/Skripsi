<template>
  <DefaultLayout>
    <div class="p-6 bg-gray-50 min-h-screen">
      <!-- Header Section -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p class="text-gray-600 mt-1">Ringkasan data dan statistik toko</p>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-4 rounded-lg shadow">
          <div class="flex items-start justify-between">
            <div class="flex items-center">
              <div class="p-3 bg-[#DB3A40] rounded-lg mr-3">
                <ShoppingCart class="text-white" size="24" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">Total Penjualan</p>
                <p class="text-2xl font-bold text-gray-900">
                  Rp. {{ formatCurrency(dashboardData.totalSales) }}
                </p>
              </div>
            </div>
            <span
              class="text-sm px-3 py-1 rounded-full mt-5"
              :class="
                dashboardData.salesGrowth >= 0
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              "
            >
              {{ dashboardData.salesGrowth >= 0 ? '+' : '' }}{{ dashboardData.salesGrowth }}%
            </span>
          </div>
        </div>

        <div class="bg-white p-4 rounded-lg shadow">
          <div class="flex items-start justify-between">
            <div class="flex items-center">
              <div class="p-3 bg-[#DB3A40] rounded-lg mr-3">
                <Repeat class="text-white" size="24" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">Total Order</p>
                <p class="text-2xl font-bold text-gray-900">
                  {{ formatNumber(dashboardData.totalOrders) }}
                </p>
              </div>
            </div>
            <span
              class="text-sm px-3 py-1 rounded-full mt-5"
              :class="
                dashboardData.ordersGrowth >= 0
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              "
            >
              {{ dashboardData.ordersGrowth >= 0 ? '+' : '' }}{{ dashboardData.ordersGrowth }}%
            </span>
          </div>
        </div>

        <div class="bg-white p-4 rounded-lg shadow">
          <div class="flex items-start justify-between">
            <div class="flex items-center">
              <div class="p-3 bg-[#DB3A40] rounded-lg mr-3">
                <Users class="text-white" size="24" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">Total Member</p>
                <p class="text-2xl font-bold text-gray-900">
                  {{ formatNumber(dashboardData.totalMembers) }}
                </p>
              </div>
            </div>
            <span
              class="text-sm px-3 py-1 rounded-full mt-5"
              :class="
                dashboardData.membersGrowth >= 0
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              "
            >
              {{ dashboardData.membersGrowth >= 0 ? '+' : '' }}{{ dashboardData.membersGrowth }}%
            </span>
          </div>
        </div>

        <div class="bg-white p-4 rounded-lg shadow">
          <div class="flex items-start justify-between">
            <div class="flex items-center">
              <div class="p-3 bg-[#DB3A40] rounded-lg mr-3">
                <Award class="text-white" size="24" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">Total Poin Member</p>
                <p class="text-2xl font-bold text-gray-900">
                  {{ formatNumber(dashboardData.totalMemberPoints) }}
                </p>
              </div>
            </div>
            <span
              class="text-sm px-3 py-1 rounded-full mt-5"
              :class="
                dashboardData.pointsGrowth >= 0
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              "
            >
              {{ dashboardData.pointsGrowth >= 0 ? '+' : '' }}{{ dashboardData.pointsGrowth }}%
            </span>
          </div>
        </div>
      </div>

      <!-- Charts and Tables Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Sales Chart -->
        <div class="bg-white rounded-lg shadow">
          <div class="p-6 border-b">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-xl font-bold text-gray-800">
                  Penjualan {{ chartViewMode === 'monthly' ? 'Bulanan' : 'Harian' }}
                </h2>
                <div class="flex items-center gap-4 mt-2">
                  <div class="flex items-center gap-2">
                    <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span class="text-sm text-gray-600">{{
                      chartViewMode === 'monthly' ? 'Bulan ini' : 'Hari ini'
                    }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-3 h-3 bg-pink-300 rounded-full"></div>
                    <span class="text-sm text-gray-600">{{
                      chartViewMode === 'monthly' ? 'Bulan lalu' : 'Hari lalu'
                    }}</span>
                  </div>
                </div>
              </div>
              <!-- Toggle Buttons -->
              <div class="flex bg-gray-100 rounded-lg p-1">
                <button
                  @click="switchChartView('monthly')"
                  :class="[
                    'px-3 py-1 text-sm font-medium rounded-md transition-all',
                    chartViewMode === 'monthly'
                      ? 'bg-white text-red-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800',
                  ]"
                >
                  Bulanan
                </button>
                <button
                  @click="switchChartView('daily')"
                  :class="[
                    'px-3 py-1 text-sm font-medium rounded-md transition-all',
                    chartViewMode === 'daily'
                      ? 'bg-white text-red-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800',
                  ]"
                >
                  Harian
                </button>
              </div>
            </div>
          </div>
          <div class="p-6">
            <div v-if="loading" class="text-center py-8 text-gray-500">
              <svg
                class="animate-spin h-8 w-8 text-red-500 mx-auto mb-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Memuat grafik penjualan...
            </div>
            <div v-else class="h-64 flex items-center justify-center">
              <canvas ref="salesChart" class="w-full h-full"></canvas>
            </div>
          </div>
        </div>

        <!-- Best Selling Products with Donut Chart -->
        <div class="bg-white rounded-lg shadow">
          <div class="p-6 border-b">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-xl font-bold text-gray-800">Produk Terlaris</h2>
                <div class="flex items-center gap-4 mt-2">
                  <div class="flex items-center gap-2">
                    <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span class="text-sm text-gray-600">Periode ini</span>
                  </div>
                </div>
              </div>
              <!-- Placeholder for alignment -->
              <div class="w-32"></div>
            </div>
          </div>
          <div class="p-6">
            <div v-if="loading" class="text-center py-8 text-gray-500">
              <svg
                class="animate-spin h-8 w-8 text-red-500 mx-auto mb-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Memuat data produk...
            </div>
            <div v-else class="flex items-center justify-between">
              <!-- Donut Chart -->
              <div class="w-48 h-48 relative">
                <canvas ref="productChart" class="w-full h-full"></canvas>
              </div>
              <!-- Product List -->
              <div class="flex-1 ml-6">
                <div
                  v-for="(product, index) in dashboardData.topSellingProducts.slice(0, 3)"
                  :key="product.id"
                  class="flex items-center justify-between mb-4"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="w-3 h-3 rounded-full"
                      :style="{ backgroundColor: getProductColor(index) }"
                    ></div>
                    <div>
                      <p class="font-medium text-gray-900">{{ product.name }}</p>
                      <p class="text-sm text-gray-500">Rp. {{ formatCurrency(product.price) }}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="font-bold text-gray-900">{{ formatNumber(product.sold_quantity) }}</p>
                    <p
                      class="text-sm"
                      :class="product.growth >= 0 ? 'text-green-600' : 'text-red-600'"
                    >
                      {{ product.growth >= 0 ? '+' : '' }}{{ product.growth }}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Data Tables Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Products Table -->
        <div class="bg-white rounded-lg shadow">
          <div class="p-6 border-b">
            <h2 class="text-xl font-bold text-gray-800">Daftar Produk</h2>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    No
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nama Produk
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Harga
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Jenis
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="(product, index) in paginatedProducts"
                  :key="product.id"
                  class="hover:bg-gray-50"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ product.name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Rp. {{ formatCurrency(product.price) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ product.category }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="[
                        'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                        product.status === 'Tersedia'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800',
                      ]"
                    >
                      {{ product.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="px-6 py-3 border-t">
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-700">
                Menampilkan {{ (currentPage - 1) * itemsPerPage + 1 }} -
                {{ Math.min(currentPage * itemsPerPage, dashboardData.products.length) }}
                dari {{ dashboardData.products.length }} produk
              </div>
              <div class="flex items-center gap-4">
                <button
                  @click="previousPage"
                  :disabled="currentPage === 1"
                  :class="[
                    'text-sm transition-colors',
                    currentPage === 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:text-gray-700 cursor-pointer',
                  ]"
                >
                  Previous
                </button>
                <div class="flex gap-1">
                  <template v-for="page in getPageNumbers()" :key="page">
                    <button
                      v-if="page !== '...'"
                      @click="goToPage(page)"
                      :class="[
                        'px-3 py-1 text-sm rounded transition-colors',
                        currentPage === page
                          ? 'bg-red-500 text-white'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
                      ]"
                    >
                      {{ page }}
                    </button>
                    <span v-else class="px-3 py-1 text-sm text-gray-500"> ... </span>
                  </template>
                </div>
                <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  :class="[
                    'text-sm transition-colors',
                    currentPage === totalPages
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:text-gray-700 cursor-pointer',
                  ]"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Stock Table -->
        <div class="bg-white rounded-lg shadow">
          <div class="p-6 border-b">
            <h2 class="text-xl font-bold text-gray-800">Daftar Stok</h2>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    No
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nama Stok
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="(stock, index) in paginatedStocks"
                  :key="stock.id"
                  class="hover:bg-gray-50"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ (currentStockPage - 1) * stockItemsPerPage + index + 1 }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ stock.name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="[
                        'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                        stock.status === 'Aman'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800',
                      ]"
                    >
                      {{ stock.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="px-6 py-3 border-t">
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-700">
                Menampilkan {{ (currentStockPage - 1) * stockItemsPerPage + 1 }} -
                {{ Math.min(currentStockPage * stockItemsPerPage, dashboardData.stocks.length) }}
                dari {{ dashboardData.stocks.length }} stok
              </div>
              <div class="flex items-center gap-4">
                <button
                  @click="previousStockPage"
                  :disabled="currentStockPage === 1"
                  :class="[
                    'text-sm transition-colors',
                    currentStockPage === 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:text-gray-700 cursor-pointer',
                  ]"
                >
                  Previous
                </button>
                <div class="flex gap-1">
                  <template v-for="page in getStockPageNumbers()" :key="page">
                    <button
                      v-if="page !== '...'"
                      @click="goToStockPage(page)"
                      :class="[
                        'px-3 py-1 text-sm rounded transition-colors',
                        currentStockPage === page
                          ? 'bg-red-500 text-white'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
                      ]"
                    >
                      {{ page }}
                    </button>
                    <span v-else class="px-3 py-1 text-sm text-gray-500"> ... </span>
                  </template>
                </div>
                <button
                  @click="nextStockPage"
                  :disabled="currentStockPage === totalStockPages"
                  :class="[
                    'text-sm transition-colors',
                    currentStockPage === totalStockPages
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:text-gray-700 cursor-pointer',
                  ]"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { ShoppingCart, Repeat, Users, Award } from 'lucide-vue-next'
import Chart from 'chart.js/auto'
import api from '/utils/axios'

const loading = ref(true)
const salesChart = ref(null)
const productChart = ref(null)
let chartInstance = null
let productChartInstance = null

// Chart view mode - 'monthly' or 'daily'
const chartViewMode = ref('monthly')

// Pagination state for products table
const currentPage = ref(1)
const itemsPerPage = ref(5)

// Pagination state for stocks table
const currentStockPage = ref(1)
const stockItemsPerPage = ref(5)

// Dashboard data
const dashboardData = ref({
  totalSales: 0,
  salesGrowth: 0,
  totalOrders: 0,
  ordersGrowth: 0,
  totalMembers: 0,
  membersGrowth: 0,
  totalMemberPoints: 0,
  pointsGrowth: 0,
  topSellingProducts: [],
  products: [],
  stocks: [],
  monthlySales: [],
  dailySales: [], // Data untuk chart harian
})

// Helper function untuk format mata uang IDR
const formatCurrency = (val) => {
  if (typeof val !== 'number') {
    val = parseFloat(val)
  }
  if (isNaN(val)) return '0'
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val)
}

// Helper function untuk format angka biasa
const formatNumber = (val) => {
  if (typeof val !== 'number') {
    val = parseFloat(val)
  }
  if (isNaN(val)) return '0'
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val)
}

const getProductColor = (index) => {
  const colors = ['#EF4444', '#F97316', '#EAB308']
  return colors[index % colors.length]
}

// Pagination functions
const totalPages = computed(() => {
  return Math.ceil(dashboardData.value.products.length / itemsPerPage.value)
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return dashboardData.value.products.slice(start, end)
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const getPageNumbers = () => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    // Show all pages if total is 7 or less
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)

    if (current <= 4) {
      // Show 1, 2, 3, 4, 5, ..., last
      for (let i = 2; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      // Show 1, ..., last-4, last-3, last-2, last-1, last
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      // Show 1, ..., current-1, current, current+1, ..., last
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }

  return pages
}

// Stock Pagination functions
const totalStockPages = computed(() => {
  return Math.ceil(dashboardData.value.stocks.length / stockItemsPerPage.value)
})

const paginatedStocks = computed(() => {
  const start = (currentStockPage.value - 1) * stockItemsPerPage.value
  const end = start + stockItemsPerPage.value
  return dashboardData.value.stocks.slice(start, end)
})

const goToStockPage = (page) => {
  if (page >= 1 && page <= totalStockPages.value) {
    currentStockPage.value = page
  }
}

const previousStockPage = () => {
  if (currentStockPage.value > 1) {
    currentStockPage.value--
  }
}

const nextStockPage = () => {
  if (currentStockPage.value < totalStockPages.value) {
    currentStockPage.value++
  }
}

const getStockPageNumbers = () => {
  const pages = []
  const total = totalStockPages.value
  const current = currentStockPage.value

  if (total <= 7) {
    // Show all pages if total is 7 or less
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)

    if (current <= 4) {
      // Show 1, 2, 3, 4, 5, ..., last
      for (let i = 2; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      // Show 1, ..., last-4, last-3, last-2, last-1, last
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      // Show 1, ..., current-1, current, current+1, ..., last
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }

  return pages
}

// Create sales chart
const createSalesChart = () => {
  if (!salesChart.value) return

  const ctx = salesChart.value.getContext('2d')

  // Destroy existing chart if it exists
  if (chartInstance) {
    chartInstance.destroy()
  }

  // Get data based on current view mode
  const salesData =
    chartViewMode.value === 'monthly'
      ? dashboardData.value.monthlySales
      : dashboardData.value.dailySales

  const currentLabel = chartViewMode.value === 'monthly' ? 'Tahun saat ini' : 'Bulan ini'
  const previousLabel = chartViewMode.value === 'monthly' ? 'Tahun lalu' : 'Bulan lalu'

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: salesData.map((item) => (chartViewMode.value === 'monthly' ? item.month : item.day)),
      datasets: [
        {
          label: currentLabel,
          data: salesData.map((item) => item.sales),
          borderColor: '#EF4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#EF4444',
          pointBorderColor: '#EF4444',
          pointRadius: 4,
        },
        {
          label: previousLabel,
          data: salesData.map((item) => item.sales * 0.8),
          borderColor: '#F8BBD9',
          backgroundColor: 'rgba(248, 187, 217, 0.1)',
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          pointBackgroundColor: '#F8BBD9',
          pointBorderColor: '#F8BBD9',
          pointRadius: 3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: '#F3F4F6',
          },
        },
        x: {
          grid: {
            color: '#F3F4F6',
          },
        },
      },
    },
  })
}

// Switch chart view between monthly and daily
const switchChartView = (mode) => {
  chartViewMode.value = mode
  // Recreate chart with new data
  createSalesChart()
}

// Create product donut chart
const createProductChart = () => {
  if (!productChart.value) return

  const ctx = productChart.value.getContext('2d')
  const topProducts = dashboardData.value.topSellingProducts.slice(0, 3)

  // Destroy existing chart if it exists
  if (productChartInstance) {
    productChartInstance.destroy()
  }

  productChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: topProducts.map((product) => product.name),
      datasets: [
        {
          data: topProducts.map((product) => product.sold_quantity),
          backgroundColor: ['#EF4444', '#F97316', '#EAB308'],
          borderWidth: 0,
          cutout: '70%',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  })
}

// Fungsi untuk mengambil data dashboard dari API
const fetchDashboardData = async () => {
  loading.value = true
  // Reset pagination when fetching new data
  currentPage.value = 1
  currentStockPage.value = 1

  try {
    // Fetch all dashboard data in parallel
    const [summaryRes, topProductsRes, monthlySalesRes, dailySalesRes, productsRes, stocksRes] =
      await Promise.all([
        api.get('/api/dashboard/summary'),
        api.get('/api/dashboard/top-products'),
        api.get('/api/dashboard/monthly-sales'),
        api.get('/api/dashboard/daily-sales'),
        api.get('/api/dashboard/products'),
        api.get('/api/dashboard/stocks'),
      ])

    // Update dashboard data with API responses
    Object.assign(dashboardData.value, summaryRes.data)
    dashboardData.value.topSellingProducts = topProductsRes.data
    dashboardData.value.monthlySales = monthlySalesRes.data
    dashboardData.value.dailySales = dailySalesRes.data
    dashboardData.value.products = productsRes.data
    dashboardData.value.stocks = stocksRes.data

    console.log('Dashboard data loaded from API:', dashboardData.value)
  } catch (error) {
    console.error('Gagal mengambil data dashboard dari API:', error)
    console.log('Menggunakan data dummy sebagai fallback')

    // Enhanced fallback to mock data if API fails
    dashboardData.value = {
      totalSales: 7500000,
      salesGrowth: 3.2,
      totalOrders: 234,
      ordersGrowth: -0.8,
      totalMembers: 125,
      membersGrowth: 6.5,
      totalMemberPoints: 1580,
      pointsGrowth: 12.3,
      topSellingProducts: [
        {
          id: 1,
          name: 'Kopi Susu',
          price: 15000,
          sold_quantity: 1022,
          growth: 8.2,
        },
        {
          id: 2,
          name: 'Red Velvet',
          price: 25000,
          sold_quantity: 800,
          growth: 7,
        },
        {
          id: 3,
          name: 'Ayam Geprek',
          price: 18000,
          sold_quantity: 645,
          growth: 2.5,
        },
      ],
      products: [
        { id: 1, name: 'Kopi Susu', price: 15000, type: 'Minuman', status: 'Tersedia' },
        { id: 2, name: 'Kopi Gula Aren', price: 15000, type: 'Minuman', status: 'Tersedia' },
        { id: 3, name: 'Kopi Butter', price: 15000, type: 'Minuman', status: 'Tersedia' },
        { id: 4, name: 'Kentang Goreng', price: 10000, type: 'Makanan', status: 'Habis' },
        { id: 5, name: 'Es Teh Manis', price: 8000, type: 'Minuman', status: 'Tersedia' },
        { id: 6, name: 'Nasi Goreng', price: 20000, type: 'Makanan', status: 'Tersedia' },
        { id: 7, name: 'Mie Ayam', price: 18000, type: 'Makanan', status: 'Tersedia' },
        { id: 8, name: 'Es Krim Vanilla', price: 12000, type: 'Dessert', status: 'Tersedia' },
        { id: 9, name: 'Jus Jeruk', price: 10000, type: 'Minuman', status: 'Habis' },
        { id: 10, name: 'Roti Bakar', price: 15000, type: 'Makanan', status: 'Tersedia' },
        { id: 11, name: 'Cappuccino', price: 18000, type: 'Minuman', status: 'Tersedia' },
        { id: 12, name: 'Latte', price: 20000, type: 'Minuman', status: 'Tersedia' },
        { id: 13, name: 'Americano', price: 16000, type: 'Minuman', status: 'Tersedia' },
        { id: 14, name: 'Sandwich Club', price: 25000, type: 'Makanan', status: 'Tersedia' },
        { id: 15, name: 'Pancake', price: 22000, type: 'Dessert', status: 'Habis' },
        { id: 16, name: 'Waffle', price: 24000, type: 'Dessert', status: 'Tersedia' },
        { id: 17, name: 'Smoothie Bowl', price: 28000, type: 'Dessert', status: 'Tersedia' },
        { id: 18, name: 'Croissant', price: 14000, type: 'Makanan', status: 'Tersedia' },
        { id: 19, name: 'Matcha Latte', price: 22000, type: 'Minuman', status: 'Tersedia' },
        { id: 20, name: 'Hot Chocolate', price: 16000, type: 'Minuman', status: 'Tersedia' },
      ],
      stocks: [
        { id: 1, name: 'Gula', status: 'Restok' },
        { id: 2, name: 'Beras', status: 'Restok' },
        { id: 3, name: 'Bubuk Matcha', status: 'Restok' },
        { id: 4, name: 'Susu UHT', status: 'Restok' },
        { id: 5, name: 'Kentang', status: 'Restok' },
        { id: 6, name: 'Tepung Terigu', status: 'Aman' },
        { id: 7, name: 'Minyak Goreng', status: 'Aman' },
        { id: 8, name: 'Telur Ayam', status: 'Restok' },
        { id: 9, name: 'Daging Ayam', status: 'Aman' },
        { id: 10, name: 'Sayuran Segar', status: 'Restok' },
        { id: 11, name: 'Kopi Bubuk', status: 'Aman' },
        { id: 12, name: 'Garam', status: 'Aman' },
        { id: 13, name: 'Merica', status: 'Restok' },
        { id: 14, name: 'Bawang Merah', status: 'Aman' },
        { id: 15, name: 'Bawang Putih', status: 'Restok' },
      ],
      monthlySales: [
        { month: 'Jan', sales: 200000 },
        { month: 'Feb', sales: 350000 },
        { month: 'Mar', sales: 280000 },
        { month: 'Apr', sales: 400000 },
        { month: 'May', sales: 380000 },
        { month: 'Jun', sales: 420000 },
        { month: 'Jul', sales: 500000 },
        { month: 'Aug', sales: 480000 },
        { month: 'Sep', sales: 520000 },
        { month: 'Oct', sales: 490000 },
        { month: 'Nov', sales: 350000 },
        { month: 'Dec', sales: 600000 },
      ],
      dailySales: [
        { day: '1', sales: 15000 },
        { day: '2', sales: 22000 },
        { day: '3', sales: 18000 },
        { day: '4', sales: 25000 },
        { day: '5', sales: 30000 },
        { day: '6', sales: 35000 },
        { day: '7', sales: 28000 },
        { day: '8', sales: 32000 },
        { day: '9', sales: 27000 },
        { day: '10', sales: 40000 },
        { day: '11', sales: 38000 },
        { day: '12', sales: 42000 },
        { day: '13', sales: 45000 },
        { day: '14', sales: 50000 },
        { day: '15', sales: 48000 },
        { day: '16', sales: 35000 },
        { day: '17', sales: 30000 },
        { day: '18', sales: 33000 },
        { day: '19', sales: 37000 },
        { day: '20', sales: 41000 },
        { day: '21', sales: 44000 },
        { day: '22', sales: 39000 },
        { day: '23', sales: 36000 },
        { day: '24', sales: 43000 },
        { day: '25', sales: 47000 },
        { day: '26', sales: 52000 },
        { day: '27', sales: 49000 },
        { day: '28', sales: 45000 },
        { day: '29', sales: 51000 },
        { day: '30', sales: 55000 },
      ],
    }
  } finally {
    loading.value = false
    // Create charts after data is loaded
    nextTick(() => {
      createSalesChart()
      createProductChart()
    })
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>

<style scoped>
/* Custom scrollbar styles (copy from DefaultLayout or your global CSS) */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
</style>
