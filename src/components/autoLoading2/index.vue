<template lang="html">
  <div class="page" ref='page' :style="{'height': height}">
    <div class="head">
      <slot name='head'></slot>
    </div>
    <div class="content" ref='con'>
      <div class="list-con" ref='list'>
        <div class="pull-con" v-show='loadingState !== 1 && loadType !== "preload"'>
          <slot name='pull'>
            <span class='pull'>{{pullState === 0 ? '继续下拉刷新' : '释放刷新'}}</span>
          </slot>
        </div>
        <div class="pull-loading-con" v-show='loadingState === 1 && loadType !== "preload"'>
          <slot name='pull-loading'>
            <div class="pull-loading">加载中</div>
          </slot>
        </div>
        <slot name='list'></slot>
        <div class="no-more" v-show='!canLoad'>
          <slot name='noMore'>
            <span>我也是有底线的</span>
          </slot>
        </div>
      </div>
      <div class="preload-con" v-show='loadingState === 2'>
        <slot name='preload'>
          <div class="preload"></div>
        </slot>
      </div>
    </div>
    <div class="foot">
      <slot name='foot'></slot>
    </div>
  </div>
</template>

<script>
import {AlloyTouch, Transform} from './src/touch'
const EventConf = {
  pullState: 'pullState',
  refresh: 'refresh',
  needMore: 'needMore',
  preload: 'preload'
}
export default {
  props: {
    loadType: { // refresh preload all
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
    pullLoadHeight: {
      type: Number,
      default: 50
    },
    preLoadHeight: {
      type: Number,
      default: 100
    }
  },
  data () {
    return {
      height: '100%',
      _alloyTouch: null,
      _min: 0,
      pullState: 0, // 0 pull 1 release
      loadingState: 0 // 1 refresh 2 pre 0 normal
    }
  },
  watch: {
    loading: {
      immediate: true,
      handler (v) {
        if (!v) {
          this.loadingState = 0
          if (this._alloyTouch) {
            this.$nextTick(() => {
              this._alloyTouch.setMin(this.getMin())
            })
          }
        } else {
          this.loadingState === 0 && (this.loadingState = 1)
        }
      }
    }
  },
  methods: {
    move (e, v) {
      if (this.loadingState !== 1 && this.loadType !== 'preload') {
        var state = this.pullLoadHeight < v ? 1 : 0
        if (state !== this.pullState) {
          this.pullState = state
          this.$emit(EventConf.pullState, this.pullState)
        }
      }
    },
    moveEnd (e, v) {
      if (this.loadingState !== 1 && this.loadType !== 'preload') {
        if (this.pullState === 1) {
          this.loadingState = 1
          this.$emit(EventConf.refresh)
        }
      }
    },
    change (v) {
      if (v < 0 && this.loadType !== 'refresh' && this.canLoad && this.loadingState === 0) {
        if (v - this.preLoadHeight <= this._min) {
          this.loadingState = 2
          this.$emit(EventConf.preload)
        }
      }
    },
    initTouch () {
      Transform(this.$refs.list)
      this._alloyTouch = new AlloyTouch({
        target: this.$refs.list,
        touch: this.$refs.con,
        property: 'translateY',
        maxSpeed: 2,
        max: 0,
        min: this.getMin(),
        touchMove: this.move,
        touchEnd: this.moveEnd,
        touchCancel: this.moveEnd,
        change: this.change
      })
    },
    getMin () {
      this._min = this.$refs.con.offsetHeight - this.$refs.list.offsetHeight
      if (this._min >= 0) {
        this._min = 0
        if (this.canLoad && this.loadingState !== 1) {
          this.$emit(EventConf.needMore)
        }
      }
      return this._min
    },
    initHeight () {
      var rect = this.$refs.page.parentNode.getBoundingClientRect()
      if (this.$refs.page.offsetTop !== 0) {
        this.height = window.innerHeight - rect.top - this.$refs.page.offsetTop + 'px'
      } else if (rect.height === rect.bottom - rect.top) {
        this.height = window.innerHeight - rect.top + 'px'
      }
    }
  },
  mounted () {
    this.initHeight() // set height so need nextTick initTouch
    this.$nextTick(() => {
      this.initTouch()
    })
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
  overflow: hidden;
  position: relative;
}
.list-con {
  position: relative;
}
.pull-con {
  position: absolute;
  bottom: 100%;
  left: 0;
  width: 100%;
  text-align: center;
  .pull {
    line-height: 0.2rem;
    color: #666;
  }
}
.pull-loading-con {
  text-align: center;
  .pull-loading {
    line-height: 0.2rem;
    color: #666;
    &:after {
      content: '';
      animation: loading 1s linear infinite;
    }
  }
}
.preload-con {
  position: absolute;
  bottom: 0.3rem;
  left: 50%;
  transform: translate(-50%, 0);
  .preload {
    width: 0.3rem;
    height: 0.3rem;
    background: #f55;
    animation: preload 1s linear infinite;
  }
}
.no-more {
  text-align: center;
}
@keyframes loading {
  0% {
    content: '.';
  }
  50% {
    content: '..';
  }
  100% {
    content: '...';
  }
}
@keyframes preload {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
