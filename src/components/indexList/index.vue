<template lang="html">
  <div class="page" :style="{'height': height}" ref='page'>
    <div class="head">
      <slot name='head'></slot>
    </div>
    <div class="content" ref='con'>
      <div :ref='item' class="index-list" v-for='item in curData.index' :key='item'>
        <div class="item-head">{{item}}</div>
        <div class="item" v-for='info in curData.list[item]' :key='info.key'>{{info.name}}</div>
      </div>
    </div>
    <div class="foot">
      <slot name='foot'></slot>
    </div>
    <div class="index-con" @touchstart='moveStart' @touchmove='move' @touchend='moveEnd' @touchcancel='moveEnd' @click='clickIndex'>
      <span :data-index='i' v-for='(item, i) in curData.index' :style="{'height': itemHeight + 'px', 'lineHeight': itemHeight + 'px'}" :key='item'>{{item}}</span>
    </div>
    <div class="index-toast" v-show='indToastShow'>{{chooseIndex}}</div>
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
    },
    maxHeight: {
      type: Number,
      default: 20
    }
  },
  data () {
    return {
      height: '100%',
      chooseIndex: '',
      indToastShow: false,
      itemHeight: 0,
      _startY: null,
      _startI: 0
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
  watch: {
    indToastShow (v) {
      if (v) {
        setTimeout(() => {
          this.chooseIndex = ''
          this.indToastShow = false
        }, 400)
      }
    },
    curData () {
      this.getItemHeight()
    }
  },
  methods: {
    clickIndex (e) {
      if ('index' in e.target.dataset) {
        this.choose(Number(e.target.dataset.index))
      }
    },
    moveStart (e) {
      if ('index' in e.target.dataset) {
        this._startY = e.touches[0].screenY
        this._startI = Number(e.target.dataset.index)
      }
    },
    move (e) {
      if (this._startY !== null) {
        var move = e.touches[0].screenY - this._startY
        this.choose(this._startI + parseInt(move / this.itemHeight))
      }
    },
    moveEnd () {
      if (this._startY !== null) {
        this._startY = null
        this._startI = 0
      }
    },
    choose (i) {
      if (i >= 0 && i < this.curData.index.length && this.chooseIndex !== this.curData.index[i]) {
        this.indToastShow = true
        this.chooseIndex = this.curData.index[i]
        this.$refs.con.scrollTop = this.$refs[this.curData.index[i]][0].offsetTop
      }
    },
    getItemHeight () {
      if (this.$el) {
        this.itemHeight = Math.min(parseInt(parseInt(window.getComputedStyle(this.$refs.page).height) / this.curData.index.length), this.maxHeight)
      }
    }
  },
  mounted () {
    var rect = this.$refs.page.parentNode.getBoundingClientRect()
    if (this.$refs.page.offsetTop !== 0) {
      this.height = window.innerHeight - rect.top - this.$refs.page.offsetTop + 'px'
    } else if (rect.height === rect.bottom - rect.top) {
      this.height = window.innerHeight - rect.top + 'px'
    }
    this.$nextTick(this.getItemHeight)
  }
}
</script>

<style lang="scss" scoped>
.page {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}
.head, .foot {
  flex-grow: 0;
  flex-shrink: 0;
}
.content {
  flex: 1;
  padding-right: 0.2rem;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
  .item-head {
    position: sticky;
    top: 0;
    left: 0;
    height: 0.25rem;
    line-height: 0.25rem;
    background: #ddd;
    color: #666;
    padding-left: 0.15rem;
  }
  .item {
    height: 0.4rem;
    line-height: 0.4rem;
    margin-left: 0.15rem;
    border-bottom: 1px solid #ddd;
    &:last-child {
      border: 0;
    }
  }
}
.index-con, .index-toast {
  position: absolute;
  top: 50%;
}
.index-con {
  max-height: 100%;
  right: 0;
  transform: translate(0, -50%);
  width: 0.2rem;
  overflow: hidden;
  span {
    display: block;
    height: 20px;
    text-align: center;
  }
}
.index-toast {
  left: 50%;
  width: 0.5rem;
  height: 0.5rem;
  margin-top: -0.25rem;
  margin-left: -0.25rem;
  border-radius: 50%;
  text-align: center;
  font-size: 20px;
  line-height: 0.5rem;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
}
</style>
