<template>
  <el-dialog
    class="inner-phase-dialog"
    title="添加设备"
    width="480px"
    :visible.sync="visible"
    append-to-body
    :close-on-click-modal="false"
  >
    <!-- 表单 -->
    <plk-form
      ref="innerPhaseForm"
      :option-value="innerPhaseForm"
      :options="innerPhaseFormItems"
      label-width="80px"
    />

    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleFormClose">取 消</el-button>
      <el-button type="primary" size="small" @click="handleFormCommit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import PlkForm from '@/components/Form'
import Emitter from '../../js/Emitter'
export default {
  name: 'InnerPhaseDialog',

  components: { PlkForm },

  mixins: [Emitter],

  props: {
    innerPhaseDialog: {
      type: Boolean,
      required: true
    },

    deviceUnitSelection: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      /* from */
      innerPhaseForm: {},
      innerPhaseFormItems: {}
    }
  },

  computed: {
    visible: {
      get() {
        return this.innerPhaseDialog
      },
      set(value) {
        if (!value) {
          this.handleFormClose()
        }
      }
    }
  },
  mounted() {
    console.log('deviceUnitSelection', this.deviceUnitSelection)
    for (const item of this.deviceUnitSelection) {
      const { deviceId, deviceCode, deviceName } = item
      this.handleAddInnerPhaseInput(deviceId, 'deviceCode', '设备编号', deviceCode, true)
      this.handleAddInnerPhaseInput(deviceId, 'deviceName', '设备名称', deviceName, true)
      this.handleAddInnerPhaseInput(deviceId, 'phaseName', '相别名称')
      this.handleAddInnerPhaseInput(deviceId, 'describe', '描述', undefined, false, false)
    }
  },
  methods: {
    /* 处理添加内相输入框 */
    handleAddInnerPhaseInput(fieldId, fieldName, fieldLabel, fieldValue, disabled = false, required = true) {
      const template = {
        type: 'text',
        label: fieldLabel,
        disabled: disabled,
        rules: [
          { required, message: `请输入${fieldLabel}`, trigger: 'blur' }
        ]
      }
      this.$set(this.innerPhaseForm, `${fieldName}-${fieldId}`, fieldValue || '')
      this.$set(this.innerPhaseFormItems, `${fieldName}-${fieldId}`, template)
    },

    /* 处理表单提交字段恢复 */
    handleFormCommitData(formData) {
      const deviceUnit = {}
      for (const key of Object.keys(formData)) {
        const ary = key.split('-')
        const firstName = ary.shift()
        const lastName = ary.shift()
        if (!deviceUnit.hasOwnProperty(lastName)) {
          deviceUnit[lastName] = {}
        }
        deviceUnit[lastName][firstName] = formData[key]
      }
      return deviceUnit
    },

    /* 提交表单 */
    handleFormCommit() {
      if (!this.$refs.innerPhaseForm.handleCheckData()) return false
      const formData = this.handleFormCommitData(this.innerPhaseForm)
      this.$emit('close-all')
      this.dispatch('TechnologyWritingPage', 'on-add-inner-phase-data', formData)
    },

    /* 关闭表单 */
    handleFormClose() {
      this.$emit('close')
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
