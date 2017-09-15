<template lang="html">
  <div class="picker-item" :style='style'>
    <list v-if="type !== 'division'" :curIndex='chooseIndex' :list='list' :emptyHeight='(showLine - 1) / 2 * itemHeight'
     :itemHeight='itemHeight' :className='className' @change='change' @moveEnd='end' />
    <div :class="['item-division', className]" :style="{'height': itemHeight + 'px', 'lineHeight': itemHeight + 'px'}" v-if="type === 'division'" v-html='content'>
    </div>
  </div>
</template>

<script>
import List from './item_list'
export default {
  props: {
    type: String, // 'division' 'tree' 'normal'
    list: Array,
    content: String,
    listIndex: Number,
    index: Number,
    chooseIndex: Number,
    needCheck: Boolean,
    className: String,
    showLine: Number,
    itemHeight: Number,
    flex: Number,
    align: String
  },
  computed: {
    style () {
      return {
        height: this.showLine * this.itemHeight + 'px',
        webkitBoxFlex: this.flex,
        flex: this.flex,
        textAlign: this.align
      }
    }
  },
  methods: {
    change (v) {
      if (this.type === 'tree' || this.needCheck) {
        this.$emit('check', v, this.type, this.index, this.listIndex)
      }
    },
    end (v) {
      this.$emit('moveEnd', v, this.listIndex)
    }
  },
  components: {
    List
  }
}
</script>

<style lang="scss" scoped>
.picker-item {
  position: relative;
}
.item-division {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  transform: translate(0, -50%);
}
</style>
