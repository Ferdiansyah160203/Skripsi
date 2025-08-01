<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50"
  >
    <div class="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between pb-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ isEdit ? 'Edit Pembelian' : 'Tambah Pembelian Baru' }}
          </h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X class="w-6 h-6" />
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="mt-6 space-y-6">
          <!-- Supplier Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nama Supplier <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.supplier_name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan nama supplier"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Kontak Supplier</label>
              <input
                v-model="form.supplier_contact"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="No. HP atau Email"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Pembelian</label>
              <input
                v-model="form.purchase_date"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status Pembayaran</label>
              <select
                v-model="form.payment_status"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="pending">Belum Lunas</option>
                <option value="partial">Sebagian</option>
                <option value="paid">Lunas</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Metode Pembayaran</label>
              <select
                v-model="form.payment_method"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="cash">Tunai</option>
                <option value="transfer">Transfer</option>
                <option value="credit">Kredit</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">No. Invoice</label>
            <input
              v-model="form.invoice_number"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Masukkan no. invoice (opsional)"
            />
          </div>

          <!-- Items Section -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h4 class="text-md font-semibold text-gray-900">Item Pembelian</h4>
              <button
                type="button"
                @click="addItem"
                class="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus class="w-4 h-4" />
                Tambah Item
              </button>
            </div>

            <div v-if="form.items.length === 0" class="text-center py-8 text-gray-500">
              <Package class="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>Belum ada item yang ditambahkan</p>
              <p class="text-sm">Klik tombol "Tambah Item" untuk menambah item pembelian</p>
            </div>

            <div
              v-for="(item, index) in form.items"
              :key="index"
              class="border border-gray-200 rounded-lg p-4"
            >
              <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Item Inventori <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="item.inventory_id"
                    @change="updateItemName(index)"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Pilih item inventori</option>
                    <option v-for="inv in inventories" :key="inv.id" :value="inv.id">
                      {{ inv.name }} ({{ inv.unit }})
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Jumlah <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model.number="item.quantity"
                    @input="calculateSubtotal(index)"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Harga Satuan <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model.number="item.unit_price"
                    @input="calculateSubtotal(index)"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>
                <div class="flex items-end">
                  <button
                    type="button"
                    @click="removeItem(index)"
                    class="w-full px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors duration-200"
                  >
                    <Trash2 class="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Tanggal Kadaluarsa</label
                  >
                  <input
                    v-model="item.expiry_date"
                    type="date"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Catatan Item</label>
                  <input
                    v-model="item.notes"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Catatan tambahan (opsional)"
                  />
                </div>
              </div>

              <div class="mt-2 text-right">
                <span class="text-sm text-gray-600">Subtotal: </span>
                <span class="font-semibold text-gray-900"
                  >Rp {{ formatCurrency(item.subtotal) }}</span
                >
              </div>
            </div>

            <!-- Total -->
            <div v-if="form.items.length > 0" class="bg-gray-50 rounded-lg p-4">
              <div class="flex justify-between items-center">
                <span class="text-lg font-semibold text-gray-900">Total Pembelian:</span>
                <span class="text-xl font-bold text-blue-600"
                  >Rp {{ formatCurrency(totalAmount) }}</span
                >
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Catatan</label>
            <textarea
              v-model="form.notes"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Catatan tambahan (opsional)"
            ></textarea>
          </div>

          <!-- Buttons -->
          <div class="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-400 transition-colors duration-200"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="loading || form.items.length === 0"
              class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading">Menyimpan...</span>
              <span v-else>{{ isEdit ? 'Update' : 'Simpan' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import api from '/utils/axios'
import { X, Plus, Trash2, Package } from 'lucide-vue-next'
import Swal from 'sweetalert2'

const props = defineProps({
  show: Boolean,
  purchase: Object,
  inventories: Array,
})

const emit = defineEmits(['close', 'save'])

const loading = ref(false)
const form = ref({
  supplier_name: '',
  supplier_contact: '',
  purchase_date: new Date().toISOString().slice(0, 10),
  payment_status: 'pending',
  payment_method: 'cash',
  notes: '',
  invoice_number: '',
  items: [],
})

const isEdit = computed(() => !!props.purchase)

const totalAmount = computed(() => {
  return form.value.items.reduce((sum, item) => sum + (item.subtotal || 0), 0)
})

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      resetForm()
      if (props.purchase) {
        populateForm()
      }
    }
  },
)

function resetForm() {
  form.value = {
    supplier_name: '',
    supplier_contact: '',
    purchase_date: new Date().toISOString().slice(0, 10),
    payment_status: 'pending',
    payment_method: 'cash',
    notes: '',
    invoice_number: '',
    items: [],
  }
}

function populateForm() {
  if (props.purchase) {
    form.value = {
      supplier_name: props.purchase.supplier_name,
      supplier_contact: props.purchase.supplier_contact || '',
      purchase_date: new Date(props.purchase.purchase_date).toISOString().slice(0, 10),
      payment_status: props.purchase.payment_status,
      payment_method: props.purchase.payment_method,
      notes: props.purchase.notes || '',
      invoice_number: props.purchase.invoice_number || '',
      items: props.purchase.items.map((item) => ({
        inventory_id: item.inventory_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.subtotal,
        expiry_date: item.expiry_date ? new Date(item.expiry_date).toISOString().slice(0, 10) : '',
        notes: item.notes || '',
      })),
    }
  }
}

function addItem() {
  form.value.items.push({
    inventory_id: '',
    quantity: 0,
    unit_price: 0,
    subtotal: 0,
    expiry_date: '',
    notes: '',
  })
}

function removeItem(index) {
  form.value.items.splice(index, 1)
}

function updateItemName() {
  // This function is called when inventory is selected
  // Can be used for additional logic if needed
}

function calculateSubtotal(index) {
  const item = form.value.items[index]
  item.subtotal = (item.quantity || 0) * (item.unit_price || 0)
}

async function handleSubmit() {
  if (form.value.items.length === 0) {
    Swal.fire('Error', 'Minimal harus ada satu item pembelian', 'error')
    return
  }

  loading.value = true

  try {
    const payload = {
      ...form.value,
      items: form.value.items.map((item) => ({
        ...item,
        expiry_date: item.expiry_date || null,
      })),
    }

    if (isEdit.value) {
      await api.put(`/api/purchases/${props.purchase.id}`, payload)
      Swal.fire('Berhasil!', 'Pembelian berhasil diupdate.', 'success')
    } else {
      await api.post('/api/purchases', payload)
      Swal.fire('Berhasil!', 'Pembelian berhasil ditambahkan.', 'success')
    }

    emit('save')
  } catch (err) {
    console.error('Error saving purchase:', err)
    Swal.fire('Error', 'Gagal menyimpan pembelian.', 'error')
  } finally {
    loading.value = false
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
</script>
