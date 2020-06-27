<template>
  <div class="app-container">
    <div class="warpper">
      <div class="header-btn">
        <el-input
          v-model="functionCode"
          size="small"
          class="search-role"
          placeholder="请输入功能编号"
          @keyup.enter.native="handleGetFunction"
        />
        <el-input
          v-model="functionName"
          size="small"
          class="search-role"
          placeholder="请输入功能名"
          @keyup.enter.native="handleGetFunction"
        />
        <el-button
          type="primary"
          size="mini"
          @click="handleSearch"
        >
          搜索
        </el-button>
        <el-button
          v-permission-key="btnPermission.addFunction"
          type="primary"
          size="small"
          @click="handleAddFunction"
        >
          新增
        </el-button>
      </div>

      <div class="function-list">
        <plk-table
          :table-selection="false"
          :table-header="tableHeader"
          :table-data="renderFunction"
          col-align="center"
          table-height="calc(100vh - 266px)"
        >
          <template v-slot:btnSlot="clo">
            <el-button
              v-permission-key="btnPermission.editFunction"
              type="primary"
              size="mini"
              @click="handleDetail(clo.scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-permission-key="btnPermission.deleteFunction"
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
        :total="total"
        :page.sync="currentPage"
        :limit.sync="size"
        @pagination="handleGetFunction"
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
        <plk-form ref="zrf" :options="formDialog.options" :option-value="formDialog.optionValue">
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
          <el-button size="small" @click="$refs.zrf.handleCheckData() && handleAddData($refs.zrf.getOptions())">添加参数
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
  getFunctionList,
  getMethodList,
  postFunction,
  getFunctionDetail,
  putFunction,
  deleteFunction
} from '@/api/device/function'

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
      functionCode: '',
      functionName: '',
      currentPage: 1, // 当前页
      size: 30, // 每页显示多少条
      total: 1, // 总数
      formOptions: {},
      tableHeader: [
        { label: '功能编号', prop: 'functionCode' },
        { label: '功能ID', prop: 'functionId' },
        { label: '功能名称', prop: 'functionName' },
        { label: '方式编号', prop: 'methodId' },
        { label: '参数', prop: 'functionParameter' },
        { label: '说明', prop: 'description' },
        { label: '创建时间', prop: 'createdTime' },
        { label: '创建人', prop: 'createdBy' },
        { label: '更新时间', prop: 'updatedTime' },
        { label: '更新人', prop: 'updatedBy' },
        { label: '备注', prop: 'remark' },
        { label: '操作', type: 'btn', fixed: 'right', minWidth: '160px' }
      ],
      functions: [],
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
    renderFunction() {
      return this.functions.map(v => {
        const data = v.functionParameterList.map(item => {
          return item.parameterName
        })
        return {
          ...v,
          functionParameter: Array.from(data, v => v).join('、')
        }
      })
    },

    btnPermission() {
      return btnPermission
    }
  },

  async mounted() {
    this.handleGetFunction()
    const selectItem = await this.handleGetMethod()
    this.formOptions = {
      functionCode: {
        label: '功能编号',
        type: 'number',
        rules: [
          { required: true, message: '请输入功能ID', trigger: 'blur' },
          { message: '请输入实数', trigger: 'blur', validator: validNumber }
        ]
      },
      functionName: {
        label: '功能名称'
      },
      method: {
        label: '方式',
        type: 'selectObj',
        selectItems: selectItem
      },
      description: {
        label: '说明'
      },
      remark: {
        label: '备注'
      }
    }
  },

  methods: {
    // 获取功能列表
    handleGetFunction() {
      const data = {
        functionCode: this.functionCode,
        functionName: this.functionName,
        current: this.currentPage,
        size: this.size
      }
      getFunctionList(data).then(res => {
        if (res.code === '200') {
          this.functions = res.data.list
          this.total = Number(res.data.total)
        }
      })
    },

    // 搜索
    handleSearch() {
      this.currentPage = 1
      this.handleGetFunction()
    },

    // 添加功能弹窗
    async handleAddFunction() {
      this.formDialog = {
        show: true,
        title: '新增功能',
        optionValue: {
          functionCode: '',
          functionName: '',
          method: '',
          description: '',
          remark: ''
        },
        options: this.formOptions,
        submit: this.handlePostFunction
      }
    },

    // 获取方式
    async handleGetMethod() {
      const data = await getMethodList()
      return data.data.map(item => {
        return {
          ...item,
          label: item.methodName,
          value: item.methodId
        }
      })
    },

    // 添加参数
    handleAddData(options) {
      const newCount = this.cacheData.getNewCount()
      options.options[`$key_${newCount}`] = {
        label: '参数名',
        rules: [
          { required: true, message: '请输入参数名', trigger: 'blur' }
        ],
        xs: 21, sm: 12, md: 12, lg: 12, xl: 12
      }
      options.options[`$val_${newCount}`] = {
        label: '单位',
        rules: [
          { required: true, message: '请输入单位', trigger: 'blur' }
        ],
        xs: 21, sm: 12, md: 12, lg: 12, xl: 12
      }
      options.options[`$type_${newCount}`] = {
        label: '类型',
        type: 'select',
        selectItems: [
          { label: '浮点数', value: 'float' },
          { label: '整数', value: 'int' }
        ],
        rules: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        xs: 21, sm: 12, md: 12, lg: 12, xl: 12
      }

      options.options[`$del_${newCount}`] = { type: 'slot', xs: 21, sm: 12, md: 12, lg: 12, xl: 12 }

      options.optionValue[`$key_${newCount}`] = ''
      options.optionValue[`$val_${newCount}`] = ''
      options.optionValue[`$type_${newCount}`] = ''
      this.cacheData.add(newCount)

      this.formDialog.options = { ...options.options }
      this.formDialog.optionValue = { ...options.optionValue }
    },

    // 删除参数
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
    },

    methodDataItems2methodData(methodDataItems) {
      console.log(methodDataItems)
      const result = []
      this.cacheData.get().forEach(v => {
        const key = methodDataItems[`$key_${v}`]
        const val = methodDataItems[`$val_${v}`]
        if (key && val) {
          result.push({
            parameterName: methodDataItems[`$key_${v}`],
            unit: methodDataItems[`$val_${v}`],
            type: methodDataItems[`$type_${v}`]
          })
        }
      })
      return result
    },

    // 提交功能
    async handlePostFunction({ functionCode, functionName, method, description, remark, ...parameterItems }) {
      console.log(this.methodDataItems2methodData(parameterItems))
      const data = {
        functionCode,
        functionName,
        description,
        remark,
        methodId: method.methodId,
        methodName: method.methodName,
        functionParameterList: this.methodDataItems2methodData(parameterItems)
      }
      postFunction(data).then(res => {
        if (res.code === '200') {
          this.$message.success(res.message)
          this.formDialog.show = false
          this.handleGetFunction()
        }
      })
    },

    // 详情
    async handleDetail(item) {
      getFunctionDetail(item.functionId).then(res => {
        if (res.code === '200') {
          const formDialog = {
            title: `修改功能：${res.data.functionName}`,
            show: true,
            optionValue: {
              ...res.data,
              method: { label: res.data.methodName, value: res.data.methodId } // methodName
            },
            options: this.formOptions,
            submit: this.handlePutFunction
          }
          res.data.functionParameterList.map((value, index) => {
            formDialog.options[`$key_${index}`] = {
              label: '参数名',
              rules: [
                { required: true, message: '请输入参数名', trigger: 'blur' }
              ],
              xs: 12, sm: 12, md: 12, lg: 12, xl: 12
            }
            formDialog.optionValue[`$key_${index}`] = value.parameterName

            formDialog.options[`$val_${index}`] = {
              label: '单位',
              rules: [
                { required: true, message: '请输入单位', trigger: 'blur' }
              ],
              xs: 12, sm: 12, md: 12, lg: 12, xl: 12
            }
            formDialog.optionValue[`$val_${index}`] = value.unit

            formDialog.options[`$type_${index}`] = {
              label: '类型',
              type: 'select',
              rules: [
                { required: true, message: '请选择类型', trigger: 'change' }
              ],
              selectItems: [
                { label: '浮点数', value: 'float' },
                { label: '整数', value: 'int' }
              ],
              xs: 12, sm: 12, md: 12, lg: 12, xl: 12
            }
            formDialog.optionValue[`$type_${index}`] = value.type

            formDialog.options[`$del_${index}`] = { type: 'slot', xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }

            this.cacheData.add(index)
          })
          this.formDialog = formDialog
        }
      })
    },

    // 提交修改
    handlePutFunction({ functionId, functionCode, functionName, method, description, remark, ...parameterItems }) {
      console.log(method)
      const data = {
        functionId,
        functionCode,
        functionName,
        description,
        remark,
        methodId: method.value,
        methodName: method.label,
        functionParameterList: this.methodDataItems2methodData(parameterItems)
      }
      console.log(data)
      putFunction(data, data.functionId).then(res => {
        if (res.code === '200') {
          this.$message.success(res.message)
          this.formDialog.show = false
          this.handleGetFunction()
        }
      })
    },

    // 删除
    handleDelete(item) {
      this.$confirm(`确定删除${item.functionName}吗？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteFunction(item.functionId).then(res => {
          if (res.code === '200') {
            this.$message.success(res.message)
            this.handleGetFunction()
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
