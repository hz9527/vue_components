function rebound (curS, m) {
  var s = curS + m
  var coeff = s > 10 ? 1.5 / Math.log(s) : 1
  return m * coeff
}

export {rebound}
