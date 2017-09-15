<template lang="html">
  <div class="page" ref='page' :style="{'height': height}">
    <div class="head">
      <slot name='head'></slot>
    </div>
    <div class="content" ref='con'>
      <div class="list-con" ref='list' :style='translateStyle'
        @touchstart='moveStart' @touchmove='move' @touchend='moveEnd' @touchcancel='moveEnd'>
        <slot name='list'></slot>
      </div>
    </div>
    <div class="foot">
      <slot name='foot'></slot>
    </div>
  </div>
</template>

<script>
// import {rebound} from './autoLoading/utils'
export default {
  props: {
    loadType: { // top bottom all
      type: String,
      default: 'all'
    },
    loading: {
      type: Boolean,
      default: false
    },
    canLoad: {
      type: Boolean,
      default: true
    },
    preLoadHeight: {
      type: Number,
      default: 50
    }
  },
  data () {
    return {
      height: '100%',
      translate: 0,
      _maxScroll: 0,
      _touchTop: null,
      _preMove: 0,
      _preTop: 0,
      _preTime: 0,
      _loadType: '' // top bottom
    }
  },
  watch: {
    loading (v) {
      if (!v && this.$el) { // 更新bottom _maxScroll
        this.$nextTick(() => {
          this._maxScroll = this.$refs.list.scrollHeight - this.$refs.con.offsetHeight
        })
      }
    }
  },
  computed: {
    translateStyle () {
      return {
        webkitTransform: `translate(0px, ${this.translate}px)`,
        transform: `translate(0px, ${this.translate}px)`
      }
    }
  },
  methods: {
    moveStart (e) {
      this._preTime = e.timeStamp
      this._preTop = this.$refs.con.scrollTop
    },
    move (e) {
      if (this.$refs.con.scrollTop === 0) {
        // e.preventDefault()
        // if (!this._touchTop) {
        //   this._touchTop = e.touches[0].clientY
        //   this._preMove = 0
        // } else if (this.translate >= 0) {
        //   var move = e.touches[0].clientY - this._touchTop
        //   this.translate = this._preMove < move ? rebound(move) : this.translate - this._preMove + move
        //   this._preMove = move
        // } else {
        //   this._touchTop = 0
        //   this.$refs.con.scrollTop = -this.translate
        //   this.translate = 0
        // }
      } else {
        this.checkBottom()
      }
      var s = this.$refs.con.scrollTop - this._preTop
      var t = e.timeStamp - this._preTime
      this._preTime = e.timeStamp
      this._preTop = this.$refs.con.scrollTop
      console.log(s / t)
    },
    moveEnd (e) {
      this._touchTop = null
      if (this.translate < 0) {
        this.$refs.con.scrollTop = -this.translate
      }
      this.translate = 0
    },
    autoMove (v) {
      if (!this._maxScroll) {
        this._maxScroll = this.$refs.list.scrollHeight - this.$refs.con.offsetHeight
      }
    },
    checkBottom () {
      if (!this._maxScroll) {
        this._maxScroll = this.$refs.list.scrollHeight - this.$refs.con.offsetHeight
      }
      return this.$refs.con.scrollTop - this._maxScroll
    }
  },
  mounted () {
    var rect = this.$refs.page.parentNode.getBoundingClientRect()
    if (this.$refs.page.offsetTop !== 0) {
      this.height = window.innerHeight - rect.top - this.$refs.page.offsetTop + 'px'
    } else if (rect.height === rect.bottom - rect.top) {
      this.height = window.innerHeight - rect.top + 'px'
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
}
.head, .foot {
  flex-grow: 0;
  flex-shrink: 0;
  height: 0.1rem;
  background: #f55;
}
.content {
  flex: 1;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
