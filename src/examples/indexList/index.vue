<template lang="html">
  <div class="page">
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
</style>
