import {Pinyin as pinyin} from './pinyin.js'

export function getData (data) {
  if (!data.key || !data.name) {
    console.error('请配置 key 或 name')
    return
  }
  var result = {
    list: {},
    index: []
  }
  if (data.list.constructor === Array) {
    result.index = {}
    if (pinyin.isSupported()) {
      // var result = pinyin.convertToPinyin('我')
      data.list.forEach(item => {
        var pin = pinyin.convertToPinyin(item[data.name])
        var i = pin[0]
        if (i) {
          var info = {
            key: item[data.key],
            value: item[data.name],
            index: i,
            pinyin: pin
          }
          if (result.index[i]) {
            result.list[i].push(info)
          } else {
            result.index[i] = true
            result.list[i] = [info]
          }
        }
      })
      result.index = Object.keys(result.index)
    }
  } else if (data.list.constructor === Object) {
    Object.keys(data.list).forEach(key => {
      result.index.push(key)
      result.list[key] = data.list[key].map(item => {
        return {
          key: item[data.key],
          value: item[data.name],
          index: key,
          pinyin: pinyin.isSupported() ? pinyin.convertToPinyin(item[data.name]) : item[data.name]
        }
      })
    })
  } else {
    console.error('invalid list')
    return false
  }
  Object.values(result.list).forEach(item => {
    sortList(item, 'pinyin')
  })
  sortList(result.index)
  return result
}

function sortList (list, key) {
  list.sort((pre, next) => {
    if (key) {
      return compare(pre[key], next[key])
    } else {
      return compare(pre, next)
    }
  })
}

function compare (pre, next, i = 0) {
  var c = pre.charCodeAt(i) - next.charCodeAt(i)
  if (c !== 0) {
    return c
  } else if (i === Math.min(pre.length, next.length)) {
    return pre.length - next.length
  } else {
    return compare(pre, next, ++i)
  }
}
