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
          <!-- Tambahkan bagian untuk menampilkan notes -->
          <div v-if="transaction.notes" class="border-t border-gray-300 pt-3 mt-3">
            <span class="font-semibold text-gray-700 block mb-2">Catatan Pesanan:</span>
            <div class="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
              <p class="text-blue-800 text-sm leading-relaxed">{{ transaction.notes }}</p>
            </div>
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
              <!-- Tampilkan catatan item jika ada -->
              <div v-if="item.item_notes" class="mt-1">
                <span class="text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded-full">
                  📝 {{ item.item_notes }}
                </span>
              </div>
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

      <div class="mt-6 flex flex-wrap justify-center gap-3">
        <!-- Edit Order Button -->
        <button
          v-if="transaction && transaction.status !== 'paid'"
          @click="kembaliKeOrder"
          class="py-3 px-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition duration-200 text-sm min-w-[120px]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 flex-shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="hidden sm:inline">Edit Order</span>
          <span class="sm:hidden">Edit</span>
        </button>

        <!-- Mark as Paid Button -->
        <button
          v-if="transaction && transaction.status !== 'paid'"
          @click="markAsPaid"
          class="py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition duration-200 text-sm min-w-[120px]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 flex-shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="hidden sm:inline">Tandai Lunas</span>
          <span class="sm:hidden">Lunas</span>
        </button>

        <!-- Print Receipt Button -->
        <button
          v-if="transaction && transaction.status === 'paid'"
          @click="printReceipt"
          class="py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition duration-200 text-sm min-w-[120px]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 flex-shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M5 4a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2H5zm0 2h10v4H5V6z"
              clip-rule="evenodd"
            />
            <path d="M3 12h14v1a1 1 0 01-1 1H4a1 1 0 01-1-1v-1z" />
          </svg>
          <span class="hidden sm:inline">Cetak Struk</span>
          <span class="sm:hidden">Cetak</span>
        </button>

        <!-- Back to Transactions Button -->
        <button
          @click="backToTransactions"
          class="py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition duration-200 text-sm min-w-[120px]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 flex-shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="hidden sm:inline">Kembali</span>
          <span class="sm:hidden">List</span>
        </button>

        <!-- New Order Button -->
        <button
          @click="newOrder"
          class="py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition duration-200 text-sm min-w-[120px]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 flex-shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="hidden sm:inline">Pesanan Baru</span>
          <span class="sm:hidden">Baru</span>
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
          <p class="text-xs">Jl. Soekarno Hatta No.DR</p>
          <p class="text-xs">Mojolangu, Kec. Lowokwaru,</p>
          <p class="text-xs">Kota Malang, Jawa Timur</p>
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
    const transRes = await api.get(`/api/transactions/${transactionId}`)
    let trxData = transRes.data

    // Gunakan data items yang sudah di-join dari backend
    // Backend sudah mengembalikan items dengan nama produk yang benar dari TransactionProduct + Product join
    const items = trxData.items || []

    // Hitung total quantity dari items yang ada
    const totalQuantity = items.reduce((sum, i) => sum + i.qty, 0)

    transaction.value = {
      ...trxData,
      items: items.map((item) => ({
        product_id: item.product_id,
        name: item.name, // Nama sudah benar dari backend join
        price: item.price,
        quantity: item.qty,
        subtotal: item.subtotal,
        item_notes: item.item_notes, // Include item_notes
      })),
      quantity_sold: totalQuantity,
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

// Fungsi untuk kembali ke halaman transaksi
function backToTransactions() {
  router.push('/transaction/cashier')
}

// Fungsi untuk membuat pesanan baru
function newOrder() {
  router.push('/order')
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
      inputLabel: 'Masukkan Nomor HP atau Email Member',
      inputPlaceholder: 'Contoh: 0812322369 atau member@email.com',
      showCancelButton: true,
      confirmButtonText: 'Bayar dengan Poin',
      cancelButtonText: 'Batal',
      inputValidator: (value) => {
        if (!value) {
          return 'Nomor HP atau Email member wajib diisi untuk pembayaran poin!'
        }
        // Validasi format email atau phone
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const phoneRegex = /^[0-9+\-\s()]+$/
        if (!emailRegex.test(value) && !phoneRegex.test(value)) {
          return 'Format tidak valid. Masukkan email atau nomor HP yang benar.'
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
      confirmButtonText: 'OK',
    }).then(() => {
      // Untuk pembayaran dengan poin, langsung berikan pilihan navigasi
      if (transaction.value.payment_method === 'points') {
        Swal.fire({
          title: 'Pembayaran Berhasil!',
          text: 'Apa yang ingin Anda lakukan selanjutnya?',
          icon: 'success',
          showCancelButton: true,
          confirmButtonText: 'Pesanan Baru',
          cancelButtonText: 'Lihat Transaksi',
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            newOrder()
          } else {
            backToTransactions()
          }
        })
      } else {
        // Untuk metode pembayaran lain, cetak struk dulu
        printReceipt()
      }
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
  // Buat window baru untuk print agar tidak merusak state Vue
  const printWindow = window.open('', '_blank', 'width=400,height=600')
  const printContents = document.getElementById('receipt-print').innerHTML

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Struk Pembayaran</title>
      <style>
        body {
          font-family: 'Consolas', 'Courier New', monospace;
          font-size: 12px;
          margin: 10px;
          width: 300px;
        }
        .text-center { text-align: center; }
        .text-xs { font-size: 10px; }
        .text-xl { font-size: 18px; }
        .font-bold { font-weight: bold; }
        .mb-1 { margin-bottom: 4px; }
        .mb-2 { margin-bottom: 8px; }
        .mt-1 { margin-top: 4px; }
        .mt-2 { margin-top: 8px; }
        .pb-2 { padding-bottom: 8px; }
        .pt-1 { padding-top: 4px; }
        .border-b { border-bottom: 1px solid #000; }
        .flex { display: flex; }
        .justify-between { justify-content: space-between; }
        .italic { font-style: italic; }
      </style>
    </head>
    <body>
      ${printContents}
    </body>
    </html>
  `)

  printWindow.document.close()

  // Tunggu konten dimuat, lalu print dan tutup
  printWindow.onload = function () {
    setTimeout(() => {
      printWindow.print()
      printWindow.close()

      // Berikan pilihan navigasi setelah print
      Swal.fire({
        title: 'Struk Telah Dicetak',
        text: 'Apa yang ingin Anda lakukan selanjutnya?',
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Pesanan Baru',
        cancelButtonText: 'Lihat Transaksi',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          newOrder()
        } else {
          backToTransactions()
        }
      })
    }, 500)
  }
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
