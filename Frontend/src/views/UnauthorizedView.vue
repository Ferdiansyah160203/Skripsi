<template>
  <div class="flex items-center justify-center h-screen bg-gradient-to-r from-gray-100 to-gray-300">
    <div class="text-center">
      <h1 class="text-6xl text-red-600 font-extrabold mb-4">403</h1>
      <p class="text-2xl text-gray-700 font-semibold">Akses Tidak Diizinkan</p>
      <p class="text-gray-500 mt-2">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
      <router-link
        to="/"
        class="mt-6 inline-block px-6 py-3 bg-red-600 text-white font-medium rounded-lg shadow-md hover:bg-red-700 transition"
      >
        Kembali ke Beranda
      </router-link>
    </div>
  </div>
</template>

<script setup></script>
