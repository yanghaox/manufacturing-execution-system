<template>
  <div class="unit">
    <toolbar :toolbar-list="toolbarList" />

    <plk-table
      table-height="calc(100vh - 250px)"
      col-min-width="150px"
      :table-header="deviceUnitHeader"
      :table-data="deviceUnitData"
      @selectionChange="handleSelectionChange"
    >
      <template v-slot:btnSlot="row">
        <el-button
          v-permission-key="[btnPermission.editDeviceUnit]"
          type="primary"
          size="mini"
          @click="editdeviceUnit(row.scope)"
        >
          编辑
        </el-button>
        <el-button
          v-permission-key="[btnPermission.deleteDeviceUnit]"
          type="danger"
          size="mini"
          @click="deletedeviceUnit(row.scope)"
        >
          删除
        </el-button>
      </template>
    </plk-table>

    <pagination
      :total="pagination.total"
      :page="pagination.pageNum"
      :limit="pagination.pageSize"
      @pagination="handlePagination"
    />

    <!-- 设备单元弹框 -->
    <el-drawer
      ref="deviceUnitDialog"
      :visible.sync="deviceUnitDialog"
      direction="ttb"
      size="100%"
      destroy-on-close
    >
      <template slot="title">
        <span>{{ `${TITLE_MAP.get(deviceUnitType)}设备单元 ${deviceUnitType === 'edit' ? currentDeviceUnitData.deviceCode:''}` }}</span>
      </template>
      <device-unit-dialog
        :device-unit-dialog="deviceUnitDialog"
        :device-unit-type="deviceUnitType"
        :current-device-unit-data="currentDeviceUnitData"
        @close-dialog="handleDeviceUnitClose"
      />
    </el-drawer>
  </div>
</template>

<script>
import Toolbar from '@/components/Toolbar'
import PlkTable from '@/components/Table'
import Pagination from '@/components/Pagination'

import DeviceUnitDialog from './components/DeviceUnitDialog'
import btnPermission from './btnPermission.js'

import {
  getDeviceUnit,
  getDeviceUnitDetail,
  deleteDeviceUnit
} from '@/api/device/unit'
export default {
  name: 'Unit',

  provide() {
    return {
      deviceUnit: this
    }
  },

  components: {
    Toolbar,
    PlkTable,
    Pagination,
    DeviceUnitDialog
  },

  data() {
    return {
      btnPermission,
      TITLE_MAP: new Map([['add', '添加'], ['edit', '编辑']]),

      toolbarList: [],
      deviceUnitHeader: [
        { label: '设备编号', prop: 'deviceCode', width: '160px' },
        { label: '设备名称', prop: 'deviceName', width: '160px' },
        { label: '设备类型', prop: 'type', width: '80px' },
        { label: '最小产量', prop: 'quantityLowLimit', width: '80px' },
        { label: '最大产量', prop: 'quantityUpLimit', width: '80px' },
        { label: '最大步骤数', prop: 'maxTep', width: '100px' },
        { label: '备注', prop: 'remark', width: '160px' },
        { label: '创建时间', prop: 'createdTime', width: '160px' },
        { label: '更新时间', prop: 'updatedTime', width: '160px' },
        { label: '操作', type: 'btn', fixed: 'right', width: '300px' }
      ],
      deviceUnitData: [],
      deviceUnitSelection: [],

      pagination: {
        total: 0,
        pageNum: 0,
        pageSize: 0
      },

      // 设备单元弹出框
      currentDeviceUnitData: {},
      deviceUnitDialog: false,
      deviceUnitType: 'add' // add/edit
    }
  },

  activated() {
    this.init()
  },

  mounted() {
    this.init()
  },

  methods: {
    init() {
      this.initToolbar()
      this.getDeviceUnit()
    },

    /* 初始化工具栏 */
    initToolbar() {
      this.toolbarList = [
        {
          id: '3',
          type: 'dropdown',
          text: '新增',
          dropdownList: [
            { id: '1', text: '新增', disabled: false, click: this.addDeviceUnit, btnPermission: this.btnPermission.addDeviceUnit },
            { id: '2', text: '复制', disabled: true }
          ]
        },
        { id: '13', type: 'button', text: '退出', disabled: true }
      ]
    },

    /* 获取设备组详情 */
    getDeviceUnit(params = {}) {
      getDeviceUnit(params).then(res => {
        const { list, total, pageSize, pageNum } = res.data
        this.deviceUnitData = list
        this.pagination.total = Number(total)
        this.pagination.pageNum = Number(pageNum)
        this.pagination.pageSize = Number(pageSize)
      })
    },

    /* 编辑设备单元 */
    editdeviceUnit({ row }) {
      console.log('editdeviceUnit', row)
      getDeviceUnitDetail(row.deviceId).then(res => {
        console.log('getDeviceUnitDetail', res)
        this.currentDeviceUnitData = res.data
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
        deleteDeviceUnit(row.deviceId).then(res => {
          this.$message.success(res.message)
          this.init()
        })
      })
    },

    /* 处理分页 */
    handlePagination({ page, limit }) {
      console.log(page, limit)
      this.pagination.pageNum = page
      this.pagination.pageSize = limit
      this.getDeviceUnit({ current: page, size: limit })
    },

    /* 处理选中框改变 */
    handleSelectionChange(value) {
      this.deviceUnitSelection = value
    },

    /* 添加设备单元弹窗 */
    addDeviceUnit() {
      this.deviceUnitType = 'add'
      this.deviceUnitDialog = true
    },

    /* 处理设备单元弹窗关闭 */
    handleDeviceUnitClose() {
      this.$refs.deviceUnitDialog.closeDrawer()
      this.init()
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
