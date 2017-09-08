<template lang="html">
  <div class="picker-item" :style='style'>
    <list v-if="type !== 'division'" :curIndex='chooseIndex' :list='list' :emptyHeight='(showLine - 1) / 2 * itemHeight'
     :itemHeight='itemHeight' @change='change' @moveEnd='end' />
    <div class="item-division" :style="{'height': itemHeight}" v-if="type === 'division'" v-html='content'>
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
    index: Number,
    chooseIndex: Number,
    needCheck: Boolean,
    showLine: Number,
    itemHeight: Number,
    flex: Number,
    align: String
  },
  data () {
    return {
      curIndex: 0
    }
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
  watch: {
    chooseIndex: {
      immediate: true,
      handler (v) {
        // console.log(v, 2222, this.curIndex)
        // if (v !== this.curIndex) {
        //   this.curIndex = v
        // }
      }
    }
  },
  methods: {
    change (v) {
      // this.curIndex = v
      if (this.type === 'tree' || this.needCheck) {
        this.$emit('check', v, this.type, this.index)
      }
    },
    end (v) {
      // this.curIndex = v
      this.$emit('moveEnd', v)
    }
  },
  components: {
    List
  }
}
</script>

<style lang="scss" scoped>
.item-division {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  transform: translate(0, -50%);
}
</style>
