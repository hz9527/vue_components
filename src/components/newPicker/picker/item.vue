<template lang="html">
  <div class="picker-item" :style='{"height": showLine * itemHeight + "px"}'>
    <list v-if="type !== 'division'" :list='list' :emptyHeight='(showLine - 1) / 2 * itemHeight' :itemHeight='itemHeight' />
    <div class="item-division" v-if="type === 'division'" v-html='content'>
    </div>
  </div>
</template>

<script>
import List from './item_list'
export default {
  props: {
    type: {
      type: String,
      default: 'division' // 'division' 'tree' 'normal'
    },
    list: {
      type: Array,
      default () {
        return []
      }
    },
    content: {
      type: String,
      default: ''
    },
    index: {
      type: Number,
      default: 0
    },
    chooseIndex: {
      type: Number,
      default: 0
    },
    needCheck: {
      type: Boolean,
      default: false
    },
    showLine: {
      type: Number, // 奇数
      default: 5
    },
    itemHeight: {
      type: Number,
      default: 30
    },
    flex: {
      type: Number,
      default: 1
    }
  },
  components: {
    List
  }
}
</script>

<style lang="scss" scoped>
.picker-item {
  overflow: hidden;
  position: relative;
  flex: 1;
}
</style>
