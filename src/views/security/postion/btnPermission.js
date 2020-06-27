export default {
  postionList: {
    action: 'get',
    url: '/fbi/security/postion'
  },
  addPostion: {
    action: 'post',
    url: '/fbi/security/postion'
  },
  editPostion: {
    action: 'put',
    url: '/fbi/security/postion/{id}'
  },
  batchDeletePostion: {
    action: 'delete',
    url: '/fbi/security/postion/batch'
  },
  deletePostion: {
    action: 'delete',
    url: '/fbi/security/postion/{id}'
  }
}

