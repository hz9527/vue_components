<template lang="html">
  <div class="month">
    <div class="head">{{title}}</div>
    <day v-for='(day, index) in monthList' :style="index === 0 ? {'marginLeft': 0.52*ind + 'rem'} : ''"
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
      lock: false, // 在list，start end同时更新时仅执行list的更新，lock当时上锁，更新在定时器中执行
      preRang: [-2, -2],
      curRang: [-2, -2] // [-2, -2] [-2, x] [x, -2] [-1, x] [-1, 100] [x, 100] [x, x]
    }
  },
  watch: {
    list (v, ov) {
      if (JSON.stringify(v) !== JSON.stringify(ov)) {
        this.lock = true
        this.init()
        setTimeout(() => {
          this.lock = false
        }, 10)
      }
    },
    start (v, ov) { // 如果未上锁在定时器内生成新curRange执行check
      // console.log(this.start, this.end, 0)
      this.watchPoint()
    },
    end (v, ov) { // 两两定时器互相取消执行
      this.watchPoint()
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
        var arr, carr, s, e
        arr = this.curRang.concat(this.preRang)
        carr = arr.filter(item => item !== -2)
        if (carr.length === 1) { // none point
          s = e = arr.find(item => item === carr[0])
        } else {
          carr.sort((a, b) => a - b)
          s = carr[0]
          e = carr[carr.length - 1]
        }
        this.change(s, e)
      }
    },
    watchPoint () {
      if (!this.lock) {
        this.lock = true
        this.computedRang()
        this.checkChange()
        setTimeout(() => {
          this.lock = false
        }, 10)
      }
    },
    computedRang () {
      var si = this.start === -1 ? -1 : parseInt(this.start / 100)
      var ei = this.end === -1 ? -1 : parseInt(this.end / 100)
      var s, e
      if (si !== -1 && ei !== -1) { // choose range
        if (this.index >= si && this.index <= ei) { // in range
          s = this.index > si ? -1 : this.start % 100
          e = this.index < ei ? 100 : this.end % 100
        } else { // out range
          s = -2
          e = -2
        }
      } else { // choose point
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
.month{
  padding: 0 0.05rem;
  position: relative;
}
.head{
  height: 0.25rem;
  background: #fff;
  border-bottom: 1px solid #dcdcdc;
  text-align: center;
  line-height: 0.23rem;
  position: sticky;
  top: 0;
  z-index: 10;
}
.foot{
  border-bottom: 1px solid #dcdcdc;
}
</style>
