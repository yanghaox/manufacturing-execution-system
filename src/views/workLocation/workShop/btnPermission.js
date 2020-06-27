export default {
  getWorkShop: {
    action: 'get',
    url: '/fbi/work-location/work-shop'
  },
  addWorkShop: {
    action: 'post',
    url: '/fbi/work-location/work-shop'
  },
  editWorkShop: {
    action: 'put',
    url: '/fbi/work-location/work-shop/{workShopId}'
  },
  deleteWorkShop: {
    action: 'delete',
    url: '/fbi/work-location/work-shop/{workShopId}'
  }
}
