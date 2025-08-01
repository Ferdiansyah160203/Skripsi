<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
  >
    <div class="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between pb-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Detail Pembelian</h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X class="w-6 h-6" />
          </button>
        </div>

        <div v-if="purchase" class="mt-6 space-y-6">
          <!-- Purchase Info -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-md font-semibold text-gray-900 mb-4">Informasi Pembelian</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-600">Nama Supplier</label>
                <p class="text-sm text-gray-900 font-medium">{{ purchase.supplier_name }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600">Kontak Supplier</label>
                <p class="text-sm text-gray-900">{{ purchase.supplier_contact || '-' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600">Tanggal Pembelian</label>
                <p class="text-sm text-gray-900">{{ formatDate(purchase.purchase_date) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600">No. Invoice</label>
                <p class="text-sm text-gray-900">{{ purchase.invoice_number || '-' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600">Status Pembayaran</label>
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    purchase.payment_status === 'paid'
                      ? 'bg-green-100 text-green-800'
                      : purchase.payment_status === 'partial'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800',
                  ]"
                >
                  {{ getStatusText(purchase.payment_status) }}
                </span>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600">Metode Pembayaran</label>
                <p class="text-sm text-gray-900 capitalize">{{ purchase.payment_method }}</p>
              </div>
            </div>
            <div v-if="purchase.notes" class="mt-4">
              <label class="block text-sm font-medium text-gray-600">Catatan</label>
              <p class="text-sm text-gray-900">{{ purchase.notes }}</p>
            </div>
          </div>

          <!-- Items Table -->
          <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h4 class="text-md font-semibold text-gray-900">Item Pembelian</h4>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Item
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Jumlah
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Harga Satuan
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Subtotal
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Kadaluarsa
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Catatan
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="item in purchase.items" :key="item.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 text-sm text-gray-900">
                      <div>
                        <span class="font-medium">{{ item.inventory.name }}</span>
                        <div class="text-xs text-gray-500">Unit: {{ item.inventory.unit }}</div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ item.quantity }} {{ item.inventory.unit }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Rp {{ formatCurrency(item.unit_price) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      Rp {{ formatCurrency(item.subtotal) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ item.expiry_date ? formatDate(item.expiry_date) : '-' }}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-900">
                      {{ item.notes || '-' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Total -->
          <div class="bg-blue-50 rounded-lg p-4">
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold text-gray-900">Total Pembelian:</span>
              <span class="text-2xl font-bold text-blue-600"
                >Rp {{ formatCurrency(purchase.total_amount) }}</span
              >
            </div>
          </div>

          <!-- Timestamps -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-md font-semibold text-gray-900 mb-4">Informasi Sistem</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-600">Dibuat pada</label>
                <p class="text-sm text-gray-900">{{ formatDateTime(purchase.createdAt) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600">Terakhir diupdate</label>
                <p class="text-sm text-gray-900">{{ formatDateTime(purchase.updatedAt) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Close Button -->
        <div class="flex items-center justify-end pt-6 border-t border-gray-200">
          <button
            @click="$emit('close')"
            class="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-400 transition-colors duration-200"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { X } from 'lucide-vue-next'

defineProps({
  show: Boolean,
  purchase: Object,
})

defineEmits(['close'])

function getStatusText(status) {
  switch (status) {
    case 'paid':
      return 'Lunas'
    case 'partial':
      return 'Sebagian'
    case 'pending':
      return 'Belum Lunas'
    default:
      return status
  }
}

const formatCurrency = (num) => {
  if (typeof num !== 'number') {
    num = parseFloat(num)
  }
  if (isNaN(num)) return '0'
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

const formatDate = (dateString) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}

const formatDateTime = (dateString) => {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}
</script>
