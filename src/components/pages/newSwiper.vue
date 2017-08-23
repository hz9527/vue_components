<template lang="html">
  <div class="content">
    <swiper :length='list.length' :index='index' @change='change' @end='end'>
      <div class="other" slot='other'>
        other
        <b @click='() => index--' v-show='index > 0'><</b>
        <b @click='() => index++' v-show='index < list.length-1'>></b>
      </div>
      <div class="tips" slot='tips' @click='choose'>
        <span :data-index='i' v-for='(item, i) in list' :class="['tip-item', index === i ? 'active' : '']" :key='item.text'>{{item.text}}</span>
      </div>
      <item class="item" slot='list'  v-for='item in list' :key='item.text' :style="{'background': item.color}">
        {{item.text}}
      </item>
    </swiper>
  </div>
</template>

<script>
import Swiper from '../newSwiper/index'
import Item from '../newSwiper/item'
var list = [
  {
    color: '#f55',
    text: '车型1'
  },
  {
    color: '#5f5',
    text: '车型2'
  },
  {
    color: '#55f',
    text: '车型3'
  }
]
export default {
  data () {
    return {
      list: list,
      index: 0
    }
  },
  methods: {
    change (v) {
      this.index = v
    },
    end (v) {
      this.index = v
    },
    choose (e) {
      if ('index' in e.target.dataset) {
        this.index = e.target.dataset.index * 1
      }
    }
  },
  components: {
    Swiper,
    Item
  }
}
</script>

<style lang="scss" scoped>
.content {
  height: 300px;
}
.item {
  text-align: center;
}
.active {
  color: #f55;
}
.other {
  b {
    font-size: 40px;
    color: #fff;
    position: absolute;
    top: 50%;
    right: 0.3rem;
    transform: translate(0, -50%);
    z-index: 100000;
  }
  b:first-child {
    left: 0.3rem;
  }
}
</style>
