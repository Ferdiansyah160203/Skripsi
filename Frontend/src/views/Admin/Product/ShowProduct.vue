<template>
  <DefaultLayout>
    <div
      class="p-6 bg-gradient-to-br from-gray-250 to-white min-h-screen rounded-xl shadow-lg mb-8"
    >
      <!-- Search, Sort, Status -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
        <!-- Search -->
        <div class="md:col-span-6">
          <div class="relative w-full">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                />
              </svg>
            </div>
            <input
              v-model="search"
              type="text"
              class="block w-full pl-10 pr-4 py-3 border bg-white border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-sm"
              placeholder="Search for..."
            />
          </div>
        </div>

        <!-- Urutkan Harga -->
        <div class="md:col-span-3">
          <select
            v-model="sortOrder"
            class="block w-full py-3 px-3 border border-gray-300 rounded-sm bg-white text-gray-700 focus:outline-none focus:ring-red-500 focus:border-red-500 text-sm"
          >
            <option value="">Urutkan Harga</option>
            <option value="asc">Harga Terendah</option>
            <option value="desc">Harga Tertinggi</option>
          </select>
        </div>

        <!-- Status Ketersediaan -->
        <div class="md:col-span-3">
          <select
            v-model="availability"
            class="block w-full py-3 px-3 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-red-500 focus:border-red-500 text-sm"
          >
            <option value="">Status Ketersediaan</option>
            <option value="true">Stok Material Cukup</option>
            <option value="false">Stok Material Kurang</option>
          </select>
        </div>
      </div>

      <!-- Filter Kategori + Tombol Tambah -->
      <div class="flex flex-wrap md:flex-nowrap justify-between items-center gap-4 mb-6">
        <!-- Kategori -->
        <div class="flex flex-wrap gap-2">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="selectedCategory = cat"
            :class="
              selectedCategory === cat
                ? 'bg-red-500 text-white shadow border-transparent'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
            "
            class="px-4 py-2 rounded-md text-sm font-medium transition"
          >
            {{ cat }}
          </button>
        </div>

        <!-- Tombol Tambah -->
        <div class="flex gap-3 mt-2 md:mt-0">
          <button
            @click="openCreatePromo"
            class="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white text-base font-semibold rounded-md shadow-md transition"
          >
            <span class="text-xl leading-none">+</span> Tambah Promo
          </button>
          <button
            @click="openCreateModal"
            class="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white text-base font-semibold rounded-md shadow-md transition"
          >
            <span class="text-xl leading-none">+</span> Tambah Produk
          </button>
        </div>
      </div>

      <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8">
        <div
          v-for="product in paginatedProducts"
          :key="product.id"
          class="bg-white rounded-lg shadow-sm p-4 flex flex-col justify-between h-full border border-gray-200 hover:shadow-md transition-shadow duration-200"
        >
          <!-- Product Image -->
          <div
            class="mb-3 h-32 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center"
          >
            <img
              v-if="product.image"
              :src="getImageUrl(product.image)"
              :alt="product.name"
              class="object-cover h-full w-full"
            />
            <span v-else class="text-gray-400 text-sm">Tidak ada Gambar</span>
          </div>

          <!-- Product Category -->
          <div class="mb-2">
            <span class="text-xs text-gray-500 font-medium">{{ product.category || 'Kopi' }}</span>
          </div>

          <!-- Product Name -->
          <h3 class="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">{{ product.name }}</h3>

          <!-- Product Price -->
          <p class="text-red-600 font-bold text-base mb-3">
            Rp. {{ formatCurrency(product.price) }}
          </p>

          <!-- Product Description -->
          <p class="text-xs text-gray-600 mb-3 line-clamp-2">
            {{
              product.description ||
              'Egestas elit dui scelerisque ut eu purus aliquam vitae habitasse.'
            }}
          </p>

          <!-- Promo Badge -->
          <div
            v-if="getPromoForProduct(product)"
            class="flex items-center gap-1 text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full mb-3 self-start"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
            {{ getPromoForProduct(product).point_cost }} Pts
          </div>

          <!-- Status Badge -->
          <div class="mb-3">
            <span
              class="inline-block text-xs px-2 py-1 rounded-full font-medium cursor-help"
              :class="
                product.hasEnoughStock !== false
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              "
              :title="
                product.hasEnoughStock === false
                  ? 'Material kurang: ' +
                    product.materials
                      ?.filter((m) => m.stock < m.needed)
                      .map((m) => `${m.name} (${m.stock}/${m.needed} ${m.unit})`)
                      .join(', ')
                  : 'Semua material tersedia'
              "
            >
              {{ product.hasEnoughStock !== false ? 'Tersedia' : 'Stok Habis' }}
            </span>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-2 mt-auto">
            <button
              @click="editProduct(product)"
              class="flex-1 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-md text-xs font-medium transition duration-200"
            >
              Edit
            </button>
            <button
              v-if="getPromoForProduct(product)"
              @click="editPromo(getPromoForProduct(product))"
              class="flex-1 px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-md text-xs font-medium transition duration-200"
            >
              Promo
            </button>
            <button
              @click="deleteProduct(product.id)"
              class="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-xs font-medium transition duration-200"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
      <div v-if="filteredProducts.length === 0" class="text-center py-10 text-gray-500 text-lg">
        <p class="mb-2">Tidak ada produk yang ditemukan.</p>
        <p class="text-sm">Coba sesuaikan filter atau pencarian Anda.</p>
      </div>

      <div class="flex flex-col items-center mt-6">
        <div class="text-sm text-gray-600 mb-3">
          Menampilkan {{ paginatedProducts.length }} dari {{ filteredProducts.length }} produk
        </div>
        <div class="flex space-x-3">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-4 py-2 rounded-lg border text-sm font-medium transition duration-200"
            :class="
              currentPage === 1
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-white hover:bg-red-100 text-red-700 border-red-300 shadow-sm'
            "
          >
            Sebelumnya
          </button>
          <span class="text-md font-semibold flex items-center justify-center text-red-800">
            Halaman {{ currentPage }} dari {{ totalPages }}
          </span>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 rounded-lg border text-sm font-medium transition duration-200"
            :class="
              currentPage === totalPages
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-white hover:bg-red-100 text-red-700 border-red-300 shadow-sm'
            "
          >
            Berikutnya
          </button>
        </div>
      </div>
    </div>

    <CreateProduct
      :show="showCreateModal || showEditModal"
      :productId="selectedProduct ? selectedProduct.id : null"
      @saved="handleSaved"
      @close="closeModals"
    />
    <CreatePromo
      :show="showCreatePromo || showEditPromo"
      :promoId="selectedPromo ? selectedPromo.id : null"
      @saved="handleSavedPromo"
      @close="closeModals"
    />
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import api from '/utils/axios'
import CreateProduct from '@/views/Admin/Product/ProductModal.vue'
import CreatePromo from '@/views/Admin/Product/PromoModal.vue'
import Swal from 'sweetalert2'

const apiBaseUrl = import.meta.env.VITE_API_URL

const products = ref([])
const promos = ref([])

const showCreateModal = ref(false)
const showCreatePromo = ref(false)
const showEditModal = ref(false)
const showEditPromo = ref(false)

const selectedProduct = ref(null)
const selectedPromo = ref(null)

const search = ref('')
const sortOrder = ref('') // 'asc' atau 'desc'
const availability = ref('') // 'true' atau 'false'
const selectedCategory = ref('Semua')
const categories = ref(['Semua', 'Nasi', 'Camilan', 'Roti', 'Kopi', 'Non Kopi', 'Paket']) // Updated categories with proper capitalization

const currentPage = ref(1)
const itemsPerPage = 8

// --- Computed Properties ---
const filteredProducts = computed(() => {
  let result = [...products.value]

  // Filter based on selected category
  if (selectedCategory.value && selectedCategory.value !== 'Semua') {
    result = result.filter((p) => p.category === selectedCategory.value)
  }

  // Filter berdasarkan search
  if (search.value) {
    const lowerSearch = search.value.toLowerCase()
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerSearch) ||
        (p.description && p.description.toLowerCase().includes(lowerSearch)),
    )
  }

  // Filter berdasarkan ketersediaan
  if (availability.value !== '') {
    const hasEnoughStock = availability.value === 'true'
    result = result.filter((p) => (p.hasEnoughStock !== false) === hasEnoughStock)
  }

  // Sort berdasarkan harga
  if (sortOrder.value === 'asc') {
    result.sort((a, b) => a.price - b.price)
  } else if (sortOrder.value === 'desc') {
    result.sort((a, b) => b.price - a.price)
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage))

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProducts.value.slice(start, end)
})

// --- Watchers ---
// Reset halaman saat filter/sort/search/category berubah
watch([search, sortOrder, availability, selectedCategory], () => {
  currentPage.value = 1
})

// --- Helper Functions ---
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

const getImageUrl = (path) => {
  return path ? `${apiBaseUrl}${path}` : 'https://via.placeholder.com/150/f0f0f0?text=No+Image'
}

function getPromoForProduct(product) {
  return promos.value.find((promo) => promo.product_id === product.id)
}

// --- Fetch Data ---
async function fetchProducts() {
  try {
    const response = await api.get('/api/products/available')
    products.value = response.data.map((p) => ({
      ...p,
      // Ensure category exists for filtering, default to 'Lain-lain' if not present
      category: p.category || 'Lain-lain',
    }))
    // Dynamically add unique categories if they don't exist in the predefined list
    const uniqueCategories = new Set(categories.value)
    products.value.forEach((p) => {
      if (p.category && !uniqueCategories.has(p.category)) {
        uniqueCategories.add(p.category)
      }
    })
    // Sort categories to put "Semua" first if it exists, then alphabetically
    const sortedCategories = Array.from(uniqueCategories).sort()
    if (sortedCategories.includes('Semua')) {
      const index = sortedCategories.indexOf('Semua')
      if (index > -1) {
        sortedCategories.splice(index, 1)
      }
      categories.value = ['Semua', ...sortedCategories]
    } else {
      categories.value = sortedCategories
    }
  } catch (error) {
    console.error('Gagal memuat produk:', error)
    Swal.fire('Error', 'Gagal memuat daftar produk.', 'error')
  }
}

async function fetchPromos() {
  try {
    const response = await api.get('/api/promos')
    promos.value = response.data
  } catch (error) {
    console.error('Gagal memuat promo:', error)
  }
}

// --- Modal Controls ---
function openCreateModal() {
  selectedProduct.value = null
  showCreateModal.value = true
}

function openCreatePromo() {
  selectedPromo.value = null
  showCreatePromo.value = true
}

function editProduct(product) {
  selectedProduct.value = product
  showEditModal.value = true
}

function editPromo(promo) {
  if (promo) {
    selectedPromo.value = promo
    showEditPromo.value = true
  } else {
    Swal.fire('Tidak Ada Promo', 'Promo ini tidak ditemukan untuk produk terkait.', 'info')
  }
}

function closeModals() {
  showCreateModal.value = false
  showEditModal.value = false
  selectedProduct.value = null

  showCreatePromo.value = false
  showEditPromo.value = false
  selectedPromo.value = null
}

function handleSaved() {
  fetchProducts()
  fetchPromos()
  closeModals()
  Swal.fire('Berhasil!', 'Produk berhasil disimpan/diperbarui.', 'success')
}

function handleSavedPromo() {
  fetchProducts()
  fetchPromos()
  closeModals()
  Swal.fire('Berhasil!', 'Promo berhasil disimpan/diperbarui.', 'success')
}

// --- Pagination Actions ---
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

// --- Delete Actions ---
async function deleteProduct(id) {
  const result = await Swal.fire({
    title: 'Hapus Produk?',
    html: 'Anda yakin ingin menghapus produk ini?<br><strong class="text-red-600">Aksi ini tidak dapat dibatalkan!</strong>',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Ya, Hapus Produk!',
    cancelButtonText: 'Batal',
  })

  if (result.isConfirmed) {
    try {
      await api.delete(`/api/products/${id}`)
      fetchProducts()
      fetchPromos()
      Swal.fire('Berhasil!', 'Produk berhasil dihapus.', 'success')
      if (currentPage.value > totalPages.value && totalPages.value > 0) {
        currentPage.value = totalPages.value
      } else if (totalPages.value === 0) {
        currentPage.value = 1
      }
    } catch (error) {
      console.error('Gagal menghapus produk:', error)
      Swal.fire('Gagal!', 'Gagal menghapus produk. Terjadi kesalahan.', 'error')
    }
  }
}

// --- Initial Data Fetch ---
onMounted(() => {
  fetchProducts()
  fetchPromos()
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
