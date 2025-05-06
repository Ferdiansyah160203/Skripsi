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
              <td class="px-6 py-4 text-sm text-gray-800">{{ item.id }}</td>
              <td class="px-6 py-4 text-sm text-gray-800">{{ item.name }}</td>
              <td class="px-6 py-4 text-sm text-gray-800">{{ item.unit }}</td>
              <td class="px-6 py-4 text-sm text-gray-800">{{ item.stock }}</td>

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
  <ConfirmDialog group="headless">
    <template #container="{ message, acceptCallback, rejectCallback }">
      <div class="flex flex-col items-center p-8 bg-surface-0 dark:bg-surface-900 rounded">
        <div
          class="rounded-full bg-primary text-primary-contrast inline-flex justify-center items-center h-24 w-24 -mt-20"
        >
          <i class="pi pi-question !text-4xl"></i>
        </div>
        <span class="font-bold text-2xl block mb-2 mt-6">{{ message.header }}</span>
        <p class="mb-0">{{ message.message }}</p>
        <div class="flex items-center gap-2 mt-6">
          <Button label="Ya, Hapus" @click="acceptCallback" severity="danger" />
          <Button label="Batal" outlined @click="rejectCallback" />
        </div>
      </div>
    </template>
  </ConfirmDialog>

  <Toast />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import CreateInventories from '@/views/Admin/Inventories/CreateInventories.vue'
import api from '/utils/axios.js'

// Icons
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/solid'

const confirm = useConfirm()
const toast = useToast()

const inventory = ref([])

onMounted(async () => {
  try {
    // const token = localStorage.getItem('accessToken')
    const response = await api.get('api/inventories', {
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
    })
    inventory.value = response.data
    console.log('Data inventaris:', inventory.value)
  } catch (error) {
    console.error('Gagal memuat data inventaris:', error)
  }
})

function deleteItem(id) {
  confirm.require({
    group: 'headless',
    header: 'Hapus Data?',
    message: 'Apakah kamu yakin ingin menghapus item ini?',
    accept: async () => {
      try {
        await api.delete(`api/inventories/${id}`)
        inventory.value = inventory.value.filter((item) => item.id !== id)
        toast.add({
          severity: 'success',
          summary: 'Berhasil',
          detail: 'Item berhasil dihapus',
          life: 3000,
        })
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: 'Gagal',
          detail: 'Gagal menghapus item',
          life: 3000,
        })
        console.error(error)
      }
    },
    reject: () => {
      toast.add({
        severity: 'info',
        summary: 'Dibatalkan',
        detail: 'Penghapusan dibatalkan',
        life: 2000,
      })
    },
  })
}

const modalOpen = ref(false)
function addInventory(item) {
  inventory.value.push(item)
}
</script>
