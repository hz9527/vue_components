<template>
<div class="picker-item" :style='{"height":height * length + "px","lineHeight": height + "px"}' >
  <div v-if='type !== "content"' class="list-con"  @touchstart='moveStart' @touchmove='move' @touchend='moveEnd' >
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
      moveState: -1, // －1 still 0 start 1 move 2 chain
      timer: null
    }
  },
  watch: {
    curValue (v, ov) {
      if (this.type !== 'content') {
        if (v.value !== this.curIndex) {
          if (this.moveState !== -1) {
            this.moveState = 2
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
      this.moveState = 1
      var moveY = e.touches[0].clientY - this.touch.clientY
      if ((moveY > 0 && this.target.scrollTop === 0) || (moveY < 0 && this.target.scrollTop === this.target.scrollHeight - this.target.offsetHeight)) {
        moveY += this.translate
        this.translate = moveY * (Math.abs(moveY) > 10 ? 1 / Math.log(Math.abs(moveY)) : 1)
      }
    },
    moveEnd () {
      !this.timer && this.watchScroll()
      this.translate !== 0 && (this.translate = 0)
      this.touch = null
      if (this.moveState === 2) {
        this.scroll('init', this.curValue.value)
      }
      this.moveState = -1
    },
    watchScroll () {
      if (!this.timer || this.preTop === -1) {
        this.preTop = this.target.scrollTop
        var that = this
        this.timer = setInterval(function () {
          var d = that.preTop - that.target.scrollTop
          that.preTop = that.target.scrollTop
          if (d !== 0) {
            that.getIndex(d)
          } else {
            that.revisedTop(this.curIndex)
            that.$emit('change', 'end', that.curIndex, that.index, that.arrIndex)
            clearInterval(that.timer)
            that.timer = null
          }
        }, 30)
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
    revisedTop (i) {
      if (this.target.scrollTop !== this.curIndex * this.height) {
        var that = this
        setTimeout(function () {
          that.target.scrollTop = that.curIndex * that.height
        }, 40)
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
          var timer = setInterval(function () {
            that.target.scrollTop += (top - that.target.scrollTop) / (10 - c)
            c++
            if (c === 10) {
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
}
.list-con{
  overflow: hidden;
  height: 100%;
}
.item-con{
  height:100%;
  overflow-y: auto;
}
.space{
  // background: #f55;
}
.item{
  color: #999;
}
.item-cur{
  color: #f55;
  background: #3ee;
}
.content{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
