<template lang="html">
  <div class="month">
    <div class="head">{{title}}</div>
    <day v-for='(day, index) in monthList' :style="index === 0 ? {'marginLeft': 0.535*ind + 'rem'} : ''"
        :state='day.state' :info='day.info' :text='day.text' :data='day.data' :date='day.date' :day='day.day' :key='day.day'></day>
  </div>
</template>

<script>
import Day from './day.vue'
export default {
  props: {
    title: String,
    ind: Number,
    index: Number,
    during: Array,
    list: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      monthList: []
    }
  },
  watch: {
    list: {
      immediate: true,
      handler (v, ov) {
        this.monthList = JSON.parse(JSON.stringify(v))
      }
    },
    during: {
      immediate: true,
      handler (v, ov) {
        if (JSON.stringify(v) !== JSON.stringify(ov)) {
          var curRange, preRange, range
          if (v) {
            curRange = this.getRange(v)
          }
          if (ov) {
            preRange = this.getRange(ov)
          }
          if ((curRange || preRange) && JSON.stringify(curRange) !== JSON.stringify(preRange)) {
            if (!curRange) {
              range = preRange.map(item => item.value)
            } else if (!preRange) {
              range = curRange.map(item => item.value)
            } else {
              // 这里可以优化
              range = [Math.min(curRange[0].value, preRange[0].value), Math.max(curRange[1].value, preRange[1].value)]
            }
            for (var i = range[0]; i <= range[1]; i++) {
              if (this.list[i].state !== 'invalid') {
                var state
                if (curRange) {
                  if (i < curRange[0].value || i > curRange[1].value) {
                    state = 'normal'
                  } else if (i > curRange[0].value && i < curRange[1].value) {
                    state = 'during'
                  } else if (i === curRange[0].value) {
                    state = curRange[0].type
                  } else {
                    state = curRange[1].type
                  }
                } else {
                  state = 'normal'
                }
                this.$set(this.monthList, i, Object.assign(this.monthList[i], {state: state}))
              }
            }
          }
        }
      }
    }
  },
  methods: {
    getRange (v) {
      if (v) {
        var start = v[0] === 0 ? 0 : v[0].split(',').map(item => Number(item))
        var end = v[1] === 0 ? 0 : v[0].split(',').map(item => Number(item))
        var sPoint, ePoint
        if (start !== 0 && start[0] === this.index) {
          sPoint = {
            type: 'start',
            value: start[1]
          }
        }
        if (end !== 0 && end[0] === this.index) {
          ePoint = {
            type: 'end',
            value: end[1]
          }
        }
        if (start !== 0 && end !== 0) {
          if ((sPoint || this.index > start[0]) && this.index < end[0]) {
            ePoint = {
              type: 'during',
              value: this.list.length - 1
            }
          }
          if (ePoint && this.index > start[0]) {
            sPoint = {
              type: 'during',
              value: 0
            }
          }
        }
        if (sPoint || ePoint) {
          if (!sPoint) {
            sPoint = ePoint
          }
          if (!ePoint) {
            ePoint = sPoint
          }
          return [sPoint, ePoint]
        } else {
          return false
        }
      } else {
        return false
      }
    }
  },
  created () {

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
