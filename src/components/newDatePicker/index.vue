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
  <div @click='chooseItem'>
    <month :during='during' :index='index' :title='month.title' :ind='month.ind' :list='month.days'
       v-for='(month, index) in list' :key='month.title'></month>
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
    chooseStart: {
      type: Boolean,
      default: true
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
    conf () {
      var conf = this.checkConf()
      conf.end = conf.end || this.computedTime(conf.start, void 0, conf.length)
      return conf
    },
    list () {
      return this.getList()
    },
    during () {
      var start, end
      if (this.curStart === 0) {
        start = 0
      } else {
        start = this.getSide(this.curStart, 1)
      }
      if (this.conf.type === 'time') {
        if (this.curEnd === 0) {
          end = 0
        } else {
          end = this.getSide(this.curStart, -1)
        }
      } else {
        end = start
      }
      return [start, end]
    }
  },
  watch: {
    list: {
      immediate: true,
      handler () {
        this.$catchStart = this.list[0].days[0].date.split('/').map(item => Number(item))
      }
    },
    chooseStart: {
      immediate: true,
      handler () {
        this.curChooseStart = this.chooseStart
      }
    },
    startTime: {
      immediate: true,
      handler (v) {
        if (v) {
          this.curStart = this.transDate(v)
        }
      }
    },
    endTime: {
      immediate: true,
      handler (v) {
        if (v) {
          this.curEnd = this.transDate(v)
        }
      }
    }
  },
  data () {
    return {
      curStart: 0,
      curEnd: 0,
      curChooseStart: true,
      $catchStart: null
    }
  },
  methods: {
    chooseItem (e) {
      if (e.target.nodeName === 'SPAN') {
        var target
        if ('ind' in e.target.dataset) {
          target = e.target
        } else {
          target = e.target.parentNode
        }
        if ('ind' in target.dataset && !target.classList.contains('invalid')) {
          var ind = target.dataset.ind
          if (this.curChooseStart) {
            this.curStart = ind
            if (this.conf.type === 'time') {
              this.curChooseStart = false
            } else {
              this.curEnd = ind
            }
          } else {
            this.curEnd = ind
          }
        }
      }
    },
    getList () {
      var timeArr = this.getTimeArr(this.conf.start)
      var startArr = timeArr.slice()
      var endArr = this.getTimeArr(this.conf.end)
      var list = []
      var i = -1
      // this.$catchStart = timeArr.slice()
      // this.$catchStart[2] = 1
      while (++i < this.conf.length) {
        var days = new Date(timeArr[0], timeArr[1] + 1, 0).getDate()
        var index = new Date(timeArr[0], timeArr[1], 1).getDay()
        var j = 0
        timeArr[2] = 1
        list[i] = {
          ind: index,
          title: `${timeArr[0]}年${timeArr[1] + 1}月`,
          days: []
        }
        while (++j <= days) {
          timeArr[2]++
          let state, text, info
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
          text = this.compareTimeArr(timeArr, startArr) === 0 ? this.conf.today : j
          // 计算info
          info = this.computedInfo(timeArr, this.conf.start, this.conf.end)
          list[i].days.push({
            state: state,
            day: text,
            data: `${i},${j - 1 > 9 ? j : '0' + j}`,
            date: `${timeArr[0]}/${timeArr[1] + 1}/${j}`,
            text: '',
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
      if (props.today && typeof props.today !== 'string') {
        invalid = true
      }
      if (invalid) {
        props = {}
        console.warn('please check your dateConf')
      }
      return Object.assign({
        length: 12,
        start: new Date(),
        today: '今天',
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
    },
    getSide (str, type) {
      var result
      var arr = str.split(',')
      arr[0] = Number(arr[0])
      arr[1]--
      while (this.list[arr[0]].days[arr[1]].state !== 'normal') {
        if (this.list[arr[0]].days.length > arr[1] && arr[1] >= 0) {
          arr[1] = arr[1] + type
        } else {
          if (this.list.length > arr[0] && arr[0] >= 0) {
            arr[0] = arr[0] + type
          } else {
            result = 0
            break
          }
        }
      }
      if (result !== 0) {
        return arr.join(',')
      } else {
        return result
      }
    },
    transDate (date) {
      var arr = date.split('/')
      arr = arr.map(item => Number(item))
      return [(arr[0] - this.$catchStart[0]) * 12 + arr[1] - this.$catchStart[1], arr[2] > 9 ? arr[2] : '0' + arr[2]].join(',')
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
