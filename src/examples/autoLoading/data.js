function getData (length, pageSize = 10) {
  var time = parseInt(Math.random() * 100) + 20
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      var list = Array.apply(null, {length: pageSize}).map((item, i) => {
        return {
          id: i + length + 1,
          text: `第条${i + length + 1}数据`
        }
      })
      resolve(list)
    }, time)
  })
}

function refreshList (pageSize = 10) {
  var time = parseInt(Math.random() * 100) + 20
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      var list = Array.apply(null, {length: pageSize}).map((item, i) => {
        return {
          id: i + 1,
          text: `第条${i + 1}数据`
        }
      })
      resolve(list)
    }, time)
  })
}
export {getData, refreshList}
