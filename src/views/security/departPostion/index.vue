<template>
  <div class="depart-postion">
    <!-- <toolbar /> -->
    <!-- <SearchFilter /> -->
    <div class="card-warpper">
      <el-card class="depart-list" shadow="never">
        <div slot="header">
          <span>部门列表</span>
        </div>
        <department-tree :tree-list="departList" :btn-permission="btnPermission" more-features draggable @refresh-tree="refreshTree" @handle-tree-click="getDepartPostionList" />
      </el-card>
      <el-card v-if="departmentId !== ''" class="postion-list" shadow="never">
        <div slot="header">
          <span>岗位列表({{ departmentName }})</span>
          <div class="button-group">
            <el-button v-permission-key="btnPermission.addDepartPostions" type="primary" size="small" :disabled="departmentId === ''" @click="addPostions">添加</el-button>
            <el-button v-permission-key="btnPermission.deleteDepartPostions" type="danger" size="small" :disabled="departmentId === ''" @click="deletePostions">删除</el-button>
          </div>
        </div>
        <my-table
          :table-data="postionList"
          hidden
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" align="center" width="50" />
          <el-table-column prop="postionName" align="center" label="岗位" />
        </my-table>
      </el-card>
    </div>

    <!-- 岗位表单 -->
    <el-dialog v-if="formDialog.show" :title="formDialog.title" :visible.sync="formDialog.show" width="30%" :close-on-click-modal="false">
      <plk-form ref="postionForm" :option-value="formDialog.optionValue" :options="formDialog.options" label-width="80px" />
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleFormClose">取 消</el-button>
        <el-button type="primary" size="small" @click="handleFormCommit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import btnPermission from './btnPermission'
import DepartmentTree from '@/components/DepartmentTree'
import PlkForm from '@/components/Form'
import MyTable from '@/components/MyTable'
import Toolbar from '@/components/Toolbar'
import SearchFilter from '@/components/SearchFilter'
import PLKFormFunction from '@/components/Form/FormFunction'
import { generateTree } from '@/components/DepartmentTree/generateTree'
import { getDepartList, getDepartPostionList, getPostionsSelect, addDepartPostions, deleteDepartPostions } from '@/api/security/departPostion'
export default {
  name: 'DepartPostion',
  components: { DepartmentTree, MyTable, PlkForm, Toolbar, SearchFilter },
  mixins: [PLKFormFunction],
  data() {
    return {
      departmentId: '',
      postionList: [],
      departList: [],
      postionsSelect: [],
      selectionId: [],
      departmentName: '请选择部门'
    }
  },
  computed: {
    btnPermission() {
      return btnPermission
    },
    positionFormDialog() {
      return this.formDialog.show
    }
  },
  watch: {
    postionsSelect() {
      this.formDialog.options.postionIdList.selectItems = (this.postionsSelect || []).map(postion => {
        return {
          value: postion.postionId,
          label: postion.postionName
        }
      })
    },
    positionFormDialog(val) {
      if (val) {
        console.log('val', val)
        this.getPostionsSelect(this.departmentId)
      }
    }
  },
  activated() {
    this.init()
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.getDepartList()
      // this.getPostionsSelect()
      this.formDialog = {
        show: false,
        title: '',
        options: {
          postionIdList: { type: 'multiple', label: '部门岗位', selectItems: [],
            rules: [
              { type: 'array', required: true, message: '请至少选择一个部门岗位', trigger: 'change' }
            ]
          }
        },
        optionValue: {
          postionIdList: []
        },
        submit: Function
      }
    },

    // 获取部门列表
    getDepartList() {
      getDepartList().then(res => {
        this.departList = generateTree(res.data)
      })
    },

    // 获取所有岗位
    getPostionsSelect(departmentId) {
      getPostionsSelect(departmentId).then(res => {
        this.postionsSelect = res.data
      })
    },

    // 获取部门岗位列表
    getDepartPostionList(id, label) {
      this.departmentId = id
      getDepartPostionList(id).then(res => {
        this.postionList = res.data
        if (label) {
          this.departmentName = label
        }
      })
    },

    // 添加部门岗位
    addPostions() {
      this.formDialog.title = '添加部门岗位'
      this.formDialog.show = true
    },

    // 删除部门岗位
    deletePostions() {
      if (this.selectionId.length) {
        this.$confirm('是否删除该部门岗位', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return deleteDepartPostions(this.departmentId, this.selectionId)
        }).then(res => {
          this.getDepartPostionList(this.departmentId)
          this.$message.success(res.message)
        })
      }
    },

    // 岗位添加表单提交
    handleFormCommit() {
      if (!this.handleSubmitFormDialog()) return
      addDepartPostions(this.departmentId, this.formDialog.optionValue.postionIdList).then(res => {
        this.getDepartPostionList(this.departmentId)
        this.$message.success(res.message)
      })
      this.handleFormClose()
    },

    // 表单验证
    handleSubmitFormDialog() {
      return this.$refs.postionForm.handleCheckData()
    },

    // 岗位表单关闭
    handleFormClose() {
      this.formDialog.show = false
      this.formDialog.optionValue = {
        postionIdList: []
      }
    },

    // 处理表格选项
    handleSelectionChange(value) {
      this.selectionId = (value || []).map(item => {
        return item.postionId
      })
    },

    // 刷新部门树
    refreshTree() {
      this.init()
    }

  }
}
</script>
<style lang="scss" scoped>
.depart-postion {
  .card-warpper {
    height: calc(100vh - 122px);
    display: flex;
    .depart-list {
      width: 250px;
      min-width: 250px;
      margin-right: 16px;
    }
    .postion-list {
      flex: 1;
    }

    .el-card {
      height: 100%;
      .button-group {
        float: right;
      }
      /deep/ .el-card__body {
        height: calc(100% - 55px);
        overflow-y: auto;
      }
    }
  }
}
</style>
