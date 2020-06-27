<template>
  <div class="device-unit-dialog">
    <div class="warpper">
      <!-- 表单 -->
      <div class="form-box">
        <plk-form ref="deviceUnitForm" :option-value="deviceUnitForm" :options="deviceUnitFormItems" label-width="120px" @rolling="handleFormRolling" />
      </div>

      <!-- 功能/属性表格 -->
      <div class="table-box">
        <el-tabs :tab-position="tabPosition">
          <el-tab-pane label="设备功能">
            <plk-table
              ref="deviceFun"
              table-height="calc(100vh - 77px - 64px - 32px)"
              col-min-width="150px"
              :span-method="deviceFunSpanMethod"
              :table-header="deviceFunHeader"
              :table-data="deviceFunData"
              @selectionChange="handleSelectionFunChange"
            >
              <template v-slot:valueMin="row">
                <el-tooltip v-if="row.scope.row.hasOwnProperty('valueMin')" class="item" effect="light" :content="row.scope.row.valueMin.toString() || ''" placement="top">
                  <el-input
                    v-model="row.scope.row.valueMin"
                    size="small"
                    @input="handleMinInput(row.scope)"
                  >
                    <template slot="append">{{ row.scope.row.unit }}</template>
                  </el-input>
                </el-tooltip>
              </template>

              <template v-slot:valueMax="row">
                <el-tooltip v-if="row.scope.row.hasOwnProperty('valueMax')" class="item" effect="light" :content="row.scope.row.valueMax.toString() || ''" placement="top">
                  <el-input
                    v-model="row.scope.row.valueMax"
                    size="small"
                    @input="handleMaxInput(row.scope)"
                  >
                    <template slot="append">{{ row.scope.row.unit }}</template>
                  </el-input>
                </el-tooltip>
              </template>

              <template v-slot:btnSlot="row">
                <el-button
                  v-if="canEditDeviceUnitFun(row.scope)"
                  type="primary"
                  size="mini"
                  @click="editDeviceUnitFun(row.scope)"
                >
                  设置
                </el-button>
              </template>
            </plk-table>
          </el-tab-pane>

          <el-tab-pane label="设备属性">
            <plk-table
              ref="deviceAttr"
              table-height="calc(100vh - 77px - 64px - 32px)"
              col-min-width="150px"
              :table-header="deviceAttributeHeader"
              :table-data="deviceAttrData"
              @selectionChange="handleSelectionAttrChange"
            >

              <template v-slot:value="row">
                <el-tooltip class="item" effect="light" :content="row.scope.row.value || ''" placement="top">
                  <el-input
                    v-model="row.scope.row.value"
                    size="small"
                  />
                </el-tooltip>
              </template>
            </plk-table>
          </el-tab-pane>
        </el-tabs>

        <div class="warpper-footer">
          <el-button size="small" @click="handleDeviceUnitFormClose">取 消</el-button>
          <el-button type="primary" size="small" @click="handleDeviceUnitFormCommit">确 定</el-button>
        </div>
      </div>
    </div>

    <!-- 设备单元功能弹框 -->
    <device-unit-fun-dialog
      v-if="deviceUnitFunDialog"
      v-el-drag-dialog
      :device-unit-fun-dialog="deviceUnitFunDialog"
      :device-unit-fun-type="deviceUnitFunType"
      :current-device-unit-fun-setting-data="currentDeviceUnitFunSettingData"
      @close-dialog="handleDeviceUnitFunClose"
    />
  </div>
</template>

<script>
const TYPE = {
  ADD: 'add',
  EDIT: 'edit'
}

import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('commonConfig')
import PlkForm from '@/components/Form'
import PlkTable from '@/components/Table'
import DeviceUnitFunDialog from './components/DeviceUnitFunDialog'

import FunSetting from './mixins/FunSetting.js'
import TypeIdRolling from './mixins/TypeIdRolling.js'

import Form from './js/Form'
import FormCommonItem from './js/FormCommonItem'
import FormRollingItem from './js/FormRollingItem'

import { isEmpty, isNumber } from '@/utils/formRules'

import {
  addDeviceUnit,
  editDeviceUnit,
  getDeviceType,
  getFunction,
  getAttribute
} from '@/api/device/unit'

export default {
  name: 'DeviceUnitDialog',

  components: { PlkForm, PlkTable, DeviceUnitFunDialog },

  mixins: [FunSetting, TypeIdRolling],

  inject: ['deviceUnit'],

  props: {
    deviceUnitDialog: {
      type: Boolean,
      required: true
    },
    deviceUnitType: {
      type: String,
      required: true,
      validator: function(value) {
        return Object.values(TYPE).includes(value)
      }
    },
    currentDeviceUnitData: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      TITLE_MAP: new Map([['add', '添加'], ['edit', '编辑']]),
      FORM_ROLLING_METHOD_MAP: new Map([['typeId', 'handleTypeIdChange']]),

      deviceUnitForm: {},
      deviceUnitFormItems: {},

      tabPosition: 'left',

      /* 设备单元功能 */
      deviceFunHeader: [
        // { label: '功能Id', prop: 'functionId' },
        { label: '功能编号', prop: 'functionCode', width: '80px' },
        { label: '功能名称', prop: 'functionName', width: '160px' },
        { label: '参数名称', prop: 'parameterName', width: '160px' },
        { label: '最小值', prop: 'valueMin', type: 'slot', align: 'center' },
        { label: '最大值', prop: 'valueMax', type: 'slot', align: 'center' },
        { label: '操作', type: 'btn', fixed: 'right', width: '80px' }
      ],
      deviceFunData: [],
      deviceFunSelection: [],
      deviceFunParameterCountMap: null,

      /* 设备单元属性 */
      deviceAttributeHeader: [
        // { label: '设备属性id', prop: 'attributeId' },
        { label: '设备属性', prop: 'attributeName' },
        { label: '属性值', prop: 'value', type: 'slot', align: 'center' }
      ],
      deviceAttrData: [],
      deviceAttrSelection: [],

      /* 设备单元功能设置 */
      DEVICE_FUN_BACK_FIELD_FRONT_ADD_METHONDS_MAP: {
        pipelineMaterialFunctionCode: { back: 'functionMaterial', front: 'handleDeviceFunSetPipelineMaterialAdd' }
      },
      DEVICE_FUN_BACK_FIELD_FRONT_EDIT_METHONDS_MAP: {
        pipelineMaterialFunctionCode: { back: 'functionMaterial', front: 'handleDeviceFunSetPipelineMaterialEdit' }
      },
      currentDeviceUnitFunSettingData: {
        pipelineMaterialFunctionCode: []
      },
      DEVICE_UNIT_FUN_HAS_SETTING_LIST: ['pipelineMaterialFunctionCode'],
      deviceUnitFunDialog: false,
      deviceUnitFunType: ''

    }
  },

  computed: {
    ...mapState(['deviceFunctionCodeMap'])
  },

  mounted() {
    this.$on('on-fun-settings', (settings) => {
      this.currentDeviceUnitFunSettingData[this.deviceUnitFunType] = settings
    })
    if (this.deviceUnitType === TYPE.ADD) {
      this.initDeviceUnitForm()
    }

    if (this.deviceUnitType === TYPE.EDIT) {
      const {
        deviceCode,
        deviceName,
        maxTep,
        quantityLowLimit,
        quantityUpLimit,
        typeId,
        remark,
        isCheckBalance,
        balanceWeight
      } = this.currentDeviceUnitData
      this.initDeviceUnitForm({ deviceCode, deviceName, maxTep, quantityLowLimit, quantityUpLimit, typeId, remark, isCheckBalance, balanceWeight })
    }

    Promise.all([
      this.getDeviceType(),
      this.getFunction(),
      this.getAttribute()
    ]).then(() => {
      if (this.deviceUnitType === TYPE.EDIT) {
        const { attributeList, functionList, functionSetting } = this.currentDeviceUnitData

        // 设备单元功能
        for (const selection of functionList) {
          const { functionId, parameterList } = selection

          if (parameterList.length) {
            for (const parameter of parameterList) {
              const { parameterId, valueMin, valueMax } = parameter

              for (const funItem of this.deviceFunData) {
                if (functionId === funItem.functionId && parameterId === funItem.parameterId) {
                  funItem.valueMin = valueMin
                  funItem.valueMax = valueMax
                  this.deviceFunSelection.push(funItem)
                  this.$refs.deviceFun.toggleRowSelection(funItem, true)
                  break
                }
              }
            }
          } else {
            for (const funItem of this.deviceFunData) {
              if (functionId === funItem.functionId) {
                this.deviceFunSelection.push(funItem)
                this.$refs.deviceFun.toggleRowSelection(funItem, true)
                break
              }
            }
          }
        }

        // 设备单元属性
        for (const selection of attributeList) {
          const { attributeId, value } = selection

          for (const attrItem of this.deviceAttrData) {
            if (attributeId === attrItem.attributeId) {
              this.$set(attrItem, 'value', value)
              this.deviceAttrSelection.push(attrItem)
              this.$refs.deviceAttr.toggleRowSelection(attrItem, true)
              break
            }
          }
        }

        // 设备单元设置
        for (const [key, value] of Object.entries(functionSetting)) {
          for (const map of Object.values(this.DEVICE_FUN_BACK_FIELD_FRONT_EDIT_METHONDS_MAP)) {
            if (key === map['back']) {
              this[map['front']](value)
            }
          }
        }
      }
    })
  },

  methods: {
    /* 初始化表单 */
    initDeviceUnitForm(optionValue) {
      const deviceUnitForm = new Form(optionValue)
      this.deviceUnitForm = deviceUnitForm.subFormItemValue
      this.deviceUnitFormItems = deviceUnitForm.subFormItemObj

      const deviceCode = new FormCommonItem({ type: 'text', label: '设备编号', rules: [
        { required: true, message: '请输入设备编号', trigger: 'blur' }
      ], fieldName: 'deviceCode' })
      const deviceName = new FormCommonItem({ type: 'text', label: '设备名称', rules: [
        { required: true, message: '请输入设备名称', trigger: 'blur' }
      ], fieldName: 'deviceName' })
      const quantityLowLimit = new FormCommonItem({ type: 'text', label: '最小产量', rules: [
        { required: true, message: '请输入最小产量', trigger: 'blur' }
      ], fieldName: 'quantityLowLimit' })
      const quantityUpLimit = new FormCommonItem({ type: 'text', label: '最大产量', rules: [
        { required: true, message: '请输入最大产量', trigger: 'blur' }
      ], fieldName: 'quantityUpLimit' })
      const maxTep = new FormCommonItem({ type: 'text', label: '设备最大步骤数', rules: [
        { required: true, message: '请输入设备最大步骤数', trigger: 'blur' }
      ], fieldName: 'maxTep' })
      const remark = new FormCommonItem({ type: 'text', label: '备注', fieldName: 'remark' })
      const file = new FormCommonItem({ type: 'file', label: '附件', fieldName: 'file' })
      const typeId = new FormRollingItem({ type: 'select', label: '设备类型', rolling: true, selectItems: [], rules: [
        { required: true, message: '请选择设备类型', trigger: 'blur' }
      ], fieldName: 'typeId', rollingFn: this.handleTypeIdChange })

      deviceUnitForm.add('deviceCode', deviceCode)
      deviceUnitForm.add('deviceName', deviceName)
      deviceUnitForm.add('quantityLowLimit', quantityLowLimit)
      deviceUnitForm.add('quantityUpLimit', quantityUpLimit)
      deviceUnitForm.add('maxTep', maxTep)
      deviceUnitForm.add('remark', remark)
      deviceUnitForm.add('file', file)
      deviceUnitForm.add('typeId', typeId)

      deviceUnitForm.initForm()
    },

    /* 获取功能列表 */
    getFunction() {
      return getFunction().then(res => {
        console.log('getFunction', res)
        const functionList = res.data

        functionList.forEach(functionItem => {
          const { functionCode, functionId, functionName, functionParameterList } = functionItem

          // 有功能参数逻辑
          if (functionParameterList.length !== 0) {
            const temp = functionParameterList.map(functionParameter => {
              return {
                ...functionParameter,
                functionCode,
                functionId,
                functionName,
                valueMin: '',
                valueMax: ''
              }
            })

            this.deviceFunData = this.deviceFunData.concat(temp)
            return
          }

          // 没有功能参数逻辑
          this.deviceFunData.push({ functionCode, functionId, functionName })
        })

        this.deviceFunParameterCountMap = this.handleDeviceFunParameterCountMap()
      })
    },

    /* 类型列表 */
    getDeviceType() {
      return getDeviceType().then(res => {
        console.log('getDeviceType', res)
        const typeList = res.data
        this.deviceUnitFormItems.typeId.selectItems = typeList.map(item => {
          const { typeId, typeName } = item
          return {
            label: typeName,
            value: typeId
          }
        })
      })
    },

    /* 获取属性列表 */
    getAttribute() {
      return getAttribute().then(res => {
        console.log('getAttribute', res)
        this.deviceAttrData = Array.from(res.data, value => {
          return {
            ...value,
            value: ''
          }
        })
      })
    },

    /* 处理表单选项改变 */
    handleFormRolling(name, optionValue) {
      console.log('name', name)
      console.log('optionValue', optionValue)
      if (this.deviceUnitFormItems[name].hasOwnProperty('rollingFn')) {
        this.deviceUnitFormItems[name].rollingFn(optionValue)
      }
    },

    /* 处理设备单元表单校验 */
    handleDeviceUnitFormCheck() {
      return this.$refs.deviceUnitForm.handleCheckData()
    },

    /* 处理设备单元功能校验 */
    handleDeviceUnitFunCheck() {
      for (const selection of this.deviceFunSelection) {
        for (const item of this.deviceFunData) {
          if (selection.functionId === item.functionId) {
            const { parameterId, parameterName, unit, valueMin, valueMax } = item
            if (item.hasOwnProperty('valueMin')) {
              if (isEmpty(valueMin)) {
                this.notifyError(`请输入${parameterName}的最小值`)
                return false
              } else if (!isNumber(valueMin)) {
                this.notifyError(`${parameterName}的最小值非数字格式`)
                return false
              }
            }

            if (item.hasOwnProperty('valueMax')) {
              if (isEmpty(valueMax)) {
                this.notifyError(`请输入${parameterName}的最大值`)
                return false
              } else if (!isNumber(valueMax)) {
                this.notifyError(`${parameterName}的最大值非数字格式`)
                return false
              }
            }
          }
        }
      }
      return true
    },

    /* 处理设备单元参数校验 */
    handleDeviceUnitAttrCheck() {
      for (const item of this.deviceAttrSelection) {
        const { attributeId, attributeName, value } = item

        if (isEmpty(value)) {
          this.notifyError(`请输入${attributeName}的属性值`)
          return false
        }
      }
      return true
    },

    /* 处理设备单元功能提交数据 */
    handleDeviceUnitFunDataProcess() {
      const ret = []

      for (const selection of this.deviceFunSelection) {
        const { functionId, functionName } = selection
        const funItem = { functionId, functionName, parameterList: [] }

        for (const item of this.deviceFunData) {
          if (functionId === item.functionId) {
            const { parameterId, parameterName, unit, valueMin, valueMax } = item
            // 没有参数id不添加
            if (parameterId) {
              funItem.parameterList.push({ parameterId, parameterName, unit, valueMin: Number(valueMin), valueMax: Number(valueMax) })
            }
          }
        }
        ret.push(funItem)
      }
      return ret
    },

    /* 处理设备单元属性提交数据加工 */
    handleDeviceUnitAttrDataProcess() {
      const ret = []

      for (const item of this.deviceAttrSelection) {
        const { attributeId, attributeName, value } = item
        ret.push({ attributeId, attributeName, value })
      }
      return ret
    },

    /* 处理设备单元功能设置提交数据加工 */
    handleDeviceUnitFunSetProcess() {
      const ret = {}

      for (const item of this.deviceFunSelection) {
        const { functionCode, functionId } = item

        for (const [key, value] of Object.entries(this.DEVICE_FUN_BACK_FIELD_FRONT_ADD_METHONDS_MAP)) {
          if (functionCode === this.deviceFunctionCodeMap.get(key)) {
            ret[this.DEVICE_FUN_BACK_FIELD_FRONT_ADD_METHONDS_MAP[key].back] = this[value.front](functionId)
          }
        }
      }
      return ret
    },

    /* 提交表单 */
    handleDeviceUnitFormCommit() {
      if (!this.handleDeviceUnitFormCheck() || !this.handleDeviceUnitFunCheck() || !this.handleDeviceUnitAttrCheck()) return

      // 处理表格提交功能数据
      const deviceUnitForm = this.deviceUnitForm
      const functionList = this.handleDeviceUnitFunDataProcess()
      const attributeList = this.handleDeviceUnitAttrDataProcess()
      const functionSetting = this.handleDeviceUnitFunSetProcess()
      console.log('functionSetting', functionSetting)
      const data = Object.assign({}, deviceUnitForm, { functionList }, { attributeList }, { functionSetting })
      if (this.deviceUnitType === TYPE.ADD) {
        addDeviceUnit(data).then(res => {
          this.$message.success(res.message)
          this.handleDeviceUnitFormClose()
        })
      }

      if (this.deviceUnitType === TYPE.EDIT) {
        const deviceId = this.currentDeviceUnitData.deviceId
        editDeviceUnit(data, deviceId).then(res => {
          this.$message.success(res.message)
          this.handleDeviceUnitFormClose()
        })
      }
    },

    /* 处理设备功能表选中改变 */
    handleSelectionFunChange(value) {
      this.deviceFunSelection = value
      console.log('deviceFunSelection', this.deviceFunSelection)
    },

    /* 设置设备单元功能 */
    editDeviceUnitFun({ row }) {
      const functionCode = row.functionCode
      for (const [key, value] of this.deviceFunctionCodeMap.entries()) {
        if (value === functionCode) {
          this.deviceUnitFunType = key
          this.deviceUnitFunDialog = true
          return
        }
      }
    },

    /* 能否设置设备单元功能 */
    canEditDeviceUnitFun({ row }) {
      for (const [key, value] of this.deviceFunctionCodeMap.entries()) {
        if (this.DEVICE_UNIT_FUN_HAS_SETTING_LIST.includes(key) && value === row.functionCode) {
          return true
        }
      }
      return false
    },

    /* 处理设备属性表选中改变 */
    handleSelectionAttrChange(value) {
      this.deviceAttrSelection = value
      console.log('deviceAttrSelection', this.deviceAttrSelection)
    },

    /* 取消按钮，关闭弹框 */
    handleDeviceUnitFormClose() {
      this.$emit('close-dialog')
    },

    /* 处理输入最小值 */
    handleMinInput({ row }) {
      const { valueMin } = row
      if (!isNumber(valueMin)) {
        this.notifyError('请输入正确数字格式')
      }
    },

    /* 处理输入最大值 */
    handleMaxInput({ row }) {
      const { valueMax } = row
      if (!isNumber(valueMax)) {
        this.notifyError('请输入正确数字格式')
      }
    },

    /* 处理设备单元功能弹窗关闭 */
    handleDeviceUnitFunClose() {
      this.deviceUnitFunDialog = false
    },

    /* 设备单元功能参数记录 */
    handleDeviceFunParameterCountMap() {
      const countMap = new Map()
      this.deviceFunData.forEach((item, index) => {
        if (countMap.has(item.functionId)) {
          const temp = countMap.get(item.functionId)
          temp.count += 1
          countMap.set(item.functionId, temp)
        } else {
          countMap.set(item.functionId, { firstIndex: index, count: 1 })
        }
      })
      return countMap
    },

    /* 渲染设备单元表格 */
    deviceFunSpanMethod({ row, column, rowIndex, columnIndex }) {
      const { firstIndex, count } = this.deviceFunParameterCountMap.get(row.functionId)

      if (columnIndex <= 3 || columnIndex === 7) {
        if (rowIndex === firstIndex) {
          return {
            rowspan: count,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },

    // --------------------------------------通知提示--------------------------------------
    /* 成功通知 */
    notifySuccess(message) {
      const h = this.$createElement
      this.$notify.success({
        title: '提示',
        message: h('span', { style: 'color: green' }, message),
        position: 'bottom-right'
      })
    },

    /* 错误通知 */
    notifyError(message) {
      const h = this.$createElement
      this.$notify.error({
        title: '提示',
        message: h('span', { style: 'color: red' }, message),
        position: 'bottom-right'
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.device-unit-dialog {
  .warpper {
    display: flex;
    .form-box {
      flex: 0 0 360px;
      margin-right: 16px;
    }
    .table-box {
      overflow-x: auto;
      width: 100%;
      height: calc(100vh - 77px - 32px);

      .warpper-footer {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 16px;
      }
    }
  }
}
</style>
