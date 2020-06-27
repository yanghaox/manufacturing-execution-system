<template>
  <div class="app-container">
    <div class="warpper">
      <div class="header-btn">
        <el-input
          v-model="principal"
          size="small"
          class="search-role"
          placeholder="请输入负责人"
          @keyup.enter.native="handleGetWorkLocation"
        />
        <el-input
          v-model="workLocationCode"
          size="small"
          class="search-role"
          placeholder="请输入工位编号"
          @keyup.enter.native="handleGetWorkLocation"
        />
        <el-input
          v-model="workShopCode"
          size="small"
          class="search-role"
          placeholder="请输入车间编号"
          @keyup.enter.native="handleGetWorkLocation"
        />
        <el-button
          type="primary"
          size="mini"
          @click="handleSearch"
        >
          搜索
        </el-button>
        <el-button
          v-permission-key="btnPermission.addWorkLocation"
          type="primary"
          size="small"
          @click="handleAdd"
        >
          新增
        </el-button>
      </div>
      <div class="work-location-list">
        <plk-table
          :table-selection="false"
          :table-header="tableHeader"
          :table-data="tableData"
          col-align="center"
          table-height="calc(100vh - 266px)"
        >
          <template v-slot:btnSlot="clo">
            <el-button
              v-permission-key="btnPermission.editWorkLocation"
              type="primary"
              size="mini"
              @click="handleEdit(clo)"
            >
              编辑
            </el-button>
            <el-button
              v-permission-key="btnPermission.deleteWorkLocation"
              type="danger"
              size="mini"
              @click="handleDelete(clo)"
            >
              删除
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
        @pagination="handleGetWorkLocation"
      />

      <!--  添加属性弹窗  -->
      <el-dialog
        v-if="formDialog.show"
        v-el-drag-dialog
        modal
        lock-scroll
        :title="formDialog.title"
        width="40%"
        :close-on-click-modal="false"
        :visible.sync="formDialog.show"
      >
        <plk-form ref="zrf" :options="formDialog.options" :option-value="formDialog.optionValue" />

        <div style="text-align: right">
          <el-button size="small" @click="handleCloseDialog">取消</el-button>
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
  </div>
</template>

<script>
import { unset } from 'lodash'
import plkTable from '@/components/Table'
import Pagination from '@/components/Pagination'
import plkForm from '@/components/Form'
import PLKFormFunction from '@/components/Form/FormFunction'
import {
  getWorkLocationList,
  addWorkLocation,
  getPrincipal,
  getWorkShop,
  putWorkLocation,
  deleteWorkLocation
} from '@/api/workLocation/workLocation'
import btnPermission from './btnPermission'

export default {
  name: 'Index',

  components: {
    plkTable,
    Pagination,
    plkForm
  },

  mixins: [PLKFormFunction],

  data() {
    return {
      principal: '',
      workLocationCode: '',
      workShopCode: '',
      currentPage: 1, // 当前页
      size: 30, // 每页显示多少条
      total: 1, // 总数
      formOptions: {},
      tableData: [],
      tableHeader: [
        { label: '工位编号', prop: 'workLocationCode' },
        { label: '车间编号', prop: 'workShopCode' },
        { label: '负责人', prop: 'principal' },
        { label: '创建时间', prop: 'createdTime' },
        { label: '备注', prop: 'remark' },
        { label: '操作', type: 'btn', fixed: 'right', minWidth: '150px' }
      ]
    }
  },

  computed: {
    btnPermission() {
      return btnPermission
    }
  },

  mounted() {
    this.handleGetWorkLocation()
  },

  methods: {
    // 初始化form表单选项
    async initFormOption() {
      this.formOptions = {
        workLocationCode: {
          label: '工位编号',
          rules: [
            { required: true, message: '工位编号不能为空', trigger: 'blur' }
          ]
        },
        principalName: {
          label: '负责人',
          type: 'selectObj',
          selectItems: await this.handleGerPrincipal(),
          rules: [
            { required: true, message: '负责人不能为空', trigger: 'blur' }
          ]
        },
        workShop: {
          label: '车间',
          type: 'selectObj',
          selectItems: await this.handleGetWorkShop(),
          rules: [
            { required: true, message: '车间不能为空', trigger: 'blur' }
          ]
        },
        remark: {
          label: '备注'
        }
      }
    },

    /**
     * 获取工位列表
     */
    handleGetWorkLocation() {
      const data = {
        size: this.size,
        current: this.currentPage,
        principal: this.principal,
        workLocationCode: this.workLocationCode,
        workShopCode: this.workShopCode
      }
      getWorkLocationList(data).then(res => {
        if (res.code === '200') {
          this.tableData = res.data.list
          this.total = Number(res.data.total)
        }
      })
    },

    /**
     * 搜索
     */
    handleSearch() {
      this.currentPage = 1
      this.handleGetWorkLocation()
    },

    /**
     * 添加弹窗
     */
    async handleAdd() {
      await this.initFormOption()
      this.formDialog = {
        show: true,
        title: '新增工位',
        optionValue: {
          workLocationCode: '',
          principalName: '',
          workShop: '',
          remark: ''
        },
        options: this.formOptions,
        submit: this.handlePost
      }
    },

    /**
     * 获取负责人列表
     * @returns {Promise<*>}
     */
    async handleGerPrincipal() {
      const { data: principal } = await getPrincipal()
      return principal.map(item => ({
        ...item,
        label: item.principal,
        value: item.principalId
      }))
    },

    /**
     * 获取车间列表
     * @returns {Promise<*>}
     */
    async handleGetWorkShop() {
      const { data: workShop } = await getWorkShop()
      return workShop.map(item => ({
        ...item,
        label: item.workShopCode,
        value: item.workShopId
      }))
    },

    /**
     * 提交新增
     * @param value form表单数据
     */
    handlePost(value) {
      value.principal = value.principalName.label
      value.principalId = value.principalName.value

      value.workShopCode = value.workShop.label
      value.workShopId = value.workShop.value
      unset(value, 'principalName')
      unset(value, 'workShop')
      addWorkLocation(value).then(res => {
        if (res.code === '200') {
          this.formDialog.show = false
          this.handleGetWorkLocation()
          this.$message.success(res.message)
        }
      })
    },

    /**
     * 编辑弹窗
     * @param clo
     */
    async handleEdit(clo) {
      await this.initFormOption()
      const item = clo.scope.row
      const { workLocationCode, remark, workLocationId } = { ...item }
      this.formDialog = {
        show: true,
        title: `修改工位：${item.workLocationCode}`,
        optionValue: {
          workLocationCode,
          workLocationId,
          remark,
          principalName: { label: item.principal, value: item.principalId },
          workShop: { label: item.workShopCode, value: item.workShopId }
        },
        options: this.formOptions,
        submit: this.handlePut
      }
    },

    /**
     * 提交编辑
     * @param value
     */
    handlePut(value) {
      value.principal = value.principalName.label
      value.principalId = value.principalName.value
      value.workShopCode = value.workShop.label
      value.workShopId = value.workShop.value
      unset(value, 'principalName')
      unset(value, 'workShop')
      putWorkLocation(value, value.workLocationId).then(res => {
        if (res.code === '200') {
          this.formDialog = false
          this.handleGetWorkLocation()
          this.$message.success(res.message)
        }
      })
    },

    /**
     * 删除
     * @param clo
     */
    handleDelete(clo) {
      console.log(clo)
      this.$confirm(`确定删除${clo.scope.row.workLocationCode}吗？`, '警告', {
        confirmButtonClass: '确定',
        cancelButtonClass: '取消',
        type: 'warning'
      }).then(() => {
        deleteWorkLocation(clo.scope.row.workLocationId).then(res => {
          if (res.code === '200') {
            this.$message.success(res.message)
            this.handleGetWorkLocation()
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.header-btn {
  display: flex;
  padding-bottom: 16px;

  .search-role {
    width: 160px;
    margin-right: 10px;
  }
}
</style>
