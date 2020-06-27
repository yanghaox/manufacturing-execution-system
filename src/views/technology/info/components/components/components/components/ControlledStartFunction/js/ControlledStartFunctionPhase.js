export default class ControlledStartFunctionPhase {
  constructor(phase) {
    this.id = phase.id
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
