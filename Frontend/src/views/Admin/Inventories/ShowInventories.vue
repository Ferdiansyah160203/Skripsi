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
                class="pl-10 pr-4 py-2 w-full bg-white md:w-108 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
          <div class="flex gap-6 items-center">
            <select
              v-model="selectedUnit"
              class="px-4 py-2 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Urutan Satuan</option>
              <option v-for="unit in availableUnits" :key="unit" :value="unit">{{ unit }}</option>
            </select>
            <select
              v-model="selectedStatus"
              class="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Status Ketersediaan</option>
              <option value="Tersedia">Tersedia</option>
              <option value="Habis">Habis</option>
            </select>
            <button
              @click="openModal()"
              class="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
            >
              <PlusIcon class="w-5 h-5" />
              Tambah Stok
            </button>
          </div>
        </div>
      </div>
      <!-- Header Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="bg-red-500 text-white p-4 rounded-lg shadow-md flex items-center">
          <div class="p-3 bg-white rounded-md mr-4">
            <Box class="text-red-600" />
          </div>
          <div>
            <p class="text-sm font-medium">Total Item Unik</p>
            <p class="text-3xl font-bold">{{ totalUniqueItems }}</p>
          </div>
        </div>
        <div class="bg-red-500 text-white p-4 rounded-lg shadow-md flex items-center">
          <div class="p-3 bg-white rounded-md mr-4">
            <Boxes class="text-red-600" />
          </div>
          <div>
            <p class="text-sm font-medium">Total Stok</p>
            <p class="text-3xl font-bold">{{ formatNumber(totalStock) }}</p>
          </div>
        </div>
      </div>

      <!-- Table Section -->
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
                  Nama
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Unit
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Stok
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
                v-for="(item, index) in paginatedInventories"
                :key="item.id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ item.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ item.unit }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatNumber(item.stock) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="getStatusClass(item.stock)"
                  >
                    {{ getStatusText(item.stock) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div class="flex space-x-2">
                    <button @click="openModal(item.id)" class="text-blue-600 hover:text-blue-800">
                      <PencilSquareIcon class="w-4 h-4" />
                    </button>
                    <button @click="deleteItem(item.id)" class="text-red-600 hover:text-red-800">
                      <TrashIcon class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredInventories.length === 0">
                <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                  Tidak ada data inventaris ditemukan.
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
                  Math.min(currentPage * itemsPerPage, filteredInventories.length)
                }}</span>
                dari
                <span class="font-medium">{{ filteredInventories.length }}</span>
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

                <template v-for="page in visiblePages" :key="page">
                  <button
                    v-if="page !== '...'"
                    @click="currentPage = page"
                    class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                    :class="
                      page === currentPage
                        ? 'z-10 bg-red-50 border-red-500 text-red-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    "
                  >
                    {{ page }}
                  </button>
                  <span
                    v-else
                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                  >
                    ...
                  </span>
                </template>

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

    <InventoryModal
      :show="modalOpen"
      :editId="editId"
      @close="modalOpen = false"
      @saved="refreshData"
    />
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue' // Sesuaikan path ini
import InventoryModal from '@/views/Admin/Inventories/InventoriesModal.vue' // Sesuaikan path ini
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/solid'
import { Box, Boxes } from 'lucide-vue-next'
import Swal from 'sweetalert2'
import api from '/utils/axios' // Sesuaikan path ini

const inventories = ref([]) // Mengubah nama state dari 'inventory' menjadi 'inventories' untuk konsistensi
const modalOpen = ref(false)
const editId = ref(null)
const searchQuery = ref('') // State untuk pencarian
const selectedUnit = ref('') // State untuk filter unit
const selectedStatus = ref('') // State untuk filter status
const currentPage = ref(1) // State untuk pagination
const itemsPerPage = 10 // Jumlah item per halaman

// Computed properties untuk ringkasan statistik
const totalUniqueItems = computed(() => inventories.value.length)
const totalStock = computed(() =>
  inventories.value.reduce((sum, item) => sum + parseFloat(item.stock || 0), 0),
)

// Computed property untuk mendapatkan unit yang tersedia dari data
const availableUnits = computed(() => {
  const units = [...new Set(inventories.value.map((item) => item.unit))].filter(Boolean)
  return units.sort() // Mengurutkan unit secara alfabetis
})

// Filtered inventories berdasarkan search query, unit, dan status
const filteredInventories = computed(() => {
  let filtered = inventories.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (item) => item.name.toLowerCase().includes(query) || item.unit.toLowerCase().includes(query),
    )
  }

  // Filter by unit
  if (selectedUnit.value) {
    filtered = filtered.filter((item) => item.unit === selectedUnit.value)
  }

  // Filter by status
  if (selectedStatus.value) {
    filtered = filtered.filter((item) => {
      const status = getStatusText(item.stock)
      return status === selectedStatus.value
    })
  }

  return filtered
})

// Computed properties untuk pagination
const totalPages = computed(() => {
  return Math.ceil(filteredInventories.value.length / itemsPerPage)
})

const paginatedInventories = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredInventories.value.slice(start, end)
})

// Computed untuk visible pages di pagination
const visiblePages = computed(() => {
  const delta = 2
  const range = []
  const rangeWithDots = []

  for (
    let i = Math.max(2, currentPage.value - delta);
    i <= Math.min(totalPages.value - 1, currentPage.value + delta);
    i++
  ) {
    range.push(i)
  }

  if (currentPage.value - delta > 2) {
    rangeWithDots.push(1, '...')
  } else {
    rangeWithDots.push(1)
  }

  rangeWithDots.push(...range)

  if (currentPage.value + delta < totalPages.value - 1) {
    rangeWithDots.push('...', totalPages.value)
  } else {
    rangeWithDots.push(totalPages.value)
  }

  return rangeWithDots.filter((v, i, a) => a.indexOf(v) === i)
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

// Watcher untuk mereset halaman saat search query atau filter berubah
watch([searchQuery, selectedUnit, selectedStatus], () => {
  currentPage.value = 1
})

onMounted(() => {
  fetchInventories()
})

function openModal(id = null) {
  editId.value = id
  modalOpen.value = true
}

// Fungsi untuk refresh data setelah save/edit di modal
function refreshData() {
  fetchInventories()
  modalOpen.value = false
  Swal.fire('Berhasil!', `Item berhasil ${editId.value ? 'diperbarui' : 'ditambahkan'}.`, 'success')
  // Setelah save, periksa apakah halaman saat ini masih valid
  if (currentPage.value > totalPages.value) {
    currentPage.value = Math.max(1, totalPages.value)
  }
}

// Fetch data inventories
async function fetchInventories() {
  try {
    const { data } = await api.get('/api/inventories')
    inventories.value = data // Menggunakan state 'inventories'
  } catch (err) {
    console.error('Gagal memuat data inventaris:', err)
    Swal.fire('Error', 'Gagal memuat data inventaris.', 'error')
  }
}

// Fungsi untuk menghapus inventaris
async function deleteItem(id) {
  const result = await Swal.fire({
    title: 'Hapus Inventaris?',
    html: 'Anda yakin ingin menghapus item inventaris ini?<br><strong class="text-red-600">Aksi ini tidak dapat dibatalkan!</strong>',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33', // Merah untuk delete
    cancelButtonColor: '#6c757d', // Abu-abu untuk batal
    confirmButtonText: 'Ya, Hapus!',
    cancelButtonText: 'Batal',
  })

  if (result.isConfirmed) {
    try {
      await api.delete(`/api/inventories/${id}`)
      inventories.value = inventories.value.filter((item) => item.id !== id) // Update state 'inventories'
      Swal.fire('Berhasil!', 'Inventaris berhasil dihapus.', 'success')
      // Setelah menghapus, periksa apakah halaman saat ini masih valid
      if (currentPage.value > totalPages.value) {
        currentPage.value = Math.max(1, totalPages.value)
      }
    } catch (err) {
      console.error('Gagal menghapus inventaris:', err)
      Swal.fire('Gagal', 'Gagal menghapus inventaris. Silakan coba lagi.', 'error')
    }
  }
}

// Helper untuk format angka biasa (misal stok)
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

// Helper untuk mendapatkan teks status berdasarkan stok
const getStatusText = (stock) => {
  const stockValue = parseFloat(stock) || 0
  return stockValue > 0 ? 'Tersedia' : 'Habis'
}

// Helper untuk mendapatkan class CSS status
const getStatusClass = (stock) => {
  const stockValue = parseFloat(stock) || 0
  if (stockValue > 0) {
    return 'bg-green-100 text-green-800'
  } else {
    return 'bg-red-100 text-red-800'
  }
}
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
