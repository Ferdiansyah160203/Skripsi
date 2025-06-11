<template>
  <DefaultLayout>
    <div class="p-6 bg-gradient-to-br from-blue-50 to-white min-h-screen rounded-xl shadow-lg mb-8">
      <h1 class="text-4xl font-extrabold text-indigo-800 mb-8 flex items-center gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-10 w-10 text-blue-600"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H2z" />
          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
        </svg>
        Dashboard Admin
      </h1>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div
          class="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-md flex items-center gap-4"
        >
          <div class="p-3 bg-green-200 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 text-green-700"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600">Total Penjualan</p>
            <p class="text-3xl font-bold text-green-800">
              Rp {{ formatCurrency(dashboardData.totalSales) }}
            </p>
          </div>
        </div>

        <div
          class="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-md flex items-center gap-4"
        >
          <div class="p-3 bg-blue-200 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 text-blue-700"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600">Total Member</p>
            <p class="text-3xl font-bold text-blue-800">
              {{ formatNumber(dashboardData.totalMembers) }}
            </p>
          </div>
        </div>

        <div
          class="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl shadow-md flex items-center gap-4"
        >
          <div class="p-3 bg-yellow-200 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 text-yellow-700"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 7a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 3a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 3a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600">Pengeluaran Member</p>
            <p class="text-3xl font-bold text-yellow-800">
              Rp {{ formatCurrency(dashboardData.totalMemberSpent) }}
            </p>
          </div>
        </div>

        <div
          class="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-md flex items-center gap-4"
        >
          <div class="p-3 bg-purple-200 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 text-purple-700"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600">Total Poin Member</p>
            <p class="text-3xl font-bold text-purple-800">
              {{ formatNumber(dashboardData.totalMemberPoints) }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-xl border border-gray-200 mb-8">
        <h2 class="text-2xl font-bold text-indigo-800 mb-6 flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-7 w-7 text-red-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zm0 4a1 1 0 000 2h11a1 1 0 100-2H3zm0 4a1 1 0 000 2h11a1 1 0 100-2H3zm5 4a1 1 0 000 2h7a1 1 0 100-2H8z"
              clip-rule="evenodd"
            />
          </svg>
          Produk Terlaris
        </h2>
        <div v-if="loading" class="text-center py-4 text-gray-500">
          <svg
            class="animate-spin h-6 w-6 text-indigo-500 mx-auto mb-2"
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
          Memuat data produk terlaris...
        </div>
        <ul v-else-if="dashboardData.topSellingProducts.length > 0" class="space-y-4">
          <li
            v-for="(product, index) in dashboardData.topSellingProducts"
            :key="product.id"
            class="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200"
          >
            <div class="flex items-center gap-4">
              <span class="text-xl font-bold text-gray-700 w-8 text-center">{{ index + 1 }}.</span>
              <img
                :src="getImageUrl(product.image)"
                :alt="product.name"
                class="w-16 h-16 object-cover rounded-md shadow-sm"
              />
              <div>
                <p class="text-lg font-semibold text-gray-900">{{ product.name }}</p>
                <p class="text-sm text-gray-600">Rp {{ formatCurrency(product.price) }}</p>
              </div>
            </div>
            <span class="text-lg font-bold text-green-700"
              >{{ formatNumber(product.sold_quantity) }} unit</span
            >
          </li>
        </ul>
        <div v-else class="text-center py-4 text-gray-500">Tidak ada data produk terlaris.</div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
// import api from '/utils/axios'

const apiBaseUrl = import.meta.env.VITE_API_URL
const loading = ref(true)

// Mock data untuk dashboard (akan diganti dengan data API)
const dashboardData = ref({
  totalSales: 0,
  totalMembers: 0,
  totalMemberSpent: 0,
  totalMemberPoints: 0,
  topSellingProducts: [],
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

// Helper function untuk format angka biasa (misal poin, jumlah unit)
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

const getImageUrl = (path) => {
  return path ? `${apiBaseUrl}${path}` : 'https://via.placeholder.com/150/f0f0f0?text=No+Image'
}

// Fungsi untuk mengambil data dashboard dari API
const fetchDashboardData = async () => {
  loading.value = true
  try {
    // const salesRes = await api.get('/api/dashboard/total-sales');
    // const membersRes = await api.get('/api/dashboard/members-summary');
    // const topProductsRes = await api.get('/api/dashboard/top-products');

    // MOCK DATA TEMPORARY
    dashboardData.value = {
      totalSales: 12500000, // Contoh: Rp 12.500.000
      totalMembers: 75,
      totalMemberSpent: 5300000, // Contoh: Rp 5.300.000
      totalMemberPoints: 12500, // Contoh: 12.500 poin
      topSellingProducts: [
        {
          id: 1,
          name: 'Nasi Goreng Spesial',
          price: 25000,
          sold_quantity: 120,
          image: '/uploads/nasi_goreng.jpg',
        },
        {
          id: 2,
          name: 'Es Teh Manis Jumbo',
          price: 8000,
          sold_quantity: 95,
          image: '/uploads/es_teh.jpg',
        },
        {
          id: 3,
          name: 'Kopi Susu Gula Aren',
          price: 18000,
          sold_quantity: 80,
          image: '/uploads/kopi_susu.jpg',
        },
        {
          id: 4,
          name: 'Mie Ayam Bakso Komplit',
          price: 30000,
          sold_quantity: 70,
          image: '/uploads/mie_ayam.jpg',
        },
        {
          id: 5,
          name: 'Roti Bakar Coklat Keju',
          price: 15000,
          sold_quantity: 65,
          image: '/uploads/roti_bakar.jpg',
        },
      ],
    }
    // Akhir MOCK DATA TEMPORARY

    // Setelah data API yang sebenarnya tersedia, Anda akan melakukan ini:
    // dashboardData.value.totalSales = salesRes.data.totalSales;
    // dashboardData.value.totalMembers = membersRes.data.totalMembers;
    // dashboardData.value.totalMemberSpent = membersRes.data.totalSpent;
    // dashboardData.value.totalMemberPoints = membersRes.data.totalPoints;
    // dashboardData.value.topSellingProducts = topProductsRes.data;
  } catch (error) {
    console.error('Gagal mengambil data dashboard:', error)
    // Swal.fire('Error', 'Gagal memuat data dashboard.', 'error'); // Opsional: tampilkan alert
  } finally {
    loading.value = false
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
