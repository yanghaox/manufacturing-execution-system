import Vue from 'vue'
export default class Form {
  constructor(optionValue) {
    this.subFormItemValue = optionValue || {}
    this.subFormItemObj = {}
    this.parent = null
  }

  /* 添加显示表单项 */
  add(fieldName, subFormItem) {
    subFormItem.parent = this
    subFormItem.form = this
    if (!this.subFormItemValue.hasOwnProperty(fieldName)) {
      Vue.set(this.subFormItemValue, fieldName, undefined)
    }
    Vue.set(this.subFormItemObj, fieldName, subFormItem)
  }

  /* 根据 fieldName 移除显示表单项 */
  removeFieldName(fieldName) {
    if (this.subFormItemObj.hasOwnProperty(fieldName)) {
      Reflect.deleteProperty(this.subFormItemObj, fieldName)
    }
    if (this.subFormItemValue.hasOwnProperty(fieldName)) {
      Reflect.deleteProperty(this.subFormItemValue, fieldName)
    }
  }

  /* 初始化 Form */
  initForm() {
    for (const fieldName in this.subFormItemObj) {
      if (this.subFormItemObj.hasOwnProperty(fieldName) && this.subFormItemObj[fieldName].rolling) {
        if (this.subFormItemValue.hasOwnProperty(fieldName) && this.subFormItemValue[fieldName]) {
          this.subFormItemObj[fieldName].rollingProcess(this.subFormItemValue)
        }
      }
    }
  }

  /* 编辑时触发有数据的 rolling */
  rollingProcess(optionValue) {
    return this.rollingFn(optionValue)
  }

  /* 清除显示表单项 */
  cleanSubFormItem() {
    this.subFormItemValue = {}
    this.subFormItemObj = {}
  }
}
