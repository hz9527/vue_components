<template>
<div class="picker">
  <item :data='item.values' :type='item.type' :height='itemHeight' :length='showLine' :need-check='needCheck'
  :cur-value='chooseIndex[index] === -1 ? {value: -1} : chooseIndex[index]' :content='item.content' :arr-index='index'
   v-for='(item, index) in itemData' :key='index' @change='itemChange'></item>
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
    computedChoose () {

    },
    itemChange (type, value, vindex, index) {
      if (this.chooseIndex[index] && this.chooseIndex[index].value !== value) {
        this.$set(this.chooseIndex, index, {value: value, type: 'init', ind: vindex})
      }
      if (this.needCheck) {
        var result = this.limitMethods(this.chooseIndex.filter(i => i !== -1).map(i => i.value), vindex)
        var that = this
        this.chooseIndex.forEach(item => {
          if (item !== -1 && item.value !== result[item.ind]) {
            that.$set(that.chooseIndex, index, {value: result[item.ind], type: 'invalid', ind: item.ind})
          }
        })
      }
      if (type === 'end') {
        this.$emit('change', this.chooseIndex.filter(i => i !== -1).map(i => i.value))
      }
    },
    initList () { // 此方法仅在列表更新使用，因此不必检测合法性并强制更新chooseIndex，毕竟父组件如果这点事都不做就别用这个组件了。。。。
      var that = this
      var ind = 0
      this.itemList.forEach((item, index) => {
        var result = {}
        if (item.values) {
          if (!that.itemData[index] || !that.itemData[index].values || JSON.stringify(item.values) !== JSON.stringify(that.itemData[index].values)) {
            if (item.values.constructor === Array) {
              result.type = 'list'
              result.values = item.values
            } else {
              result.type = 'childList'
              result.values = that.chooseIndex[that.itemList.findIndex(info => item.parentName === info.name)].value
            }
          }
          that.$set(that.chooseIndex, index, {value: item.defaultIndex ? item.defaultIndex : 0, type: 'init', ind: ind})
          ind++
        } else {
          result.type = 'content'
          result.content = item.content
          that.$set(that.chooseIndex, index, -1)
        }
        !result.values && (result.values = [])
        !result.content && (result.content = '')
        if (JSON.stringify(result) !== JSON.stringify(that.itemData[index])) {
          that.$set(that.itemData, index, result)
        }
      })
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
  // height: 1rem;
  // overflow-y: auto;
}
</style>
