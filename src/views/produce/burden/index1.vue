<template>
  <div class="material-container">
    <div class="warpper">
      <div class="container-header">
        <el-select v-model="status" size="small" clearable placeholder="请选择状态">
          <el-option label="待配料" value="unBurden" />
          <el-option label="配料中" value="dosing" />
          <el-option label="已配料" value="burden" />
          <el-option label="待复核" value="review" />
          <el-option label="已复核" value="alreadyReview" />
          <el-option label="待配制" value="formulated" />
          <el-option label="已配制" value="alreadyFormulated" />
        </el-select>
        <el-button type="primary" size="small" @click="handleSearch">搜索</el-button>
      </div>
      <div class="burden-tabel">
        <plk-table
          :table-selection="false"
          :table-data="burdenData"
          :table-header="tableHeader"
          table-height="calc(100vh - 266px)"
        >
          <template v-slot:btnSlot="clo">
            <el-button
              v-permission-key="btnPermission.processList"
              type="primary"
              size="mini"
              @click="handleProcess(clo)"
            >
              配料过程
            </el-button>
            <el-button
              type="primary"
              size="mini"
              @click="handleOpenBurdenListPrint(clo)"
            >
              打印
            </el-button>
          </template>
        </plk-table>
      </div>
      <!--  分页  -->
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="currentPage"
        :limit.sync="size"
        @pagination="handleGetBurdenList"
      />
    </div>

    <!--  配料过程  -->
    <el-dialog
      v-if="showDialog"
      v-el-drag-dialog
      modal
      lock-scroll
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="showDialog"
      width="90%"
    >
      <plk-table
        :table-selection="false"
        :table-data="processData"
        :table-header="processHeader"
        table-height="calc(100vh - 366px)"
      />
      <pagination
        v-show="processTotal>0"
        :total="processTotal"
        :page.sync="processCurrentPage"
        :limit.sync="processSize"
        @pagination="handleGetProcessList"
      />
    </el-dialog>

    <!-- 打印配料清单 -->
    <burden-list-print
      :curr-process="currProcess"
      :process-data="processData"
      :show-burden-list-print-dialog="showBurdenListPrintDialog"
      @close="handleCloseBurdenListPrint"
    />
  </div>
</template>

<script>
import btnPermission from './btnPermission.js'
import Pagination from '@/components/Pagination'
import PlkTable from '@/components/Table'
import BurdenListPrint from './components/BurdenListPrint'
import { getBurdenList, getprocess } from '@/api/produce/burden'

export default {
  name: 'Index',

  components: {
    PlkTable,
    Pagination,
    BurdenListPrint
  },

  data() {
    return {
      status: '',
      showDialog: false,
      showBurdenListPrintDialog: false,
      dialogTitle: '',
      STATUS: '',
      currentPage: 1, // 当前页
      size: 30, // 每页显示多少条
      total: 0, // 总数
      processCurrentPage: 1, // 当前页
      processSize: 30, // 每页显示多少条
      processTotal: 0, // 总数
      currProcess: {},
      burdenData: [], // 配料管理列表
      processData: [], // 配料过程列表
      tableHeader: [
        { label: '所属工单编号', prop: 'workOrderCode' },
        { label: '所属批号', prop: 'batchCode' },
        { label: '配料编号', prop: 'burdenCode' },
        { label: '物料代码', prop: 'materialCode' },
        { label: '物料标识', prop: 'materialId' },
        { label: '物料名称', prop: 'materialName' },
        { label: '配料比例', prop: 'proportion' },
        { label: '目标误差(kg)', prop: 'targetError', width: '130px' },
        { label: '目标净重量(kg)', prop: 'targetNetWeight', width: '130px' },
        { label: '实际净重量(kg)', prop: 'actualNetWeight', width: '130px' },
        { label: '实际去皮重量(kg)', prop: 'actualTareWeight', width: '140px' },
        { label: '状态', prop: '_status' },
        { label: '创建时间', prop: 'createdTime' },
        { label: '备注', prop: 'remark' },
        { label: '操作', type: 'btn', fixed: 'right', width: '180px' }
      ],
      processHeader: [
        { label: '实际误差(kg)', prop: 'actualError', width: '130px' },
        { label: '实际净重量(kg)', prop: 'actualNetWeight', width: '130px' },
        { label: '实际去皮重量(kg)', prop: 'actualTareWeight', width: '140px' },
        { label: '配料时间', prop: 'burdenAt' },
        { label: '复核设备编号', prop: 'burdenDeviceCode', width: '130px' },
        { label: '配料标识', prop: 'burdenId' },
        { label: '配料模式', prop: 'burdenMode' },
        { label: '配料过程标识', prop: 'burdenProcessId' },
        { label: '配料人', prop: 'burdenUserId' },
        { label: '复核时间', prop: 'checkAt' },
        { label: '复核人', prop: 'checkUserId' },
        { label: '创建人标识', prop: 'createdId' },
        { label: '创建时间', prop: 'createdTime' },
        { label: '删除人标识', prop: 'deletedId' },
        { label: '删除时间', prop: 'deletedTime' },
        { label: '部门标识', prop: 'departmentId' },
        { label: '投料时间', prop: 'feedDateAt' },
        { label: '投料人', prop: 'feedUserId' },
        { label: '是否删除', prop: 'isDeleted' },
        { label: '是否强制投料', prop: 'isForce' },
        { label: '位置', prop: 'location' },
        { label: '物料标识', prop: 'materialId' },
        { label: '原料重量(kg)', prop: 'materialWeight', width: '130px' },
        { label: '组织标识', prop: 'organizationId' },
        { label: '入库批次标识', prop: 'packageId' },
        { label: '备注', prop: 'remark' },
        { label: '状态', prop: 'status' },
        { label: '目标净重量', prop: 'targetNetWeight', width: '130px' },
        { label: '单位', prop: 'unit' },
        { label: '更新人标识', prop: 'updatedId' },
        { label: '更新时间', prop: 'updatedTime' }
      ]
    }
  },

  computed: {
    btnPermission() {
      return btnPermission
    }
  },

  mounted() {
    this.STATUS = this.$store.state.status
    this.handleGetBurdenList()
  },

  methods: {
    /**
     * 获取配料管理列表
     */
    handleGetBurdenList() {
      const data = {
        current: this.currentPage,
        size: this.size,
        status: this.status
      }
      getBurdenList(data).then(res => {
        if (res.code === '200') {
          this.burdenData = res.data.list.map(item => ({
            ...item,
            _status: this.STATUS[item.status]
          }))
          this.total = Number(res.data.total)
        }
      })
    },

    /**
     * 搜索
     */
    handleSearch() {
      this.currentPage = 1
      this.handleGetBurdenList()
    },

    /**
     * 点击获取配料过程按钮
     */
    handleProcess(clo) {
      this.currProcess = clo.scope.row
      this.handleGetProcessList()
    },

    /**
     * 请求配料过程列表
     */
    handleGetProcessList() {
      const data = {
        current: this.processCurrentPage,
        size: this.processSize
      }
      const burdenId = this.currProcess.burdenId
      getprocess(data, burdenId).then(res => {
        if (res.code === '200') {
          this.showDialog = true
          this.dialogTitle = '配料过程'
          this.processData = res.data.list
          this.processTotal = Number(res.data.total)
        }
      })
    },

    /**
     * 打开称量清单打印
     */
    handleOpenBurdenListPrint(clo) {
      this.currProcess = clo.scope.row
      const data = {
        current: this.processCurrentPage,
        size: this.processSize
      }
      const burdenId = this.currProcess.burdenId
      getprocess(data, burdenId).then(res => {
        if (res.code === '200') {
          this.showBurdenListPrintDialog = true
          this.processData = res.data.list
          this.processTotal = Number(res.data.total)
        }
      })
    },

    /**
     * 关闭称量清单打印
     */
    handleCloseBurdenListPrint() {
      this.showBurdenListPrintDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.container-header {
  padding-bottom: 16px;
}

.search {
  width: 160px;
  margin-right: 10px;
}
</style>
