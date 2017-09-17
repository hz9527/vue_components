<template lang="html">
  <div class="swiper-con">
    <slot name='head'></slot>
    <div class="content" ref='con' @touchstart='moveStart' @touchmove='move' @touchend='moveEnd' @touchcancel='moveEnd'>
      <div class="list-con" :style="conStyle">
        <slot name='item'></slot>
      </div>
      <div class="index-con" v-show='showIndex' @click='chooseIndex'>
        <div :data-index='i - 1' :class="['index-item', index === i - 1 ? 'active' : '']" v-for='i in itemLength' :key='i'></div>
      </div>
      <slot name='other'></slot>
    </div>
    <slot name='foot'></slot>
  </div>
</template>

<script>
const Step = 30 // stpe time
export default {
  props: {
    autoTime: { // 自动滑动时间
      type: Number,
      default: 500
    },
    waitTime: { // 自动滑动等待时间
      type: Number,
      default: 2000
    },
    defaultIndex: {
      type: Number,
      default: 0
    },
    speed: {
      type: Number,
      default: 0.6 // px/ms
    },
    showIndex: {
      type: Boolean,
      default: true
    },
    needUpdate: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      itemLength: 0,
      translate: 0,
      index: 0,
      _width: 0,
      _waitTick: null,
      // _autoTick: null,
      _revisdTick: null,
      _touch: null,
      _firstState: 0, // 0 normal 1 translate
      _lastState: 0
    }
  },
  computed: {
    conStyle () {
      return {
        webkitTransform: `translate(${this.translate}px, 0)`,
        transform: `translate(${this.translate}px, 0)`,
        width: this.itemLength * 100 + '%'
      }
    }
  },
  watch: {
    needUpdate (v) {
      if (v) {
        this._width = this.$refs.con.offsetWidth
        this.initPage()
        this.$emit('updated')
      }
    },
    defaultIndex (v) {
      if (v !== this.index) {
        this.resetIndex(v)
      }
    },
    index (v) {
      this.$emit('change', v)
    },
    translate (v) {
      if (this.translate < -this.itemLength * this._width) {
        this.translate = 0
        return
      } else if (this.translate > this._width) {
        this.translate = -(this.itemLength - 1) * this._width
        return
      }
      if (this.itemLength > 1) {
        if (!this._lastState && v > 0) {
          this._lastState = 1
          this.$slots.item[this.itemLength - 1].child.move(-this.itemLength * this._width)
          // console.log('moveLastItem')
        } else if (this._lastState === 1 && v < -(this.itemLength - 2) * this._width) {
          this._lastState = 0
          this.$slots.item[this.itemLength - 1].child.move(0)
          // console.log('resetLastItem')
        }
        if (this._firstState === 1 && v > -this._width) {
          this._firstState = 0
          this.$slots.item[0].child.move(0)
          // console.log('resetFirstItem')
        } else if (!this._firstState && v < -(this.itemLength - 1) * this._width) {
          this._firstState = 1
          this.$slots.item[0].child.move(this.itemLength * this._width)
          // console.log('moveFristItem')
        }
      }
    }
  },
  methods: {
    moveStart (e) {
      if (!this._touch) {
        this._touch = {
          s_clientX: e.touches[0].clientX,
          clientX: e.touches[0].clientX,
          time: e.timeStamp
        }
        this.stopAnimation()
      }
    },
    move (e) {
      this.translate += e.touches[0].clientX - this._touch.clientX
      this._touch.clientX = e.touches[0].clientX
    },
    moveEnd (e) {
      var v
      var s = this._touch.clientX - this._touch.s_clientX
      var t = e.timeStamp - this._touch.time
      v = s / t
      if (t > 300 || Math.abs(v) < this.speed) {
        v = this.speed * (s > 0 ? 1 : -1)
      }
      var move = this.translate % this._width
      move = Math.abs(move)
      var index
      if ((v < 0 && move < this._width / 3) || (v > 0 && move > this._width * 2 / 3)) {
        index = this.index
      } else {
        index = this.index + (v < 0 ? 1 : -1)
        index = index < 0 ? this.itemLength - 1 : index >= this.itemLength ? 0 : index
      }
      this.revisd(v, index)
      this._touch = null
    },
    chooseIndex (e) {
      if ('index' in e.target.dataset) {
        var index = Number(e.target.dataset.index)
        if (index !== this.index) {
          this.resetIndex(index)
        }
      }
    },
    revisd (v, index) {
      var translate = -index * this._width
      if (Math.abs(translate - this.translate) >= this._width) {
        if (this.translate > 0) {
          this.translate -= this._width * this.itemLength
        } else if (this.translate <= -this._width * (this.itemLength - 1)) {
          this.translate += this._width * this.itemLength
        }
      }
      var step = v * Step
      var move = () => {
        this._revisdTick = setTimeout(() => {
          var expre = step < 0 ? translate - this.translate < 2 * step : translate - this.translate > 2 * step
          if (translate !== this.translate && expre) {
            this.translate += step
            move()
          } else {
            this.translate = translate
            this.index = index
            clearTimeout(this._revisdTick)
            this._revisdTick = null
            // auto move
            this.autoMove()
          }
        }, Step)
      }
      move()
    },
    autoMove () {
      if (this.autoTime > 0 && this.waitTime > 0 && this.itemLength > 1) {
        this.stopAnimation()
        this._waitTick = setTimeout(() => {
          clearTimeout(this._waitTick)
          this._waitTick = null
          var index = this.index + 1
          index = index < 0 ? this.itemLength - 1 : index >= this.itemLength ? 0 : index
          this.revisd(-this._width / this.autoTime, index)
        }, this.waitTime)
      }
    },
    stopAnimation () {
      if (this._waitTick) {
        clearTimeout(this._waitTick)
        this._waitTick = null
      }
      // if (this._autoTick) {
      //   clearTimeout(this._autoTick)
      // }
      if (this._revisdTick) {
        clearTimeout(this._revisdTick)
        this._revisdTick = null
      }
    },
    resetIndex (index) {
      this.index = index
      this.stopAnimation()
      this.translate = -this._width * this.index
      this.autoMove()
    },
    initPage () {
      if (this.$slots.item) {
        this.itemLength = this.$slots.item.length
      }
      this.resetIndex(this.defaultIndex)
    }
  },
  mounted () {
    this._width = this.$refs.con.offsetWidth
    this.initPage()
  }
}
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  overflow: hidden;
  position: relative;
}
.list-con {
  display: flex;
}
.index-con {
  position: absolute;
  bottom: 0.3rem;
  left: 50%;
  transform: translate(-50%, 0);
  display: flex;
  .index-item {
    width: 0.1rem;
    height: 0.1rem;
    margin: 0 0.05rem;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
  }
  .active {
    background: #fff;
  }
}
</style>
