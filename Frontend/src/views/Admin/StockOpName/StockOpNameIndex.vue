<template>
  <DefaultLayout>
    <div
      class="p-6 bg-gradient-to-br from-purple-50 to-white min-h-screen rounded-xl shadow-lg mb-8"
    >
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-4xl font-extrabold text-indigo-800 flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-10 w-10 text-purple-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
              clip-rule="evenodd"
            />
          </svg>
          Riwayat Stock Opname
        </h1>
        <RouterLink to="/stock-opname/create">
          <button
            class="flex items-center gap-2 px-6 py-3 text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg transition duration-300 transform hover:scale-105"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M9.505 1.547a1.004 1.004 0 011.006 0L15.342 3H18a1 1 0 011 1v12a1 1 0 01-1 1h-2.658l-4.832 2.453a1.004 1.004 0 01-1.006 0L4.658 17H2a1 1 0 01-1-1V4a1 1 0 011-1h2.658l4.832-2.453zM10 11a1 1 0 100-2 1 1 0 000 2z"
                clip-rule="evenodd"
              />
            </svg>
            Buat Stock Opname Baru
          </button>
        </RouterLink>
      </div>

      <div
        v-if="loading"
        class="text-center py-8 text-gray-500 text-lg bg-white rounded-xl shadow border border-gray-200"
      >
        <svg
          class="animate-spin h-8 w-8 text-purple-500 mx-auto mb-3"
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
      <div
        v-else-if="opnames.length === 0"
        class="text-center py-10 text-gray-500 text-lg bg-white rounded-xl shadow border border-gray-200"
      >
        <p class="mb-2">Belum ada riwayat stock opname.</p>
        <p class="text-sm">Klik "Buat Stock Opname Baru" untuk memulai.</p>
      </div>

      <div v-else class="overflow-x-auto rounded-xl shadow-xl border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200 bg-white">
          <thead class="bg-purple-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-bold text-purple-700 uppercase tracking-wider"
              >
                No.
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-bold text-purple-700 uppercase tracking-wider"
              >
                ID Sesi Opname
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-bold text-purple-700 uppercase tracking-wider"
              >
                Tanggal
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-bold text-purple-700 uppercase tracking-wider"
              >
                Jumlah Item Diopname
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-bold text-purple-700 uppercase tracking-wider"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="(opname, index) in paginatedOpnames"
              :key="opname.session_id"
              class="hover:bg-purple-50 transition-colors duration-150"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                {{ (currentPage - 1) * itemsPerPage + index + 1 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                {{ formatSessionId(opname.session_id) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {{ formatDateTime(opname.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {{ opname.item_count }} item
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <div class="flex items-center justify-center space-x-3">
                  <RouterLink
                    :to="`/stock-opname/show/${opname.session_id}`"
                    class="p-1 rounded-full text-blue-600 hover:text-blue-800 transform hover:scale-110 transition duration-200 hover:bg-blue-100"
                    title="Lihat Detail"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
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
                    class="p-1 rounded-full text-red-500 hover:text-red-700 transform hover:scale-110 transition duration-200 hover:bg-red-100"
                    title="Hapus Sesi"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 000-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
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

      <div class="flex flex-col items-center mt-6">
        <div class="text-sm text-gray-600 mb-3">
          Menampilkan {{ paginatedOpnames.length }} dari {{ opnames.length }} sesi
        </div>
        <div class="flex space-x-3">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-4 py-2 rounded-lg border text-sm font-medium transition duration-200"
            :class="
              currentPage === 1
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-white hover:bg-purple-100 text-purple-700 border-purple-300 shadow-sm'
            "
          >
            Sebelumnya
          </button>
          <span class="text-md font-semibold flex items-center justify-center text-purple-800">
            Halaman {{ currentPage }} dari {{ totalPages }}
          </span>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 rounded-lg border text-sm font-medium transition duration-200"
            :class="
              currentPage === totalPages
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-white hover:bg-purple-100 text-purple-700 border-purple-300 shadow-sm'
            "
          >
            Berikutnya
          </button>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue' // Sesuaikan path ini
import { ref, onMounted, computed } from 'vue'
import api from '/utils/axios' // Sesuaikan path ini
import Swal from 'sweetalert2'

const opnames = ref([])
const loading = ref(true) // State untuk loading

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

// Computed properties untuk pagination
const totalPages = computed(() => {
  return Math.ceil(opnames.value.length / itemsPerPage)
})

const paginatedOpnames = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return opnames.value.slice(start, end)
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
