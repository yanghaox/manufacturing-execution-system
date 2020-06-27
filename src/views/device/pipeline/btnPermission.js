export default {
  // 管道列表
  getPipeline: {
    url: '/fbi/device/pipeline',
    action: 'get'
  },
  // 新增管道
  addPipeline: {
    url: '/fbi/device/pipeline',
    action: 'post'
  },
  // 编辑管道
  editPipeline: {
    url: '/fbi/device/pipeline/{pipelineId}',
    action: 'put'
  },
  // 删除管道
  deletePipeline: {
    url: '/fbi/device/pipeline/{pipelineId}',
    action: 'delete'
  },
  // 管道物料
  getPipelineMaterial: {
    url: '/fbi/device/pipeline/material',
    action: 'get'
  }
}
