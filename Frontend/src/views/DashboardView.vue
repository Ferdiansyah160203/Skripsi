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
        <div class="bg-red-500 text-white p-4 rounded-lg shadow">
          <div class="flex items-center">
            <div class="p-3 bg-white rounded-full mr-3">
              <ShoppingCart class="text-red-600" />
            </div>
            <div class="">
              <p class="text-sm font-medium">Total Penjualan</p>
              <p class="text-2xl font-bold">Rp. {{ formatCurrency(dashboardData.totalSales) }}</p>
              <p class="text-xs text-red-200">
                <span :class="dashboardData.salesGrowth >= 0 ? 'text-green-300' : 'text-red-300'">
                  {{ dashboardData.salesGrowth >= 0 ? '+' : '' }}{{ dashboardData.salesGrowth }}%
                </span>
              </p>
            </div>
          </div>
        </div>

        <div class="bg-red-500 text-white p-4 rounded-lg shadow">
          <div class="flex items-center">
            <div class="p-3 bg-white rounded-full mr-3">
              <Repeat class="text-red-600" />
            </div>
            <div>
              <p class="text-sm font-medium">Total Order</p>
              <p class="text-2xl font-bold">{{ formatNumber(dashboardData.totalOrders) }}</p>
              <p class="text-xs text-red-200">
                <span :class="dashboardData.ordersGrowth >= 0 ? 'text-green-300' : 'text-red-300'">
                  {{ dashboardData.ordersGrowth >= 0 ? '+' : '' }}{{ dashboardData.ordersGrowth }}%
                </span>
              </p>
            </div>
          </div>
        </div>

        <div class="bg-red-500 text-white p-4 rounded-lg shadow">
          <div class="flex items-center">
            <div class="p-3 bg-white rounded-full mr-3">
              <Users class="text-red-600" />
            </div>
            <div>
              <p class="text-sm font-medium">Total Member</p>
              <p class="text-2xl font-bold">{{ formatNumber(dashboardData.totalMembers) }}</p>
              <p class="text-xs text-red-200">
                <span :class="dashboardData.membersGrowth >= 0 ? 'text-green-300' : 'text-red-300'">
                  {{ dashboardData.membersGrowth >= 0 ? '+' : ''
                  }}{{ dashboardData.membersGrowth }}%
                </span>
              </p>
            </div>
          </div>
        </div>

        <div class="bg-red-500 text-white p-4 rounded-lg shadow">
          <div class="flex items-center">
            <div class="p-3 bg-white rounded-md mr-3">
              <Award class="text-red-600" />
            </div>
            <div>
              <p class="text-sm font-medium">Total Poin Member</p>
              <p class="text-2xl font-bold">{{ formatNumber(dashboardData.totalMemberPoints) }}</p>
              <p class="text-xs text-red-200">
                <span :class="dashboardData.pointsGrowth >= 0 ? 'text-green-300' : 'text-red-300'">
                  {{ dashboardData.pointsGrowth >= 0 ? '+' : '' }}{{ dashboardData.pointsGrowth }}%
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts and Tables Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Sales Chart -->
        <div class="bg-white rounded-lg shadow">
          <div class="p-6 border-b">
            <h2 class="text-xl font-bold text-gray-800">Penjualan Bulanan</h2>
            <div class="flex items-center gap-4 mt-2">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                <span class="text-sm text-gray-600">Tahun saat ini</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 bg-pink-300 rounded-full"></div>
                <span class="text-sm text-gray-600">Tahun lalu</span>
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
            <h2 class="text-xl font-bold text-gray-800">Produk Terlaris</h2>
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
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="(product, index) in dashboardData.products.slice(0, 5)"
                  :key="product.id"
                  class="hover:bg-gray-50"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ index + 1 }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ product.name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Rp. {{ formatCurrency(product.price) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ product.type }}
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
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button class="text-blue-600 hover:text-blue-900">...</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="px-6 py-3 border-t">
            <div class="flex items-center justify-between">
              <button class="text-sm text-gray-500 hover:text-gray-700">Previous</button>
              <div class="flex gap-1">
                <button class="px-3 py-1 text-sm bg-red-500 text-white rounded">1</button>
                <button class="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">2</button>
                <button class="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">3</button>
                <button class="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">4</button>
                <button class="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">5</button>
                <span class="px-3 py-1 text-sm text-gray-500">...</span>
                <button class="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">11</button>
              </div>
              <button class="text-sm text-gray-500 hover:text-gray-700">Next</button>
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
                  v-for="(stock, index) in dashboardData.stocks.slice(0, 5)"
                  :key="stock.id"
                  class="hover:bg-gray-50"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ index + 1 }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ stock.name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800"
                    >
                      {{ stock.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { ShoppingCart, Repeat, Users, Award } from 'lucide-vue-next'
import Chart from 'chart.js/auto'
import api from '/utils/axios'

const loading = ref(true)
const salesChart = ref(null)
const productChart = ref(null)
let chartInstance = null
let productChartInstance = null

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

// Create sales chart
const createSalesChart = () => {
  if (!salesChart.value) return

  const ctx = salesChart.value.getContext('2d')

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dashboardData.value.monthlySales.map((item) => item.month),
      datasets: [
        {
          label: 'Tahun saat ini',
          data: dashboardData.value.monthlySales.map((item) => item.sales),
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
          label: 'Tahun lalu',
          data: dashboardData.value.monthlySales.map((item) => item.sales * 0.8),
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

// Create product donut chart
const createProductChart = () => {
  if (!productChart.value) return

  const ctx = productChart.value.getContext('2d')
  const topProducts = dashboardData.value.topSellingProducts.slice(0, 3)

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
  try {
    // Fetch all dashboard data in parallel
    const [summaryRes, topProductsRes, monthlySalesRes, productsRes, stocksRes] = await Promise.all(
      [
        api.get('/api/dashboard/summary'),
        api.get('/api/dashboard/top-products'),
        api.get('/api/dashboard/monthly-sales'),
        api.get('/api/dashboard/products'),
        api.get('/api/dashboard/stocks'),
      ],
    )

    // Update dashboard data with API responses
    Object.assign(dashboardData.value, summaryRes.data)
    dashboardData.value.topSellingProducts = topProductsRes.data
    dashboardData.value.monthlySales = monthlySalesRes.data
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
      ],
      stocks: [
        { id: 1, name: 'Gula', status: 'Restok' },
        { id: 2, name: 'Beras', status: 'Restok' },
        { id: 3, name: 'Bubuk Matcha', status: 'Restok' },
        { id: 4, name: 'Susu UHT', status: 'Restok' },
        { id: 5, name: 'Kentang', status: 'Restok' },
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
