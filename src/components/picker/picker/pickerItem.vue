<template>
<div class="picker-item" :style='{"height":height * length + "px","lineHeight": height + "px"}' >
  <div v-if='type !== "content"' class="list-con" @touchcancel='moveCancel'  @touchstart='moveStart' @touchmove='move' @touchend='moveEnd' >
    <div class="item-con" ref='con' :style='{"transform":"translate(0," + translate + "px)"}'>
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
require('raf.js')
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
      touch: null,
      translate: 0,
      target: null,
      preTop: -1,
      moveState: -1, // －1 still 0 start 1 move 2 end 3 watch(replace by toucancancel)
      lock: false, // 在开发者手动设置高度，防止用户此时还在滑动引发curindex变化
      reset: false,
      timer: null,
      revisedTimer: null,
      scrollTimer: null
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
    moveStart (e) {
      if (!this.touch) {
        this.touch = e.touches[0]
      }
      this.moveState = 0
    },
    move (e) {
      !this.timer && this.watchScroll()
      if (this.touch) {
        var moveY = e.touches[0].clientY - this.touch.clientY
        if ((moveY > 0 && this.target.scrollTop === 0) || (moveY < 0 && this.target.scrollTop === this.target.scrollHeight - this.target.offsetHeight)) {
          moveY += this.translate
          this.translate = moveY * (Math.abs(moveY) > 10 ? 1 / Math.log(Math.abs(moveY)) : 1)
        }
      }
      this.moveState = 1
    },
    moveEnd () {
      this.translate !== 0 && (this.translate = 0)
      this.touch = null
      if (this.lock) {
        if (this.timer) {
          cancelAnimationFrame(this.timer)
          this.timer = null
        }
        this.scroll('init', this.curValue.value)
      }
      this.moveState = 2
    },
    moveCancel () {
      this.moveEnd()
    },
    watchScroll () {
      if (!this.scrollTimer && !this.revisedTimer) {
        if (this.timer && this.timer % 5 === 0) {
          this.preTop = this.target.scrollTop
        } else {
          this.preTop = this.target.scrollTop
        }
        this.timer = requestAnimationFrame(() => {
          var d = this.preTop - this.target.scrollTop
          // this.preTop = this.target.scrollTop
          this.watchScroll()
          if (d !== 0 && !this.lock) {
            this.getIndex()
          } else if (d === 0 && (this.moveState === -1 || this.moveState === 2)) {
            this.moveState = -1
            cancelAnimationFrame(this.timer)
            this.timer = null
            this.revisedTop()
            this.$emit('change', 'end', this.curIndex, this.index, this.arrIndex)
          }
        })
      }
    },
    getIndex (d) { // 参数为滚动方向，向上为正方向－1 ＋1
      var i = this.target.scrollTop / this.height
      i = i < 0 ? 0 : i > this.data.length - 1 ? this.data.length - 1 : i
      i = d > 0 ? Math.ceil(i) : Math.floor(i)
      if (this.curIndex !== i) {
        this.curIndex = i
        // emit
        if (this.needCheck) {
          this.$emit('change', 'move', this.curIndex, this.index, this.arrIndex)
        }
      }
    },
    revisedTop () {
      this.preTop = this.target.scrollTop
      if (!this.timer && !this.scrollTimer) {
        this.revisedTimer = requestAnimationFrame(() => {
          this.target.scrollTop = this.curIndex * this.height
          if (this.preTop !== this.target.scrollTop) {
            this.revisedTop(this.curIndex)
          } else {
            cancelAnimationFrame(this.revisedTimer)
            this.revisedTimer = null
            if (this.lock) {
              this.lock = false
            }
          }
        })
      }
    },
    scroll (type, index) { // 指定滑动到某个index, type invalid init change
      var top = index * this.height
      if (type === 'invalid') {
        this.target.scrollTop = top
        this.curIndex = index
        this.revisedTop()
      } else if (!this.timer && !this.revisedTimer) { // 高度递减10
        this.scrollTimer = requestAnimationFrame(() => {
          if (this.preTop === top) {
            cancelAnimationFrame(this.scrollTimer)
            this.scrollTimer = null
            this.moveState = -1
            this.curIndex = index
            this.watchScroll()
          } else {
            this.preTop = this.target.scrollTop
            if (Math.abs(top - this.target.scrollTop) > 20) {
              this.target.scrollTop += (top - this.target.scrollTop) > 0 ? 20 : -20
            } else {
              this.target.scrollTop = top
            }
            this.scroll('init', index)
          }
        })
      }
    }
  },
  mounted () {
    if (this.type !== 'content') {
      this.target = this.$refs.con
      this.lock = true
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
  height:100%;
  overflow-y: auto;
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
::-webkit-scrollbar {display:none}
</style>
