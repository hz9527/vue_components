function getCurData (keyConf, curList) {
  // keyConf {id: xx, name: xx, pinyin: xx}
  var index = []
  var list = {}
  curList.forEach((item, i) => {
    var key = item[keyConf.pinyin][0].toUpperCase()
    var itemKey
    var _item = {}
    _item.name = item[keyConf.name]
    _item.pinyin = item[keyConf.pinyin]
    if (keyConf.id) {
      itemKey = item[keyConf.id]
      _item.id = itemKey
    }
    _item.key = itemKey || _item.name + '' + i
    if (list[key]) {
      list[key].push(_item)
    } else {
      index.push(key)
      list[key] = [_item]
    }
  })
  sortList(index, '', keyConf.division)
  Object.keys(list).forEach(key => {
    sortList(list[key], keyConf.pinyin, keyConf.division)
  })
  return {index, list}
}

function sortList (list, key, Division = '') {
  list.sort((pre, next) => {
    if (key) {
      return compare(pre[key], next[key], Division)
    } else {
      return compare(pre, next, Division)
    }
  })
}

function compare (pre, next, Division, ind) {
  ind = ind || 0
  if (ind === Math.min(pre.length, next.length)) { // 判断是否至少一个已经比完了
    return pre.length - next.length
  }
  var c = pre.charCodeAt(ind) - next.charCodeAt(ind)
  if (c !== 0) { // 下标不同
    if (Division) { // 判断有一个拼音结尾了
      if (typeof Division === 'string' && (pre[ind] === Division || next[ind] === Division)) {
        return pre[ind] === Division ? -1 : 1
      } else if (typeof Division === 'function') {
        return Division(pre[ind], next[ind])
      }
    }
    return c
  } else { // 下标相同继续比下一位
    return compare(pre, next, Division, ++ind)
  }
}
export {getCurData}
