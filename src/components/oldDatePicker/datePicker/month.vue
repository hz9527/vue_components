<template lang="html">
  <div class="month">
    <div class="head">{{title}}</div>
    <day v-for='(day, index) in monthList' :style="index === 0 ? {'marginLeft': 0.535*ind + 'rem'} : ''"
        :state='day.state' :ind='day.ind' :test='day.text' :day='day.day' :key='day.day'></day>
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
      curRang: [-1, -1]
    }
  },
  watch: {
    start (v, ov) {
      console.log(v, ov)
      this.needChange(v, ov, 'start')
      // if (this.timer) {
      //   clearTimeout(this.timer)
      //   this.timer = null
      // } else {
      //   this.timer = setTimeout(() => {
      //     this.needChange(v, ov, 'start')
      //   }, 20)
      // }
    },
    end (v, ov) {
      this.needChange(v, ov, 'end')
      // if (this.timer) {
      //   clearTimeout(this.timer)
      //   this.timer = null
      // } else {
      //   this.timer = setTimeout(() => {
      //     this.needChange(v, ov, 'end')
      //   }, 20)
      // }
    }
  },
  methods: {
    change (start, end) {
      this.monthList.forEach((item, index) => {
        console.log('check')
        var result = {}
        if (item.state !== 'invalid') {
          if (item.ind === start && item.ind !== end && item.state !== 'start') {
            result = Object.assign(item, {state: 'start'})
          } else if (item.ind === end && item.ind !== start && item.state !== 'end') {
            result = Object.assign(item, {state: 'end'})
          } else if (item.ind === end && item.ind === start && item.state !== 'both') {
            result = Object.assign(item, {state: 'both'})
          } else if (start !== -1 && end !== -1) {
            if (item.ind > start && item.ind < end && item.state !== 'during') {
              result = Object.assign(item, {state: 'during'})
            } else if ((item.ind < start || item.ind > end) && item.state !== 'normal') {
              result = Object.assign(item, {state: 'normal'})
            }
          } else if ((start === -1 || end === -1) && item.state !== 'normal') {
            result = Object.assign(item, {state: 'noraml'})
          }
        }
        if ('state' in result) {
          console.log('change...')
          this.$set(this.monthList, index, result)
        }
      })
    },
    checkChange () { // 对比当前范围与新范围变化

    },
    needChange (v, ov, type) { // v maybe is -1
      var vi = v === -1 ? -1 : parseInt(v / 100)
      var ovi = ov === -1 ? -1 : parseInt(ov / 100)
      var ai = ai === -1 ? -1 : parseInt((type === 'start' ? this.end : this.start) / 100)
      // v上一次或这一次在内部
      // type start v上次在或这次前方，ai在内部或后方
      // type end v上次或这次在后方，ai在内部或前方
      if (vi === this.index || ovi === this.index) {
        this.change(this.start, this.end)
      } else {
        if (type === 'start') {
          if ((vi !== -1 && vi < this.index) || (ovi !== -1 && ovi < this.index) && ai >= this.index) {
            this.change(this.start, this.end)
          }
        } else if (type === 'end') {
          if ((vi !== -1 && vi > this.index) || (ovi !== -1 && ovi > this.index) && ai <= this.index) {
            this.change(this.start, this.end)
          }
        }
      }
    },
    init () {
      this.list.forEach((item, index) => {
        this.$set(this.monthList, index, item)
      })
      this.curRange = [this.start, this.end]
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
  height: 0.2rem;
  background: #f55;
  position: sticky;
  top: 0;
}
</style>
