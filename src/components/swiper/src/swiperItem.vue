<template lang="html">
  <div class="item" :style='transStyle'>
    <slot></slot>
  </div>
</template>

<script>
export default {
  data () {
    return {
      translate: 0
    }
  },
  computed: {
    transStyle () {
      return {
        webkitTransform: `translate(${this.translate}px, 0)`,
        transform: `translate(${this.translate}px, 0)`
      }
    }
  },
  methods: {
    move (v) {
      this.translate = v
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
  flex: 1;
}
</style>
