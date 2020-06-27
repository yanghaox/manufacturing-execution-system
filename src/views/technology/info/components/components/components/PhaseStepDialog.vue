<template>
  <el-dialog
    class="phase-step-dialog"
    :title="`${TITLE_MAP.get(phaseStepType)}`"
    :visible.sync="visible"
    append-to-body
    fullscreen
    :close-on-click-modal="false"
  >
    <div class="warpper">
      <!-- 表单 -->
      <div class="form-box">
        <plk-form
          ref="stepForm"
          :option-value="stepForm"
          :options="stepFormItems"
          label-width="80px"
          @rolling="handleFormRolling"
        />
      </div>

      <!-- 功能区 -->
      <transition name="slide-fade">
        <div v-show="functionalDomainDisplay" class="functional-domain-box">
          <render-phase-function
            :phase-function-code="stepForm.functionCode"
            :functional-domain-data="functionalDomainData"
          />
        </div>
      </transition>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleFormClose">取 消</el-button>
      <el-button type="primary" size="small" :loading="commitLoading" @click="handleFormCommit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
const TYPE = {
  ADD: 'add',
  EDIT: 'edit'
}

import PlkForm from '@/components/Form'
import Emitter from '../../js/Emitter.js'
import ParameterData from '../../js/ParameterData.js'
import MethodData from '../../js/MethodData.js'
import FunctionData from '../../js/FunctionData.js'
import RenderPhaseFunction from './js/render-phase-function.js'
import { NEED_DATA_OF_FUNCTION_CODE_LIST } from './js/render-phase-function.js'
import { isRealNumber } from '@/utils/formRules.js'

export default {
  name: 'PhaseStepDialog',

  components: { PlkForm, RenderPhaseFunction },

  mixins: [Emitter],

  provide() {
    return {
      PhaseStepDialog: this
    }
  },

  inject: ['PhaseStepPage'],

  props: {
    phaseStepDialog: {
      type: Boolean,
      required: true
    },

    phaseStepType: {
      type: String,
      required: true,
      validator: function(value) {
        return Object.values(TYPE).includes(value)
      }
    },

    currentPhaseStepData: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      TITLE_MAP: new Map([['add', '添加相别步骤'], ['edit', `编辑相别步骤：${this.currentPhaseStepData.step}`]]),
      FORM_ROLLING_METHOD_MAP: new Map([['functionCode', 'handleFunctionCodeChange']]),
      FUNCTION_CODE_AND_METHOD_DATA_LIST_PARAMETER_LIST_MAP: new Map(),
      FUNCTION_DATA_LIST: [],

      /* from */
      stepForm: {
        describe: '',
        functionCode: ''
      },
      stepFormItems: {
        describe: { type: 'text', label: '描述' },
        functionCode: { type: 'select', label: '功能', selectItems: [], rolling: true, rules: [
          { required: true, message: '请选择功能', trigger: 'blur' }
        ] }
      },

      /* render-phase-function */
      functionalDomainData: null,
      functionalDomainDisplay: false,

      /* button */
      commitLoading: false
    }
  },

  computed: {
    visible: {
      get() {
        return this.phaseStepDialog
      },
      set(value) {
        if (!value) {
          this.handleFormClose()
        }
      }
    }
  },

  mounted() {
    this.$on('on-functional-domain-data', (data) => {
      this.functionalDomainData = data
    })
    this.$on('on-commit-loading', (data) => {
      this.commitLoading = data
    })
    this.handleFormFunctionMethodParameter()
    if (this.phaseStepType === TYPE.EDIT) {
      const { describe, functionData, methodData, parameterDataList, functionalDomainData } = this.currentPhaseStepData
      this.handleFunctionCodeChange(functionData)
      this.handleEditRecoveryFormDescribeData(describe)
      this.handleEditRecoveryFormFunctionData(functionData)
      this.handleEditRecoveryFormMethodData(methodData)
      this.handleEditRecoveryFormParameterData(parameterDataList)
      this.handleEditRecoveryFunctionalDomainData(functionalDomainData)

      this.functionalDomainDisplay = NEED_DATA_OF_FUNCTION_CODE_LIST.includes(this.currentPhaseStepData.functionData.functionCode)
    }
  },

  methods: {
    /* 编辑回写表单描述数据 */
    handleEditRecoveryFormDescribeData(describe) {
      this.stepForm.describe = describe
    },

    /* 编辑回写表单功能数据 */
    handleEditRecoveryFormFunctionData(functionData) {
      const { functionCode, functionId, functionName } = functionData
      this.stepForm.functionCode = functionCode
    },

    /* 编辑回写表单方式数据 */
    handleEditRecoveryFormMethodData(methodData) {
      const { dataCode, dataId: methodDataId, description, methodId } = methodData
      this.stepForm.methodDataId = methodDataId
    },

    /* 编辑回写表单参数数据 */
    handleEditRecoveryFormParameterData(parameterDataList) {
      for (const parameter of parameterDataList) {
        const { parameterId, parameterName, unit, valueMax, valueMin, parameterValue } = parameter
        this.stepForm[`parameterValue-${parameterId}`] = parameterValue
      }
    },

    /* 编辑回写功能域数据 */
    handleEditRecoveryFunctionalDomainData(functionalDomainData) {
      this.functionalDomainData = functionalDomainData
    },

    /* 处理表单功能、方式、参数 */
    handleFormFunctionMethodParameter() {
      const { functionList } = this.PhaseStepPage.currentPhaseStepPageData

      for (const item of functionList) {
        const { functionCode, functionId, functionName, methodDataList, parameterList } = item
        // 功能选项
        this.stepFormItems.functionCode.selectItems.push({ label: functionName, value: functionCode })
        // 功能方式参数
        this.FUNCTION_CODE_AND_METHOD_DATA_LIST_PARAMETER_LIST_MAP.set(functionCode, { methodDataList, parameterList })
        // 功能项数据
        this.FUNCTION_DATA_LIST.push({ functionCode, functionId, functionName })
      }
    },

    /* 提交表单 */
    handleFormCommit() {
      const { describe, functionCode, methodDataId } = this.stepForm
      const { methodDataList, parameterList } = this.FUNCTION_CODE_AND_METHOD_DATA_LIST_PARAMETER_LIST_MAP.get(functionCode)
      if (!this.$refs.stepForm.handleCheckData()) return false
      if (!this.handleFunctionalDomainDataCheck(functionCode)) return false

      // 数据处理
      const parameterDataList = this.handleFormCommitParameter(parameterList)
      const methodData = this.handleFormCommitMethod(methodDataList, methodDataId)
      const functionData = this.handleFormCommitFunction(functionCode)
      const functionalDomainData = this.functionalDomainData
      const phaseStep = { describe, functionData, methodData, parameterDataList, functionalDomainData }

      if (this.phaseStepType === TYPE.ADD) {
        this.dispatch('TechnologyWritingPage', 'on-add-phase-step', phaseStep)
      }
      if (this.phaseStepType === TYPE.EDIT) {
        const newPhaseStepData = phaseStep
        const oldPhaseStepData = this.currentPhaseStepData
        this.dispatch('TechnologyWritingPage', 'on-edit-phase-step', { newPhaseStepData, oldPhaseStepData })
      }
      this.handleFormClose()
    },

    /* 提交表单功能数据处理 */
    handleFormCommitFunction(functionCode) {
      let functionData = {}
      for (const item of this.FUNCTION_DATA_LIST) {
        if (functionCode === item.functionCode) {
          functionData = new FunctionData(item)
          break
        }
      }
      return functionData
    },

    /* 提交表单方式数据处理 */
    handleFormCommitMethod(methodDataList, methodDataId) {
      let methodData = {}
      for (const item of methodDataList) {
        const { dataCode, dataId, description, methodId } = item
        if (methodDataId === dataId) {
          methodData = new MethodData(item)
          break
        }
      }
      return methodData
    },

    /* 提交表单参数数据处理 */
    handleFormCommitParameter(parameterList) {
      const parameterDataList = []
      this.handleStepFormField('parameterValue', (key) => {
        const ary = key.split('-')
        const firstName = ary.shift()
        const lastName = ary.shift()
        for (const item of parameterList) {
          const { parameterId, parameterName, unit, valueMax, valueMin } = item
          if (lastName === parameterId) {
            const parameterValue = Number(this.stepForm[key])
            const parameterData = new ParameterData({ ...item, parameterValue })
            parameterDataList.push(parameterData)
            break
          }
        }
      })
      return parameterDataList
    },

    /* 提交功能域数据处理校验 */
    handleFunctionalDomainDataCheck(functionCode) {
      if (NEED_DATA_OF_FUNCTION_CODE_LIST.includes(functionCode)) {
        if (this.functionalDomainData === null) {
          const h = this.$createElement
          this.$notify.error({
            title: '提示',
            message: h('span', { style: 'color: red' }, '请设置功能区域数据'),
            position: 'bottom-right'
          })
          return false
        }
      }
      return true
    },

    /* 处理表单选项改变 */
    handleFormRolling(name, optionValue) {
      console.log('name', name)
      console.log('optionValue', optionValue)
      if (this.FORM_ROLLING_METHOD_MAP.has(name)) {
        this[this.FORM_ROLLING_METHOD_MAP.get(name)](optionValue)
      }
      this.functionalDomainData = null
      const { describe, functionData, methodData, parameterDataList, functionalDomainData } = this.currentPhaseStepData
      if (this.phaseStepType === TYPE.EDIT && optionValue[name] === functionData.functionCode) {
        this.handleEditRecoveryFormMethodData(methodData)
        this.handleEditRecoveryFormParameterData(parameterDataList)
        this.handleEditRecoveryFunctionalDomainData(functionalDomainData)
      }
    },

    /* 处理功能改变 */
    handleFunctionCodeChange({ functionCode }) {
      this.functionalDomainDisplay = NEED_DATA_OF_FUNCTION_CODE_LIST.includes(functionCode)

      const { methodDataList, parameterList } = this.FUNCTION_CODE_AND_METHOD_DATA_LIST_PARAMETER_LIST_MAP.get(functionCode)
      console.log('methodDataList', methodDataList)
      console.log('parameterList', parameterList)

      this.handleStepFormField('methodDataId', (key) => {
        Reflect.deleteProperty(this.stepForm, key)
        Reflect.deleteProperty(this.stepFormItems, key)
      })
      this.handleStepFormField('parameterValue', (key) => {
        Reflect.deleteProperty(this.stepForm, key)
        Reflect.deleteProperty(this.stepFormItems, key)
      })

      if (methodDataList.length > 0) {
        this.handleAddMethodInput(methodDataList, 'methodDataId')
      }

      if (parameterList.length > 0) {
        for (const item of parameterList) {
          this.handleAddParameterInput(item, 'parameterValue')
        }
      }
    },

    /**
     * 获取stepForm中的字段, 并做处理
     * @param {String} fieldName 字段名
     * @param {Function} handleFn 处理函数
     */
    handleStepFormField(fieldName, handleFn) {
      for (const key of Object.keys(this.stepForm)) {
        if (key.includes(fieldName)) {
          handleFn(key)
        }
      }
    },

    /* 添加方式输入框 */
    handleAddMethodInput(methodDataList, fieldName) {
      const template = {
        type: 'select',
        label: '方式',
        selectItems: methodDataList.map(item => {
          const { description: label, dataId: value, dataCode } = item
          return { label, value }
        }),
        rules: [
          { required: true, message: '请选择方式', trigger: 'blur' }
        ]
      }
      this.$set(this.stepForm, fieldName, '')
      this.$set(this.stepFormItems, fieldName, template)
    },

    /* 添加参数输入框 */
    handleAddParameterInput(parameter, fieldName) {
      const { parameterId, parameterName, unit, valueMax, valueMin } = parameter
      const template = {
        type: 'text',
        label: `${parameterName}`,
        append: `${unit}`,
        rules: [
          { required: true, message: `请输入${parameterName}`, trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              // if (!/^-?(0\.[0-9]*[1-9]+[0-9]*|[1-9][0-9]*\.?[0-9]*)$/.test(value)) {
              if (!isRealNumber(value)) {
                return callback(new Error(`请输入数字`))
              }
              return callback()
            },
            trigger: ['change', 'blur']
          },
          {
            validator: (rule, value, callback) => {
              return valueMin <= value && value <= valueMax
                ? callback()
                : callback(new Error(`${parameterName}的范围为[${valueMin}, ${valueMax}]`))
            },
            trigger: ['change', 'blur']
          }
        ]
      }
      this.$set(this.stepForm, `${fieldName}-${parameterId}`, undefined)
      this.$set(this.stepFormItems, `${fieldName}-${parameterId}`, template)
    },

    /* 关闭表单 */
    handleFormClose() {
      this.$emit('close')
    }

  }
}
</script>
<style lang='scss' scoped>
.phase-step-dialog {
  .warpper {
    display: flex;
    justify-content: center;
    overflow: hidden;
    .form-box {
      flex: 0 0 240px;
      margin-right: 16px;
    }
    .functional-domain-box {
      flex: 1 1 auto;
      overflow: auto;
    }

    .slide-fade-enter-active {
      transition: all .6s linear;
    }

    .slide-fade-leave-active {
      transition: all .6s linear;
    }

    .slide-fade-enter, .slide-fade-leave-to {
      flex: 0 0 0px;
      opacity: 0;
    }
  }
}
</style>
