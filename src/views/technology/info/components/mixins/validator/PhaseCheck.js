export default {
  methods: {
    deletePhaseRules(row) {
      if (row.phaseStepList.length) {
        this.notifyError('当前相别存在步骤，请先删除步骤后再操作')
        return false
      }
      return true
    }
  }
}
