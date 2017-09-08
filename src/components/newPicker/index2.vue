<template lang="html">
  <div class="picker-con">
    <item :class='item.className' v-for='(item, i) in curList' :key='i' :type='item.type' :index='item.index' :flex='item.flex'
     :list='item.list' :content='item.content' :chooseIndex='chooseList[i]' :className='item.className' :align='item.align'
     :showLine='showLine' :itemHeight='itemHeight' :needCheck='needCheck' @check='check' @moveEnd='moveEnd' />
   <div class="center"></div>
  </div>
</template>

<script>
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
      chooseList: [], // index list
      curList: [] // conf & list({name value})
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
      handler (v) {
        this.chooseList = []
        var listInd = -1
        this.curList = v.map((item, i) => {
          if (item.list) {
            this.chooseList.push(item.defaultIndex || 0)
            listInd++
            return {
              type: 'normal',
              index: listInd,
              list: item.list.map(info => {
                if (typeof info !== 'object') {
                  return {
                    name: info,
                    value: info
                  }
                } else {
                  return info
                }
              }),
              content: '',
              flex: item.flex || 1,
              className: item.className || '',
              align: item.align || 'center'
            }
          } else {
            this.chooseList.push(-1)
            return {
              type: 'division',
              index: -1,
              list: [],
              content: item.content || '',
              flex: item.flex || 1,
              className: item.className || '',
              align: item.align || 'center'
            }
          }
        })
      }
    }
  },
  methods: {
    check (v, type, index) {
      if (typeof this.limitMethods === 'function') {
        var checkList = this.chooseList.filter(item => item !== -1)
        checkList[index] = v
        var result = this.limitMethods(checkList, index, type)
        if (result) {
          var ind = -1
          this.chooseList.forEach((item, i) => {
            if (item !== -1) {
              ind++
              if (item !== result[ind]) {
                this.$set(this.chooseList, i, result[ind])
                console.log(this.chooseList, 555)
              }
            }
          })
        }
      }
    },
    moveEnd (v) {
      console.log(v)
    }
  },
  components: {
    Item
  }
}
</script>

<style lang="scss" scoped>
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
  height: 30px;
  margin-top: -15px;
  background: rgba(100, 100, 100, 0.6);
}
</style>
