<template>
  <div class="index">
    <div class="item">
      <router-link to="picker">picker</router-link>
    </div>
    <div class="item">
      <router-link to="datePicker">datePicker</router-link>
    </div>
    <div class="item">
      <router-link to="dictionary">dictionary</router-link>
    </div>
    <div class="item">
      <router-link to="swiper">swiper</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='scss'>
.index{
  font-size: 0.2rem;
}
.item{
  height: 0.4rem;
  border: 1px solid #f55;
  a{
    display: block;
    height:100%;
    color: #e55;
    text-decoration: none;
    padding-left: 0.3rem;
    text-align: left;
  }
}
</style>
