<template>
  <header class="bg-white shadow p-4 flex items-center justify-between">
    <button @click="$emit('toggle-sidebar')" class="md:hidden text-xl">☰</button>
    <h1 class="text-xl font-semibold text-gray-800">Dashboard</h1>
    <button @click="$emit('logout')" class="text-sm text-red-500 hover:underline">Logout</button>
  </header>
</template>
