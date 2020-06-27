import store from '@/store/'
const deviceFunctionCodeMap = store.state.commonConfig.deviceFunctionCodeMap

const FUNCTION_CODE_NAME_AND_COMPILE_METHOD_MAP = new Map([
  ['feedFunctionCode', 'handleFeedFunctionCompile'],
  ['controlStartFunctionCode', 'handleControlStartFunctionCompile'],
  ['controlledStartFunctionCode', 'handleControlledStartFunctionCompile'],
  ['dischargeFunctionCode', 'handleDischargeFunctionCompile'],
  ['phaseTransferFunctionCode', 'handlePhaseTransferFunctionCompile']
])

const FUNCTION_CODE_AND_COMPILE_METHOD_MAP = (function() {
  const temp = new Map()
  for (const [functionCodeName, compileMethod] of FUNCTION_CODE_NAME_AND_COMPILE_METHOD_MAP.entries()) {
    temp.set(deviceFunctionCodeMap.get(functionCodeName), compileMethod)
  }
  return temp
})()

// const PHASE = {
//   deviceId: '',
//   deviceCode: '',
//   deviceName: '',
//   remark: '',
//   typeId: '',
//   type: '',
//   id: -1,
//   parentId: undefined,
//   phaseName: '',
//   describe: '',
//   // parentPhaseCode: '',
//   isTarget: false,
//   proportion: 100,
//   remainProportion: 100,
//   currentProportion: 0,
//   phaseStepList: [],
//   attributeList: [],
//   fileList: [],
//   functionList: [],
//   functionSetting: []
// }

const PHASE_TYPE = {
  INNER_PHASE: 'innerPhase',
  OUTER_PHASE: 'outerPhase'
}

const FEED_TYPE = {
  FEED_MATERIAL: 'feedMaterial',
  FEED_OUTER_PHASE: 'feedOuterPhase'
}

// const FIELD_SET_METHOD = {
//   isTarget(target, prop, value) {
//     if (value) {
//       for (const phase of Phase.phaseData) {
//         Object.is(target, phase) ? null : phase[prop] = false
//       }
//     }
//     target[prop] = value
//   }
// }

// const FIELD_AND_SET_METHOD_MAP = new Map([['isTarget', FIELD_SET_METHOD.isTarget]])

// const handler = {
//   set(target, prop, value) {
//     if (FIELD_AND_SET_METHOD_MAP.has(prop)) {
//       FIELD_AND_SET_METHOD_MAP.get(prop)(target, prop, value)
//     } else {
//       target[prop] = value
//     }
//     return true
//   }
// }

export default class Phase {
  constructor(device, phaseType) {
    console.log('device', device)
    console.log('phaseType', phaseType)
    this.phaseType = phaseType || PHASE_TYPE.OUTER_PHASE
    this.deviceId = device.deviceId || ''
    this.deviceCode = device.deviceCode || ''
    this.deviceName = device.deviceName || ''
    this.remark = device.remark || ''
    this.typeId = device.typeId || ''
    this.type = device.type || ''
    this.quantityLowLimit = device.quantityLowLimit || 0
    this.quantityUpLimit = device.quantityUpLimit || 0
    this.id = Phase.hanldeCount(device.id)
    this.parentId = device.parentId || -1
    this.parentPhase = null
    this.phaseName = device.phaseName || ''
    this.describe = device.describe || ''
    this.isTarget = device.isTarget || false
    this.maxTep = device.maxTep || 0
    this.phaseStepList = []
    this.attributeList = device.attributeList || []
    this.fileList = device.fileList || []
    this.functionList = device.functionList || []
    this.functionSetting = device.functionSetting || []
    this.cacheDischargePool = []
    this.cachePhaseTransferPool = phaseType === PHASE_TYPE.INNER_PHASE ? {} : null
    this.alreadyCachePhaseTransferPool = phaseType === PHASE_TYPE.INNER_PHASE ? {} : null
    this.phaseCompileWarnCount = 0
    // this.parentPhaseCode = device.parentPhaseCode || ''
    // const proxy = new Proxy(this, handler)
    // Phase.phaseData.push(this)
    // Phase.proxyPhaseData.push(proxy)
    // return proxy
  }

  static hanldeCount(id) {
    if (id) {
      Phase.count = Phase.count > id ? Phase.count : id
      return id
    }
    Phase.count++
    return Phase.count
  }

  static handleClean() {
    Phase.count = 0
    Phase.phaseData = []
    Phase.proxyPhaseData = []
  }

  /* 根据id获取相别 */
  static queryPhase(id) {
    console.log('phaseData,', Phase.phaseData)
    for (const phase of Phase.phaseData) {
      if (phase.id === id) {
        return phase
      }
    }
    return null
  }

  /* 设置相别为目标 */
  setIsTarget() {
    for (const phase of Phase.phaseData) {
      phase.isTarget = Object.is(this, phase)
    }
  }

  /* 判断是否存在上级相别 */
  checkHasParentPhase() {
    return this.parentId !== -1
  }

  /* 设置上级相别 */
  handleSetParentPhase(parentId) {
    const parentPhase = Phase.queryPhase(parentId)
    this.parentPhase = parentPhase
    if (parentPhase == null) {
      this.parentId = -1
    }
  }

  /* 添加出料项 */
  handleAddCacheDischargePoolItem(phaseStepData, index = this.cacheDischargePool.length) {
    this.cacheDischargePool.splice(index, 0, phaseStepData)
    console.log('phaseStepData', phaseStepData)
    console.log('cacheDischargePool', this.cacheDischargePool)
  }

  /* 删除出料项 */
  handleDeleteCacheDischargePoolItem(phaseStepData) {
    return this.cacheDischargePool.splice(this.cacheDischargePool.indexOf(phaseStepData), 1)
  }

  /* 查找是否有该出料项 */
  handleHasCacheDischargePoolItem(phaseStepData) {
    return this.cacheDischargePool.includes(phaseStepData)
  }

  /* 清空出料项 */
  // handleCleanAllCacheDischargePoolItem() {
  //   this.cacheDischargePool.length = 0
  // }

  /* 上级相别添加未转移项 */
  handleParentPhaseAddCachePhaseTransferPoolItem(phaseStepData) {
    if (this.parentPhase) {
      this.parentPhase.handleAddCachePhaseTransferPoolItem(phaseStepData, this.cacheDischargePool)
    }
  }

  /* 上级相别删除未转移项 */
  handleParentPhaseDeleteCachePhaseTransferPoolItem(phaseStepData) {
    if (this.parentPhase) {
      this.parentPhase.handleDeleteCachePhaseTransferPoolItem(phaseStepData)
    }
  }

  /* 清除上级相别-相转移的所有当前相别 */
  handleCleanParentPhaseTransferPool() {
    if (this.parentPhase) {
      this.parentPhase.handleCleanIdPhaseTransferPool(this.id)
    }
  }

  /* 清除当前相别-指定id的所有相转移 */
  handleCleanIdPhaseTransferPool(id) {
    Reflect.deleteProperty(this.cachePhaseTransferPool, id.toString())
    Reflect.deleteProperty(this.alreadyCachePhaseTransferPool, id.toString())
  }

  /* 添加未转移项 */
  handleAddCachePhaseTransferPoolItem(phaseStepData, cacheDischargePool) {
    const { id, uuid } = phaseStepData
    if (!this.cachePhaseTransferPool.hasOwnProperty(id)) {
      this.cachePhaseTransferPool[id] = []
    }
    if (this.cachePhaseTransferPool[id].length) {
      for (const [index, discharge] of cacheDischargePool.entries()) {
        if (discharge.uuid === uuid) {
          this.cachePhaseTransferPool[id].splice(index, 0, phaseStepData)
          break
        }
      }
    } else {
      this.cachePhaseTransferPool[id].push(phaseStepData)
    }
  }

  /* 添加未转移项unshift */
  // handleAddCachePhaseTransferPoolItemUnshift(phaseStepData) {
  //   const { id } = phaseStepData
  //   if (!this.cachePhaseTransferPool.hasOwnProperty(id)) {
  //     this.cachePhaseTransferPool[id] = []
  //   }
  //   this.cachePhaseTransferPool[id].unshift(phaseStepData)
  // }

  /* 删除未转移项 */
  handleDeleteCachePhaseTransferPoolItem(phaseStepData) {
    console.log('phaseStepData', phaseStepData)
    const { id, uuid } = phaseStepData
    if (this.cachePhaseTransferPool.hasOwnProperty(id)) {
      for (const item of this.cachePhaseTransferPool[id]) {
        if (item.uuid === uuid) {
          this.cachePhaseTransferPool[id].splice(this.cachePhaseTransferPool[id].indexOf(item), 1)
          break
        }
      }
    }
  }

  /* 添加已转移项 */
  handleAddAlreadyCachePhaseTransferPoolItem(phaseStepData) {
    const { id } = phaseStepData
    if (!this.alreadyCachePhaseTransferPool.hasOwnProperty(id)) {
      this.alreadyCachePhaseTransferPool[id] = []
    }
    this.alreadyCachePhaseTransferPool[id].push(phaseStepData)
  }

  /* 删除已转移项 */
  handleDeleteAlreadyCachePhaseTransferPoolItem(phaseStepData) {
    const { id, uuid } = phaseStepData
    if (this.alreadyCachePhaseTransferPool.hasOwnProperty(id)) {
      for (const item of this.alreadyCachePhaseTransferPool[id]) {
        if (item.uuid === uuid) {
          this.alreadyCachePhaseTransferPool[id].splice(this.alreadyCachePhaseTransferPool[id].indexOf(item), 1)
          break
        }
      }
    }
  }

  /* 由phaseTree调用，相别编译 */
  handlePhaseCompile() {
    let flag = true
    this.handlePhaseCompileWarnCountClean()
    for (const phaseStep of this.phaseStepList) {
      const { functionCode } = phaseStep.functionData
      if (FUNCTION_CODE_AND_COMPILE_METHOD_MAP.has(functionCode)) {
        const state = this[FUNCTION_CODE_AND_COMPILE_METHOD_MAP.get(functionCode)](phaseStep)
        if (!state) this.handlePhaseCompileWarnCountAdd()
        phaseStep.setState(state)
        if (flag && !state) flag = state
      }
    }
    return flag
  }

  /* 处理phaseCompileWarnCount数据0 */
  handlePhaseCompileWarnCountClean() {
    this.phaseCompileWarnCount = 0
  }

  /* 处理phaseCompileWarnCount数据++ */
  handlePhaseCompileWarnCountAdd() {
    this.phaseCompileWarnCount++
  }

  /* 处理phaseCompileWarnCount数据-- */
  handlePhaseCompileWarnCountReduce() {
    this.phaseCompileWarnCount--
  }

  /* 处理控制启动编译 */
  handleControlStartFunctionCompile(phaseStepData) {
    const { id } = phaseStepData.functionalDomainData
    const phase = Phase.queryPhase(id)
    return !!phase
  }

  /* 处理被控启动编译 */
  handleControlledStartFunctionCompile(phaseStepData) {
    const { id } = phaseStepData.functionalDomainData
    const phase = Phase.queryPhase(id)
    return !!phase
  }

  /* 处理投料编译 */
  handleFeedFunctionCompile(phaseStepData) {
    const { feedType } = phaseStepData.functionalDomainData
    // 外相是否存在编译
    if (feedType === FEED_TYPE.FEED_OUTER_PHASE) {
      const phase = Phase.queryPhase(phaseStepData.functionalDomainData.id)
      return !!phase
    }
    return true
  }

  /* 处理出料编译 */
  handleDischargeFunctionCompile(phaseStepData) {
    let flag = false
    const step = phaseStepData.step
    for (let i = 0; i < step - 1; i++) {
      const { functionData, functionalDomainData } = this.phaseStepList[i]
      const { functionCode } = functionData
      if (deviceFunctionCodeMap.get('feedFunctionCode') === functionCode) { flag = true }
      if (deviceFunctionCodeMap.get('pipelineMaterialFunctionCode') === functionCode) { flag = true }
      if (deviceFunctionCodeMap.get('dischargeFunctionCode') === functionCode && functionalDomainData.dischargeProportion === 100) { flag = false }
    }
    return flag
  }

  /* 处理相转移编译 */
  handlePhaseTransferFunctionCompile(phaseStepData) {
    const step = phaseStepData.step
    const count = {} // 记录当前的转移id的索引
    for (let i = 0; i < step; i++) {
      const { functionData, functionalDomainData } = this.phaseStepList[i]
      const { functionCode } = functionData
      const { id, uuid } = functionalDomainData
      if (deviceFunctionCodeMap.get('phaseTransferFunctionCode') === functionCode) {
        count[id] = count.hasOwnProperty(id) ? count[id] + 1 : 0
        if (i === step - 1) {
          const flag = this.cachePhaseTransferPool.hasOwnProperty(id) &&
          this.cachePhaseTransferPool[id][count[id]] &&
          this.cachePhaseTransferPool[id][count[id]].uuid === uuid
          return flag
        }
      }
    }
  }
}

Phase.count = 0
Phase.phaseData = []
Phase.proxyPhaseData = []
