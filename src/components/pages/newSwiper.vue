<template lang="html">
  <div class="content">
    <swiper :length='list.length'>
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
    text: '1'
  },
  {
    color: '#5f5',
    text: '2'
  },
  {
    color: '#55f',
    text: '3'
  }
]
export default {
  data () {
    return {
      list: list
    }
  },
  components: {
    Swiper,
    Item
  }
}
</script>

<style lang="scss">
.content {
  height: 300px;
}
.item {
  text-align: center;
}
</style>
