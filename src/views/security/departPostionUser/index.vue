<template>
  <div class="depart-postion-user">
    <div class="card-warpper">
      <el-card class="depart-list" shadow="never">
        <div slot="header">
          <span>部门列表</span>
        </div>
        <department-tree :tree-list="departList" @handle-tree-click="getDepartPostionList" />
      </el-card>
      <el-card v-if="departmentId !== ''" class="postion-list" shadow="never">
        <div slot="header">
          <span>岗位列表({{ departmentName }})</span>
        </div>
        <my-table
          :table-data="postionList"
          hidden
          @row-click="handleRowClick"
        >
          <el-table-column prop="postionName" align="center" label="岗位" />
        </my-table>
      </el-card>
      <el-card v-if="postionId !== ''" class="user-list" shadow="never">
        <div slot="header">
          <span>员工列表({{ postionName }})</span>
          <div class="button-group">
            <el-button v-permission-key="btnPermission.addUser" type="primary" size="small" :disabled="postionId === ''" @click="addUser">新增</el-button>
            <el-button v-permission-key="btnPermission.deleteUser" type="danger" size="small" :disabled="postionId === ''" @click="deleteUser">移除</el-button>
            <el-button v-permission-key="btnPermission.getDepartNotPostionUsersSelect" size="small" :disabled="postionId === ''" @click="addDepartUser">加入部门已有员工</el-button>
          </div>
        </div>
        <my-table
          :table-data="userList"
          :total="total"
          :page="currentPage"
          :limit="size"
          :page-sizes="pageSizes"
          @selection-change="handleSelectionChange"
          @pagination="handlePaginationChange"
          @update:limit="updateLimit"
          @update:page="updatePage"
        >
          <el-table-column align="center" type="selection" width="50" />
          <el-table-column align="center" prop="username" label="员工账号" />
          <el-table-column align="center" prop="realName" label="姓名" />
          <el-table-column align="center" prop="mobile" label="手机号" />
          <el-table-column align="center" prop="email" label="电子邮箱" />
          <el-table-column align="center" label="是否启用">
            <template v-slot="scope">
              <my-switch v-permission-key="btnPermission.enableUser" is-enabled="isEnabled" :row="scope.row" @changeState="handleChangeState(scope.$index, scope.row)" />
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="200">
            <template v-slot="scope">
              <el-button v-permission-key="btnPermission.editUser" size="mini" type="text" @click="editUser(scope.$index, scope.row)">编辑</el-button>
              <el-button v-permission-key="btnPermission.deleteSingleUser" size="mini" type="text" @click="deleteSingleUser(scope.$index, scope.row)">移除</el-button>
            </template>
          </el-table-column>
        </my-table>
      </el-card>
    </div>

    <!-- 员工表单 -->
    <el-dialog v-if="userDialogVisible" title="员工" :visible.sync="userDialogVisible" width="30%" :close-on-click-modal="false">
      <plk-form ref="userForm" :option-value="userForm" :options="userFormItems" label-width="80px" />
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleUserFormClose">取 消</el-button>
        <el-button type="primary" size="small" @click="handleUserFormCommit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 加入部门已有员工 -->
    <el-dialog v-if="departNotPostionUserDialogVisible" title="加入部门已有员工" :visible.sync="departNotPostionUserDialogVisible" width="30%" :close-on-click-modal="false">
      <plk-form ref="departNotPostionUserForm" :option-value="departNotPostionUserForm" :options="departNotPostionUserFormItems" label-width="80px" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDepartNotPostionUserFormClose">取 消</el-button>
        <el-button type="primary" size="small" @click="handleDepartNotPostionUserFormCommit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const USER_FORM = {
  username: '',
  password: '',
  realName: '',
  mobile: '',
  email: ''
}
const COMMIT_TYPE = {
  ADD: 'addUser',
  EDIT: 'editUser'
}

import btnPermission from './btnPermission'
import MyTable from '@/components/MyTable'
import paginationMixin from '@/components/MyTable/paginationMixin'
import DepartmentTree from '@/components/DepartmentTree'
import MySwitch from '@/components/Switch'
import PlkForm from '@/components/Form'
import { generateTree } from '@/components/DepartmentTree/generateTree'
import {
  getDepartList,
  getDepartPostionList,
  getDepartPostionUserList,
  getRolesSelect,
  addUser,
  deleteUser,
  editUser,
  getDepartNotPostionUsersSelect,
  deleteSingleUser,
  enableUser,
  disableUser,
  addDepartPostionUserList,
  getUserInfo
} from '@/api/security/departPostionUser'
export default {
  name: 'DepartPostionUser',
  components: { DepartmentTree, MySwitch, MyTable, PlkForm },
  mixins: [paginationMixin],
  data() {
    return {
      userDialogVisible: false,
      departNotPostionUserDialogVisible: false,
      departNotPostionUserForm: {
        userList: []
      },
      departNotPostionUserFormItems: {
        userList: { type: 'multiple', label: '部门员工', selectItems: [], rules: [
          { type: 'array', required: true, message: '请至少选择一个部门员工', trigger: 'change' }
        ] }
      },
      departmentId: '',
      departmentName: '请选择部门',

      postionId: '',
      postionName: '请选择岗位',
      userId: '',
      departList: [],
      rolesSelect: [],
      postionList: [],
      selectionId: [],
      userForm: {
        username: '',
        password: '',
        realName: '',
        mobile: '',
        email: '',
        roleIdList: []
      },
      userFormItems: {
        username: { type: 'text', label: '员工账号', rules: [
          { required: true, message: '请输入员工账号', trigger: 'blur' }
        ] },
        password: { type: 'password', label: '员工密码' },
        realName: { type: 'text', label: '姓名' },
        mobile: { type: 'text', label: '手机号' },
        email: { type: 'text', label: '电子邮箱' },
        roleIdList: { type: 'multiple', label: '员工角色', selectItems: [], rules: [
          { type: 'array', required: true, message: '请至少选择一个员工角色', trigger: 'change' }
        ] }
      },
      userList: [],
      departNotPostionUsersSelect: [],
      commitType: ''
    }
  },
  computed: {
    btnPermission() {
      return btnPermission
    }
  },
  watch: {
    rolesSelect() {
      this.userFormItems.roleIdList.selectItems = (this.rolesSelect || []).map(role => {
        return {
          value: role.roleId,
          label: role.roleName
        }
      })
    },
    departNotPostionUsersSelect() {
      this.departNotPostionUserFormItems.userList.selectItems = (this.departNotPostionUsersSelect || []).map(user => {
        return {
          value: user.userId,
          label: user.username
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
      this.getDepartList()
      this.getRolesSelect()
    },

    // 获取部门列表
    getDepartList() {
      getDepartList().then(res => {
        this.departList = generateTree(res.data)
      })
    },

    // 获取角色列表
    getRolesSelect() {
      getRolesSelect().then(res => {
        this.rolesSelect = res.data
      })
    },

    // 查询部门岗位已分配用户列表
    getDepartPostionUserList() {
      // 分页处理
      const params = {}
      params.postionId = this.postionId
      params.current = this.currentPage
      params.size = this.size
      getDepartPostionUserList(params).then(res => {
        this.total = Number(res.data.total)
        this.userList = res.data.list
      })
    },

    // 处理部门点击
    getDepartPostionList(id, label) {
      this.departmentId = id
      this.postionId = ''
      this.userId = ''
      getDepartPostionList(this.departmentId).then(res => {
        this.postionList = res.data
        if (label) {
          this.departmentName = label
        }
      })
    },

    // 处理岗位点击
    handleRowClick(row, column, event) {
      this.postionId = row.postionId
      this.postionName = row.postionName
      this.refreshPagination()
    },

    // 新增员工
    addUser() {
      this.userDialogVisible = true
      this.commitType = COMMIT_TYPE.ADD
    },

    // 批量删除员工
    deleteUser() {
      if (this.selectionId.length) {
        this.$confirm('是否删除该部门岗位员工', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const postionId = this.postionId
          const data = this.selectionId
          return deleteUser(postionId, data)
        }).then(res => {
          this.$message.success(res.message)
          this.refreshPagination()
        })
      }
    },

    // 加入本部门的其它非本岗位员工
    addDepartUser() {
      const { departmentId, postionId } = this
      getDepartNotPostionUsersSelect({ departmentId, postionId }).then(res => {
        this.departNotPostionUsersSelect = res.data
        this.departNotPostionUserDialogVisible = true
      })
    },

    // 处理提交，添加非本岗位员工用户
    handleDepartNotPostionUserFormCommit() {
      if (!this.$refs.departNotPostionUserForm.handleCheckData()) return
      const id = this.postionId
      const data = this.departNotPostionUserForm.userList
      addDepartPostionUserList(id, data).then(res => {
        this.$message.success(res.message)
        this.refreshPagination()
      })
      this.handleDepartNotPostionUserFormClose()
    },

    // 处理关闭(添加非本岗位员工用户)
    handleDepartNotPostionUserFormClose() {
      this.departNotPostionUserForm = {}
      this.departNotPostionUserDialogVisible = false
    },

    // 修改员工
    editUser(index, row) {
      this.userId = row.userId
      getUserInfo(this.userId).then(res => {
        const { username, password, realName, mobile, email, mesRbacRoleList } = res.data
        const roleIdList = (mesRbacRoleList || []).map(item => {
          return item.roleId
        })
        this.userForm = { username, password, realName, mobile, email, roleIdList }
      })
      this.userDialogVisible = true
      this.commitType = COMMIT_TYPE.EDIT
    },

    // 删除单个员工
    deleteSingleUser(index, row) {
      this.userId = row.userId
      this.$confirm('是否删除该部门岗位员工', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const { userId, postionId } = this
        return deleteSingleUser({ userId, postionId })
      }).then(res => {
        this.$message.success(res.message)
        this.refreshPagination()
      })
    },

    // 员工添加、编辑表单提交
    handleUserFormCommit() {
      if (!this.$refs.userForm.handleCheckData()) return
      const { departmentId, postionId, userForm } = this
      const data = Object.assign({}, { departmentId, postionId }, userForm)
      this.commitType === COMMIT_TYPE.ADD ? this.handleAddUserCommit(data) : this.handleEditUserCommit(data)
      this.handleUserFormClose()
    },

    // 处理添加用户
    handleAddUserCommit(data) {
      addUser(data).then(res => {
        this.$message.success(res.message)
        this.refreshPagination()
      })
    },

    // 处理编辑用户
    handleEditUserCommit(data) {
      const id = this.userId
      editUser(id, data).then(res => {
        this.$message.success(res.message)
        this.refreshPagination()
      })
    },

    // 员工表单关闭
    handleUserFormClose() {
      this.userDialogVisible = false
      this.userForm = Object.assign({}, USER_FORM, { roleIdList: [] })
    },

    // 处理表格选项
    handleSelectionChange(value) {
      this.selectionId = (value || []).map(item => {
        return item.userId
      })
    },

    // 启用/禁用员工
    handleChangeState(index, row) {
      if (row.isEnabled) {
        enableUser(row.userId).then(res => {
          this.refreshPagination()
        })
      } else {
        disableUser(row.userId).then(res => {
          this.refreshPagination()
        })
      }
    },

    // 刷新分页，员工列表
    refreshPagination() {
      this.getDepartPostionUserList()
    }
  }
}
</script>
<style lang="scss" scoped>
.depart-postion-user {
  .card-warpper {
    height: calc(100vh - 122px);
    display: flex;
    .depart-list {
      width: 250px;
      min-width: 250px;
      margin-right: 16px;
    }
    .postion-list {
      width: 200px;
      min-width: 200px;
    }
    .user-list {
      flex: 1;
      margin-left: 16px;
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
