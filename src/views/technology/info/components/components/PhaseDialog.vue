<template>
  <div class="phase-dialog">
    <el-dialog :title="`${TITLE_MAP.get(phaseType)}相别`" width="720px" :visible.sync="visible" :close-on-click-modal="false">
      <!-- 相别表单 -->
      <plk-form
        ref="phaseForm"
        :option-value="phaseForm"
        :options="phaseFormItems"
        label-width="120px"
        @rolling="handleFormRolling"
      />

      <!-- 表格 -->
      <phase-dialog-table />

      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleFormClose">取 消</el-button>
        <el-button type="primary" size="small" @click="handleFormCommit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const TYPE = {
  ADD: 'add',
  EDIT: 'edit'
}

import PlkForm from '@/components/Form'
import PhaseDialogTable from './components/PhaseDialogTable'
import Emitter from '../js/Emitter'
export default {
  name: 'PhaseDialog',

  components: { PlkForm, PhaseDialogTable },

  mixins: [Emitter],

  provide() {
    return {
      PhaseDialog: this
    }
  },

  props: {
    phaseDialog: {
      type: Boolean,
      required: true
    },

    phaseType: {
      type: String,
      required: true,
      validator: function(value) {
        return Object.values(TYPE).includes(value)
      }
    },

    currentPhaseData: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      TITLE_MAP: new Map([['add', '添加'], ['edit', '编辑']]),
      FORM_COMMIT_TYPE_METHOD_MAP: new Map([['add', 'handleFormAdd'], ['edit', 'handleFormEdit']]),
      FORM_ROLLING_METHOD_MAP: new Map([['isTarget', 'handleFormIsTargetChange']]),

      phaseForm: {
        phaseName: '',
        describe: '',
        isTarget: false,
        parentId: ''
      },
      phaseFormItems: {
        phaseName: { type: 'text', label: '相别名称', rules: [
          { required: true, message: '请输入相别名称', trigger: 'blur' }
        ] },
        describe: { type: 'text', label: '相别描述' },
        isTarget: { type: 'switch', label: '是否为产物', rolling: true },
        parentId: { type: 'number', label: '上级相别', disabled: true }
      }

    }
  },

  computed: {
    visible: {
      get() {
        return this.phaseDialog
      },
      set(value) {
        if (!value) {
          this.handleFormClose()
        }
      }
    }
  },

  mounted() {
    this.$on('on-phase-form-parent-id', (parentId) => {
      this.phaseForm.parentId = parentId
    })

    if (this.phaseType === TYPE.EDIT) {
      this.handleFormEditInit()
    }
  },

  methods: {
    /* 添加相别 */
    handleFormAdd() {
      this.dispatch('TechnologyWritingPage', 'on-add-outer-phase-data', this.phaseForm)
      this.handleFormClose()
    },

    /* 编辑相别 */
    handleFormEdit() {
      this.dispatch('TechnologyWritingPage', 'on-edit-phase-data', this.phaseForm)
      this.handleFormClose()
    },

    /* 编辑相别初始化 */
    handleFormEditInit() {
      const { phaseName, describe, isTarget, parentId } = this.currentPhaseData
      this.phaseForm = { phaseName, describe, isTarget, parentId }
      this.phaseFormItems.phaseName.disabled = true
      this.phaseFormItems.describe.disabled = true
    },

    /* 处理表单isTarget改变 */
    handleFormIsTargetChange(optionValue) {
      const { describe, isTarget, parentId, phaseName } = optionValue
      this.broadcast('PhaseDialogTable', 'on-target-change', isTarget)
    },

    /* 处理表单选项改变 */
    handleFormRolling(name, optionValue) {
      console.log('name', name)
      console.log('optionValue', optionValue)
      this[this.FORM_ROLLING_METHOD_MAP.get(name)](optionValue)
    },

    /* 提交表单 */
    handleFormCommit() {
      if (!this.$refs.phaseForm.handleCheckData()) return
      this[this.FORM_COMMIT_TYPE_METHOD_MAP.get(this.phaseType)]()
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
