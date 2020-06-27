export default {
  getWorkLocation: {
    action: 'get',
    url: '/fbi/work-location/work-location'
  },
  addWorkLocation: {
    action: 'post',
    url: '/fbi/work-location/work-location'
  },
  editWorkLocation: {
    action: 'put',
    url: '/fbi/work-location/work-location/{workLocationId}'
  },
  deleteWorkLocation: {
    action: 'delete',
    url: '/fbi/work-location/work-location/{workLocationId}'
  }
}
