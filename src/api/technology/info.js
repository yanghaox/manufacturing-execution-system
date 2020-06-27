import request from '@/utils/request'
// const baseURL = 'http://172.16.1.141:3000/mock/17'
const baseURL = ''

// ------------------------------------工艺------------------------------------

// 获取部门列表
export function getDepartmentList() {
  return request({
    url: '/fbi/tech/info/department',
    method: 'get',
    baseURL
  })
}

// 获取bom列表
export function getBomList() {
  return request({
    url: '/fbi/tech/info/bom',
    method: 'get',
    baseURL
  })
}

// 获取bom版本列表
export function getBomVersionList(bomId) {
  return request({
    url: `/fbi/tech/info/bomVersion/${bomId}`,
    method: 'get',
    baseURL
  })
}

// 获取设备组列表
export function getDeviceGroupList() {
  return request({
    url: '/fbi/tech/info/group',
    method: 'get',
    baseURL
  })
}

// 获取工艺列表
export function getTechList(params) {
  return request({
    url: '/fbi/tech/info',
    method: 'get',
    params,
    baseURL
  })
}

// 新增工艺
export function addTech(data) {
  return request({
    url: '/fbi/tech/info',
    method: 'post',
    data,
    baseURL
  })
}

// 修改工艺
export function editTech(data, techId) {
  return request({
    url: `/fbi/tech/info/${techId}`,
    method: 'put',
    data,
    baseURL
  })
}

// 删除工艺
export function delTech(techId) {
  return request({
    url: `/fbi/tech/info/${techId}`,
    method: 'delete',
    baseURL
  })
}

// ------------------------------------工艺版本------------------------------------

// 根据设备组标识获取设备单元列表
export function getDeviceUnitList(groupId) {
  return request({
    url: `/fbi/tech/version/deviceGroup/${groupId}`,
    method: 'get',
    baseURL
  })
}

// 根据设备标识获取功能方式列表
export function getDeviceUnitFunMethodList(deviceId) {
  return request({
    url: `/fbi/tech/version/device/${deviceId}`,
    method: 'get',
    baseURL
  })
}

// 根据设备编号获取外相设备详情
export function getDeviceUnitOuterPhase(deviceCode) {
  return request({
    url: `/fbi/tech/version/device-unit/${deviceCode}`,
    method: 'get',
    baseURL
  })
}

// 根据管道id获取管道详情
export function getPipelineDetail(pipelineId) {
  return request({
    url: `/fbi/tech/version/pipeline/${pipelineId}`,
    method: 'get',
    baseURL
  })
}

// 获取bom版本详情
export function getBomVersionDetail(bomVersionId) {
  return request({
    url: `/fbi/tech/version/bom-version-detail/${bomVersionId}`,
    method: 'get',
    baseURL
  })
}

// 获取工艺版本详情
export function getTechVersionDetail(techVersionId) {
  return request({
    url: `/fbi/tech/version/techData/${techVersionId}`,
    method: 'get',
    baseURL
  })
}

// 获取工艺版本表数据
export function getTechVersionList(techId) {
  return request({
    url: `/fbi/tech/info/version/${techId}`,
    method: 'get',
    baseURL
  })
}

// 新增工艺版本
export function addTechVersion(data) {
  return request({
    url: '/fbi/tech/version',
    method: 'post',
    data,
    baseURL
  })
}

// 修改工艺版本
export function editTechVersion(data, techVersionId) {
  return request({
    url: `/fbi/tech/version/${techVersionId}`,
    method: 'put',
    data,
    baseURL
  })
}

// 删除工艺版本
export function delTechVersion(techVersionId) {
  return request({
    url: `/fbi/tech/version/${techVersionId}`,
    method: 'delete',
    baseURL
  })
}

// ------------------------------------导入导出------------------------------------

// 导出excel
export function exportExcel(techVersionId) {
  return request({
    url: `/fbi/tech/version/export/${techVersionId}`,
    method: 'get',
    responseType: 'blob',
    baseURL
  })
}

// 导出excel模板
export function exportExcelTemplate(techId) {
  return request({
    url: '/fbi/tech/version/exportTemplate',
    method: 'get',
    responseType: 'blob',
    baseURL
  })
}

// 导入excel
export function importExcel(data, params) {
  return request({
    url: `/fbi/tech/version/import`,
    method: 'post',
    params,
    data,
    baseURL
  })
}

// ------------------------------------草稿------------------------------------
// 获取草稿
export function getDraftList(params) {
  return request({
    url: '/fbi/tech/draft',
    method: 'get',
    params,
    baseURL
  })
}

// 获取草稿详情
export function getDraftDetail(draftId) {
  return request({
    url: `/fbi/tech/draft/techData/${draftId}`,
    method: 'get',
    baseURL
  })
}

// 添加草稿
export function addDraft(data) {
  return request({
    url: '/fbi/tech/draft',
    method: 'post',
    data,
    baseURL
  })
}

// 删除草稿
export function deleteDraft(draftId) {
  return request({
    url: `/fbi/tech/draft/${draftId}`,
    method: 'delete',
    baseURL
  })
}

// ------------------------------------工艺版本审核------------------------------------
// 工艺版本审核通过
export function examineTechVersionPassed(techVersionId) {
  return request({
    url: `/fbi/tech/version/passed/${techVersionId}`,
    method: 'put',
    baseURL
  })
}

// 工艺版本审核失败
export function examineTechVersionFailure(techVersionId) {
  return request({
    url: `/fbi/tech/version/failure/${techVersionId}`,
    method: 'put',
    baseURL
  })
}

// 工艺版本审核作废
export function examineTechVersionInvalid(techVersionId) {
  return request({
    url: `/fbi/tech/version/invalid/${techVersionId}`,
    method: 'put',
    baseURL
  })
}
