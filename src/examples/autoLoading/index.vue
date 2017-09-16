<template lang="html">
  <div class="page">
    <div class="hz-head">
      <router-link to="/">&lt;  index</router-link>
    </div>
    <auto-loading :loading='loading' @refresh='refresh' @preload='preload'>
      <div class="item" slot='list' v-for='item in list' :key='item.id'>
        {{item.text}}
      </div>
    </auto-loading>
  </div>
</template>

<script>
import AutoLoading from '../../components/autoLoading/index'
import {refreshList, getData} from './data'
export default {
  data () {
    return {
      list: [],
      loading: false
    }
  },
  methods: {
    refresh () {
      this.loading = true
      var now = Date.now()
      refreshList(30)
      .then(res => {
        var time = Date.now() - now
        time = time > 2000 ? 0 : 2000 - time
        setTimeout(() => {
          this.loading = false
          this.list = res
        }, time)
      })
    },
    preload () {
      this.loading = true
      var now = Date.now()
      getData(this.list.length)
      .then(res => {
        var time = Date.now() - now
        time = time > 500 ? 0 : 500 - time
        setTimeout(() => {
          this.loading = false
          this.list = this.list.concat(res)
        }, time)
      })
    }
  },
  created () {
    this.refresh()
  },
  components: {
    AutoLoading
  }
}
</script>

<style lang="scss" scoped>
@import '../common_style/common.scss';
.list {
  height: 10rem;
  background: #f55;
}
.item {
  height: 0.4rem;
  line-height: 0.4rem;
  padding-left: 0.15rem;
  border-bottom: 1px solid #ccc;
}
</style>
