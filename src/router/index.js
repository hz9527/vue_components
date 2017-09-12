import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/examples/index'
import Picker from '@/examples/picker/index'
import IndexList from '@/examples/indexList/index'
// import DatePicker from '@/components/pages/datePicker'
// import Dictionary from '@/components/pages/dictionary'
// import Swiper from '@/components/pages/swiper'
// import LazyLoad from '@/components/pages/lazyLoad'
// import newSwiper from '@/components/pages/newSwiper'
Vue.use(Router)
var routes = [
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
    path: '/index_list',
    name: 'indexList',
    component: IndexList
  },
  // {
  //   path: '/datePicker',
  //   name: 'datePicker',
  //   component: DatePicker
  // },
  // {
  //   path: '/dictionary',
  //   name: 'dictionary',
  //   component: Dictionary
  // },
  // {
  //   path: '/swiper',
  //   name: 'swiper',
  //   component: Swiper
  // },
  // {
  //   path: '/lazyload',
  //   name: 'lazyLoad',
  //   component: LazyLoad
  // },
  // {
  //   path: '/new_swiper',
  //   name: 'newSwiper',
  //   component: newSwiper
  // },
  {
    path: '*',
    redirect: '/'
  }
]
var router = new Router({
  routes: routes
})
export {routes, router}
