<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center px-4"
    >
      <div class="bg-white w-full max-w-md rounded-xl shadow-2xl p-8 relative animate-fade-in">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-sky-700 flex items-center gap-2">
            <svg
              v-if="isEdit"
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-sky-600"
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
              class="h-6 w-6 text-sky-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clip-rule="evenodd"
              />
            </svg>
            {{ isEdit ? 'Edit Data Member' : 'Tambah Member Baru' }}
          </h2>
          <button @click="close" class="text-gray-400 hover:text-red-500 transition duration-200">
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
        <form @submit.prevent="handleSubmit" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input
              v-model="form.name"
              type="text"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
              placeholder="Masukkan nama member"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
            <input
              v-model="form.phone"
              type="text"
              :class="[
                'w-full border rounded-lg px-4 py-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200',
                phoneError ? 'border-red-500 bg-red-50' : 'border-gray-300',
              ]"
              placeholder="Contoh: 081234567890"
              required
              @input="validatePhone"
            />
            <p v-if="phoneError" class="text-red-500 text-xs mt-1">{{ phoneError }}</p>
            <p class="text-gray-500 text-xs mt-1">Minimal 9 angka, maksimal 13 angka</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email (opsional)</label>
            <input
              v-model="form.email"
              type="email"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200"
              placeholder="Masukkan email member"
            />
          </div>
          <div class="flex justify-end gap-3 pt-4">
            <button
              type="button"
              @click="close"
              class="px-5 py-2.5 text-base font-medium bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition duration-200"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="!!phoneError"
              :class="[
                'px-5 py-2.5 text-base font-medium rounded-lg shadow-md transition duration-200 transform',
                phoneError
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-sky-600 hover:bg-sky-700 text-white hover:scale-105',
              ]"
            >
              Simpan Data
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'
import api from '/utils/axios.js' // Sesuaikan path ini
import Swal from 'sweetalert2'

const props = defineProps({
  show: Boolean,
  editId: Number,
})
const emit = defineEmits(['close', 'saved'])

const form = ref({ name: '', phone: '', email: '' })
const isEdit = ref(false)
const phoneError = ref('')

watch(
  () => props.editId,
  async (newId) => {
    phoneError.value = '' // Reset error saat mode berubah
    if (newId) {
      isEdit.value = true
      try {
        const { data } = await api.get(`/api/members/list/${newId}`)
        form.value = { ...data }
      } catch (error) {
        console.error('Gagal memuat data member untuk edit:', error)

        Swal.fire('Error', 'Gagal memuat data member untuk diedit.', 'error')
        close()
      }
    } else {
      isEdit.value = false
      form.value = { name: '', phone: '', email: '' } // Reset form untuk tambah baru
    }
  },
  { immediate: true },
)

function close() {
  emit('close')
  // Reset form setelah modal ditutup, untuk mencegah data lama muncul saat dibuka lagi
  form.value = { name: '', phone: '', email: '' }
  phoneError.value = ''
}

function validatePhone() {
  const phone = form.value.phone
  // Hapus semua karakter non-digit
  const cleanPhone = phone.replace(/\D/g, '')

  // Update form dengan nomor yang sudah dibersihkan
  form.value.phone = cleanPhone

  // Validasi panjang nomor
  if (cleanPhone.length < 9) {
    phoneError.value = 'Nomor telepon minimal 9 angka'
  } else if (cleanPhone.length > 13) {
    phoneError.value = 'Nomor telepon maksimal 13 angka'
    // Potong nomor jika lebih dari 13 digit
    form.value.phone = cleanPhone.substring(0, 13)
  } else {
    phoneError.value = ''
  }
}

async function handleSubmit() {
  // Validasi nomor telepon sebelum submit
  validatePhone()

  if (phoneError.value) {
    Swal.fire('Validasi Error', phoneError.value, 'warning')
    return
  }

  // Validasi panjang nomor telepon final
  const cleanPhone = form.value.phone.replace(/\D/g, '')
  if (cleanPhone.length < 9 || cleanPhone.length > 13) {
    Swal.fire('Validasi Error', 'Nomor telepon harus antara 9-13 angka', 'warning')
    return
  }

  try {
    if (isEdit.value) {
      const { data } = await api.put(`/api/members/${props.editId}`, form.value)
      Swal.fire('Berhasil!', 'Data member berhasil diperbarui.', 'success')
      emit('saved', data)
      close()
    } else {
      const { data } = await api.post('/api/members/create', form.value)
      Swal.fire('Berhasil!', 'Member baru berhasil ditambahkan.', 'success')
      emit('saved', data)
      close()
    }
  } catch (error) {
    console.error('Gagal menyimpan data member:', error.response?.data || error.message)
    Swal.fire('Gagal', error.response?.data?.message || 'Gagal menyimpan data member.', 'error')
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
</style>
