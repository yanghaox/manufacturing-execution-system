<template>
  <div class="edit-device-group">
    <toolbar :toolbar-list="toolbarList" />

    <div class="warpper">
      <div class="device-group-name">设备组：{{currDeviceGroup.groupName}}</div>
      <plk-table
        table-height="calc(100vh - 314px)"
        col-min-width="150px"
        :table-selection="false"
        :table-header="deviceUnitHeader"
        :table-data="deviceUnitData"
        @selectionChange="handleSelectionChange"
      >
        <template v-slot:btnSlot="row">
          <el-button
            v-permission-key="btnPermission.unitDetail"
            type="primary"
            size="mini"
            @click="deviceUnitDetail(row.scope)"
          >
            详情
          </el-button>
          <el-button
            v-permission-key="btnPermission.deleteUnit"
            type="danger"
            size="mini"
            @click="deletedeviceUnit(row.scope)"
          >
            删除
          </el-button>
        </template>
      </plk-table>

      <pagination :total="pagination.total" @pagination="handlePagination" />
    </div>

    <!-- 设备单元 -->
    <device-unit-detail
      v-if="deviceUnitDialog"
      v-el-drag-dialog
      :device-unit-dialog="deviceUnitDialog"
      :current-device-unit-data="currentdeviceUnitData"
      :device-unit-type="deviceUnitType"
      :curr-device-group="currDeviceGroup"
      @closeDialog="handledeviceUnitClose"
    />
  </div>
</template>
<script>
import Toolbar from '@/components/Toolbar'
import PlkTable from '@/components/Table'
import Pagination from '@/components/Pagination'
import DeviceUnitDetail from './DeviceUnitDetail'
import {
  getDeviceGroupDetail,
  deleteDeviceUnit,
  getDeviceUnitDetail
} from '@/api/device/deviceGroup'

export default {
  name: 'EditDeviceGroup',

  components: {
    Toolbar,
    PlkTable,
    Pagination,
    DeviceUnitDetail
  },

  props: {
    currDeviceGroup: {
      type: Object,
      required: true
    },
    btnPermission: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      toolbarList: [],
      deviceUnitHeader: [
        { label: '设备名称', prop: 'deviceName' },
        { label: '备注', prop: 'remark' },
        { label: '操作', type: 'btn', fixed: 'right', width: '300px' }
      ],
      deviceUnitData: [],
      deviceUnitSelection: [],

      deviceGroupDetail: {}, // 设备组详情

      pagination: {
        total: 0
      },

      // 设备单元弹出框
      currentdeviceUnitData: {},
      deviceUnitDialog: false,
      deviceUnitType: '' // add/edit
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    init() {
      this.getDeviceGroupDetail()
      this.initToolbar()
    },

    /* 获取设备组详情 */
    getDeviceGroupDetail() {
      const groupId = this.currDeviceGroup.groupId
      getDeviceGroupDetail({ groupId }).then(res => {
        this.deviceGroupDetail = res.data
        this.deviceUnitData = this.deviceGroupDetail.deviceUnitList
      })
    },

    /* 初始化工具栏 */
    initToolbar() {
      this.toolbarList = [
        {
          id: '3',
          type: 'dropdown',
          text: '新增',
          dropdownList: [
            { id: '1', text: '新增', disabled: false, click: this.addDeviceUnit },
            { id: '2', text: '复制', disabled: true }
          ]
        },
        { id: '13', type: 'button', text: '退出', click: this.quit }
      ]
    },

    /* 添加设备单元弹窗 */
    addDeviceUnit() {
      this.deviceUnitType = 'add'
      this.deviceUnitDialog = true
    },

    // 设备单元详情
    deviceUnitDetail({ row }) {
      getDeviceUnitDetail(row.deviceId).then(res => {
        this.currentdeviceUnitData = res.data
        this.deviceUnitType = 'edit'
        this.deviceUnitDialog = true
      })
    },

    /* 删除设备单元 */
    deletedeviceUnit({ row }) {
      this.$confirm(`确认删除${row.deviceName}吗？`, '警告', {
        cancelButtonClass: '取消',
        confirmButtonClass: '确定',
        type: 'warning'
      }).then(() => {
        const data = {
          unitList: [row.deviceId]
        }

        deleteDeviceUnit(data, this.currDeviceGroup.groupId).then(res => {
          this.$message.success(res.message)
          this.init()
        })
      })
    },

    /* 处理选中框改变 */
    handleSelectionChange(value) {
      this.deviceUnitSelection = value
    },

    /* 处理选中框改变 */
    quit() {
      this.$emit('quit')
    },

    /* 处理分页 */
    handlePagination({ page, limit }) {
    },

    /* 处理设备单元弹窗关闭 */
    handledeviceUnitClose() {
      if (this.deviceUnitType === 'add') {
        this.init()
      }
      this.deviceUnitDialog = false
    }
  }
}
</script>
<style lang='scss' scoped>
.device-group-name {
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: 700;
  color: #606266;
}
</style>
