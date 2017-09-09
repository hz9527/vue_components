function formateList (list) {
  var ind = -1
  return list.map((item, i) => {
    var type = getDataType(item)
    var base = {
      type: type,
      flex: item.flex || 1,
      className: item.className || '',
      align: item.align || 'center',
      listIndex: i,
      index: -1,
      list: [],
      content: ''
    }
    if (type === 'normal') {
      ind++
      return Object.assign(base, {
        index: ind,
        defaultIndex: item.defaultIndex || 0,
        list: item.list.map(info => getItem(info))
      })
    } else if (type === 'tree') {
      ind++
      return Object.assign(base, {
        index: ind,
        name: item.name,
        data: item.data.map(subList => {
          return {
            parent: subList.parent,
            defaultIndex: subList.defaultIndex || item.defaultIndex || 0,
            list: subList.list.map(info => getItem(info))
          }
        })
      })
    } else {
      return Object.assign(base, {
        content: item.content || ''
      })
    }
  })
}
function getTree (list) {
  var tree = {}
  list.forEach((item, i) => {
    if (getDataType(item) === 'tree') {
      if (!tree[item.name]) {
        tree[item.name] = {
          index: i,
          parent: item.parentName,
          name: item.name || i,
          child: -1
        }
      } else {
        tree[item.name] = {
          index: i,
          parent: item.parentName,
          name: item.name || i,
          child: tree[item.name].child
        }
      }
      if (item.parentName !== null) {
        if (tree[item.parentName]) {
          tree[item.parentName].child = item.name
        } else {
          tree[item.parentName] = {
            index: -1,
            parent: -1,
            name: item.parentName,
            child: item.name
          }
        }
      }
    }
  })
  Object.keys(tree).forEach(key => {
    if (tree[key].child === -1) {
      tree[key].child = null
    }
  })
  return tree
}
function initList (list, chooseList, tree) {
  var curChoose = chooseList.slice()
  var computedList
  list.forEach((item, i) => {
    if (item.type === 'tree') {
      curChoose = getTreeList(list, item.name, curChoose, tree).curChoose
    } else if (item.type === 'normal') {
      curChoose[i] = item.defaultIndex
    } else {
      curChoose[i] = -1
    }
  })
  computedList = list.map(item => {
    return {
      type: item.type,
      flex: item.flex,
      className: item.className,
      align: item.align,
      listIndex: item.listIndex,
      index: item.index,
      list: item.list,
      content: item.content
    }
  })
  return {computedList, curChoose}
}
function getTreeList (list, name, chooseList, tree) {
  var curChoose = chooseList.slice()
  var changeList = []
  var curName = name
  while (tree[curName].parent !== null && typeof curChoose[tree[curName].index] !== 'number') {
    curName = tree[curName].parent
  }
  if (tree[curName].parent === null && typeof curChoose[tree[curName].index] !== 'number') {
    curChoose[tree[curName].index] = list[tree[curName].index].data[0].defaultIndex
    list[tree[curName].index].list = list[tree[curName].index].data[0].list
    changeList.push(tree[curName].index)
  }
  changeList = changeList.concat(getChildTree(list, curName, curChoose, tree, 'init').changeList)
  return {
    curChoose,
    changeList
  }
}
function getChildTree (list, name, curChoose, tree, type) {
  var curName = name
  var changeList = []
  var parentValue
  var needComputed = true
  if (type === 'init') {
    while (tree[curName].child !== null) {
      curName = tree[curName].child
      if (typeof curChoose[tree[curName].index] === 'number') {
        needComputed = false
        break
      }
    }
    curName = name
  }
  while (tree[curName].child !== null) {
    if (!needComputed) {
      break
    }
    parentValue = list[tree[curName].index].list[curChoose[tree[curName].index]].value
    curName = tree[curName].child
    list[tree[curName].index].list = list[tree[curName].index].data.find((l, i) => {
      var result
      if (l.parent.constructor !== Array) {
        result = l.parent === parentValue
      } else {
        result = l.parent.findIndex(inf => inf === parentValue) !== -1
      }
      if (result) {
        changeList.push(tree[curName].index)
        curChoose[tree[curName].index] = l.defaultIndex
      }
      return result
    }).list
  }
  return {curChoose, changeList}
}
function getDataType (item) {
  if (item.data && item.data.constructor === Array) {
    return 'tree'
  } else if (item.list && item.list.constructor === Array) {
    return 'normal'
  }
  return 'division'
}
function getItem (item) {
  if (item && typeof item === 'object') {
    return item
  } else {
    return {
      name: item,
      value: item
    }
  }
}

export {formateList, getTree, initList, getChildTree}
