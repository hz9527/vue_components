<template lang="html">
  <div class="con" ref='con'>
    <div class="list-item" v-for='item in list'>
      {{item.name}}
    </div>
  </div>
</template>

<script>
import {AlloyTouch, Transform} from './touch.js'
export default {
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    },
    emptyHeight: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      _alloyTouch: null
    }
  },
  watch: {
    list () {
      if (this._alloyTouch) {
        console.log(555)
      }
    }
  },
  mounted () {
    Transform(this.$refs.con, true)
    this._alloyTouch = new AlloyTouch({
      touch: this.$refs.con,
      property: 'translateY',
      target: this.$refs.con,
      max: this.emptyHeight,
      min: -this.$refs.con.offsetHeight + this.emptyHeight + 30,
      step: 30
    })
  }
}
</script>

<style lang="scss" scoped>
.list-item {
  height: 30px;
  background: #f55;
}
</style>
