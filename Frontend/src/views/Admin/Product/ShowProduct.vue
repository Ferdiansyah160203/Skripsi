<template>
  <DefaultLayout>
    <div
      class="p-6 bg-gradient-to-br from-indigo-50 to-white min-h-screen rounded-xl shadow-lg mb-8"
    >
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1 class="text-4xl font-extrabold text-indigo-800 flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-10 w-10 text-emerald-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 012.586 13H4v1a1 1 0 011 1h.586l.707.707A1 1 0 017 17h6a1 1 0 01.707-.293l.707-.707H15v-1h1.414a1 1 0 01.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 110-6 3 3 0 010 6z"
              clip-rule="evenodd"
            />
          </svg>
          Manajemen Produk
        </h1>
        <div class="flex flex-col sm:flex-row gap-3">
          <button
            @click="openCreatePromo"
            class="flex items-center gap-2 px-6 py-3 text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 rounded-xl shadow-lg transition duration-300 transform hover:scale-105"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h12v1H4z"
                clip-rule="evenodd"
              />
            </svg>
            Tambah Promo
          </button>
          <button
            @click="openCreateModal"
            class="flex items-center gap-2 px-6 py-3 text-lg font-medium text-white bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 rounded-xl shadow-lg transition duration-300 transform hover:scale-105"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clip-rule="evenodd"
              />
            </svg>
            Tambah Produk
          </button>
        </div>
      </div>

      <div
        class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 p-6 bg-white rounded-xl shadow border border-gray-200"
      >
        <div class="md:col-span-2">
          <label class="text-sm text-gray-600 font-medium mb-1 block">Cari Produk</label>
          <input
            v-model="search"
            type="text"
            placeholder="Cari nama atau deskripsi produk..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-400 focus:border-transparent transition"
          />
        </div>
        <div>
          <label class="text-sm text-gray-600 font-medium mb-1 block">Urutkan Harga</label>
          <select
            v-model="sortOrder"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-400 focus:border-transparent transition bg-white"
          >
            <option value="">Default</option>
            <option value="asc">Harga Terendah</option>
            <option value="desc">Harga Tertinggi</option>
          </select>
        </div>
        <div>
          <label class="text-sm text-gray-600 font-medium mb-1 block">Status Ketersediaan</label>
          <select
            v-model="availability"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-400 focus:border-transparent transition bg-white"
          >
            <option value="">Semua</option>
            <option value="true">Tersedia</option>
            <option value="false">Tidak Tersedia</option>
          </select>
        </div>
      </div>

      <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8">
        <div
          v-for="product in paginatedProducts"
          :key="product.id"
          class="bg-white rounded-xl shadow-lg p-5 flex flex-col hover:shadow-xl transition-shadow duration-300 border border-gray-100"
        >
          <div
            class="mb-4 h-40 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden border border-gray-200"
          >
            <img
              v-if="product.image"
              :src="getImageUrl(product.image)"
              :alt="product.name"
              class="object-cover h-full w-full"
            />
            <span v-else class="text-gray-400 text-sm">Tidak ada Gambar</span>
          </div>

          <h2 class="text-xl font-bold text-gray-900 mb-2 truncate">{{ product.name }}</h2>

          <p
            class="text-sm text-gray-600 mb-2 flex-grow"
            :class="isDescriptionExpanded[product.id] ? '' : 'line-clamp-3'"
          >
            {{ product.description || 'Tidak ada deskripsi.' }}
          </p>
          <button
            @click="toggleDescription(product.id)"
            class="text-sm text-sky-600 hover:underline mt-1 self-start"
            v-if="product.description && product.description.length > 100"
          >
            {{
              isDescriptionExpanded[product.id] ? 'Tampilkan Lebih Sedikit' : 'Lihat Selengkapnya'
            }}
          </button>

          <p class="mt-3 text-emerald-700 font-extrabold text-xl">
            Rp {{ formatCurrency(product.price) }}
          </p>
          <div
            v-if="getPromoForProduct(product)"
            class="flex items-center gap-1 text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full mt-2 self-start"
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
          <span
            class="inline-block text-xs px-3 py-1 rounded-full mt-3 font-medium text-center self-start"
            :class="product.available ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-500'"
          >
            {{ product.available ? 'Tersedia' : 'Tidak Tersedia' }}
          </span>

          <div class="flex justify-start gap-3 mt-4 flex-wrap">
            <button
              @click="editProduct(product)"
              class="flex items-center gap-1 px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg text-sm font-medium transition duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.389-8.389-2.828-2.828z"
                />
              </svg>
              Edit
            </button>
            <button
              v-if="getPromoForProduct(product)"
              @click="editPromo(getPromoForProduct(product))"
              class="flex items-center gap-1 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-sm font-medium transition duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h12v1H4z"
                  clip-rule="evenodd"
                />
              </svg>
              Promo
            </button>
            <button
              @click="deleteProduct(product.id)"
              class="flex items-center gap-1 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 000-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              Hapus
            </button>
            <button
              v-if="getPromoForProduct(product)"
              @click="deletePromo(getPromoForProduct(product))"
              class="flex items-center gap-1 px-4 py-2 bg-pink-100 hover:bg-pink-200 text-pink-700 rounded-lg text-sm font-medium transition duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
              Hapus Promo
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
                : 'bg-white hover:bg-sky-100 text-sky-700 border-sky-300 shadow-sm'
            "
          >
            Sebelumnya
          </button>
          <span class="text-md font-semibold flex items-center justify-center text-sky-800">
            Halaman {{ currentPage }} dari {{ totalPages }}
          </span>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 rounded-lg border text-sm font-medium transition duration-200"
            :class="
              currentPage === totalPages
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-white hover:bg-sky-100 text-sky-700 border-sky-300 shadow-sm'
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
      :promo-id="selectedPromo ? selectedPromo.id : null"
      @close="closeModals"
      @saved="handleSavedPromo"
    />
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, onMounted, reactive, watch } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue' // Sesuaikan path ini
import api from '/utils/axios' // Sesuaikan path ini
import CreateProduct from '@/views/Admin/Product/ProductModal.vue' // Sesuaikan path ini
import CreatePromo from '@/views/Admin/Product/PromoModal.vue' // Sesuaikan path ini
import Swal from 'sweetalert2'

const apiBaseUrl = import.meta.env.VITE_API_URL

const products = ref([])
const promos = ref([]) // Menyimpan data promo

const showCreateModal = ref(false)
const showCreatePromo = ref(false)
const showEditModal = ref(false)
const showEditPromo = ref(false)

const selectedProduct = ref(null) // Digunakan untuk edit product
const selectedPromo = ref(null) // Digunakan untuk edit promo

const search = ref('')
const sortOrder = ref('') // 'asc' atau 'desc'
const availability = ref('') // 'true' atau 'false'

const currentPage = ref(1)
const itemsPerPage = 8

const isDescriptionExpanded = reactive({}) // Menyimpan status expand/collapse untuk tiap produk

// --- Computed Properties ---
const filteredProducts = computed(() => {
  let result = [...products.value]

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
    const isAvailable = availability.value === 'true' // Konversi string ke boolean
    result = result.filter((p) => p.available === isAvailable)
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
// Reset halaman saat filter/sort/search berubah
watch([search, sortOrder, availability], () => {
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
  return path ? `${apiBaseUrl}${path}` : 'https://via.placeholder.com/150/f0f0f0?text=No+Image' // Placeholder yang lebih baik
}

function getPromoForProduct(product) {
  // Mencari promo berdasarkan product_id dari produk saat ini
  return promos.value.find((promo) => promo.product_id === product.id)
}

function toggleDescription(productId) {
  isDescriptionExpanded.value[productId] = !isDescriptionExpanded.value[productId]
}

// --- Fetch Data ---
async function fetchProducts() {
  try {
    const response = await api.get('/api/products') // Ambil semua produk (termasuk yang tidak available)
    products.value = response.data
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
    // Swal.fire('Error', 'Gagal memuat daftar promo.', 'error'); // Mungkin tidak perlu error jika hanya promo
  }
}

// --- Modal Controls ---
function openCreateModal() {
  selectedProduct.value = null // Pastikan null untuk mode create
  showCreateModal.value = true
}

function openCreatePromo() {
  selectedPromo.value = null // Pastikan null untuk mode create
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
  selectedProduct.value = null // Penting untuk mereset

  showCreatePromo.value = false
  showEditPromo.value = false
  selectedPromo.value = null // Penting untuk mereset
}

function handleSaved() {
  fetchProducts() // Refresh data produk setelah save
  fetchPromos() // Pastikan promo juga di-refresh
  closeModals() // Tutup modal setelah save
  Swal.fire('Berhasil!', 'Produk berhasil disimpan/diperbarui.', 'success')
}

function handleSavedPromo() {
  fetchProducts() // Pastikan produk juga di-refresh karena status promo bisa mempengaruhi tampilan produk
  fetchPromos() // Refresh data promo setelah save
  closeModals() // Tutup modal setelah save
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
      fetchProducts() // Re-fetch products after deletion
      fetchPromos() // Re-fetch promos just in case product deletion affects a promo
      Swal.fire('Berhasil!', 'Produk berhasil dihapus.', 'success')
      // Adjust current page if needed
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

async function deletePromo(promo) {
  // Cek apakah promo memiliki ID yang valid
  if (!promo || !promo.id) {
    Swal.fire('Informasi', 'Promo tidak ditemukan atau ID tidak valid.', 'info')
    return
  }

  const result = await Swal.fire({
    title: 'Hapus Promo?',
    html: `Anda yakin ingin menghapus promo untuk produk <strong>${promo.product_id}</strong>?<br><strong class="text-red-600">Aksi ini tidak dapat dibatalkan!</strong>`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Ya, Hapus Promo!',
    cancelButtonText: 'Batal',
  })

  if (result.isConfirmed) {
    try {
      await api.delete(`/api/promos/${promo.id}`)
      fetchPromos() // Re-fetch promos after deletion
      // Tidak perlu fetchProducts lagi, karena status promo tidak mengubah daftar produk
      Swal.fire('Berhasil!', 'Promo berhasil dihapus.', 'success')
    } catch (error) {
      console.error('Gagal menghapus promo:', error)
      Swal.fire('Gagal!', 'Gagal menghapus promo. Terjadi kesalahan.', 'error')
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
/* Custom scrollbar styles (same as before) */
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

/* Line clamp for description */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
