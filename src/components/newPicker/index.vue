<template lang="html">
  <div class="picker">
    <item :class='item.className' v-for='(item, i) in curList' :key='i' :list='item.list' :content='item.content'  :type='item.type'
     :listIndex='item.listIndex' :index='item.index' :chooseIndex='chooseList[i]' :needCheck='needCheck' @check='check' @moveEnd='moveEnd'
     :align='item.align' :showLine='showLine' :flex='item.flex' :className='item.className' :itemHeight='itemHeight' />
    <div class="center" :style="{'height': itemHeight + 'px'}"></div>
  </div>
</template>

<script>
import {formateList, getTree, initList, getChildTree} from './picker/utils'
// initList arg[formateList, chooseList, tree] return {computedList, curChoose}
// getChildTree arg[formateList, name, chooseList.slice(), tree] return {curChoose, changeList}
import Item from './picker/item'
export default {
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    },
    limitMethods: {
      type: [Function, Boolean],
      default: false
    },
    showLine: {
      type: Number,
      default: 5 // 必须为奇数
    },
    itemHeight: {
      type: Number,
      default: 30 // unit px
    }
  },
  data () {
    return {
      chooseList: [],
      curList: [],
      _tree: null,
      _forMatList: null
    }
  },
  computed: {
    needCheck () {
      return typeof this.limitMethods === 'function'
    }
  },
  watch: {
    list: {
      immediate: true,
      handler (l) {
        this.initData(l)
      }
    }
  },
  methods: {
    initData (list) {
      this._forMatList = formateList(list)
      this._tree = getTree(list)
      var result = initList(this._forMatList, this.chooseList, this._tree)
      this.chooseList = result.curChoose
      this.curList = result.computedList
    },
    check (v, type, index, listIndex) {
      this.$set(this.chooseList, listIndex, v)
      if (type === 'tree') {
        var treeResult = getChildTree(this._forMatList, this._forMatList[listIndex].name, this.chooseList.slice(), this._tree)
        treeResult.changeList.forEach(ind => {
          this.$set(this.curList, ind, this._forMatList[ind])
        })
        treeResult.curChoose.forEach((item, i) => {
          if (item !== this.chooseList[i]) {
            this.$nextTick(() => {
              this.$set(this.chooseList, i, item)
            })
          }
        })
      }
      if (this.needCheck) {
        var checkList = this.chooseList.filter(item => item !== -1)
        checkList[index] = v
        var result = this.limitMethods(checkList, index, type)
        if (result) {
          var ind = -1
          this.chooseList.forEach((item, i) => { // 迭代器参数为局部作用域变量，相当于let，因此不需要使用闭包
            if (item !== -1) {
              ind++
              if (item !== result[ind]) {
                this.$nextTick(() => {
                  this.$set(this.chooseList, i, result[ind])
                })
              }
            }
          })
        }
      }
    },
    moveEnd (v, i) {
      this.$set(this.chooseList, i, v)
    }
  },
  components: {
    Item
  }
}
</script>

<style lang="scss" scoped>
.picker {
  display: flex;
  justify-content: space-between;
  position: relative;
}
.center {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  transform: translate(0, -50%);
  &:after, &:before {
    content: '';
    position: absolute;
    top: 0%;
    left: 0;
    width: 200%;
    height: 1px;
    border: 1px solid #ccc;
    transform: scale(0.5) translate(-50%, 0);
  }
  &:after {
    top: 100%;
  }
}
</style>
