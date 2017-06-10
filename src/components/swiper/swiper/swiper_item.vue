<template lang="html">
  <div class="swiper-item">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'swiper-item',
  mounted () {}
}
</script>

<style lang="scss" scoped>
.swiper-item {
  flex: 1;
}
</style>
