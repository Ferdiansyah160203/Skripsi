<template>
  <div class="p-6 bg-gradient-to-br from-indigo-50 to-white min-h-screen rounded-xl shadow-lg mb-8">
    <h1
      class="text-4xl font-extrabold text-indigo-800 mb-8 text-center flex items-center justify-center gap-3"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-10 w-10 text-blue-600"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
          clip-rule="evenodd"
        />
      </svg>
      Cek Poin Member
    </h1>

    <div class="max-w-md mx-auto bg-white p-8 rounded-xl shadow-xl border border-gray-200">
      <div class="mb-6">
        <label for="memberIdentifier" class="block text-lg font-semibold text-gray-700 mb-2">
          Masukkan Nomor HP atau Email Member
        </label>
        <input
          id="memberIdentifier"
          type="text"
          v-model="memberIdentifier"
          @input="debouncedFetchMember"
          placeholder="Contoh: 081234567890 atau email@example.com"
          class="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200 text-lg"
        />
      </div>

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
        Mencari data member...
      </div>

      <div
        v-else-if="!memberIdentifier || !memberData"
        class="text-center py-4 text-gray-500 border-t pt-4 mt-6"
      >
        <p v-if="memberIdentifier && !memberData && !loading">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-red-500 mx-auto mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Member tidak ditemukan.
        </p>
        <p v-else>Masukkan ID member untuk melihat detail poin.</p>
      </div>

      <div v-else class="space-y-4 border-t pt-4 mt-6">
        <div class="bg-blue-50 p-4 rounded-lg flex items-center gap-4 shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8 text-blue-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clip-rule="evenodd"
            />
          </svg>
          <div>
            <p class="text-sm text-gray-600">Nama Member</p>
            <p class="text-xl font-bold text-blue-800">{{ memberData.name }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-green-50 p-4 rounded-lg flex items-center gap-4 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 text-green-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                clip-rule="evenodd"
              />
            </svg>
            <div>
              <p class="text-sm text-gray-600">Total Pengeluaran</p>
              <p class="text-xl font-bold text-green-800">
                Rp {{ formatCurrency(memberData.total_spent) }}
              </p>
            </div>
          </div>

          <div class="bg-yellow-50 p-4 rounded-lg flex items-center gap-4 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 text-yellow-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
            <div>
              <p class="text-sm text-gray-600">Total Poin</p>
              <p class="text-xl font-bold text-yellow-800">
                {{ formatNumber(memberData.total_points) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import api from '/utils/axios'
import debounce from 'lodash.debounce'

const memberIdentifier = ref('')
const memberData = ref(null)
const loading = ref(false)

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

// Fungsi untuk mengambil data member
const fetchMemberData = async () => {
  const identifier = memberIdentifier.value.trim()
  if (!identifier) {
    memberData.value = null
    return
  }

  loading.value = true
  memberData.value = null // Reset data sebelumnya

  try {
    const response = await api.get(`/api/members/${identifier}`)
    memberData.value = response.data
  } catch (error) {
    console.error('Error fetching member data:', error)
    memberData.value = null // Set null jika tidak ditemukan atau error
  } finally {
    loading.value = false
  }
}

// Gunakan debounce agar API call tidak terlalu sering saat user mengetik
const debouncedFetchMember = debounce(fetchMemberData, 500) // Debounce 500ms

// Watcher untuk membersihkan data ketika input identifier kosong
watch(memberIdentifier, (newValue) => {
  if (!newValue.trim()) {
    memberData.value = null
    loading.value = false
  }
})

// onMounted(() => {
//   // Contoh: jika Anda ingin mengambil ID dari URL params saat halaman dimuat
//   const urlParams = new URLSearchParams(window.location.search);
//   const idFromUrl = urlParams.get('id');
//   if (idFromUrl) {
//     memberIdentifier.value = idFromUrl;
//     fetchMemberData();
//   }
// });
</script>

<style scoped>
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
