<template>
  <div class="work-order-container">
    <div class="warpper">
      <div class="container-header">
        <el-input
          v-model="workOrderCode"
          size="small"
          class="search"
          placeholder="请输入工单编号"
          @keyup.enter.native="handleSearch"
        />
        <el-input
          v-model="workOrderName"
          size="small"
          class="search"
          placeholder="请输入工单名"
          @keyup.enter.native="handleSearch"
        />
        <el-select v-model="status" clearable size="small" class="search" placeholder="请选择状态">
          <el-option v-for="(item, index) in statusList" :key="index" :label="item.label" :value="item.value" />
        </el-select>
        <el-button type="primary" size="small" class="search-button" @click="handleSearch">搜索</el-button>
        <el-button v-permission-key="btnPermission.addWorkOrder" type="primary" size="small" class="search-button" @click="handleAdd">
          新增
        </el-button>
      </div>
      <!--  工单列表    -->
      <div class="order-list">
        <plk-table
          :table-selection="false"
          :table-header="tableHeader"
          :table-data="workOrderList"
          table-height="calc(100vh - 266px)"
        >
          <template v-slot:btnSlot="clo">
            <el-button type="danger" size="mini" @click="handleDelete(clo)">删除</el-button>
          </template>
        </plk-table>
      </div>

      <Pagination
        v-show="total>0"
        :total="total"
        :page.sync="currentPage"
        :limit.sync="size"
        @pagination="handelGetWorkOrder"
      />
    </div>

    <!--  添加弹窗  -->
    <el-dialog
      v-if="formDialog.show"
      v-el-drag-dialog
      modal
      lock-scroll
      :title="formDialog.title"
      :close-on-click-modal="false"
      :visible.sync="formDialog.show"
      width="40%"
    >
      <plk-form
        ref="zrf"
        :options="formDialog.options"
        :option-value="formDialog.optionValue"
        class="form-component scrollbar"
      />
      <div style="text-align: right">
        <el-button size="small" @click="formDialog.show=false">取消</el-button>
        <el-button
          size="small"
          type="primary"
          @click="$refs.zrf.handleCheckData() && formDialog.submit($refs.zrf.handleGetFormData())"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import btnPermission from './btnPermission.js'
import PlkForm from '@/components/Form'
import FormFunction from '@/components/Form/FormFunction'
import PlkTable from '@/components/Table'
import Pagination from '@/components/Pagination'
import { GMTToStr } from '@/utils'
import { validNumber } from '@/utils/formRules'
import {
  getWorkOrder,
  postWorkOrder,
  deleteWorkOrder,
  getDepartment
} from '@/api/produce/workOrder'

export default {
  name: 'Index',

  components: {
    PlkForm,
    PlkTable,
    Pagination
  },

  mixins: [FormFunction],

  data() {
    return {
      planStartTime: '',
      status: '',
      workOrderCode: '',
      workOrderName: '',
      STATUS: '',
      currentPage: 1, // 当前页
      size: 30, // 每页显示多少条
      total: 0, // 总数
      formOptions: {}, // 表单选项
      workOrderList: [],
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
        { label: '备注', prop: 'remark' }
      ],
      statusList: [
        { label: '待审批', value: 'pending' },
        { label: '已审批', value: 'audited' },
        { label: '配料中', value: 'dosing' },
        { label: '已配料', value: 'alreadyDosing' },
        { label: '复核中', value: 'review' },
        { label: '已复核', value: 'alreadyReview' }
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
    this.handelGetWorkOrder()
  },

  methods: {
    async handleInitFormOptions() {
      const department = await this.handleGetDepartmentList()
      this.formOptions = {
        workOrderCode: {
          label: '工单编号',
          rules: [
            { required: true, message: '请输入工单编号', trigger: 'blur' }
          ]
        },
        workOrderName: {
          label: '工单名',
          rules: [
            { required: true, message: '请输入工单名', trigger: 'blur' }
          ]
        },
        planStartTime: {
          label: '计划开始时间',
          type: 'dateTime',
          rules: [
            { required: true, message: '请选择计划开始时间', trigger: 'change' }
          ]
        },
        planEndTime: {
          label: '计划结束时间',
          type: 'dateTime',
          rules: [
            { required: true, message: '请选择计划结束时间', trigger: 'change' }
          ]
        },
        department: {
          label: '所属部门',
          type: 'selectObj',
          selectItems: department,
          rules: [
            { required: true, message: '请选择所属部门', trigger: 'change' }
          ]
        },
        yield: {
          label: '产量',
          append: 'kg',
          rules: [
            { required: true, message: '请输入产量', trigger: 'blur' },
            { message: '请输入实数', trigger: 'blur', validator: validNumber }
          ]
        },
        client: {
          label: '客户'
        },
        remark: {
          label: '备注'
        }
      }
    },
    /**
     * 获取工单列表
     */
    handelGetWorkOrder() {
      const data = {
        planStartTime: this.planStartTime ? GMTToStr(this.planStartTime) : '',
        status: this.status,
        workOrderCode: this.workOrderCode,
        workOrderName: this.workOrderName,
        current: this.currentPage,
        size: this.size
      }
      getWorkOrder(data).then(res => {
        if (res.code === '200') {
          this.workOrderList = res.data.list.map(item => ({
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
      this.handelGetWorkOrder()
    },

    /**
     * 添加工单
     */
    async handleAdd() {
      await this.handleInitFormOptions()
      this.formDialog = {
        show: true,
        title: '新增工单',
        optionValue: {
          workOrderCode: '',
          workOrderName: '',
          yield: '',
          department: '',
          client: '',
          planStartTime: '',
          planEndTime: '',
          remark: ''
        },
        options: this.formOptions,
        submit: this.handlePost
      }
    },

    /**
     * 提交工单
     * @param value
     */
    handlePost(value) {
      value.belongDepartment = value.department.departmentName
      value.belongDepartmentId = value.department.departmentId
      Reflect.deleteProperty(value, 'department')
      postWorkOrder(value).then(res => {
        if (res.code === '200') {
          this.$message.success(res.message)
          this.formDialog.show = false
          this.handelGetWorkOrder()
        }
      })
    },

    // 删除工单
    handleDelete(clo) {
      this.$confirm(`确定删除${clo.scope.row.workOrderCode}吗？`, '警告', {
        confirmButtonClass: '确定',
        cancelButtonClass: '取消',
        type: 'warning'
      }).then(() => {
        deleteWorkOrder(clo.scope.row.workOrderId).then(res => {
          this.$message.success(res.message)
          this.handelGetWorkOrder()
        })
      })
    },
    /**
     * 获取部门列表
     * @returns {Promise<*>}
     */
    async handleGetDepartmentList() {
      const department = await getDepartment()
      return department.data.map(item => ({
        ...item,
        label: item.departmentName,
        value: item.departmentId
      }))
    }
  }
}
</script>

<style lang="scss" scoped>
.container-header {
  div, button {
    margin-bottom: 16px;
  }
}

.search {
  width: 160px;
  margin-right: 10px;
}
</style>
