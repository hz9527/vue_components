<template>
<div class="page">
  <div class="head">
    <router-link to="/">&lt;  index</router-link>
  </div>
  <date-picker :start-time='startTime' :data-list='dataList' @choose='choose'></date-picker>
</div>
</template>

<script>
var dataList = [
  {time: '2017-5-1', text: '¥1200'},
  {time: '2017-05-2', text: '¥1000'},
  {time: '2017-5-3', text: '¥200'},
  {time: '2017-5-4', text: '¥300'},
  {time: '2017-5-7', text: '¥300'},
  {time: '2017-5-8', text: '¥400'},
  {time: '2017-5-9', text: '¥500'},
  {time: '2017-5-10', text: '¥600'},
  {time: '2017-5-11', text: '¥400'},
  {time: '2017-5-12', text: '¥800'},
  {time: '2017-5-13', text: '¥500'},
  {time: '2017-5-18', text: '¥600'},
  {time: '2017-5-19', text: '¥700'},
  {time: '2017-4-18', text: '¥600'},
  {time: '2017-4-16', text: '¥800'},
  {time: '2017-5-20', text: '¥1000'},
  {time: '2017-5-22', text: '¥900'},
  {time: '2017-5-23', text: '¥500'},
  {time: '2017-5-24', text: '¥400'},
  {time: '2017-5-25', text: '¥300'},
  {time: '2017-5-26', text: '¥900'},
  {time: '2017-5-27', text: '¥800'}
]
import DatePicker from '../newDatePicker'
export default {
  components: {
    DatePicker
  },
  data () {
    return {
      startTime: '2017/7/3',
      endTime: null,
      dataList: dataList
    }
  },
  methods: {
    choose (s, e) {
      console.log(s, e)
    }
  }
}
</script>

<style  scoped lang='scss'>
.page{
  height: 100px;
}
.head{
  height: 0.3rem;
  line-height: 0.3rem;
  border: 1px solid #f55;
  a{
    display: block;
    height:100%;
    color: #e55;
    text-decoration: none;
    padding-left: 0.1rem;
    text-align: left;
  }
}
</style>
