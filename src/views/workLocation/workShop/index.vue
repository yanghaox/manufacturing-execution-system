<template>
  <div class="app-container">
    <div class="warpper">
      <div class="header-btn">
        <el-input
          v-model="principal"
          size="small"
          class="search-role"
          placeholder="请输入负责人"
          @keyup.enter.native="handleGetWorkShop"
        />
        <el-input
          v-model="workShopCode"
          size="small"
          class="search-role"
          placeholder="请输入车间编号"
          @keyup.enter.native="handleGetWorkShop"
        />
        <el-button
          type="primary"
          size="mini"
          @click="handleSearch"
        >
          搜索
        </el-button>
        <el-button
          v-permission-key="btnPermission.addWorkShop"
          type="primary"
          size="small"
          @click="handleAdd"
        >
          新增
        </el-button>
      </div>

      <!--   车间信息   -->
      <div class="work-shop-list">
        <plk-table
          :table-selection="false"
          :table-header="tableHeader"
          :table-data="tableData"
          col-align="center"
          table-height="calc(100vh - 266px)"
        >
          <template v-slot:btnSlot="clo">
            <el-button
              v-permission-key="btnPermission.editWorkShop"
              type="primary"
              size="mini"
              @click="handleEdit(clo)"
            >
              编辑
            </el-button>
            <el-button
              v-permission-key="btnPermission.deleteWorkShop"
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
        @pagination="handleGetWorkShop"
      />

      <!--  添加弹窗  -->
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
            提交
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
  getWorkShopList,
  postWorkShop,
  getPrincipalList,
  getWorkShopDetail,
  putWorkShop,
  deleteWorkShop
} from '@/api/workLocation/workShop'
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
      workShopCode: '',
      currentPage: 1, // 当前页
      size: 30, // 每页显示多少条
      total: 1, // 总数
      formOptions: {},
      tableData: [],
      dialogFormVisible: false,
      batchReportShow: false,
      tableHeader: [
        { label: '车间编号', prop: 'workShopCode' },
        { label: '车间负责人', prop: 'principal' },
        { label: '备注', prop: 'remark' },
        { label: '操作', type: 'btn', fixed: 'right', width: '150px' }
      ]
    }
  },

  computed: {
    btnPermission() {
      return btnPermission
    }
  },

  mounted() {
    this.handleGetWorkShop()
  },
  methods: {

    /**
     * 初始化form表单选项
     **/
    async initFormOption() {
      this.formOptions = {
        workShopCode: {
          label: '车间编号',
          rules: [
            { required: true, message: '车间编号不能为空', trigger: 'blur' }
          ]
        },
        principalName: {
          label: '负责人',
          type: 'selectObj',
          selectItems: await this.handleGetPrincipalList(),
          rules: [
            { required: true, message: '负责人不能为空', trigger: 'blur' }
          ]
        },
        remark: {
          label: '备注'
        }
      }
    },

    /**
     * 获取车间列表
     */
    handleGetWorkShop() {
      const data = {
        size: this.size,
        current: this.currentPage,
        principal: this.principal,
        workLocationCode: this.workLocationCode,
        workShopCode: this.workShopCode
      }
      getWorkShopList(data).then(res => {
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
      this.handleGetWorkShop()
    },

    /**
     * 新增弹窗
     * */
    async handleAdd() {
      await this.initFormOption()
      this.formDialog = {
        show: true,
        title: '新增车间',
        optionValue: {
          principalName: '',
          workShopCode: '',
          remark: ''
        },
        options: this.formOptions,
        submit: this.handlePost
      }
    },

    /**
     * 获取负责人
     * */
    async handleGetPrincipalList() {
      const { data: principal } = await getPrincipalList()
      return principal.map(item => ({
        ...item,
        label: item.principal,
        value: item.principalId
      }))
    },

    /**
     * 提交新增
     * @param value
     */
    handlePost(value) {
      value.principal = value.principalName.label
      value.principalId = value.principalName.value
      unset(value, 'principalName')
      postWorkShop(value).then(res => {
        if (res.code === '200') {
          this.formDialog.show = false
          this.handleGetWorkShop()
          this.$message.success(res.message)
        }
      })
    },

    /**
     * 编辑
     * @param clo
     */
    async handleEdit(clo) {
      await this.initFormOption()
      const workShopId = clo.scope.row.workShopId
      getWorkShopDetail(workShopId).then(res => {
        console.log(res)
        if (res.code === '200') {
          const { workShopCode, remark } = res.data
          this.formDialog = {
            show: true,
            title: `修改车间：${res.data.workShopCode}`,
            optionValue: {
              workShopId: res.data.workShopId,
              principalName: { label: res.data.principal, value: res.data.principalId },
              workShopCode,
              remark
            },
            options: this.formOptions,
            submit: this.handlePut
          }
        }
      })
    },

    /**
     * 提交修改
     * @param value
     */
    handlePut(value) {
      value.principal = value.principalName.label
      value.principalId = value.principalName.value
      unset(value, 'principalName')
      putWorkShop(value, value.workShopId).then(res => {
        if (res.code === '200') {
          this.formDialog.show = false
          this.$message.success(res.message)
          this.handleGetWorkShop()
        }
      })
    },

    /**
     * 删除车间
     * @param clo
     */
    handleDelete(clo) {
      console.log(clo)
      const workShopId = clo.scope.row.workShopId
      this.$confirm(`确定删除${clo.scope.row.workShopCode}吗？`, '警告', {
        confirmButtonClass: '确定',
        cancelButtonClass: '取消',
        type: 'warning'
      }).then(() => {
        deleteWorkShop(workShopId).then(res => {
          if (res.code === '200') {
            this.handleGetWorkShop()
            this.$message.success(res.message)
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
