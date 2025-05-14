<template>
  <DefaultLayout>
    <div class="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow mt-6">
      <h2 class="text-2xl font-bold text-indigo-600 mb-4">Detail Transaksi</h2>
      <button
        v-if="transaction && transaction.status !== 'paid'"
        @click="kembaliKeOrder"
        class="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md mb-4"
      >
        Edit Order
      </button>

      <!-- Tampilan transaksi -->
      <div
        v-if="transaction"
        class="font-mono text-sm w-full bg-white p-4 border rounded space-y-2"
      >
        <div class="flex justify-between">
          <span class="font-semibold">ID Transaksi</span><span>{{ transaction.id }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-semibold">Status</span>
          <span :class="transaction.status === 'paid' ? 'text-green-600' : 'text-red-600'">
            {{ transaction.status }}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="font-semibold">Total Harga</span
          ><span>Rp {{ format(transaction.total_price) }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-semibold">Final Price</span
          ><span>Rp {{ format(transaction.final_price) }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-semibold">Metode Pembayaran</span
          ><span>{{ transaction.payment_method }}</span>
        </div>

        <div v-if="transaction.payment_method === 'cash'" class="space-y-1">
          <div class="flex justify-between">
            <span class="font-semibold">Uang Dibayar</span
            ><span>Rp {{ format(transaction.cash_paid || 0) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-semibold">Kembalian</span
            ><span>Rp {{ format(transaction.change || 0) }}</span>
          </div>
        </div>

        <div class="flex justify-between">
          <span class="font-semibold">Jumlah Produk</span
          ><span>{{ transaction.quantity_sold }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-semibold">Diskon</span><span>{{ transaction.discount }}%</span>
        </div>
        <div class="flex justify-between">
          <span class="font-semibold">Tanggal</span
          ><span>{{ new Date(transaction.createdAt).toLocaleString() }}</span>
        </div>
      </div>

      <!-- Tombol aksi -->
      <div v-if="transaction" class="mt-6 space-y-2">
        <button
          v-if="transaction.status !== 'paid'"
          @click="markAsPaid"
          class="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
        >
          Tandai sebagai Lunas
        </button>
        <button @click="printReceipt" class="w-full bg-blue-500 text-white px-4 py-2 rounded">
          Cetak Struk
        </button>
      </div>

      <!-- Struk untuk dicetak -->
      <div
        v-if="transaction"
        id="receipt-print"
        class="hidden font-mono text-sm w-[300px] bg-white p-2 mx-auto"
      >
        <div class="text-center border-b pb-1">
          <p>
            {{ formatDate(transaction.createdAt) }} {{ formatTime(transaction.createdAt) }} No:
            {{ transaction.id }}
          </p>
          <p class="font-bold">Adi Togel Steam</p>
          <p>Permata Cikarang Timur</p>
          <p>Telp. 0812-9982-231</p>
          <p>NPWP: 06.410.258.5-526.000</p>
        </div>

        <div class="border-b mt-2 py-1">
          <p class="flex justify-between"><span>Barang</span><span>Qty Harga Sub</span></p>

          <template v-if="transaction.items && Array.isArray(transaction.items)">
            <div v-for="item in transaction.items" :key="item.product_id">
              <p>{{ item.name }}</p>
              <p class="flex justify-between">
                <span>{{ item.qty }} x {{ format(item.price) }} =</span>
                <span>{{ format(item.subtotal) }}</span>
              </p>
            </div>
          </template>

          <!-- Jika tidak ada items, tampilkan teks kosong atau pesan tertentu -->
          <div v-else>
            <p>No items available.</p>
          </div>
        </div>

        <div class="mt-2 border-b pb-1">
          <p>{{ transaction.quantity_sold }} Item</p>
          <p class="flex justify-between">
            <span>Sub Total:</span><span>{{ format(transaction.total_price) }}</span>
          </p>
          <p class="flex justify-between">
            <span>Potongan:</span><span>{{ transaction.discount }}%</span>
          </p>
          <p class="flex justify-between">
            <span>Total:</span><span>{{ format(transaction.final_price) }}</span>
          </p>
          <p class="flex justify-between">
            <span>Bayar:</span
            ><span>{{ format(transaction.cash_paid || transaction.final_price) }}</span>
          </p>
          <p class="flex justify-between">
            <span>Kembalian:</span><span>{{ format(transaction.change || 0) }}</span>
          </p>
        </div>

        <div class="text-center mt-2">
          <p>Terimakasih Atas Kunjungan Anda</p>
          <p>Harga Sudah Termasuk PPN 10%</p>
          <p>WA 0812-9982-231</p>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '/utils/axios.js'
import Swal from 'sweetalert2'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const route = useRoute()
const router = useRouter()

const transactionId = route.params.id
const transaction = ref(null)

const format = (val) => new Intl.NumberFormat('id-ID').format(val)
const formatDate = (val) =>
  new Date(val).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
const formatTime = (val) =>
  new Date(val).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

onMounted(async () => {
  try {
    const [transRes, productRes] = await Promise.all([
      api.get(`/api/transactions/${transactionId}`),
      api.get('/api/products'), // asumsi ini mengembalikan semua produk
    ])

    const data = transRes.data
    const products = productRes.data

    data.items = data.items.map((item) => {
      const product = products.find((p) => p.id === item.product_id)
      return {
        ...item,
        name: product?.name || 'Produk Tidak Diketahui',
        price: product?.price || 0,
        qty: item.quantity_sold,
      }
    })

    transaction.value = data
  } catch (err) {
    console.error('Gagal mengambil detail transaksi:', err)
  }
})

async function markAsPaid() {
  const totalHarusDibayar = transaction.value.final_price

  const { value: uangDibayar } = await Swal.fire({
    title: 'Masukkan Uang Dibayar',
    input: 'number',
    inputAttributes: {
      min: totalHarusDibayar,
    },
    inputLabel: `Total harus dibayar: Rp ${format(totalHarusDibayar)}`,
    inputPlaceholder: 'Contoh: 100000',
    showCancelButton: true,
    confirmButtonText: 'Bayar',
    cancelButtonText: 'Batal',
    inputValidator: (value) => {
      if (!value || isNaN(value)) {
        return 'Masukkan jumlah yang valid'
      }
      if (Number(value) < totalHarusDibayar) {
        return 'Uang dibayar kurang dari total yang harus dibayar'
      }
    },
  })

  if (!uangDibayar) return

  const change = Number(uangDibayar) - totalHarusDibayar

  try {
    const payload = {
      payment_method: 'cash',
      cash_paid: Number(uangDibayar),
      change: change,
    }

    const res = await api.put(`/api/transactions/${transactionId}/mark-as-paid`, payload)
    const updatedTransaction = res.data.transaction

    if (updatedTransaction.status === 'paid') {
      transaction.value = updatedTransaction
    }

    Swal.fire({
      icon: 'success',
      title: 'Transaksi telah dibayar!',
      text: `Kembalian: Rp ${format(change)}`,
      showConfirmButton: true,
    }).then(() => {
      printReceipt()
    })
  } catch (err) {
    console.error('Gagal update transaksi:', err)
    Swal.fire('Gagal', 'Terjadi kesalahan saat menyimpan pembayaran.', 'error')
  }
}

function kembaliKeOrder() {
  if (transaction.value && transaction.value.status !== 'paid') {
    router.push({ name: 'order-menu', params: { id: transaction.value.id } })
  } else {
    Swal.fire(
      'Transaksi Sudah Lunas',
      'Anda tidak bisa mengedit transaksi yang sudah lunas',
      'info',
    )
  }
}

function printReceipt() {
  const receiptElement = document.getElementById('receipt-print')
  if (!receiptElement) return

  const printContent = receiptElement.cloneNode(true)
  const printWindow = window.open('', '_blank', 'width=600,height=800')
  printWindow.document.open()
  printWindow.document.write(`
    <html>
      <head>
        <title>Struk Transaksi</title>
        <style>
          body { font-family: monospace; font-size: 12px; padding: 10px; }
          .text-center { text-align: center; }
          .flex { display: flex; justify-content: space-between; }
          .border-b { border-bottom: 1px solid #000; }
          .pb-1 { padding-bottom: 4px; }
          .pt-1 { padding-top: 4px; }
          .mt-2 { margin-top: 8px; }
        </style>
      </head>
      <body onload="window.print(); window.close();">
        ${printContent.innerHTML}
      </body>
    </html>
  `)
  printWindow.document.close()
}
</script>
