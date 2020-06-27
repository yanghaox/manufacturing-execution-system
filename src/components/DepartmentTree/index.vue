<template>
  <div class="department-tree">
    <el-tree
      :data="treeList"
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
      :draggable="draggable"
      highlight-current
      @node-drop="handleDrop"
      @node-click="handleTreeClick"
    >
      <template v-slot="{ node, data }">
        <span class="custom-tree-node">
          <!--          <span class="tree-label" :title="node.data.description || ''">{{ node.label }}</span>-->
          <el-tooltip class="item" effect="dark" :content="node.data.label || ''" placement="right">
            <span class="tree-label">{{ node.label }}</span>
          </el-tooltip>
          <el-dropdown
            v-if="moreFeatures"
            trigger="click"
            placement="bottom-start"
            @command="handleCommand"
          >
            <el-button
              v-if="moreFeatures"
              type="text"
              @click="handleDropdownClick(data)"
            >
              <i class="el-icon-more" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-permission-key="btnPermission.addDepartment" command="addDepart">创建同级部门</el-dropdown-item>
              <el-dropdown-item v-permission-key="btnPermission.addDepartment" command="addSubDepart">创建子部门</el-dropdown-item>
              <el-dropdown-item v-permission-key="btnPermission.deleteDepartment" command="delDepart">删除部门</el-dropdown-item>
              <el-dropdown-item v-permission-key="btnPermission.editDepartment" command="updateDepart">编辑部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </template>
    </el-tree>
    <el-dialog
      v-if="moreFeatures || formDialog.show"
      title="部门"
      :visible.sync="formDialog.show"
      width="30%"
      :close-on-click-modal="false"
    >
      <plk-form ref="departForm" :option-value="formDialog.optionValue" :options="formDialog.options" label-width="80px" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleFormClose">取 消</el-button>
        <el-button type="primary" @click="handleFormCommit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const DEPART_FORM = {
  departmentName: '',
  description: '',
  parentDepartmentId: ''
}
const COMMIT_TYPE = {
  ADD: 'addDepart',
  ADD_SUB: 'addSubDepart',
  UPDATE: 'updateDepart',
  DELETE: 'delDepart'
}
const COMMIT_FUN = {
  // 添加同级部门
  addDepart: function() {
    this.commitType = COMMIT_TYPE.ADD
    this.formDialog.show = true
    this.formDialog.optionValue.parentDepartmentId = this.treeItem.parentDepartmentId
  },

  // 添加子部门
  addSubDepart: function() {
    this.commitType = COMMIT_TYPE.ADD_SUB
    this.formDialog.show = true
    this.formDialog.optionValue.parentDepartmentId = this.treeItem.id
  },

  // 删除部门
  delDepart: function() {
    this.$confirm('确认删除吗？', '警告', {
      cancelButtonClass: '取消',
      confirmButtonClass: '确定',
      type: 'warning'
    }).then(res => {
      const id = this.treeItem.id
      return deleteDepartment(id)
    }).then(res => {
      this.$emit('refresh-tree')
      this.$message.success(res.message)
    })
  },

  // 编辑部门
  updateDepart: function() {
    this.commitType = COMMIT_TYPE.UPDATE
    const departmentId = this.treeItem.id
    const departmentName = this.treeItem.label
    const { description, parentDepartmentId } = this.treeItem
    this.formDialog.show = true
    this.formDialog.optionValue = Object.assign({}, DEPART_FORM, { departmentName, description, parentDepartmentId, roleIdList: [] })
    this.getDepartRoles(departmentId)
  }
}
import PlkForm from '@/components/Form'
import PLKFormFunction from '@/components/Form/FormFunction.js'
import {
  addDepartment,
  editDepartment,
  deleteDepartment,
  movePostion,
  getRolesSelect,
  getDepartInfo
} from '@/api/security/departPostion'
export default {
  name: 'DepartmentTree',
  components: { PlkForm },
  mixins: [PLKFormFunction],
  props: {
    treeList: {
      type: Array,
      required: true
    },
    moreFeatures: {
      type: Boolean,
      default: false
    },
    draggable: {
      type: Boolean,
      default: false
    },
    btnPermission: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      treeItem: {},
      rolesSelect: [],
      commitType: ''
    }
  },
  watch: {
    rolesSelect() {
      this.formDialog.options.roleIdList.selectItems = (this.rolesSelect || []).map(role => {
        return {
          value: role.roleId,
          label: role.roleName
        }
      })
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
      this.getRolesSelect()
      this.formDialog = {
        show: false,
        title: '',
        options: {
          departmentName: { type: 'text', label: '部门名称', rules: [
            { required: true, message: '请输入部门名称', trigger: 'blur' }
          ] },
          description: { type: 'text', label: '部门说明' },
          roleIdList: { type: 'multiple', label: '部门角色', selectItems: [] }
        },
        optionValue: {
          departmentName: '',
          description: '',
          parentDepartmentId: '',
          roleIdList: []
        },
        submit: Function
      }
    },

    // 获取角色列表
    getRolesSelect() {
      getRolesSelect().then(res => {
        this.rolesSelect = res.data
      })
    },

    // 获取部门角色
    getDepartRoles(id) {
      getDepartInfo(id).then(res => {
        this.formDialog.optionValue.roleIdList = (res.data.mesRbacRoleList || []).map(
          role => {
            return role.roleId
          }
        )
      })
    },

    // 部门功能
    handleCommand(command) {
      COMMIT_FUN[command].call(this)
    },

    // 展开功能
    handleDropdownClick(treeItem) {
      this.treeItem = treeItem
    },

    // 处理表单关闭
    handleFormClose() {
      this.formDialog.show = false
      this.formDialog.optionValue = Object.assign({}, DEPART_FORM, { roleIdList: [] })
    },

    // 处理拖拽
    handleDrop(draggingNode, dropNode, dropType, ev) {
      let data = {
        departmentId: draggingNode.data.id,
        parentDepartmentId: dropNode.data.parentDepartmentId
      }
      if (dropType === 'inner') {
        data = {
          departmentId: draggingNode.data.id,
          parentDepartmentId: dropNode.data.id
        }
      }

      movePostion(data)
        .then(res => {
          this.$emit('refresh-tree')
          this.$message.success(res.message)
        })
        .catch(err => {
          this.$emit('refresh-tree')
          this.$message.danger(err)
        })
    },

    // 处理表单提交
    handleFormCommit() {
      if (!this.handleSubmitFormDialog()) return
      if (
        this.commitType === COMMIT_TYPE.ADD ||
        this.commitType === COMMIT_TYPE.ADD_SUB
      ) {
        addDepartment(this.formDialog.optionValue).then(res => {
          this.$emit('refresh-tree')
          this.$message.success(res.message)
        })
      } else if (this.commitType === COMMIT_TYPE.UPDATE) {
        const id = this.treeItem.id
        editDepartment(id, this.formDialog.optionValue).then(res => {
          this.$emit('refresh-tree')
          this.$message.success(res.message)
        })
      }
      this.handleFormClose()
    },

    // 表单验证
    handleSubmitFormDialog() {
      return this.$refs.departForm.handleCheckData()
    },

    // 处理部门节点点击事件
    handleTreeClick(department, node, component) {
      const { id, label } = department
      this.$emit('handle-tree-click', id, label)
    }
  }
}
</script>
<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  .tree-label {
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
<style lang="scss">
.el-tooltip__popper.is-dark {
  max-width: 50%;
  word-wrap: break-word;
  font-size: 14px;
}
</style>
