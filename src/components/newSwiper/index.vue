<template lang="html">
  <div class="swiper">
    <div class="list" :style="{'width': length * 100 + '%'}" ref='list'>
      <slot name='list'></slot>
    </div>
  </div>
</template>

<script>
import {myAlloyTouch as AlloyTouch, myTransform as Transform} from 'hz-touch'
export default {
  props: {
    length: {
      type: Number,
      default: 0
    },
    index: {
      type: Number,
      default: 0
    },
    speed: {
      type: Number,
      default: 50
    }
  },
  mounted () {
    this._width = window.innerWidth
    Transform(this.$refs.list, true)
    this._alloyTouch = new AlloyTouch({
      touch: this.$refs.list,
      target: this.$refs.list,
      vertical: false,
      property: 'translateX',
      maxSpeed: 0.8,
      step: this._width,
      max: 0,
      min: -this._width * (this.length - 1),
      change: this.change
    })
    this._alloyTouch.to(-this.curIndex * this._width, 0)
  },
  data () {
    return {
      _alloyTouch: null,
      _width: 0,
      curIndex: 0
    }
  },
  watch: {
    index: {
      immediate: true,
      handler (v, ov) {
        this.curIndex = v
      }
    }
  },
  methods: {
    change (v) {
      // if (v > this.index *) {
      //   console.log(-v / this._width)
      // }
    }
  }
}
</script>

<style lang="scss">
.swiper {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.list {
  height: 100%;
}
</style>
