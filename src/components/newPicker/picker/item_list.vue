<template lang="html">
  <div class="con" ref='con'>
    <div class="list-con" ref='listCon'>
      <div class="list-item" v-for='item in list' :style="{'height': itemHeight}">
        {{item.name}}
      </div>
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
    },
    itemHeight: {
      type: Number,
      default: 30
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
      min: -this.$refs.con.offsetHeight + this.emptyHeight + this.itemHeight,
      step: 30
    })
    this._alloyTouch.to(this.emptyHeight, 100)
  }
}
</script>

<style lang="scss" scoped>
.con {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: rgba(50,50,50,0.5);
  z-index: 100;
}
.list-item {
  background: #f55;
}
</style>
