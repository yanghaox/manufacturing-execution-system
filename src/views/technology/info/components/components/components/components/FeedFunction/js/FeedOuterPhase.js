export default class FeedOuterPhase {
  constructor(phase) {
    this.feedType = 'feedOuterPhase'
    this.id = phase.id
    this.phaseName = phase.phaseName
    this.describe = phase.describe
    this.deviceCode = phase.deviceCode
    this.deviceId = phase.deviceId
    this.deviceName = phase.deviceName
    this.quantityLowLimit = phase.quantityLowLimit
    this.quantityUpLimit = phase.quantityUpLimit
    this.maxTep = phase.maxTep
    this.remark = phase.remark
    this.type = phase.type
    this.typeId = phase.typeId
  }
}
