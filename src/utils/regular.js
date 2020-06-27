/**
 * 正则文件
 */

// 验证IP地址正则
export const isIpAddress = v => {
  const exp = /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/g
  return exp.test(v)
}

// 验证实数
export const isRealNumber = v => {
  const regPos = /^\d+(\.\d+)?$/
  const regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/
  if (regPos.test(v) || regNeg.test(v)) return true
  return false
}

// 验证整数
export const isIntNumber = v => {
  const regPos = /^(0|[1-9]\d{0,9})$/
  const regNeg = /^-[1-9][0-9]*$/
  if (regPos.test(v) || regNeg.test(v)) return true
  return false
}

// 验证非负数
export const isNonnegativeNumber = v => {
  const exp = /^[0-9]?[1-9]*[0-9]*\.?[0-9]*$/
  return exp.test(v)
}

// 验证空字符串
export const isEmpty = v => {
  const exp = /^\s*$/
  return exp.test(v)
}

// 验证正数、负数、小数
export const isNumber = v => {
  // const exp = /^(\-|\+)?[0-9]+(\.[0-9]+)?$/
  const exp = /^(\-|\+)?[0-9]?[1-9]*[0-9]*\.?[0-9]*$/
  return exp.test(v)
}

// 是否存在中文字符
export const hasZh = v => {
  const exp = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g
  return exp.test(v)
}
