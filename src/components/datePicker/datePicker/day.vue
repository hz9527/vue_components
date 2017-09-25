<template lang="html">
  <span :class="['item', state, classConf[state]]" :data-ind='data' :data-date='date'>
    <span>{{day}}</span>
    <span v-if='text'>{{text}}</span>
    <span v-if='info'>{{info}}</span>
  </span>
</template>

<script>
export default {
  props: {
    day: [Number, String],
    date: String,
    data: String,
    text: String,
    info: String,
    state: String,
    classConf: Object
  }
}
</script>

<style lang="scss" scoped>
.item{
  display: inline-flex;
  flex-direction:column;
  justify-content: center;
  width: 0.535rem;
  height: 0.535rem;
  box-sizing: border-box;
  border-radius: 50%;
  padding: 0.05rem;
  background-clip: content-box;
  vertical-align: middle;
  span{
    text-align: center;
    font-size: 0.12rem;
    line-height: 0.12rem;
  }
}
.start{
  background-color: #f55;
}
.end{
  background-color: #3ee;
}
.during{
  background-color: #e88;
}
.invalid{
  color: #999;
}
.both{
  background-color: #3e8;
}
</style>
