<template lang="html">
  <div class="dictionary">
    <div class="item-con" ref='con' @click='chooseCity'>
      <div class="item" v-for='i in localData.index' :key='i' :ref='i'>
        <div class="title">
          {{i}}
        </div>
        <div :data-city='item.key' class="con" v-for='item in localData.list[i]'>
          {{item.value}}
        </div>
      </div>
    </div>
    <div ref='indexCon' class="index-con" @touchstart='chooseStart' @touchmove.prevent='chooseMove' @touchend='chooseEnd' @touchcancel='chooseEnd'>
      <div :style='{"height": height + "px", "lineHeight": height+ "px"}' :data-index='i' class="index-item" v-for='(info, i) in localData.index' :key='info'>
        {{info}}
      </div>
    </div>
    <div class="toast" v-show='toastShow'>
      {{curChoose}}
    </div>
  </div>
</template>

<script>
import {getData} from './dictionary/tools'
export default {
  props: {
    data: {
      type: Object,
      default () {
        return {
          key: '',
          name: '',
          list: []
        }
      }
    },
    dealData: {
      type: Function,
      default (cb, data) {
        return cb(data)
      }
    },
    maxHeight: {
      type: Number,
      default: 50
    }
  },
  data () {
    return {
      toastShow: false,
      curChoose: null,
      touch: null,
      totalHeight: 0
    }
  },
  computed: {
    localData () {
      if (this.data.list) {
        return this.dealData(getData, this.data)
      } else {
        return {
          list: [],
          index: []
        }
      }
    },
    height () {
      var result = this.totalHeight / (this.localData.index.length || 1)
      return result > this.maxHeight ? this.maxHeight : result
    }
  },
  mounted () {
    this.totalHeight = this.$refs.indexCon.offsetHeight
  },
  methods: {
    chooseCity (e) {
      if ('city' in e.target.dataset) {
        console.log(e.target.dataset.city)
      }
    },
    chooseStart (e) {
      if ('index' in e.target.dataset) {
        this.toastShow = true
        this.choose(e.target.dataset.index)
        this.touch = e.touches[0].screenY
      }
    },
    chooseMove (e) {
      if (e.touches[0]) {
        var moveY = e.touches[0].screenY - this.touch
        this.choose(parseInt(moveY / this.height))
      }
    },
    chooseEnd () {
      this.touch = null
      setTimeout(() => {
        this.curChoose = null
        this.toastShow = false
      }, 200)
    },
    choose (i) {
      if (this.curChoose !== this.localData.index[i] && this.$refs[this.localData.index[i]]) {
        this.curChoose = this.localData.index[i]
        this.$refs.con.scrollTop = this.$refs[this.curChoose][0].offsetTop
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dictionary{
  height: 100%;
  width: 100%;
  // background: #f55;
  position: relative;
}
.item-con {
  height: 100%;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display:none;
  }
  .item{
    position: relative;
    &:after{
      content: '';
      position: absolute;
      top: 100%;
      left: 0;
      width: 200%;
      height: 1px;
      background: #cdcdcd;
      transform: scale(0.5) translate(-50%, 0);
    }
    .title{
      position: sticky;
      top: 0;
      left: 0;
      z-index: 100;
      background: #dcdcdc;
      width: 100%;
      height: 0.2rem;
      line-height: 0.2rem;
      text-indent: 0.15rem;
    }
    .con {
      padding-left: 0.3rem;
      height: 0.3rem;
      line-height: 0.3rem;
      &:after{
        content: '';
        display: block;
        width: 200%;
        height: 1px;
        background: #cdcdcd;
        transform: scale(0.5) translate(-50%, 0);
      }
    }
  }
}
.index-con{
  position: absolute;
  top: 0;
  right: 0;
  width: 0.3rem;
  height: 100%;
  text-align: center;
  z-index: 200;
}
.toast {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0.5rem;
  height: 0.5rem;
  text-align: center;
  line-height: 0.5rem;
  color: #fff;
  font-size: 0.25rem;
  border-radius: 50%;
  background: rgba(0,0,0,0.5);
  z-index: 300;
  margin-top: -0.25rem;
  margin-left: -0.25rem;
}
</style>
