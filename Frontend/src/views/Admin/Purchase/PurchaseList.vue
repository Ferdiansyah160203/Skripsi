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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.8 9H19M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6"
                />
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Pembelian Stock</h1>
              <p class="text-sm text-gray-600">Kelola pembelian stock dan inventori</p>
            </div>
          </div>
          <div class="flex gap-2">
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
            <router-link
              to="/purchases/create"
              class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Tambah Pembelian
            </router-link>
          </div>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Pembelian</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.totalPurchases }}</p>
            </div>
            <div class="w-12 h-12 bg-[#DB3A40] rounded-lg flex items-center justify-center">
              <ShoppingCart class="text-white" />
            </div>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Nilai Pembelian</p>
              <p class="text-2xl font-bold text-gray-900">
                Rp {{ formatCurrency(stats.totalAmount) }}
              </p>
            </div>
            <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
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
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Belum Lunas</p>
              <p class="text-2xl font-bold text-gray-900">
                Rp {{ formatCurrency(stats.pendingAmount) }}
              </p>
            </div>
            <div class="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Filter Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Filter & Pencarian</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Cari Supplier</label>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Cari nama supplier..."
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
              <Search class="w-4 h-4" />
              Filter
            </button>
            <button
              @click="resetFilter"
              class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <RotateCcw class="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>
      </div>

      <!-- Data Table -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Data Pembelian</h3>
          <p class="text-sm text-gray-600">
            Menampilkan {{ paginatedPurchases.length }} dari
            {{ filteredPurchases.length }} pembelian
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
                  Tanggal
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Supplier
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  No. Invoice
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Items
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Metode
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
                v-for="(item, index) in paginatedPurchases"
                :key="item.id"
                class="hover:bg-gray-50 transition-colors duration-200"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDateTime(item.purchase_date) }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  <div>
                    <span class="font-medium">{{ item.supplier_name }}</span>
                    <div v-if="item.supplier_contact" class="text-xs text-gray-500">
                      {{ item.supplier_contact }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ item.invoice_number || '-' }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  <div v-for="i in item.items.slice(0, 2)" :key="i.id" class="mb-1">
                    <span class="block font-medium">{{ i.item_name }}</span>
                    <span class="text-xs text-gray-500">{{ i.quantity }} {{ i.unit }}</span>
                  </div>
                  <span v-if="item.items.length > 2" class="text-gray-400 text-xs italic">
                    +{{ item.items.length - 2 }} item lainnya
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Rp{{ formatCurrency(item.total_amount) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      item.payment_status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : item.payment_status === 'partial'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800',
                    ]"
                  >
                    {{ getStatusText(item.payment_status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-600 capitalize">
                  {{ item.payment_method }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div class="flex items-center justify-center space-x-2">
                    <button
                      @click="viewDetail(item)"
                      title="Lihat Detail"
                      class="text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-1 rounded transition-colors duration-200"
                    >
                      <Eye class="w-4 h-4" />
                    </button>
                    <router-link
                      :to="`/purchases/edit/${item.id}`"
                      title="Edit"
                      class="text-green-600 hover:text-green-800 hover:bg-green-100 p-1 rounded transition-colors duration-200"
                    >
                      <Edit class="w-4 h-4" />
                    </router-link>
                    <button
                      @click="deletePurchase(item.id)"
                      title="Hapus"
                      class="text-red-600 hover:text-red-800 hover:bg-red-100 p-1 rounded transition-colors duration-200"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredPurchases.length === 0">
                <td colspan="9" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center justify-center">
                    <ShoppingCart class="w-12 h-12 text-gray-400 mb-4" />
                    <h3 class="text-lg font-medium text-gray-900 mb-1">Tidak ada data pembelian</h3>
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
              >Menampilkan {{ paginatedPurchases.length }} dari
              {{ filteredPurchases.length }} pembelian</span
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
              <ChevronLeft class="w-4 h-4 mr-1" />
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
              <ChevronRight class="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <PurchaseDetailModal
      :show="showDetailModal"
      :purchase="selectedPurchase"
      @close="showDetailModal = false"
    />
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import api from '/utils/axios'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import {
  ShoppingCart,
  Search,
  RotateCcw,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-vue-next'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import Swal from 'sweetalert2'
import PurchaseDetailModal from '@/components/PurchaseDetailModal.vue'

// State
const purchases = ref([])
const stats = ref({
  totalPurchases: 0,
  totalAmount: 0,
  pendingAmount: 0,
})
const filterStart = ref('')
const filterEnd = ref('')
const searchQuery = ref('')
const filteredPurchases = ref([])
const currentPage = ref(1)
const itemsPerPage = 10
const showDetailModal = ref(false)
const selectedPurchase = ref(null)

// Computed properties
const totalPages = computed(() => {
  return Math.ceil(filteredPurchases.value.length / itemsPerPage)
})

const paginatedPurchases = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredPurchases.value.slice(start, end)
})

// Lifecycle
onMounted(() => {
  fetchPurchases()
  fetchStats()
})

// Methods
async function fetchPurchases() {
  try {
    const { data } = await api.get('/api/purchases/')
    purchases.value = data
    applyFilter()
  } catch (err) {
    console.error('Error fetching purchases:', err)
    Swal.fire('Error', 'Gagal memuat data pembelian.', 'error')
  }
}

async function fetchStats() {
  try {
    const { data } = await api.get('/api/purchases/stats')
    stats.value = data
  } catch (err) {
    console.error('Error fetching stats:', err)
  }
}

function applyFilter() {
  filteredPurchases.value = purchases.value.filter((item) => {
    const date = new Date(item.purchase_date)
    const start = filterStart.value ? new Date(filterStart.value) : null
    const end = filterEnd.value ? new Date(filterEnd.value + 'T23:59:59.999') : null

    const matchDate = (!start || date >= start) && (!end || date <= end)

    const query = searchQuery.value.toLowerCase()
    const matchSearch =
      !query ||
      item.supplier_name.toLowerCase().includes(query) ||
      (item.supplier_contact && item.supplier_contact.toLowerCase().includes(query)) ||
      (item.invoice_number && item.invoice_number.toLowerCase().includes(query))

    return matchDate && matchSearch
  })
  currentPage.value = 1
}

function resetFilter() {
  filterStart.value = ''
  filterEnd.value = ''
  searchQuery.value = ''
  applyFilter()
}

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

function viewDetail(purchase) {
  selectedPurchase.value = purchase
  showDetailModal.value = true
}

async function deletePurchase(id) {
  const result = await Swal.fire({
    title: 'Konfirmasi Hapus',
    text: 'Yakin ingin menghapus pembelian ini? Stok akan dikurangi sesuai dengan pembelian.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Ya, Hapus!',
    cancelButtonText: 'Batal',
  })

  if (result.isConfirmed) {
    try {
      await api.delete(`/api/purchases/${id}`)
      await fetchPurchases()
      await fetchStats()
      Swal.fire('Berhasil!', 'Pembelian berhasil dihapus.', 'success')
    } catch (err) {
      console.error('Error deleting purchase:', err)
      Swal.fire('Error', 'Gagal menghapus pembelian.', 'error')
    }
  }
}

function getStatusText(status) {
  switch (status) {
    case 'paid':
      return 'Lunas'
    case 'partial':
      return 'Sebagian'
    case 'pending':
      return 'Belum Lunas'
    default:
      return status
  }
}

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
  }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}

const formatDate = (dateString) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}

function exportToPDF() {
  const doc = new jsPDF()

  doc.setFontSize(16)
  doc.setTextColor(40)
  doc.text('Laporan Pembelian Stock', 14, 15)

  let dateRange = ''
  if (filterStart.value && filterEnd.value) {
    dateRange = `Periode: ${formatDate(filterStart.value)} - ${formatDate(filterEnd.value)}`
  } else if (filterStart.value) {
    dateRange = `Mulai dari: ${formatDate(filterStart.value)}`
  } else if (filterEnd.value) {
    dateRange = `Sampai: ${formatDate(filterEnd.value)}`
  } else {
    dateRange = 'Periode: Semua data'
  }

  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text(dateRange, 14, 25)
  doc.text(`Dicetak pada: ${formatDateTime(new Date())}`, 14, 32)

  const rows = filteredPurchases.value.map((purchase, index) => {
    const itemNames = purchase.items
      .map((i) => `${i.item_name} (${i.quantity} ${i.unit})`)
      .join(', ')
    const displayItems = itemNames.length > 50 ? itemNames.substring(0, 47) + '...' : itemNames

    return [
      index + 1,
      formatDateTime(purchase.purchase_date),
      purchase.supplier_name,
      purchase.invoice_number || '-',
      displayItems,
      `Rp${formatCurrency(purchase.total_amount)}`,
      getStatusText(purchase.payment_status),
      purchase.payment_method,
    ]
  })

  autoTable(doc, {
    startY: 40,
    head: [['No', 'Tanggal', 'Supplier', 'No. Invoice', 'Items', 'Total', 'Status', 'Metode']],
    body: rows,
    styles: { fontSize: 8, cellPadding: 2, overflow: 'linebreak' },
    headStyles: { fillColor: [46, 125, 50], fontStyle: 'bold' },
    theme: 'grid',
  })

  doc.setFontSize(12)
  doc.setTextColor(40)
  doc.text(`Total Pembelian: ${stats.value.totalPurchases}`, 14, doc.lastAutoTable.finalY + 10)
  doc.text(
    `Total Nilai: Rp${formatCurrency(stats.value.totalAmount)}`,
    14,
    doc.lastAutoTable.finalY + 20,
  )

  const filename = `laporan-pembelian-${new Date().toISOString().slice(0, 10)}.pdf`
  doc.save(filename)
}

// Watchers
watch(searchQuery, () => {
  applyFilter()
})

watch([filterStart, filterEnd], () => {
  applyFilter()
})
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
