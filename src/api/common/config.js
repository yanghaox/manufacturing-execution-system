import request from '@/utils/request'
// const baseURL = 'http://172.16.1.141:3000/mock/17'
const baseURL = ''

// 获取设备全局配置
export function getCommonConfigDevice() {
  return request({
    url: '/fbi/common/config/device/function',
    method: 'get',
    baseURL
  })
}

// 判断该设备是否为秤类型
export function checkDeviceType(typeId) {
  return request({
    url: `/fbi/common/config/device/type/${typeId}`,
    method: 'get',
    baseURL
  })
}
