<template>
  <DefaultLayout>
    <div class="p-6 space-y-6">
      <!-- Header Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-[#DB3A40] rounded-full flex items-center justify-center">
              <UsersRound class="text-white" />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Manajemen Member</h1>
              <p class="text-sm text-gray-600">Kelola dan pantau data member</p>
            </div>
          </div>
          <button
            @click="openModal()"
            class="inline-flex items-center gap-2 px-4 py-2 bg-[#DB3A40] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <PlusIcon class="w-4 h-4" />
            Tambah Member Baru
          </button>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Member</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalMembers }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                class="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Pengeluaran Member</p>
              <p class="text-2xl font-bold text-gray-900">Rp {{ formatCurrency(totalSpent) }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg
                class="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Poin Member</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatNumber(totalPoints) }}</p>
            </div>
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg
                class="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Search Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Pencarian Member</h3>
        <div class="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Cari nama, email, atau phone..."
            class="flex-grow px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            @click="clearSearch"
            v-if="searchQuery"
            class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
          >
            Clear
          </button>
        </div>
      </div>

      <!-- Data Table -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Data Member</h3>
          <p class="text-sm text-gray-600">
            Menampilkan {{ paginatedMembers.length }} dari {{ filteredMembers.length }} member
          </p>
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
                  Phone
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total Spent
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total Poin
                </th>
                <th
                  class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="(item, index) in paginatedMembers"
                :key="item.id"
                class="hover:bg-gray-50 transition-colors duration-200"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ item.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.phone }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Rp {{ formatCurrency(item.total_spent) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatNumber(item.total_points) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div class="flex items-center justify-center space-x-2">
                    <button
                      @click="openModal(item.id)"
                      title="Edit Member"
                      class="text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-1 rounded transition-colors duration-200"
                    >
                      <PencilSquareIcon class="w-4 h-4" />
                    </button>
                    <button
                      @click="deleteItem(item.id)"
                      title="Hapus Member"
                      class="text-red-600 hover:text-red-800 hover:bg-red-100 p-1 rounded transition-colors duration-200"
                    >
                      <TrashIcon class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredMembers.length === 0">
                <td colspan="7" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center justify-center">
                    <svg
                      class="w-12 h-12 text-gray-400 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                    <h3 class="text-lg font-medium text-gray-900 mb-1">Tidak ada data member</h3>
                    <p class="text-gray-500">Coba sesuaikan pencarian Anda.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div class="bg-white px-6 py-4 border-t border-gray-200 rounded-b-lg">
        <div class="flex items-center justify-between">
          <div class="flex items-center text-sm text-gray-700">
            <span
              >Menampilkan {{ paginatedMembers.length }} dari
              {{ filteredMembers.length }} member</span
            >
          </div>

          <div class="flex items-center space-x-2">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200"
              :class="
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              "
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Sebelumnya
            </button>

            <span class="text-sm text-gray-700 px-3 py-2">
              Halaman {{ currentPage }} dari {{ totalPages }}
            </span>

            <button
              @click="nextPage"
              :disabled="currentPage === totalPages || totalPages === 0"
              class="relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200"
              :class="
                currentPage === totalPages || totalPages === 0
                  ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              "
            >
              Berikutnya
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <ModalMember
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
import ModalMember from './ModalMember.vue' // Sesuaikan path ini
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/solid'
import { UsersRound } from 'lucide-vue-next' // Menggunakan icon dari lucide-vue-next
import Swal from 'sweetalert2'
import api from '/utils/axios' // Sesuaikan path ini

const members = ref([]) // Mengubah nama state dari 'member' menjadi 'members' untuk menghindari konflik
const modalOpen = ref(false)
const editId = ref(null)
const searchQuery = ref('') // State untuk pencarian
const currentPage = ref(1) // State untuk pagination
const itemsPerPage = 10 // Jumlah item per halaman

// Computed properties untuk ringkasan statistik
const totalMembers = computed(() => members.value.length)
const totalSpent = computed(() =>
  members.value.reduce((sum, m) => sum + parseFloat(m.total_spent || 0), 0),
)
const totalPoints = computed(() =>
  members.value.reduce((sum, m) => sum + parseFloat(m.total_points || 0), 0),
)

// Filtered members berdasarkan search query
const filteredMembers = computed(() => {
  if (!searchQuery.value) {
    return members.value
  }
  const query = searchQuery.value.toLowerCase()
  return members.value.filter(
    (member) =>
      member.name.toLowerCase().includes(query) ||
      member.phone.toLowerCase().includes(query) ||
      (member.email && member.email.toLowerCase().includes(query)),
  )
})

// Computed properties untuk pagination
const totalPages = computed(() => {
  return Math.ceil(filteredMembers.value.length / itemsPerPage)
})

const paginatedMembers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredMembers.value.slice(start, end)
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
  fetchMembers()
})

function openModal(id = null) {
  editId.value = id
  modalOpen.value = true
}

// Fungsi untuk refresh data setelah save/edit di modal
function refreshData() {
  fetchMembers()
  modalOpen.value = false
  Swal.fire(
    'Berhasil',
    `Member berhasil ${editId.value ? 'diperbarui' : 'ditambahkan'}.`,
    'success',
  )
}

// Fetch data members
async function fetchMembers() {
  try {
    const { data } = await api.get('/api/members')
    members.value = data
  } catch (err) {
    console.error('Gagal memuat data member:', err)
    Swal.fire('Error', 'Gagal memuat data member.', 'error')
  }
}

// Fungsi untuk menghapus member
async function deleteItem(id) {
  const result = await Swal.fire({
    title: 'Hapus Member?',
    html: 'Anda yakin ingin menghapus member ini?<br><strong class="text-red-600">Aksi ini tidak dapat dibatalkan!</strong>',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Ya, Hapus!',
    cancelButtonText: 'Batal',
  })

  if (result.isConfirmed) {
    try {
      await api.delete(`/api/members/${id}`)
      members.value = members.value.filter((item) => item.id !== id)
      Swal.fire('Berhasil!', 'Member berhasil dihapus.', 'success')

      if (currentPage.value > totalPages.value) {
        currentPage.value = Math.max(1, totalPages.value)
      }
    } catch (err) {
      console.error('Gagal menghapus member:', err)
      Swal.fire('Gagal', 'Gagal menghapus member. Silakan coba lagi.', 'error')
    }
  }
}

// Helper functions
function clearSearch() {
  searchQuery.value = ''
}
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

// Helper untuk format angka biasa (misal poin)
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
