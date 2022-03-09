import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from './route'
import App from './App.vue'
import FontAwesomeIcon from './fontawesome'

let app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(createPinia())
app.use(router)

app.mount('#app')
