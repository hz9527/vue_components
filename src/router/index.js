import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Picker from '@/components/pages/picker'
import DatePicker from '@/components/pages/datePicker'
import Dictionary from '@/components/pages/dictionary'
import Swiper from '@/components/pages/swiper'
import LazyLoad from '@/components/pages/lazyLoad'
import newSwiper from '@/components/pages/newSwiper'
import newPicker from '@/components/pages/newPicker'
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
    },
    {
      path: '/datePicker',
      name: 'datePicker',
      component: DatePicker
    },
    {
      path: '/dictionary',
      name: 'dictionary',
      component: Dictionary
    },
    {
      path: '/swiper',
      name: 'swiper',
      component: Swiper
    },
    {
      path: '/lazyload',
      name: 'lazyLoad',
      component: LazyLoad
    },
    {
      path: '/new_swiper',
      name: 'newSwiper',
      component: newSwiper
    },
    {
      path: '/new_picker',
      name: 'newPicker',
      component: newPicker
    }
  ]
})
