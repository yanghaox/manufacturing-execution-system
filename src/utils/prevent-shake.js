export const preventShake = function() {
  let timer = null
  return function(fn, delay) {
    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      fn.apply(this)
      timer = null
    }, delay)
  }
}

export const throttle = function(fn, delay) {
  let time = Date.now()
  return function() {
    const now = Date.now()
    if (now >= time + delay) {
      time = now
      fn.apply(this, arguments)
    }
  }
}

