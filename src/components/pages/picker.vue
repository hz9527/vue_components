<template>
<div class="picker-demo">
  <div class="head">
    <router-link to="/">&lt;  index</router-link>
  </div>
  <pop-picker :item-list='pickerList'></pop-picker>
</div>
</template>

<script>
import PopPicker from '../picker/index'
export default {
  components: {
    PopPicker
  },
  data () {
    return {
      pickerList: [
        {
          flex: 1,
          values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        }
      ]
    }
  }
}
</script>

<style scoped lang='scss'>
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
