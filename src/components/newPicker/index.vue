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
      this._type = ''
      this.chooseIndex = []
      var preValue
      var listInd = -1
      this.list.map(item => {
        if (!this._type) {
          if (item.data && item.data.constructor === Array) {
            this._type = 'tree'
          } else if (item.list && item.list.constructor === Array) {
            this._type = 'normal'
          }
        }
        if (item.data || item.list) {
          listInd++
          var list
          if (item.data) {
            item.data.forEach(info => {
              if (item.parent === null) {
                list = info

              }
            })
          }
        } else {
          return item
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
