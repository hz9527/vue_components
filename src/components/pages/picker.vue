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
    defaultIndex: 0,
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
    defaultIndex: 0,
    values: ['湖北', '北京', '湖南']
  },
  {
    flex: 1,
    content: 'hhh'
  },
  {
    flex: 3,
    parentName: 'sheng',
    name: {
      '湖北': 'hubei',
      '北京': 'beijing',
      '湖南': 'hunan'
    },
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
  },
  {
    flex: 3,
    parentName: 'hubei',
    defaultIndex: {
      '武汉': 1,
      '荆州': 1,
      '黄冈': 2
    },
    values: {
      '武汉': ['新洲', '黄陂', '东西湖'],
      '荆州': ['新洲1', '黄陂1', '东西湖1'],
      '黄冈': ['新洲2', '黄陂2', '东西湖2']
    }
  },
  {
    flex: 3,
    parentName: 'beijing',
    defaultIndex: {
      '朝阳': 1,
      '海淀': 0,
      '石景山': 2
    },
    values: {
      '朝阳': ['大屯', '亚运村', '来广营'],
      '海淀': ['苏州街', '海淀黄庄', '北土城'],
      '石景山': ['aa1', 'aa2', 'aa3']
    }
  },
  {
    flex: 3,
    parentName: 'hunan',
    defaultIndex: {
      '长沙': 1,
      '岳阳': 0,
      '湘潭': 2
    },
    values: {
      '长沙': ['岳麓', '金鹰', 'xx'],
      '岳阳': ['xx1', 'xx2', 'xx3'],
      '湘潭': ['yy1', 'yy2', 'yy3']
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
