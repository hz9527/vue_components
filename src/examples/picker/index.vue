<template lang="html">
  <div class="content">
    <div class="hz-head">
      <router-link to="/">&lt;  index</router-link>
    </div>
    <div class="title">普通picker</div>
    <picker :list='normalList' :showHead='true' :showBg='true' />

    <div class="title">带校验picker</div>
    <picker :list='numList' :limitMethods='limitMethods' />

    <div class="title">联动picker</div>
    <picker :list='childList' />

    <div class="title">多个独立联动picker</div>
    <picker :list='multiChildList' />

    <div class="title">联动混合普通带校验picker</div>
    <picker :list='hybridList' :limitMethods='limitMethods2' />
  </div>
</template>

<script>
import Picker from '../../components/picker/index.vue'
import {normalList, numList, childList, multiChildList, hybridList} from './data'
function limitMethods (list, index, type) {
  if (list[0] < list[1]) {
    return [list[0], list[0]]
  }
  return false
}
function limitMethods2 (list, index, type) {
  if (type === 'normal') { // 双数年只能选择双数月 单数年只能选择单数月
    if (list[2] % 2 === 0 && list[3] % 2 !== 0) {
      return [list[0], list[1], list[2], list[3] - 1]
    } else if (list[2] % 2 === 1 && list[3] % 2 !== 1) {
      var l3 = list[3] === 12 ? 11 : list[3] + 1
      return [list[0], list[1], list[2], l3]
    }
  }
  return false
}
export default {
  data () {
    return {
      normalList: normalList,
      numList: numList,
      childList: childList,
      limitMethods: limitMethods,
      multiChildList: multiChildList,
      hybridList: hybridList,
      limitMethods2: limitMethods2
    }
  },
  components: {
    Picker
  }
}
</script>

<style lang="scss" scoped>
@import '../common_style/common.scss';
.title {
  padding-left: 0.15rem;
  line-height: 0.3rem;
  color: #f55;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  margin: 0.1rem 0 0;
}
</style>
