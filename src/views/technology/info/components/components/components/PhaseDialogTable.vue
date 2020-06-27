<template>
  <div class="phase-dialog-table">
    <plk-table
      table-height="250px"
      col-min-width="150px"
      :table-header="tableHeader"
      :table-data="tableData"
      :table-selection="false"
    >
      <template v-slot:parentId="row">
        <el-radio v-model="radioValue" :label="row.scope.row.id" @change="handleRadioChange" />
      </template>

      <template v-slot:isTarget="row">
        <div
          :style="row.scope.row.isTarget ? 'color: red;' : 'color: green;'"
        >
          {{ row.scope.row.isTarget ? '是' : '否' }}
        </div>
      </template>
    </plk-table>
  </div>
</template>

<script>
const TYPE = {
  ADD: 'add',
  EDIT: 'edit'
}

import PlkTable from '@/components/Table'
import Emitter from '../../js/Emitter.js'
export default {
  name: 'PhaseDialogTable',

  components: { PlkTable },

  mixins: [Emitter],

  inject: ['TechnologyWritingPage', 'PhaseDialog'],

  data() {
    return {
      /* table */
      tableHeader: [
        { label: '上级相别', prop: 'parentId', type: 'slot', align: 'center', fixed: 'left', width: '100px' },
        { label: '相别名称', prop: 'phaseName', width: '160px' },
        { label: '描述', prop: 'describe', width: '160px' },
        { label: '设备编号', prop: 'deviceCode', width: '160px' },
        { label: '设备名称', prop: 'deviceName', width: '160px' },
        { label: '是否为产物', prop: 'isTarget', width: '100px', type: 'slot' },
        { label: '产量下限', prop: 'quantityLowLimit', width: '80px' },
        { label: '产量上限', prop: 'quantityUpLimit', width: '80px' },
        { label: '最大步骤', prop: 'maxTep', width: '80px' },
        // { label: '上级相别编号', prop: 'parentPhaseCode' },
        { label: '总比例', prop: 'proportion', width: '80px' },
        { label: '剩余比例', prop: 'remainProportion', width: '80px' },
        { label: '当前比例', prop: 'currentProportion', width: '80px' },
        { label: '备注', prop: 'remark', width: '160px' },
        { label: '类型', prop: 'type', width: '80px' }
      ],
      tableData: [],

      radioValue: undefined
    }
  },
  mounted() {
    /* 监听target事件 */
    this.$on('on-target-change', (isTarget) => {
      isTarget ? this.setTableDataByEmpty() : this.setTableDataByNotEmpty()
    })

    this.init()
    this.radioValue = this.PhaseDialog.phaseForm.parentId
  },

  methods: {
    /* 初始化表格数据 */
    init() {
      if (this.PhaseDialog.phaseType === TYPE.ADD) {
        this.handlePhaseTypeAdd()
      }

      if (this.PhaseDialog.phaseType === TYPE.EDIT) {
        this.handlePhaseTypeEdit()
      }
    },

    /* 处理相别类型add */
    handlePhaseTypeAdd() {
      this.tableData = this.TechnologyWritingPage.phaseData
    },

    /* 处理相别类型edit */
    handlePhaseTypeEdit() {
      const { isTarget } = this.PhaseDialog.phaseForm
      this.tableData = isTarget ? [] : this.filterSelfAndSubPhase()
    },

    /* 设置表格数据为空 */
    setTableDataByEmpty() {
      this.tableData = []
      this.dispatch('PhaseDialog', 'on-phase-form-parent-id', undefined)
    },

    /* 设置表格数据不为空 */
    setTableDataByNotEmpty() {
      this.init()
      this.dispatch('PhaseDialog', 'on-phase-form-parent-id', this.radioValue)
    },

    /* 编辑时候过滤自身+子相别 */
    filterSelfAndSubPhase() {
      const currentPhase = this.PhaseDialog.currentPhaseData
      const phaseData = this.TechnologyWritingPage.phaseData
      const filterSelfPhase = this.filterSelfPhase(currentPhase, phaseData)
      const getSubPhase = this.getSubPhase(currentPhase, filterSelfPhase)
      const filterSubPhase = this.filterSubPhase(getSubPhase, filterSelfPhase)
      console.log('filterSelfPhase', filterSelfPhase)
      console.log('getSubPhase', getSubPhase)
      console.log('filterSubPhase', filterSubPhase)
      return filterSubPhase
    },

    /* 过滤当前相别 */
    filterSelfPhase(phase, phaseData) {
      const selfId = phase.id
      return phaseData.filter(item => {
        return item.id !== selfId
      })
    },

    /* 获取当前相别下级相别 */
    getSubPhase(phase, phaseData) {
      const parentId = phase.id
      const subPhase = []
      for (const item of phaseData) {
        if (item.parentId === parentId) {
          subPhase.push(item, ...this.getSubPhase(item, phaseData))
        }
      }
      return subPhase
    },

    /* 过滤当前相别下级相别 */
    filterSubPhase(subPhase, phaseData) {
      return phaseData.filter(item => {
        return !subPhase.includes(item)
      })
    },

    /* 处理单选框改变 */
    handleRadioChange(value) {
      console.log('radio', value)
      this.dispatch('PhaseDialog', 'on-phase-form-parent-id', value)
    }

  }
}
</script>
<style lang='scss' scoped>
</style>
