<template>
  <nav>
    <ul>
      <li v-if="isAuthenticated && isAdmin">
        <router-link to="/dashboard">Dashboard</router-link>
      </li>
      <li>
        <router-link to="/newsletters">Newsletters</router-link>
      </li>
      <li v-if="!isAuthenticated">
        <router-link to="/login">Login</router-link>
      </li>
      <li v-if="isAuthenticated">
        <a href="#" @click.prevent="handleLogout">Logout</a>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth.store'

const router = useRouter()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
nav {
  background-color: #333;
  padding: 10px;
}

ul {
  list-style-type: none;
  padding: 0;
  display: flex;
}

li {
  margin-right: 15px;
}

a {
  color: white;
  text-decoration: none;
}
</style>
