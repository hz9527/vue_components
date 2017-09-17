<template lang="html">
  <div class="page">
    <div class="hz-head">
      <router-link to="/">&lt;  index</router-link>
    </div>
    <swiper :defaultIndex='index' :waitTime='3000' :needUpdate='needUpdate' @updated='updated' @change='change'>
      <div class="head" slot='head' @click='choose'>
        <span :data-index='i' :class="[index === i ? 'active' : '']" v-for='(item, i) in list' :key='item.id'>{{item.text}}</span>
      </div>
      <swiper-item v-for='item in list' :key='item.id' slot='item'>
        <div class="item" :style="{background: item.src}">{{item.text}}</div>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
import {list} from './data'
// console.log(list)
import Swiper from '../../components/swiper/index.vue'
import SwiperItem from '../../components/swiper/src/swiperItem.vue'
export default {
  data () {
    return {
      list: [],
      needUpdate: false,
      index: 0
    }
  },
  mounted () {
    setTimeout(() => {
      this.needUpdate = true
      this.list = list.slice(0, 2)
    }, 1000)
  },
  methods: {
    choose (e) {
      if ('index' in e.target.dataset) {
        this.index = Number(e.target.dataset.index)
      }
    },
    updated () {
      this.needUpdate = false
    },
    change (v) {
      this.index = v
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
.head {
  height: 0.3rem;
  line-height: 0.3rem;
  span {
    display: inline-block;
    height: 0.3rem;
    padding: 0 0.1rem;
    box-sizing: border-box;
    color: #666;
  }
  .active {
    border-bottom: 2px solid #f55;
    color: #f55;
  }
}
.item {
  height: 3rem;
  text-align: center;
  line-height: 3rem;
}
</style>
