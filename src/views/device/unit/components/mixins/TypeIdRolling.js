import { checkDeviceType } from '@/api/common/config'
import FormCommonItem from '../js/FormCommonItem'
import FormRollingItem from '../js/FormRollingItem'

export default {
  methods: {
    /* 设备类型 TypeId rolling */
    handleTypeIdChange({ typeId }) {
      this.deviceUnitFormItems.typeId.cleanSubFormItem()
      return checkDeviceType(typeId).then(res => {
        const isBalanceType = res.data.isBalanceType
        if (isBalanceType) {
          const isCheckBalance = new FormRollingItem({ type: 'select', label: '是否需要检秤', selectItems: [{ label: '是', value: true }, { label: '否', value: false }], rolling: true, rules: [
            { required: true, message: '请选择是否需要检秤', trigger: 'blur' }], fieldName: 'isCheckBalance', rollingFn: this.handleIsCheclBalanceChange })

          this.deviceUnitFormItems.typeId.add('isCheckBalance', isCheckBalance)
        }
      })
    },

    /* 设备类型 isCheckBalance rolling */
    handleIsCheclBalanceChange({ isCheckBalance }) {
      console.log('aaaisCheckBalance', isCheckBalance)
      return new Promise((resolve) => {
        this.deviceUnitFormItems.isCheckBalance.cleanSubFormItem()

        if (isCheckBalance) {
          const balanceWeight = new FormCommonItem({ type: 'text', label: '检秤重量', rules: [
            { required: true, message: '请输入检秤重量', trigger: 'blur' }
          ] })

          this.deviceUnitFormItems.isCheckBalance.add('balanceWeight', balanceWeight)
        }
        resolve()
      })
    }
  }
}
