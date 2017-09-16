<template lang="html">
  <div class="page">
    <div class="hz-head">
      <router-link to="/">&lt;  index</router-link>
    </div>
    <date-picker :computedText='computedText' :computedInfo='computedInfo' :computedValid='computedValid' />
  </div>
</template>

<script>
import DatePicker from '../../components/datePicker/index'
import {computedText, computedInfo, computedValid} from './data.js'
export default {
  data () {
    return {
      computedText: computedText,
      computedInfo: computedInfo,
      computedValid: computedValid
    }
  },
  components: {
    DatePicker
  }
}
</script>

<style lang="scss" scoped>
@import '../common_style/common.scss';
</style>
