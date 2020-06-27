export default {
  methods: {
    selectionStepIsNotEmptyRules(sortAry) {
      if (sortAry.length === 0) {
        this.notifyError('请选择移动的相别步骤')
        return false
      }
      return true
    },

    selectionStepCanMoveUpRules(sortAry) {
      const phaseStepList = this.currentPhaseStepPageData.phaseStepList
      if (sortAry[0].step === phaseStepList[0].step) {
        this.notifyError(`步骤${sortAry[0].step}无法上移，请选择取消勾选后重试`)
        return false
      }
      return true
    },

    selectionStepCanMoveDownRules(sortAry) {
      const phaseStepList = this.currentPhaseStepPageData.phaseStepList
      if (sortAry[0].step === phaseStepList[phaseStepList.length - 1].step) {
        this.notifyError(`步骤${sortAry[0].step}无法下移，请选择取消勾选后重试`)
        return false
      }
      return true
    }

  }
}
