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
  <div>
    {{list}}
    <!-- <month :start='start' :end='end' :index='index' :title='month.title' :ind='month.index' :list='month.list'
       v-for='(month, index) in list' :key='month.title'></month> -->
  </div>
</div>
</template>

<script>
import Month from './datePicker/month.vue'
export default {
  props: {
    dateConf: {
      type: Object,
      default () { // length, start end today type
        return {}
      }
    },
    startTime: {
      type: [String, null], // 2017/6/8
      default: null
    },
    endTime: {
      type: [String, null],
      default: null
    },
    computedInfo: {
      type: Function,
      default (time, start, end) { // time start end
        return ''
      }
    },
    computedValid: {
      type: Function,
      default () {
        return true
      }
    }
  },
  computed: {
    list () {
      var conf = this.checkConf()
      conf.end = conf.end || this.computedTime(conf.start, void 0, conf.length - 1)
      return this.getList(conf)
    }
  },
  data () {
    return {
      curStart: -1,
      curEnd: -1,
      chooseStart: true
    }
  },
  methods: {
    getList (conf) {
      var timeArr = this.getTimeArr(conf.start)
      var startArr = timeArr.slice()
      var endArr = this.getTimeArr(conf.end)
      timeArr[2] = 1
      var list = []
      var i = -1
      while (++i < conf.length) {
        var days = new Date(timeArr[0], timeArr[1] + 1, 0).getDate()
        var index = new Date(timeArr[0], timeArr[1], 1).getDay()
        var j = -1
        list[i] = {
          index: index,
          days: []
        }
        while (++j < days) {
          timeArr[2]++
          var state, text, info
          // 计算合法性
          state = this.computedValid()
          state = state ? 'normal' : 'invalid'
          if (state === 'normal') {
            if (this.compareTimeArr(timeArr, startArr) < 0) {
              state = 'invalid'
            } else if (this.compareTimeArr(timeArr, endArr) > 0) {
              state = 'invalid'
            }
          }
          // 计算text
          text = this.compareTimeArr(timeArr, startArr) === 0 ? conf.today.text : ''
          // 计算info
          info = this.computedInfo(timeArr, conf.start, conf.end)
          list[i].days.push({
            state: state,
            day: j + 1,
            date: `${timeArr[0]}/${timeArr[1] + 1}/${j + 1}`,
            text: text,
            info: info
          })
        }
        if (timeArr[1] === 11) {
          timeArr[1] = 0
          timeArr[0]++
        } else {
          timeArr[1]++
        }
      }
      return list
    },
    checkConf () {
      var props = this.dateConf
      var today = {}
      var invalid = false
      if (props.length && !(typeof props.length === 'number' && props.length > 0)) {
        invalid = true
      }
      if (props.type && !(props.type === 'time' || props.type === 'point')) {
        invalid = true
      }
      if (!this.checkTime(props.start, props.end)) {
        invalid = true
      }
      if (props.today) {
        if (typeof props.today === 'object') {
          if (!('important' in props.today)) {
            invalid = true
          }
          if (!('text' in props.today) || typeof props.today.text !== 'string') {
            invalid = true
          }
        } else {
          today = {
            text: props.today,
            important: false
          }
        }
      }
      if (invalid) {
        props = {}
        console.warn('please check your dateConf')
      }
      return Object.assign({
        length: 12,
        start: new Date(),
        today: {
          important: true,
          text: '今天'
        },
        type: 'time' // time point
      }, props, today)
    },
    checkTime (start, end) {
      if (start && end) {
        return end - start > 0
      } else {
        return true
      }
    },
    computedTime (time, dayCon = 0, monCon = 0) {
      return new Date(time.getFullYear(), time.getMonth() + monCon, time.getDate() + dayCon)
    },
    getTimeArr (time) {
      return [time.getFullYear(), time.getMonth(), time.getDate()]
    },
    compareTimeArr (arr1, arr2) {
      return (arr1[0] - arr2[0]) * 1000 + (arr1[1] - arr2[1]) * 50 + (arr1[2] - arr2[2])
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
  display: flex;
  justify-content: space-around;
}
</style>
