<template lang="html">
  <div class="swiper">
    <div class="tips">
      <slot name='other'></slot>
      <slot name='tips'></slot>
    </div>
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
      change: this.change,
      animationEnd: this.animateEnd
    })
    this._alloyTouch.to(-this._curIndex * this._width, 0)
  },
  data () {
    return {
      _alloyTouch: null,
      _width: 0,
      _curIndex: 0
    }
  },
  watch: {
    index: {
      immediate: true,
      handler (v, ov) {
        if (v !== this._curIndex) {
          this._curIndex = v
          if (this._alloyTouch) {
            this._alloyTouch.to(-this._curIndex * this._width, 100)
          }
        }
      }
    },
    length (v) {
      // set min
    }
  },
  methods: {
    change (v) {
      if (-v > (this.index + 0.6) * this._width) {
        this._curIndex++
        this.$emit('change', this.index + 1)
      } else if (-v < (this.index - 0.6) * this._width) {
        this._curIndex--
        this.$emit('change', this.index - 1)
      }
    },
    animateEnd (v) {
      this._curIndex = -v / this._width
      this.$emit('end', this._curIndex)
    }
  }
}
</script>

<style lang="scss" scoped>
.swiper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}
.tips {
  height: 20%;
  display: flex;
}
.list {
  height: 80%;
}
</style>
