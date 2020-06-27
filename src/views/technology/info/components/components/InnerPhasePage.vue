<template>
  <div class="inner-phase-init-page">
    <plk-table
      table-height="calc(100% - 80px)"
      col-min-width="150px"
      :table-header="deviceUnitHeader"
      :table-data="currentInnerPhasePageData"
      @selectionChange="handleSelectionChange"
    />
    <span class="table-footer">
      <el-button size="small" @click="handleClose">取 消</el-button>
      <el-button type="primary" size="small" @click="handleCommit">确 定</el-button>
    </span>

    <!-- 内相弹窗 -->
    <inner-phase-dialog
      v-if="innerPhaseDialog"
      v-el-drag-dialog
      :inner-phase-dialog="innerPhaseDialog"
      :device-unit-selection="deviceUnitSelection"
      @close="handleInnerPhaseDialogClose"
      @close-all="handleInnerPhaseDialogAndPageClose"
    />
  </div>
</template>

<script>
import PlkTable from '@/components/Table'
import InnerPhaseDialog from './components/InnerPhaseDialog'
export default {
  name: 'InnerPhaseInitPage',

  components: { PlkTable, InnerPhaseDialog },

  props: {
    currentInnerPhasePageData: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      deviceUnitHeader: [
        { label: '设备编号', prop: 'deviceCode' },
        { label: '设备名称', prop: 'deviceName' },
        { label: '产量下限', prop: 'quantityLowLimit' },
        { label: '产量上限', prop: 'quantityUpLimit' },
        { label: '最大步骤', prop: 'maxTep' },
        { label: '备注', prop: 'remark' },
        { label: '类型', prop: 'type' }
      ],
      deviceUnitSelection: [],

      /* innerPhaseDialog */
      innerPhaseDialog: false
    }
  },

  methods: {
    /* 校验是否选中设备单元 */
    handleDeviceUnitSelectionEmptyCheck() {
      if (this.deviceUnitSelection.length === 0) {
        const h = this.$createElement
        this.$notify.error({
          title: '提示',
          message: h('span', { style: 'color: red' }, '请选择设备单元'),
          position: 'bottom-right'
        })
        return false
      }
      return true
    },

    /* 提交 */
    handleCommit() {
      if (!this.handleDeviceUnitSelectionEmptyCheck()) return
      this.innerPhaseDialog = true
    },

    /* 关闭 */
    handleClose() {
      this.$emit('close')
    },

    /* 处理选中框改变 */
    handleSelectionChange(value) {
      this.deviceUnitSelection = value
    },

    /* 处理内相弹窗关闭 */
    handleInnerPhaseDialogClose() {
      this.innerPhaseDialog = false
    },

    /* 处理内相弹窗和当前页面关闭 */
    handleInnerPhaseDialogAndPageClose() {
      this.handleInnerPhaseDialogClose()
      this.handleClose()
    }
  }
}
</script>
<style lang='scss' scoped>
.inner-phase-init-page {
  height: 100%;
  padding: 0 16px;
  .table-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 16px 0;
  }
}
</style>
