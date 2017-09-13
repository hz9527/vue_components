<template lang="html">
  <div class="page">
    <div class="hz-head">
      <router-link to="/">&lt;  index</router-link>
    </div>
    <auto-loading>
      <div slot='list' class="item" v-for='item in list' :key='item.id'>
        {{item.text}}
      </div>
    </auto-loading>
  </div>
</template>

<script>
import AutoLoading from '../../components/autoLoading/index'
import {refreshList} from './data'
export default {
  data () {
    return {
      list: []
    }
  },
  created () {
    refreshList(30)
    .then(res => {
      this.list = res
    })
  },
  components: {
    AutoLoading
  }
}
</script>

<style lang="scss" scoped>
@import '../common_style/common.scss';
.item {
  height: 0.3rem;
  line-height: 0.3rem;
  border-bottom: 1px solid #ccc;
  padding: 0 0.15rem;
}
</style>
