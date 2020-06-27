<template>
  <div class="material-container">
    <div class="warpper">
      <div class="container-header">
        <el-input
          v-model="quantityUpLimit"
          size="small"
          class="search"
          placeholder="请输入产量上限"
          @keyup.enter.native="handleSearch"
        />
        <el-input
          v-model="quantityLowLimit"
          size="small"
          class="search"
          placeholder="请输入产量下限"
          @keyup.enter.native="handleSearch"
        />
        <el-button type="primary" size="small" @click="handleSearch">搜索</el-button>
        <el-button v-permission-key="btnPermission.addError" type="primary" size="small" @click="handleAdd">
          新增
        </el-button>
      </div>
      <div class="error-list">
        <plk-table
          :table-selection="false"
          :table-header="tableHeader"
          :table-data="errorList"
          table-height="calc(100vh - 266px)"
        >
          <template v-slot:btnSlot="clo">
            <el-button
              v-permission-key="btnPermission.editError"
              type="primary"
              size="mini"
              @click="handleEdit(clo)"
            >
              修改
            </el-button>
            <el-button
              v-permission-key="btnPermission.deleteError"
              type="danger"
              size="mini"
              @click="handleDelete(clo)"
            >
              删除
            </el-button>
          </template>
        </plk-table>
      </div>
      <Pagination
        v-show="total>0"
        :total="total"
        :page.sync="currentPage"
        :limit.sync="size"
        @pagination="handleGetErrorList"
      />
    </div>

    <!--  弹窗  -->
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
import btnPermission from './btnPermission'
import Pagination from '@/components/Pagination'
import PlkTable from '@/components/Table'
import PlkForm from '@/components/Form'
import FormFunction from '@/components/Form/FormFunction'
import { validNumber } from '@/utils/formRules'
import {
  getErrorList,
  postError,
  putError,
  deleteError
} from '@/api/formula/error'

const OPTIONS = {
  quantityLowLimit: {
    label: '产量下限',
    append: 'kg',
    rules: [
      { required: true, message: '请输入产量下限', trigger: 'blur' },
      { message: '请输入实数', trigger: 'blur', validator: validNumber }
    ]
  },
  quantityUpLimit: {
    label: '产量上限',
    append: 'kg',
    rules: [
      { required: true, message: '请输入产量上限', trigger: 'blur' },
      { message: '请输入实数', trigger: 'blur', validator: validNumber }
    ]
  },
  errorValue: {
    label: '误差',
    rules: [
      { required: true, message: '请输入误差', trigger: 'blur' },
      { message: '请输入实数', trigger: 'blur', validator: validNumber }
    ]
  }
}

export default {
  name: 'Index',

  components: {
    Pagination,
    PlkTable,
    PlkForm
  },

  mixins: [FormFunction],

  data() {
    return {
      quantityUpLimit: '',
      quantityLowLimit: '',
      currentPage: 1, // 当前页
      size: 30, // 每页显示多少条
      total: 0, // 总数
      errorList: [],
      tableHeader: [
        { label: '误差标识', prop: 'errorId' },
        { label: '误差值(kg)', prop: 'errorValue' },
        { label: '产量下限(kg)', prop: 'quantityLowLimit' },
        { label: '产量上限(kg)', prop: 'quantityUpLimit' },
        { label: '修改人标识', prop: 'updatedId' },
        { label: '修改时间', prop: 'updatedTime' },
        { label: '操作', type: 'btn', fixed: 'right', width: '160px' }
      ]
    }
  },

  computed: {
    btnPermission() {
      return btnPermission
    }
  },

  mounted() {
    this.handleGetErrorList()
  },

  methods: {

    /**
     * 获取误差列表
     */
    handleGetErrorList() {
      const data = {
        current: this.currentPage,
        size: this.size,
        quantityUpLimit: this.quantityUpLimit,
        quantityLowLimit: this.quantityLowLimit
      }
      getErrorList(data).then(res => {
        if (res.code === '200') {
          this.errorList = res.data.list
          this.total = Number(res.data.total)
        }
      })
    },

    /**
     * 搜索
     */
    handleSearch() {
      this.current = 1
      this.handleGetErrorList()
    },

    /**
     * 添加
     */
    handleAdd() {
      this.formDialog = {
        show: true,
        title: '添加误差',
        optionValue: {
          quantityLowLimit: '',
          quantityUpLimit: '',
          errorValue: ''
        },
        options: OPTIONS,
        submit: this.handlePost
      }
    },

    /**
     * 添加提交
     * @param value
     */
    handlePost(value) {
      postError(value).then(res => {
        if (res.code === '200') {
          this.formDialog.show = false
          this.$message.success(res.message)
          this.handleGetErrorList()
        }
      })
    },

    /**
     * 修改
     * @param clo
     */
    handleEdit(clo) {
      const errorItem = clo.scope.row
      this.formDialog = {
        show: true,
        title: `修改误差：${errorItem.errorValue}`,
        optionValue: {
          errorId: errorItem.errorId,
          quantityLowLimit: errorItem.quantityLowLimit,
          quantityUpLimit: errorItem.quantityUpLimit,
          errorValue: errorItem.errorValue
        },
        options: OPTIONS,
        submit: this.handlePut
      }
    },

    /**
     * 提交编辑
     * @param value
     */
    handlePut(value) {
      putError(value, value.errorId).then(res => {
        if (res.code === '200') {
          this.$message.success(res.message)
          this.formDialog.show = false
          this.handleGetErrorList()
        }
      })
    },

    /**
     * 删除
     * @param clo
     */
    handleDelete(clo) {
      const errorItem = clo.scope.row
      this.$confirm(`确定删除${errorItem.errorValue}吗？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteError(errorItem.errorId).then(res => {
          this.$message.success(res.message)
          this.handleGetErrorList()
        })
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
