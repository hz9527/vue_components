<template>
<div class="page">
  <div class="head">
    <router-link to="/">&lt;  index</router-link>
  </div>
  <date-picker></date-picker>
</div>
</template>

<script>
import DatePicker from '../datePicker'
export default {
  components: {
    DatePicker
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
