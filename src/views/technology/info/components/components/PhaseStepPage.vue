<template>
  <div class="phase-step-page">
    <!-- 相别步骤页面header -->
    <div class="phase-step-toolbar">
      <el-button type="primary" size="mini" @click="handlePhaseStepMoveUp">上移</el-button>
      <el-button type="primary" size="mini" @click="handlePhaseStepMoveDown">下移</el-button>
      <el-button type="primary" size="mini" @click="handleAddPhaseStep">添加步骤</el-button>
    </div>

    <!-- 相别步骤table -->
    <plk-table
      table-height="calc(100vh - 200px)"
      col-min-width="160px"
      :table-stripe="false"
      :table-header="phaseStepHeader"
      :table-data="phaseStepListData"
      @selectionChange="handleSelectionChange"
    >
      <!-- 功能 -->
      <template v-slot:functionCode="row">
        <span>{{ row.scope.row.functionData.functionCode }}</span>
      </template>
      <template v-slot:functionName="row">
        <span>{{ row.scope.row.functionData.functionName }}</span>
      </template>

      <!-- 方式 -->
      <template v-slot:dataCode="row">
        <span>{{ row.scope.row.methodData.dataCode }}</span>
      </template>
      <template v-slot:description="row">
        <span>{{ row.scope.row.methodData.description }}</span>
      </template>

      <!-- 操作 -->
      <template v-slot:btnSlot="row">
        <el-button
          type="primary"
          size="mini"
          @click="handleTableRowEdit(row.scope)"
        >
          编辑
        </el-button>
        <el-button
          type="danger"
          size="mini"
          @click="handleTableRowDelete(row.scope)"
        >
          删除
        </el-button>
        <i v-if="!row.scope.row.state" class="el-icon-warning el-icon--right" style="color: red; font-size: 22px;line-height: 1;" />
      </template>
    </plk-table>

    <!-- 相别步骤弹窗 -->
    <phase-step-dialog
      v-if="phaseStepDialog"
      v-el-drag-dialog
      :phase-step-type="phaseStepType"
      :phase-step-dialog="phaseStepDialog"
      :current-phase-step-data="currentPhaseStepData"
      @close="handlePhaseStepDialogClose"
    />
  </div>
</template>

<script>
import PlkTable from '@/components/Table'
import PhaseStepDialog from './components/PhaseStepDialog'
import Emitter from '../js/Emitter'
import {
  getDeviceUnitFunMethodList
} from '@/api/technology/info'
export default {
  name: 'PhaseStepPage',

  components: { PlkTable, PhaseStepDialog },

  mixins: [Emitter],

  provide() {
    return {
      PhaseStepPage: this
    }
  },

  props: {
    currentPhaseStepPageData: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      phaseStepHeader: [
        { label: '步骤', prop: 'step', width: '80px' },
        { label: '描述', prop: 'describe', width: '160px' },
        { label: '功能编号', prop: 'functionCode', type: 'slot' },
        { label: '功能名称', prop: 'functionName', type: 'slot' },
        { label: '方式数据编号', prop: 'dataCode', type: 'slot' },
        { label: '方式数据描述', prop: 'description', type: 'slot' },
        // { label: '参数id', prop: 'parameterId' },
        // { label: '参数名称', prop: 'parameterName' },
        // { label: '参数值', prop: 'parameterValue' },
        // { label: '物料名', prop: 'step' },
        // { label: '相别编号', prop: 'step' },
        { label: '操作', type: 'btn', fixed: 'right', width: '200px' }
      ],
      phaseStepListData: this.currentPhaseStepPageData.phaseStepList,
      phaseStepListSelection: [],

      /* 相别步骤新增、编辑 */
      currentPhaseStepData: {},
      phaseStepType: 'add', // add/edit
      phaseStepDialog: false
    }
  },

  mounted() {
    console.log('currentPhaseStepPageData', this.currentPhaseStepPageData)
    this.getDeviceUnitFunMethodList()
  },

  methods: {
    /* 获取设备单元功能方式,合并 */
    getDeviceUnitFunMethodList() {
      const { deviceId, functionList } = this.currentPhaseStepPageData
      console.log('deviceId', deviceId)
      getDeviceUnitFunMethodList(deviceId).then(res => {
        for (const item of res.data) {
          const { functionCode, functionId, functionName, methodDataList, methodId, methodName } = item

          for (const functionItem of functionList) {
            if (functionId === functionItem.functionId) {
              Object.assign(functionItem, { functionCode, methodDataList, methodId, methodName })
              break
            }
          }
        }
        console.log('currentPhaseStepPageData', this.currentPhaseStepPageData)
      })
    },

    /* 关闭 */
    handlePhaseStepDialogClose() {
      this.phaseStepDialog = false
    },

    /* 编辑步骤弹窗 */
    handleTableRowEdit({ row }) {
      this.currentPhaseStepData = row
      this.phaseStepType = 'edit'
      this.phaseStepDialog = true
    },

    /* 删除步骤 */
    handleTableRowDelete({ row }) {
      console.log('row', row)
      this.$confirm('确认删除吗？', '警告', {
        cancelButtonClass: '取消',
        confirmButtonClass: '确定',
        type: 'warning'
      }).then(() => {
        this.dispatch('TechnologyWritingPage', 'on-delete-phase-step', row)
      })
    },

    /* 处理选中改变 */
    handleSelectionChange(value) {
      console.log('phaseStepListSelection', value)
      this.phaseStepListSelection = value
    },

    /* 添加步骤 */
    handleAddPhaseStep() {
      const { maxTep, phaseStepList } = this.currentPhaseStepPageData
      if (maxTep > phaseStepList.length) {
        this.phaseStepType = 'add'
        this.phaseStepDialog = true
      } else {
        const h = this.$createElement
        this.$notify.error({
          title: '提示',
          message: h('span', { style: 'color: red' }, '当前步骤数已达设备最大步骤'),
          position: 'bottom-right'
        })
      }
    },

    /* 相别步骤上移  */
    handlePhaseStepMoveUp() {
      console.log('this.phaseStepListSelection', this.phaseStepListSelection)
      this.dispatch('TechnologyWritingPage', 'on-move-up-phase-step', this.phaseStepListSelection)
    },

    /* 相别步骤下移 */
    handlePhaseStepMoveDown() {
      this.dispatch('TechnologyWritingPage', 'on-move-down-phase-step', this.phaseStepListSelection)
    }

  }
}
</script>
<style lang='scss' scoped>
.phase-step-page {
  padding: 0 16px;

  .phase-step-toolbar {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 48px;
  }

}
</style>
