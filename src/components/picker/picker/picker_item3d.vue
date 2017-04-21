<template>
<div class="picker-item">
  <div class="item" :style='{"transform": "rotateX("+ index * -15 +"deg) translate3D(0," + 0 + "px," + info.z +"px)"}'
    v-for='(info, index) in list' v-if='type === "list"' :key='index'>{{info.v}}</div>
</div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    },
    curValue: {
      type: Number
    },
    type: {
      type: String,
      default: 'list'
    }
  },
  data () {
    return {
      deg: Math.PI / 12
    }
  },
  computed: {
    list () {
      var result = []
      var c = 10 / Math.tan(this.deg / 2)
      console.log(c)
      for (var i = 0; i < 5; i++) {
        result.push({
          z: c,
          deg: this.deg * 1,
          v: i + 1
        })
      }
      console.log(result)
      return result
    }
  }
}
</script>

<style scoped lang='scss'>
.picker-item{
  margin-top: 100px;
  transform: perspective(600rem) rotateX(0deg);
  transform-style: preserve-3d;
}
.item{
  height: 0.2rem;
  background: rgba(200,55,55,0.5);
  position: absolute;
  top:0;
  left:0;
  width:100%;
  transform-origin: center;
}
</style>
