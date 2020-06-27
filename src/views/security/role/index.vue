<template>
  <div class="app-container roles-container">
    <div class="warpper">
      <div class="header-btn">
        <el-input
          v-model="searchRoleName"
          size="small"
          class="search-role"
          placeholder="请输入角色名称"
          @keyup.enter.native="handleSearch"
        />
        <el-button
          type="primary"
          size="mini"
          @click="handleSearch"
        >
          搜索
        </el-button>
        <el-button
          v-permission-key="btnPermission.addRole"
          type="primary"
          size="small"
          @click="handleAddRoles"
        >
          新增
        </el-button>
      </div>

      <div class="roles-list">
        <el-table
          v-loading="loadingData"
          :data="list"
          fit
          border
          highlight-current-row
          height="calc(100vh - 266px)"
          style="width: 100%"
        >
          <el-table-column :show-overflow-tooltip="true" align="center" label="角色名称">
            <template slot-scope="{ row }">
              <template v-if="row.editName">
                <el-input ref="nameInput" v-model="row.roleName" class="edit-input" size="mini" />
                <el-button class="definite-btn" size="mini" type="primary" @click="handleSubmitInlineEditRoleName(row)">
                  确定
                </el-button>
                <el-button class="cancel-btn" size="mini" type="warning" @click="handleCancelRolesName(row)">取消
                </el-button>
              </template>
              <span v-else class="span-text" @click="handleInlineEdit('name', row)">{{ row.roleName }}</span>
            </template>
          </el-table-column>

          <el-table-column :show-overflow-tooltip="true" align="center" label="角色说明">
            <template slot-scope="{ row }">
              <template v-if="row.editDesc">
                <el-input ref="descInput" v-model="row.description" class="edit-input" size="mini" />
                <el-button class="definite-btn" size="mini" type="primary" @click="handleSubmitInlineEditRoleDesc(row)">
                  确定
                </el-button>
                <el-button class="cancel-btn" size="mini" type="warning" @click="handleCancelDesc(row)">取消</el-button>
              </template>
              <span v-else class="span-text" @click="handleInlineEdit('desc', row)">{{ row.description }}</span>
            </template>
          </el-table-column>

          <el-table-column width="300px" align="center" label="操作">
            <template slot-scope="{ row }">
              <el-button
                v-permission-key="btnPermission.editRole"
                type="primary"
                size="mini"
                @click="handleEditRole(row)"
              >
                编辑
              </el-button>
              <el-button
                v-permission-key="btnPermission.editRole"
                type="success"
                size="mini"
                @click="handleAssignPermissions(row)"
              >
                分配权限
              </el-button>
              <el-button
                v-permission-key="btnPermission.deleteRole"
                type="danger"
                size="mini"
                @click="handleDeleteRole(row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!--  分页  -->
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="currentPage"
        :limit.sync="size"
        @pagination="handleGetRoles"
      />

      <!--  弹窗  -->
      <div v-if="dialogVisible">
        <el-dialog
          v-el-drag-dialog
          modal
          lock-scroll
          :title="title"
          :close-on-click-modal="false"
          :visible.sync="dialogVisible"
          width="40%"
        >
          <popup
            v-loading="loading"
            :operating="operating"
            :roles="roles"
            :checked-keys="checkedKeys"
            :permission="competenceList"
            @addRole="handlePostRole"
            @editRole="handlePostEditRole"
            @editAuthority="handlePostEditRole"
            @close="handleCloseDialog"
          />
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import popup from './components/popup'
import Pagination from '@/components/Pagination'
import { getRolesList, addRoles, deleteRole, editRole, getCompetence, getRoleDetail } from '@/api/security/roles'
import { getCompetence as userCompetence } from '@/utils/auth'
import btnPermission from './btnPermission'

export default {
  name: 'Index',

  components: {
    popup,
    Pagination
  },

  data() {
    return {
      loading: false,
      searchRoleName: '', // 搜索角色名称
      loadingData: false, // 加载角色列表时，表格loading
      title: '添加新角色', // 弹窗title
      operating: 'add', // add:新增角色 edit:编辑角色 role:修改权限
      dialogVisible: false, // 显示隐藏弹窗
      roles: {
        // 弹窗form表单数据
        roleName: '', // 角色名
        description: '' // 角色描述
      },
      currentPage: 1, // 当前页
      size: 30, // 每页显示多少条
      total: 0, // 总数
      list: [], // 角色数据列表
      competenceList: [], // 权限列表
      checkedKeys: [], // 角色权限列表
      mesRbacResourceList: [] // 角色权限
    }
  },

  computed: {
    btnPermission() {
      return btnPermission
    }
  },

  mounted() {
    this.handleGetRoles()
  },

  methods: {
    // 获取角色列表
    handleGetRoles() {
      this.loadingData = true
      getRolesList({
        roleName: this.searchRoleName,
        current: this.currentPage,
        size: this.size
      })
        .then(res => {
          this.loadingData = false
          if (res.code === '200') {
            res.data.list.map(v => {
              v.editName = false
              v.editDesc = false
              v.originalRoleName = v.roleName
              v.originalDes = v.description
            })
            this.list = res.data.list
            this.total = Number(res.data.total)
          }
        })
        .catch(res => {
          this.loadingData = false
        })
    },

    // 搜索
    handleSearch() {
      this.currentPage = 1
      this.handleGetRoles()
    },

    // 点击添加角色按钮
    handleAddRoles() {
      this.handleGetCompetence()
      this.dialogVisible = true
      this.title = '新增角色'
      this.operating = 'add'
      this.roles = {
        roleName: '',
        description: ''
      }
    },

    // 获取权限
    handleGetCompetence() {
      getCompetence().then(res => {
        this.handleFormat(res.data)
      })
    },

    /**
     * 处理权限数据格式
     * @param dataList 权限列表
     * {
     *   resourceId: 'selfID',
     *   parentResourceId: 'parentID',
     *   ...
     *   children:[{
     *     resourceId: 'selfID',
     *     parentResourceId: 'parentID'
     *     ...
     *   }]
     * }
     */
    handleFormat(dataList) {
      const tree = dataList.filter((father) => { // 循环所有项
        const branchArr = dataList.filter((child) => {
          return father.resourceId === child.parentResourceId // 返回每一项的子级数组
        })
        if (branchArr.length > 0) {
          father.children = branchArr // 如果存在子级，则给父级添加一个children属性，并赋值
        }
        return father.parentResourceId === '0' // 如果parentResourceId为0（即顶级），则返回第一层（顶级）
      })
      this.competenceList = tree
    },

    // 提交添加角色
    handlePostRole(val, key) {
      this.loading = true
      addRoles({ roleName: val.roleName, description: val.description, mesRbacResourcesList: key })
        .then(res => {
          this.loading = false
          if (res.code === '200') {
            this.$message.success(res.message)
            this.dialogVisible = false
            this.handleGetRoles()
          }
        })
        .catch(res => {
          this.loading = false
          console.log(res)
        })
    },

    // 行内编辑
    handleInlineEdit(index, item) {
      getRoleDetail(item.roleId).then(res => {
        this.mesRbacResourceList = res.data.mesRbacResourceList.map(item => {
          return item.resourceId
        })
      })
      const btnPower = this.btnPermission.editRole
      const power = userCompetence()[btnPower.action]
      const arr = []
      power.map(item => {
        arr.push(item.url)
      })
      if (arr.indexOf(btnPower.url) === -1) return

      if (index === 'name') {
        item.editName = true
        this.$nextTick(() => {
          this.$refs.nameInput.focus()
        })
      } else {
        item.editDesc = true
        this.$nextTick(() => {
          this.$refs.descInput.focus()
        })
      }
    },

    // 取消角色名称行内编辑
    handleCancelRolesName(item) {
      item.editName = false
      item.roleName = item.originalRoleName
    },

    // 取消角色说明行内编辑
    handleCancelDesc(item) {
      item.editDesc = false
      item.description = item.originalDes
    },

    // 提交角色名称行内编辑
    handleSubmitInlineEditRoleName(item) {
      if (!item.roleName.trim()) return
      editRole({ roleName: item.roleName, mesRbacResourceList: this.mesRbacResourceList }, item.roleId)
        .then(res => {
          if (res.code === '200') {
            this.$message.success(res.data)
            item.editName = false
          }
        })
        .catch(res => {
          console.log(res)
        })
    },

    // 提交角色说明行内编辑
    handleSubmitInlineEditRoleDesc(item) {
      editRole({ description: item.description, mesRbacResourceList: this.mesRbacResourceList }, item.roleId)
        .then(res => {
          if (res.code === '200') {
            this.$message.success(res.data)
            item.editDesc = false
          }
        })
        .catch(res => {
          console.log(res)
        })
    },

    // 编辑角色(点击按钮)
    handleEditRole(item) {
      console.log(item)
      this.dialogVisible = true
      this.title = `修改角色：${item.roleName}`
      this.operating = 'edit'
      this.roles = {
        roleName: item.roleName,
        description: item.description,
        roleId: item.roleId
      }
      this.handleGetCompetence()
      this.handleGetRoleDetail(item.roleId)
    },

    // 获取角色详情
    handleGetRoleDetail(roleId) {
      getRoleDetail(roleId).then(res => {
        const arr = []
        res.data.mesRbacResourceList.map(item => {
          arr.push(item.resourceId)
        })
        this.checkedKeys = arr
      })
    },

    // 提交编辑角色
    handlePostEditRole(item, keys) {
      this.loading = true
      editRole({
        description: item.description,
        roleName: item.roleName,
        mesRbacResourceList: keys
      }, item.roleId)
        .then(res => {
          this.loading = false
          if (res.code === '200') {
            this.$message.success(res.data)
            this.dialogVisible = false
            item.editName = false
            item.editDesc = false
            this.handleGetRoles()
          }
        })
        .catch(res => {
          this.loading = false
          console.log(res)
        })
    },

    // 分配权限（按钮）
    handleAssignPermissions(item) {
      this.dialogVisible = true
      this.title = `分配权限：${item.roleName}`
      this.operating = 'role'
      this.roles = {
        roleName: item.roleName,
        description: item.description,
        roleId: item.roleId
      }
      this.handleGetCompetence()
      this.handleGetRoleDetail(item.roleId)
    },

    // 删除角色
    handleDeleteRole(item) {
      console.log(item)
      this.$confirm(`确定删除${item.roleName}吗？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRole(item.roleId)
          .then(res => {
            if (res.code === '200') {
              this.$message.success(res.message)
              this.handleGetRoles()
            }
          })
          .catch(res => {
            console.log(res)
          })
      })
    },

    // 取消添加关闭弹窗
    handleCloseDialog() {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.roles-container {
  .header-btn {
    display: flex;
    background-color: #fff;
    padding-bottom: 16px;

    .search-role {
      width: 160px;
      margin-right: 10px;
    }
  }
}

.edit-input {
  padding-right: 128px;
}

.definite-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}

.cancel-btn {
  position: absolute;
  right: 75px;
  top: 10px;
}

.span-text {
  display: inline-block;
  width: 100%;
  min-height: 16px;
  padding: 0 10px;
  cursor: text;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
