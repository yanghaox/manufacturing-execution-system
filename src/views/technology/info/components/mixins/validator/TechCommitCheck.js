export default {
  methods: {
    /* 获取所有外相 */
    getAllOuterPhase() {
      return this.phaseData.filter(phase => {
        return phase.phaseType === 'outerPhase'
      })
    },

    /* 获取所有内相 */
    getAllInnerPhase() {
      return this.phaseData.filter(phase => {
        return phase.phaseType === 'innerPhase'
      })
    },

    /* 校验是否有目标 */
    hasTargetPhaseRules() {
      const flag = this.phaseData.some(element => {
        return element.isTarget
      })
      if (!flag) {
        this.notifyError('当前工艺没有目标产物')
      }
      return flag
    },

    /* 判断是否已经用完物料 */
    notHasSurplusMaterialRules() {
      for (const material of this.formulaMaterialList) {
        if (material.remainProportion !== 0) {
          this.notifyError(`${material.materialName}没有使用完，剩余比例${material.remainProportion}%`)
          return false
        }
      }
      return true
    },

    /* 所有相别已经构建关系 */
    hasAllPhaseStructureRelationRules() {
      for (const phase of this.phaseData) {
        const { parentId, isTarget, phaseName } = phase
        if (!isTarget && parentId === undefined) {
          this.notifyError(`${phaseName}没有上级相别，请先设置上级相别或删除，再提交`)
          return false
        }
      }
      return true
    },

    /* 外相是否已投完 */
    notHasSurplusOuterPhaseFeedRules() {
      for (const outerPhase of this.getAllOuterPhase()) {
        const { id, parentId, phaseName } = outerPhase
        for (const phase of this.phaseData) {
          if (phase.id === parentId) {
            const flag = phase.phaseStepList.some(phaseStepData => {
              const { describe, functionData, methodData, parameterDataList, functionalDomainData } = phaseStepData
              return this.deviceFunctionCodeMap.get('feedFunctionCode') === functionData.functionCode &&
                functionalDomainData.feedType === 'feedOuterPhase' &&
                functionalDomainData.id === id
            })

            if (!flag) {
              this.notifyError(`外相：${phaseName}，还未使用`)
              return false
            }
          }
        }
      }
      return true
    },

    /* 内相是否已出料 */
    notHasSurplusInnerPhaseDischargeRules() {
      for (const innerPhase of this.getAllInnerPhase()) {
        let flag = true
        const { phaseName, phaseStepList } = innerPhase

        for (let i = 0, len = phaseStepList.length; i < len; i++) {
          const { functionData, functionalDomainData } = phaseStepList[i]
          const { functionCode } = functionData
          if (this.deviceFunctionCodeMap.get('feedFunctionCode') === functionCode) { flag = false }
          if (this.deviceFunctionCodeMap.get('pipelineMaterialFunctionCode') === functionCode) { flag = false }
          if (this.deviceFunctionCodeMap.get('dischargeFunctionCode') === functionCode && functionalDomainData.dischargeProportion === 100) { flag = true }
        }

        if (!flag) {
          this.notifyError(`内相：${phaseName}，未完全出料`)
          return false
        }
      }
      return true
    },

    /* 内相是否已相转移 */
    notHasSurplusInnerPhaseTransferRules() {
      for (const innerPhase of this.getAllInnerPhase()) {
        const { cachePhaseTransferPool, alreadyCachePhaseTransferPool, phaseName } = innerPhase
        for (const cKey in cachePhaseTransferPool) {
          if (cachePhaseTransferPool[cKey].length === 0) continue
          if (!alreadyCachePhaseTransferPool.hasOwnProperty(cKey) || alreadyCachePhaseTransferPool[cKey].length !== cachePhaseTransferPool[cKey].length) {
            this.notifyError(`内相：${phaseName}，未完全相转移`)
            return false
          }
        }
      }
      return true
    }
  }
}
