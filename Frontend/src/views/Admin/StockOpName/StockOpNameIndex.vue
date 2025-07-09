<template>
  <DefaultLayout>
    <div class="p-6 bg-gray-50 min-h-screen">
      <!-- Desktop Header -->
      <div class="hidden md:block mb-6">
        <div class="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <!-- Search and Filters -->
          <div class="flex flex-col lg:flex-row gap-4 flex-1">
            <!-- Search Bar -->
            <div class="lg:w-120">
              <div class="relative">
                <svg
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="Cari sesi opname..."
                  class="pl-10 pr-4 py-2.5 w-full bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            <!-- Date Filters -->
            <div class="flex items-center gap-3">
              <input
                type="date"
                v-model="startDate"
                class="px-3 py-2.5 w-50 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Tanggal mulai"
              />
              <span class="text-gray-500">→</span>
              <input
                type="date"
                v-model="endDate"
                class="px-3 py-2.5 w-50 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Tanggal akhir"
              />
            </div>
          </div>

          <!-- Create Button -->
          <RouterLink to="/stock-opname/create">
            <button
              class="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 whitespace-nowrap font-medium shadow-md hover:shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  clip-rule="evenodd"
                />
              </svg>
              Buat Stok Opname
            </button>
          </RouterLink>
        </div>
      </div>

      <!-- Mobile Header -->
      <div class="md:hidden mb-6">
        <div class="flex flex-col gap-4">
          <!-- Search Bar -->
          <div class="w-full">
            <div class="relative">
              <svg
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Cari sesi opname..."
                class="pl-10 pr-4 py-2 w-full bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          <!-- Date Filters and Add Button -->
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <!-- Date Range Container -->
            <div class="flex flex-col xs:flex-row gap-3 sm:gap-4 flex-1">
              <div class="flex flex-col xs:flex-row items-center gap-2 xs:gap-3">
                <input
                  type="date"
                  v-model="startDate"
                  class="px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm w-full xs:w-auto"
                  placeholder="Tanggal mulai"
                />
                <span class="hidden xs:flex items-center text-gray-500 text-sm">→</span>
                <span class="xs:hidden text-xs text-gray-500 self-start">sampai</span>
                <input
                  type="date"
                  v-model="endDate"
                  class="px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm w-full xs:w-auto"
                  placeholder="Tanggal akhir"
                />
              </div>
            </div>

            <!-- Create Button -->
            <RouterLink to="/stock-opname/create" class="w-full sm:w-auto">
              <button
                class="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 whitespace-nowrap shadow-lg hover:shadow-xl transform hover:scale-105 font-medium w-full sm:w-auto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 sm:h-5 sm:w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="text-sm sm:text-base">Buat Stok Opname</span>
              </button>
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-4 sm:p-6 border-b">
          <h2 class="text-lg sm:text-xl font-bold text-gray-800">Riwayat Stok Opname</h2>
        </div>

        <div v-if="loading" class="p-8 text-center text-gray-500">
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
          Memuat riwayat stock opname...
        </div>

        <div v-else-if="filteredOpnames.length === 0" class="p-8 text-center text-gray-500">
          <div class="flex flex-col items-center">
            <svg
              class="w-12 h-12 text-gray-300 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1"
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              ></path>
            </svg>
            <p class="text-sm font-medium mb-2">Belum ada riwayat stock opname</p>
            <p class="text-xs text-gray-400">Klik "Buat Stok Opname" untuk memulai sesi baru</p>
          </div>
        </div>

        <!-- Desktop Table View -->
        <div v-if="!loading && filteredOpnames.length > 0" class="hidden md:block overflow-x-auto">
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
                  ID Sesi Opname
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tanggal & Waktu
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Jumlah Item
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
                v-for="(opname, index) in paginatedOpnames"
                :key="opname.session_id"
                class="hover:bg-gray-50 transition-colors duration-150"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {{ formatSessionId(opname.session_id) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ formatDateTime(opname.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {{ opname.item_count }} item
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div class="flex space-x-3">
                    <RouterLink
                      :to="`/stock-opname/show/${opname.session_id}`"
                      class="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors duration-150"
                      title="Lihat Detail"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fill-rule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </RouterLink>
                    <button
                      @click="deleteSession(opname.session_id)"
                      class="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors duration-150"
                      title="Hapus Sesi"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M9 2a1 1 0 000 2h2a1 0 100-2H9z"
                          clip-rule="evenodd"
                        />
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Card View -->
        <div
          v-if="!loading && filteredOpnames.length > 0"
          class="md:hidden divide-y divide-gray-200"
        >
          <div
            v-for="(opname, index) in paginatedOpnames"
            :key="opname.session_id"
            class="p-4 hover:bg-gray-50 transition-colors duration-150"
          >
            <!-- Header dengan session ID dan actions -->
            <div class="flex justify-between items-start mb-3">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {{ formatSessionId(opname.session_id) }}
                  </span>
                </div>
                <div class="text-xs text-gray-500">
                  Sesi #{{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </div>
              </div>
              <div class="flex space-x-3 ml-3">
                <RouterLink
                  :to="`/stock-opname/show/${opname.session_id}`"
                  class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors duration-150"
                  title="Lihat Detail"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fill-rule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </RouterLink>
                <button
                  @click="deleteSession(opname.session_id)"
                  class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors duration-150"
                  title="Hapus Sesi"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
                      clip-rule="evenodd"
                    />
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Info grid -->
            <div class="grid grid-cols-1 gap-3 text-sm">
              <div class="bg-gray-50 rounded-lg p-3">
                <div class="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                  Tanggal & Waktu
                </div>
                <div class="font-semibold text-gray-900">
                  {{ formatDateTime(opname.createdAt) }}
                </div>
              </div>
              <div class="bg-gray-50 rounded-lg p-3">
                <div class="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                  Jumlah Item
                </div>
                <div class="font-semibold text-gray-900">{{ opname.item_count }} item dicek</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div
          v-if="!loading && filteredOpnames.length > 0"
          class="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50"
        >
          <!-- Mobile Pagination -->
          <div class="flex justify-between items-center w-full sm:hidden">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
              Prev
            </button>
            <div class="flex items-center space-x-1">
              <span class="text-sm text-gray-700 font-medium">Hal.</span>
              <span class="text-sm text-gray-900 font-bold">{{ currentPage }}</span>
              <span class="text-sm text-gray-500">dari</span>
              <span class="text-sm text-gray-900 font-bold">{{ totalPages }}</span>
            </div>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
            >
              Next
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </button>
          </div>

          <!-- Desktop Pagination -->
          <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Menampilkan
                <span class="font-medium text-gray-900">{{
                  (currentPage - 1) * itemsPerPage + 1
                }}</span>
                sampai
                <span class="font-medium text-gray-900">{{
                  Math.min(currentPage * itemsPerPage, filteredOpnames.length)
                }}</span>
                dari
                <span class="font-medium text-gray-900">{{ filteredOpnames.length }}</span>
                total sesi opname
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px">
                <button
                  @click="prevPage"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-3 py-2 rounded-l-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                >
                  <span class="sr-only">Previous</span>
                  <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>

                <span
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-semibold text-gray-700"
                >
                  {{ currentPage }} / {{ totalPages }}
                </span>

                <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-3 py-2 rounded-r-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                >
                  <span class="sr-only">Next</span>
                  <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue' // Sesuaikan path ini
import { ref, onMounted, computed, watch } from 'vue'
import api from '/utils/axios' // Sesuaikan path ini
import Swal from 'sweetalert2'

const opnames = ref([])
const loading = ref(true) // State untuk loading
const searchQuery = ref('') // State untuk pencarian
const startDate = ref('') // State untuk tanggal mulai
const endDate = ref('') // State untuk tanggal akhir

const currentPage = ref(1)
const itemsPerPage = 10

// Helper function untuk format tanggal dan waktu
const formatDateTime = (dateString) => {
  if (!dateString) return '-'
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}

const formatSessionId = (id) => {
  const idStr = String(id)
  if (idStr.length > 8) {
    return idStr.substring(0, 8) + '...'
  }
  return idStr
}

// Filtered opnames berdasarkan search query dan date range
const filteredOpnames = computed(() => {
  let filtered = opnames.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (item) =>
        String(item.session_id).toLowerCase().includes(query) ||
        formatDateTime(item.createdAt).toLowerCase().includes(query),
    )
  }

  // Filter by date range
  if (startDate.value || endDate.value) {
    filtered = filtered.filter((item) => {
      const itemDate = new Date(item.createdAt).toISOString().split('T')[0]

      if (startDate.value && endDate.value) {
        return itemDate >= startDate.value && itemDate <= endDate.value
      } else if (startDate.value) {
        return itemDate >= startDate.value
      } else if (endDate.value) {
        return itemDate <= endDate.value
      }

      return true
    })
  }

  return filtered
})

// Computed properties untuk pagination
const totalPages = computed(() => {
  return Math.ceil(filteredOpnames.value.length / itemsPerPage)
})

const paginatedOpnames = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredOpnames.value.slice(start, end)
})

// Watcher untuk mereset halaman saat search query atau filter berubah
watch([searchQuery, startDate, endDate], () => {
  currentPage.value = 1
})

// Fungsi pagination
function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const fetchOpnames = async () => {
  loading.value = true // Set loading true saat memulai fetch
  try {
    const { data } = await api.get('/api/stock-opnames/')
    opnames.value = data
    console.log('Fetched opname sessions:', opnames.value) // Debug log
  } catch (error) {
    console.error('Gagal mengambil data stock opname:', error)
    Swal.fire('Error', 'Gagal memuat riwayat stock opname.', 'error')
  } finally {
    loading.value = false // Set loading false setelah fetch selesai
  }
}

async function deleteSession(sessionIdToDelete) {
  const result = await Swal.fire({
    title: 'Hapus Sesi Stock Opname?',
    html: `Anda yakin ingin menghapus sesi stock opname dengan ID <strong class="font-mono">${formatSessionId(sessionIdToDelete)}</strong>?<br><strong class="text-red-600">Semua detail opname di dalamnya juga akan terhapus. Aksi ini tidak dapat dibatalkan!</strong>`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33', // Merah untuk delete
    cancelButtonColor: '#6c757d', // Abu-abu untuk batal
    confirmButtonText: 'Ya, Hapus Sesi!',
    cancelButtonText: 'Batal',
  })

  if (result.isConfirmed) {
    try {
      await api.delete(`/api/stock-opnames/session/${sessionIdToDelete}`)
      // Perbarui daftar opnames setelah penghapusan
      opnames.value = opnames.value.filter((session) => session.session_id !== sessionIdToDelete)
      Swal.fire('Berhasil!', 'Sesi stock opname berhasil dihapus.', 'success')
      // Sesuaikan halaman saat ini jika perlu
      if (currentPage.value > totalPages.value) {
        currentPage.value = Math.max(1, totalPages.value)
      }
    } catch (error) {
      console.error('Gagal menghapus sesi stock opname:', error)
      Swal.fire('Gagal', 'Gagal menghapus sesi stock opname. Silakan coba lagi.', 'error')
    }
  }
}

onMounted(fetchOpnames)
</script>

<style scoped>
/* Custom scrollbar styles */
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
