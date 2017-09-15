<template lang="html">
  <div class="page">
    <div class="hz-head">
      <router-link to="/">&lt;  index</router-link>
    </div>
    <auto-loading :loading='loading' :canLoad='canLoad'
     @refresh='refresh' @preload='load' @needMore='needMore'>
      <div slot='list' class="item" v-for='item in list' :key='item.id'>
        {{item.text}}
      </div>
    </auto-loading>
  </div>
</template>

<script>
import AutoLoading from '../../components/autoLoading2/index'
import {refreshList, getData} from './data'
export default {
  data () {
    return {
      list: [],
      loading: false,
      canLoad: true,
      _page: 0
    }
  },
  created () {
    this.refresh()
  },
  methods: {
    load () {
      this.loadMore()
    },
    needMore () {
      // this.loadMore()
    },
    refresh () {
      this.canLoad = true
      this.loading = true
      var now = Date.now()
      refreshList()
      .then(res => {
        var time = Date.now() - now
        time = time > 1000 ? 0 : 1000 - time
        setTimeout(() => {
          this._page = 1
          this.loading = false
          this.list = res
        }, time)
      })
    },
    loadMore () {
      this.loading = true
      var now = Date.now()
      getData(this.list.length)
      .then(res => {
        var time = Date.now() - now
        time = time > 300 ? 0 : 300 - time
        setTimeout(() => {
          if (this._page < 10) {
            this._page++
            this.loading = false
            this.list = this.list.concat(res)
          } else {
            this.loading = false
            this.canLoad = false
          }
        }, time)
      })
    }
  },
  components: {
    AutoLoading
  }
}
</script>

<style lang="scss" scoped>
@import '../common_style/common.scss';
.item {
  height: 0.5rem;
  line-height: 0.3rem;
  border-bottom: 1px solid #ccc;
  padding: 0 0.15rem;
}
</style>
