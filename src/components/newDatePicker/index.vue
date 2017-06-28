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
    computedText: {
      type: Function,
      default () { // time start end
        return ''
      }
    },
    computedChoose: {
      type: Function,
      default () {
        return true
      }
    },
    formateTime: {
      type: Function,
      default () {

      }
    }
  },
  computed: {
    list () {
      var conf = this.checkConf()
      conf.end = conf.end || this.computedTime(conf.start, void 0, length - 1)
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
      var list = []
      var i = -1
      var j = -1
      var days = new Date()
      while (++i < conf.length) {
        var day = {
          state: '',
          day: '',
          date: '',
          text: '',
        }
      }
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
          if (!'important' in props.today) {
            invalid = true
          }
          if (!'text' in props.today || typeof props.today.text !== 'string') {
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
      } else if (!start) {
        return false
      } else {
        return true
      }
    },
    computedTime (time, dayCon = 0, monCon = 0) {
      return new Date(time.getFullYear(), time.getMonth() + monCon, time.getDate() + dayCon)
    },
    getTimeArr (time) {
      return [time.getFullYear(), time.getMonth(), time.getDate()]
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
