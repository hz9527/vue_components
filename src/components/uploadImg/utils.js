let cache = {}
let cacheList = {}
const DefaultKey = 'key'

function findImg (key, src, isUrl) {
  let ind
  if (!cacheList[key]) {
    return -1
  }
  if (isUrl) {
    ind = cacheList[key].findIndex(item => item.src === src)
  } else {
    ind = cache[key].findIndex(item => {
      return item === src
    })
  }
  return ind
}

function addChild (key, name, ind, url, dataUrl, size) { // return src size is {width, height}
  if (ind !== -1) {
    cacheList[key][ind].children.add(name)
  } else {
    !cacheList[key] && (cacheList[key] = [])
    !cache[key] && (cache[key] = [])
    ind = cacheList[key].length
    cache[key].push(dataUrl)
    cacheList[key].push({
      state: url ? 1 : 0, // 0 not upload 1 uploaded
      size: size,
      src: url || '',
      children: new Set([name])
    })
  }
  if (url && !cacheList[key][ind].src) {
    cacheList[key][ind].src = url
  }
  return {
    isUrl: !!cacheList[key][ind].src,
    src: cacheList[key][ind].src ? cacheList[key][ind].src : cache[key][ind]
  }
}

function checkImg (size, width, height) {
  let check = true
  if (typeof size === 'function') {
    check = size(width, height)
  } else if (size) {
    if (size.width && size.width !== width) {
      check = false
    } else if (size.height && size.height !== height) {
      check = false
    }
  }
  return check
}

function fileParse (group, name, file, size) {
  return new Promise(resolve => {
    if (FileReader) {
      let Reader = new FileReader()
      Reader.onloadend = () => {
        imgParse(group, name, Reader.result, size, false, file.name)
          .then(res => resolve(res))
      }
      Reader.onerror = () => {
        resolve({code: -1, data: null, msg: 'read file error'})
      }
      Reader.readAsDataURL(file)
    } else {
      resolve({code: -2, data: null, msg: 'not support FileReader'})
    }
  })
}

function imgParse (group, name, src, size, isUrl = false, fileName) {
  return new Promise(resolve => {
    let key = group === true ? DefaultKey : group
    if (key) {
      let ind = findImg(key, src, isUrl)
      if (ind !== -1) {
        let sizeInfo = cacheList[key][ind].size
        let check = checkImg(size, sizeInfo.width, sizeInfo.height)
        if (check) {
          let data = addChild(key, name, ind, src)
          resolve({code: 0, data: data})
        } else {
          resolve({code: -1, data: null, msg: 'img width or height is invalid'})
        }
        return
      }
    }
    let img = new Image()
    img.setAttribute('crossOrigin', 'anonymous')
    img.onload = () => {
      // check && trans base64 if group
      let check = checkImg(size, img.width, img.height)
      if (check) {
        if (key) {
          let canvas = document.createElement('canvas')
          if (canvas.getContext) {
            canvas.width = img.width
            canvas.height = img.height
            canvas.getContext('2d').drawImage(img, 0, 0)
            let type
            let fname = isUrl ? src : fileName
            type = fname.slice(fname.lastIndexOf('.') + 1).toLowerCase()
            type = type === 'jpg' ? 'jpeg' : type
            let dataUrl = canvas.toDataURL(`image/${type}`, 0.5)
            let ind = findImg(key, dataUrl, false)
            let data = addChild(key, name, ind, isUrl ? src : null, dataUrl, {width: img.width, height: img.height})
            resolve({code: 0, data: data})
          } else {
            resolve({code: -2, data: null, msg: 'not support canvas'})
          }
        } else {
          resolve({code: 0, data: src})
        }
      } else {
        resolve({code: -1, data: null, msg: 'img width or height is invalid'})
      }
    }
    img.onerror = () => {
      resolve({code: -1, data: null, msg: 'load img error'})
    }
    img.src = src
  })
}

function addImg (group, name, file, size, isUrl) {
  return new Promise(resolve => {
    if (isUrl) {
      imgParse(group, name, file, size, true)
        .then(res => resolve(res))
    } else {
      fileParse(group, name, file, size)
        .then(res => resolve(res))
    }
  })
}

function loadingImg () {}

function loadedImg () {}

function delImg () {}

export {
  addImg,
  loadingImg,
  loadedImg,
  delImg
}
