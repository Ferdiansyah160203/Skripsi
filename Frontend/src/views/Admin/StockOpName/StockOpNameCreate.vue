<template>
  <DefaultLayout>
    <div
      class="p-6 bg-gradient-to-br from-indigo-50 to-white min-h-screen rounded-xl shadow-lg mb-8"
    >
      <h1 class="text-4xl font-extrabold text-indigo-800 mb-8 flex items-center gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-10 w-10 text-blue-600"
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
      </h1>

      <div
        v-if="loading"
        class="text-center py-8 text-gray-500 text-lg bg-white rounded-xl shadow border border-gray-200"
      >
        <svg
          class="animate-spin h-8 w-8 text-indigo-500 mx-auto mb-3"
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
        class="text-center py-10 text-gray-500 text-lg bg-white rounded-xl shadow border border-gray-200"
      >
        <p class="mb-2">Tidak ada inventaris yang tersedia untuk stock opname.</p>
        <p class="text-sm">
          Silakan tambahkan inventaris terlebih dahulu di halaman
          <RouterLink to="/inventories" class="text-blue-600 hover:underline">Inventaris</RouterLink
          >.
        </p>
      </div>

      <form
        v-else
        @submit.prevent="submitOpname"
        class="bg-white p-6 rounded-xl shadow-xl space-y-6 border border-gray-200"
      >
        <div class="overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
          <table class="min-w-full text-sm text-gray-800 divide-y divide-gray-200">
            <thead>
              <tr class="bg-gradient-to-r from-blue-100 to-indigo-100">
                <th class="px-4 py-3 text-center font-semibold w-12 text-gray-700">No.</th>
                <th class="px-4 py-3 text-left font-semibold text-gray-700">Nama Bahan</th>
                <th class="px-4 py-3 text-left font-semibold text-gray-700">Satuan</th>
                <th class="px-4 py-3 text-right font-semibold text-gray-700">Stock Tercatat</th>
                <th class="px-4 py-3 text-right font-semibold text-gray-700">Stock Aktual</th>
                <th class="px-4 py-3 text-left font-semibold text-gray-700">Catatan</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(item, idx) in inventories"
                :key="item.id"
                :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
                class="transition hover:bg-blue-50"
              >
                <td class="border-b px-4 py-3 text-center font-bold text-gray-800">
                  {{ idx + 1 }}
                </td>
                <td class="border-b px-4 py-3 text-gray-900 font-medium">
                  {{ item.name }}
                </td>
                <td class="border-b px-4 py-3 text-gray-700">
                  {{ item.unit }}
                </td>
                <td class="border-b px-4 py-3 text-right font-mono text-gray-700">
                  {{ formatNumber(item.stock) }}
                </td>
                <td class="border-b px-4 py-3 text-right">
                  <input
                    type="number"
                    min="0"
                    class="w-24 border border-gray-300 rounded-lg px-2 py-1 text-right focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                    v-model.number="formItems[idx].actual_stock"
                    required
                  />
                </td>
                <td class="border-b px-4 py-3">
                  <input
                    type="text"
                    class="w-40 border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                    v-model="formItems[idx].note"
                    placeholder="Opsional"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex justify-between items-center mt-6">
          <RouterLink
            to="/stock-opname"
            class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300 transform hover:scale-105 shadow-md text-lg font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
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
            class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105 shadow-md text-lg font-medium"
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
              class="h-6 w-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clip-rule="evenodd"
              />
            </svg>
            Submit Stock Opname
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
