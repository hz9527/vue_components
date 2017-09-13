<template lang="html">
  <div class="page" ref='page' :style="{'height': height}">
    <div class="head">
      <slot name='head'></slot>
    </div>
    <div class="content" ref='con'>
      <div class="list-con" ref='list' @touchstart='moveStart' @touchmove='move' @touchend='moveEnd' @touchcancel='moveEnd'>
        <slot name='list'></slot>
      </div>
    </div>
    <div class="foot">
      <slot name='foot'></slot>
    </div>
  </div>
</template>

<script>
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
    }
  },
  data () {
    return {
      height: '100%',
      _bottom: 0
    }
  },
  methods: {
    moveStart (e) {
      this._bottom = this.$refs.con.getBoundingClientRect().bottom
      console.log(this.$refs.list.getBoundingClientRect(), this.$refs.con.getBoundingClientRect())
    },
    move (e) {
      this.checkBottom()
    },
    moveEnd (e) {

    },
    autoMove (v) {},
    checkBottom () {
      console.log(this.$refs.list.getBoundingClientRect().bottom - 10 <= this._bottom)
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
