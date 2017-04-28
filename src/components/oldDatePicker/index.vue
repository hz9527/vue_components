<template lang="html">
<div class="date-picker">
  <div class="head">
    <span>周日</span>
    <span>周一</span>
    <span>周二</span>
    <span>周三</span>
    <span>周四</span>
    <span>周五</span>
    <span>周六</span>
  </div>
  <div @click='chooseDay'>
    <month :start='start' :end='end' :index='index' :title='month.title' :ind='month.index' :list='month.list'
       v-for='(month, index) in list' :key='month.title'></month>
  </div>
</div>
</template>

<script>
import Month from './datePicker/month.vue'
export default {
  props: {
    month: {
      type: Object,
      default () {
        return {}
      }
    },
    point: {
      type: Boolean,
      default: false
    },
    startTime: {
      type: [String, null], // 2017-3-4
      default: null
    },
    endTime: {
      type: [String, null],
      default: null
    }
  },
  data () {
    return {
      list: [],
      start: -1,
      end: -1,
      chooseStart: true
    }
  },
  methods: {
    chooseDay (e) {
      if (e.target.nodeName === 'SPAN') {
        var target = e.target
        target = target.classList.contains('item') ? target : target.parentNode
        if (!target.classList.contains('invalid')) {
          if (this.chooseStart) {
            this.start = Number(target.dataset.ind)
            this.end < this.start && (this.end = -1)
          } else {
            this.end = Number(target.dataset.ind)
            this.end < this.start && (this.start = -1)
          }
          this.chooseStart = !this.chooseStart
        }
      }
    },
    initList () {
      var config, month, year, startIndex, endIndex, start, end
      config = Object({length: 12, start: new Date()}, this.month)
      config.start = this.checkDate(config.start)
      month = config.start.getMonth()
      year = config.start.getFullYear()
      startIndex = config.start.getDate() - 1
      if (config.end) {
        config.end = this.checkDate(config.end)
        endIndex = ((config.end.getFullYear() - year) * 12 + config.end.getMonth() - month) * 100 + config.end.getDate() - 1
      }
      if (this.startTime) {
        start = this.checkDate(start)
        start = ((start.getFullYear() - year) * 12 + start.getMonth() - month) * 100 + start.getDate() - 1
        this.start = start
      }
      if (this.endTime) {
        end = this.checkDate(start)
        end = ((end.getFullYear() - year) * 12 + end.getMonth() - month) * 100 + end.getDate() - 1
        this.end = end
      }
      for (let i = 0; i < config.length; i++) { // month
        let result = {}
        let ml = new Date(year, month + 1, 0).getDate()
        result.title = this.getTitle(year, month + 1)
        result.index = new Date(year, month + 1, 0).getDay()
        result.list = []
        for (let j = 0; j < ml; j++) { // day
          let state = 'normal'
          let ind = i * 100 + j
          if (start && ind === start) {
            state = 'start'
          }
          if (end && ind === end) {
            state = 'end'
          }
          if (start && end) {
            if (ind > start && ind < end) {
              state = 'during'
            }
            if (ind === start && ind === end) {
              state = 'both'
            }
          }
          if (ind < startIndex || (endIndex && ind > endIndex)) {
            state = 'invalid'
          }
          result.list.push({
            state: state,
            ind: ind,
            day: j + 1,
            text: this.getText(year, month + 1, j + 1)
          })
        }
        this.$set(this.list, i, result)
        if (month === 11) {
          month = 0
          year++
        } else {
          month++
        }
      }
    },
    checkDate (time) {
      if (time.constructor === Date) {
        return time
      } else if (typeof time === 'number') {
        return new Date(time)
      } else if (typeof time === 'string') {
        time = time.split('-')
        if (time.length === 3) {
          return new Date(time[0], Number(time[1] - 1, time[2]))
        } else {
          console.error('time is valid')
        }
      }
    },
    getTitle (year, month) {
      return `${year}年${month}月`
    },
    getState (start, end) {
    },
    getText (year, month, day) {
      return ''
    }
  },
  created () {
    this.initList()
  },
  components: {
    Month
  }
}
</script>

<style lang="scss" scoped>
.head{
  height: 0.2rem;
  display: flex;
  justify-content: space-around;
}
</style>
