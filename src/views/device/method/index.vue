<template>
  <div class="app-container">
    <div class="warpper">
      <div class="header-btn">
        <el-input
          v-model="dataCode"
          size="small"
          class="search-role"
          placeholder="请输入方式编号"
          @keyup.enter.native="handleGetMethods"
        />
        <el-input
          v-model="methodName"
          size="small"
          class="search-role"
          placeholder="请输入方式名称"
          @keyup.enter.native="handleGetMethods"
        />
        <el-button
          type="primary"
          size="mini"
          @click="handleSearch"
        >
          搜索
        </el-button>
        <el-button
          v-permission-key="btnPermission.addMethod"
          type="primary"
          size="small"
          @click="handleAddAttributes"
        >
          新增
        </el-button>
      </div>

      <div class="methods-list">
        <plk-table
          :table-selection="false"
          :table-header="tableHeader"
          :table-data="renderMethod"
          col-align="center"
          table-height="calc(100vh - 266px)"
        >
          <template v-slot:btnSlot="clo">
            <el-button
              v-permission-key="btnPermission.editMethod"
              type="primary"
              size="mini"
              @click="handleDetail(clo.scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-permission-key="btnPermission.deleteMethod"
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
        @pagination="handleGetMethods"
      />

      <!--  添加方式弹窗  -->
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
        <plk-form ref="zrf" :options="formDialog.options" :option-value="formDialog.optionValue" class="form-component scrollbar">
          <template v-for="i in cacheData.get()" :slot="`$del_${i}`">
            <el-button
              :key="i"
              type="danger"
              size="small"
              style="margin-top: 4px"
              @click="handleDeleteData(`$del_${i}`)"
            >
              删除
            </el-button>
          </template>
        </plk-form>

        <div style="text-align: right">
          <el-button size="small" @click="handleCloseDialog">取消</el-button>
          <el-button size="small" @click="$refs.zrf.handleCheckData() && handleAddData($refs.zrf.getOptions())">添加数据
          </el-button>
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
import btnPermission from './btnPermission'
import plkTable from '@/components/Table'
import Pagination from '@/components/Pagination'
import plkForm from '@/components/Form'
import PLKFormFunction from '@/components/Form/FormFunction'
import { validNumber } from '@/utils/formRules'
import {
  getMethodList,
  postMethod,
  getMethodDetail,
  putMethod,
  deleteMethod
} from '@/api/device/method'

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
      dataCode: '',
      methodName: '',
      methodData: '',
      currentPage: 1, // 当前页
      size: 30, // 每页显示多少条
      total: 1, // 总数
      methods: [],
      tableHeader: [
        { label: '方式编号', prop: 'methodId' },
        { label: '方式名称', prop: 'methodName' },
        { label: '方式数据', prop: 'methodData' },
        { label: '操作', type: 'btn', fixed: 'right', minWidth: '60px' }
      ],
      cacheData: (() => {
        let data = new Set()
        return {
          get: () => Array.from(data),
          add: v => data.add(v),
          getNewCount: () => Array.from(data).slice(-1).length ? Array.from(data).slice(-1)[0] + 1 : 0,
          reset: () => !(data = new Set())
        }
      })()
    }
  },

  computed: {
    renderMethod() {
      return this.methods.map(v => {
        const data = v.methodDataList.map(item => {
          return item.description
        })
        return {
          ...v,
          methodData: Array.from(data, v => v).join('、')
        }
      })
    },

    btnPermission() {
      return btnPermission
    }
  },

  mounted() {
    this.handleGetMethods()
  },

  methods: {
    // 搜索
    handleSearch() {
      this.currentPage = 1
      this.handleGetMethods()
    },

    // 获取方式
    handleGetMethods() {
      const data = {
        dataCode: this.dataCode,
        methodName: this.methodName,
        current: this.currentPage,
        size: this.size
      }
      getMethodList(data).then(res => {
        if (res.code === '200') {
          this.methods = res.data.list
          this.total = Number(res.data.total)
        }
      })
    },

    // 添加
    handleAddAttributes() {
      this.formDialog = {
        title: '新增方式',
        show: true,
        optionValue: {
          methodName: ''
        },
        options: {
          methodName: {
            label: '方式名称',
            rules: [
              { required: true, message: '请输入方式名称', trigger: 'blur' }
            ]
          }
        },
        submit: this.handlePostMethod
      }
    },

    // 添加数据（方式）
    handleAddData(options) {
      const newCount = this.cacheData.getNewCount()
      options.options[`$key_${newCount}`] = {
        label: '代号',
        rules: [
          { required: true, message: '请输入代号', trigger: 'blur' },
          { validator: validNumber, message: '请输入实数', trigger: 'blur' }
        ],
        xs: 10, sm: 10, md: 10, lg: 10, xl: 10
      }
      options.options[`$val_${newCount}`] = {
        label: '说明',
        rules: [
          { required: true, message: '请输入说明', trigger: 'blur' }
        ],
        xs: 10, sm: 10, md: 10, lg: 10, xl: 10
      }

      options.options[`$del_${newCount}`] = { type: 'slot', xs: 2, sm: 2, md: 2, lg: 2, xl: 2 }

      options.optionValue[`$key_${newCount}`] = ''
      options.optionValue[`$val_${newCount}`] = ''
      this.cacheData.add(newCount)

      this.formDialog.options = { ...options.options }
      this.formDialog.optionValue = { ...options.optionValue }
    },

    // 删除数据
    handleDeleteData(key) {
      const option = this.$refs.zrf.getOptions()
      const nowCount = key.match(/^\$del_\d+/)[0].slice(5)
      Object.keys(option.options).forEach(key => {
        if (key.match(new RegExp(`_${nowCount}$`))) {
          delete option.options[key]
        }
      })
      Object.keys(option.optionValue).forEach(key => {
        if (key.match(new RegExp(`_${nowCount}$`))) {
          delete option.optionValue[key]
        }
      })
      this.formDialog.options = { ...option.options }
      this.formDialog.optionValue = { ...option.optionValue }
      console.log(this.formDialog)
    },

    methodDataItems2methodData(methodDataItems) {
      const result = []
      this.cacheData.get().forEach(v => {
        const key = methodDataItems[`$key_${v}`]
        const val = methodDataItems[`$val_${v}`]
        if (key && val) {
          result.push({
            dataCode: methodDataItems[`$key_${v}`],
            description: methodDataItems[`$val_${v}`]
          })
        }
      })
      return result
    },

    // 提交方式
    handlePostMethod({ dataCode, methodName, ...methodDataItems }) {
      const methodData = this.methodDataItems2methodData(methodDataItems)

      const data = {
        methodName,
        methodDataList: methodData
      }
      postMethod(data).then(res => {
        if (res.code === '200') {
          this.formDialog.show = false
          this.$message.success(res.message)
          this.handleGetMethods()
        }
      })
    },

    // 详情
    handleDetail(item) {
      getMethodDetail(item.methodId).then(res => {
        if (res.code === '200') {
          const formDialog = {
            title: `修改方式：${res.data.methodName}`,
            show: true,
            optionValue: {
              methodId: res.data.methodId,
              methodName: res.data.methodName
            },
            options: {
              methodName: {
                label: '方式名称',
                rules: [
                  { required: true, message: '请输入方式名称', trigger: 'blur' }
                ]
              }
            },
            submit: this.handlePutMethod
          }

          res.data.methodDataList.map((item, index) => {
            formDialog.options[`$key_${index}`] = {
              label: '代号',
              rules: [
                { required: true, message: '请输入代号', trigger: 'blur' },
                { validator: validNumber, message: '请输入实数', trigger: 'blur' }
              ],
              xs: 10, sm: 10, md: 10, lg: 10, xl: 10
            }
            formDialog.optionValue[`$key_${index}`] = item.dataCode

            formDialog.options[`$val_${index}`] = {
              label: '说明',
              rules: [
                { required: true, message: '请输入说明', trigger: 'blur' }
              ],
              xs: 10, sm: 10, md: 10, lg: 10, xl: 10
            }
            formDialog.optionValue[`$val_${index}`] = item.description

            formDialog.options[`$del_${index}`] = { type: 'slot', xs: 2, sm: 2, md: 2, lg: 2, xl: 2 }

            this.cacheData.add(index)
          })

          this.formDialog = formDialog
        }
      })
    },

    // 提交修改
    handlePutMethod({ methodId, dataCode, methodName, ...methodDataItems }) {
      const methodData = this.methodDataItems2methodData(methodDataItems)
      const data = {
        methodId,
        methodName,
        methodDataList: methodData
      }
      putMethod(data, data.methodId).then(res => {
        if (res.code === '200') {
          this.$message.success(res.message)
          this.formDialog.show = false
          this.handleGetMethods()
        }
      })
    },

    // 删除
    handleDelete(item) {
      this.$confirm(`确定删除${item.methodName}吗？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMethod(item.methodId).then(res => {
          if (res.code === '200') {
            this.$message.success(res.message)
            this.handleGetMethods()
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
.form-component {
  max-height: 50vh;
  margin-bottom: 22px;
  padding-right: 16px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
