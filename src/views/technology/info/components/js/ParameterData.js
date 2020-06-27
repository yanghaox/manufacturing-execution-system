const PARAMETER_DATA = {
  parameterId: '',
  parameterName: '',
  unit: '',
  valueMax: 0,
  valueMin: 0,
  parameterValue: 0
}

export default class ParameterData {
  constructor(parameterData) {
    Object.assign(this, PARAMETER_DATA, parameterData)
  }
}
