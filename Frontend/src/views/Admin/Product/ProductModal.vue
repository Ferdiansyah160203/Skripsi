<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center"
    >
      <div class="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-emerald-600">
            {{ isEditMode ? 'Edit Produk' : 'Tambah Produk' }}
          </h2>
          <button @click="emit('close')" class="text-gray-400 hover:text-red-500">
            <CircleX class="w-6 h-6" />
          </button>
        </div>

        <!-- Notifikasi -->
        <div
          v-if="toast.message"
          :class="`mb-4 px-4 py-2 text-sm rounded ${toast.success ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`"
        >
          {{ toast.message }}
        </div>

        <!-- Form -->
        <form @submit.prevent="submitProduct" class="space-y-5 overflow-y-auto max-h-[400px]">
          <!-- Nama -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama</label>
            <input
              v-model="form.name"
              type="text"
              class="w-full border rounded-lg px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          <!-- Harga -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Harga</label>
            <input
              v-model.number="form.price"
              type="number"
              class="w-full border rounded-lg px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          <!-- Deskripsi -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full border rounded-lg px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
            />
          </div>

          <!-- Upload Gambar -->
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700 mb-2">Gambar Produk</label>
            <div
              @dragover.prevent
              @drop.prevent="handleDrop"
              class="border border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-emerald-400 transition"
            >
              <p class="text-gray-500 text-sm">Tarik file ke sini atau klik untuk memilih</p>
              <input
                type="file"
                class="opacity-0 absolute inset-0 cursor-pointer"
                @change="onFileChange"
              />
            </div>
            <div v-if="imagePreview" class="mt-3">
              <img
                :src="imagePreview"
                alt="Preview"
                class="w-32 h-32 object-cover rounded border"
              />
            </div>
          </div>

          <!-- Bahan Baku -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Bahan Baku</label>
            <div
              v-for="(material, index) in form.materials"
              :key="index"
              class="flex items-center gap-3 mb-3"
            >
              <select
                v-model.number="material.inventories_id"
                class="flex-1 border rounded-lg px-3 py-2"
              >
                <option disabled value="">-- Pilih Inventaris --</option>
                <option v-for="item in inventories" :key="item.id" :value="item.id">
                  {{ item.name }}
                </option>
              </select>
              <input
                v-model.number="material.quantity_used"
                type="number"
                min="1"
                class="w-24 border rounded-lg px-3 py-2"
                placeholder="Qty"
              />
              <button
                type="button"
                @click="removeMaterial(index)"
                class="text-sm text-red-500 hover:underline"
              >
                Hapus
              </button>
            </div>
            <button
              type="button"
              @click="addMaterial"
              class="mt-1 text-sm text-emerald-600 hover:underline"
            >
              + Tambah Bahan Baku
            </button>
          </div>

          <!-- Aksi -->
          <div class="flex justify-end gap-3 pt-4">
            <button
              type="button"
              @click="emit('close')"
              class="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-sm bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import api from '/utils/axios'
import { CircleX } from 'lucide-vue-next'
const isEditMode = ref(false)
const apiBaseUrl = import.meta.env.VITE_API_URL

const { show, productId } = defineProps({ show: Boolean, productId: Number })

const emit = defineEmits(['close', 'saved'])

const form = ref({
  name: '',
  price: 0,
  description: '',
  materials: [],
})

const imageFile = ref(null)
const imagePreview = ref(null)
const inventories = ref([])
const toast = ref({ message: '', success: true })

onMounted(async () => {
  try {
    const res = await api.get('/api/inventories')
    inventories.value = res.data
  } catch (err) {
    console.error('Gagal memuat inventaris:', err)
  }

  if (productId) {
    isEditMode.value = true
    loadProduct()
  }
})

watch(
  () => productId,
  async (newVal) => {
    if (newVal) {
      isEditMode.value = true
      await loadProduct()
    } else {
      isEditMode.value = false
      resetForm()
    }
  },
)

function getImageUrl(path) {
  return `${apiBaseUrl}${path}`
}

async function loadProduct() {
  try {
    const res = await api.get(`/api/products/products/${productId}`)
    const data = res.data
    form.value.name = data.name
    form.value.price = data.price
    form.value.description = data.description
    form.value.materials = data.ProductMaterials.map((m) => ({
      inventories_id: m.inventory.id,
      quantity_used: m.quantity_used,
    }))
    imagePreview.value = getImageUrl(data.image)
  } catch (err) {
    console.error('Gagal memuat data produk:', err)
  }
}

function onFileChange(event) {
  const file = event.target.files[0]
  if (file) {
    imageFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

function handleDrop(e) {
  const file = e.dataTransfer.files[0]
  if (file) {
    imageFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

function addMaterial() {
  form.value.materials.push({ inventories_id: '', quantity_used: 1 })
}

function removeMaterial(index) {
  form.value.materials.splice(index, 1)
}

async function submitProduct() {
  const formData = new FormData()
  formData.append('name', form.value.name)
  formData.append('price', form.value.price)
  formData.append('description', form.value.description)
  formData.append('materials', JSON.stringify(form.value.materials))
  if (imageFile.value) {
    formData.append('image', imageFile.value)
  }

  try {
    const url = isEditMode.value ? `/api/products/${productId}` : '/api/products/create'
    const method = isEditMode.value ? 'put' : 'post'

    await api[method](url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    toast.value = {
      message: isEditMode.value ? 'Produk berhasil diperbarui!' : 'Produk berhasil disimpan!',
      success: true,
    }

    setTimeout(() => (toast.value.message = ''), 3000)

    emit('saved')
    resetForm()
    setTimeout(() => emit('close'), 1000)
  } catch (err) {
    toast.value = { message: 'Gagal menyimpan produk.', success: false }
    setTimeout(() => (toast.value.message = ''), 3000)
    console.error(err)
  }
}

function resetForm() {
  form.value = {
    name: '',
    price: 0,
    description: '',
    materials: [],
  }
  imageFile.value = null
  imagePreview.value = null
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
