<template>
  <DefaultLayout>
    <div class="p-4 bg-gradient-to-b from-sky-50 to-white h-full rounded-lg shadow-md mb-4">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-indigo-700">📦 Inventaris</h1>
        <router-link
          to="#"
          @click.prevent="modalOpen = true"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 rounded-lg shadow"
        >
          <PlusIcon class="w-5 h-5" />
          Tambah Inventaris
        </router-link>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto bg-white shadow-xl rounded-xl">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-sky-100">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-bold text-sky-700 uppercase tracking-wider"
              >
                No
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-bold text-sky-700 uppercase tracking-wider"
              >
                Nama
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-bold text-sky-700 uppercase tracking-wider"
              >
                Unit
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-bold text-sky-700 uppercase tracking-wider"
              >
                Stock
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-bold text-sky-700 uppercase tracking-wider"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="item in inventory" :key="item.id" class="hover:bg-indigo-50 transition">
              <td class="px-6 py-4 text-sm text-gray-800">{{ item.name }}</td>
              <td class="px-6 py-4 text-sm text-gray-800">{{ item.category }}</td>
              <td class="px-6 py-4 text-sm text-gray-800">{{ item.stock }}</td>
              <td class="px-6 py-4 text-sm text-gray-800">{{ item.price.toLocaleString() }}</td>
              <td class="px-6 py-4 text-right">
                <router-link
                  :to="`/admin/inventories/${item.id}/edit`"
                  class="inline-flex items-center text-indigo-600 hover:text-indigo-800 mr-4"
                >
                  <PencilSquareIcon class="w-5 h-5 mr-1" />
                  Edit
                </router-link>
                <button
                  @click="deleteItem(item.id)"
                  class="inline-flex items-center text-red-500 hover:text-red-700"
                >
                  <TrashIcon class="w-5 h-5 mr-1" />
                  Delete
                </button>
              </td>
            </tr>
            <tr v-if="inventory.length === 0">
              <td colspan="5" class="text-center py-6 text-gray-500">Tidak ada data inventaris.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <CreateInventories :show="modalOpen" @close="modalOpen = false" @save="addInventory" />
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import CreateInventories from '@/views/Inventories/CreateInventories.vue'


// Icons
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/solid'

// Dummy data sementara
const inventory = ref([])

onMounted(() => {
  inventory.value = [
    { id: 1, name: 'Printer Epson', category: 'Peralatan', stock: 20, price: 200 },
    { id: 2, name: 'Kabel HDMI', category: 'Aksesoris', stock: 100, price: 75000 },
    { id: 3, name: 'Laptop Asus', category: 'Elektronik', stock: 10, price: 100 },
  ]
})

function deleteItem(id) {
  if (confirm('Hapus item ini?')) {
    inventory.value = inventory.value.filter((item) => item.id !== id)
  }
}

const modalOpen = ref(false)
function addInventory(item) {
  inventory.value.push(item)
}
</script>
