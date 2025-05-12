<template>
  <DefaultLayout>
    <div class="min-h-screen bg-gray-100 overflow-x-hidden">
      <div class="p-6">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 class="text-3xl font-bold text-indigo-700">🛒 Produk Tersedia</h1>
          <div class="flex gap-3">
            <button
              @click="openCreatePromo"
              class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-lg shadow-lg"
            >
              <PlusIcon class="w-5 h-5" />
              Tambah Promo
            </button>
            <button
              @click="openCreateModal"
              class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 rounded-lg shadow-lg"
            >
              <PlusIcon class="w-5 h-5" />
              Tambah Produk
            </button>
          </div>
        </div>

        <!-- Filter dan Search -->
        <div class="flex flex-col md:flex-row gap-4 mb-6">
          <input
            v-model="search"
            type="text"
            placeholder="Cari nama produk..."
            class="border rounded-lg px-4 py-2 w-full md:w-1/3 shadow-sm focus:ring focus:ring-sky-300"
          />
          <select
            v-model="sortOrder"
            class="border rounded-lg px-4 py-2 w-full md:w-1/4 shadow-sm focus:ring focus:ring-sky-300"
          >
            <option value="">Urutkan Harga</option>
            <option value="asc">Harga Terendah</option>
            <option value="desc">Harga Tertinggi</option>
          </select>
          <select
            v-model="availability"
            class="border rounded-lg px-4 py-2 w-full md:w-1/4 shadow-sm focus:ring focus:ring-sky-300"
          >
            <option value="">Semua Status</option>
            <option value="true">Tersedia</option>
            <option value="false">Tidak Tersedia</option>
          </select>
        </div>

        <CreateProduct
          :show="showCreateModal || showEditModal"
          :productId="selectedProduct?.id"
          @saved="handleSaved"
          @close="closeModals"
        />

        <CreatePromo
          :show="showCreatePromo || showEditPromo"
          :productId="selectedProduct?.id"
          @saved="handleSavedPromo"
          @close="closeModals"
        />

        <!-- Product List -->
        <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-6">
          <div
            v-for="product in paginatedProducts"
            :key="product.id"
            class="bg-white border rounded-lg shadow p-4 flex flex-col hover:shadow-xl transition-shadow duration-300"
          >
            <div
              class="mb-4 h-40 flex items-center justify-center bg-gray-100 rounded overflow-hidden"
            >
              <img
                v-if="product.image"
                :src="getImageUrl(product.image)"
                alt="Gambar Produk"
                class="object-cover h-full w-full"
              />
              <span v-else class="text-gray-400">Gambar Kosong</span>
            </div>

            <h2 class="text-lg font-bold text-gray-800 mb-2">{{ product.name }}</h2>

            <p
              class="text-sm text-gray-600 mb-2"
              :class="isDescriptionExpanded[product.id] ? '' : 'line-clamp-3'"
            >
              {{ product.description }}
            </p>
            <button
              @click="toggleDescription(product.id)"
              class="text-sm text-sky-500 hover:underline"
              v-if="product.description.length > 100"
            >
              {{
                isDescriptionExpanded[product.id] ? 'Tampilkan Lebih Sedikit' : 'Lihat Selengkapnya'
              }}
            </button>

            <p class="mt-2 text-sky-600 font-semibold text-lg">
              Rp {{ product.price.toLocaleString('id-ID') }}
            </p>
            <!-- Info promo poin -->
            <p v-if="getPromoForProduct(product)" class="text-xs font-semibold text-green-600 mt-1">
              {{ getPromoForProduct(product).point_cost }} Points
            </p>
            <span
              class="inline-block text-xs px-3 py-1 rounded-sm mt-2 font-medium text-center w-full"
              :class="product.available ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-500'"
            >
              {{ product.available ? 'Tersedia' : 'Tidak Tersedia' }}
            </span>
            <div class="flex justify-between items-center mt-4">
              <div class="relative">
                <button
                  @click="toggleDropdown(product.id)"
                  class="text-gray-500 hover:text-gray-700"
                >
                  Edit
                </button>
                <div
                  v-if="dropdownVisible[product.id]"
                  class="absolute top-8 left-0 bg-white border rounded shadow-lg text-sm z-10"
                >
                  <button
                    @click="editProduct(product)"
                    class="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Edit Produk
                  </button>
                  <button
                    @click="editPromo(product)"
                    class="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Edit Promo
                  </button>
                </div>
              </div>
              <button
                @click="deleteProduct(product.id)"
                class="bg-red-500 text-white py-2 px-4 text-sm rounded-lg hover:bg-red-600 shadow-md"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
        <!-- Pagination -->
        <div class="flex justify-center gap-4">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-4 py-2 rounded-lg bg-sky-200 hover:bg-sky-300 text-sm font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Sebelumnya
          </button>
          <span class="px-4 py-2 text-sm font-medium"
            >Halaman {{ currentPage }} / {{ totalPages }}</span
          >
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 rounded-lg bg-sky-200 hover:bg-sky-300 text-sm font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Selanjutnya →
          </button>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import api from '../../../../utils/axios'
import CreateProduct from '@/views/Admin/Product/CreateProduct.vue'
import CreatePromo from '@/views/Admin/Product/CreatePromo.vue'
import { PlusIcon } from '@heroicons/vue/24/solid'
import Swal from 'sweetalert2'

const apiBaseUrl = import.meta.env.VITE_API_URL

const products = ref([])
const showCreateModal = ref(false)
const showCreatePromo = ref(false)
const search = ref('')
const sortOrder = ref('')
const availability = ref('')
const currentPage = ref(1)
const itemsPerPage = 8
const promos = ref([]) // Menyimpan data promo
const isDescriptionExpanded = ref({}) // Menyimpan status expand/ collapse untuk tiap produk
const showEditModal = ref(false)
const showEditPromo = ref(false)
const selectedProduct = ref(null)
const dropdownVisible = ref({})

function toggleDropdown(productId) {
  dropdownVisible.value[productId] = !dropdownVisible.value[productId]
}

function editProduct(product) {
  selectedProduct.value = product
  showEditModal.value = true
  closeAllDropdowns()
}

function closeModals() {
  showCreateModal.value = false
  showEditModal.value = false
  showCreatePromo.value = false
  showEditPromo.value = false
}

function editPromo(product) {
  selectedProduct.value = product
  showEditPromo.value = true
  closeAllDropdowns()
}

function closeAllDropdowns() {
  dropdownVisible.value = {}
}

function getImageUrl(path) {
  return `${apiBaseUrl}${path}`
}

function getPromoForProduct(product) {
  return promos.value.find((promo) => promo.product_id === product.id)
}

async function fetchProducts() {
  try {
    const response = await api.get('/api/products/available')
    products.value = response.data
  } catch (error) {
    console.error('Gagal memuat produk:', error)
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

function openCreateModal() {
  showCreateModal.value = true
}

function openCreatePromo() {
  showCreatePromo.value = true
}

function handleSaved() {
  fetchProducts()
}

function handleSavedPromo() {
  fetchPromos()
}

function toggleDescription(productId) {
  isDescriptionExpanded.value[productId] = !isDescriptionExpanded.value[productId]
}

async function deleteProduct(id) {
  const result = await Swal.fire({
    title: 'Yakin ingin menghapus produk ini?',
    text: 'Product ini akan dihapus secara permanen.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e3342f',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Ya, Hapus!',
    cancelButtonText: 'Batal',
  })

  if (result.isConfirmed) {
    try {
      await api.delete(`/api/products/${id}`)
      fetchProducts()
      Swal.fire('Berhasil!', 'Produk berhasil dihapus.', 'success')
    } catch (error) {
      Swal.fire('Gagal!', 'Gagal menghapus produk.', 'error')
      console.error('Gagal menghapus produk:', error)
    }
  }
}

// Filter dan Sort
const filteredProducts = computed(() => {
  let result = [...products.value]

  if (search.value) {
    result = result.filter((p) => p.name.toLowerCase().includes(search.value.toLowerCase()))
  }

  if (availability.value !== '') {
    const isAvailable = availability.value === 'true'
    result = result.filter((p) => p.available === isAvailable)
  }

  if (sortOrder.value === 'asc') {
    result.sort((a, b) => a.price - b.price)
  } else if (sortOrder.value === 'desc') {
    result.sort((a, b) => b.price - a.price)
  }

  return result
})

// Pagination
const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage))

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredProducts.value.slice(start, start + itemsPerPage)
})

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

onMounted(() => {
  fetchProducts()
  fetchPromos()
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;

  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
