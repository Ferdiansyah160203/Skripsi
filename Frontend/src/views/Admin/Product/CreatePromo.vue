<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center"
  >
    <div class="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
      <h2 class="text-2xl font-bold text-gray-700 mb-4">🎁 Tambah Promo</h2>

      <form @submit.prevent="submitPromo">
        <!-- Pilih Produk -->
        <div class="mb-4">
          <label class="block mb-1 font-medium text-gray-700">Produk</label>
          <select
            v-model="form.product_id"
            class="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-sky-300"
            required
          >
            <option value="" disabled>Pilih Produk</option>
            <option v-for="product in products" :key="product.id" :value="product.id">
              {{ product.name }}
            </option>
          </select>
        </div>

        <!-- Point Cost -->
        <div class="mb-4">
          <label class="block mb-1 font-medium text-gray-700">Biaya Poin</label>
          <input
            type="number"
            v-model="form.point_cost"
            min="1"
            class="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-sky-300"
            required
          />
        </div>

        <!-- Aktif / Tidak -->
        <div class="mb-4 flex items-center gap-2">
          <input type="checkbox" v-model="form.is_active" id="is_active" />
          <label for="is_active" class="text-gray-700">Promo Aktif</label>
        </div>

        <!-- Tombol -->
        <div class="flex justify-end gap-2">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-sm rounded-lg bg-gray-300 hover:bg-gray-400"
          >
            Batal
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-sm rounded-lg bg-sky-600 text-white hover:bg-sky-700"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '/utils/axios'
import Swal from 'sweetalert2'

defineProps({
  show: Boolean,
  productId: Number,
})
const emit = defineEmits(['close', 'saved'])

const form = ref({
  product_id: '',
  point_cost: '',
  is_active: true,
})

const products = ref([])

async function fetchProducts() {
  try {
    const res = await api.get('/api/products/available')
    products.value = res.data
  } catch (err) {
    console.error('Gagal mengambil produk:', err)
  }
}

async function submitPromo() {
  try {
    await api.post('/api/promos/create', form.value)
    Swal.fire('Berhasil', 'Promo berhasil ditambahkan', 'success')
    emit('saved')
    emit('close')
  } catch (error) {
    console.error('Gagal menambahkan promo:', error)
    Swal.fire('Gagal', 'Terjadi kesalahan saat menyimpan promo', error)
  }
}

onMounted(fetchProducts)
</script>
