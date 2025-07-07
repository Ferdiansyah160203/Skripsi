<template>
  <DefaultLayout>
    <div class="flex flex-col lg:flex-row h-screen lg:space-x-6 p-4">
      <div class="w-full lg:w-2/3 bg-white rounded-lg shadow-lg p-6 flex flex-col">
        <h2 class="text-3xl font-extrabold text-indigo-700 mb-6 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8 mr-3 text-indigo-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 012.586 13H4v1a1 1 0 011 1h.586l.707.707A1 1 0 017 17h6a1 1 0 01.707-.293l.707-.707H15v-1h1.414a1 1 0 01.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 110-6 3 3 0 010 6z"
            />
          </svg>
          Pilih Menu
        </h2>

        <div class="mb-6 flex flex-col md:flex-row gap-4 flex-shrink-0">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Cari produk..."
            class="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
          />
          <select
            v-model="selectedCategory"
            class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition bg-white"
          >
            <option value="">Semua Kategori</option>
            <option v-for="category in uniqueCategories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>

        <div class="flex-grow overflow-y-auto pr-2 pb-4 min-h-0">
          <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <div
              v-for="product in filteredProducts"
              :key="product.id"
              @click="openProductModal(product)"
              :class="{
                'border-indigo-500 ring-2 ring-indigo-300 transform scale-105 shadow-xl':
                  selectedProduct?.id === product.id,
                'border-gray-200 hover:shadow-lg hover:border-indigo-300':
                  selectedProduct?.id !== product.id,
              }"
              class="relative rounded-xl p-4 bg-white cursor-pointer transition-all duration-300 ease-in-out flex flex-col justify-between"
            >
              <img
                :src="getImageUrl(product.image)"
                :alt="product.name"
                class="w-full h-32 sm:h-40 object-cover rounded-md mb-3 shadow-sm"
              />
              <div class="flex-grow">
                <p class="text-xl font-bold text-gray-800 mb-1">{{ product.name }}</p>
                <p class="text-sm text-gray-600 truncate">
                  {{ product.description || 'Tidak ada deskripsi' }}
                </p>
              </div>
              <div class="mt-3 flex items-center justify-between">
                <p class="text-md font-bold text-sky-600">Rp {{ formatNumber(product.price) }}</p>
                <span
                  v-if="getPromoForProduct(product)"
                  class="text-xs font-semibold text-green-600 bg-green-50 px-1 py-0.5 rounded-full flex items-center gap-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3 w-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                  </svg>
                  {{ getPromoForProduct(product).point_cost }} Pts
                </span>
              </div>
              <div
                v-if="selectedProduct?.id === product.id"
                class="absolute top-2 right-2 bg-indigo-500 text-white rounded-full p-1 shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div
              v-if="filteredProducts.length === 0"
              class="col-span-full text-center py-10 text-gray-500 text-lg"
            >
              <p class="mb-2">Tidak ada produk yang ditemukan.</p>
              <p class="text-sm">Coba sesuaikan pencarian atau filter Anda.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full lg:w-1/3 flex flex-col gap-6 mt-6 lg:mt-0">
        <div
          class="bg-white rounded-lg shadow-lg p-6 flex flex-col border border-indigo-100 flex-grow"
        >
          <h2 class="text-2xl font-bold text-indigo-700 flex items-center gap-2 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-7 w-7 text-indigo-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.5 14 6.333 14H15a1 1 0 000-2H6.333a.25.25 0 01-.25-.25V6.5h11.177l-.49 2.077a2 2 0 001.996 2.41L18 14H5c-1.5 0-2.675-1.39-2.75-3.15-.01-.01-.01-.02-.01-.03-.02-.09-.03-.017-.03-.25L3 4H1a1 1 0 000-2h2zM7 18a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z"
              />
            </svg>
            Keranjang
          </h2>
          <ul v-if="cart.length > 0" class="space-y-3 max-h-56 overflow-y-auto pr-2 pb-2 flex-grow">
            <li
              v-for="(item, index) in cart"
              :key="item.product_id + '-' + index"
              class="flex justify-between items-center border border-gray-200 bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition"
            >
              <div>
                <span class="block font-semibold text-gray-800">{{ item.name }}</span>
                <span class="text-sm text-gray-600">Rp {{ formatNumber(item.price) }}</span>
                <div class="flex items-center mt-1 gap-2">
                  <button
                    @click="decreaseCartItemQuantity(index)"
                    class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-0.5 rounded-md text-sm transition"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    v-model.number="item.quantity"
                    min="1"
                    @change="updateCartQuantity(index)"
                    class="w-14 text-center mx-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-300"
                  />
                  <button
                    @click="increaseCartItemQuantity(index)"
                    class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-0.5 rounded-md text-sm transition"
                  >
                    +
                  </button>
                </div>
              </div>
              <div class="text-right flex flex-col items-end gap-1">
                <span class="font-bold text-indigo-600 text-lg">
                  Rp {{ formatNumber(item.price * item.quantity) }}
                </span>
                <button
                  @click="removeFromCart(index)"
                  class="text-red-500 hover:text-red-700 text-xs font-medium transition"
                >
                  Hapus
                </button>
              </div>
            </li>
          </ul>
          <p v-else class="text-gray-500 text-center py-8 bg-gray-50 rounded-lg">
            Keranjang Anda masih kosong. Ayo pilih menu!
          </p>
          <div
            class="flex justify-between text-base font-semibold text-gray-700 mt-2 flex-shrink-0"
          >
            <span>Jumlah Item:</span>
            <span>{{ totalItems }}</span>
          </div>
          <div class="flex justify-between text-base font-bold text-indigo-800 flex-shrink-0">
            <span>Total Harga:</span>
            <span>Rp {{ formatNumber(totalPrice) }}</span>
          </div>
        </div>

        <div
          class="bg-white rounded-lg shadow-lg p-6 flex flex-col gap-4 border border-indigo-100 flex-shrink-0"
        >
          <h2 class="text-2xl font-bold text-indigo-700 mb-2">Checkout</h2>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Nomor HP / Email Member (opsional)</label
            >
            <div class="flex items-center gap-2">
              <input
                v-model="memberIdentifier"
                type="text"
                placeholder="Masukkan ID member"
                class="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />
              <button
                @click="openModal()"
                class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium transition"
              >
                Daftar Member
              </button>
            </div>
            <p v-if="member" class="text-sm text-green-700 mt-2 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clip-rule="evenodd"
                />
              </svg>
              Member: <strong>{{ member.name }}</strong> (Poin:
              <strong>{{ formatNumber(memberPoints) }}</strong
              >)
            </p>
            <p
              v-else-if="memberIdentifier && memberIdentifier.length > 0 && !member"
              class="text-sm text-red-600 mt-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 inline-block mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              Member tidak ditemukan.
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Diskon (%)</label>
            <input
              v-model.number="discount"
              type="number"
              min="0"
              max="100"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Metode Pembayaran</label>
            <select
              v-model="paymentMethod"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition bg-white"
            >
              <option value="cash">Cash</option>
              <option value="qris">QRIS</option>
              <option value="points" :disabled="!member || memberPoints < finalPrice">
                Points (Poin Anda: {{ formatNumber(memberPoints) }})
              </option>
            </select>
            <p
              v-if="paymentMethod === 'points' && (!member || memberPoints < finalPrice)"
              class="text-red-500 text-xs mt-1"
            >
              Poin tidak cukup atau member tidak terdaftar.
            </p>
          </div>
          <div class="mt-2 p-4 bg-indigo-50 rounded-lg shadow-sm">
            <div class="flex justify-between text-base font-semibold text-gray-800">
              <span>Subtotal:</span>
              <span>Rp {{ formatNumber(totalPrice) }}</span>
            </div>
            <div class="flex justify-between text-base font-semibold text-red-600 mt-1">
              <span>Diskon ({{ discount }}%):</span>
              <span>- Rp {{ formatNumber(discountAmount) }}</span>
            </div>
            <div
              class="flex justify-between text-xl font-extrabold text-indigo-700 border-t border-indigo-200 pt-3 mt-3"
            >
              <span>Total Akhir:</span>
              <span>Rp {{ formatNumber(finalPrice) }}</span>
            </div>
          </div>
          <button
            @click="submitOrder"
            :disabled="
              cart.length === 0 ||
              (paymentMethod === 'points' && (!member || memberPoints < finalPrice))
            "
            class="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg mt-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414L7.5 9.086 6.207 7.793a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            {{ isEditMode ? 'Perbarui Pesanan' : 'Proses Pesanan' }}
          </button>
        </div>
      </div>
    </div>
    <ModalMember :show="modalOpen" @close="modalOpen = false" @saved="fetchMember" />

    <div
      v-if="selectedProduct"
      class="fixed inset-0 z-50 flex items-center justify-center bg-opacity-30 backdrop-blur-sm px-4 py-6"
    >
      <div class="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md animate-fade-in relative">
        <button
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-900 text-2xl font-bold"
          @click="closeProductModal"
        >
          &times;
        </button>
        <h3 class="text-2xl font-bold text-indigo-700 mb-4">{{ selectedProduct.name }}</h3>
        <img
          :src="getImageUrl(selectedProduct.image)"
          :alt="selectedProduct.name"
          class="w-full h-48 object-cover rounded-md mb-4 shadow-md"
        />
        <p class="mb-4 text-gray-700 text-base">
          {{ selectedProduct.description || 'Tidak ada deskripsi.' }}
        </p>
        <p class="text-xl font-extrabold text-sky-600 mb-4">
          Harga: Rp {{ formatNumber(selectedProduct.price) }}
        </p>

        <div class="flex items-center justify-between mb-6">
          <label class="font-semibold text-gray-700 text-lg">Jumlah:</label>
          <div class="flex items-center space-x-2">
            <button
              @click="orderQuantity = Math.max(1, orderQuantity - 1)"
              class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-lg font-bold transition"
            >
              -
            </button>
            <input
              type="number"
              v-model.number="orderQuantity"
              min="1"
              class="w-24 text-center px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-300 text-lg"
            />
            <button
              @click="orderQuantity++"
              class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-lg font-bold transition"
            >
              +
            </button>
          </div>
        </div>

        <button
          @click="addToCartAndCloseModal"
          class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-xl flex items-center justify-center gap-2 transition duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-7 w-7"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.5 14 6.333 14H15a1 1 0 000-2H6.333a.25.25 0 01-.25-.25V6.5h11.177l-.49 2.077a2 2 0 001.996 2.41L18 14H5c-1.5 0-2.675-1.39-2.75-3.15-.01-.01-.01-.02-.01-.03-.02-.09-.03-.017-.03-.25L3 4H1a1 1 0 000-2h2zM7 18a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z"
            />
          </svg>
          Tambah ke Keranjang
        </button>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue' // Sesuaikan path ini
import api from '/utils/axios.js' // Sesuaikan path ini
import Swal from 'sweetalert2'
import ModalMember from '../Member/ModalMember.vue' // Sesuaikan path ini

const route = useRoute()
const router = useRouter()

// Pastikan import.meta.env.VITE_API_URL dikonfigurasi di file .env Anda
const apiBaseUrl = import.meta.env.VITE_API_URL
const getImageUrl = (path) =>
  path ? `${apiBaseUrl}${path}` : 'https://via.placeholder.com/150/d1d5db/ffffff?text=No+Image'

// State
const products = ref([])
const promos = ref([])
const selectedProduct = ref(null) // selectedProduct akan digunakan untuk menampilkan modal
const orderQuantity = ref(1) // Kuantitas di modal
const cart = ref([])
const discount = ref(0)
const paymentMethod = ref('cash')
const memberIdentifier = ref('')
const isEditMode = ref(false)
const editingTransactionId = ref(null)

const member = ref(null) // menyimpan data member
const memberPoints = computed(() => member.value?.total_points || 0)

const modalOpen = ref(false) // Untuk modal registrasi member
const editId = ref(null) // Digunakan untuk ModalMember jika ada mode edit di sana

const searchQuery = ref('') // State untuk pencarian produk
const selectedCategory = ref('') // State untuk filter kategori

// Computed untuk mendapatkan kategori unik dari produk yang ada
const uniqueCategories = computed(() => {
  const categories = new Set(products.value.map((p) => p.category).filter(Boolean))
  return [...categories].sort()
})

// Filtered products berdasarkan pencarian dan kategori
const filteredProducts = computed(() => {
  return products.value.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(searchQuery.value.toLowerCase()))
    const matchesCategory = !selectedCategory.value || product.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

// Fungsi untuk membuka modal registrasi member
function openModal(id = null) {
  editId.value = id
  modalOpen.value = true
}

// Fungsi untuk membuka modal detail produk (saat item grid diklik)
function openProductModal(product) {
  selectedProduct.value = product // Set produk yang dipilih untuk ditampilkan di modal
  orderQuantity.value = 1 // Reset kuantitas di modal setiap kali modal dibuka
}

// Fungsi untuk menutup modal detail produk
function closeProductModal() {
  selectedProduct.value = null // Mengosongkan selectedProduct untuk menyembunyikan modal
  orderQuantity.value = 1 // Reset kuantitas setelah modal ditutup
}

// Fungsi untuk menambahkan item ke keranjang dari modal dan kemudian menutup modal
function addToCartAndCloseModal() {
  addToCart() // Panggil fungsi addToCart utama
  closeProductModal() // Tutup modal
}

// Fetch data member berdasarkan identifier (email/HP)
async function fetchMember() {
  if (!memberIdentifier.value) {
    member.value = null
    return
  }
  try {
    const res = await api.get(`/api/members/${memberIdentifier.value}`)
    member.value = res.data
  } catch (err) {
    member.value = null
    console.warn('Member tidak ditemukan atau error:', err)
  }
}

// Watcher yang memantau perubahan memberIdentifier untuk fetch data member
watch(
  memberIdentifier,
  async (newValue, oldValue) => {
    if (newValue !== oldValue && newValue.length > 0) {
      await fetchMember()
    } else if (newValue.length === 0) {
      member.value = null
    }
  },
  { immediate: true }, // Memanggil fetchMember saat komponen pertama kali dimuat jika memberIdentifier sudah ada
)

// Fungsi untuk memuat data transaksi yang ada (untuk mode edit)
async function loadTransaction(id) {
  try {
    const res = await api.get(`/api/transactions/${id}`)
    const trx = res.data
    if (!trx) {
      throw new Error('Data transaksi tidak ditemukan.')
    }

    editingTransactionId.value = trx.id
    isEditMode.value = true
    const items = typeof trx.items === 'string' ? JSON.parse(trx.items) : trx.items

    cart.value = items.map((item) => ({
      product_id: item.product_id,
      name: item.name,
      price: item.price,
      quantity: item.qty || item.quantity,
    }))

    paymentMethod.value = trx.payment_method
    discount.value = trx.discount
    memberIdentifier.value = trx.member_identifier || ''
    if (memberIdentifier.value) {
      await fetchMember()
    }
  } catch (err) {
    console.error('Gagal memuat transaksi:', err)
    Swal.fire('Oops!', 'Transaksi tidak ditemukan.', 'error')
  }
}

// Lifecycle hook: Ambil data produk dan promo saat komponen di-mount
onMounted(async () => {
  try {
    const [productsRes, promoRes] = await Promise.all([
      api.get('/api/products/available'),
      api.get('/api/promos'),
    ])
    products.value = productsRes.data
    promos.value = promoRes.data
  } catch (err) {
    console.error('Gagal memuat data:', err)
    Swal.fire('Error', 'Gagal memuat data produk atau promo.', 'error')
  }

  const id = route.params.id
  if (id) {
    await loadTransaction(id)
  }
})

// Fungsi untuk mendapatkan data promo terkait produk
function getPromoForProduct(product) {
  return promos.value.find((promo) => promo.product_id === product.id)
}

// Fungsi utama untuk menambahkan produk ke keranjang
function addToCart() {
  if (!selectedProduct.value || orderQuantity.value < 1) {
    Swal.fire('Warning', 'Pilih produk dan masukkan jumlah yang valid (minimal 1).', 'warning')
    return
  }

  const existing = cart.value.find((i) => i.product_id === selectedProduct.value.id)
  if (existing) {
    existing.quantity += orderQuantity.value
  } else {
    cart.value.push({
      product_id: selectedProduct.value.id,
      name: selectedProduct.value.name,
      price: selectedProduct.value.price,
      quantity: orderQuantity.value,
    })
  }
  Swal.fire({
    icon: 'success',
    title: `${selectedProduct.value.name} (${orderQuantity.value}x) ditambahkan!`,
    showConfirmButton: false,
    timer: 1500,
  })
}

// Fungsi untuk menghapus item dari keranjang dengan konfirmasi SweetAlert
function removeFromCart(index) {
  Swal.fire({
    title: 'Anda yakin?',
    text: 'Item ini akan dihapus dari keranjang!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal',
  }).then((result) => {
    if (result.isConfirmed) {
      cart.value.splice(index, 1)
      Swal.fire('Dihapus!', 'Item berhasil dihapus.', 'success')
    }
  })
}

// Fungsi untuk menambah kuantitas item di keranjang langsung
function increaseCartItemQuantity(index) {
  cart.value[index].quantity++
}

// Fungsi untuk mengurangi kuantitas item di keranjang langsung
function decreaseCartItemQuantity(index) {
  if (cart.value[index].quantity > 1) {
    cart.value[index].quantity--
  } else {
    // Opsional: Hapus item jika kuantitasnya menjadi 0
    removeFromCart(index)
  }
}

// Validasi kuantitas item di keranjang saat diubah manual (input number)
function updateCartQuantity(index) {
  if (cart.value[index].quantity < 1) {
    cart.value[index].quantity = 1
  }
}

// Computed property untuk total jumlah item di keranjang
const totalItems = computed(() => cart.value.reduce((sum, i) => sum + i.quantity, 0))
// Computed property untuk total harga sebelum diskon
const totalPrice = computed(() => cart.value.reduce((sum, i) => sum + i.price * i.quantity, 0))

// Computed property untuk jumlah diskon dalam Rupiah
const discountAmount = computed(() => {
  return (totalPrice.value * discount.value) / 100
})

// Computed property untuk harga akhir setelah diskon
const finalPrice = computed(() => {
  return Math.max(0, totalPrice.value - discountAmount.value) // Memastikan harga akhir tidak negatif
})

// Fungsi untuk submit atau update order ke backend
async function submitOrder() {
  if (cart.value.length === 0) {
    Swal.fire('Oops!', 'Keranjang kosong. Tambahkan produk dulu!', 'warning')
    return
  }

  // Validasi khusus untuk pembayaran dengan poin
  if (paymentMethod.value === 'points') {
    if (!member.value) {
      Swal.fire(
        'Oops!',
        'Anda memilih pembayaran dengan Poin, tetapi member tidak terdaftar.',
        'warning',
      )
      return
    }
    if (memberPoints.value < finalPrice.value) {
      Swal.fire(
        'Oops!',
        `Poin member tidak cukup (${formatNumber(memberPoints.value)} poin) untuk pembayaran sebesar Rp ${formatNumber(finalPrice.value)}.`,
        'warning',
      )
      return
    }
  }

  const payload = {
    payment_method: paymentMethod.value,
    discount: discount.value,
    member_identifier: memberIdentifier.value || null, // Menggunakan null jika kosong
    products: cart.value.map((i) => ({
      product_id: i.product_id,
      quantity_sold: i.quantity,
    })),
    final_price: finalPrice.value, // Kirim harga akhir ke backend
  }

  try {
    let res, trxId
    if (isEditMode.value && editingTransactionId.value) {
      // Mode edit: PUT request
      res = await api.put(`/api/transactions/${editingTransactionId.value}`, payload)
      trxId = editingTransactionId.value // ID tetap sama
      Swal.fire({
        icon: 'success',
        title: 'Pesanan berhasil diperbarui!',
        text: `Pesanan ID: ${trxId}`,
        showConfirmButton: true,
      })
    } else {
      // Mode baru: POST request
      res = await api.post('/api/transactions/create', payload)
      trxId = res.data.transaction.id // Ambil ID transaksi baru dari respons
      Swal.fire({
        icon: 'success',
        title: 'Pesanan berhasil diproses!',
        text: `Pesanan ID: ${trxId}. Lanjutkan ke pembayaran.`,
        showConfirmButton: true,
      })
    }

    router.push(`/payment/${trxId}`) // Arahkan ke halaman pembayaran dengan ID transaksi
  } catch (err) {
    console.error('Gagal memproses pesanan:', err.response?.data || err.message)
    Swal.fire(
      'Oops!',
      `Gagal memproses pesanan. Error: ${err.response?.data?.message || err.message}`,
      'error',
    )
  }
}

// Helper function untuk memformat angka sebagai mata uang (tanpa desimal)
function formatNumber(num) {
  if (typeof num !== 'number') {
    num = parseFloat(num)
  }
  if (isNaN(num)) return '0'
  return num.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}
</script>

<style scoped>
/* Optional: Custom scrollbar styles for better aesthetics */
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

/* Animasi sederhana untuk modal produk */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
</style>
