import './assets/main.css'
import PrimeVue from 'primevue/config'

import ConfirmDialog from 'primevue/confirmdialog'
import ConfirmationService from 'primevue/confirmationservice'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)
app.mount('#app')

app.use(PrimeVue)
app.use(ConfirmationService)
app.component('ConfirmDialog', ConfirmDialog)
