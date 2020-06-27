import * as regular from './regular'

// ============================ form 表单校验规则 =========================================================
export const validIp = (rule, value, callback) => {
  if (value && !regular.isIpAddress(value)) {
    callback(new Error('请输入正确的ip地址 x.x.x.x (0 < x < 256)'))
  } else {
    callback()
  }
}

export const validNumber = (rule, value, callback) => {
  if (value && !regular.isRealNumber(value)) {
    callback(new Error('请输入实数'))
  } else {
    callback()
  }
}

export const validIntNumber = (rule, value, callback) => {
  if (value && !regular.isIntNumber(value)) {
    callback(new Error('请输入整数'))
  } else {
    callback()
  }
}

export const checkZh = (rule, value, callback) => {
  if (value && regular.hasZh(value)) {
    callback(new Error('禁止输入中文字符'))
  } else {
    callback()
  }
}

// =========================== javascript 正则 ===========================================

// 验证IP地址
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

// sp：不要继续在该文件添加正则，正则添加在 regular.js 文件
