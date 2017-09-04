<template lang="html">
  <div class="picker">
    test
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      chooseIndex: [],
      itemData: [],
      _type: '' // normal tree
    }
  },
  watch: {
    list: {
      immediate: true,
      handler () {
        this.initData()
      }
    }
  },
  methods: {
    initData () {
      this.list.map(item => {
        if (item.data && item.data.constructor === Array) {
          this._type = 'tree'
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
