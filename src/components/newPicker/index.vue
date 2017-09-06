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
      chooseIndex: {},
      itemData: [],
      _tree: null
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
      this.chooseIndex = []
      var preValue
      var listInd = -1
      this.list.map(item => {
        if (item.data || item.list) {
          listInd++
          var defaultIndex = item.defaultIndex || 0
          var list
          if (item.data) {
            item.data.forEach(info => {
              if (item.parent === null) {
                list = info.list
                defaultIndex = info.defaultIndex || defaultIndex
                preValue = {
                  name: info.name,
                  value: this.getValue(list[defaultIndex])
                }
              } else {

              }
            })
          }
        } else {
          return this.getItem('', item)
        }
      })
    },
    initTree (list) {
      this._tree = {}
      list.forEach(item => {
        var defaultIndex
        var type = this.getType(item)
        if (type === 'tree' || type === 'normal') {
          defaultIndex = item.defaultIndex || 0
          if (type === 'tree') {
            var treeItem
            if (item.parentName === null) {
              defaultIndex = item.data[0].defaultIndex || defaultIndex
              treeItem = {
                parent: -1,
                children: null,
                value: this.getValue(item.data[0][defaultIndex])
              }
            } else {
              if (this._tree[item.parentName]) {
                this._tree[item.parentName].children = item.name
              }
            }
            this._tree = treeItem
          }
        }
      })
    },
    getTreeValue (name) {

    },
    getChildList (parentName, data) { // {name: value}

    },
    getType (item) {
      if (item.data && item.data.constructor === Array) {
        return 'tree'
      } else if (item.list && item.list.constructor === Array) {
        return 'normal'
      }
      return 'division'
    },
    getItem (type, item) {
      if (type === 'list') {
        return Object.assign({
          flex: 1,
          className: '',
          textAlign: 'center'
        }, item)
      } else {
        return Object.assign({
          flex: 1,
          className: ''
        }, item)
      }
    },
    getValue (item) {
      if (typeof item === 'string') {
        return item
      } else {
        return item.value
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
