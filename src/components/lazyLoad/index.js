function load (el, value) {
  var img = new Image()
  el.src = defaultImg
  img.addEventListener('load', () => {
    el.src = value
  }, {once: true})
  img.src = value
}
import defaultImg from './logo.png'
export default {
  inserted (el, bind) {
    load(el, bind.value)
  },
  update (el, bind) {
    if (bind.oldValue !== bind.value) {
      load(el, bind.value)
    }
  }
}
