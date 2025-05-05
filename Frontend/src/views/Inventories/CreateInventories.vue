<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 backdrop-blur-sm bg-white/30 z-50 flex items-center justify-center"
    >
      <div class="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-sky-600">Tambah Inventaris</h2>
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
            <label class="block text-sm font-medium text-gray-700">Unit</label>
            <input
              v-model="form.unit"
              type="text"
              class="w-full border rounded px-3 py-2 focus:ring-sky-500 focus:border-sky-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Stok</label>
            <input
              v-model="form.stock"
              type="number"
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
import { ref, defineEmits } from 'vue'
import { CircleX } from 'lucide-vue-next'

const emit = defineEmits(['close', 'save'])
defineProps({ show: Boolean })

const form = ref({ name: '', unit: '', stock: 0 })

function close() {
  emit('close')
}

function handleSubmit() {
  const newItem = {
    ...form.value,
    createdAt: new Date().toISOString(),
  }
  emit('save', newItem)
  close()
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
