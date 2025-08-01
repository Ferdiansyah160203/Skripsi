<template>
  <DefaultLayout>
    <div class="p-6 bg-gray-50 min-h-screen">
      <!-- Search and Actions -->
      <div class="mb-6">
        <!-- Mobile Layout -->
        <div class="flex flex-col gap-4 md:hidden">
          <!-- Search Bar -->
          <div class="w-full">
            <div class="relative">
              <svg
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Cari inventaris..."
                class="pl-10 pr-4 py-2 w-full bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          <!-- Filters and Add Button -->
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <!-- Filters Container -->
            <div class="flex flex-col xs:flex-row gap-3 sm:gap-4 flex-1">
              <select
                v-model="selectedUnit"
                class="px-4 py-2 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              >
                <option value="">Semua Satuan</option>
                <option v-for="unit in availableUnits" :key="unit" :value="unit">{{ unit }}</option>
              </select>
              <select
                v-model="selectedStatus"
                class="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              >
                <option value="">Semua Status</option>
                <option value="Tersedia">Tersedia</option>
                <option value="Habis">Habis</option>
                <option value="Kadaluarsa">Kadaluarsa</option>
                <option value="Akan Kadaluarsa">Akan Kadaluarsa (≤7 hari)</option>
              </select>
            </div>

            <!-- Add Button -->
            <button
              @click="openModal()"
              class="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 whitespace-nowrap shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
            >
              <PlusIcon class="w-4 h-4 sm:w-5 sm:h-5" />
              <span class="text-sm sm:text-base">Tambah Stok</span>
            </button>
          </div>
        </div>

        <!-- Desktop Layout -->
        <div class="hidden md:flex md:justify-between md:items-center">
          <!-- Search Bar -->
          <div class="relative flex-1 max-w-md">
            <svg
              class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Cari inventaris..."
              class="pl-10 pr-4 py-2 w-full bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <!-- Filters and Add Button -->
          <div class="flex items-center gap-7 ml-6">
            <!-- Filters -->
            <select
              v-model="selectedUnit"
              class="px-5 py-2 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm min-w-[140px]"
            >
              <option value="">Semua Satuan</option>
              <option v-for="unit in availableUnits" :key="unit" :value="unit">{{ unit }}</option>
            </select>
            <select
              v-model="selectedStatus"
              class="px-5 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm min-w-[160px]"
            >
              <option value="">Status Ketersediaan</option>
              <option value="Tersedia">Tersedia</option>
              <option value="Habis">Habis</option>
              <option value="Kadaluarsa">Kadaluarsa</option>
              <option value="Akan Kadaluarsa">Akan Kadaluarsa (≤7 hari)</option>
            </select>

            <!-- Add Button -->
            <button
              @click="openModal()"
              class="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-150 whitespace-nowrap"
            >
              <PlusIcon class="w-5 h-5" />
              Tambah Stok
            </button>
          </div>
        </div>
      </div>
      <!-- Header Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div class="bg-red-500 text-white p-4 rounded-lg shadow-md flex items-center">
          <div class="p-2 sm:p-3 bg-white rounded-md mr-3 sm:mr-4">
            <Box class="text-red-600 w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <p class="text-xs sm:text-sm font-medium">Total Item Unik</p>
            <p class="text-2xl sm:text-3xl font-bold">{{ totalUniqueItems }}</p>
          </div>
        </div>
        <div class="bg-red-500 text-white p-4 rounded-lg shadow-md flex items-center">
          <div class="p-2 sm:p-3 bg-white rounded-md mr-3 sm:mr-4">
            <Boxes class="text-red-600 w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <p class="text-xs sm:text-sm font-medium">Total Stok</p>
            <p class="text-2xl sm:text-3xl font-bold">{{ formatNumber(totalStock) }}</p>
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-4 sm:p-6 border-b">
          <h2 class="text-lg sm:text-xl font-bold text-gray-800">Daftar Stok</h2>
        </div>

        <!-- Desktop Table View -->
        <div class="hidden md:block overflow-x-auto">
          <!-- Loading State -->
          <div v-if="loading" class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>

          <!-- Table -->
          <table v-else class="min-w-full divide-y divide-gray-200">
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
                  Nama Inventaris
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Satuan
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Jumlah Stok
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Masa Kadaluarsa
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status Ketersediaan
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="(item, index) in paginatedInventories"
                :key="item.id"
                class="hover:bg-gray-50 transition-colors duration-150"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {{ item.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {{ item.unit }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {{ formatNumber(item.stock) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <div v-if="item.expiry_date">
                    <div class="font-medium" :class="getExpiryTextClass(item.expiry_date)">
                      {{ formatDate(item.expiry_date) }}
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ getExpiryDescription(item.expiry_date) }}
                    </div>
                  </div>
                  <span v-else class="text-gray-400 italic">Tidak ada</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex px-3 py-1 text-xs font-semibold rounded-full"
                    :class="getStatusClass(item.stock, item.expiry_date)"
                  >
                    {{ getStatusText(item.stock, item.expiry_date) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div class="flex space-x-3">
                    <button
                      @click="openModal(item.id)"
                      class="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors duration-150"
                      title="Edit Inventaris"
                    >
                      <PencilSquareIcon class="w-4 h-4" />
                    </button>
                    <button
                      @click="deleteItem(item.id)"
                      class="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors duration-150"
                      title="Hapus Inventaris"
                    >
                      <TrashIcon class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredInventories.length === 0">
                <td colspan="7" class="px-6 py-12 text-center text-gray-500">
                  <div class="flex flex-col items-center">
                    <svg
                      class="w-16 h-16 text-gray-300 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1"
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      ></path>
                    </svg>
                    <p class="text-lg font-medium mb-2">Tidak ada data inventaris</p>
                    <p class="text-sm text-gray-400 mb-4">
                      {{
                        searchQuery || selectedUnit || selectedStatus
                          ? 'Tidak ada inventaris yang sesuai dengan filter.'
                          : 'Belum ada inventaris yang ditambahkan.'
                      }}
                    </p>
                    <button
                      v-if="!searchQuery && !selectedUnit && !selectedStatus"
                      @click="openModal()"
                      class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-150"
                    >
                      Tambah Inventaris Pertama
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Card View -->
        <div class="md:hidden">
          <!-- Loading State -->
          <div v-if="loading" class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredInventories.length === 0" class="p-6 text-center text-gray-500">
            <div class="flex flex-col items-center">
              <svg
                class="w-16 h-16 text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                ></path>
              </svg>
              <p class="text-lg font-medium mb-2">Tidak ada data inventaris</p>
              <p class="text-sm text-gray-400 mb-4">
                {{
                  searchQuery || selectedUnit || selectedStatus
                    ? 'Tidak ada inventaris yang sesuai dengan filter.'
                    : 'Belum ada inventaris yang ditambahkan.'
                }}
              </p>
              <button
                v-if="!searchQuery && !selectedUnit && !selectedStatus"
                @click="openModal()"
                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-150"
              >
                Tambah Inventaris Pertama
              </button>
            </div>
          </div>

          <!-- Cards -->
          <div v-else class="divide-y divide-gray-200">
            <div
              v-for="(item, index) in paginatedInventories"
              :key="item.id"
              class="p-4 hover:bg-gray-50 transition-colors duration-150"
            >
              <!-- Header dengan nama dan actions -->
              <div class="flex justify-between items-start mb-3">
                <div class="flex-1 min-w-0">
                  <h3 class="text-base font-semibold text-gray-900 truncate">{{ item.name }}</h3>
                  <div class="text-xs text-gray-500 mt-1">
                    Item #{{ (currentPage - 1) * itemsPerPage + index + 1 }}
                  </div>
                </div>
                <div class="flex space-x-3 ml-3">
                  <button
                    @click="openModal(item.id)"
                    class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors duration-150"
                    title="Edit"
                  >
                    <PencilSquareIcon class="w-4 h-4" />
                  </button>
                  <button
                    @click="deleteItem(item.id)"
                    class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors duration-150"
                    title="Hapus"
                  >
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <!-- Info grid -->
              <div class="grid grid-cols-2 gap-4 text-sm mb-3">
                <div class="bg-gray-50 rounded-lg p-3">
                  <div class="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                    Unit
                  </div>
                  <div class="font-semibold text-gray-900">{{ item.unit }}</div>
                </div>
                <div class="bg-gray-50 rounded-lg p-3">
                  <div class="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                    Stok
                  </div>
                  <div class="font-semibold text-gray-900">{{ formatNumber(item.stock) }}</div>
                </div>
              </div>

              <!-- Expiry Date -->
              <div v-if="item.expiry_date" class="bg-gray-50 rounded-lg p-3 mb-3">
                <div class="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                  Masa Kadaluarsa
                </div>
                <div class="font-medium" :class="getExpiryTextClass(item.expiry_date)">
                  {{ formatDate(item.expiry_date) }}
                </div>
                <div class="text-xs text-gray-500 mt-1">
                  {{ getExpiryDescription(item.expiry_date) }}
                </div>
              </div>

              <!-- Status -->
              <div class="flex justify-between items-center">
                <div class="text-xs text-gray-500 uppercase tracking-wide font-medium">Status</div>
                <span
                  class="inline-flex px-3 py-1 text-xs font-semibold rounded-full"
                  :class="getStatusClass(item.stock, item.expiry_date)"
                >
                  {{ getStatusText(item.stock, item.expiry_date) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
          <!-- Mobile Pagination -->
          <div class="flex justify-between items-center w-full sm:hidden">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
              Prev
            </button>
            <div class="flex items-center space-x-1">
              <span class="text-sm text-gray-700 font-medium">Hal.</span>
              <span class="text-sm text-gray-900 font-bold">{{ currentPage }}</span>
              <span class="text-sm text-gray-500">dari</span>
              <span class="text-sm text-gray-900 font-bold">{{ totalPages }}</span>
            </div>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
            >
              Next
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </button>
          </div>

          <!-- Desktop Pagination -->
          <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Menampilkan
                <span class="font-medium text-gray-900">{{
                  (currentPage - 1) * itemsPerPage + 1
                }}</span>
                sampai
                <span class="font-medium text-gray-900">{{
                  Math.min(currentPage * itemsPerPage, filteredInventories.length)
                }}</span>
                dari
                <span class="font-medium text-gray-900">{{ filteredInventories.length }}</span>
                total inventaris
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px">
                <button
                  @click="prevPage"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-3 py-2 rounded-l-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                >
                  <span class="sr-only">Previous</span>
                  <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>

                <template v-for="page in visiblePages" :key="page">
                  <button
                    v-if="page !== '...'"
                    @click="currentPage = page"
                    class="relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors duration-150"
                    :class="
                      page === currentPage
                        ? 'z-10 bg-red-50 border-red-500 text-red-600 font-semibold'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    "
                  >
                    {{ page }}
                  </button>
                  <span
                    v-else
                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                  >
                    ...
                  </span>
                </template>

                <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-3 py-2 rounded-r-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                >
                  <span class="sr-only">Next</span>
                  <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <InventoryModal
      :show="modalOpen"
      :editId="editId"
      @close="modalOpen = false"
      @saved="refreshData"
    />
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue' // Sesuaikan path ini
import InventoryModal from '@/views/Admin/Inventories/InventoriesModal.vue' // Sesuaikan path ini
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/solid'
import { Box, Boxes } from 'lucide-vue-next'
import Swal from 'sweetalert2'
import api from '/utils/axios' // Sesuaikan path ini

const inventories = ref([]) // Mengubah nama state dari 'inventory' menjadi 'inventories' untuk konsistensi
const loading = ref(false) // State untuk loading
const modalOpen = ref(false)
const editId = ref(null)
const searchQuery = ref('') // State untuk pencarian
const selectedUnit = ref('') // State untuk filter unit
const selectedStatus = ref('') // State untuk filter status
const currentPage = ref(1) // State untuk pagination
const itemsPerPage = 10 // Jumlah item per halaman

// Computed properties untuk ringkasan statistik
const totalUniqueItems = computed(() => inventories.value.length)
const totalStock = computed(() =>
  inventories.value.reduce((sum, item) => sum + parseFloat(item.stock || 0), 0),
)

// Computed property untuk mendapatkan unit yang tersedia dari data
const availableUnits = computed(() => {
  const units = [...new Set(inventories.value.map((item) => item.unit))].filter(Boolean)
  return units.sort() // Mengurutkan unit secara alfabetis
})

// Filtered inventories berdasarkan search query, unit, dan status
const filteredInventories = computed(() => {
  let filtered = inventories.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (item) => item.name.toLowerCase().includes(query) || item.unit.toLowerCase().includes(query),
    )
  }

  // Filter by unit
  if (selectedUnit.value) {
    filtered = filtered.filter((item) => item.unit === selectedUnit.value)
  }

  // Filter by status
  if (selectedStatus.value) {
    filtered = filtered.filter((item) => {
      const status = getStatusText(item.stock, item.expiry_date)
      return status === selectedStatus.value
    })
  }

  return filtered
})

// Computed properties untuk pagination
const totalPages = computed(() => {
  return Math.ceil(filteredInventories.value.length / itemsPerPage)
})

const paginatedInventories = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredInventories.value.slice(start, end)
})

// Computed untuk visible pages di pagination
const visiblePages = computed(() => {
  const delta = 2
  const range = []
  const rangeWithDots = []

  for (
    let i = Math.max(2, currentPage.value - delta);
    i <= Math.min(totalPages.value - 1, currentPage.value + delta);
    i++
  ) {
    range.push(i)
  }

  if (currentPage.value - delta > 2) {
    rangeWithDots.push(1, '...')
  } else {
    rangeWithDots.push(1)
  }

  rangeWithDots.push(...range)

  if (currentPage.value + delta < totalPages.value - 1) {
    rangeWithDots.push('...', totalPages.value)
  } else {
    rangeWithDots.push(totalPages.value)
  }

  return rangeWithDots.filter((v, i, a) => a.indexOf(v) === i)
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

// Watcher untuk mereset halaman saat search query atau filter berubah
watch([searchQuery, selectedUnit, selectedStatus], () => {
  currentPage.value = 1
})

onMounted(() => {
  fetchInventories()
})

function openModal(id = null) {
  editId.value = id
  modalOpen.value = true
}

// Fungsi untuk refresh data setelah save/edit di modal
function refreshData() {
  fetchInventories()
  modalOpen.value = false
  Swal.fire('Berhasil!', `Item berhasil ${editId.value ? 'diperbarui' : 'ditambahkan'}.`, 'success')
  // Setelah save, periksa apakah halaman saat ini masih valid
  if (currentPage.value > totalPages.value) {
    currentPage.value = Math.max(1, totalPages.value)
  }
}

// Fetch data inventories
async function fetchInventories() {
  try {
    loading.value = true
    const { data } = await api.get('/api/inventories')
    inventories.value = data // Menggunakan state 'inventories'
  } catch (err) {
    console.error('Gagal memuat data inventaris:', err)
    Swal.fire('Error', 'Gagal memuat data inventaris.', 'error')
  } finally {
    loading.value = false
  }
}

// Fungsi untuk menghapus inventaris
async function deleteItem(id) {
  const result = await Swal.fire({
    title: 'Hapus Inventaris?',
    html: 'Anda yakin ingin menghapus item inventaris ini?<br><strong class="text-red-600">Aksi ini tidak dapat dibatalkan!</strong>',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33', // Merah untuk delete
    cancelButtonColor: '#6c757d', // Abu-abu untuk batal
    confirmButtonText: 'Ya, Hapus!',
    cancelButtonText: 'Batal',
  })

  if (result.isConfirmed) {
    try {
      await api.delete(`/api/inventories/${id}`)
      inventories.value = inventories.value.filter((item) => item.id !== id) // Update state 'inventories'
      Swal.fire('Berhasil!', 'Inventaris berhasil dihapus.', 'success')
      // Setelah menghapus, periksa apakah halaman saat ini masih valid
      if (currentPage.value > totalPages.value) {
        currentPage.value = Math.max(1, totalPages.value)
      }
    } catch (err) {
      console.error('Gagal menghapus inventaris:', err)
      Swal.fire('Gagal', 'Gagal menghapus inventaris. Silakan coba lagi.', 'error')
    }
  }
}

// Helper untuk format angka biasa (misal stok)
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

// Helper untuk mendapatkan teks status berdasarkan stok dan masa kadaluarsa
const getStatusText = (stock, expiryDate = null) => {
  const stockValue = parseFloat(stock) || 0

  // Cek masa kadaluarsa terlebih dahulu jika ada
  if (expiryDate) {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return 'Kadaluarsa'
    } else if (diffDays <= 7) {
      return 'Akan Kadaluarsa'
    }
  }

  // Jika tidak ada masalah kadaluarsa, cek stok
  if (stockValue > 0) {
    return 'Tersedia'
  } else if (stockValue === 0) {
    return 'Habis'
  } else {
    return 'Minus'
  }
}

// Helper untuk mendapatkan class CSS status
const getStatusClass = (stock, expiryDate = null) => {
  const stockValue = parseFloat(stock) || 0

  // Cek masa kadaluarsa terlebih dahulu jika ada
  if (expiryDate) {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return 'bg-red-100 text-red-800' // Kadaluarsa
    } else if (diffDays <= 7) {
      return 'bg-orange-100 text-orange-800' // Akan kadaluarsa
    }
  }

  // Jika tidak ada masalah kadaluarsa, cek stok
  if (stockValue > 0) {
    return 'bg-green-100 text-green-800'
  } else if (stockValue === 0) {
    return 'bg-yellow-100 text-yellow-800'
  } else {
    return 'bg-red-100 text-red-800'
  }
}

// Helper untuk format tanggal
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

// Helper untuk mendapatkan deskripsi masa kadaluarsa
const getExpiryDescription = (expiryDate) => {
  if (!expiryDate) return ''

  const today = new Date()
  const expiry = new Date(expiryDate)
  const diffTime = expiry - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return `Kadaluarsa ${Math.abs(diffDays)} hari yang lalu`
  } else if (diffDays === 0) {
    return 'Kadaluarsa hari ini'
  } else if (diffDays === 1) {
    return 'Kadaluarsa besok'
  } else if (diffDays <= 7) {
    return `Kadaluarsa dalam ${diffDays} hari`
  } else {
    return `${diffDays} hari lagi`
  }
}

// Helper untuk mendapatkan class CSS text berdasarkan masa kadaluarsa
const getExpiryTextClass = (expiryDate) => {
  if (!expiryDate) return 'text-gray-900'

  const today = new Date()
  const expiry = new Date(expiryDate)
  const diffTime = expiry - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return 'text-red-600' // Kadaluarsa
  } else if (diffDays <= 7) {
    return 'text-orange-600' // Akan kadaluarsa
  } else {
    return 'text-gray-900' // Normal
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
