import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import './assets/global.css'

Vue.config.productionTip = false
Vue.use(Buefy)
new Vue({
  data: {
    deckID: '',
    player: {
      currentCards: [],
      currentPoints: []
    },
    dealer: {
      currentCards: [],
      currentPoints: []
    }
  },
  router,
  render: h => h(App)
}).$mount('#app')
