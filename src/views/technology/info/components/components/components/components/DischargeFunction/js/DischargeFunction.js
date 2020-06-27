export default class DischargeFunction {
  constructor(phaseData) {
    this.uuid = phaseData.uuid || 0
    this.dischargeProportion = phaseData.dischargeProportion || 0
    this.describe = phaseData.describe || ''
    this.deviceCode = phaseData.deviceCode || ''
    this.deviceId = phaseData.deviceId || ''
    this.deviceName = phaseData.deviceName || ''
    this.id = phaseData.id || -1
    this.isTarget = phaseData.isTarget || false
    this.phaseName = phaseData.phaseName || ''
    this.phaseType = phaseData.phaseType || ''
    this.remark = phaseData.remark || ''
    this.type = phaseData.type || ''
    this.typeId = phaseData.typeId || ''
  }
}

