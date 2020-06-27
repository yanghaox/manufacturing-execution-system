export default class PhaseTransferFunction {
  constructor(phase) {
    this.uuid = phase.uuid || 0
    this.id = phase.id
    this.describe = phase.describe
    this.dischargeProportion = phase.dischargeProportion
    this.deviceCode = phase.deviceCode
    this.deviceId = phase.deviceId
    this.deviceName = phase.deviceName
    this.isTarget = phase.isTarget
    this.phaseName = phase.phaseName
    this.phaseType = phase.phaseType
    this.remark = phase.remark
    this.type = phase.type
    this.typeId = phase.typeId
  }
}
