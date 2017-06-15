<template lang="html">
<div>
  <swiper :auto='2000'>
    <swiper-item class='item1 item'>1</swiper-item>
    <swiper-item class='item'>2</swiper-item>
  </swiper>
  <!-- <swiper :list='list' :defaultIndex='2'>
    <div slot='test'>
      123
    </div>
  </swiper> -->
</div>
</template>

<script>
import Swiper from '../swiper/newIndex.vue'
import SwiperItem from '../swiper/swiper/swiper_item'
export default {
  components: {
    Swiper,
    SwiperItem
  },
  data () {
    return {
      list: [1, 2, 3]
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
  color: #666;
  text-align: center;
  font-size: 30px;
  background: #3ee;
}
.item1 {
  background: #f55;
}
</style>
