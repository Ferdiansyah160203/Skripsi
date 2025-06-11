<template>
  <DefaultLayout>
    <div
      class="p-6 bg-gradient-to-br from-green-50 to-white min-h-screen rounded-xl shadow-lg mb-8"
    >
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-4xl font-extrabold text-indigo-800 flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-10 w-10 text-green-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3 1h10v8H5V6zm1-1h8a1 1 0 010 2H6a1 1 0 010-2z"
              clip-rule="evenodd"
            />
          </svg>
          Riwayat Transaksi Penjualan
        </h1>
        <button
          @click="exportToPDF"
          class="flex items-center gap-2 px-6 py-3 text-lg font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-lg transition duration-300 transform hover:scale-105"
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

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
                d="M.8 9A.8.8 0 010 8.2V2.5A2.5 2.5 0 012.5 0h15A2.5 2.5 0 0120 2.5v5.7a.8.8 0 01-1.6 0V2.5a.9.9 0 00-.9-.9H2.5a.9.9 0 00-.9.9v5.7a.8.8 0 01-.8.8zM4 11a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm0 3a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600">Total Transaksi</p>
            <p class="text-3xl font-bold text-indigo-800">{{ totalTransactions }}</p>
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
            <p class="text-sm text-gray-600">Total Penjualan (Lunas)</p>
            <p class="text-3xl font-bold text-green-800">Rp {{ formatCurrency(totalSales) }}</p>
          </div>
        </div>
      </div>

      <div
        class="grid grid-cols-1 md:grid-cols-5 gap-4 bg-white p-6 rounded-xl shadow mb-8 border border-gray-200"
      >
        <div class="md:col-span-2">
          <label class="text-sm text-gray-600 font-medium mb-1 block">Cari Transaksi</label>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Cari ID transaksi, member, atau item..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
          />
        </div>
        <div>
          <label class="text-sm text-gray-600 font-medium mb-1 block">Tanggal Mulai</label>
          <input
            type="date"
            v-model="filterStart"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
          />
        </div>
        <div>
          <label class="text-sm text-gray-600 font-medium mb-1 block">Tanggal Akhir</label>
          <input
            type="date"
            v-model="filterEnd"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
          />
        </div>
        <div class="flex items-end gap-2">
          <button
            @click="applyFilter"
            class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center justify-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
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
            class="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition duration-200 flex items-center justify-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M4 2a1 1 0 011 1v2.128a8.053 8.053 0 00-.977 1.63L3.774 7.3A.5.5 0 013 7.007V5a1 1 0 011-1zm14 0a1 1 0 011 1v2.128a8.053 8.053 0 01-.977 1.63L16.226 7.3A.5.5 0 0017 7.007V5a1 1 0 00-1-1h-3a1 1 0 100 2h1.595a6.002 6.002 0 00-11.168 0H6a1 1 0 100-2H4a1 1 0 011-1zm3 10a1 1 0 01-1 1H4a1 1 0 01-1-1v-2.128a8.053 8.053 0 00.977-1.63L3.774 12.7A.5.5 0 014 12.993V15a1 1 0 01-1 1h3a1 1 0 100-2H4.405a6.002 6.002 0 0011.168 0H14a1 1 0 100 2h2a1 1 0 011 1zm-3-10a1 1 0 011 1v2.128a8.053 8.053 0 01-.977 1.63L16.226 7.3A.5.5 0 0017 7.007V5a1 1 0 00-1-1h-3a1 1 0 100 2h1.595a6.002 6.002 0 0011.168 0H6a1 1 0 100-2H4a1 1 0 011-1z"
                clip-rule="evenodd"
              />
            </svg>
            Reset
          </button>
        </div>
      </div>

      <div class="overflow-x-auto bg-white shadow-xl rounded-xl border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-green-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider"
              >
                No
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider"
              >
                ID Transaksi
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider"
              >
                Tanggal
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider"
              >
                Item
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider"
              >
                Qty Jual
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider"
              >
                Total
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider"
              >
                Bayar
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider"
              >
                Kembali
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider"
              >
                Metode
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="(item, index) in paginatedTransactions"
              :key="item.id"
              class="hover:bg-green-50 transition duration-150"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                {{ (currentPage - 1) * itemsPerPage + index + 1 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                {{ formatTransactionId(item.id) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {{ formatDateTime(item.createdAt) }}
              </td>

              <td class="px-6 py-4 text-sm text-gray-700">
                <span
                  v-for="i in parseItems(item.items).slice(0, 2)"
                  :key="i.product_id"
                  class="block"
                >
                  {{ i.name }}
                </span>
                <span v-if="parseItems(item.items).length > 2" class="text-gray-500 text-xs italic">
                  +{{ parseItems(item.items).length - 2 }} item lainnya
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {{ item.quantity_sold }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                Rp{{ formatCurrency(item.final_price) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                Rp{{ formatCurrency(item.cash_paid || 0) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                Rp{{ formatCurrency(item.change || 0) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm capitalize text-indigo-600">
                {{ item.payment_method }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold',
                    item.status === 'paid'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700',
                  ]"
                >
                  {{ item.status === 'paid' ? 'Lunas' : 'Belum Lunas' }}
                </span>
              </td>
            </tr>
            <tr v-if="filteredTransactions.length === 0">
              <td colspan="10" class="text-center py-10 text-gray-500 text-lg">
                <p class="mb-2">Tidak ada data transaksi yang ditemukan.</p>
                <p class="text-sm">Coba sesuaikan filter atau pencarian Anda.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex flex-col items-center mt-6">
        <div class="text-sm text-gray-600 mb-3">
          Menampilkan {{ paginatedTransactions.length }} dari
          {{ filteredTransactions.length }} transaksi
        </div>
        <div class="flex space-x-3">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-4 py-2 rounded-lg border text-sm font-medium transition duration-200"
            :class="
              currentPage === 1
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-white hover:bg-green-100 text-green-700 border-green-300 shadow-sm'
            "
          >
            Sebelumnya
          </button>
          <span class="text-md font-semibold flex items-center justify-center text-green-800">
            Halaman {{ currentPage }} dari {{ totalPages }}
          </span>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 rounded-lg border text-sm font-medium transition duration-200"
            :class="
              currentPage === totalPages
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-white hover:bg-green-100 text-green-700 border-green-300 shadow-sm'
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
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import api from '/utils/axios' // Sesuaikan path ini
import DefaultLayout from '@/layouts/DefaultLayout.vue' // Sesuaikan path ini
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

// Aksi tombol "View Detail"
// Admin hanya melihat detail, tidak ada markAsPaid
function viewDetail(id) {
  router.push(`/payment/${id}`) // Mengarahkan ke halaman pembayaran detail
}

// Aksi tombol "Delete Transaction"
async function deleteTransaction(id) {
  const result = await Swal.fire({
    title: 'Hapus Transaksi?',
    html: 'Anda yakin ingin menghapus transaksi ini?<br><strong class="text-red-600">Aksi ini tidak dapat dibatalkan!</strong>',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33', // Merah untuk delete
    cancelButtonColor: '#6c757d', // Abu-abu untuk batal
    confirmButtonText: 'Ya, Hapus!',
    cancelButtonText: 'Batal',
  })

  if (result.isConfirmed) {
    try {
      await api.delete(`/api/transactions/${id}`)
      transactions.value = transactions.value.filter((item) => item.id !== id)
      applyFilter()
      Swal.fire('Berhasil!', 'Transaksi berhasil dihapus.', 'success')
      if (currentPage.value > totalPages.value && totalPages.value > 0) {
        currentPage.value = totalPages.value
      } else if (totalPages.value === 0) {
        currentPage.value = 1
      }
    } catch (err) {
      console.error('Gagal menghapus transaksi:', err)
      Swal.fire('Gagal', 'Gagal menghapus transaksi. Silakan coba lagi.', 'error')
    }
  }
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
