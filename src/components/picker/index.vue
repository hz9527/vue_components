<template>
<div class="picker" :style="{'height':itemHeight*showLine +'px'}">
  <slot name='center'>
    <div class="center" :style="{'height':itemHeight +'px'}"></div>
  </slot>
  <div class="picker-con" :style="{'height':itemHeight*showLine +'px'}">
    <item :data='item.values' :type='item.type' :height='itemHeight' :length='showLine' :need-check='needCheck'
    :style="{'width': item.width,'textAlign':item.align}"
    :cur-value='chooseIndex[index] === -1 ? {value: -1} : chooseIndex[index]' :content='item.content' :arr-index='index'
     v-for='(item, index) in itemData' :key='index' @change='itemChange'></item>
  </div>
</div>
</template>

<script>
import Item from './picker/picker_item'
export default {
  name: 'picker',
  props: {
    itemList: {// 展示picker数据
      type: Array,
      default () {
        return []
      }
    },
    limitMethods: {// 规定计算规则，在多列且各项值存在一定关系，如开始时间早于结束时间，参数为值列顺序当前值（忽略间隔符）
      type: [Function, Boolean],
      default: false
    },
    showLine: {// 展示的行数，建议使用奇数
      type: Number,
      default: 5
    },
    itemHeight: {
      type: Number,
      default: 30// px
    },
    animation: {
      type: Boolean,
      default: true
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      chooseIndex: [], // 同步为item长度{value, type, index} init valid computed
      valueIndex: [],
      itemData: []
    }
  },
  watch: {
    itemList (v, ov) {
      if (JSON.stringify(v) !== JSON.stringify(ov)) {
        this.initList()
      }
    }
  },
  computed: {
    needCheck () {
      return typeof this.limitMethods === 'function'
    }
  },
  methods: {
    dealLink (index, value) {
      if (this.itemData[index].type === 'rootList' || this.itemData[index].type === 'parentList') {
        // if (this.itemData[index].type === 'parentList') { //处理好父亲的关系,找到父亲，并验证父亲是否合法
        //   var parent = this.itemData[index].parentName
        //   var pInd = this.itemDate.findIndex(item => item.name === parent)
        //   this.chooseIndex[pInd].value
        // }没必要验证这种
        var key = this.itemList[index].values[value]
        var that = this
        this.itemList.map((item, i) => {
          if (item.parentName === that.itemData[index].name) {
            return {defaultIndex: item.defaultIndex || 0, ind: i}
          } else {
            return -1
          }
        }).filter(item => item !== -1).forEach(item => {
          that.itemData[item.ind].values = that.itemList[item.ind].values[key]
          var dv = typeof item.defaultIndex === 'object' ? item.defaultIndex[key] : item.defaultIndex
          if (that.chooseIndex[item.ind] === -1 || that.chooseIndex[item.ind].value !== dv) {
            var vInd = that.chooseIndex[item.ind].ind
            that.$set(that.chooseIndex, item.ind, {value: dv, type: 'invalid', ind: vInd})
            that.dealLink(item.ind, dv)
          }
        })
      }
    },
    itemChange (type, value, vindex, index) {
      if (this.chooseIndex[index] && this.chooseIndex[index].value !== value) { // set change
        this.$set(this.chooseIndex, index, {value: value, type: 'init', ind: vindex})
      }
      this.dealLink(index, value)
      if (this.needCheck) { // check valid
        var check = this.chooseIndex.filter(i => i !== -1).map(i => i.value)
        var result = this.limitMethods(check, vindex)
        if (JSON.stringify(check) !== JSON.stringify(result)) {
          var that = this
          this.chooseIndex.forEach((item, i) => {
            if (item !== -1 && item.value !== result[item.ind]) {
              that.$set(that.chooseIndex, i, {value: result[item.ind], type: 'invalid', ind: item.ind})
            }
          })
        }
      }
      if (type === 'end') { // emit parent
        this.$emit('change', this.chooseIndex.filter(i => i !== -1).map(i => i.value))
      }
    },
    initList () { // 此方法仅在列表更新使用，因此不必检测合法性并强制更新chooseIndex，毕竟父组件如果这点事都不做就别用这个组件了。。。。
      var that = this
      var ind = 0
      var width = this.itemList.map(item => item.flex || 1).reduce((prev, item) => {
        item += prev
        return item
      })
      width = 100 / width
      this.itemList.forEach((item, index) => {
        var result = {}
        if (item.values) {
          if (!that.itemData[index] || !that.itemData[index].values || JSON.stringify(item.values) !== JSON.stringify(that.itemData[index].values)) {
            if (item.values.constructor === Array) {
              if (item.name) {
                result.name = item.name
                result.type = 'rootList'
              } else {
                result.type = 'list'
              }
              result.values = item.values
            } else { // 找到子列表对应数组及默认值
              if (item.name) {
                result.name = item.name
                result.type = 'parentList'
              } else {
                result.type = 'childList'
              }
              result.parentName = item.parentName
              var pInd = that.itemList.findIndex(info => item.name === info.parentName)
              var key = that.itemList[pInd].values[that.chooseIndex[pInd].value]
              result.values = item.values[key]
            }
          }
          if (result.type !== 'list' && typeof item.defaultIndex === 'object') {
            that.$set(that.chooseIndex, index, {value: item.defaultIndex[key] ? item.defaultIndex[key] : 0, type: 'init', ind: ind})
          } else {
            that.$set(that.chooseIndex, index, {value: item.defaultIndex ? item.defaultIndex : 0, type: 'init', ind: ind})
          }
          ind++
        } else {
          result.type = 'content'
          result.content = item.content
          that.$set(that.chooseIndex, index, -1)
        }
        result.width = item.flex * width + '%'
        result.align = item.align || 'center'
        !result.values && (result.values = [])
        !result.content && (result.content = '')
        if (JSON.stringify(result) !== JSON.stringify(that.itemData[index])) {
          that.$set(that.itemData, index, result)
        }
      })
      if (this.needCheck) {
        var i = this.chooseIndex.findIndex(item => item !== -1)
        this.itemChange('init', this.chooseIndex[i].value, this.chooseIndex[i].ind, i)
      }
    }
  },
  created () {
    this.initList()
  },
  components: {
    Item
  }
}
</script>

<style scoped lang='scss'>
.picker{
  position: relative;
  .center{
    position: absolute;
    top:50%;
    left:50%;
    width:100%;
    border-top: 1px solid #f55;
    border-bottom: 1px solid #f55;
    z-index: 10;
    transform: translate(-50%, -50%);
  }
}
.picker-con{
  position: absolute;
  top:0;
  left:0;
  width:100%;
  height:auto;
  z-index: 100
}
</style>
