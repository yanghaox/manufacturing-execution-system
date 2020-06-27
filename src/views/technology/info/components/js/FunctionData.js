const FUNCTION_DATA = {
  functionCode: '',
  functionId: '',
  functionName: ''
}

export default class FunctionData {
  constructor(functionData) {
    Object.assign(this, FUNCTION_DATA, functionData)
  }
}
