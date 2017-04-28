<template lang="html">
  <div class="month">
    <div class="head">{{title}}</div>
    <day v-for='(day, index) in monthList' :style="index === 0 ? {'marginLeft': 0.535*ind + 'rem'} : ''"
        :state='day.state' :ind='day.ind' :text='day.text' :date='day.day' :day='(ind + index) % 7' :key='day.day'></day>
    <div class="foot"></div>
  </div>
</template>

<script>
import Day from './day.vue'
export default {
  props: {
    title: String,
    ind: Number,
    index: Number,
    start: Number,
    end: Number,
    list: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      monthList: [],
      timer: null,
      lock: false, // 在list，start end同时更新时仅执行list的更新，lock当时上锁，更新在定时器中执行
      preRang: [-2, -2],
      curRang: [-2, -2] // [-2, -2] [-2, x] [x, -2] [-1, x] [-1, x] [0, x] [0, 100] [x, 100] [x, x2]
    }
  },
  watch: {
    start (v, ov) { // 如果未上锁在定时器内生成新curRange执行check
      // console.log(this.start, this.end, 0)
      this.watchPoint()
    },
    end (v, ov) { // 两两定时器互相取消执行
      this.watchPoint()
    },
    list (v, ov) {
      if (JSON.stringify(v) !== JSON.stringify(ov)) {
        this.lock = true
        this.init()
        setTimeout(() => {
          this.lock = false
        }, 20)
      }
    }
  },
  methods: {
    change (s, e) {
      if (s === e) {
        if (this.monthList[s].state !== 'invalid') {
          var state = this.computedState(this.monthList[s].ind)
          if (this.monthList[s].state !== state) {
            this.$set(this.monthList, s, Object.assign(this.monthList[s], {state: state}))
          }
        }
      } else {
        this.monthList.forEach((item, index) => {
          if (item.state !== 'invalid' && index >= s && index <= e) {
            var state = this.computedState(item.ind)
            if (item.state !== state) {
              this.$set(this.monthList, index, Object.assign(item, {state: state}))
            }
          }
        })
      }
      this.preRang = this.curRang.slice(0)
    },
    checkChange () { // 对比当前范围与新范围变化
      if (JSON.stringify(this.curRang) !== JSON.stringify(this.preRang)) {
        console.log('need change')
        var arr = this.curRang.concat(this.preRang).sort((a, b) => a - b)
        arr = arr.filter((item, ind) => {
          if (item === -2) {
            return false
          } else {
            if ((ind === 3 || ind === 2) && arr[2] === arr[3]) {
              return false
            } else if ((ind === 0 || ind === 1) && arr[0] === arr[1]) {

            } else {
              return true
            }
          }
        })
        this.change(arr[0], arr[arr.length - 1])
      }
    },
    watchPoint () {
      if (!this.lock) {
        if (this.timer) {
          clearTimeout(this.timer)
          this.timer = null
        }
        this.timer = setTimeout(() => {
          this.computedRang()
          this.checkChange()
          clearTimeout(this.timer)
          this.timer = null
        }, 30)
      }
    },
    computedRang () {
      var si = this.start === -1 ? -1 : parseInt(this.start / 100)
      var ei = this.end === -1 ? -1 : parseInt(this.end / 100)
      var s, e
      if (si !== -1 && ei !== -1) {
        if (this.index >= si && this.index <= ei) {
          s = this.index > si ? -1 : this.start % 100
          e = this.index < ei ? 100 : this.end % 100
        } else {
          s = -2
          e = -2
        }
      } else {
        if (si === this.index) {
          s = this.start % 100
          e = -2
        } else if (ei === this.index) {
          s = -2
          e = this.end % 100
        } else {
          s = -2
          e = -2
        }
      }
      this.curRang = [s, e]
    },
    computedState (ind) {
      if (this.start !== -1 && this.end !== -1) {
        if (ind > this.start && ind < this.end) {
          return 'during'
        } else if (ind === this.start && ind === this.end) {
          return 'both'
        }
      }
      if (ind === this.start) {
        return 'start'
      }
      if (ind === this.end) {
        return 'end'
      }
      return 'normal'
    },
    init () {
      this.computedRang()
      this.list.forEach((item, index) => {
        if (item.state === 'invalid') {
          this.$set(this.monthList, index, item)
        } else {
          var state = this.computedState(item.ind)
          if (state !== item.state) {
            this.$set(this.monthList, index, Object.assign(item, {state: state}))
          } else {
            this.$set(this.monthList, index, item)
          }
        }
      })
      this.preRang = this.curRang.slice(0)
    }
  },
  created () {
    this.init()
  },
  components: {
    Day
  }
}
</script>

<style lang="scss" scoped>
.head{
  height: 0.25rem;
  background: #fff;
  border-bottom: 1px solid #dcdcdc;
  text-align: center;
  line-height: 0.23rem;
  position: sticky;
  top: 0.19rem;
  z-index: 10;
}
.foot{
  border-bottom: 1px solid #dcdcdc;
}
</style>
