<template>
  <div class="container">
    <h1>Dashboard</h1>

    <div class="grid">
      <!-- Lista de newsletters creados -->
      <div class="card">
        <h2>Tus newsletter</h2>
        <div v-if="newsletters.length == 0">
          <p>No hay newsletters creados.</p>
        </div>
        <ul>
          <li v-for="newsletter in newsletters" :key="newsletter.id">
            <span>{{ newsletter.title }}</span>
            <button @click="selectNewsletter(newsletter)" class="btn-link">
              Ver detalles
            </button>
          </li>
        </ul>
      </div>

      <!-- Dashboard de recipientes -->
      <div class="card">
        <h2>Recipientes</h2>
        <div class="flex-between">
          <span>Total de suscriptores: {{ totalSubscribers }}</span>
          <button @click="showAddRecipients = true" class="btn btn-green">
            Agregar recipientes
          </button>
        </div>
        <canvas ref="recipientesChart" width="400" height="200"></canvas>
      </div>
    </div>

    <!-- Estadísticas de newsletter seleccionado -->
    <div v-if="selectedNewsletter" class="card mt-2">
      <h2>Estadísticas de {{ selectedNewsletter.name }}</h2>
      <div class="stats-grid">
        <div class="stat">
          <span class="stat-value"
            >{{ selectedNewsletter.stats.readPercentage }}%</span
          >
          <span class="stat-label">Leídos</span>
        </div>
        <div class="stat">
          <span class="stat-value"
            >{{ 100 - selectedNewsletter.stats.readPercentage }}%</span
          >
          <span class="stat-label">No leídos</span>
        </div>
        <div class="stat">
          <span class="stat-value"
            >{{ selectedNewsletter.stats.receivedPercentage }}%</span
          >
          <span class="stat-label">Recibidos</span>
        </div>
        <div class="stat">
          <span class="stat-value">{{
            selectedNewsletter.stats.totalSent
          }}</span>
          <span class="stat-label">Total enviados</span>
        </div>
      </div>
    </div>

    <!-- Botones de acción -->
    <div class="action-buttons">
      <button @click="showCreateNewsletter = true" class="btn btn-blue">
        Crear nuevo newsletter
      </button>
      <button @click="showCreateEntry = true" class="btn btn-green">
        Nueva entrada
      </button>
    </div>

    <!-- Modal para agregar recipientes -->
    <div v-if="showAddRecipients" class="modal">
      <div class="modal-content">
        <h2>Agregar Recipientes</h2>
        <textarea
          v-model="newRecipients"
          rows="5"
          placeholder="Ingrese los correos electrónicos separados por comas"
        ></textarea>
        <div class="modal-actions">
          <button @click="addRecipients" class="btn btn-green">Agregar</button>
          <button @click="showAddRecipients = false" class="btn btn-gray">
            Cancelar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para crear nuevo newsletter -->
    <div v-if="showCreateNewsletter" class="modal">
      <div class="modal-content">
        <input v-model="newNewsletter.title" type="text" placeholder="Título" />
        <textarea
          v-model="newNewsletter.description"
          placeholder="Descripción"
        />
        <button
          @click="createNewsletter"
          class="btn btn-blue"
          :disabled="isLoading"
        >
          <span v-if="!isLoading">Crear</span>
          <span v-else class="loading-dots">
            Creando<span>.</span><span>.</span><span>.</span>
          </span>
        </button>
        <button
          @click="showCreateNewsletter = false"
          class="btn btn-gray"
          :disabled="isLoading"
        >
          Cancelar
        </button>
      </div>
    </div>

    <!-- Modal para crear nueva entrada -->
    <div v-if="showCreateEntry" class="modal">
      <div class="modal-content">
        <h2>Crear Nueva Entrada</h2>
        <div class="form-group">
          <label for="newsletter-select">Seleccionar Newsletter:</label>
          <select
            id="newsletter-select"
            v-model="newEntry.newsletterId"
            class="form-control"
          >
            <option value="" disabled>Seleccione un newsletter</option>
            <option
              v-for="newsletter in newsletters"
              :key="newsletter.id"
              :value="newsletter.id"
            >
              {{ newsletter.title }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="entry-title">Título de la entrada:</label>
          <input
            id="entry-title"
            v-model="newEntry.title"
            type="text"
            placeholder="Título de la entrada"
            class="form-control"
          />
        </div>
        <div class="form-group">
          <label for="entry-content">Contenido de la entrada:</label>
          <textarea
            id="entry-content"
            v-model="newEntry.content"
            rows="5"
            placeholder="Contenido de la entrada"
            class="form-control"
          ></textarea>
        </div>
        <div class="form-group">
          <label for="entry-file">Archivo adjunto (PDF o Imagen):</label>
          <input
            id="entry-file"
            type="file"
            @change="handleFileChange"
            accept=".pdf,image/*"
            class="form-control"
          />
        </div>
        <div class="form-group checkbox-group">
          <label for="handle-as-html">Tratar contenido como HTML:</label>
          <input
            id="handle-as-html"
            type="checkbox"
            v-model="newEntry.handleAsHtml"
            class="form-control-checkbox"
          />
        </div>
        <div v-if="selectedFile" class="selected-file">
          Archivo seleccionado: {{ selectedFile.name }}
        </div>
        <div class="modal-actions">
          <button
            @click="createEntry"
            class="btn btn-green"
            :disabled="!newEntry.newsletterId"
          >
            Crear
          </button>
          <button @click="showCreateEntry = false" class="btn btn-gray">
            Cancelar
          </button>
        </div>
      </div>
    </div>
    <p v-if="error" class="error-message">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'
import { PlusIcon, XIcon } from 'lucide-vue-next'
import {
  newsletterService,
  recipientService,
  subscriptionService,
} from '../services/api.service'

// Estado del componente
const newsletters = ref([])
const subscriptions = ref([])
const subscriptionsStats = ref([])
const selectedNewsletter = ref(null)
const totalSubscribers = ref(0)
const showAddRecipients = ref(false)
const showCreateNewsletter = ref(false)
const showCreateEntry = ref(false)
const newRecipients = ref('')
const newNewsletter = ref({ title: '', description: '' })
const newEntry = ref({ title: '', content: '' })
const selectedFile = ref(null)
const isLoading = ref(false)
const error = ref(null)

// Referencia para el gráfico
const recipientesChart = ref(null)

// Métodos
const selectNewsletter = newsletter => {
  selectedNewsletter.value = newsletter
}

const addRecipients = async () => {
  // Aquí iría la lógica para agregar los recipientes
  console.log('Agregando recipientes:', newRecipients.value)

  const mappedRecipients = newRecipients.value
    .split(',')
    .map(email => email.trim())

  let response

  if (mappedRecipients.length == 1 && mappedRecipients[0] != '') {
    response = await recipientService.createRecipient({
      email: mappedRecipients[0],
    })
  }

  if (mappedRecipients.length > 1) {
    response = await recipientService.createRecipients(mappedRecipients)
  }

  if (response.status == 201) {
    console.log('Recipients added:', response.data)
    showAddRecipients.value = false
    newRecipients.value = ''
  } else {
    console.error('Error adding recipients:', response.data)
    error.value = 'An error occurred while adding recipients. Please try again.'
  }
}

const createNewsletter = async () => {
  isLoading.value = true
  error.value = null

  try {
    const response = newsletterService.createNewsletter(newNewsletter.value)

    const data = await response.data
    console.log('Newsletter created:', data)

    showCreateNewsletter.value = false
    newNewsletter.value = { name: '', description: '' }
  } catch (err) {
    console.error('Error creating newsletter:', err)
    error.value =
      'An error occurred while creating the newsletter. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const createEntry = async () => {
  // Aquí iría la lógica para crear una nueva entrada
  console.log('Creando entrada:', newEntry.value)
  const formData = new FormData()
  formData.append('newsletterId', newEntry.value.newsletterId)
  formData.append('title', newEntry.value.title)
  formData.append('content', newEntry.value.content)
  formData.append('handleAsHtml', newEntry.value.handleAsHtml)

  if (selectedFile.value) {
    formData.append('file', selectedFile.value)
  }
  const response = await newsletterService.createEntry(
    newEntry.value.newsletterId,
    formData,
  )

  if (response.status == 201) {
    console.log('Entry created:', response.data)
    showCreateEntry.value = false
    newEntry.value = { title: '', content: '' }
    selectedFile.value = null
  } else {
    console.error('Error creating entry:', response.data)
    error.value =
      'An error occurred while creating the entry. Please try again.'
  }
}

const handleFileChange = event => {
  const target = event.target
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0]
  } else {
    selectedFile.value = null
  }
}

const getNewsletters = async () => {
  try {
    const response = await newsletterService.getNewsletters()
    if (response.status == 204) {
      return []
    }
    return response.data
  } catch (err) {
    console.error('Error fetching newsletters:', err)
    error.value =
      'An error occurred while fetching newsletters. Please try again.'
  }
}

const getSubscriptions = async () => {
  try {
    const subscriptions = await subscriptionService.getSubscriptions()
    totalSubscribers.value = subscriptions.data.stats.totalSubscriptions
    subscriptionsStats.value = subscriptions.data.stats
  } catch (err) {
    console.error('Error fetching subscriptions:', err)
    error.value =
      'An error occurred while fetching subscriptions. Please try again.'
  }
}

// Inicialización del gráfico
onMounted(async () => {
  const ctx = recipientesChart.value.getContext('2d')
  subscriptions.value = await getSubscriptions()
  newsletters.value = await getNewsletters()
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: subscriptionsStats.value.percentage.map(n => n.newsletterTitle),
      datasets: [
        {
          data: subscriptionsStats.value.percentage.map(n => n.percentage),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        },
      ],
    },
  })
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
}

h2 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: 1fr 1fr;
  }
}

.card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-link {
  background: none;
  border: none;
  color: #3490dc;
  cursor: pointer;
}

.btn-blue {
  background-color: #3490dc;
  color: white;
  border: none;
}

.btn-blue:hover {
  background-color: #2779bd;
}

.checkbox-group {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.form-control-checkbox {
  margin-right: 0.5rem;
}

.btn-green {
  background-color: #38c172;
  color: white;
  border: none;
}

.btn-green:hover {
  background-color: #2d995b;
}

.btn-gray {
  background-color: #9ca3af;
  color: white;
  border: none;
}

.btn-gray:hover {
  background-color: #6b7280;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.mt-2 {
  margin-top: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media (min-width: 640px) {
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.stat {
  text-align: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  display: block;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 500px;
}

.modal-content h2 {
  margin-bottom: 1rem;
}

.modal-content input,
.modal-content textarea {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-dots span {
  animation: loadingDots 1.4s infinite;
  animation-fill-mode: both;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes loadingDots {
  0% {
    opacity: 0.2;
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
  }
}

.error-message {
  color: #dc3545;
  margin-top: 1rem;
}
</style>
