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
  <div class="date-con">
    <div @click='chooseDay'>
      <month :start='start' :end='end' :index='index' :title='month.title' :ind='month.index' :list='month.list'
         v-for='(month, index) in list' :key='month.title'></month>
    </div>
  </div>
</div>
</template>

<script>
import Month from './datePicker/month.vue'
export default {
  props: {
    month: { //
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
    },
    today: {
      type: Boolean,
      default: true
    },
    dataList: { // {time: xx, text:xx}
      type: Array,
      default () {
        return []
      }
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
          if (this.point) {
            this.start = Number(target.dataset.ind)
            this.end = this.start
          } else {
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
      }
    },
    initList () {
      var today, config, month, year, startIndex, endIndex, ti, tj
      today = new Date()
      config = Object({length: 12, start: today}, this.month)
      config.start = this.checkDate(config.start)
      month = config.start.getMonth()
      year = config.start.getFullYear()
      startIndex = config.start.getDate() - 1
      if (config.end) {
        config.end = this.checkDate(config.end)
        endIndex = ((config.end.getFullYear() - year) * 12 + config.end.getMonth() - month) * 100 + config.end.getDate() - 1
      }
      // 计算今天下标
      ti = (today.getFullYear() - year) * 12 + today.getMonth() - month
      tj = today.getDate() - 1
      // 计算start end
      if (this.startTime) {
        var start = this.checkDate(this.startTime)
        this.start = ((start.getFullYear() - year) * 12 + start.getMonth() - month) * 100 + start.getDate() - 1
      }
      if (this.endTime) {
        var end = this.checkDate(this.endTime)
        this.end = ((end.getFullYear() - year) * 12 + end.getMonth() - month) * 100 + end.getDate() - 1
      }
      for (let i = 0; i < config.length; i++) { // month
        let result = {}
        let ml = new Date(year, month + 1, 0).getDate()
        result.title = this.getTitle(year, month + 1)
        result.index = (new Date(year, month, 0).getDay() + 1) % 7
        result.list = []
        for (let j = 0; j < ml; j++) { // day
          let state = 'normal'
          let ind = i * 100 + j
          if (ind < startIndex || (endIndex && ind > endIndex)) {
            state = 'invalid'
          }
          let day = (this.today && i === ti && j === tj) ? '今天' : String(j + 1)
          result.list.push({
            state: state,
            ind: ind,
            day: day,
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
      if (this.dataList.length > 0) {
        var result = this.dataList.find(item => {
          var time = typeof item.time === 'string' ? item.time.replace(/-/g, '/') : item.time
          return Date.parse(time) === Date.parse(`${year}/${month}/${day}`)
        })
        return result ? result.text : ''
      }
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
  position: sticky;
  top:-1px;
  background: #f55;
  z-index: 100;
}
.date-picker{
  height: 5rem;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
