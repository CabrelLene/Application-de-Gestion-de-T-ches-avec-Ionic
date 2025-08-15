import { createApp } from 'vue'
import { IonicVue } from '@ionic/vue'
import App from './App.vue'
import router from './router'

/* Ionic core & utilitaires */
import '@ionic/vue/css/core.css'
import '@ionic/vue/css/normalize.css'
import '@ionic/vue/css/structure.css'
import '@ionic/vue/css/typography.css'
import '@ionic/vue/css/padding.css'
import '@ionic/vue/css/float-elements.css'
import '@ionic/vue/css/text-alignment.css'
import '@ionic/vue/css/text-transformation.css'
import '@ionic/vue/css/flex-utils.css'
import '@ionic/vue/css/display.css'

/* Thème & global */
import './theme/variables.css'
import './theme/global.css'

/* Lottie web component */
import '@lottiefiles/lottie-player'

/* Initialise Firebase (Phase 2: valeurs .env à ajouter) */
import './firebase/firebase'

const app = createApp(App)
app.use(IonicVue)
app.use(router)

router.isReady().then(() => app.mount('#app'))

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .catch(console.error)
  })
}

