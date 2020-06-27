const METHOD_DATA = {
  dataCode: '',
  dataId: '',
  description: '',
  methodId: ''
}

export default class MethodData {
  constructor(methodData) {
    Object.assign(this, METHOD_DATA, methodData)
  }
}
