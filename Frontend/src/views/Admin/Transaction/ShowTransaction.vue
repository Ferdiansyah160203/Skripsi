<template>
  <DefaultLayout>
    <div class="p-4 bg-gradient-to-b from-green-50 to-white h-full rounded-lg shadow-md mb-4">
      <!-- HEADER + EXPORT BUTTON -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-green-700">🧾 Riwayat Transaksi</h1>
        <button
          @click="exportToPDF"
          class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
        >
          Export PDF
        </button>
      </div>

      <!-- FILTERS -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-lg shadow mb-4">
        <div>
          <label class="text-sm text-gray-600">Tanggal Mulai</label>
          <input
            type="date"
            v-model="filterStart"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-green-300"
          />
        </div>
        <div>
          <label class="text-sm text-gray-600">Tanggal Akhir</label>
          <input
            type="date"
            v-model="filterEnd"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-green-300"
          />
        </div>
        <div>
          <label class="text-sm text-gray-600">Status</label>
          <select
            v-model="filterStatus"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-green-300"
          >
            <option value="">Semua</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="applyFilter"
            class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            Filter
          </button>
        </div>
      </div>

      <!-- TABEL -->
      <div class="overflow-x-auto bg-white shadow-xl rounded-xl">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-green-100">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-bold text-green-700 uppercase">No</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-green-700 uppercase">
                Tanggal
              </th>
              <th class="px-6 py-3 text-left text-xs font-bold text-green-700 uppercase">Item</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-green-700 uppercase">Total</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-green-700 uppercase">Bayar</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-green-700 uppercase">
                Kembali
              </th>
              <th class="px-6 py-3 text-left text-xs font-bold text-green-700 uppercase">Metode</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-green-700 uppercase">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="(item, index) in paginatedTransactions"
              :key="item.id"
              class="hover:bg-green-50"
            >
              <td class="px-6 py-4">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td class="px-6 py-4">{{ formatDate(item.createdAt) }}</td>

              <td class="px-6 py-4">
                <ul class="list-disc ml-4 text-sm text-gray-700">
                  <li v-for="i in JSON.parse(item.items)" :key="i.product_id">
                    {{ i.name }} x {{ i.qty }} = Rp{{ formatNumber(i.subtotal) }}
                  </li>
                </ul>
              </td>
              <td class="px-6 py-4">Rp{{ formatNumber(item.final_price) }}</td>
              <td class="px-6 py-4">Rp{{ formatNumber(item.cash_paid) }}</td>
              <td class="px-6 py-4">Rp{{ formatNumber(item.change) }}</td>
              <td class="px-6 py-4 capitalize">{{ item.payment_method }}</td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'px-2 py-1 rounded-full text-xs font-semibold',
                    item.status === 'paid'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700',
                  ]"
                >
                  {{ item.status }}
                </span>
              </td>
            </tr>
            <tr v-if="filteredTransactions.length === 0">
              <td colspan="8" class="text-center py-6 text-gray-500">Tidak ada data transaksi.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- TOTAL SALES -->
      <div class="mt-4 text-right text-lg font-bold text-green-800">
        Total Penjualan: Rp{{ formatNumber(totalSales) }}
      </div>
      <!-- PAGINATION -->
      <div class="flex flex-col items-center mt-4 pb-10">
        <div class="text-sm text-gray-600 mb-2">
          Menampilkan {{ paginatedTransactions.length }} dari
          {{ filteredTransactions.length }} transaksi
        </div>
        <div class="flex space-x-2">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-3 py-1 rounded-md border text-sm"
            :class="
              currentPage === 1
                ? 'bg-gray-200 text-gray-500'
                : 'bg-white hover:bg-green-100 text-green-700 border-green-300'
            "
          >
            Prev
          </button>
          <span class="text-sm font-semibold flex items-center justify-center">
            Halaman {{ currentPage }} dari {{ totalPages }}
          </span>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 rounded-md border text-sm"
            :class="
              currentPage === totalPages
                ? 'bg-gray-200 text-gray-500'
                : 'bg-white hover:bg-green-100 text-green-700 border-green-300'
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
import { ref, onMounted, computed } from 'vue'
import api from '/utils/axios'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// State
const transactions = ref([])
const filterStart = ref('')
const filterEnd = ref('')
const filterStatus = ref('')
const filteredTransactions = ref([])
const currentPage = ref(1)
const itemsPerPage = 10

// Ambil data saat mount
onMounted(() => {
  fetchTransactions()
})

const totalPages = computed(() => {
  return Math.ceil(filteredTransactions.value.length / itemsPerPage)
})

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredTransactions.value.slice(start, end)
})

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
    filteredTransactions.value = data
  } catch (err) {
    console.error('Gagal mengambil data transaksi:', err)
  }
}

// Filter transaksi berdasarkan tanggal & status
// Reset ke halaman 1 setiap kali filter diubah
function applyFilter() {
  filteredTransactions.value = transactions.value.filter((item) => {
    const date = new Date(item.createdAt)
    const start = filterStart.value ? new Date(filterStart.value) : null
    const end = filterEnd.value ? new Date(filterEnd.value + 'T23:59:59') : null
    const matchDate = (!start || date >= start) && (!end || date <= end)
    const matchStatus = !filterStatus.value || item.status === filterStatus.value
    return matchDate && matchStatus
  })
  currentPage.value = 1
}

// Hitung total hanya dari transaksi paid
const totalSales = computed(() => {
  return filteredTransactions.value
    .filter((t) => t.status === 'paid')
    .reduce((sum, t) => sum + Number(t.final_price), 0)
})

// Format angka & tanggal
function formatNumber(num) {
  return Number(num).toLocaleString('id-ID')
}

function formatDate(dateString) {
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
    const items = JSON.parse(t.items)
      .map((i) => `${i.name} x${i.qty}`)
      .join(', ')
    return [
      index + 1,
      formatDate(t.createdAt),
      items,
      `Rp${formatNumber(t.final_price)}`,
      `Rp${formatNumber(t.cash_paid)}`,
      `Rp${formatNumber(t.change)}`,
      t.payment_method,
      t.status,
    ]
  })

  autoTable(doc, {
    startY: 25,
    head: [['No', 'Tanggal', 'Item', 'Total', 'Bayar', 'Kembali', 'Metode', 'Status']],
    body: rows,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [46, 125, 50] }, // warna hijau
    theme: 'grid',
  })

  const total = totalSales.value.toLocaleString('id-ID')
  doc.setFontSize(12)
  doc.text(`Total Penjualan: Rp${total}`, 14, doc.lastAutoTable.finalY + 10)

  const filename = `laporan-transaksi-${new Date().toISOString().slice(0, 10)}.pdf`
  doc.save(filename)
}
</script>
