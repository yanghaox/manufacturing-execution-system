export default class PhaseStep {
  constructor(phaseStep) {
    const { describe, functionData, methodData, parameterDataList, functionalDomainData } = phaseStep
    this.step = -1
    this.state = true
    this.describe = describe || ''
    this.functionData = functionData || {}
    this.methodData = methodData || {}
    this.parameterDataList = parameterDataList || []
    this.functionalDomainData = functionalDomainData || {}
  }

  setState(state) {
    this.state = state
  }
}
