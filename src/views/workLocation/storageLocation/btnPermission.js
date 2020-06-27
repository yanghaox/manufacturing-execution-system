export default {
  getStorageLocation: {
    action: 'get',
    url: '/fbi/work-location/storage-location'
  },
  addStorageLocation: {
    action: 'post',
    url: '/fbi/work-location/storage-location'
  },
  editStorageLocation: {
    action: 'put',
    url: '/fbi/work-location/storage-location/{storageLocationId}'
  },
  deleteStorageLocation: {
    action: 'delete',
    url: '/fbi/work-location/storage-location/{storageLocationId}'
  }
}
