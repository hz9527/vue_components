import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Picker from '@/components/pages/picker'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/picker',
      name: 'picker',
      component: Picker
    }
  ]
})
