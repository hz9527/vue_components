<template lang="html">
  <div class="picker">
    <slot name='head'>
      <div class="head">
        <div class="head-btn" @click='cancel'>取消</div>
        <div class="head-btn" @click='confirm'>确认</div>
      </div>
    </slot>
    <div class="picker-con">
      <item :class='item.className' v-for='(item, i) in curList' :key='i' :list='item.list' :content='item.content'  :type='item.type'
       :listIndex='item.listIndex' :index='item.index' :chooseIndex='chooseList[i]' :needCheck='needCheck' @check='check' @moveEnd='moveEnd'
       :align='item.align' :showLine='showLine' :flex='item.flex' :className='item.className' :itemHeight='itemHeight' />
       <slot name='center'>
         <div class="center" :style="{'height': itemHeight + 'px'}"></div>
       </slot>
       <slot name='bg'>
         <div class="bg"></div>
       </slot>
    </div>
  </div>
</template>

<script>
import {formateList, getTree, initList, getChildTree, getListItem, resetList} from './src/utils'
// initList arg[formateList, chooseList, tree] return {computedList, curChoose}
// getChildTree arg[formateList, name, chooseList.slice(), tree] return {curChoose, changeList}
import Item from './src/item'
export default {
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    },
    choose: { // [{index: xx}, {dataIndex: xx, index: xx}, 1, -1]
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
      _forMatList: null,
      _needChange: false,
      _backupChoose: []
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
    },
    choose: { // 防止list更新与choose不在一个事件循环中
      immediate: true,
      handler (v) {
        if (v.length !== this.chooseList.length) {
          this._needChange = true
        } else {
          this.updateChoose()
        }
      }
    }
  },
  methods: {
    cancel () {
      if (this.choose.length === 0) {
        var changeList = resetList(this._forMatList, this._tree)
        if (changeList.length > 0) {
          changeList.forEach(ind => {
            this.$set(this.curList, ind, getListItem(this._forMatList[ind]))
          })
          this.$nextTick(() => {
            this.chooseList = this._backupChoose.slice()
          })
        } else {
          this.chooseList = this._backupChoose.slice()
        }
      } else {
        this.updateChoose()
      }
      this.$emit('cancel')
    },
    confirm () {
      var result = this._forMatList.map((item, i) => {
        var result = -1
        if (item.type !== 'division') {
          result = {
            index: this.chooseList[i],
            value: item.list[this.chooseList[i]].value,
            name: item.list[this.chooseList[i]].name
          }
          if (item.type === 'tree') {
            result.dataIndex = item.dataIndex
          }
        }
        return result
      })
      this.$emit('confirm', result)
    },
    initData (list) {
      this._forMatList = formateList(list)
      this._tree = getTree(list)
      var result = initList(this._forMatList, this.chooseList, this._tree)
      this.chooseList = result.curChoose
      this.curList = result.computedList
      if (this.choose.length === 0) {
        this._backupChoose = result.curChoose.slice()
      }
      if (this._needChange) {
        this._needChange = false
        this.updateChoose()
      }
    },
    check (v, type, index, listIndex) {
      this.$set(this.chooseList, listIndex, v)
      if (type === 'tree') {
        var treeResult = getChildTree(this._forMatList, this._forMatList[listIndex].name, this.chooseList.slice(), this._tree)
        treeResult.changeList.forEach(ind => {
          this.$set(this.curList, ind, getListItem(this._forMatList[ind]))
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
    },
    updateChoose () {
      if (this.choose.length !== this.chooseList.length) {
        console.warn('choose is invaild')
      }
      this.choose.forEach((item, i) => {
        var ind = -1
        if (typeof item === 'object' && 'dataIndex' in item) {
          // check _forMatList
          if (this._forMatList[i].dataIndex !== item.dataIndex) {
            this._forMatList[i].dataIndex = item.dataIndex
            this._forMatList[i].dataIndex.list = this._forMatList[i].dataIndex.data[item.dataIndex]
            this.$set(this.curList, i, getListItem(this._forMatList[i]))
          }
        } else if (item !== -1 || this.chooseList[i] !== -1) {
          if (typeof item === 'object') {
            ind = item.index
          } else {
            ind = item
          }
        }
        if (ind !== -1 && this.chooseList[i] !== ind) {
          this.$nextTick(() => {
            this.$set(this.chooseList, i, item.index)
          })
        }
      })
    }
  },
  components: {
    Item
  }
}
</script>

<style lang="scss" scoped>
.head {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  height: 0.3rem;
  line-height: 0.3rem;
  .head-btn {
    padding: 0 0.15rem;
  }
}
.picker-con {
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
    transform: scale(0.5) translate(-50%, -50%);
  }
  &:after {
    top: 100%;
  }
}
.bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(0deg, rgba(200, 200, 200, 0.5) 0%, rgba(200, 200, 200, 0) 40%, rgba(200, 200, 200, 0) 60%, rgba(200, 200, 200, 0.5) 100%)
}
</style>
