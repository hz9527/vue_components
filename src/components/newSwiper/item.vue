<template lang="html">
  <div class="item">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'swiperItem'
}
</script>

<style lang="scss">
.item {
  width: 3.75rem;
  height: 100%;
  float: left;
}
</style>
