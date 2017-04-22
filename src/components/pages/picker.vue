<template>
<div class="picker-demo">
  <div class="head">
    <router-link to="/">&lt;  index</router-link>
  </div>
  <pop-picker  :item-list='childList'></pop-picker>
  <pop-picker :limit-methods='getValue' :item-list='pickerList'></pop-picker>
</div>
</template>

<script>
var normalList = [
  {
    flex: 3,
    defaultIndex: 3,
    values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
  },
  {
    flex: 1,
    content: '<span>:</span>'
  },
  {
    flex: 3,
    values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
  }
]
var childList = [
  {
    flex: 3,
    name: 'sheng',
    values: ['湖北', '北京', '湖南']
  },
  {
    flex: 1,
    content: '-'
  },
  {
    flex: 3,
    parentName: 'sheng',
    defaultIndex: {
      '湖北': 1,
      '北京': 0,
      '湖南': 2
    },
    values: {
      '湖北': ['武汉', '荆州', '黄冈'],
      '北京': ['朝阳', '海淀', '石景山'],
      '湖南': ['长沙', '岳阳', '湘潭']
    }
  }
]
import PopPicker from '../picker/index'
export default {
  components: {
    PopPicker
  },
  data () {
    return {
      pickerList: normalList,
      childList: childList,
      getValue (arr, ind) {
        if (arr[0] > arr[1]) {
          return [arr[0], arr[0]]
        } else {
          return arr
        }
      }
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
