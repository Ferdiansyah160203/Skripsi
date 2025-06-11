<template>
  <DefaultLayout>
    <div class="p-6 bg-gradient-to-br from-sky-50 to-white min-h-screen rounded-xl shadow-lg mb-8">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-4xl font-extrabold text-indigo-800 flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-10 w-10 text-sky-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M.8 9A.8.8 0 010 8.2V2.5A2.5 2.5 0 012.5 0h15A2.5 2.5 0 0120 2.5v5.7a.8.8 0 01-1.6 0V2.5a.9.9 0 00-.9-.9H2.5a.9.9 0 00-.9.9v5.7a.8.8 0 01-.8.8zM4 11a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm0 3a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z"
              clip-rule="evenodd"
            />
            <path
              fill-rule="evenodd"
              d="M10 12.586L12.293 10.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 011.414-1.414L10 12.586z"
              clip-rule="evenodd"
            />
            <path
              fill-rule="evenodd"
              d="M10 11a1 1 0 011 1v4a1 1 0 11-2 0v-4a1 1 0 011-1z"
              clip-rule="evenodd"
            />
          </svg>
          Manajemen Inventaris
        </h1>
        <button
          @click="openModal()"
          class="flex items-center gap-2 px-6 py-3 text-lg font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-lg transition duration-300 transform hover:scale-105"
        >
          <PlusIcon class="w-6 h-6" />
          Tambah Inventaris Baru
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="bg-indigo-100 p-6 rounded-xl shadow-md flex items-center gap-4">
          <div class="p-3 bg-indigo-200 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 text-indigo-700"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M.8 9A.8.8 0 010 8.2V2.5A2.5 2.5 0 012.5 0h15A2.5 2.5 0 0120 2.5v5.7a.8.8 0 01-1.6 0V2.5a.9.9 0 00-.9-.9H2.5a.9.9 0 00-.9.9v5.7a.8.8 0 01-.8.8zM4 11a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm0 3a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600">Total Item Unik</p>
            <p class="text-3xl font-bold text-indigo-800">{{ totalUniqueItems }}</p>
          </div>
        </div>
        <div class="bg-green-100 p-6 rounded-xl shadow-md flex items-center gap-4">
          <div class="p-3 bg-green-200 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 text-green-700"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm.5 1.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v2a.5.5 0 01-.5.5h-2a.5.5 0 01-.5-.5v-2zM12 4a2 2 0 00-2 2v6a2 2 0 002 2h4a2 2 0 002-2V6a2 2 0 00-2-2h-4z"
              />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600">Total Stok Tersedia</p>
            <p class="text-3xl font-bold text-green-800">{{ formatNumber(totalStock) }}</p>
          </div>
        </div>
      </div>

      <div
        class="mb-6 flex flex-col md:flex-row gap-4 p-6 bg-white rounded-xl shadow border border-gray-200"
      >
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Cari nama inventaris atau unit..."
          class="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition"
        />
        <button
          @click="clearSearch"
          v-if="searchQuery"
          class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition duration-200"
        >
          Clear
        </button>
      </div>

      <div class="overflow-x-auto bg-white shadow-xl rounded-xl border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-sky-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-bold text-sky-700 uppercase tracking-wider"
              >
                No
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-bold text-sky-700 uppercase tracking-wider"
              >
                Nama
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-bold text-sky-700 uppercase tracking-wider"
              >
                Unit
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-bold text-sky-700 uppercase tracking-wider"
              >
                Stok
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-bold text-sky-700 uppercase tracking-wider"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="(item, index) in paginatedInventories"
              :key="item.id"
              class="hover:bg-indigo-50 transition duration-150"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                {{ (currentPage - 1) * itemsPerPage + index + 1 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ item.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ item.unit }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {{ formatNumber(item.stock) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <div class="flex items-center justify-center space-x-3">
                  <button
                    @click="openModal(item.id)"
                    class="text-indigo-600 hover:text-indigo-800 transform hover:scale-110 transition duration-200 p-1 rounded-full hover:bg-indigo-100"
                  >
                    <PencilSquareIcon class="w-5 h-5" />
                  </button>
                  <button
                    @click="deleteItem(item.id)"
                    class="text-red-500 hover:text-red-700 transform hover:scale-110 transition duration-200 p-1 rounded-full hover:bg-red-100"
                  >
                    <TrashIcon class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredInventories.length === 0">
              <td colspan="5" class="text-center py-10 text-gray-500 text-lg">
                <p class="mb-2">Tidak ada data inventaris ditemukan.</p>
                <p class="text-sm">Coba sesuaikan pencarian Anda.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex flex-col items-center mt-6">
        <div class="text-sm text-gray-600 mb-3">
          Menampilkan {{ paginatedInventories.length }} dari {{ filteredInventories.length }} item
        </div>
        <div class="flex space-x-3">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-4 py-2 rounded-lg border text-sm font-medium transition duration-200"
            :class="
              currentPage === 1
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-white hover:bg-sky-100 text-sky-700 border-sky-300 shadow-sm'
            "
          >
            Sebelumnya
          </button>
          <span class="text-md font-semibold flex items-center justify-center text-sky-800">
            Halaman {{ currentPage }} dari {{ totalPages }}
          </span>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 rounded-lg border text-sm font-medium transition duration-200"
            :class="
              currentPage === totalPages
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-white hover:bg-sky-100 text-sky-700 border-sky-300 shadow-sm'
            "
          >
            Berikutnya
          </button>
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
import Swal from 'sweetalert2'
import api from '/utils/axios' // Sesuaikan path ini

const inventories = ref([]) // Mengubah nama state dari 'inventory' menjadi 'inventories' untuk konsistensi
const modalOpen = ref(false)
const editId = ref(null)
const searchQuery = ref('') // State untuk pencarian
const currentPage = ref(1) // State untuk pagination
const itemsPerPage = 10 // Jumlah item per halaman

// Computed properties untuk ringkasan statistik
const totalUniqueItems = computed(() => inventories.value.length)
const totalStock = computed(() =>
  inventories.value.reduce((sum, item) => sum + parseFloat(item.stock || 0), 0),
)

// Filtered inventories berdasarkan search query
const filteredInventories = computed(() => {
  if (!searchQuery.value) {
    return inventories.value
  }
  const query = searchQuery.value.toLowerCase()
  return inventories.value.filter(
    (item) => item.name.toLowerCase().includes(query) || item.unit.toLowerCase().includes(query),
  )
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

// Watcher untuk mereset halaman saat search query berubah
watch(searchQuery, () => {
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

// Fungsi untuk menghapus search query
function clearSearch() {
  searchQuery.value = ''
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
