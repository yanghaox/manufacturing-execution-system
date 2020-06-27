<template>
  <div class="app-container">
    <div class="warpper">
      <div class="header-btn">
        <el-input
          v-model="typeName"
          size="small"
          class="search-role"
          placeholder="请输入类型名称"
          @keyup.enter.native="handleGetTypeList"
        />
        <el-select v-model="type" size="small" clearable class="search-role" placeholder="请选择类型">
          <el-option label="设备" value="device" />
          <el-option label="设备组" value="deviceGroup" />
        </el-select>
        <el-button
          type="primary"
          size="mini"
          @click="handleSearch"
        >
          搜索
        </el-button>
        <el-button
          v-permission-key="btnPermission.addType"
          type="primary"
          size="small"
          @click="handleAddType"
        >
          新增
        </el-button>
      </div>

      <div class="type-list">
        <plk-table
          :table-selection="false"
          :table-header="tableHeader"
          :table-data="typeList"
          col-align="center"
          table-height="calc(100vh - 266px)"
        >
          <template v-slot:btnSlot="clo">
            <el-button
              v-permission-key="btnPermission.editType"
              type="primary"
              size="mini"
              @click="handleDetail(clo.scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-permission-key="btnPermission.deleteType"
              type="danger"
              size="mini"
              @click="handleDelete(clo.scope.row)"
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
        @pagination="handleGetTypeList"
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
import plkTable from '@/components/Table'
import Pagination from '@/components/Pagination'
import plkForm from '@/components/Form'
import PLKFormFunction from '@/components/Form/FormFunction'
import {
  getType,
  postType,
  putType,
  deleteType
} from '@/api/device/type'
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
      typeName: '',
      type: '',
      currentPage: 1, // 当前页
      size: 30, // 每页显示多少条
      total: 1, // 总数
      typeList: [],
      tableHeader: [
        { label: '类型名称', prop: 'typeName' },
        { label: '类型', prop: '_type' },
        { label: '操作', type: 'btn', fixed: 'right', minWidth: '60px' }
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
    // 获取类型列表
    handleGetTypeList() {
      const data = {
        typeName: this.typeName,
        type: this.type,
        current: this.currentPage,
        size: this.size
      }
      getType(data).then(res => {
        if (res.code === '200') {
          this.typeList = res.data.list.map(item => ({
            ...item,
            _type: item.type === 'device' ? '设备' : '设备组'
          }))
          this.total = Number(res.data.total)
        }
      })
    },

    // 搜索
    handleSearch() {
      this.currentPage = 1
      this.handleGetTypeList()
    },

    // 添加类型
    handleAddType() {
      this.formDialog = {
        show: true,
        title: '新增类型',
        optionValue: {
          typeName: '',
          type: ''
        },
        options: {
          typeName: {
            label: '类型名称',
            rules: [
              { required: true, message: '请输入类型名称', trigger: 'blur' }
            ]
          },
          type: {
            label: '类型',
            type: 'select',
            selectItems: [
              { label: '设备', value: 'device' },
              { label: '设备组', value: 'deviceGroup' }
            ],
            rules: [
              { required: true, message: '请选择类型', trigger: 'blur' }
            ]
          }
        },
        submit: this.handlePostType
      }
    },

    // 提交类型数据
    handlePostType(value) {
      postType(value).then(res => {
        if (res.code === '200') {
          this.formDialog.show = false
          this.$message.success(res.message)
          this.handleGetTypeList()
        }
      })
    },

    // 编辑
    handleDetail(item) {
      this.formDialog = {
        show: true,
        title: `修改类型：${item.typeName}`,
        optionValue: {
          typeName: item.typeName,
          type: item.type,
          typeId: item.typeId
        },
        options: {
          typeName: {
            label: '类型名称',
            rules: [
              { required: true, message: '请输入属性名', trigger: 'blur' }
            ]
          },
          type: {
            label: '类型',
            type: 'select',
            selectItems: [
              { label: '设备', value: 'device' },
              { label: '设备组', value: 'deviceGroup' }
            ],
            rules: [
              { required: true, message: '请选择类型', trigger: 'blur' }
            ]
          }
        },
        submit: this.handlePutType
      }
    },

    // 提交修改
    handlePutType(value) {
      putType(value, value.typeId).then(res => {
        if (res.code === '200') {
          this.formDialog.show = false
          this.$message.success(res.message)
          this.handleGetTypeList()
        }
      })
    },

    // 删除
    handleDelete(item) {
      this.$confirm(`确定删除${item.typeName}吗？`, '警告', {
        confirmButtonClass: '确定',
        cancelButtonClass: '取消',
        type: 'warning'
      }).then(() => {
        deleteType(item.typeId).then(res => {
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

.header-btn {
  display: flex;
  padding-bottom: 16px;

  .search-role {
    width: 160px;
    margin-right: 10px;
  }
}
</style>
