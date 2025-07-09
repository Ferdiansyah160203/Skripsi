<template>
  <DefaultLayout>
    <div class="p-6 bg-gray-50 min-h-screen">
      <!-- Search and Filter Section -->
      <div class="bg-white rounded-lg shadow mb-6">
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Cari Transaksi</label>
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Cari ID transaksi, member, atau item..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai</label>
              <input
                type="date"
                v-model="filterStart"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Akhir</label>
              <input
                type="date"
                v-model="filterEnd"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>
          <div class="flex gap-2 mt-4">
            <button
              @click="applyFilter"
              class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200 flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                  clip-rule="evenodd"
                />
              </svg>
              Filter
            </button>
            <button
              @click="resetFilter"
              class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-200 flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clip-rule="evenodd"
                />
              </svg>
              Reset
            </button>
          </div>
        </div>
      </div>
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="bg-red-500 text-white p-4 rounded-lg shadow">
          <div class="flex items-center">
            <div class="p-3 bg-white rounded-full mr-3">
              <ArrowRightLeft class="text-red-600" />
            </div>
            <div>
              <p class="text-sm font-medium">Total Transaksi</p>
              <p class="text-3xl font-bold">{{ totalTransactions }}</p>
            </div>
          </div>
        </div>
        <div class="bg-red-500 text-white p-4 rounded-lg shadow">
          <div class="flex items-center">
            <div class="p-3 bg-white rounded-full mr-3">
              <ShoppingCart class="text-red-600" />
            </div>
            <div>
              <p class="text-sm font-medium">Total Penjualan</p>
              <p class="text-3xl font-bold">Rp {{ formatCurrency(totalSales) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-800">Riwayat Transaksi</h2>
          <button
            @click="exportToPDF"
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
                  ID Transaksi
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tanggal
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Item
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Qty Jual
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Bayar
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Kembali
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Metode
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="(item, index) in paginatedTransactions"
                :key="item.id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ formatTransactionId(item.id) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDateTime(item.createdAt) }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  <span
                    v-for="i in parseItems(item.items).slice(0, 2)"
                    :key="i.product_id"
                    class="block"
                  >
                    {{ i.name }}
                  </span>
                  <span
                    v-if="parseItems(item.items).length > 2"
                    class="text-gray-400 text-xs italic"
                  >
                    +{{ parseItems(item.items).length - 2 }} item lainnya
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ item.quantity_sold }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Rp{{ formatCurrency(item.final_price) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Rp{{ formatCurrency(item.cash_paid || 0) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Rp{{ formatCurrency(item.change || 0) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                  {{ item.payment_method }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                      item.status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800',
                    ]"
                  >
                    {{ item.status === 'paid' ? 'Lunas' : 'Belum Lunas' }}
                  </span>
                </td>
              </tr>
              <tr v-if="filteredTransactions.length === 0">
                <td colspan="10" class="px-6 py-8 text-center text-gray-500">
                  <p class="mb-2">Tidak ada data transaksi yang ditemukan.</p>
                  <p class="text-sm">Coba sesuaikan filter atau pencarian Anda.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div class="mt-6 flex flex-col sm:flex-row justify-between items-center">
        <div class="text-sm text-gray-600 mb-4 sm:mb-0">
          Menampilkan {{ paginatedTransactions.length }} dari
          {{ filteredTransactions.length }} transaksi
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-3 py-1 text-sm border rounded-md transition duration-200"
            :class="
              currentPage === 1
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            "
          >
            Previous
          </button>

          <span class="text-sm text-gray-700"> Page {{ currentPage }} of {{ totalPages }} </span>

          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 text-sm border rounded-md transition duration-200"
            :class="
              currentPage === totalPages
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            "
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import api from '/utils/axios'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { ArrowRightLeft, ShoppingCart } from 'lucide-vue-next'
import Swal from 'sweetalert2'

// State
const transactions = ref([]) // Semua transaksi dari API (data mentah)
const filterStart = ref('')
const filterEnd = ref('')
const filterStatus = ref('')
const searchQuery = ref('')
const filteredTransactions = ref([]) // Transaksi setelah difilter (untuk tabel dan pagination)
const currentPage = ref(1)
const itemsPerPage = 10

// Ambil data saat mount
onMounted(() => {
  fetchTransactions()
})

// Computed properties untuk ringkasan statistik
const totalTransactions = computed(() => filteredTransactions.value.length)
const totalSales = computed(() => {
  return filteredTransactions.value
    .filter((t) => t.status === 'paid')
    .reduce((sum, t) => sum + Number(t.final_price), 0)
})

// Computed properties untuk pagination
const totalPages = computed(() => {
  return Math.ceil(filteredTransactions.value.length / itemsPerPage)
})

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredTransactions.value.slice(start, end)
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

// Ambil data dari API
async function fetchTransactions() {
  try {
    const { data } = await api.get('/api/transactions/')
    transactions.value = data
    applyFilter()
  } catch (err) {
    console.error('Gagal mengambil data transaksi:', err)
    Swal.fire('Error', 'Gagal memuat data transaksi.', 'error')
  }
}

// Filter transaksi berdasarkan tanggal, status, & pencarian
// Reset ke halaman 1 setiap kali filter/search diubah
function applyFilter() {
  filteredTransactions.value = transactions.value.filter((item) => {
    const date = new Date(item.createdAt)
    const start = filterStart.value ? new Date(filterStart.value) : null
    const end = filterEnd.value ? new Date(filterEnd.value + 'T23:59:59.999') : null // Termasuk seluruh hari

    const matchDate = (!start || date >= start) && (!end || date <= end)
    const matchStatus = !filterStatus.value || item.status === filterStatus.value

    const query = searchQuery.value.toLowerCase()
    const matchSearch =
      !query ||
      formatTransactionId(item.id).toLowerCase().includes(query) || // Gunakan formatTransactionId di sini
      (item.member_identifier && item.member_identifier.toLowerCase().includes(query)) ||
      (item.items && parseItems(item.items).some((i) => i.name.toLowerCase().includes(query)))

    return matchDate && matchStatus && matchSearch
  })
  currentPage.value = 1
}

// Reset semua filter dan pencarian
function resetFilter() {
  filterStart.value = ''
  filterEnd.value = ''
  filterStatus.value = ''
  searchQuery.value = ''
  applyFilter()
}

// Watcher untuk search query, akan memanggil applyFilter saat nilai berubah
watch(searchQuery, () => {
  applyFilter()
})

// Watcher untuk filterStart, filterEnd, dan filterStatus, akan memanggil applyFilter saat nilai berubah
watch([filterStart, filterEnd, filterStatus], () => {
  applyFilter()
})

// Helper function untuk format ID transaksi (mengatasi number to string issue)
const formatTransactionId = (id) => {
  const idStr = String(id)
  // Jika ID lebih panjang dari 8 karakter, potong dan tambahkan '...'
  // Menggunakan 'idStr.length > 8' untuk memastikan ID yang pendek tidak dipotong.
  if (idStr.length > 8) {
    return idStr.substring(0, 8) + '...'
  }
  return idStr // Tampilkan sepenuhnya jika pendek
}

// Format angka & tanggal
const formatCurrency = (num) => {
  if (typeof num !== 'number') {
    num = parseFloat(num)
  }
  if (isNaN(num)) return '0'
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

const formatDateTime = (dateString) => {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}

// Export PDF
function exportToPDF() {
  const doc = new jsPDF()

  doc.setFontSize(16)
  doc.setTextColor(40)
  doc.text('Laporan Transaksi', 14, 15)

  const rows = filteredTransactions.value.map((t, index) => {
    const itemsArr = parseItems(t.items)
    // Tampilan item di PDF juga diubah tanpa ()
    const itemNames = itemsArr.map((i) => `${i.name} x ${i.qty || i.quantity_sold || 1}`).join(', ')
    const displayItems = itemNames.length > 50 ? itemNames.substring(0, 47) + '...' : itemNames

    return [
      index + 1,
      formatTransactionId(t.id), // Menggunakan helper function yang lebih cerdas
      formatDateTime(t.createdAt),
      displayItems,
      t.quantity_sold, // Menambahkan kolom quantity_sold di PDF juga
      `Rp${formatCurrency(t.final_price)}`,
      `Rp${formatCurrency(t.cash_paid || 0)}`,
      `Rp${formatCurrency(t.change || 0)}`,
      t.payment_method,
      t.status === 'paid' ? 'Lunas' : 'Belum Lunas',
    ]
  })

  autoTable(doc, {
    startY: 25,
    head: [
      [
        'No',
        'ID Transaksi',
        'Tanggal',
        'Item',
        'Qty Jual',
        'Total',
        'Bayar',
        'Kembali',
        'Metode',
        'Status',
      ], // Tambah header Qty Jual
    ],
    body: rows,
    styles: { fontSize: 7, cellPadding: 1, overflow: 'linebreak' },
    headStyles: { fillColor: [46, 125, 50], fontStyle: 'bold' },
    theme: 'grid',
    didDrawPage: function (data) {
      let str = 'Page ' + doc.internal.getNumberOfPages()
      doc.setFontSize(9)
      doc.setTextColor(100)
      doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 10)
    },
  })

  const total = totalSales.value
  doc.setFontSize(12)
  doc.setTextColor(40)
  doc.text(`Total Penjualan (Lunas): Rp${formatCurrency(total)}`, 14, doc.lastAutoTable.finalY + 10)

  const filename = `laporan-transaksi-${new Date().toISOString().slice(0, 10)}.pdf`
  doc.save(filename)
}

function parseItems(items) {
  if (Array.isArray(items)) return items
  if (typeof items === 'string') {
    try {
      let parsed = JSON.parse(items)
      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed)
      }
      return parsed.map((item) => ({
        name: item.name || 'Unknown Item',
        qty: item.qty || item.quantity || item.quantity_sold || 1,
        subtotal:
          item.subtotal || item.price * (item.qty || item.quantity || item.quantity_sold || 1) || 0,
        price: item.price || 0,
      }))
    } catch (e) {
      console.error('Error parsing items JSON:', e, 'Raw data:', items)
      return []
    }
  }
  return []
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
