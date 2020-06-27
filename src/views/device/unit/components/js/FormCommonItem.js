export default class FormCommonItem {
  constructor(formItem) {
    this.type = formItem.type
    this.label = formItem.label
    this.selectItems = formItem.selectItems || []
    this.rules = formItem.rules || []

    this.fieldName = formItem.fieldName
    this.rolling = false
    this.parent = null
    this.form = null
  }

  /* 添加 rolling 时显示表单项 */
  add() {
    throw new Error('FormCommonItem not add')
  }

  /* 执行 rolling 视图显示表单项 */
  rollingProcess() {
    throw new Error('FormCommonItem not rollingProcess')
  }

  /* 清除缓存/视图 rolling 时显示表单项 */
  cleanSubFormItem() {
    throw new Error('FormCommonItem not cleanSubFormItem')
  }
}
