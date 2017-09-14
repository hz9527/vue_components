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
import {rebound} from './autoLoading/utils'
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
      // console.log(this.$refs.list.scrollHeight)
    },
    move (e) {
      if (this.$refs.con.scrollTop === 0) {
        if (!this._touchTop) {
          this._touchTop = e.touches[0].clientY
        } else {
          this.translate = rebound(e.touches[0].clientY - this._touchTop)
        }
        e.preventDefault()
      } else {
        this.checkBottom()
      }
    },
    moveEnd (e) {
      this._touchTop = null
      this.translate = 0
      // console.log(this.$refs.con.scrollTop, this.$refs.con.offsetHeight)
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
  -webkit-overflow-scrolling: auto;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
