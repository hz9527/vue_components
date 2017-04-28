<template lang="html">
  <span :class="['item', state, day === 0 ? 'left' : day === 6 ? 'right' : '']" :data-ind='ind'>
    <span>{{date}}</span>
    <span >{{text}}</span>
  </span>
</template>

<script>
export default {
  props: {
    date: String,
    ind: Number,
    text: String,
    state: String,
    day: Number
  },
  created () {
    // console.log(this.text)
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
  line-height: 0.25rem;
  padding: 0.05rem 0;
  background-clip: content-box;
  vertical-align: -webkit-baseline-middle;
  span{
    text-align: center;
    flex: 1;
  }
}
.left{
  padding-left: 0.05rem;
  border-radius: 50% 0 0 50%;
}
.right{
  padding-right: 0.05rem;
  border-radius: 0 50% 50% 0;
}
.start{
  padding-left: 0.05rem;
  border-radius: 50% 0 0 50%;
  background-color: #f55;
}
.end{
  padding-right: 0.05rem;
  border-radius: 0 50% 50% 0;
  background-color: #3ee;
}
.during{
  background-color: #e88;
}
.invalid{
  // background-color: #dedede;
  color: #999;
}
.both{
  padding: 0.05rem;
  border-radius: 50%;
  background-color: #3e8;
}
</style>
