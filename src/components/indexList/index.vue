<template lang="html">

</template>

<script>
export default {
  props: {
    keyConf: {
      type: Object,
      default () {
        return {}
      }
    },
    list: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {}
  },
  computed: {
    curData () { // {list: {}, index: []}
      var curKeyConf = Object.assign({
        id: 'id',
        name: 'name',
        pinyin: 'pinyin'
      }, this.keyConf)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
