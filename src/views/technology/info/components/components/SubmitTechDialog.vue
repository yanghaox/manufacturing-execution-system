<template>
  <el-dialog
    title="提交工艺"
    width="480px"
    :visible.sync="visible"
    append-to-body
    :close-on-click-modal="false"
  >
    <plk-form
      ref="submitTechForm"
      :option-value="submitTechForm"
      :options="submitTechFormItems"
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
export default {
  name: 'SubmitTechDialog',

  components: { PlkForm },

  props: {
    submitTechDialog: {
      type: Boolean,
      required: true
    }
  },

  data() {
    return {
      submitTechForm: {
        version: '',
        remark: ''
      },
      submitTechFormItems: {
        version: { type: 'text', label: '工艺版本', rules: [
          { required: true, message: '请输入工艺版本', trigger: 'blur' }
        ] },
        remark: { type: 'text', label: '工艺备注' }
      }
    }
  },

  computed: {
    visible: {
      get() {
        return this.submitTechDialog
      },
      set(value) {
        if (!value) {
          this.handleFormClose()
        }
      }
    }
  },

  methods: {
    /* 关闭表单 */
    handleFormClose() {
      this.$emit('close')
    },

    /* 提交表单 */
    handleFormCommit() {
      if (!this.$refs.submitTechForm.handleCheckData()) return
      this.$emit('submit', this.submitTechForm)
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
