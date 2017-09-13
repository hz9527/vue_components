<template lang="html">
  <div class="page">
    <div class="hz-head">
      <router-link to="/">&lt;  index</router-link>
    </div>
    <index-list :list='cityList' />
  </div>
</template>

<script>
import {cityList} from './data'
import IndexList from '../../components/indexList/index'
export default {
  data () {
    return {
      cityList: cityList
    }
  },
  components: {
    IndexList
  }
}
</script>

<style lang="scss" scoped>
@import '../common_style/common.scss';
</style>
