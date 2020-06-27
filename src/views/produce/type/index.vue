<template>
  <div class="material-container">
    <div class="warpper">
      <div class="container-header">
        <el-input
          v-model="typeName"
          size="small"
          class="search"
          placeholder="请输入类型名"
          @keyup.enter.native="handleSearch"
        />
        <!--        <el-select v-model="type" size="small" clearable placeholder="请选择类型">-->
        <!--          <el-option label="设备单元" value="device" />-->
        <!--          <el-option label="设备组" value="deviceGroup" />-->
        <!--        </el-select>-->

        <el-button type="primary" size="small" @click="handleSearch">搜索</el-button>
        <el-button v-permission-key="btnPermission.addType" type="primary" size="small" @click="handleAdd">
          新增
        </el-button>
      </div>
      <div class="type-table">
        <plk-table
          :table-selection="false"
          :table-data="typeList"
          :table-header="tableHeader"
          table-height="calc(100vh - 266px)"
        >
          <template v-slot:btnSlot="clo">
            <el-button v-permission-key="btnPermission.editType" type="primary" size="mini" @click="handleEdit(clo)">编辑</el-button>
            <el-button v-permission-key="btnPermission.deleteType" type="danger" size="mini" @click="handleDelete(clo)">删除</el-button>
          </template>
        </plk-table>
      </div>
      <!--  分页  -->
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="currentPage"
        :limit.sync="size"
        @pagination="handleGetTypeList"
      />
    </div>

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
import Pagination from '@/components/Pagination'
import PlkTable from '@/components/Table'
import PlkForm from '@/components/Form'
import FormFunction from '@/components/Form/FormFunction'
import { getType, postType, putType, deleteType } from '@/api/produce/type'

const FORMOPTIONS = {
  typeName: {
    label: '类型名',
    rules: [
      { required: true, message: '请输入类型名', trigger: 'blur' }
    ]
  }
}

export default {
  name: 'Index',

  components: {
    PlkTable,
    Pagination,
    PlkForm
  },

  mixins: [FormFunction],
  data() {
    return {
      typeName: '',
      typeList: [],
      currentPage: 1, // 当前页
      size: 30, // 每页显示多少条
      total: 0, // 总数
      tableHeader: [
        { label: '类型名', prop: 'typeName' },
        { label: '操作', type: 'btn', width: '150px' }
      ]
    }
  },

  computed: {
    btnPermission() {
      return btnPermission
    }
  },

  mounted() {
    this.handleGetTypeList()
  },

  methods: {
    /**
     * 获取类型列表
     */
    handleGetTypeList() {
      const data = {
        current: this.currentPage,
        size: this.size,
        typeName: this.typeName
      }
      getType(data).then(res => {
        if (res.code === '200') {
          this.typeList = res.data.list
          this.total = Number(res.data.total)
        }
      })
    },
    /**
     * 搜索
     */
    handleSearch() {
      this.current = 1
      this.handleGetTypeList()
    },

    /**
     * 添加类型
     */
    handleAdd() {
      this.formDialog = {
        show: true,
        title: '新增类型',
        optionValue: {
          typeName: ''
        },
        options: FORMOPTIONS,
        submit: this.handleSubmit
      }
    },

    /**
     * 提交类型
     * @param value
     */
    handleSubmit(value) {
      postType(value).then(res => {
        if (res.code === '200') {
          this.formDialog.show = false
          this.$message.success(res.message)
          this.handleGetTypeList()
        }
      })
    },

    /**
     * 修改类型
     */
    handleEdit(item) {
      console.log(item.scope.row)
      this.formDialog = {
        show: true,
        title: `修改类型：${item.scope.row.typeName}`,
        optionValue: { ...item.scope.row },
        options: FORMOPTIONS,
        submit: this.handlePut
      }
    },

    /**
     * 提交编辑
     * @param value
     */
    handlePut(value) {
      putType(value, value.typeId).then(res => {
        if (res.code === '200') {
          this.formDialog.show = false
          this.$message.success(res.message)
          this.handleGetTypeList()
        }
      })
    },

    handleDelete(item) {
      this.$confirm(`确定删除${item.scope.row.typeName}吗？`, '警告', {
        cancelButtonClass: '取消',
        confirmButtonClass: '确定',
        type: 'warning'
      }).then(() => {
        deleteType(item.scope.row.typeId).then(res => {
          if (res.code === '200') {
            this.$message.success(res.message)
            this.handleGetTypeList()
          }
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
