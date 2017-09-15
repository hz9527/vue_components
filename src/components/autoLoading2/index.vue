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
        <div class="no-more-con" v-show='!canLoad'>
          <slot name='noMore'>
            <span class="no-more">我也是有底线的</span>
          </slot>
        </div>
        <slot name='list-foot'></slot>
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
