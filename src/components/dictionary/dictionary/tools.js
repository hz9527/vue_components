import {Pinyin as pinyin} from './pinyin.js'
const Division = '$'
export function getData (data, polyfill) {
  var support = pinyin.isSupported()
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
    if (support) {
      data.list.forEach(item => {
        var pin = getPinyin(item[data.name], polyfill)
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
    } else {
      console.error('不兼容')
    }
  } else if (data.list.constructor === Object) {
    Object.keys(data.list).forEach(key => {
      result.index.push(key)
      result.list[key] = data.list[key].map(item => {
        var quanpin = data.pinyin ? item[data.pinyin] : support ? getPinyin(item[data.name], polyfill) : item[data.name]
        return {
          key: item[data.key],
          value: item[data.name],
          index: key,
          pinyin: quanpin
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

function getPinyin (item, polyfill) {
  var result = false
  if (typeof polyfill === 'object') {
    polyfill[item] && (result = polyfill[item])
  } else if (typeof polyfill === 'function') {
    result = polyfill(item)
    if (result.constructor === Array) {
      result = result.map((info, i) => {
        if (item.indexOf(info) === -1) {
          return info
        } else {
          return pinyin.convertToPinyin(info, Division)
        }
      }).join(Division)
    } else {
      result = false
    }
  }
  if (result === false) {
    return pinyin.convertToPinyin(item, Division)
  } else {
    return result
  }
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
  if (i === Math.min(pre.length, next.length)) { // 判断是否至少一个已经比完了
    return pre.length - next.length
  }
  var c = pre.charCodeAt(i) - next.charCodeAt(i)
  if (c !== 0) { // 下标不同
    if (pre[i] === Division || next[i] === Division) { // 有一个拼音结尾了
      return pre[i] === Division ? -1 : 1
    }
    return c
  } else { // 下标相同继续比下一位
    return compare(pre, next, ++i)
  }
}
