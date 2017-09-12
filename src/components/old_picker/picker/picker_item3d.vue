<template>
<div class="picker-item" :style='{"height":height * length + "px","lineHeight": height + "px"}' >
  <div v-if='type !== "content"' class="list-con">
    <div class="item-con" ref='con'>
      <div class="space" :style='{"height":height * (length-1)/2 + "px"}'></div>
      <div :class="['item', index === curIndex ? 'item-cur' : '']" :style='{"height":height + "px"}'
        v-for='(info, index) in data' :key='index'>{{info}}</div>
      <div class="space" :style='{"height":height * (length-1)/2 + "px"}'></div>
    </div>
  </div>
  <div class="content" v-if='type === "content"' v-html='content'></div>
</div>
</template>

<script>
import {myAlloyTouch as AlloyTouch, myTransform as Transform} from 'hz-touch'
export default {
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    },
    curValue: {
      type: Object
    },
    type: { // content list parentList chidlList rootList
      type: String,
      default: 'list'
    },
    content: String,
    length: Number,
    height: Number,
    needCheck: Boolean,
    arrIndex: Number
  },
  data () {
    return {
      index: 0,
      curIndex: 0,
      $alloyTouch: null,
      moveState: -1,
      lock: false,
      _delay: 300
    }
  },
  watch: {
    curValue (v, ov) {
      if (this.type !== 'content') {
        if (v.value !== this.curIndex) {
          if (this.moveState !== -1) {
            this.lock = true
          } else {
            this.scroll(v.type, v.value)
          }
        }
        v.ind !== this.index && (this.index = v.ind)
      }
    }
  },
  methods: {
    moveStart () {
      this.moveState = 1
    },
    moveEnd () {
      if (this.$alloyTouch.stop === true) {
        this.$alloyTouch.stop = false
      }
      if (!this.lock) {
        this.$emit('change', 'end', this.curIndex, this.index, this.arrIndex)
      } else {
        this.scroll('init', this.curValue.value)
        this.lock = false
      }
      this.moveState = -1
    },
    touchEnd () {
      if (this.lock) {
        this.scroll('init', this.curValue.value)
        this.lock = false
        return false
      }
      this.moveState = 0
    },
    getIndex (e, d) { // 参数为滚动方向，向上为正方向－1 ＋1
      if (!this.lock && this.moveState !== -1) {
        if (typeof d !== 'number') {
          d = e
        }
        var i = d / this.height * -1
        i = i < 0 ? 0 : i > this.data.length - 1 ? this.data.length - 1 : i
        i = Math.round(i)
        if (this.curIndex !== i) {
          this.curIndex = i
          // emit
          if (this.needCheck) {
            this.$emit('change', 'move', this.curIndex, this.index, this.arrIndex)
          }
        }
      } else if (this.lock && this.moveState === 0) {
        this.$alloyTouch.stop = true
      }
    },
    scroll (type, index) { // 指定滑动到某个index, type invalid init change
      var top = index * this.height
      if (type === 'invalid') {
        this.$alloyTouch.to(-top, 0)
        this.curIndex = index
      } else {
        this.$alloyTouch.to(-top, this._delay)
        this.curIndex = index
      }
    }
  },
  mounted () {
    if (this.type !== 'content') {
      Transform(this.$refs.con, true)
      this.$alloyTouch = new AlloyTouch({
        touch: this.$refs.con,
        target: this.$refs.con,
        property: 'translateY',
        min: -this.height * Math.abs((this.data.length - (this.length / 2) + 1.5)),
        max: 0,
        step: this.height,
        touchStart: this.moveStart,
        // touchMove: this.getIndex,
        touchEnd: this.touchEnd,
        touchCancel: this.touchEnd,
        animationEnd: this.moveEnd,
        change: this.getIndex
      })
      this.scroll('init', this.curValue.value)
    }
  },
  created () {
    if (this.type !== 'content') {
      this.index = this.curValue.ind
    }
  }
}
</script>

<style scoped lang='scss'>
.picker-item{
  float: left;
  position: relative;
}
.list-con{
  overflow: hidden;
  height: 100%;
}
.item-con{
  // height:100%;
  // overflow-y: auto;
  &::-webkit-scrollbar {display:none}
  // -webkit-overflow-scrolling: touch;
}
.item{
  color: #999;
}
.item-cur{
  color: #333;
}
.content{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
