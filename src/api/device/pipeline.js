import request from '@/utils/request'
// const baseURL = 'http://172.16.1.141:3000/mock/17'
const baseURL = ''

// 管道列表
export function getPipeline() {
  return request({
    url: '/fbi/device/pipeline',
    method: 'get',
    baseURL
  })
}

// 新增管道
export function addPipeline(data) {
  return request({
    url: `/fbi/device/pipeline`,
    method: 'post',
    data,
    baseURL
  })
}

// 编辑管道
export function editPipeline(data, pipelineId) {
  return request({
    url: `/fbi/device/pipeline/${pipelineId}`,
    method: 'put',
    data,
    baseURL
  })
}

// 删除管道
export function deletePipeline(pipelineId) {
  return request({
    url: `/fbi/device/pipeline/${pipelineId}`,
    method: 'delete',
    baseURL
  })
}

// 管道物料
export function getPipelineMaterial() {
  return request({
    url: '/fbi/device/pipeline/material',
    method: 'get',
    baseURL
  })
}
