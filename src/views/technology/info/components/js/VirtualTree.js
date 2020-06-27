export default class VirtualTree {
  constructor(phaseData) {
    this.phaseData = phaseData
    this.treeList = this.initTree(phaseData)
  }

  /* 获取 tree 头部 */
  getTreeHeader(parentId) {
    return parentId === -1
  }

  /* 初始化 tree 结构 */
  initTree(phaseData) {
    const result = []

    for (const phase of phaseData) {
      const { id, parentId } = phase
      if (this.getTreeHeader(parentId)) {
        const children = this.getSubTree(phaseData, id)
        result.push({ id, children })
      }
    }
    return result
  }

  /* 获取子 tree 结构 */
  getSubTree(phaseData, parentId) {
    const result = []

    for (const phase of phaseData) {
      if (phase.parentId === parentId) {
        const id = phase.id
        const children = this.getSubTree(phaseData, id)
        result.push({ id, children })
      }
    }
    return result
  }

  /* tree 前序遍历 */
  treeListBefore(callbackFn, treeList = this.treeList) {
    for (const node of treeList) {
      const { id, children } = node

      // TODO
      callbackFn(this.phaseData, id)

      if (children && children.length > 0) {
        return this.treeListBefore(callbackFn, children)
      }
    }
  }

  /* tree 后序遍历 */
  treeListAfter(callbackFn, treeList = this.treeList) {
    for (const node of treeList) {
      const { id, children } = node

      if (children && children.length > 0) {
        this.treeListAfter(callbackFn, children)
      }

      // TODO
      callbackFn(this.phaseData, id)
    }
  }
}

