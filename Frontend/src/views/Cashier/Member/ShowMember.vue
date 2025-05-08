<template>
  <DefaultLayout>
    <div class="p-4 bg-gradient-to-b from-sky-50 to-white h-full rounded-lg shadow-md mb-4">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-indigo-700">👬🏼 Member</h1>
        <button
          @click="openModal()"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 rounded-lg shadow"
        >
          <PlusIcon class="w-5 h-5" />
          Tambah Member
        </button>
      </div>

      <div class="overflow-x-auto bg-white shadow-xl rounded-xl">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-sky-100">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-bold text-sky-700 uppercase">No</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-sky-700 uppercase">Nama</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-sky-700 uppercase">Phone</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-sky-700 uppercase">Email</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-sky-700 uppercase">
                Total Spent
              </th>
              <th class="px-6 py-3 text-left text-xs font-bold text-sky-700 uppercase">
                Total Point
              </th>
              <th class="px-6 py-3 text-right text-xs font-bold text-sky-700 uppercase">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="(item, index) in member" :key="item.id" class="hover:bg-indigo-50">
              <td class="px-6 py-4">{{ index + 1 }}</td>
              <td class="px-6 py-4">{{ item.name }}</td>
              <td class="px-6 py-4">{{ item.phone }}</td>
              <td class="px-6 py-4">{{ item.email }}</td>
              <td class="px-6 py-4">{{ item.total_spent }}</td>
              <td class="px-6 py-4">{{ item.total_points }}</td>

              <td class="px-6 py-4 text-right space-x-2">
                <button @click="openModal(item.id)" class="text-indigo-600 hover:text-indigo-800">
                  <PencilSquareIcon class="w-5 h-5 inline mr-1" />
                  Edit
                </button>
                <button @click="deleteItem(item.id)" class="text-red-500 hover:text-red-700">
                  <TrashIcon class="w-5 h-5 inline mr-1" />
                  Delete
                </button>
              </td>
            </tr>
            <tr v-if="member.length === 0">
              <td colspan="5" class="text-center py-6 text-gray-500">Tidak ada data Member.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ModalMember
      :show="modalOpen"
      :editId="editId"
      @close="modalOpen = false"
      @saved="refreshData"
    />
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import ModalMember from './ModalMember.vue'
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/solid'
import Swal from 'sweetalert2'
import api from '/utils/axios'

const member = ref([])
const modalOpen = ref(false)
const editId = ref(null)

onMounted(() => {
  fetchInventories()
})

function openModal(id = null) {
  editId.value = id
  modalOpen.value = true
}

function refreshData() {
  fetchInventories()
  modalOpen.value = false
  Swal.fire('Berhasil', `Member ${editId.value ? 'diperbarui' : 'ditambahkan'}.`, 'success')
}

async function fetchInventories() {
  try {
    const { data } = await api.get('/api/members')
    member.value = data
  } catch (err) {
    console.error('Gagal memuat inventaris:', err)
  }
}

async function deleteItem(id) {
  const result = await Swal.fire({
    title: 'Hapus Data?',
    text: 'Apakah kamu yakin ingin menghapus item ini?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e3342f',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal',
  })

  if (result.isConfirmed) {
    try {
      await api.delete(`/api/members/${id}`)
      member.value = member.value.filter((item) => item.id !== id)
      Swal.fire('Berhasil', 'Member berhasil dihapus.', 'success')
    } catch (err) {
      Swal.fire('Gagal', 'Gagal menghapus item.', err)
    }
  }
}
</script>
