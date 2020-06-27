<template>
  <div class="app-container">
    <div class="warpper">
      <div class="header-btn">
        <el-input
          v-model="attributeName"
          size="small"
          class="search-role"
          placeholder="请输入属性名"
          @keyup.enter.native="handleGetAttributes"
        />
        <el-input
          v-model="attributeUnit"
          size="small"
          class="search-role"
          placeholder="请输入单位"
          @keyup.enter.native="handleGetAttributes"
        />
        <el-button
          type="primary"
          size="mini"
          @click="handleSearch"
        >
          搜索
        </el-button>
        <el-button
          v-permission-key="btnPermission.addAttribute"
          type="primary"
          size="small"
          @click="handleAddAttributes"
        >
          新增
        </el-button>
      </div>
      <div class="attributes-list">
        <plk-table
          :table-selection="false"
          :table-header="tableHeader"
          :table-data="attributes"
          col-align="center"
          table-height="calc(100vh - 266px)"
        >
          <template v-slot:btnSlot="clo">
            <el-button
              v-permission-key="btnPermission.editAttribute"
              type="primary"
              size="mini"
              @click="handleDetail(clo.scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-permission-key="btnPermission.deleteAttribute"
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
        @pagination="handleGetAttributes"
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
        <plk-form ref="zrf" :options="formDialog.options" :option-value="formDialog.optionValue"></plk-form>

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
  getAttributesList,
  postAttributes,
  putAttributes,
  deleteAttributes
} from '@/api/device/attribute'
import btnPermission from './btnPermission'

const FORMOPTIONS = {
  attributeName: {
    label: '属性名',
    rules: [
      { required: true, message: '请输入属性名', trigger: 'blur' }
    ]
  },
  unit: {
    label: '单位',
    rules: [
      { required: true, message: '请输入单位', trigger: 'blur' }
    ]
  }
}

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
      attributeName: '',
      attributeUnit: '',
      currentPage: 1, // 当前页
      size: 30, // 每页显示多少条
      total: 1, // 总数
      attributes: [],
      tableHeader: [
        { label: '属性编号', prop: 'attributeId' },
        { label: '属性名', prop: 'attributeName' },
        { label: '单位', prop: 'unit' },
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
    this.handleGetAttributes()
  },

  methods: {
    // 获取属性
    handleGetAttributes() {
      const data = {
        attributeName: this.attributeName,
        unit: this.attributeUnit,
        current: this.currentPage,
        size: this.size
      }
      getAttributesList(data).then(res => {
        if (res.code === '200') {
          this.attributes = res.data.list
          this.total = Number(res.data.total)
        }
      })
    },

    // 搜索
    handleSearch() {
      this.currentPage = 1
      this.handleGetAttributes()
    },

    // 添加弹窗
    handleAddAttributes() {
      this.formDialog = {
        show: true,
        title: '新增属性',
        optionValue: {
          attributeName: '',
          unit: ''
        },
        options: FORMOPTIONS,
        submit: this.handlePostAttributes
      }
    },

    // 提交属性
    handlePostAttributes(val) {
      postAttributes(val).then(res => {
        if (res.code === '200') {
          this.formDialog.show = false
          this.$message.success(res.message)
          this.handleGetAttributes()
        }
      })
    },

    // 修改回显
    handleDetail({ attributeId, attributeName, unit }) {
      this.formDialog = {
        show: true,
        title: `修改属性：${attributeName}`,
        optionValue: {
          attributeId,
          attributeName,
          unit
        },
        options: FORMOPTIONS,
        submit: this.handlePutAttributes
      }
    },

    // 提交修改
    handlePutAttributes(value) {
      putAttributes(value, value.attributeId).then(res => {
        if (res.code === '200') {
          this.formDialog.show = false
          this.$message.success(res.message)
          this.handleGetAttributes()
        }
      })
    },

    // 删除
    handleDelete(item) {
      this.$confirm(`确定删除${item.attributeName}吗？`, '警告', {
        confirmButtonClass: '确定',
        cancelButtonClass: '取消',
        type: 'warning'
      }).then(() => {
        deleteAttributes(item.attributeId).then(res => {
          if (res.code === '200') {
            this.$message.success(res.message)
            this.handleGetAttributes()
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
