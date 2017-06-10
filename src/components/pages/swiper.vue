<template lang="html">
<div>
  <swiper>
    <swiper-item class='item1 item'>1</swiper-item>
    <swiper-item class='item'>2</swiper-item>
    <div slot='test'>
      123
    </div>
  </swiper>
</div>
</template>

<script>
import Swiper from '../swiper/index.vue'
import SwiperItem from '../swiper/swiper/swiper_item'
export default {
  components: {
    Swiper,
    SwiperItem
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
