import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

//lucide

// PrimeVue styles
import './assets/main.css'

const app = createApp(App)

app.use(PrimeVue).use(router).use(VueSweetalert2)
app.mount('#app')
