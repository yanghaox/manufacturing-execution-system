const btnPermission = {
  // 获取列表
  typeList: {
    url: '/fbi/produce/type',
    action: 'get'
  },
  // 新增
  addType: {
    url: '/fbi/produce/type',
    action: 'post'
  },
  // 修改
  editType: {
    url: '/fbi/produce/type/{typeId}',
    action: 'put'
  },
  // 删除
  deleteType: {
    url: '/fbi/produce/type/{typeId}',
    action: 'delete'
  }
}

export default btnPermission
