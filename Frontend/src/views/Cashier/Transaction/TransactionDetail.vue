<template>
  <DefaultLayout>
    <div class="p-6 space-y-6">
      <!-- Header Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-[#DB3A40] rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Riwayat Transaksi</h1>
              <p class="text-sm text-gray-600">Kelola dan pantau semua riwayat transaksi</p>
            </div>
          </div>
          <button
            @click="exportToPDF"
            class="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export PDF
          </button>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Transaksi</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalTransactions }}</p>
            </div>
            <div class="w-12 h-12 bg-[#DB3A40] rounded-lg flex items-center justify-center">
              <ClipboardList class="text-white" />
            </div>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Penjualan (Lunas)</p>
              <p class="text-2xl font-bold text-gray-900">Rp {{ formatCurrency(totalSales) }}</p>
            </div>
            <div class="w-12 h-12 bg-[#DB3A40] rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      </div>

      <!-- Filter Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Filter & Pencarian</h3>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Cari Transaksi</label>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Cari ID transaksi..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai</label>
            <input
              type="date"
              v-model="filterStart"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Akhir</label>
            <input
              type="date"
              v-model="filterEnd"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div class="flex items-end gap-2">
            <button
              @click="applyFilter"
              class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filter
            </button>
            <button
              @click="resetFilter"
              class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reset
            </button>
          </div>
        </div>
      </div>

      <!-- Data Table -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Data Transaksi</h3>
          <p class="text-sm text-gray-600">
            Menampilkan {{ paginatedTransactions.length }} dari
            {{ filteredTransactions.length }} transaksi
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
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Catatan
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
                v-for="(item, index) in paginatedTransactions"
                :key="item.id"
                class="hover:bg-gray-50 transition-colors duration-200"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                  {{ formatTransactionId(item.id) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDateTime(item.createdAt) }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  <div
                    v-for="i in parseItems(item.items).slice(0, 2)"
                    :key="i.product_id"
                    class="mb-1"
                  >
                    <span class="block font-medium">{{ i.name }}</span>
                    <span
                      v-if="i.item_notes"
                      class="text-xs text-blue-700 bg-blue-50 px-1 py-0.5 rounded"
                    >
                      📝 {{ i.item_notes }}
                    </span>
                  </div>
                  <span
                    v-if="parseItems(item.items).length > 2"
                    class="text-gray-400 text-xs italic"
                  >
                    +{{ parseItems(item.items).length - 2 }} item lainnya
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ item.quantity_sold }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Rp{{ formatCurrency(item.final_price) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Rp{{ formatCurrency(item.cash_paid || 0) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Rp{{ formatCurrency(item.change || 0) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-600 capitalize">
                  {{ item.payment_method }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      item.status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800',
                    ]"
                  >
                    {{ item.status === 'paid' ? 'Lunas' : 'Belum Lunas' }}
                  </span>
                </td>
                <!-- Tambahkan kolom untuk catatan -->
                <td class="px-6 py-4 text-sm text-gray-900 max-w-xs">
                  <div v-if="item.notes" class="truncate" :title="item.notes">
                    <span class="text-blue-700 bg-blue-50 px-2 py-1 rounded text-xs">
                      📝
                      {{
                        item.notes.length > 30 ? item.notes.substring(0, 30) + '...' : item.notes
                      }}
                    </span>
                  </div>
                  <span v-else class="text-gray-400 text-xs italic">Tidak ada catatan</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div class="flex items-center justify-center space-x-2">
                    <button
                      @click="markAsPaid(item)"
                      v-if="item.status !== 'paid'"
                      title="Tandai Lunas"
                      class="text-green-600 hover:text-green-800 hover:bg-green-100 p-1 rounded transition-colors duration-200"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </button>
                    <button
                      @click="viewDetail(item.id)"
                      title="Lihat Detail"
                      class="text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-1 rounded transition-colors duration-200"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredTransactions.length === 0">
                <td colspan="11" class="px-6 py-12 text-center">
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
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <h3 class="text-lg font-medium text-gray-900 mb-1">Tidak ada data transaksi</h3>
                    <p class="text-gray-500">Coba sesuaikan filter atau pencarian Anda.</p>
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
              >Menampilkan {{ paginatedTransactions.length }} dari
              {{ filteredTransactions.length }} transaksi</span
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
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import api from '/utils/axios'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { ClipboardList } from 'lucide-vue-next'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import Swal from 'sweetalert2'

const router = useRouter()

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
    const end = filterEnd.value ? new Date(filterEnd.value + 'T23:59:59.999') : null

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
    const notes = t.notes ? (t.notes.length > 30 ? t.notes.substring(0, 27) + '...' : t.notes) : '-'

    return [
      index + 1,
      formatTransactionId(t.id), // Menggunakan helper function yang lebih cerdas
      formatDateTime(t.createdAt),
      displayItems,
      // Menambahkan kolom quantity_sold di PDF juga
      t.quantity_sold,
      `Rp${formatCurrency(t.final_price)}`,
      `Rp${formatCurrency(t.cash_paid || 0)}`,
      `Rp${formatCurrency(t.change || 0)}`,
      t.payment_method,
      t.status === 'paid' ? 'Lunas' : 'Belum Lunas',
      notes, // Tambahkan kolom notes di PDF
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
        'Catatan',
      ], // Tambah header Qty Jual dan Catatan
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
        product_id: item.product_id,
        item_notes: item.item_notes || null, // Include item_notes
      }))
    } catch (e) {
      console.error('Error parsing items JSON:', e, 'Raw data:', items)
      return []
    }
  }
  return []
}

// Aksi tombol "Mark As Paid"
function markAsPaid(item) {
  if (item.status === 'paid') return
  router.push(`/payment/${item.id}`)
}

// Aksi tombol "View Detail"
function viewDetail(id) {
  router.push(`/payment/${id}`)
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
