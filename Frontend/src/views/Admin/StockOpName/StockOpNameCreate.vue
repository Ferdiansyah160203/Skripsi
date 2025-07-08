<template>
  <DefaultLayout>
    <div class="p-6 bg-gray-50 min-h-screen">
      <!-- Header Section -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Buat Stock Opname Baru</h1>
        <p class="text-gray-600">Lakukan pencatatan stok aktual untuk semua inventaris</p>
      </div>

      <div v-if="loading" class="p-8 text-center text-gray-500 bg-white rounded-lg shadow">
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
        Memuat daftar inventaris...
      </div>

      <div
        v-else-if="inventories.length === 0"
        class="p-8 text-center text-gray-500 bg-white rounded-lg shadow"
      >
        <p class="mb-2">Tidak ada inventaris yang tersedia untuk stock opname.</p>
        <p class="text-sm">
          Silakan tambahkan inventaris terlebih dahulu di halaman
          <RouterLink to="/inventories" class="text-red-600 hover:underline">Inventaris</RouterLink
          >.
        </p>
      </div>

      <form v-else @submit.prevent="submitOpname" class="bg-white rounded-lg shadow">
        <div class="p-6 border-b">
          <h2 class="text-xl font-bold text-gray-800">Daftar Inventaris</h2>
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
                  Nama Bahan
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Satuan
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Stok Tercatat
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Stok Aktual
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Catatan
                </th>
              </tr>
            </thead>

            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(item, idx) in inventories" :key="item.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ idx + 1 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ item.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ item.unit }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {{ formatNumber(item.stock) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    class="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    v-model.number="formItems[idx].actual_stock"
                    required
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <input
                    type="text"
                    class="w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    v-model="formItems[idx].note"
                    placeholder="Catatan opsional"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="p-6 bg-gray-50 border-t flex justify-between items-center">
          <RouterLink
            to="/stock-opname"
            class="inline-flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clip-rule="evenodd"
              />
            </svg>
            Kembali
          </RouterLink>

          <button
            type="submit"
            class="inline-flex items-center gap-2 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
            :disabled="isSubmitting"
          >
            <svg
              v-if="isSubmitting"
              class="animate-spin h-5 w-5 text-white"
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
            <svg
              v-else
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
            {{ isSubmitting ? 'Menyimpan...' : 'Simpan Stock Opname' }}
          </button>
        </div>
      </form>
    </div>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue' // Sesuaikan path ini
import { ref, onMounted } from 'vue'
import api from '/utils/axios' // Sesuaikan path ini
import Swal from 'sweetalert2' // Import SweetAlert2
import { useRouter } from 'vue-router' // Import useRouter

const router = useRouter() // Inisialisasi router

const inventories = ref([])
const formItems = ref([])
const isSubmitting = ref(false)
const loading = ref(true) // Tambahkan state loading

// Helper function untuk format angka (misal stok)
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

const fetchInventories = async () => {
  loading.value = true // Set loading true saat memulai fetch
  try {
    const res = await api.get('/api/inventories')
    inventories.value = res.data

    // Siapkan formItems berdasarkan inventories yang di-fetch
    // Penting: actual_stock diinisialisasi dengan recorded_stock sebagai default
    formItems.value = inventories.value.map((inv) => ({
      inventories_id: inv.id,
      recorded_stock: inv.stock,
      actual_stock: inv.stock, // Default actual_stock sama dengan recorded_stock
      note: '',
    }))
  } catch (error) {
    console.error('Gagal mengambil data inventory:', error)
    Swal.fire('Error', 'Gagal memuat daftar inventaris.', 'error')
  } finally {
    loading.value = false // Set loading false setelah fetch selesai
  }
}

const submitOpname = async () => {
  if (formItems.value.length === 0) {
    Swal.fire('Peringatan', 'Tidak ada inventaris untuk di-submit.', 'warning')
    return
  }

  isSubmitting.value = true

  // Validasi sederhana: pastikan semua actual_stock terisi dan valid
  const isValid = formItems.value.every(
    (item) => item.actual_stock !== null && item.actual_stock >= 0,
  )
  if (!isValid) {
    Swal.fire(
      'Peringatan',
      'Pastikan semua "Stok Aktual" terisi dengan angka valid (>= 0).',
      'warning',
    )
    isSubmitting.value = false
    return
  }

  try {
    const payload = { items: formItems.value }
    await api.post('/api/stock-opnames/create-multiple', payload)

    // Sukses: Tampilkan SweetAlert dan navigasi
    Swal.fire({
      icon: 'success',
      title: 'Stock Opname Berhasil!',
      text: 'Data stock opname telah dicatat.',
      showConfirmButton: false,
      timer: 2000, // Otomatis menutup setelah 2 detik
    }).then(() => {
      router.push('/stock-opname') // Navigasi ke halaman riwayat stock opname
    })
  } catch (error) {
    console.error('Gagal submit stock opname:', error.response?.data || error.message)
    const errorMessage =
      error.response?.data?.message || 'Terjadi kesalahan saat submit stock opname.'
    Swal.fire('Gagal', errorMessage, 'error')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  fetchInventories()
})
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

/* Tabel styling */
table th,
table td {
  white-space: nowrap; /* Mencegah teks memecah baris di sel tabel */
}
</style>
