<template>
  <DefaultLayout>
    <div class="p-6 bg-gradient-to-br from-sky-50 to-white min-h-screen rounded-xl shadow-lg mb-8">
      <div class="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <h1 class="text-3xl md:text-4xl font-extrabold text-indigo-800 flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 md:h-10 w-8 md:w-10 text-sky-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M13 6a3 3 0 11-6 0 3 3 0 016 0zm-6 9a5 5 0 015-5h2a5 5 0 015 5v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2z"
            />
          </svg>
          Manajemen Member
        </h1>
        <button
          @click="openModal()"
          class="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 text-base md:text-lg font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-lg transition duration-300 transform hover:scale-105"
        >
          <PlusIcon class="w-5 md:w-6 h-5 md:h-6" />
          Tambah Member Baru
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600">Total Member</p>
            <p class="text-3xl font-bold text-indigo-800">{{ totalMembers }}</p>
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
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600">Total Pengeluaran Member</p>
            <p class="text-3xl font-bold text-green-800">Rp {{ formatCurrency(totalSpent) }}</p>
          </div>
        </div>
        <div class="bg-yellow-100 p-6 rounded-xl shadow-md flex items-center gap-4">
          <div class="p-3 bg-yellow-200 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 text-yellow-700"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600">Total Poin Member</p>
            <p class="text-3xl font-bold text-yellow-800">{{ formatNumber(totalPoints) }}</p>
          </div>
        </div>
      </div>

      <div class="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Cari nama, email, atau phone..."
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
                Phone
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-bold text-sky-700 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-bold text-sky-700 uppercase tracking-wider"
              >
                Total Spent
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-bold text-sky-700 uppercase tracking-wider"
              >
                Total Poin
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
              v-for="(item, index) in paginatedMembers"
              :key="item.id"
              class="hover:bg-indigo-50 transition duration-150"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                {{ (currentPage - 1) * itemsPerPage + index + 1 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ item.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ item.phone }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ item.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                Rp {{ formatCurrency(item.total_spent) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {{ formatNumber(item.total_points) }}
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
            <tr v-if="filteredMembers.length === 0">
              <td colspan="7" class="text-center py-10 text-gray-500 text-lg">
                <p class="mb-2">Tidak ada data Member ditemukan.</p>
                <p class="text-sm">Coba sesuaikan pencarian Anda.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex flex-col items-center mt-6">
        <div class="text-sm text-gray-600 mb-3">
          Menampilkan {{ paginatedMembers.length }} dari {{ filteredMembers.length }} member
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

// Helper untuk format mata uang
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
