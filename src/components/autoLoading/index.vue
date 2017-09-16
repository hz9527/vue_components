<template lang="html">
  <div class="page" ref='page' :style="{'height': height}">
    <div class="head">
      <slot name='head'></slot>
    </div>
    <div class="content" ref='con' @scroll='scroll' @touchstart='moveStart' @touchmove='move' @touchend='moveEnd' @touchcancel='moveEnd'>
      <div class="list-con" ref='list' :style='translateStyle'>
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
        <div class="no-more-con" v-show='!canLoad'>
          <slot name='noMore'>
            <span class="no-more">我也是有底线的</span>
          </slot>
        </div>
        <slot name='list-foot'></slot>
      </div>
    </div>
    <div class="foot">
      <div class="preload-con" v-show='canLoad && loadingState === 2'>
        <slot name='preload'>
          <div class="preload"></div>
        </slot>
      </div>
      <slot name='foot'></slot>
    </div>
  </div>
</template>

<script>
const EventConf = {
  refresh: 'refresh',
  needMore: 'needMore',
  preload: 'preload',
  pullStateChange: 'pullStateChange'
}
import {rebound} from './src/utils'
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
    refreshLoadHeight: {
      type: Number,
      default: 50
    },
    preLoadHeight: {
      type: Number,
      default: 300
    }
  },
  data () {
    return {
      height: '100%',
      loadingState: 0, // 0 normal 1 refresh 2 preload
      _maxScroll: 0,
      _preClientY: null,
      translate: 0,
      pullState: 0
    }
  },
  computed: {
    translateStyle () {
      return {
        webkitTransform: `translate(0, ${this.translate}px)`,
        transform: `translate(0, ${this.translate}px)`
      }
    }
  },
  watch: {
    loading: {
      immediate: true,
      handler (v) {
        if (!v) {
          this.loadingState = 0
          if (this.$el) {
            this.$nextTick(() => {
              this.getMaxScroll()
            })
          }
        } else {
          if (this.loadingState === 0 && this.loadType !== 'preload') {
            this.loadingState = 1
          }
        }
      }
    }
  },
  methods: {
    scroll () {
      this._preClientY === null && this.checkPreload(this.$refs.con.scrollTop)
    },
    moveStart (e) {
      this._preClientY = e.touches[0].clientY
    },
    move (e) {
      var scrollTop = this.$refs.con.scrollTop
      if (scrollTop <= 0) {
        e.preventDefault()
        var clientY = e.touches[0].clientY
        var move = clientY - this._preClientY
        move = move > 0 ? rebound(this.translate, move) : move
        this._preClientY = clientY
        this.translate += move
        var pullState = this.translate > this.refreshLoadHeight ? 1 : 0
        if (pullState !== this.pullState) {
          this.pullState = pullState
          this.$emit(EventConf.pullStateChange, this.pullState)
        }
        if (this.translate + move < 0) {
          scrollTop = -this.translate
        }
      }
      this.checkPreload(scrollTop)
    },
    moveEnd () {
      this._preClientY = null
      if (this.translate !== 0) {
        if (this.translate < 0) {
          this.$refs.con.scrollTop = -this.translate
        } else if (this.translate > this.refreshLoadHeight) {
          this.$emit(EventConf.refresh)
          this.loadingState = 1
        }
        this.translate = 0
      }
    },
    checkPreload (scrollTop) {
      if (this.loadType !== 'refresh' && this.loadingState !== 2 && this.canLoad) {
        if (scrollTop + this.preLoadHeight > this._maxScroll) {
          this.loadingState = 2
          this.$emit(EventConf.preload)
        }
      }
    },
    getMaxScroll () {
      this._maxScroll = this.$refs.list.offsetHeight - this.$refs.con.offsetHeight
      if (this._maxScroll <= 0) {
        this._maxScroll = 0
        if (this.loadType !== 'refresh' && this.loadingState !== 2) {
          this.$emit(EventConf.needMore)
        }
      }
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
    this.initHeight()
    this.$nextTick(() => {
      this.getMaxScroll()
    })
  }
}
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
  position: relative;
  -webkit-overflow-scrolling: touch;
}
.foot {
  position: relative;
}
.list-con {
  position: relative;
  &::-webkit-scrollbar {
    display: none;
  }
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
  top: -0.6rem;
  left: 50%;
  transform: translate(-50%, 0);
  .preload {
    width: 0.3rem;
    height: 0.3rem;
    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAEgklEQVR4Xu1aXVLbMBDWmoFX0hNAT0A4AXCCwgkaZpCGt8IJgBMAb4zETMMJSE9AOAHpCZobFF7j4O0sI2WEY1uOHFHHxI+JVt799Gn/vMA++QOf3H62BGDJgJog0Ol0Wmtra98YY5uMseFoNPrV7XafQ6sX9AqQUaurq5cAsIuIZExXKXWdNopz3gaAe228+XuIiAdKqUFIEIIBoE/0KWUU2XIhpTy3jeKcPwFAO20oIg6UUtsLCYAQ4oQxdpmlvJRyAvzx8fFmkiR/8oyMoujrzc3NMBQIwRgghKBTPstSPEmSvdvb2z79d3R0tBtF0UOegYi4bV8DvX4HEclXDOI4vqviK4IBwDnvAMBPFwPofyEE+Yf1jLUvUsqW+T0H1Eq+whsA7bjOELEFAP3RaHSdPgkhBDmwrZRhWT4gD6wDKWXPxZQqvsILAG08ObjJg4h9pdSe/ZuOAuepKNDNYgVRGwDo2ryFQUQ8N9dEs4Tkvpe9KmV9hhcAQohMZey7XVaBsus4530A2Mlb7/tuLwDylPFVogwIeaAbWd9o4QVAToh7iaKoHSpkZV07YzwiPiqldssAmV7jBQBtwjnvAQClrvS8IOKJUirzfvsoliWjI8uVHTHI+DiO931DoTcAGoQ2RYHxeDzwVWBWcChxen19JYdJCVTfOEqdeVLesU+OlCJDXuptv7MSALMqH2p9QdrNEJHqj8O8dzcCAJeDZIxN8omZfICm2z0VKrqaOw19z31Ywjn/CwCTjDG9ByJeK6WoNpl6ChnAOX+gJMaW8g03PoaVlRFCYNHaoihRCEDWxoh4WDcWcM6HALBRAMJU+m3WuhgwtXG6Oit7SiHXFVWe9N4inV0MoJBCsd1UandSyk5IY3z3zstOXYx1RgFyhOPxeBMAnkO3p3yNN3KUKOk8gCpUKqiuXDo7AaiqVN3lGwmADt9vWaEOj9RS62b1LBoHABVNjDEK31N5AaXHcRzv2Wl74wAQQlCDlZoqec+7kJgLgEZyPY7j3x9V6FT1F64Gqw6J5My/FOYBnPMrAPhhBFZWVrZD1flVjbblXfmAWWu35TMZkJEB5mZS8zSg6l5FnWh775kBKComqio9T3nXRxbN6Hfdo0wG2FeAuj0hW13zBID2Suk+tX26b+lygu04jnuL4gStjHDiwywEMtt2jQuDxmB9HaiWaSHiMO8gGwtA2au1BKAsUk1dt2SA62SFEORItpIkebQ/VrrkFuX/Mh0hmt15e0J++/tfgLkASE95LERKPAuYhQCkq6s6tsRnMTZrrdMJahBozK3n6q9VVWYe8rob1CqrqxOAeShV5z2WANT5dD5CtyUDfFE2Y3J6sPli0UpmY7c3A1IjMqdSShpdWbhnIQGgiZB5Mc4bAN1woExxmJ7+Dk0D+hCq538qD2V5AxDayKL9a8GAsgDozGxDKfVYVuYj1wVngDW/4yykdOnNzID0RwARHABrFN4ZKcwHGfvDRWgQggNgBizKNFMayYDQJ1h1/+AMqKpgaPklAKERrvv+SwbU/YRC6/cPzjNkXxNIUokAAAAASUVORK5CYII=') center no-repeat;
    background-size: contain;
    animation: preload 1s linear infinite;
  }
}
.no-more-con {
  text-align: center;
  .no-more {
    line-height: 0.3rem;
    color: #999;
  }
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
