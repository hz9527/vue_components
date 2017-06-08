<template lang="html">
<div class="date-picker" ref='con'>
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
    dateConf: { // {length start end}
      type: Object,
      default () {
        return {}
      }
    },
    selectStart: {
      type: Boolean,
      default: true
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
      month: 0,
      year: 0,
      start: -1,
      end: -1,
      chooseStart: true,
      step: 0
    }
  },
  computed: {
    catchList () {
      var result = {}
      this.dataList.forEach(item => {
        var key = typeof item.time === 'string' ? item.time.replace(/-/g, '/') : item.time
        key = Date.parse(key)
        result[key] = item.text
      })
      return result
    }
  },
  watch: {
    selectStart (v) {
      this.chooseStart = v
      this.step = 0
    },
    startTime (v) {
      this.step = 0
      if (this.endTime === null) {
        this.start = this.end = v === null ? -1 : this.trans(v, 'time')
      } else {
        if (v === null) {
          this.start = this.trans(this.endTime, 'time')
        } else {
          this.start = this.trans(v, 'time')
        }
      }
    },
    endTime (v) {
      this.step = 0
      if (this.startTime === null) {
        this.end = this.start = v === null ? -1 : this.trans(v, 'time')
      } else {
        if (v === null) {
          this.end = this.trans(this.startTime, 'time')
        } else {
          this.end = this.trans(v, 'time')
        }
      }
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
            } else {
              this.end = Number(target.dataset.ind)
            }
            this.chooseStart = !this.chooseStart
            if (this.start > this.end) {
              if (this.chooseStart) {
                this.start = this.end
              } else {
                this.end = this.start
              }
            } else {
              if (this.step === 1) {
                this.$emit('choose', this.trans(this.start, 'ind'), this.trans(this.end, 'ind'))
              } else {
                this.step++
              }
            }
          }
        }
      }
    },
    init () {
      this.chooseStart = this.selectStart
      this.initList()
      this.step = 0
      this.start = this.end = -1
      if (this.startTime || this.endTime) {
        if (this.startTime) {
          this.start = this.trans(this.startTime, 'time')
        }
        if (this.endTime) {
          this.end = this.trans(this.endTime, 'time')
        }
        this.end === -1 && (this.end = this.start)
        this.start === -1 && (this.start = this.end)
      }
    },
    initList () {
      var today, config, month, year, startIndex, endIndex, ti, tj
      today = new Date()
      config = Object({length: 12, start: today}, this.dateConf)
      config.start = this.checkDate(config.start)
      month = config.start.getMonth()
      year = config.start.getFullYear()
      this.month = month
      this.year = year
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
    trans (v, type) {
      if (type === 'time') {
        var date = this.checkDate(v)
        return ((date.getFullYear() - this.year) * 12 + date.getMonth() - this.month) * 100 + date.getDate() - 1
      } else if (type === 'ind') {
        var month = parseInt(v / 100) + this.month + 1
        var day = v % 100 + 1
        return `${this.year + parseInt(month / 12)}-${month % 12}-${day}`
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
          return new Date(time[0], Number(time[1] - 1), time[2])
        } else {
          console.error(`${time} in invalid Date`)
        }
      }
    },
    getTitle (year, month) {
      return `${year}年${month}月`
    },
    getText (year, month, day) {
      if (this.dataList.length > 0) {
        var result = this.catchList[Date.parse(`${year}/${month}/${day}`)]
        return result || ''
      }
      return ''
    }
  },
  created () {
    this.init()
  },
  mounted () {
    if (this.$refs.con.getBoundingClientRect().bottom > window.innerHeight) {
      this.$refs.con.style.height = this.$refs.con.offsetHeight - (this.$refs.con.getBoundingClientRect().bottom - window.innerHeight) + 'px'
    }
  },
  components: {
    Month
  }
}
</script>

<style lang="scss" scoped>
.head{
  height: 0.2rem;
  width: 100%;
  display: flex;
  justify-content: space-around;
  position: absolute;
  top: 0rem;
  left: 0;
  // // position: sticky;
  // top:0;
  // left: 0;
  background: #f55;
  z-index: 100;
}
.date-picker{
  box-sizing: border-box;
  padding-top: 0.2rem;
  position: relative;
  overflow: hidden;
}
.date-con {
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
