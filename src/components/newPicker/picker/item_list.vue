<template lang="html">
  <div class="item-con">
    <div class="list-con" ref='listCon'>
      <div class="list-item" v-for='item in list' :style="{'height': itemHeight}">
        {{item.name}}
      </div>
    </div>
    <div class="con" ref='con'></div>
  </div>
</template>

<script>
import {AlloyTouch, Transform} from './touch.js'
export default {
  props: {
    list: Array,
    curIndex: Number,
    emptyHeight: Number,
    itemHeight: Number
  },
  data () {
    return {
      _alloyTouch: null,
      _state: '', // stop move animation
      _lock: false,
      _curIndex: 0
    }
  },
  watch: {
    list: {
      immediate: true,
      handler (v) {
        if (this._alloyTouch) {
          this._alloyTouch.setMin(-this.$refs.listCon.offsetHeight + this.emptyHeight + this.itemHeight)
        }
      }
    },
    curIndex: {
      immediate: true,
      handler (v) { // 需考虑先更新了index后异步更新了list
        if (this._alloyTouch && v !== this._curIndex) {
          this._curIndex = v
          if (this._state === 'move') {
            this._lock = true
            return
          }
          if (this._state === 'animation') {
            this._state = 'stop'
            this._alloyTouch.fixed = true
          }
          this.$nextTick(() => {
            this._alloyTouch.fixed = false
            this._alloyTouch.to(this.emptyHeight - v * this.itemHeight, 100)
          })
        }
      }
    }
  },
  mounted () {
    Transform(this.$refs.listCon, true)
    this._alloyTouch = new AlloyTouch({
      touch: this.$refs.con,
      property: 'translateY',
      target: this.$refs.listCon,
      max: this.emptyHeight,
      min: -this.$refs.listCon.offsetHeight + this.emptyHeight + this.itemHeight,
      step: this.itemHeight,
      change: this.change,
      touchStart: this.moveStart,
      touchEnd: this.moveEnd,
      touchCancel: this.moveEnd,
      animationEnd: this.animationEnd
    })
    this._state = 'stop'
    this._alloyTouch.to(this.emptyHeight - this.curIndex * this.itemHeight, 100)
  },
  methods: {
    moveStart () {
      this._state = 'move'
    },
    moveEnd (v) {
      if (this._lock) {
        this._state = 'stop'
        this._lock = false
        this._alloyTouch.to(this.emptyHeight - this.curIndex * this.itemHeight, 100)
        return false
      }
      this._state = 'animation'
    },
    animationEnd (v) {
      if (this._state !== 'stop') {
        this._state = 'stop'
        this.$emit('moveEnd', this._curIndex)
      }
    },
    change (v) {
      if (this._lock !== true && (this._state === 'move' || this._state === 'animation')) {
        var result = Math.round((this.emptyHeight - v) / this.itemHeight)
        if (result > -1 && result < this.list.length && result !== this._curIndex) {
          this._curIndex = Math.abs(result)
          this.$emit('change', this._curIndex)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.item-con {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
.con {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 100;
}
</style>
