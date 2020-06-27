export default {
  methods: {
    /* 出料功能新增处理 */
    handleDischargeFunctionAddCommit(phaseStepData) {
      // TODO 1 dischargeProportion
      // const { dischargeProportion } = phaseStepData.functionalDomainData
      // if (dischargeProportion === 100) {
      //   this.currentPhaseStepPageData.handleCleanAllCacheDischargePoolItem()
      // }
      this.currentPhaseStepPageData.handleAddCacheDischargePoolItem(phaseStepData.functionalDomainData)

      // TODO 2 AddCachePhaseTransferPoolItem
      this.currentPhaseStepPageData.handleParentPhaseAddCachePhaseTransferPoolItem(phaseStepData.functionalDomainData)
    },

    /* 出料功能编辑处理 */
    handleDischargeFunctionEditCommit(newPhaseStepData, oldPhaseStepData) {
      // TODO 1 dischargeProportion
      // const { dischargeProportion } = newPhaseStepData.functionalDomainData
      // if (dischargeProportion === 100) {
      //   this.currentPhaseStepPageData.handleCleanAllCacheDischargePoolItem()
      // }

      let index = 0
      const phaseStepList = this.currentPhaseStepPageData.phaseStepList
      for (const phaseStep of phaseStepList) {
        const { functionData, step } = phaseStep
        if (step === oldPhaseStepData.step) break
        if (this.deviceFunctionCodeMap.get('dischargeFunctionCode') === functionData.functionCode) index++
      }
      this.currentPhaseStepPageData.handleAddCacheDischargePoolItem(newPhaseStepData.functionalDomainData, index)

      // TODO 2 AddCachePhaseTransferPoolItem
      this.currentPhaseStepPageData.handleParentPhaseAddCachePhaseTransferPoolItem(newPhaseStepData.functionalDomainData)
    },

    /* 出料功能恢复处理 */
    handleDischargeFunctionRecoveryCommit(newPhaseStepData, oldPhaseStepData) {
      // TODO 1 dischargeProportion
      if (this.currentPhaseStepPageData.handleHasCacheDischargePoolItem(oldPhaseStepData.functionalDomainData)) {
        this.currentPhaseStepPageData.handleDeleteCacheDischargePoolItem(oldPhaseStepData.functionalDomainData)
      }

      // TODO 2 DeleteCachePhaseTransferPoolItem
      this.currentPhaseStepPageData.handleParentPhaseDeleteCachePhaseTransferPoolItem(oldPhaseStepData.functionalDomainData)
      // const { dischargeProportion } = oldPhaseStepData.functionalDomainData
      // if (dischargeProportion === 100) {
      //   for (const item of this.currentPhaseStepPageData.phaseStepList) {
      //     const { functionData, functionalDomainData } = item
      //     if (functionData.functionCode === this.deviceFunctionCodeMap.get('feedFunctionCode') ||
      //     functionData.functionCode === this.deviceFunctionCodeMap.get('pipelineMaterialFunctionCode')) {
      //       this.currentPhaseStepPageData.handleAddCacheDischargePoolItem(functionalDomainData)
      //     }
      //   }
      // }
    },

    /* 出料功能删除处理 */
    handleDischargeFunctionDelCommit(phaseStepData) {
      // TODO 1 dischargeProportion
      if (this.currentPhaseStepPageData.handleHasCacheDischargePoolItem(phaseStepData.functionalDomainData)) {
        this.currentPhaseStepPageData.handleDeleteCacheDischargePoolItem(phaseStepData.functionalDomainData)
      }

      // TODO 2 DeleteCachePhaseTransferPoolItem
      this.currentPhaseStepPageData.handleParentPhaseDeleteCachePhaseTransferPoolItem(phaseStepData.functionalDomainData)
      // const { dischargeProportion } = phaseStepData.functionalDomainData
      // if (dischargeProportion === 100) {
      //   for (const item of this.currentPhaseStepPageData.phaseStepList) {
      //     const { functionData, functionalDomainData } = item
      //     if (functionData.functionCode === this.deviceFunctionCodeMap.get('feedFunctionCode') ||
      //     functionData.functionCode === this.deviceFunctionCodeMap.get('pipelineMaterialFunctionCode')) {
      //       this.currentPhaseStepPageData.handleAddCacheDischargePoolItem(functionalDomainData)
      //     }
      //   }
      // }
    }

  }
}
