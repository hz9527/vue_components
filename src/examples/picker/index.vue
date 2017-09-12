<template lang="html">
  <div class="content">
    <div class="head">
      <router-link to="/">&lt;  index</router-link>
    </div>
    <picker :list='numList' :limitMethods='limitMethods' />
    <picker :list='childList' />
  </div>
</template>

<script>
import Picker from '../../components/picker/index.vue'
import {normalList, numList, childList} from './data'
function limitMethods (list, index, type) {
  if (list[0] < list[1]) {
    return [list[0], list[0]]
  }
  return false
}
export default {
  data () {
    return {
      normalList: normalList,
      numList: numList,
      childList: childList,
      limitMethods: limitMethods
    }
  },
  components: {
    Picker
  }
}
</script>

<style lang="scss" scoped>
.head{
  height: 0.3rem;
  line-height: 0.3rem;
  border: 1px solid #f55;
  a{
    display: block;
    height:100%;
    color: #e55;
    text-decoration: none;
    padding-left: 0.1rem;
    text-align: left;
  }
}
</style>
