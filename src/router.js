import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./components/Home.vue')
    },
    {
      path: '/play',
      name: 'play',
      component: () => import('./components/PlayGround.vue')
    }
  ]
})
