<template lang="html">
  <div class="page">
    <div class="hz-head">
      <router-link to="/">&lt;  index</router-link>
    </div>
    <swiper>
      <swiper-item v-for='item in list' :key='item.id' slot='item'>
        <div class="item" :style="{background: item.src}">{{item.text}}</div>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
import {list} from './data'
import Swiper from '../../components/swiper/index.vue'
import SwiperItem from '../../components/swiper/src/swiperItem.vue'
export default {
  data () {
    return {
      list: list
    }
  },
  components: {
    Swiper,
    SwiperItem
  }
}
</script>

<style lang="scss" scoped>
@import '../common_style/common.scss';
.item {
  height: 3rem;
  text-align: center;
  line-height: 3rem;
}
</style>
