<template>
  <div class="material-container">
    <div class="warpper">
      <div class="container-header">
        <el-input
          v-model="materialCode"
          size="small"
          class="search"
          placeholder="请输入成品代码"
          @keyup.enter.native="handleSearch"
        />
        <el-input
          v-model="searchCasNo"
          size="small"
          class="search"
          placeholder="请输入国际代码"
          @keyup.enter.native="handleSearch"
        />
        <el-input
          v-model="searchMaterialName"
          size="small"
          class="search"
          placeholder="请输入成品名称"
          @keyup.enter.native="handleSearch"
        />
        <el-button type="primary" size="small" @click="handleSearch">搜索</el-button>
        <el-button v-permission-key="btnPermission.addProduct" type="primary" size="small" @click="handleAddProduct">
          新增
        </el-button>
        <el-button
          v-permission-key="btnPermission.batchDeleteProduct"
          type="danger"
          size="small"
          @click="handleDeteleBatch"
        >
          批量删除
        </el-button>
      </div>
      <div class="material-table">
        <plk-table
          row-key="materialId"
          :table-header="tableHeader"
          :table-data="wipData"
          table-height="calc(100vh - 266px)"
          @selectionChange="handleSelctetion"
        >
          <template v-slot:btnSlot="clo">
            <el-button
              v-permission-key="btnPermission.editProduct"
              type="primary"
              size="mini"
              @click="handleGetAnnexList(clo)"
            >
              附件
            </el-button>
            <el-button
              v-permission-key="btnPermission.editProduct"
              type="primary"
              size="mini"
              @click="handleGetProductDetail(clo)"
            >
              编辑
            </el-button>
            <el-button
              v-permission-key="btnPermission.deleteProduct"
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
        @pagination="handleGetProductList"
      />

      <el-dialog
        v-if="dialogVisible"
        v-el-drag-dialog
        modal
        lock-scroll
        :title="formDialog.title"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible"
        width="40%"
      >
        <plk-form
          ref="zrf"
          :options="formDialog.options"
          :option-value="formDialog.optionValue"
          :cp-file-list="cpFileList"
        />

        <div style="text-align: right">
          <el-button size="small" @click="dialogVisible=false">取消</el-button>
          <el-button
            size="small"
            type="primary"
            @click="$refs.zrf.handleCheckData() && formDialog.submit($refs.zrf.handleGetFormData())"
          >
            确定
          </el-button>
        </div>
      </el-dialog>

      <!--   附件列表   -->
      <el-dialog
        v-if="fileDialog"
        v-el-drag-dialog
        modal
        lock-scroll
        title="附件列表"
        :close-on-click-modal="false"
        :visible.sync="fileDialog"
        width="500px"
      >
        <div v-if="fileList.length" class="file-list">
          <div v-for="file in fileList" :key="file.name" class="file">
            <span class="file-name">{{ file.name }}</span>
            <el-button
              type="primary"
              size="mini"
              @click="handleDownloadAnnex(file)"
            >
              下载
            </el-button>
          </div>
        </div>
        <div v-else class="no-data">暂无数据</div>
        <div style="text-align: right">
          <el-button size="small" type="primary" @click="fileDialog=false">
            关闭
          </el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination'
import PlkTable from '@/components/Table'
import PlkForm from '@/components/Form'
import FormFunction from '@/components/Form/FormFunction'
import { downloadFile } from '@/utils'
import { downLoad } from '@/api/common/file'
import {
  getProductList,
  postProduct,
  getProductDetail,
  putProduct,
  deleteProduct,
  batchDeletionProduct
} from '@/api/formula/product'
import btnPermission from './btnPermission'

const FORMOPTIONS = {
  materialName: {
    label: '成品名称',
    rules: [
      { required: true, message: '请输入成品名称', trigger: 'blur' }
    ]
  },
  materialCode: {
    label: '成品代码',
    rules: [
      { required: true, message: '请输入成品代码', trigger: 'blur' }
    ]
  },
  casNo: {
    label: '国际编号',
    rules: [
      { required: true, message: '请输入国际编号', trigger: 'blur' }
    ]
  },
  unit: {
    label: '单位',
    rules: [
      { required: true, message: '请输入单位', trigger: 'blur' }
    ]
  },
  fileList: {
    label: '附件',
    type: 'file',
    headers: {
      authorization: getToken()
    }
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
      materialCode: '',
      searchCasNo: '',
      searchMaterialName: '',
      tableHeader: [
        { label: '成品名称', prop: 'materialName' },
        { label: '成品代码', prop: 'materialCode' },
        { label: '国际代码', prop: 'casNo' },
        { label: '单位', prop: 'unit' },
        { label: '创建人', prop: 'createdBy' },
        { label: '时间', prop: 'createdTime' },
        { label: '操作', type: 'btn', fixed: 'right', width: '230px' }
      ],
      wipData: [],
      currentPage: 1, // 当前页
      size: 30, // 每页显示多少条
      total: 0, // 总数
      dialogVisible: false,
      fileDialog: false,
      fileList: [], // 附件按钮 附件列表
      selectDataList: [], // 勾选列表
      cpFileList: [] // 编辑时文件列表
    }
  },

  computed: {
    btnPermission() {
      return btnPermission
    }
  },

  mounted() {
    this.handleGetProductList()
  },

  methods: {
    // 获取成品信息列表
    handleGetProductList() {
      const data = {
        materialCode: this.materialCode,
        casNo: this.searchCasNo,
        current: this.currentPage,
        materialName: this.searchMaterialName,
        size: this.size
      }
      getProductList(data).then(res => {
        if (res.code === '200') {
          this.wipData = res.data.list
          this.total = Number(res.data.total)
        }
      })
    },

    // 搜索
    handleSearch() {
      this.current = 1
      this.handleGetProductList()
    },

    // 添加成品信息弹窗
    handleAddProduct() {
      this.dialogVisible = true
      this.cpFileList = []
      this.formDialog = {
        title: '新增产品信息',
        optionValue: {
          casNo: '',
          materialCode: '',
          materialName: '',
          unit: '',
          fileList: []
        },
        options: FORMOPTIONS,
        submit: this.handleSubmitProduct
      }
    },

    // 提交成品信息
    handleSubmitProduct(value) {
      const fileList = cloneDeep(value.fileList)
      const arr = []
      fileList.map(item => {
        try {
          arr.push({
            fileName: item.name,
            path: item.response.data.path
          })
        } catch (e) {
          console.log(e)
        }
      })
      value.fileList = arr
      postProduct(value)
        .then(res => {
          if (res.code === '200') {
            this.$message.success(res.message)
            this.dialogVisible = false
            this.handleGetProductList()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 附件
    handleGetAnnexList(item) {
      getProductDetail(item.scope.row.materialId).then(res => {
        if (res.code === '200') {
          this.fileDialog = true
          this.fileList = res.data.fileList.map(file => {
            return { name: file.fileName, url: file.path, fileId: file.fileId }
          })
        }
      })
    },

    // 下载附件
    handleDownloadAnnex(item) {
      downLoad(item.fileId).then(res => {
        const fileName = res.headers['content-disposition'].split(';')[1].split('=')[1]
        downloadFile(res.data, fileName)
      })
    },

    // 获取成品信息详情
    handleGetProductDetail(item) {
      getProductDetail(item.scope.row.materialId).then(res => {
        if (res.code === '200') {
          this.dialogVisible = true
          this.cpFileList = res.data.fileList.map(item => {
            return { name: item.fileName, url: item.path }
          })
          const { materialId, casNo, materialCode, materialName, unit } = res.data
          this.formDialog = {
            title: '修改产品信息',
            optionValue: {
              materialId,
              casNo,
              materialCode,
              materialName,
              unit,
              fileList: []
            },
            options: FORMOPTIONS,
            submit: this.handlePutProduct
          }
        }
      })
    },

    // 提交修改
    handlePutProduct(value) {
      const fileList = cloneDeep(value.fileList)
      const arr = []
      fileList.map(item => {
        try {
          arr.push({
            fileName: item.name,
            path: item.response ? item.response.data.path : item.url
          })
        } catch (e) {
          console.log(e)
        }
      })
      value.fileList = arr

      putProduct(value, value.materialId)
        .then(res => {
          if (res.code === '200') {
            this.dialogVisible = false
            this.handleGetProductList()
            this.$message.success(res.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 删除
    handleDelete(item) {
      this.$confirm(`确定删除${item.scope.row.materialCode}吗？`, '警告', {
        cancelButtonClass: '取消',
        confirmButtonClass: '确定',
        type: 'warning'
      })
        .then(() => {
          deleteProduct(item.scope.row.materialId)
            .then(res => {
              if (res.code === '200') {
                this.$message.success(res.message)
                this.handleGetProductList()
              }
            })
        })
    },

    // 获取勾选
    handleSelctetion(val) {
      this.selectDataList = val.map(item => (item.materialId))
    },

    // 批量删除
    handleDeteleBatch() {
      if (!this.selectDataList.length) return
      this.$confirm('确定删除吗？', '警告', {
        cancelButtonClass: '取消',
        confirmButtonClass: '确定',
        type: 'warning'
      })
        .then(() => {
          batchDeletionProduct(this.selectDataList)
            .then(res => {
              if (res.code === '200') {
                this.$message.success(res.message)
                this.handleGetProductList()
              }
            })
            .catch(err => {
              console.log(err)
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

.file-list {
  .file {
    margin-bottom: 22px;
  }

  .file-name {
    display: inline-block;
    width: 86.8%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.no-data {
  text-align: center;
}
</style>
