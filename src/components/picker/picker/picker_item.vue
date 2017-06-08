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
      revisedTimer: null
    }
  },
  watch: {
    curValue (v, ov) {
      if (this.type !== 'content') {
        if (v.value !== this.curIndex) {
          if (this.moveState !== -1) {
            this.reset = true
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
      if (this.reset) {
        this.reset = false
        this.scroll('init', this.curValue.value)
      }
      this.moveState = 2
    },
    moveCancel () {
      this.moveEnd()
    },
    watchScroll () {
      if (!this.timer) {
        this.preTop = this.target.scrollTop
        var that = this
        this.timer = setInterval(function () {
          var d = that.preTop - that.target.scrollTop
          that.preTop = that.target.scrollTop
          if (d !== 0 && (that.moveState === 2 || that.moveState === 1)) {
            that.getIndex(d)
          } else if (d === 0 && (that.moveState === 2 || that.moveState === -1)) {
            that.moveState = -1
            that.$emit('change', 'end', that.curIndex, that.index, that.arrIndex)
            clearInterval(that.timer)
            that.timer = null
            that.revisedTop(that.curIndex)
          }
        }, 25)
      } else {
        this.revisedTop(this.curIndex)
      }
    },
    getIndex (d) { // 参数为滚动方向，向上为正方向－1 ＋1
      var i = this.target.scrollTop / this.height
      i = i < 0 ? 0 : i > this.data.length - 1 ? this.data.length - 1 : i
      i = d > 0 ? Math.ceil(i) : Math.floor(i)
      if (this.curIndex !== i && !this.lock) {
        this.curIndex = i
        // emit
        if (this.needCheck) {
          this.$emit('change', 'move', this.curIndex, this.index, this.arrIndex)
        }
      }
    },
    revisedTop (i, lock) {
      if (this.target.scrollTop !== i * this.height && !this.timer) {
        var that = this
        that.preTop = that.target.scrollTop
        if (this.revisedTimer) {
          clearTimeout(this.revisedTimer)
          this.revisedTimer = null
        }
        this.revisedTimer = setTimeout(function () {
          that.target.scrollTop = i * that.height
          if (that.preTop !== that.target.scrollTop) {
            that.revisedTop(i)
          } else {
            clearTimeout(that.revisedTimer)
            that.revisedTimer = null
            if (that.lock) {
              console.log(2)
              that.lock = false
            }
          }
        }, 40)
      } else if (this.lock) {
        this.lock = false
      }
    },
    scroll (type, index) { // 指定滑动到某个index, type invalid init change
      var top = index * this.height
      if (top !== this.target.scrollTop) {
        if (type === 'invalid') {
          this.target.scrollTop = top
          this.curIndex = index
          this.revisedTop(index)
        } else { // 0.3s 完成
          var c = 0
          var that = this
          this.lock = true
          var timer = setInterval(function () {
            that.target.scrollTop += (top - that.target.scrollTop) / (10 - c)
            c++
            if (c === 10) {
              that.target.scrollTop !== top && (that.target.scrollTop = top)
              this.moveState = -1
              // this.lock = false 不能在此处关闭，因为矫正高度还没执行
              that.curIndex = index
              that.revisedTop(index)
              clearInterval(timer)
            }
          }, 30)
        }
      }
    }
  },
  mounted () {
    if (this.type !== 'content') {
      this.target = this.$refs.con
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
::-webkit-scrollbar {display:none}
</style>
