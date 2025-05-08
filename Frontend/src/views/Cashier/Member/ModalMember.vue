<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 backdrop-blur-sm bg-white/30 z-50 flex items-center justify-center"
    >
      <div class="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-sky-600">
            {{ isEdit ? 'Edit Member' : 'Tambah Member' }}
          </h2>
          <button @click="close" class="text-gray-500 hover:text-red-500">
            <CircleX class="w-6 h-6" />
          </button>
        </div>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nama</label>
            <input
              v-model="form.name"
              type="text"
              class="w-full border rounded px-3 py-2 focus:ring-sky-500 focus:border-sky-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Phone</label>
            <input
              v-model="form.phone"
              type="text"
              class="w-full border rounded px-3 py-2 focus:ring-sky-500 focus:border-sky-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input
              v-model="form.email"
              type="text"
              class="w-full border rounded px-3 py-2 focus:ring-sky-500 focus:border-sky-500"
              required
            />
          </div>
          <div class="flex justify-end gap-2 pt-4">
            <button
              type="button"
              @click="close"
              class="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-sm bg-sky-500 hover:bg-sky-600 text-white rounded"
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
import { ref, watch, defineProps, defineEmits } from 'vue'
import { CircleX } from 'lucide-vue-next'
import api from '/utils/axios.js'

const props = defineProps({
  show: Boolean,
  editId: Number,
})
const emit = defineEmits(['close', 'saved'])

const form = ref({ name: '', phone: '', email: '' })
const isEdit = ref(false)

watch(
  () => props.editId,
  async (newId) => {
    if (newId) {
      isEdit.value = true
      const { data } = await api.get(`/api/members/list/${newId}`)
      form.value = { ...data }
    } else {
      isEdit.value = false
      form.value = { name: '', phone: '', email: '' }
    }
  },
  { immediate: true },
)

function close() {
  emit('close')
}

async function handleSubmit() {
  try {
    if (isEdit.value) {
      const { data } = await api.put(`/api/members/${props.editId}`, form.value)
      emit('saved', data)
    } else {
      const { data } = await api.post('/api/members/create', form.value)
      emit('saved', data)
    }
    form.value = { name: '', unit: '', stock: 0 }
    close()
  } catch (error) {
    console.error(error)
    alert('Gagal menyimpan data.')
  }
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
