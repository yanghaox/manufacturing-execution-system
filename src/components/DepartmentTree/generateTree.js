function generateTree(params) {
  const result = []
  for (const param of params) {
    if (param.parentDepartmentId === '0') {
      const parent = {
        id: param.departmentId,
        label: param.departmentName,
        parentDepartmentId: param.parentDepartmentId,
        description: param.description
      }
      parent.children = getChildNodes(param.departmentId, params)
      result.push(parent)
    }
  }
  return result
}
function getChildNodes(id, array) {
  const childs = []
  for (const arr of array) {
    if (arr.parentDepartmentId === id) {
      const child = {
        id: arr.departmentId,
        label: arr.departmentName,
        parentDepartmentId: arr.parentDepartmentId,
        description: arr.description
      }
      child.children = getChildNodes(arr.departmentId, array)
      childs.push(child)
    }
  }
  return childs
}

export { generateTree }
