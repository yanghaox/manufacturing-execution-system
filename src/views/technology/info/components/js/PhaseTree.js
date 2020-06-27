export default class PhaseTree {
  constructor(phaseData, singlePhase) {
    this.phaseData = phaseData
    this.treeList = singlePhase ? this.initSinglePhaseTree(phaseData, singlePhase) : this.initAllPhaseTree(phaseData)
  }

  /* 初始化单个相别tree */
  initSinglePhaseTree(phaseData, singlePhase) {
    const treeList = []
    for (const phase of phaseData) {
      const { id, parentId } = phase
      if (parentId === singlePhase.id) {
        const children = this.getSubPhase(phaseData, id)
        treeList.push({ id, children })
      }
    }
    return treeList
  }

  /* 初始化所有相别tree */
  initAllPhaseTree(phaseData) {
    const treeList = []
    for (const phase of phaseData) {
      const { id } = phase
      if (!phase.checkHasParentPhase()) {
        const children = this.getSubPhase(phaseData, id)
        treeList.push({ id, children })
      }
    }
    return treeList
  }

  /* 获取子相别id */
  getSubPhase(phaseData, parentId) {
    const subList = []
    for (const phase of phaseData) {
      if (phase.parentId === parentId) {
        const id = phase.id
        const children = this.getSubPhase(phaseData, id)
        subList.push({ id, children })
      }
    }
    return subList
  }

  /* 开始编译 */
  startCompilePhase() {
    return this.handleTreeListAndCompilePhase(this.treeList)
  }

  /* 从子相别开始编译 */
  handleTreeListAndCompilePhase(treeList) {
    let flag = true
    for (const treeNode of treeList) {
      const { id, children } = treeNode
      if (children.length > 0) {
        const state = this.handleTreeListAndCompilePhase(children)
        flag = flag ? state : flag
      }
      const state = this.handlePhaseCompile(id)
      flag = flag ? state : flag
    }
    return flag
  }

  /* 通过id获取相别 */
  getPhaseData(id) {
    for (const phase of this.phaseData) {
      if (phase.id === id) {
        return phase
      }
    }
  }

  /* 处理相别编译 */
  handlePhaseCompile(id) {
    const phase = this.getPhaseData(id)
    const state = phase.handlePhaseCompile()
    return state
  }
}
