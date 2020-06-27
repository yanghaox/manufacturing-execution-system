import { addCalc, subtractCalc } from '@/utils/float-calc'
const FEED_TYPE = {
  feedMaterial: {
    add: 'handleAddFeedMaterial',
    edit: 'handleEditFeedMaterial',
    recovery: 'handleRecoveryFeedMaterial',
    delete: 'handleDeleteFeedMaterial'
  },
  feedOuterPhase: null
}
export default {
  methods: {
    /* 投料功能新增处理 */
    handleFeedFunctionAddCommit(phaseStepData) {
      if (FEED_TYPE[phaseStepData.functionalDomainData.feedType]) {
        this[FEED_TYPE[phaseStepData.functionalDomainData.feedType]['add']](phaseStepData)
      }
    },

    /* 处理投料新增（物料） */
    handleAddFeedMaterial(phaseStepData) {
      for (const material of phaseStepData.functionalDomainData.feedData) {
        const { materialId, currentProportion } = material

        // TODO 1 formulaMaterialList
        for (const item of this.formulaMaterialList) {
          if (item.materialId === materialId) {
            item.remainProportion = subtractCalc(item.remainProportion, currentProportion)
            // TODO 2 DischargePool
            // this.currentPhaseStepPageData.handleAddCacheDischargePoolItem(material)
            break
          }
        }
      }
    },

    /* 投料功能编辑处理 */
    handleFeedFunctionEditCommit(newPhaseStepData, oldPhaseStepData) {
      if (FEED_TYPE[newPhaseStepData.functionalDomainData.feedType]) {
        this[FEED_TYPE[newPhaseStepData.functionalDomainData.feedType]['edit']](newPhaseStepData, oldPhaseStepData)
      }
    },

    /* 处理投料编辑（物料） */
    handleEditFeedMaterial(newPhaseStepData, oldPhaseStepData) {
      for (const material of newPhaseStepData.functionalDomainData.feedData) {
        const { materialId, currentProportion } = material

        // TODO 1 formulaMaterialList
        for (const item of this.formulaMaterialList) {
          if (item.materialId === materialId) {
            item.remainProportion = subtractCalc(item.remainProportion, currentProportion)
            // TODO 2 DischargePool
            // this.currentPhaseStepPageData.handleAddCacheDischargePoolItem(material)
            break
          }
        }
      }
    },

    /* 投料功能恢复处理 */
    handleFeedFunctionRecoveryCommit(newPhaseStepData, oldPhaseStepData) {
      if (FEED_TYPE[oldPhaseStepData.functionalDomainData.feedType]) {
        this[FEED_TYPE[oldPhaseStepData.functionalDomainData.feedType]['recovery']](newPhaseStepData, oldPhaseStepData)
      }
    },

    /* 处理投料恢复（物料） */
    handleRecoveryFeedMaterial(newPhaseStepData, oldPhaseStepData) {
      // TODO 1 formulaMaterialList
      for (const material of oldPhaseStepData.functionalDomainData.feedData) {
        const { materialId, currentProportion } = material

        for (const item of this.formulaMaterialList) {
          if (item.materialId === materialId) {
            item.remainProportion = addCalc(item.remainProportion, currentProportion)

            // TODO 2 DischargePool
            // this.currentPhaseStepPageData.handleDeleteCacheDischargePoolItem(material)
            break
          }
        }
      }
    },

    /* 投料功能删除处理 */
    handleFeedFunctionDelCommit(phaseStepData) {
      if (FEED_TYPE[phaseStepData.functionalDomainData.feedType]) {
        this[FEED_TYPE[phaseStepData.functionalDomainData.feedType]['delete']](phaseStepData)
      }
    },

    /* 处理投料删除（物料） */
    handleDeleteFeedMaterial(phaseStepData) {
      // TODO 1 formulaMaterialList
      for (const material of phaseStepData.functionalDomainData.feedData) {
        const { materialId, currentProportion } = material

        for (const item of this.formulaMaterialList) {
          if (item.materialId === materialId) {
            item.remainProportion = addCalc(item.remainProportion, currentProportion)

            // TODO 2 DischargePool
            // this.currentPhaseStepPageData.handleDeleteCacheDischargePoolItem(material)
            break
          }
        }
      }
    }
  }
}
