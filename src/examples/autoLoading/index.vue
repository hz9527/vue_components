<template lang="html">
  <div class="page">
    <div class="hz-head">
      <router-link to="/">&lt;  index</router-link>
    </div>
    <auto-loading />
  </div>
</template>

<script>
import AutoLoading from '../../components/autoLoading/index'
export default {
  components: {
    AutoLoading
  }
}
</script>

<style lang="scss" scoped>
@import '../common_style/common.scss';
</style>
