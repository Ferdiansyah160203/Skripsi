<template>
  <DefaultLayout>
    <div class="p-6 bg-gray-50 min-h-screen">
      <!-- Header Section -->
      <div class="mb-6">
        <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div class="flex-1">
            <h1 class="text-2xl font-bold text-gray-800">Detail Stock Opname</h1>
            <p class="text-gray-600 mt-1">ID Sesi: {{ sessionId }}</p>
          </div>
          <div class="flex gap-4">
            <button
              @click="exportPDF"
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
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
              Export PDF
            </button>
          </div>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-red-500 text-white p-4 rounded-lg shadow">
          <div class="flex items-center">
            <div class="p-3 bg-white rounded-full mr-3">
              <svg
                class="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                ></path>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium">Total Item</p>
              <p class="text-3xl font-bold">{{ opnames.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-red-500 text-white p-4 rounded-lg shadow">
          <div class="flex items-center">
            <div class="p-3 bg-white rounded-full mr-3">
              <svg
                class="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3a4 4 0 118 0v4M7 10h10l1 10H6l1-10z"
                ></path>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium">Tanggal Opname</p>
              <p class="text-lg font-bold">
                {{ formatDateTime(opnames[0]?.createdAt || new Date()) }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-red-500 text-white p-4 rounded-lg shadow">
          <div class="flex items-center">
            <div class="p-3 bg-white rounded-full mr-3">
              <svg
                class="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                ></path>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium">Total Selisih</p>
              <p
                class="text-3xl font-bold"
                :class="{
                  'text-red-200': totalDifference < 0,
                  'text-green-200': totalDifference > 0,
                  'text-white': totalDifference === 0,
                }"
              >
                {{ formatNumber(totalDifference) }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-red-500 text-white p-4 rounded-lg shadow">
          <div class="flex items-center">
            <div class="p-3 bg-white rounded-full mr-3">
              <svg
                class="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium">Status</p>
              <p class="text-3xl font-bold">Selesai</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b">
          <h2 class="text-xl font-bold text-gray-800">Detail Stock Opname</h2>
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
          Memuat data stock opname...
        </div>

        <div v-else-if="opnames.length === 0" class="p-8 text-center text-gray-500">
          <p class="mb-2">Tidak ada data stock opname untuk sesi ini.</p>
          <p class="text-sm">Pastikan ID sesi benar atau data telah dicatat.</p>
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
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Selisih
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Catatan
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(item, idx) in opnames" :key="item.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ idx + 1 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ item.inventory?.name || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ item.inventory?.unit || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {{ formatNumber(item.recorded_stock) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {{ formatNumber(item.actual_stock) }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-bold text-right"
                  :class="{
                    'text-red-600': item.difference < 0,
                    'text-green-600': item.difference > 0,
                    'text-gray-700': item.difference === 0,
                  }"
                >
                  {{ formatNumber(item.difference) }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">{{ item.note || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Back Button -->
      <div class="mt-8 flex justify-start">
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
          Kembali ke Riwayat
        </RouterLink>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue' // Sesuaikan path ini
import api from '/utils/axios' // Sesuaikan path ini
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import Swal from 'sweetalert2' // Tambahkan SweetAlert2

const route = useRoute()
const sessionId = route.params.session_id // Mengambil session_id dari route params

const opnames = ref([])
const loading = ref(true)

// Computed untuk total selisih stok (sum of differences)
const totalDifference = computed(() => {
  return opnames.value.reduce((sum, item) => sum + item.difference, 0)
})

// Helper function untuk format angka (misal stok, selisih)
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

// Fetch detail stock opname berdasarkan sessionId
const fetchOpnameDetail = async () => {
  try {
    const res = await api.get(`/api/stock-opnames/session/${sessionId}`)
    opnames.value = res.data
    // Periksa apakah opnames[0] ada sebelum mengakses createdAt
    if (opnames.value.length > 0) {
      console.log('Data opname fetched for session:', sessionId, opnames.value)
    } else {
      console.log('No opname data found for session:', sessionId)
    }
  } catch (error) {
    console.error('Gagal mengambil data opname:', error)
    Swal.fire('Error', 'Gagal memuat detail stock opname. Silakan coba lagi.', 'error')
  } finally {
    loading.value = false
  }
}

function exportPDF() {
  const doc = new jsPDF('p', 'mm', 'a4')

  doc.setFontSize(18)
  doc.setTextColor(40)
  doc.text('Laporan Stock Opname', 14, 20) // Header dokumen

  doc.setFontSize(10)
  doc.setTextColor(80)
  doc.text(`ID Sesi: ${sessionId}`, 14, 28)
  doc.text(`Tanggal Opname: ${formatDateTime(opnames.value[0]?.createdAt)}`, 14, 34)
  doc.text(`Total Item Diopname: ${opnames.value.length}`, 14, 40)
  doc.text(`Total Selisih Stok: ${formatNumber(totalDifference.value)}`, 14, 46)

  const headers = [
    ['No.', 'Nama Bahan', 'Satuan', 'Stok Tercatat', 'Stok Aktual', 'Selisih', 'Catatan'],
  ]

  const body = opnames.value.map((item, idx) => [
    idx + 1,
    item.inventory?.name || '-',
    item.inventory?.unit || '-',
    formatNumber(item.recorded_stock),
    formatNumber(item.actual_stock),
    formatNumber(item.difference),
    item.note || '-',
  ])

  autoTable(doc, {
    head: headers,
    body: body,
    startY: 55, // Sesuaikan startY setelah menambahkan info sesi
    theme: 'grid',
    headStyles: {
      fillColor: [160, 82, 45], // Warna coklat tua (#A0522D)
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
    },
    bodyStyles: {
      textColor: 50,
      fontSize: 8, // Mengurangi ukuran font agar lebih muat
    },
    columnStyles: {
      0: { halign: 'center' }, // No.
      3: { halign: 'right' }, // Stok Tercatat
      4: { halign: 'right' }, // Stok Aktual
      5: { halign: 'right' }, // Selisih
    },
    styles: {
      valign: 'middle',
      cellPadding: 2, // Mengurangi padding sel
    },
    alternateRowStyles: {
      fillColor: [245, 235, 224], // Warna baris selang-seling: coklat muda
    },
    didDrawPage: function (data) {
      // Footer page numbers
      let str = 'Page ' + doc.internal.getNumberOfPages()
      doc.setFontSize(9)
      doc.setTextColor(100)
      doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 10)
    },
  })

  doc.save(`StockOpname-${sessionId}.pdf`)
}

onMounted(() => {
  fetchOpnameDetail()
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
</style>
