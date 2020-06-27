import { addCalc, subtractCalc } from '@/utils/float-calc'
export default {
  methods: {
    /* 加管道物料功能新增处理 */
    handlePipelineMaterialFunctionAddCommit(phaseStepData) {
      console.log('phaseStepData', phaseStepData)
      const { materialId, currentProportion } = phaseStepData.functionalDomainData

      // TODO 1 formulaMaterialList
      for (const item of this.formulaMaterialList) {
        if (item.materialId === materialId) {
          item.remainProportion = subtractCalc(item.remainProportion, currentProportion)
          // TODO 2 DischargePool
          // this.currentPhaseStepPageData.handleAddCacheDischargePoolItem(material)
          break
        }
      }
    },

    /* 加管道物料功能编辑处理 */
    handlePipelineMaterialFunctionEditCommit(newPhaseStepData, oldPhaseStepData) {
      const { materialId, currentProportion } = newPhaseStepData.functionalDomainData

      // TODO 1 formulaMaterialList
      for (const item of this.formulaMaterialList) {
        if (item.materialId === materialId) {
          item.remainProportion = subtractCalc(item.remainProportion, currentProportion)
          // TODO 2 DischargePool
          // this.currentPhaseStepPageData.handleAddCacheDischargePoolItem(material)
          break
        }
      }
    },

    /* 加管道物料功能恢复处理 */
    handlePipelineMaterialFunctionRecoveryCommit(newPhaseStepData, oldPhaseStepData) {
      // TODO 1 formulaMaterialList
      const { materialId, currentProportion } = oldPhaseStepData.functionalDomainData

      for (const item of this.formulaMaterialList) {
        if (item.materialId === materialId) {
          item.remainProportion = addCalc(item.remainProportion, currentProportion)

          // TODO 2 DischargePool
          // this.currentPhaseStepPageData.handleDeleteCacheDischargePoolItem(material)
          break
        }
      }
    },

    /* 加管道物料功能删除处理 */
    handlePipelineMaterialFunctionDelCommit(phaseStepData) {
      // TODO 1 formulaMaterialList
      const { materialId, currentProportion } = phaseStepData.functionalDomainData

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
