export default {
  methods: {
    /* 处理加管道物料功能设置编辑 */
    handleDeviceFunSetPipelineMaterialEdit(value) {
      const res = []
      for (const item of value.materialPipeLineList) {
        const { materialId, pipelineIdSet } = item
        for (const pipelineId of pipelineIdSet) {
          res.push([materialId, pipelineId])
        }
      }
      this.currentDeviceUnitFunSettingData.pipelineMaterialFunctionCode = res
    },

    /* 处理提交加管道物料功能设置添加 */
    handleDeviceFunSetPipelineMaterialAdd(functionId) {
      const map = new Map()
      const obj = {
        functionId,
        materialPipeLineList: []
      }

      for (const [materialId, pipelineId] of this.currentDeviceUnitFunSettingData['pipelineMaterialFunctionCode']) {
        if (map.has(materialId)) {
          map.get(materialId).push(pipelineId)
        } else {
          map.set(materialId, [pipelineId])
        }
      }

      for (const [materialId, pipelineIdSet] of map.entries()) {
        obj.materialPipeLineList.push({
          materialId,
          pipelineIdSet
        })
      }
      return obj
    }
  }
}
