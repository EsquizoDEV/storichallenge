<template>
  <div class="newsletter-subscription-view">
    <h1>Suscripción a Newsletters</h1>
    <div v-if="loading" class="loading">Cargando newsletters...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <ul v-else class="newsletter-list">
      <li
        v-for="newsletter in newsletters"
        :key="newsletter.id"
        class="newsletter-item"
      >
        <img
          :src="newsletter.imageUrl"
          :alt="newsletter.title"
          class="newsletter-image"
        />
        <div class="newsletter-content">
          <h2>{{ newsletter.title }}</h2>
          <p>{{ newsletter.description }}</p>
          <button
            v-if="newsletter.isSubscribed"
            @click="unsubscribe(newsletter.id)"
            class="btn btn-unsubscribe"
          >
            Desuscribirse
          </button>
          <button
            v-else
            @click="subscribe(newsletter.id)"
            class="btn btn-subscribe"
          >
            Suscribirse
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { newsletterService, subscriptionService } from '@/services/api.service'
import { computed } from 'vue'
import { useAuthStore } from '../store/auth.store'

interface Newsletter {
  id: number
  title: string
  description: string
  imageUrl: string
  isSubscribed: boolean
}

const newsletters = ref<Newsletter[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const store = useAuthStore()
const user = computed(() => store.user)
const userSubscriptions = ref(null)

const fetchNewsletters = async () => {
  try {
    const response = await newsletterService.getNewsletters()
    const subscriptions = await subscriptionService.getSubscriptionsByEmail(
      user.value.user.email,
    )
    console.log('subscriptions', subscriptions)
    newsletters.value = response.data.map(newsletter => {
      if (!subscriptions.data.length === 0) {
      }
      const subscription = subscriptions.data.find(
        (subscription: any) =>
          subscription.subscriptions.newsletterId === newsletter.id,
      )

      const subscriptionId = subscription ? subscription.subscriptions.id : null

      return {
        ...newsletter,
        isSubscribed: subscriptions.data.some(
          (subscription: any) =>
            subscription.subscriptions.newsletterId === newsletter.id,
        ),
        subscriptionId: subscriptionId,
      }
    })
    userSubscriptions.value = subscriptions.data
    loading.value = false

    if (response.data.length === 0) {
      error.value = 'No hay newsletters disponibles.'
    }
  } catch (err) {
    console.error('Error fetching newsletters:', err)
    error.value =
      'Error al cargar los newsletters. Por favor, intente de nuevo más tarde.'
    loading.value = false
  }
}

const subscribe = async (newsletterId: number) => {
  try {
    console.log('user.value.id', user.value)
    const userid = await subscriptionService.subscribe(
      newsletterId,
      user.value.user.id,
    )
    const newsletter = newsletters.value.find(n => n.id === newsletterId)
    if (newsletter) {
      newsletter.isSubscribed = true
    }
  } catch (err) {
    console.error('Error subscribing to newsletter:', err)
    error.value = 'Error al suscribirse. Por favor, intente de nuevo.'
  }
}

const unsubscribe = async (newsletterId: number) => {
  try {
    const newsletter = newsletters.value.find(n => n.id === newsletterId)
    await subscriptionService.unsubscribe(newsletter.subscriptionId)
    if (newsletter) {
      newsletter.isSubscribed = false
    }
  } catch (err) {
    console.error('Error unsubscribing from newsletter:', err)
    error.value = 'Error al desuscribirse. Por favor, intente de nuevo.'
  }
}

onMounted(fetchNewsletters)
</script>

<style scoped>
.newsletter-subscription-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  font-size: 2rem;
  margin-bottom: 20px;
  text-align: center;
}

.loading,
.error {
  text-align: center;
  margin-top: 20px;
  font-size: 1.2rem;
}

.error {
  color: #dc3545;
}

.newsletter-list {
  list-style-type: none;
  padding: 0;
}

.newsletter-item {
  display: flex;
  margin-bottom: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.newsletter-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
}

.newsletter-content {
  flex: 1;
  padding: 20px;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

p {
  margin-bottom: 15px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.btn-subscribe {
  background-color: #28a745;
  color: white;
}

.btn-subscribe:hover {
  background-color: #218838;
}

.btn-unsubscribe {
  background-color: #dc3545;
  color: white;
}

.btn-unsubscribe:hover {
  background-color: #c82333;
}

@media (max-width: 600px) {
  .newsletter-item {
    flex-direction: column;
  }

  .newsletter-image {
    width: 100%;
    height: 200px;
  }
}
</style>
