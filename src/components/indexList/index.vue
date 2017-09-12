<template lang="html">
  <div class="page" :style="{'height': height}" ref='page'>
    <div class="head">
      <slot name='head'></slot>
    </div>
    <div class="content">
      <div class="index-list" v-for='item in curData.index' :key='item'>
        <div class="item-head">{{item}}</div>
        <div class="item" v-for='info in curData.list[item]' :key='info.key'>{{info.name}}</div>
      </div>
      <div class="index-con">
        <span v-for='item in curData.index' :key='item'>{{item}}</span>
      </div>
    </div>
    <div class="foot">
      <slot name='foot'></slot>
    </div>
  </div>
</template>

<script>
import {getCurData} from './indexList/utils'
export default {
  props: {
    keyConf: {
      type: Object,
      default () {
        return {}
      }
    },
    list: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      height: '100%'
    }
  },
  computed: {
    curData () { // {list: {}, index: []}
      var curKeyConf = Object.assign({
        id: 'id',
        name: 'name',
        pinyin: 'pinyin',
        division: ''
      }, this.keyConf)
      return getCurData(curKeyConf, this.list)
    }
  },
  mounted () {
    var rect = this.$refs.page.parentNode.getBoundingClientRect()
    if (rect.height === rect.bottom - rect.top) {
      this.height = window.innerHeight - rect.top + 'px'
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.head, .foot {
  flex-grow: 0;
  flex-shrink: 0;
  background: #f55;
  height: 0.1rem;
}
.content {
  flex: 1;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  position: relative;
}
.index-con {
  position: absolute;
  height: 100%;
  top: 0;
  right: 0;
  width: 0.15rem;
}
</style>
