function rebound (s) {
  var coeff = s > 10 ? 1.5 / Math.log(s) : 1
  return s * coeff
}

export {rebound}
