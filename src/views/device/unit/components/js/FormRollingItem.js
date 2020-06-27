export default class FormRollingItem {
  constructor(formItem) {
    this.type = formItem.type
    this.label = formItem.label
    this.selectItems = formItem.selectItems || []
    this.rules = formItem.rules || []

    this.fieldName = formItem.fieldName
    this.rolling = true
    this.parent = null
    this.form = null
    this.rollingFn = formItem.rollingFn
    this.subFormItemObj = {}
  }

  /* 添加 rolling 时显示表单项 */
  add(fieldName, subFormItem) {
    subFormItem.parent = this
    subFormItem.form = this.form
    this.subFormItemObj[fieldName] = subFormItem
    this.form.add(fieldName, subFormItem)
  }

  /* 执行 rolling 视图显示表单项 */
  rollingProcess(optionValue) {
    return this.rollingFn(optionValue).then(() => {
      for (const fieldName in this.subFormItemObj) {
        if (this.subFormItemObj.hasOwnProperty(fieldName)) {
          if (this.subFormItemObj[fieldName].rolling) {
            this.subFormItemObj[fieldName].rollingProcess(optionValue)
          }
        }
      }
    })
  }

  /* 清除缓存/视图 rolling 时显示表单项 */
  cleanSubFormItem() {
    for (const fieldName in this.subFormItemObj) {
      if (this.subFormItemObj.hasOwnProperty(fieldName)) {
        if (this.subFormItemObj[fieldName] instanceof FormRollingItem) this.subFormItemObj[fieldName].cleanSubFormItem()
        this.form.removeFieldName(fieldName)
      }
    }
    this.subFormItemObj = {}
  }
}
