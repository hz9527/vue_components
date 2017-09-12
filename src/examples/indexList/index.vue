<template lang="html">
  <div class="page">
    <div class="head">
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
