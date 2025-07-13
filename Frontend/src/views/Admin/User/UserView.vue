<template>
  <DefaultLayout>
    <div class="p-6 bg-gray-50 min-h-screen">
      <!-- Desktop Header -->
      <div class="hidden md:block mb-6">
        <div class="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <!-- Search -->
          <div class="flex flex-col lg:flex-row gap-4 flex-1">
            <!-- Search Bar -->
            <div class="lg:w-120">
              <div class="relative">
                <svg
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="Cari user berdasarkan nama atau email..."
                  class="pl-10 pr-4 py-2.5 w-full bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <!-- Create Button -->
          <button
            @click="openCreateModal"
            class="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 whitespace-nowrap font-medium shadow-md hover:shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clip-rule="evenodd"
              />
            </svg>
            Tambah User
          </button>
        </div>
      </div>

      <!-- Mobile Header -->
      <div class="md:hidden mb-6">
        <div class="flex flex-col gap-4">
          <!-- Search Bar -->
          <div class="w-full">
            <div class="relative">
              <svg
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Cari user..."
                class="pl-10 pr-4 py-2.5 w-full bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <!-- Create Button -->
          <button
            @click="openCreateModal"
            class="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-md hover:shadow-lg w-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clip-rule="evenodd"
              />
            </svg>
            Tambah User
          </button>
        </div>
      </div>

      <!-- Users Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Role
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="filteredUsers.length === 0">
                <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                  <div class="flex flex-col items-center">
                    <svg
                      class="w-12 h-12 text-gray-400 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m8-3v2m0 0v2m0-2h2m-2 0h-2"
                      ></path>
                    </svg>
                    <p class="text-lg font-medium text-gray-900 mb-1">
                      {{ searchQuery ? 'No users found' : 'No users yet' }}
                    </p>
                    <p class="text-sm text-gray-500">
                      {{
                        searchQuery
                          ? "Try adjusting your search to find what you're looking for."
                          : 'Get started by creating a new user.'
                      }}
                    </p>
                  </div>
                </td>
              </tr>
              <tr
                v-for="user in filteredUsers"
                :key="user.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ user.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="getRoleClass(user.role)"
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  >
                    {{ user.role }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="getStatusClass(user.status)"
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  >
                    {{ user.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex flex-wrap gap-2">
                    <button
                      @click="openEditModal(user)"
                      class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1"
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        ></path>
                      </svg>
                      Edit
                    </button>
                    <button
                      @click="confirmResetPassword(user)"
                      class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1"
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                        ></path>
                      </svg>
                      Reset
                    </button>
                    <button
                      @click="confirmDelete(user)"
                      class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1"
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        ></path>
                      </svg>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Create/Edit Modal -->
      <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Backdrop with blur -->
        <div class="fixed inset-0 bg-opacity-25 backdrop-blur-sm"></div>

        <!-- Modal -->
        <div class="flex min-h-full items-center justify-center p-4">
          <div
            class="relative bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all"
          >
            <!-- Modal Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 class="text-xl font-semibold text-gray-900">
                {{ isEditing ? 'Edit User' : 'Create New User' }}
              </h3>
              <button
                @click="closeModal"
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            <!-- Modal Body -->
            <form @submit.prevent="submitForm" class="p-6 space-y-4">
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    v-model="form.name"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    v-model="form.email"
                    type="email"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter email address"
                  />
                </div>

                <div v-if="!isEditing" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input
                      v-model="form.password"
                      type="password"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter password"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >Confirm Password</label
                    >
                    <input
                      v-model="form.confirmPassword"
                      type="password"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Confirm password"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <select
                      v-model="form.role"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="cashier">Cashier</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div v-if="isEditing">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      v-model="form.status"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Modal Footer -->
              <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  @click="closeModal"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="loading"
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <svg
                    v-if="loading"
                    class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  {{ loading ? 'Saving...' : isEditing ? 'Update User' : 'Create User' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import api from '/utils/axios'
import Swal from 'sweetalert2'

export default {
  name: 'UserView',
  components: {
    DefaultLayout,
  },
  data() {
    return {
      users: [],
      showModal: false,
      isEditing: false,
      loading: false,
      searchQuery: '',
      form: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'cashier',
        status: 'active',
      },
    }
  },
  computed: {
    filteredUsers() {
      if (!this.searchQuery) {
        return this.users
      }
      return this.users.filter((user) => {
        const searchLower = this.searchQuery.toLowerCase()
        return (
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
        )
      })
    },
  },
  mounted() {
    this.fetchUsers()
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await api.get('api/users/all')
        this.users = response.data
      } catch (error) {
        console.error('Error fetching users:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to fetch users. Please refresh the page.',
        })
      }
    },

    openCreateModal() {
      this.isEditing = false
      this.resetForm()
      this.showModal = true
    },

    openEditModal(user) {
      this.isEditing = true
      this.form = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        password: '',
        confirmPassword: '',
      }
      this.showModal = true
    },

    closeModal() {
      this.showModal = false
      this.resetForm()
    },

    resetForm() {
      this.form = {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'cashier',
        status: 'active',
      }
    },

    async submitForm() {
      // Validasi form
      if (!this.isEditing && this.form.password !== this.form.confirmPassword) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Passwords do not match!',
        })
        return
      }

      // Konfirmasi sebelum submit
      const result = await Swal.fire({
        title: this.isEditing ? 'Update User?' : 'Create New User?',
        text: this.isEditing
          ? `Are you sure you want to update ${this.form.name}?`
          : `Are you sure you want to create user ${this.form.name}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: this.isEditing ? 'Yes, update it!' : 'Yes, create it!',
        cancelButtonText: 'Cancel',
      })

      if (!result.isConfirmed) return

      this.loading = true
      try {
        if (this.isEditing) {
          await this.updateUser()
        } else {
          await this.createUser()
        }
        this.closeModal()
        this.fetchUsers()

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: this.isEditing ? 'User updated successfully!' : 'User created successfully!',
          timer: 2000,
          showConfirmButton: false,
        })
      } catch (error) {
        console.error('Error submitting form:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: error.response?.data?.message || 'Something went wrong!',
        })
      } finally {
        this.loading = false
      }
    },

    async createUser() {
      await api.post('/api/users/register', {
        name: this.form.name,
        email: this.form.email,
        password: this.form.password,
        confirmPassword: this.form.confirmPassword,
        role: this.form.role,
      })
    },

    async updateUser() {
      const updateData = {
        name: this.form.name,
        email: this.form.email,
        role: this.form.role,
        status: this.form.status,
      }

      if (this.form.password) {
        updateData.password = this.form.password
      }

      await api.put(`/api/users/update/${this.form.id}`, updateData)
    },

    confirmDelete(user) {
      Swal.fire({
        title: 'Are you sure?',
        text: `You are about to delete user "${user.name}". This action cannot be undone!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteUser(user)
        }
      })
    },

    async deleteUser(user) {
      this.loading = true
      try {
        await api.delete(`/api/users/delete/${user.id}`)
        this.fetchUsers()

        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'User has been deleted successfully.',
          timer: 2000,
          showConfirmButton: false,
        })
      } catch (error) {
        console.error('Error deleting user:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to delete user. Please try again.',
        })
      } finally {
        this.loading = false
      }
    },

    confirmResetPassword(user) {
      Swal.fire({
        title: 'Reset Password',
        text: `Are you sure you want to reset password for "${user.name}"?`,
        icon: 'question',
        input: 'password',
        inputLabel: 'New Password',
        inputPlaceholder: 'Enter new password',
        inputAttributes: {
          autocapitalize: 'off',
          autocorrect: 'off',
        },
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Reset Password',
        cancelButtonText: 'Cancel',
        inputValidator: (value) => {
          if (!value) {
            return 'Please enter a new password!'
          }
          if (value.length < 6) {
            return 'Password must be at least 6 characters long!'
          }
        },
      }).then((result) => {
        if (result.isConfirmed) {
          this.resetPassword(user, result.value)
        }
      })
    },

    async resetPassword(user, newPassword) {
      this.loading = true
      try {
        await api.put(`/api/users/reset-password/${user.id}`, {
          newPassword: newPassword,
        })

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Password has been reset successfully.',
          timer: 2000,
          showConfirmButton: false,
        })
      } catch (error) {
        console.error('Error resetting password:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to reset password. Please try again.',
        })
      } finally {
        this.loading = false
      }
    },

    getRoleClass(role) {
      return role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
    },

    getStatusClass(status) {
      return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    },
  },
}
</script>

<style scoped>
/* Custom scrollbar untuk tabel */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Animasi untuk modal */
@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-enter {
  animation: modalFadeIn 0.2s ease-out;
}

/* Width untuk search bar seperti di stock opname */
.lg\:w-120 {
  width: 30rem; /* 480px */
}

/* Responsive action buttons */
@media (max-width: 640px) {
  .flex-wrap {
    flex-direction: column;
  }

  .flex-wrap button {
    width: 100%;
    justify-content: center;
  }
}
</style>
