export default {
  getMaterial: {
    action: 'get',
    url: '/fbi/formula/material'
  },
  addMaterial: {
    action: 'post',
    url: '/fbi/formula/material'
  },
  editMaterial: {
    action: 'put',
    url: '/fbi/formula/material/{id}'
  },
  deleteMaterial: {
    action: 'delete',
    url: '/fbi/formula/material/{id}'
  },
  batchDeleteMaterial: {
    action: 'delete',
    url: '/fbi/formula/material/batch'
  }
}
