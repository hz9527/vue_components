import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/examples/index'
import Picker from '@/examples/picker/index'
import IndexList from '@/examples/indexList/index'
import AutoLoading from '@/examples/autoLoading/index'
import AutoLoading2 from '@/examples/autoLoading/index2'
import DatePicker from '@/examples/datePicker/index'
import Swiper from '@/examples/swiper/index'
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
  {
    path: '/auto_loading',
    name: 'autoLoading',
    component: AutoLoading
  },
  {
    path: '/auto_loading2',
    name: 'autoLoading2',
    component: AutoLoading2
  },
  {
    path: '/date_picker',
    name: 'datePicker',
    component: DatePicker
  },
  {
    path: '/swiper',
    name: 'swiper',
    component: Swiper
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
