export const generateNotRepeatString = (function() {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  const uuidList = []
  return function(len, radix = chars.length) {
    console.log('uuidList', uuidList)
    const uuidStr = generateAlgorithm(len, radix, uuidList, chars)
    uuidList.push(uuidStr)
    return uuidStr
  }
})()

function generateAlgorithm(len, radix, uuidList, chars) {
  const uuid = []
  for (let i = 0; i < len; i++) {
    const index = Math.floor(Math.random(0, 1) * radix)
    uuid.push(chars[index])
  }
  let uuidStr = uuid.join('')
  if (uuidList.includes(uuidStr)) {
    uuidStr = generateAlgorithm(len, radix, uuidList, chars)
  }
  return uuidStr
}
