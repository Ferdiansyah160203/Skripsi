<template>
  <DefaultLayout>
    <div class="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-2xl mt-8 mb-8">
      <h1
        class="text-4xl font-extrabold text-indigo-700 mb-8 text-center flex items-center justify-center gap-3"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-10 w-10 text-indigo-600"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
        Detail Pembayaran
      </h1>

      <div
        v-if="transaction && transaction.status === 'paid'"
        class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md flex items-center gap-3"
        role="alert"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>
          <p class="font-bold">Transaksi Lunas!</p>
          <p>Pembayaran telah berhasil diproses.</p>
        </div>
      </div>
      <div
        v-else-if="transaction"
        class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-md flex items-center gap-3"
        role="alert"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div>
          <p class="font-bold">Menunggu Pembayaran</p>
          <p>Transaksi ini belum lunas. Segera proses pembayaran.</p>
        </div>
      </div>

      <div
        v-if="transaction"
        class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg shadow-inner mb-8"
      >
        <div class="space-y-3">
          <h3 class="text-xl font-bold text-gray-800 mb-2">Informasi Umum</h3>
          <div class="flex justify-between items-center text-gray-700">
            <span class="font-semibold">ID Transaksi:</span>
            <span class="font-mono text-gray-900">{{ transaction.id }}</span>
          </div>
          <div class="flex justify-between items-center text-gray-700">
            <span class="font-semibold">Tanggal:</span>
            <span>{{ formatDateTime(transaction.createdAt) }}</span>
          </div>
          <div class="flex justify-between items-center text-gray-700">
            <span class="font-semibold">Metode Pembayaran:</span>
            <span class="capitalize font-medium text-indigo-600">{{
              transaction.payment_method
            }}</span>
          </div>
          <div
            v-if="transaction.member_identifier"
            class="flex justify-between items-center text-gray-700"
          >
            <span class="font-semibold">ID Member:</span>
            <span>{{ transaction.member_identifier }}</span>
          </div>
        </div>

        <div class="space-y-3">
          <h3 class="text-xl font-bold text-gray-800 mb-2">Ringkasan Harga</h3>
          <div class="flex justify-between items-center text-gray-700">
            <span class="font-semibold">Subtotal:</span>
            <span>Rp {{ formatCurrency(transaction.total_price) }}</span>
          </div>
          <div class="flex justify-between items-center text-gray-700">
            <span class="font-semibold">Diskon:</span>
            <span
              >{{ transaction.discount }}% (- Rp
              {{ formatCurrency((transaction.total_price * transaction.discount) / 100) }})</span
            >
          </div>
          <div
            class="flex justify-between items-center text-lg font-bold text-gray-900 border-t border-gray-200 pt-2 mt-2"
          >
            <span>Total Akhir:</span>
            <span class="text-indigo-700 text-2xl font-extrabold"
              >Rp {{ formatCurrency(transaction.final_price) }}</span
            >
          </div>
          <div
            v-if="transaction.payment_method === 'cash'"
            class="flex justify-between items-center text-gray-700"
          >
            <span class="font-semibold">Uang Dibayar:</span>
            <span>Rp {{ formatCurrency(transaction.cash_paid || 0) }}</span>
          </div>
          <div
            v-if="transaction.payment_method === 'cash'"
            class="flex justify-between items-center text-gray-700"
          >
            <span class="font-semibold">Kembalian:</span>
            <span>Rp {{ formatCurrency(transaction.change || 0) }}</span>
          </div>
        </div>
      </div>

      <div
        v-if="transaction && transaction.items && transaction.items.length"
        class="bg-gray-50 p-6 rounded-lg shadow-inner mb-8"
      >
        <h3 class="text-xl font-bold text-gray-800 mb-4">
          Produk yang Dibeli ({{ transaction.quantity_sold }} Item)
        </h3>
        <div class="space-y-3 max-h-60 overflow-y-auto pr-2">
          <div
            v-for="item in transaction.items"
            :key="item.product_id"
            class="flex justify-between items-center border-b pb-2 last:border-b-0"
          >
            <div class="flex-grow">
              <p class="font-medium text-gray-900">{{ item.name }}</p>
              <p class="text-sm text-gray-600">
                {{ item.quantity }} x Rp {{ formatCurrency(item.price) }}
              </p>
            </div>
            <span class="font-semibold text-gray-800">Rp {{ formatCurrency(item.subtotal) }}</span>
          </div>
        </div>
      </div>
      <div
        v-else-if="transaction"
        class="bg-gray-50 p-6 rounded-lg shadow-inner mb-8 text-center text-gray-500"
      >
        <p>Tidak ada produk dalam transaksi ini.</p>
      </div>

      <div class="mt-6 flex flex-col sm:flex-row gap-4">
        <button
          v-if="transaction && transaction.status !== 'paid'"
          @click="kembaliKeOrder"
          class="flex-1 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clip-rule="evenodd"
            />
          </svg>
          Edit Order
        </button>

        <button
          v-if="transaction && transaction.status !== 'paid'"
          @click="markAsPaid"
          class="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
          Tandai sebagai Lunas
        </button>

        <button
          v-if="transaction && transaction.status === 'paid'"
          @click="printReceipt"
          class="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M5 4a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2H5zm0 2h10v4H5V6z"
              clip-rule="evenodd"
            />
            <path
              d="M.5 12.5C.5 12.223.723 12 .997 12h18.006c.274 0 .497.223.497.5v2.992c0 .274-.223.5-.497.5H.997a.5.5 0 01-.497-.5V12.5z"
            />
            <path
              fill-rule="evenodd"
              d="M10 18a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z"
              clip-rule="evenodd"
            />
          </svg>
          Cetak Struk
        </button>
      </div>

      <div
        v-if="transaction"
        id="receipt-print"
        class="hidden font-mono text-sm w-[300px] bg-white p-2 mx-auto print:block print:w-[300px] print:mx-auto print:text-xs"
        style="font-family: 'Consolas', 'Courier New', monospace"
      >
        <div class="text-center border-b pb-2 mb-2">
          <p class="text-xl font-bold mb-1">KEDAI DELIMA</p>
          <p class="text-xs">Ruko Permata Cikarang Timur</p>
          <p class="text-xs">Telp: 0812-9982-231</p>
          <p class="text-xs">NPWP: 06.410.258.5-526.000</p>
          <p class="text-xs mt-2">------------------------------------</p>
        </div>

        <div class="mb-2">
          <p class="flex justify-between text-xs">
            <span>Tanggal: {{ formatDateTime(transaction.createdAt) }}</span>
          </p>
          <p class="text-xs">Transaksi ID: {{ transaction.id }}</p>
          <p v-if="transaction.member_identifier" class="text-xs">
            Member ID: {{ transaction.member_identifier }}
          </p>
          <p class="text-xs">------------------------------------</p>
        </div>

        <div class="border-b pt-1 pb-2 mb-2">
          <p class="flex justify-between text-xs font-bold">
            <span>ITEM</span><span>QTY HARGA SUBTOTAL</span>
          </p>
          <template v-if="transaction.items && transaction.items.length">
            <div v-for="item in transaction.items" :key="item.product_id" class="mt-1">
              <p class="text-xs">{{ item.name }}</p>
              <p class="flex justify-between text-xs">
                <span>{{ item.quantity }} x {{ formatCurrency(item.price) }}</span>
                <span>{{ formatCurrency(item.subtotal) }}</span>
              </p>
            </div>
          </template>
          <div v-else class="text-center text-xs text-gray-600 italic">
            <p>Tidak ada item dalam transaksi.</p>
          </div>
          <p class="text-xs mt-2">------------------------------------</p>
        </div>

        <div class="mt-2 mb-2">
          <p class="flex justify-between text-xs">
            <span>Jumlah Item:</span><span>{{ transaction.quantity_sold }}</span>
          </p>
          <p class="flex justify-between text-xs">
            <span>Sub Total:</span><span>Rp {{ formatCurrency(transaction.total_price) }}</span>
          </p>
          <p class="flex justify-between text-xs">
            <span>Diskon ({{ transaction.discount }}%):</span
            ><span
              >- Rp
              {{ formatCurrency((transaction.total_price * transaction.discount) / 100) }}</span
            >
          </p>
          <p class="flex justify-between text-xs font-bold">
            <span>TOTAL:</span><span>Rp {{ formatCurrency(transaction.final_price) }}</span>
          </p>
          <p class="flex justify-between text-xs mt-1">
            <span>Metode Bayar:</span
            ><span class="capitalize">{{ transaction.payment_method }}</span>
          </p>
          <p v-if="transaction.payment_method === 'cash'" class="flex justify-between text-xs">
            <span>Tunai:</span><span>Rp {{ formatCurrency(transaction.cash_paid || 0) }}</span>
          </p>
          <p v-if="transaction.payment_method === 'cash'" class="flex justify-between text-xs">
            <span>Kembalian:</span><span>Rp {{ formatCurrency(transaction.change || 0) }}</span>
          </p>
          <p class="text-xs mt-2">------------------------------------</p>
        </div>

        <div class="text-center mt-2">
          <p class="text-xs">Terima Kasih Atas Kunjungan Anda</p>
          <p class="text-xs">Harga Sudah Termasuk PPN 10%</p>
          <p class="text-xs">WA: 0812-9982-231</p>
          <p class="text-xs mt-2">------------------------------------</p>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '/utils/axios.js' // Sesuaikan path ini
import Swal from 'sweetalert2'
import DefaultLayout from '@/layouts/DefaultLayout.vue' // Sesuaikan path ini

const route = useRoute()
const router = useRouter()

const transactionId = route.params.id
const transaction = ref(null)

// Helper function untuk format mata uang IDR
const formatCurrency = (val) => {
  if (typeof val !== 'number') {
    val = parseFloat(val)
  }
  if (isNaN(val)) return '0'
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val)
}

// Helper function untuk format tanggal dan waktu
const formatDateTime = (val) => {
  const options = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }
  return new Date(val).toLocaleDateString('id-ID', options)
}

// Helper function untuk format waktu saja (tidak digunakan di struk baru, tapi tetap disediakan)
// const formatTime = (val) =>
//   new Date(val).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

// Fungsi untuk memuat data transaksi dari API
async function loadTransaction() {
  try {
    const [transRes, productsRes] = await Promise.all([
      api.get(`/api/transactions/${transactionId}`),
      api.get('/api/products'), // Ambil daftar produk untuk mencocokkan nama item
    ])

    let trxData = transRes.data

    // Pastikan transaction_details atau items adalah array dan parse jika string
    let rawItems = []
    if (typeof trxData.transaction_details === 'string') {
      rawItems = JSON.parse(trxData.transaction_details)
    } else if (Array.isArray(trxData.transaction_details)) {
      rawItems = trxData.transaction_details
    } else if (typeof trxData.items === 'string') {
      // Fallback for older data format
      rawItems = JSON.parse(trxData.items)
    } else if (Array.isArray(trxData.items)) {
      // Fallback for older data format
      rawItems = trxData.items
    }

    const products = productsRes.data

    // Mapping item transaksi dengan detail produk
    const items = rawItems.map((item) => {
      const product = products.find((p) => p.id === item.product_id) || {}
      const price = item.price || product.price || 0
      const quantity = item.quantity || item.quantity_sold || 1
      const subtotal = item.subtotal || price * quantity // Use subtotal from backend if available, else calculate
      return {
        product_id: item.product_id,
        name: product.name || 'Produk Tidak Diketahui',
        price: price,
        quantity: quantity,
        subtotal: subtotal,
      }
    })

    const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0)

    transaction.value = {
      ...trxData,
      items: items, // Menggunakan array items yang sudah divalidasi dan di-map
      quantity_sold: totalQuantity, // Menggunakan totalQuantity dari item yang di-map
    }
  } catch (error) {
    console.error('Gagal memuat data transaksi:', error)
    Swal.fire('Oops!', 'Gagal memuat data transaksi.', 'error')
  }
}

// Fungsi untuk kembali ke halaman order dalam mode edit
function kembaliKeOrder() {
  router.push(`/order/${transactionId}`)
}

// Fungsi untuk menandai transaksi sebagai lunas
async function markAsPaid() {
  if (!transaction.value) return

  const totalHarusDibayar = transaction.value.final_price
  let payload = {
    payment_method: transaction.value.payment_method, // Menggunakan metode pembayaran yang sudah ada
  }

  if (transaction.value.payment_method === 'points') {
    const { value: memberIdentifier } = await Swal.fire({
      title: 'Konfirmasi Pembayaran Poin',
      html: `Transaksi ini akan dibayar dengan poin.<br>Total: <strong>Rp ${formatCurrency(totalHarusDibayar)}</strong>`,
      input: 'text',
      inputLabel: 'Masukkan Nomor HP/ID Member',
      inputPlaceholder: 'Contoh: 0812322369',
      showCancelButton: true,
      confirmButtonText: 'Bayar dengan Poin',
      cancelButtonText: 'Batal',
      inputValidator: (value) => {
        if (!value) {
          return 'Nomor member wajib diisi untuk pembayaran poin!'
        }
      },
    })

    if (!memberIdentifier) return // Jika pengguna membatalkan

    payload.member_identifier = memberIdentifier
  } else {
    // Metode pembayaran selain points (misal: cash atau qris yang tidak butuh input)
    const { value: uangDibayar } = await Swal.fire({
      title: 'Pembayaran Tunai',
      html: `Total harus dibayar: <strong class="text-indigo-700 text-2xl">Rp ${formatCurrency(totalHarusDibayar)}</strong>`,
      input: 'number',
      inputAttributes: {
        min: totalHarusDibayar,
      },
      inputLabel: 'Masukkan Jumlah Uang Diterima:',
      inputPlaceholder: 'Contoh: 100000',
      showCancelButton: true,
      confirmButtonText: 'Bayar',
      cancelButtonText: 'Batal',
      inputValidator: (value) => {
        if (!value || isNaN(value)) {
          return 'Masukkan jumlah yang valid.'
        }
        if (Number(value) < totalHarusDibayar) {
          return `Uang yang dibayar kurang. Perlu Rp ${formatCurrency(totalHarusDibayar - Number(value))} lagi.`
        }
      },
    })

    if (!uangDibayar) return // Jika pengguna membatalkan

    const cashPaid = Number(uangDibayar)
    const change = cashPaid - totalHarusDibayar

    payload.cash_paid = cashPaid
    payload.change = change

    // Konfirmasi akhir pembayaran cash
    const confirm = await Swal.fire({
      title: 'Konfirmasi Pembayaran',
      html: `Total: <strong>Rp ${formatCurrency(totalHarusDibayar)}</strong><br>
             Dibayar: <strong>Rp ${formatCurrency(cashPaid)}</strong><br>
             Kembalian: <strong class="text-green-600">Rp ${formatCurrency(change)}</strong>`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Ya, Bayar Sekarang!',
      cancelButtonText: 'Batal',
    })

    if (!confirm.isConfirmed) return // Jika pengguna membatalkan konfirmasi
  }

  try {
    const res = await api.put(`/api/transactions/${transactionId}/mark-as-paid`, payload)
    const updatedTransaction = res.data.transaction

    // Update state transaction dengan data terbaru
    if (updatedTransaction.status === 'paid') {
      transaction.value = { ...transaction.value, ...updatedTransaction } // Merge update
    }

    Swal.fire({
      icon: 'success',
      title: 'Transaksi Lunas!',
      text: `Pembayaran berhasil. ${payload.change !== undefined ? `Kembalian: Rp ${formatCurrency(payload.change)}` : ''}`,
      showConfirmButton: true,
    }).then(() => {
      // Otomatis cetak struk setelah pembayaran lunas
      printReceipt()
    })
  } catch (err) {
    const apiMessage =
      err?.response?.data?.message || err.message || 'Terjadi kesalahan saat menyimpan pembayaran.'
    console.error('Gagal update transaksi:', apiMessage)
    Swal.fire('Gagal', apiMessage, 'error')
  }
}

// Fungsi untuk mencetak struk
function printReceipt() {
  const printContents = document.getElementById('receipt-print').innerHTML
  const originalContents = document.body.innerHTML

  // Sembunyikan elemen lain sebelum mencetak
  document.body.innerHTML = printContents

  // Tunggu sebentar untuk memastikan DOM dirender sebelum print
  setTimeout(() => {
    window.print()
    // Kembalikan konten asli setelah cetak
    document.body.innerHTML = originalContents
    // Reload halaman untuk memastikan Vue.js state kembali normal (jika diperlukan)
    // window.location.reload(); // Hanya jika ada masalah dengan Vue reactivity setelah print
  }, 300) // Penundaan kecil
}

// Panggil loadTransaction saat komponen di-mount
onMounted(loadTransaction)
</script>

<style scoped>
/* Optional: Custom scrollbar styles for better aesthetics */
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
/* Animasi fadeIn untuk SweetAlert */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

/* Print specific styles */
@media print {
  body > *:not(#receipt-print) {
    display: none !important; /* Hide everything except the receipt */
  }
  #receipt-print {
    display: block !important;
    width: 300px; /* Specific width for thermal printer feel */
    margin: 0 auto;
    padding: 5mm; /* Small padding for print */
    font-size: 10px; /* Smaller font for print */
    font-family: 'Consolas', 'Courier New', monospace; /* Monospace for alignment */
    color: black; /* Ensure black text for printing */
  }
}
</style>
