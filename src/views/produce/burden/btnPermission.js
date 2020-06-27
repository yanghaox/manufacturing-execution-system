const btnPermission = {

  // 获取列表
  burdenList: {
    url: '/fbi/produce/burden/list',
    action: 'get'
  },
  // 配料过程
  processList: {
    url: '/fbi/produce/burden/process/{burdenId}',
    action: 'get'
  }
}

export default btnPermission
