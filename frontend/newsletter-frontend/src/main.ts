import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.config.errorHandler = (err, instance, info) => {
  console.error('errorHandler', err, instance, info)
}

app.mount('#app')
