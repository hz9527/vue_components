<template>
<div class="picker" :style="{'height':itemHeight*showLine +'px'}">
  <div class="head">
    <slot name='head'></slot>
  </div>
  <slot name='center'>
    <div class="center" :style="{'height':itemHeight +'px'}"></div>
  </slot>
  <slot name='bg'>
    <div class="bg"></div>
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
    eventName: {
      type: String,
      default: 'change'
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
      itemData: [],
      tree: {},
      treeList: []
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
    findIntree (obj, i) {
      var result = -1
      for (var k in obj) {
        if (Number(k) === i) {
          result = obj[k]
        } else if (typeof obj[k] === 'object') {
          var r = this.findIntree(obj[k], i)
          r !== -1 && (result = r)
        }
      }
      return result
    },
    transTreeList (list) {
      var result = []
      list.forEach(item => {
        if (item.constructor === Array) {
          result = result.concat(item)
        } else {
          result.push(item)
        }
      })
      result.sort((pre, next) => pre._ind - next._ind)
      return result
    },
    getBranch (tree, name, list, curIndex, i) { // {x:{y:null, z:{...}}} name: {xx:xx,xx:xx,xx:xx}
      i = i || 0
      var result = []
      var rootIndex = Object.keys(tree)[0]
      var index, childKey, curList, childTree, childInd
      if (typeof list[rootIndex].name === 'object') {
        if (typeof list[rootIndex].defaultIndex === 'object') {
          var key = Object.keys(list[rootIndex].name).find(key => list[rootIndex].name[key] === name)
          index = curIndex || 0
        } else {
          index = curIndex || 0
        }
        curList = list[rootIndex].values[key]
      } else { // 叶子节点
        index = curIndex || 0
        curList = list[rootIndex].values
      }
      childKey = curList[index]
      var rootResult = JSON.parse(JSON.stringify(list[rootIndex]))
      rootResult.values = curList
      rootResult._ind = rootIndex
      rootResult._key = key || null
      rootResult._curIndex = curIndex
      rootResult._treeIndex = i
      result.push(rootResult)
      Object.keys(tree[rootIndex]).forEach(ind => {
        if (list[ind].parentName === name) {
          childTree = {}
          childTree[ind] = tree[rootIndex][ind]
          childInd = ind
        }
      })
      if (!list[childInd].name) {
        var childResult = JSON.parse(JSON.stringify(list[childInd]))
        childResult.values = childResult.values[childKey]
        childResult._ind = childInd
        childResult._key = childKey
        childResult._treeIndex = i + 1
        if (typeof childResult.defaultIndex === 'object') {
          childResult._curIndex = childResult.defaultIndex[childKey] || 0
        } else {
          childResult._curIndex = 0
        }
        result.push(childResult)
        return result
      } else {
        var ci = 0
        if (list[childInd].defaultIndex) {
          ci = list[childInd].defaultIndex[childKey] || 0
        }
        result = result.concat(this.getBranch(childTree, list[childInd].name[childKey], list, ci, i + 1))
      }
      return result
    },
    getTree (list) { // 处理多级联动列表,将下标转化为树状解构
      var result = {}
      var catchObj = {}
      list.forEach((item, i) => {
        if (item.name) { // 找到所有儿子并将该项置为false，并在缓存对象中查找父亲是否存在，如果存在挂载到下面
          var r = []
          var nameList = []
          if (typeof item.name === 'object') {
            nameList = Object.values(item.name)
          } else {
            nameList.push(item.name)
          }
          nameList.forEach(name => {
            r = r.concat(list.map((item, ind) => {
              if (item.parentName === name) {
                if (item.name) {
                  item._ind = ind
                  return item
                } else {
                  return ind
                }
              } else {
                return false
              }
            }).filter(item => item !== false))
          })
          // console.log(r)
          var obj = {}
          r.forEach(item => {
            if (typeof item === 'number') {
              obj[item] = null
            } else {
              obj[item._ind] = -1
            }
          })
          catchObj[i] = obj
        } else if (!item.name && !item.parentName) {
          result[i] = null
        }
      })
      var c = false
      while (!c) {
        // 如果某项每个值都不为－1就找其父亲
        for (var k2 in catchObj) {
          if (Object.values(catchObj[k2]).every(item => item !== -1)) {
            for (var k3 in catchObj) {
              if (catchObj[k3][k2]) {
                catchObj[k3][k2] = catchObj[k2]
                delete catchObj[k2]
              }
            }
          }
        }
        c = Object.keys(catchObj).every(key => {
          return Object.values(catchObj[key]).every(item => item !== -1)
        })
      }
      for (var k in catchObj) {
        result[k] = catchObj[k]
      }
      return result
    },
    dealLink (index, value) { // 在当前list中位置，值在values中下标
      // 如果自己有儿子可能需要变化儿子们，如果没有儿子就直接更新
      var ind = this.chooseIndex[index].ind
      if (this.itemList[ind].name) { // 根据当前values来确定使用当前儿子的哪个列表
        var listIndex = this.treeList.findIndex(item => {
          if (item.constructor === Array) {
            return item.find(info => info._ind === ind)
          } else {
            return false
          }
        })
        var branchTree = {}
        branchTree[ind] = this.findIntree(this.tree, Number(ind))
        var curName
        if (this.itemData[index]._key) {
          curName = this.itemList[ind].name[this.itemData[index]._key]
        } else {
          curName = this.itemList[ind].name
        }

        // find father and follow
        var item = this.treeList[listIndex].find(item => item._ind === ind)
        var pList = this.treeList[listIndex].filter(info => info._treeIndex < item._treeIndex)
        var newTreeList = this.getBranch(branchTree, curName, this.itemList, value, item._treeIndex)
        newTreeList = newTreeList.concat(pList)
        this.treeList[listIndex] = newTreeList
        var newList = this.transTreeList(this.treeList) // 防止布局发生变化
        this.changeList(newList)
      }
    },
    itemChange (type, value, vindex, index) {
      if (this.chooseIndex[index] && this.chooseIndex[index].value !== value) { // set change
        this.$set(this.chooseIndex, index, {value: value, type: 'init', ind: vindex})
        if (this.treeList.length > 0) {
          this.dealLink(index, value)
        }
        if (this.needCheck) { // check valid
          var check, result
          if (this.treeList.length > 0) {
            check = this.chooseIndex.filter(i => i !== -1).map(i => {
              return {value: i.value, index: i.ind}
            })
          } else {
            check = this.chooseIndex.filter(i => i !== -1).map(i => i.value)
          }
          result = this.limitMethods(check, vindex)
          if (JSON.stringify(check) !== JSON.stringify(result)) {
            var that = this
            this.chooseIndex.forEach((item, i) => {
              if (item !== -1 && item.value !== result[item.ind]) {
                that.$set(that.chooseIndex, i, {value: result[item.ind], type: 'invalid', ind: item.ind})
              }
            })
          }
        }
        if (type === 'end' || this.active) { // emit parent
          var emitResult
          if (this.treeList.length > 0) {
            emitResult = this.chooseIndex.filter(i => i !== -1).map(i => {
              return {value: i.value, index: i.ind}
            })
          } else {
            emitResult = this.chooseIndex.filter(i => i !== -1).map(i => i.value)
          }
          this.$emit(this.eventName, emitResult)
        }
      }
    },
    changeList (list, type) {
      if (list.length !== this.itemData.length) {
        this.itemData = []
        this.chooseIndex = []
      }
      var that = this
      var ind = 0
      var width = list.map(item => item.flex || 1).reduce((prev, item) => {
        item += prev
        return item
      })
      width = 100 / width
      list.forEach((item, index) => {
        var result = {}
        var choose = {}
        if (item.values) {
          result.values = item.values
          choose.type = type || 'init'
          if (this.treeList.length > 0) {
            result._ind = item._ind
            result._key = item._key
            result._curIndex = item._curIndex
            choose.ind = item._ind
            choose.value = item._curIndex || 0
            if (item.name || item.name === 0) {
              result.type = 'parentList'
            } else {
              result.type = 'childList'
            }
          } else {
            result.type = 'list'
            choose.ind = ind
            choose.value = item.defaultIndex || 0
          }
          ind++
        } else {
          result.type = 'content'
          result.content = item.content
          choose = -1
        }
        result.width = (item.flex || 1) * width + '%'
        result.align = item.align || 'center'
        !result.values && (result.values = [])
        !result.content && (result.content = '')
        if (!that.itemData[index] || JSON.parse(JSON.stringify(result)) !== JSON.parse(JSON.stringify(that.itemData[index]))) {
          that.$set(that.itemData, index, result)
        }
        if (!that.chooseIndex[index] || JSON.parse(JSON.stringify(choose)) !== JSON.parse(JSON.stringify(that.chooseIndex[index]))) {
          that.$set(that.chooseIndex, index, choose)
        }
      })
      if (this.needCheck) {
        var i = this.chooseIndex.findIndex(item => item !== -1)
        this.itemChange('init', this.chooseIndex[i].value, this.chooseIndex[i].ind, i)
      }
    },
    initList () { // 此方法仅在列表更新使用，因此不必检测合法性并强制更新chooseIndex，毕竟父组件如果这点事都不做就别用这个组件了。。。。
      // 将数据转为树状，如果每一项为null那么就作为非联动处理，如果为树状则按树状处理
      this.tree = this.getTree(this.itemList)
      this.treeList = []
      var that = this
      var list
      if (Object.values(this.tree).some(item => item !== null)) {
        Object.keys(this.tree).forEach(ind => {
          if (that.tree[ind] === null) { // 可能是content也可能是普通的值列
            var result = JSON.parse(JSON.stringify(that.itemList[ind]))
            result._ind = ind
            that.treeList.push(result)
          } else {
            var obj = {}
            obj[ind] = that.tree[ind]
            that.treeList.push(that.getBranch(obj, that.itemList[ind].name, that.itemList, that.itemList[ind].defaultIndex || 0))
          }
        })
        list = this.transTreeList(this.treeList)
      } else {
        list = this.itemList
      }
      this.changeList(list)
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
  .center, .head, .bg{
    position: absolute;
    z-index: 10;
  }
  .center{

    top:50%;
    left:50%;
    width:100%;
    border-top: 1px solid #dedede;
    border-bottom: 1px solid #dedede;
    transform: translate(-50%, -50%);
  }
  .head{
    bottom: 100%;
    left: 0;
    width: 100%;
  }
  .bg{
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: linear-gradient(to bottom, rgba(240,240,240,0.3) 20%,rgba(255,255,255,0) 40%, rgba(240,240,240,0.3) 80%);
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
