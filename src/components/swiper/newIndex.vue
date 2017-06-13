<template lang="html">
<div class="swiper" ref='cons'>
  <div class="con" ref='con' :style='{"width": itemWidth * 2 * itemLength + "px"}'>
    <slot></slot>
    <swiper-item ref='item' v-for='(item, i) in list' :key='i'></swiper-item>
    <div class='clone' ref='clone' :style='{"width": itemWidth * itemLength + "px"}'></div>
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
    auto: {
      type: [Number, Boolean],
      default: false
    },
    wait: {
      type: Number,
      default: -1
    },
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
  computed: {
    scrollerWidth () {
      return this.itemWidth * this.itemLength
    },
    curAuto () {
      if (typeof this.auto === 'number') {
        if (this.wait >= 0) {
          return {
            move: this.auto,
            wait: this.wait
          }
        } else {
          return {
            move: this.auto / 2,
            wait: this.auto / 2
          }
        }
      } else {
        return false
      }
    }
  },
  methods: {
    change (v) {
      this.correction(v)
    },
    correction (value) {
      if (value % this.itemWidth === 0) {
        var l = -value / this.itemWidth
        this.curIndex = l % this.itemLength
      }
      if (value >= 0) {
        this.$alloyTouch.target.translateX = value - this.scrollerWidth
      } else if (value <= -this.scrollerWidth) {
        this.$alloyTouch.target.translateX = value + this.scrollerWidth
      }
    },
    autoMove () {
      if (this.curAuto) {
        setTimeout(() => {
          this.$alloyTouch.to(this.$alloyTouch.target.translateX - this.itemWidth, this.curAuto.move)
        }, this.curAuto.wait)
      }
    },
    initDom () {
      this.itemLength = this.$children.length
      this.itemWidth = parseInt(window.getComputedStyle(this.$el).width)
      var fragment = document.createDocumentFragment()
      this.$children.forEach(item => {
        fragment.appendChild(item.$el.cloneNode(true))
      })
      this.$refs.clone.appendChild(fragment)
      this.curIndex = this.defaultIndex || 0
      Transform(this.$refs.con, true)
      this.$alloyTouch = new AlloyTouch({
        touch: this.$refs.cons,
        target: this.$refs.con,
        vertical: false,
        property: 'translateX',
        maxSpeed: 1,
        step: this.itemWidth,
        change: this.change,
        animationEnd: this.autoMove
      })
      this.autoMove()
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
.con, .clone {
  // width: 100%;
  display: flex;
  justify-content: center;
  background: #3ee;
}
</style>
