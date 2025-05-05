<template>
  <DefaultLayout>
    <div class="flex h-full">
      <!-- Left Panel (70%) - Daftar Produk -->
      <div class="w-7/10 bg-white p-4 overflow-y-auto">
        <h2 class="text-2xl font-bold text-indigo-600 mb-4">Daftar Produk</h2>

        <!-- List Produk -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="product in products"
            :key="product.id"
            @click="selectProduct(product)"
            class="border rounded-lg p-4 cursor-pointer hover:bg-sky-100 transition"
          >
            <img :src="product.image" alt="product" class="w-full h-40 object-cover mb-2" />
            <p class="text-lg font-semibold text-gray-800">{{ product.name }}</p>
            <p class="text-sm text-gray-500">{{ product.category }}</p>
            <p class="text-sm font-bold text-sky-500">Rp {{ product.price.toLocaleString() }}</p>
          </div>
        </div>
      </div>

      <!-- Right Panel (30%) - Order Detail -->
      <div class="w-3/10 bg-gray-50 p-6 overflow-y-auto">
        <h2 class="text-xl font-bold text-indigo-600 mb-4">Detail Order</h2>

        <!-- Form Order -->
        <div v-if="selectedProduct" class="space-y-4">
          <div class="flex items-center justify-between">
            <p class="text-lg font-semibold text-gray-800">Nama Produk</p>
            <p class="text-lg text-gray-700">{{ selectedProduct.name }}</p>
          </div>
          <div class="flex items-center justify-between">
            <p class="text-lg font-semibold text-gray-800">Harga</p>
            <p class="text-lg text-gray-700">Rp {{ selectedProduct.price.toLocaleString() }}</p>
          </div>

          <div class="flex items-center justify-between">
            <p class="text-lg font-semibold text-gray-800">Jumlah</p>
            <input
              v-model="orderQuantity"
              type="number"
              min="1"
              class="w-20 px-2 py-1 border rounded-md"
            />
          </div>

          <div class="flex items-center justify-between mt-4">
            <p class="text-lg font-semibold text-gray-800">Total</p>
            <p class="text-lg text-sky-500">
              Rp {{ (selectedProduct.price * orderQuantity).toLocaleString() }}
            </p>
          </div>

          <button
            @click="addOrder"
            class="w-full mt-4 py-2 text-white bg-sky-500 hover:bg-sky-600 rounded-md"
          >
            Tambah ke Keranjang
          </button>
        </div>

        <div v-else>
          <p class="text-center text-gray-500">Pilih produk untuk menambahkan ke order.</p>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const products = ref([
  {
    id: 1,
    name: 'Printer Epson',
    category: 'Peralatan',
    price: 2500000,
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 2,
    name: 'Kabel HDMI',
    category: 'Aksesoris',
    price: 75000,
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 3,
    name: 'Laptop Asus',
    category: 'Elektronik',
    price: 8500000,
    image: 'https://via.placeholder.com/150',
  },
])

const selectedProduct = ref(null)
const orderQuantity = ref(1)

function selectProduct(product) {
  selectedProduct.value = product
}

function addOrder() {
  if (selectedProduct.value) {
    // Logic untuk menambah pesanan
    console.log('Menambah order:', selectedProduct.value.name, 'Jumlah:', orderQuantity.value)
  }
}
</script>

<style scoped>
/* Optional style untuk card dan hover efek */
</style>
