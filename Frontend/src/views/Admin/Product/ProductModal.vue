<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 z-50 backdrop-blur-sm bg-opacity-50 flex items-center justify-center px-4 py-6"
    >
      <div class="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-8 relative animate-fade-in">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-emerald-700 flex items-center gap-2">
            <svg
              v-if="isEditMode"
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-emerald-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.389-8.389-2.828-2.828z"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-emerald-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clip-rule="evenodd"
              />
            </svg>
            {{ isEditMode ? 'Edit Data Produk' : 'Tambah Produk Baru' }}
          </h2>
          <button
            @click="emit('close')"
            class="text-gray-400 hover:text-red-500 transition duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-7 w-7"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div
          v-if="toast.message"
          :class="`mb-4 px-5 py-3 text-base rounded-lg ${toast.success ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`"
          role="alert"
        >
          {{ toast.message }}
        </div>

        <form
          @submit.prevent="submitProduct"
          class="space-y-5 overflow-y-auto pr-2"
          style="max-height: 50vh"
        >
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
            <input
              v-model="form.name"
              type="text"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200"
              placeholder="Masukkan nama produk"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
            <input
              v-model.number="form.price"
              type="number"
              min="0"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200"
              placeholder="Masukkan harga produk"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <select
              v-model="form.category"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200"
              required
            >
              <option disabled value="">-- Pilih Kategori --</option>
              <option v-for="option in categoryOptions" :key="option" :value="option">
                {{ capitalize(option) }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none transition duration-200"
              placeholder="Deskripsi singkat produk"
            />
          </div>

          <div class="relative border border-gray-300 rounded-lg p-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Gambar Produk</label>
            <div
              @dragover.prevent
              @drop.prevent="handleDrop"
              class="border border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-emerald-400 transition"
            >
              <p class="text-gray-500 text-sm mb-2">Tarik & lepas file di sini atau</p>
              <input
                type="file"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                @change="onFileChange"
                accept="image/*"
              />
              <span
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-sky-500 hover:bg-sky-600"
              >
                Pilih File
              </span>
            </div>
            <div v-if="imagePreview" class="mt-3 text-center">
              <img
                :src="imagePreview"
                alt="Preview Gambar"
                class="w-32 h-32 object-cover rounded-md border border-gray-200 mx-auto"
              />
              <button
                @click="removeImage"
                type="button"
                class="text-red-500 hover:text-red-700 text-xs mt-1"
              >
                Hapus Gambar
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Bahan Baku (Resep)</label>
            <div
              v-for="(material, index) in form.materials"
              :key="index"
              class="flex flex-col sm:flex-row items-center gap-3 mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <select
                v-model.number="material.inventories_id"
                class="flex-1 w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              >
                <option disabled value="">-- Pilih Inventaris --</option>
                <option v-for="item in inventories" :key="item.id" :value="item.id">
                  {{ item.name }} (Stok: {{ formatNumber(item.stock) }} {{ item.unit }})
                </option>
              </select>
              <input
                v-model.number="material.quantity_used"
                type="number"
                min="1"
                class="w-full sm:w-24 border border-gray-300 rounded-lg px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Qty Digunakan"
                required
              />
              <button
                type="button"
                @click="removeMaterial(index)"
                class="text-red-500 hover:text-red-700 text-sm font-medium transition duration-200"
              >
                Hapus
              </button>
            </div>
            <button
              type="button"
              @click="addMaterial"
              class="mt-1 text-sm text-emerald-600 hover:underline flex items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  clip-rule="evenodd"
                />
              </svg>
              Tambah Bahan Baku
            </button>
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <button
              type="button"
              @click="emit('close')"
              class="px-5 py-2.5 text-base font-medium bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition duration-200"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-5 py-2.5 text-base font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-md transition duration-200 transform hover:scale-105"
            >
              Simpan Produk
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import api from '/utils/axios' // Sesuaikan path ini
import Swal from 'sweetalert2'

const isEditMode = ref(false)
const apiBaseUrl = import.meta.env.VITE_API_URL // Pastikan ini terkonfigurasi

const { show, productId } = defineProps({ show: Boolean, productId: Number })
const emit = defineEmits(['close', 'saved'])

const categoryOptions = ['nasi', 'camilan', 'roti', 'kopi', 'non kopi'] // Daftar kategori yang valid
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1) // Fungsi untuk kapitalisasi

const form = ref({
  name: '',
  price: 0,
  description: '',

  materials: [],
})

const imageFile = ref(null)
const imagePreview = ref(null)
const inventories = ref([]) // Daftar inventaris untuk bahan baku
const toast = ref({ message: '', success: true }) // Untuk notifikasi di dalam modal

// --- Helper Functions ---
const formatNumber = (num) => {
  if (typeof num !== 'number') {
    num = parseFloat(num)
  }
  if (isNaN(num)) return '0'
  return new Intl.NumberFormat('id-ID').format(num)
}

// --- Lifecycle & Watchers ---
onMounted(async () => {
  try {
    const res = await api.get('/api/inventories') // <<< Check this endpoint
    inventories.value = res.data
  } catch (err) {
    console.error('Gagal memuat inventaris:', err)
    Swal.fire('Error', 'Gagal memuat daftar inventaris.', 'error')
  }
})

watch(
  () => show, // Watcher untuk properti show
  (newShow) => {
    if (newShow) {
      // Ketika modal dibuka
      if (productId) {
        isEditMode.value = true
        loadProduct()
      } else {
        isEditMode.value = false
        resetForm() // Reset form hanya untuk mode create
      }
    }
  },
  { immediate: true }, // Menjalankan watcher saat komponen pertama kali di-mount
)

// --- Image Handling ---
function getImageUrl(path) {
  return `${apiBaseUrl}${path}`
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

function removeImage() {
  imageFile.value = null
  imagePreview.value = null
  // Jika ini mode edit dan ada gambar lama, Anda mungkin perlu logika untuk menandai penghapusan gambar di backend
  // form.value.image = null; // Contoh jika Anda menyimpan path gambar lama di form
}

// --- Form Data Management ---
async function loadProduct() {
  try {
    const res = await api.get(`/api/products/${productId}`) // Pastikan endpoint benar (product by ID)
    const data = res.data
    form.value.name = data.name
    form.value.price = data.price
    form.value.description = data.description
    form.value.category = data.category // Pastikan kategori dimuat
    // form.value.available = data.available !== undefined ? data.available : true // Pastikan ketersediaan dimuat
    // Memastikan ProductMaterials ada dan di-map dengan benar
    form.value.materials = (data.ProductMaterials || []).map((m) => ({
      inventories_id: m.inventory ? m.inventory.id : m.inventories_id, // Fleksibel untuk data yang berbeda
      quantity_used: m.quantity_used,
    }))
    imagePreview.value = data.image ? getImageUrl(data.image) : null
  } catch (err) {
    console.error('Gagal memuat data produk:', err)
    Swal.fire('Error', 'Gagal memuat data produk untuk diedit.', 'error')
    emit('close') // Tutup modal jika gagal memuat data
  }
}

function addMaterial() {
  form.value.materials.push({ inventories_id: '', quantity_used: 1 })
}

function removeMaterial(index) {
  form.value.materials.splice(index, 1)
}

function resetForm() {
  form.value = {
    name: '',
    price: 0,
    description: '',
    category: '',
    available: true,
    materials: [],
  }
  imageFile.value = null
  imagePreview.value = null
  toast.value = { message: '', success: true } // Reset toast juga
}

// --- Form Submission ---
async function submitProduct() {
  const formData = new FormData()
  formData.append('name', form.value.name)
  formData.append('price', form.value.price)
  formData.append('description', form.value.description || '')
  formData.append('category', form.value.category)
  formData.append('materials', JSON.stringify(form.value.materials))

  if (imageFile.value) {
    formData.append('image', imageFile.value)
  } else if (isEditMode.value && !imagePreview.value) {
    // Jika mode edit dan gambar di-remove, mungkin perlu flag ke backend
    // formData.append('remove_image', 'true');
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

    emit('saved') // Notify parent component that data is saved
    setTimeout(() => {
      toast.value.message = '' // Clear toast message
      emit('close') // Close modal after success and a short delay
      resetForm() // Reset form setelah berhasil disimpan
    }, 1000)
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Gagal menyimpan produk.'
    toast.value = { message: errorMessage, success: false }
    console.error('Error saving product:', err.response?.data || err.message)
    setTimeout(() => (toast.value.message = ''), 5000) // Tampilkan error lebih lama
  }
}
</script>

<style scoped>
/* Transisi untuk modal */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Animasi slide-in/fade-in untuk modal */
@keyframes fade-in-slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in-slide-up 0.3s ease-out;
}

/* Custom scrollbar for form (if content exceeds max-height) */
form.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

form.overflow-y-auto::-webkit-scrollbar-track {
  background: #f0f0f0;
  border-radius: 3px;
}

form.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

form.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
</style>
