export default class FeedMaterial {
  constructor(material) {
    this.currentProportion = material.currentProportion || 0
    this.scale = material.scale || 0
    this.pipelineId = material.pipelineId || ''
    this.errorRate = material.errorRate || 0
    this.materialCode = material.materialCode || ''
    this.materialId = material.materialId || ''
    this.materialName = material.materialName || ''
    this.proportion = material.proportion || 0
    this.remainProportion = material.remainProportion || 0
    this.remark = material.remark || ''
    this.type = material.type || ''
    this.unit = material.unit || ''
  }
}
