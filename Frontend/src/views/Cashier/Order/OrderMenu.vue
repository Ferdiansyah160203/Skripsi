<template>
  <DefaultLayout>
    <div class="flex flex-col lg:flex-row h-full space-x-4">
      <!-- Left Panel: Daftar Produk -->
      <div class="w-full lg:w-2/3 bg-white p-4 overflow-y-auto">
        <h2 class="text-2xl font-bold text-indigo-600 mb-4">Daftar Produk</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="product in products"
            :key="product.id"
            @click="selectProduct(product)"
            class="border rounded-lg p-4 cursor-pointer hover:bg-sky-100 transition"
          >
            <img
              :src="getImageUrl(product.image)"
              alt="product"
              class="w-full h-40 object-cover mb-2"
            />
            <p class="text-lg font-semibold text-gray-800">{{ product.name }}</p>
            <p class="text-sm font-bold text-sky-500">Rp {{ product.price.toLocaleString() }}</p>
          </div>
        </div>
      </div>

      <!-- Right Panel: Detail Order & Keranjang -->
      <div class="w-full lg:w-1/3 bg-gray-50 p-6 overflow-y-auto mt-6 lg:mt-0">
        <h2 class="text-xl font-bold text-indigo-600 mb-4">Detail Order</h2>

        <!-- Detail Produk yang dipilih -->
        <div v-if="selectedProduct" class="space-y-4">
          <div class="flex items-center justify-between">
            <p class="text-lg font-semibold">Nama Produk</p>
            <p>{{ selectedProduct.name }}</p>
          </div>
          <div class="flex items-center justify-between">
            <p class="text-lg font-semibold">Harga</p>
            <p>Rp {{ selectedProduct.price.toLocaleString() }}</p>
          </div>
          <div class="flex items-center justify-between">
            <p class="text-lg font-semibold">Jumlah</p>
            <input
              v-model.number="orderQuantity"
              type="number"
              min="1"
              class="w-20 px-2 py-1 border rounded-md"
            />
          </div>
          <div class="flex items-center justify-between">
            <p class="text-lg font-semibold">Subtotal</p>
            <p class="text-sky-500">
              Rp {{ (selectedProduct.price * orderQuantity).toLocaleString() }}
            </p>
          </div>

          <button
            @click="addToCart"
            class="w-full py-2 text-white bg-sky-500 hover:bg-sky-600 rounded-md"
          >
            Tambah ke Keranjang
          </button>
        </div>

        <!-- Keranjang -->
        <div class="mt-6">
          <h3 class="text-lg font-bold mb-2">Keranjang</h3>
          <ul v-if="cart.length > 0" class="space-y-2">
            <li
              v-for="(item, index) in cart"
              :key="item.product_id"
              class="flex justify-between items-center text-sm border-b p-2"
            >
              <div>
                <span class="block font-medium">{{ item.name }}</span>
                <input
                  type="number"
                  v-model.number="item.quantity"
                  min="1"
                  class="w-16 mt-1 px-2 py-1 border rounded"
                />
              </div>
              <div class="text-right">
                <span>Rp {{ (item.price * item.quantity).toLocaleString() }}</span>
                <button
                  @click="removeFromCart(index)"
                  class="ml-2 text-red-500 hover:underline text-xs block"
                >
                  Hapus
                </button>
              </div>
            </li>
          </ul>
          <p v-else class="text-gray-500 text-sm">Keranjang kosong</p>

          <div class="mt-2 text-sm font-medium text-gray-600">
            Total Item: {{ totalItems }}<br />
            Total Harga: Rp {{ totalPrice.toLocaleString() }}
          </div>

          <!-- Diskon, Metode Pembayaran, dan Submit Order -->
          <div class="mt-4 border-t pt-2 space-y-2">
            <label class="block text-sm font-medium">Nomor HP / Email Member</label>
            <input
              v-model="memberIdentifier"
              type="text"
              placeholder="opsional"
              class="w-full px-2 py-1 border rounded-md"
            />

            <label class="block text-sm font-medium">Diskon (%)</label>
            <input
              v-model.number="discount"
              type="number"
              min="0"
              max="100"
              class="w-full px-2 py-1 border rounded-md"
            />

            <label class="block text-sm font-medium">Metode Pembayaran</label>
            <select v-model="paymentMethod" class="w-full px-2 py-1 border rounded-md mb-4">
              <option value="cash">Cash</option>
              <option value="qris">QRIS</option>
            </select>

            <button
              @click="submitOrder"
              class="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
            >
              Proses Pesanan
            </button>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import api from '/utils/axios.js'
import Swal from 'sweetalert2'

import { useRouter } from 'vue-router'

const router = useRouter()
const apiBaseUrl = import.meta.env.VITE_API_URL
const getImageUrl = (path) => (path ? `${apiBaseUrl}${path}` : 'https://via.placeholder.com/150')

const products = ref([])
const selectedProduct = ref(null)
const orderQuantity = ref(1)
const cart = ref([])
const discount = ref(0)
const paymentMethod = ref('cash')
const memberIdentifier = ref('')

onMounted(async () => {
  try {
    const res = await api.get('/api/products/available')
    products.value = res.data
  } catch (err) {
    console.error('Gagal memuat produk:', err)
  }
})

function selectProduct(product) {
  selectedProduct.value = product
  orderQuantity.value = 1
}

function addToCart() {
  if (!selectedProduct.value || orderQuantity.value < 1) return

  const existing = cart.value.find((item) => item.product_id === selectedProduct.value.id)
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

  // Notifikasi dengan SweetAlert2
  Swal.fire({
    icon: 'success',
    title: `${selectedProduct.value.name} berhasil ditambahkan ke keranjang`,
    showConfirmButton: false,
    timer: 1500,
  })

  orderQuantity.value = 1
}

function removeFromCart(index) {
  cart.value.splice(index, 1)
}

const totalItems = computed(() => cart.value.reduce((sum, item) => sum + item.quantity, 0))
const totalPrice = computed(() =>
  cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0),
)

async function submitOrder() {
  if (cart.value.length === 0) {
    Swal.fire('Oops!', 'Keranjang kosong.', 'warning')
    return
  }

  const payload = {
    payment_method: paymentMethod.value,
    discount: discount.value,
    member_identifier: memberIdentifier.value || null,
    products: cart.value.map((item) => ({
      product_id: item.product_id,
      quantity_sold: item.quantity,
    })),
  }

  try {
    const res = await api.post('/api/transactions/create', payload)
    const trxId = res.data.transaction.id

    Swal.fire({
      icon: 'success',
      title: `Transaksi berhasil!`,
      text: `ID Transaksi: ${trxId}`,
      timer: 2000,
      showConfirmButton: false,
    })

    // Reset form
    cart.value = []
    memberIdentifier.value = ''
    discount.value = 0

    // Redirect ke /payment dengan parameter id
    setTimeout(() => {
      router.push(`/payment/${trxId}`)
    }, 1500)
  } catch (err) {
    console.error('Gagal membuat transaksi:', err)
    Swal.fire('Gagal', 'Terjadi kesalahan saat memproses transaksi.', 'error')
  }
}
</script>
