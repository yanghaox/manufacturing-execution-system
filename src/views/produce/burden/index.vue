<template>
  <div class="material-container">
    <div class="warpper">
      <div class="container-header">
        <el-input
          v-model="workOrderCode"
          size="small"
          class="search"
          placeholder="请输入工单编号"
        />
        <el-input
          v-model="workOrderName"
          size="small"
          class="search"
          placeholder="请输入工单名"
        />
        <el-date-picker
          v-model="planStartTime"
          type="datetime"
          size="small"
          class="search"
          placeholder="计划开始时间"
        />
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
      <div class="order-table">
        <plk-table
          row-key="id"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          :load="handleGetBatch"
          :table-selection="false"
          :table-data="tableData"
          :table-header="tableHeader"
          table-height="calc(100vh - 266px)"
        >
          <template v-slot:btnSlot="clo">
            <el-button
              type="primary"
              size="mini"
            >
              配料过程
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
        @pagination="handleGetWorderOrder"
      />
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import PlkTable from '@/components/Table'
import BurdenListPrint from './components/BurdenListPrint'
import { getWorkOrder, getBatch, getBurden, getProcess, processPrint } from '@/api/produce/burden'
import { GMTToStr } from '@/utils'

export default {
  name: 'Index',

  components: {
    PlkTable,
    Pagination,
    BurdenListPrint
  },

  data() {
    return {
      workOrderCode: '',
      workOrderName: '',
      planStartTime: '',
      status: '',
      STATUS: '',
      tableData: [],
      tableHeader: [
        { label: '工单编号', prop: 'workOrderCode' },
        { label: '工单名', prop: 'workOrderName' },
        { label: '所属部门', prop: 'belongDepartment' },
        { label: '产量(kg)', prop: 'yield' },
        { label: '计划结束时间', prop: 'planEndTime', width: '140px' },
        { label: '计划开始时间', prop: 'planStartTime', width: '140px' },
        { label: '开始时间', prop: 'startTime' },
        { label: '结束时间', prop: 'endTime' },
        { label: '状态', prop: '_status' },
        { label: '客户', prop: 'client' },
        { label: '创建人', prop: 'createdBy' },
        { label: '创建时间', prop: 'createdTime' },
        { label: '备注', prop: 'remark' },
        // ====================================================================
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
        { label: '操作', type: 'btn', fixed: 'right', width: '180px' }
      ],
      currentPage: 1, // 当前页
      size: 30, // 每页显示多少条
      total: 0, // 总数
    }
  },

  mounted() {
    this.STATUS = this.$store.state.status
    this.handleGetWorderOrder()
  },

  methods: {
    /**
     * 获取工单列表
     */
    handleGetWorderOrder() {
      const data = {
        current: this.currentPage,
        size: this.size,
        planStartTime: this.planStartTime ? GMTToStr(this.planStartTime) : '',
        status: this.status,
        workOrderCode: this.workOrderCode,
        workOrderName: this.workOrderName
      }
      getWorkOrder(data).then(res => {
        if (res.code === '200') {
          this.tableData = res.data.list.map(item => ({
            ...item,
            _status: this.STATUS[item.status]
          }))
        }
      })
    },

    /**
     * 搜索
     */
    handleSearch() {
      this.currentPage = 1
      this.handleGetWorderOrder()
    },

    /**
     * 获取批次列表
     */
    handleGetBatch(tree, treeNode, resolve) {
      getBatch().then(res => {
        const data = res.data.list.map(item => ({
          ...item,
          _status: this.STATUS[item.status]
        }))
        resolve(data)
      })
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
