function computedText (a, b) {
  return '123'
}
function computedInfo (time) {
  return time[2] % 3 === 0 ? 'haha' : 'hehh'
}
function computedValid (time) {
  return time[2] % 6 === 0
}
export {computedText, computedInfo, computedValid}
