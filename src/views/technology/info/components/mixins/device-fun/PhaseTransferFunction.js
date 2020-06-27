export default {
  methods: {
    /* 相转移功能新增处理 */
    handlePhaseTransferFunctionAddCommit(phaseStepData) {
      // TODO 1 DeleteCachePhaseTransferPoolItem
      // this.currentPhaseStepPageData.handleDeleteCachePhaseTransferPoolItem(phaseStepData.functionalDomainData)

      // TODO 2 AddAlreadyCachePhaseTransferPoolItem
      this.currentPhaseStepPageData.handleAddAlreadyCachePhaseTransferPoolItem(phaseStepData.functionalDomainData)
    },

    /* 相转移功能编辑处理 */
    handlePhaseTransferFunctionEditCommit(newPhaseStepData, oldPhaseStepData) {
      // TODO 1 DeleteCachePhaseTransferPoolItem
      // this.currentPhaseStepPageData.handleDeleteCachePhaseTransferPoolItem(newPhaseStepData.functionalDomainData)

      // TODO 2 AddAlreadyCachePhaseTransferPoolItem
      this.currentPhaseStepPageData.handleAddAlreadyCachePhaseTransferPoolItem(newPhaseStepData.functionalDomainData)
    },

    /* 相转移功能恢复处理 */
    handlePhaseTransferFunctionRecoveryCommit(newPhaseStepData, oldPhaseStepData) {
      // TODO 1 DeleteAlreadyCachePhaseTransferPoolItem
      this.currentPhaseStepPageData.handleDeleteAlreadyCachePhaseTransferPoolItem(oldPhaseStepData.functionalDomainData)

      // TODO 2 AddCachePhaseTransferPoolItemUnshift
      // this.currentPhaseStepPageData.handleAddCachePhaseTransferPoolItemUnshift(oldPhaseStepData.functionalDomainData)
    },

    /* 相转移功能删除处理 */
    handlePhaseTransferFunctionDelCommit(phaseStepData) {
      // TODO 1 DeleteAlreadyCachePhaseTransferPoolItem
      this.currentPhaseStepPageData.handleDeleteAlreadyCachePhaseTransferPoolItem(phaseStepData.functionalDomainData)

      // TODO 2 AddCachePhaseTransferPoolItemUnshift
      // this.currentPhaseStepPageData.handleAddCachePhaseTransferPoolItemUnshift(phaseStepData.functionalDomainData)
    }
  }
}
