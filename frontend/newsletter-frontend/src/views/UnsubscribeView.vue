<template>
  <div class="unsubscribe-container">
    <h1>Unsubscribe from Newsletter</h1>
    <p v-if="email && newsletterId">
      You are about to unsubscribe {{ email }} from newsletter #{{
        newsletterId
      }}.
    </p>
    <div>
      <input
        v-model="email"
        type="email"
        placeholder="Enter your email"
        class="input"
      />
    </div>
    <button
      @click="handleUnsubscribe"
      class="unsubscribe-button"
      :disabled="isLoading"
    >
      {{ isLoading ? 'Unsubscribing...' : 'Unsubscribe' }}
    </button>
    <p
      v-if="message"
      :class="{ 'success-message': isSuccess, 'error-message': !isSuccess }"
    >
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { subscriptionService } from '../services/api.service'

const route = useRoute()
const newsletterId = ref<string | null>(null)
const isLoading = ref(false)
const message = ref('')
const isSuccess = ref(false)
const email = ref(null)
const error = ref(null)

onMounted(() => {
  console.log(route.query)
  newsletterId.value = route.query.newsletterId
})

const handleUnsubscribe = async () => {
  if (!newsletterId.value) {
    message.value =
      'Invalid unsubscribe link. Please check your email for the correct link.'
    isSuccess.value = false
    return
  }

  isLoading.value = true
  message.value = ''

  try {
    const userSubscriptions = await subscriptionService.getSubscriptionsByEmail(
      email.value,
    )
    console.log(userSubscriptions)
    const subscription = userSubscriptions.data.filter(
      subscription => subscription.subscriptions.newsletterId === newsletterId.value,
    )

    const response = await subscriptionService.unsubscribe(
      subscription[0].subscriptions.id,
    )

    if (response.status !== 200) {
      error.value = 'Failed to unsubscribe. Please try again later.'
    }

    message.value = 'You have been successfully unsubscribed.'
    isSuccess.value = true
  } catch (error) {
    console.error('Error unsubscribing:', error)
    message.value =
      'An error occurred while unsubscribing. Please try again later.'
    isSuccess.value = false
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.unsubscribe-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem;
  text-align: center;
}

h1 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

p {
  margin-bottom: 1rem;
}

.unsubscribe-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.unsubscribe-button:hover:not(:disabled) {
  background-color: #c82333;
}

.unsubscribe-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.success-message {
  color: #28a745;
}

.error-message {
  color: #dc3545;
}
</style>
