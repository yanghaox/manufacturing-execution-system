import { addCalc, subtractCalc } from '@/utils/float-calc.js'
import Vue from 'vue'
const vue = new Vue()
export default class CalcTotalProportion {
  constructor() {
    this.totalProportion = 0
    this.calcTotalProportionMap = new Map()
  }

  /* 处理计算总数 */
  handleTotalProportion(row) {
    const map = this.calcTotalProportionMap
    map.has(row.materialId) ? this.handleCalcTotalProportionMapHas(row) : this.handleCalcTotalProportionMapNotHas(row)
    return this.totalProportion
  }

  /* 处理calcTotalProportionMap存在 */
  handleCalcTotalProportionMapHas(row) {
    const map = this.calcTotalProportionMap
    const oldProportion = map.get(row.materialId)
    const newProportion = typeof row.proportion === 'string' ? Number(row.proportion) : row.proportion

    if (!Object.is(newProportion, NaN)) {
      const totalProportion = addCalc(subtractCalc(this.totalProportion, oldProportion), newProportion)

      if (totalProportion > 100) {
        row.proportion = oldProportion
        this.notifyError('分配比例不允许超过100%')
      } else {
        map.set(row.materialId, newProportion)
        this.totalProportion = totalProportion
      }
    }
  }

  /* 处理calcTotalProportionMap不存在 */
  handleCalcTotalProportionMapNotHas(row) {
    const map = this.calcTotalProportionMap
    const newProportion = typeof row.proportion === 'string' ? Number(row.proportion) : row.proportion

    if (!Object.is(newProportion, NaN)) {
      const totalProportion = addCalc(this.totalProportion, newProportion)

      if (totalProportion > 100) {
        row.proportion = 0
        this.notifyError('分配比例不允许超过100%')
      } else {
        map.set(row.materialId, newProportion)
        this.totalProportion = totalProportion
      }
    }
  }

  /* 处理totalProportion校验 */
  handleTotalProportionCheck() {
    const flag = this.totalProportion === 100
    if (!flag) {
      this.notifyError(`请输入100%比例，当前比例${this.totalProportion}%`)
    }
    return flag
  }

  /* 处理删除物料功能 */
  handleCalcTotalProportionMapDelete(delMaterialIdList) {
    for (const [key, value] of this.calcTotalProportionMap) {
      if (delMaterialIdList.includes(key)) {
        this.totalProportion = subtractCalc(this.totalProportion, value)
        this.calcTotalProportionMap.delete(key)
      }
    }
  }

  /* 错误通知 */
  notifyError(message) {
    const h = this.$createElement
    vue.$notify.error({
      title: '提示',
      message: h('span', { style: 'color: red' }, message),
      position: 'bottom-right'
    })
  }
}

