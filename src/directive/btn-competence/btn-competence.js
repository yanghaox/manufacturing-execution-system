export const checkPermission = function(el, binding, permissions) {
  const displayKey = binding.value
  if (Array.isArray(displayKey)) {
    for (const value of displayKey) {
      checkPermission(el, { value }, permissions)
    }
  } else if (!displayKey) {
    throw new Error('#####>Permission key is not null.<#####')
  } else {
    const arr = []
    permissions[displayKey.action.toLowerCase()].forEach(item => {
      arr.push(item.url)
    })
    const urlSet = new Set(arr)
    if (!urlSet.has(displayKey.url)) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}
