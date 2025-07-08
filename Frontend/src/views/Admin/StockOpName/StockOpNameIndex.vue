<template>
  <DefaultLayout>
    <div class="p-6 bg-gray-50 min-h-screen">
      <!-- Search and Actions -->
      <div class="mb-6">
        <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div class="flex-1">
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
                placeholder="Search for..."
                class="pl-10 pr-4 py-2 w-full bg-white md:w-96 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
          <div class="flex gap-4">
            <input
              type="date"
              v-model="startDate"
              class="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Start date"
            />
            <span class="flex items-center text-gray-500">→</span>
            <input
              type="date"
              v-model="endDate"
              class="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="End date"
            />
            <RouterLink to="/stock-opname/create">
              <button
                class="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
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
      </div>

      <!-- Table Section -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b">
          <h2 class="text-xl font-bold text-gray-800">Riwayat Stok Opname</h2>
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
          <p class="mb-2">Belum ada riwayat stock opname.</p>
          <p class="text-sm">Klik "Buat Stok Opname" untuk memulai.</p>
        </div>

        <div v-else class="overflow-x-auto">
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
                  Tanggal
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
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ formatSessionId(opname.session_id) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDateTime(opname.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ opname.item_count }} item
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div class="flex space-x-2">
                    <RouterLink
                      :to="`/stock-opname/show/${opname.session_id}`"
                      class="text-blue-600 hover:text-blue-800"
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
                      class="text-red-600 hover:text-red-800"
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
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
            >
              Previous
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
            >
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Menampilkan
                <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
                sampai
                <span class="font-medium">{{
                  Math.min(currentPage * itemsPerPage, filteredOpnames.length)
                }}</span>
                dari
                <span class="font-medium">{{ filteredOpnames.length }}</span>
                hasil
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  @click="prevPage"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
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
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                >
                  {{ currentPage }} / {{ totalPages }}
                </span>

                <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
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
