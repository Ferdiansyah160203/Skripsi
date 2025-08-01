<template>
  <DefaultLayout>
    <div class="p-6 space-y-6">
      <!-- Header Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-[#DB3A40] rounded-lg flex items-center justify-center">
              <ShoppingCart class="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">
                {{ isEdit ? 'Edit Pembelian' : 'Tambah Pembelian Baru' }}
              </h1>
              <p class="text-sm text-gray-600">
                {{ isEdit ? 'Update data pembelian stock' : 'Input pembelian stock dan inventori' }}
              </p>
            </div>
          </div>
          <router-link
            to="/purchases"
            class="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            <ArrowLeft class="w-4 h-4" />
            Kembali
          </router-link>
        </div>
      </div>

      <!-- Form Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
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

            <div
              v-if="form.items.length === 0"
              class="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg"
            >
              <Package class="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p class="font-medium">Belum ada item yang ditambahkan</p>
              <p class="text-sm">Klik tombol "Tambah Item" untuk menambah item pembelian</p>
            </div>

            <div
              v-for="(item, index) in form.items"
              :key="index"
              class="border border-gray-200 rounded-lg p-4 bg-gray-50"
            >
              <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Item Inventori <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="item.inventory_id"
                    @change="updateItemName"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
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
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
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
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
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
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Catatan Item</label>
                  <input
                    v-model="item.notes"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    placeholder="Catatan tambahan (opsional)"
                  />
                </div>
              </div>

              <div class="mt-3 text-right">
                <span class="text-sm text-gray-600">Subtotal: </span>
                <span class="font-semibold text-gray-900 text-lg"
                  >Rp {{ formatCurrency(item.subtotal) }}</span
                >
              </div>
            </div>

            <!-- Total -->
            <div
              v-if="form.items.length > 0"
              class="bg-blue-50 rounded-lg p-6 border border-blue-200"
            >
              <div class="flex justify-between items-center">
                <span class="text-lg font-semibold text-gray-900">Total Pembelian:</span>
                <span class="text-2xl font-bold text-blue-600"
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
          <div class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <router-link
              to="/purchases"
              class="px-6 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-400 transition-colors duration-200"
            >
              Batal
            </router-link>
            <button
              type="submit"
              :disabled="loading || form.items.length === 0"
              class="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span v-if="loading">
                <svg
                  class="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Menyimpan...
              </span>
              <span v-else>{{ isEdit ? 'Update Pembelian' : 'Simpan Pembelian' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '/utils/axios'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { ShoppingCart, ArrowLeft, Plus, Trash2, Package } from 'lucide-vue-next'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const inventories = ref([])
const purchaseData = ref(null)

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

const isEdit = computed(() => !!route.params.id)

const totalAmount = computed(() => {
  return form.value.items.reduce((sum, item) => sum + (item.subtotal || 0), 0)
})

onMounted(async () => {
  await fetchInventories()
  if (isEdit.value) {
    await fetchPurchase()
  }
})

async function fetchInventories() {
  try {
    const { data } = await api.get('/api/inventories/')
    inventories.value = data
  } catch (err) {
    console.error('Error fetching inventories:', err)
    Swal.fire('Error', 'Gagal memuat data inventori.', 'error')
  }
}

async function fetchPurchase() {
  try {
    const { data } = await api.get(`/api/purchases/${route.params.id}`)
    purchaseData.value = data
    populateForm()
  } catch (err) {
    console.error('Error fetching purchase:', err)
    Swal.fire('Error', 'Gagal memuat data pembelian.', 'error')
    router.push('/purchases')
  }
}

function populateForm() {
  if (purchaseData.value) {
    form.value = {
      supplier_name: purchaseData.value.supplier_name,
      supplier_contact: purchaseData.value.supplier_contact || '',
      purchase_date: new Date(purchaseData.value.purchase_date).toISOString().slice(0, 10),
      payment_status: purchaseData.value.payment_status,
      payment_method: purchaseData.value.payment_method,
      notes: purchaseData.value.notes || '',
      invoice_number: purchaseData.value.invoice_number || '',
      items: purchaseData.value.items.map((item) => ({
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
      await api.put(`/api/purchases/${route.params.id}`, payload)
      Swal.fire({
        title: 'Berhasil!',
        text: 'Pembelian berhasil diupdate.',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        router.push('/purchases')
      })
    } else {
      await api.post('/api/purchases', payload)
      Swal.fire({
        title: 'Berhasil!',
        text: 'Pembelian berhasil ditambahkan.',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        router.push('/purchases')
      })
    }
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

<style scoped>
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
</style>
