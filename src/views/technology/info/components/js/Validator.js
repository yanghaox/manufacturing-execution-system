export default class Validator {
  constructor() {
    this.checkList = []
  }

  static getInstance() {
    if (!Validator.instance) {
      Validator.instance = new Validator()
    }
    Validator.instance.checkList.length = 0
    return Validator.instance
  }

  add(rules) {
    this.checkList.push(rules)
  }

  execute(data) {
    for (let i = 0, len = this.checkList.length; i < len; i++) {
      const rules = this.checkList[i]
      if (!rules.call(this, data)) return false
    }
    return true
  }
}
