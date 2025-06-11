<template>
  <DefaultLayout>
    <div
      class="p-6 bg-gradient-to-br from-yellow-50 to-white min-h-screen rounded-xl shadow-lg mb-8"
    >
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-4xl font-extrabold text-indigo-800 flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-10 w-10 text-yellow-600"
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
          Detail Stock Opname
        </h1>
        <button
          @click="exportPDF"
          class="flex items-center gap-2 px-6 py-3 text-lg font-medium text-white bg-yellow-600 hover:bg-yellow-700 rounded-xl shadow-lg transition duration-300 transform hover:scale-105"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
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
          Export PDF
        </button>
      </div>

      <div class="bg-white p-6 rounded-xl shadow mb-8 border border-gray-200">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Informasi Sesi</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <div class="flex justify-between items-center">
            <span class="font-semibold">ID Sesi:</span>
            <span class="font-mono text-gray-900">{{ sessionId }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="font-semibold">Tanggal Opname:</span>
            <span>{{ formatDateTime(opnames[0]?.createdAt || new Date()) }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="font-semibold">Total Item Diopname:</span>
            <span>{{ opnames.length }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="font-semibold">Total Selisih Stok:</span>
            <span
              :class="{
                'text-red-600': totalDifference < 0,
                'text-green-600': totalDifference > 0,
                'text-gray-700': totalDifference === 0,
              }"
            >
              {{ formatNumber(totalDifference) }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="loading" class="text-center py-8 text-gray-500 text-lg">
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
        Memuat data stock opname...
      </div>
      <div
        v-else-if="opnames.length === 0"
        class="text-center py-10 text-gray-500 text-lg bg-white rounded-xl shadow border border-gray-200"
      >
        <p class="mb-2">Tidak ada data stock opname untuk sesi ini.</p>
        <p class="text-sm">Pastikan ID sesi benar atau data telah dicatat.</p>
      </div>

      <div v-else class="overflow-x-auto bg-white shadow-xl rounded-xl border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-yellow-50">
            <tr>
              <th
                class="px-6 py-3 text-center text-xs font-bold text-yellow-700 uppercase tracking-wider"
              >
                No.
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-bold text-yellow-700 uppercase tracking-wider"
              >
                Nama Bahan
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-bold text-yellow-700 uppercase tracking-wider"
              >
                Satuan
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-bold text-yellow-700 uppercase tracking-wider"
              >
                Stok Tercatat
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-bold text-yellow-700 uppercase tracking-wider"
              >
                Stok Aktual
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-bold text-yellow-700 uppercase tracking-wider"
              >
                Selisih
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-bold text-yellow-700 uppercase tracking-wider"
              >
                Catatan
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="(item, idx) in opnames"
              :key="item.id"
              class="hover:bg-yellow-50 transition-colors even:bg-gray-50"
            >
              <td class="px-6 py-4 text-center whitespace-nowrap text-sm font-medium text-gray-800">
                {{ idx + 1 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ item.inventory?.name || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {{ item.inventory?.unit || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                {{ formatNumber(item.recorded_stock) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
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
              <td class="px-6 py-4 text-sm text-gray-700">{{ item.note || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <RouterLink
        to="/stock-opname"
        class="inline-flex items-center justify-center gap-2 mt-8 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300 transform hover:scale-105 shadow-md text-lg font-medium"
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
        Kembali ke Riwayat
      </RouterLink>
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
