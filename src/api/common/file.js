import request from '@/utils/request'

// 下载文件
export function downLoad(id) {
  return request({
    url: `/fbi/common/file/download/${id}`,
    method: 'get'
  })
}
