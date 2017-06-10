<template lang="html">
<div class="swiper" ref='cons'>
  <div class="con" ref='con' :style='{"width": itemWidth * itemLength + "px"}'>
    <slot></slot>
  </div>
  <slot name='test'></slot>
  <div class="index">
    {{curIndex}}
  </div>
</div>
</template>

<script>
import SwiperItem from './swiper/swiper_item'
import {myAlloyTouch as AlloyTouch, myTransform as Transform} from 'hz-touch'
export default {
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    },
    length: Number,
    defaultIndex: Number
  },
  data () {
    return {
      itemLength: 0,
      curIndex: 0,
      $alloyTouch: null,
      itemWidth: 0,
      _move: false
    }
  },
  methods: {
    change (v) {
      // console.log(v)
      if (!this._move) {
        if (v > 0) { // 最后一项移到最前面
          this._move = 1
          this.$children[this.itemLength - 1].$el.style.transform = `translateX(${-this.itemWidth * this.itemLength}px)`
        } else if (v < -this.itemWidth * (this.itemLength - 1)) {
          this._move = -1
          this.$children[0].$el.style.transform = `translateX(${this.itemWidth * this.itemLength}px)`
        }
      } else {
        if (v >= this.itemWidth) {
          this.$children[this.itemLength - 1].$el.style.transform = 'translateX(0px)'
          this.$alloyTouch.target.translateX -= this.itemWidth * this.itemLength
          this._move = false
        } else if (v <= -this.itemWidth * (this.itemLength + 1)) {
          this.$children[0].$el.style.transform = 'translateX(0px)'
          this.$alloyTouch.target.translateX += this.itemWidth * (this.itemLength - 1)
          this._move = false
        }
      }
    },
    changeStep (v) {
      // if (this._move) {
      //   if (this._move === -1) {
      //     this.$children[0].$el.style.transform = 'translateX(0px)'
      //     this.$alloyTouch.translateX += this.itemWidth * (this.itemLength - 1)
      //   } else if (this._move === 1) {
      //     this.$children[this.itemLength - 1].$el.style.transform = 'translateX(0px)'
      //     this.$alloyTouch.translateX -= this.itemWidth * (this.itemLength - 1)
      //   }
      //   this._move = false
      // }
      // this.curIndex = -v / this.itemWidth
    },
    initDom () {
      this.itemLength = this.length || this.$children.length
      this.itemWidth = parseInt(window.getComputedStyle(this.$el).width)
      this.curIndex = this.defaultIndex || 0
      Transform(this.$refs.con, true)
      this.$alloyTouch = new AlloyTouch({
        touch: this.$refs.cons,
        target: this.$refs.con,
        vertical: false,
        property: 'translateX',
        maxSpeed: 1,
        min: -this.itemWidth * this.itemLength,
        max: this.itemWidth,
        step: this.itemWidth,
        change: this.change,
        correctionEnd: this.changeStep
      })
    }
  },
  mounted () {
    this.initDom()
  },
  components: {
    SwiperItem
  }
}
</script>

<style lang="scss" scoped>
.swiper {
  width: 100%;
  overflow: hidden;
}
.con {
  // width: 100%;
  display: flex;
  justify-content: center;
  background: #3ee;
}
</style>
