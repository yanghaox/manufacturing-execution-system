<template>
  <div class="app-container post-container">
    <div class="warpper">
      <div class="header-btn">
        <el-input
          v-model="searchPost"
          class="search-post"
          placeholder="请输入岗位"
          size="small"
          @keyup.enter.native="handleSearch"
        />
        <el-button type="primary" size="small" @click="handleSearch">搜索</el-button>
        <el-button
          v-permission-key="btnPermission.addPostion"
          type="primary"
          size="small"
          @click="handleAddPost"
        >
          新增
        </el-button>
        <el-button
          v-permission-key="btnPermission.batchDeletePostion"
          type="danger"
          size="small"
          @click="handleDeleteSelectPost"
        >
          批量删除
        </el-button>
      </div>
      <div class="post-list">
        <el-table
          v-loading="loadingData"
          :data="postList"
          border
          fit
          highlight-current-row
          height="calc(100vh - 266px)"
          @selection-change="handleSelectionChange"
        >
          <el-table-column v-if="canBatchDelete" align="center" type="selection" width="50" />

          <el-table-column :show-overflow-tooltip="true" width="320px" align="center" label="岗位名称">
            <template slot-scope="{row}">
              <template v-if="row.editName">
                <el-input ref="nameInput" v-model="row.postionName" class="edit-input" size="mini" />
                <el-button class="definite-btn" size="mini" type="primary" @click="handleInSubmitlineEditPost(row)">
                  确定
                </el-button>
                <el-button class="cancel-btn" size="mini" type="warning" @click="handleCancelPostName(row)">
                  取消
                </el-button>
              </template>
              <span v-else class="span-text" @click="handleInlineEdit('name', row)">{{ row.postionName }}</span>
            </template>
          </el-table-column>

          <el-table-column :show-overflow-tooltip="true" min-width="300px" align="center" label="岗位说明">
            <template slot-scope="{row}">
              <template v-if="row.editDesc">
                <el-input ref="descInput" v-model="row.description" class="edit-input" size="mini" />
                <el-button class="definite-btn" size="mini" type="primary" @click="handleInSubmitlineEditPostDesc(row)">
                  确定
                </el-button>
                <el-button class="cancel-btn" size="mini" type="warning" @click="handleCancelPostDesc(row)">
                  取消
                </el-button>
              </template>
              <span v-else class="span-text" @click="handleInlineEdit('desc', row)">{{ row.description }}</span>
            </template>
          </el-table-column>

          <el-table-column width="320px" align="center" label="操作">
            <template slot-scope="{row}">
              <el-button
                v-permission-key="btnPermission.editPostion"
                type="primary"
                size="mini"
                @click="handleEditPost(row)"
              >
                编辑
              </el-button>
              <el-button
                v-permission-key="btnPermission.editPostion"
                type="primary"
                size="mini"
                @click="handleAssigningRoles(row)"
              >
                分配角色
              </el-button>
              <el-button
                v-permission-key="btnPermission.deletePostion"
                type="danger"
                size="mini"
                icon="el-icon-circle-check-outline"
                @click="handleDeletePost(row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!--  分页  -->
      <pagination
        v-show="total > 0 "
        :total="total"
        :page.sync="currentPage"
        :limit.sync="size"
        @pagination="handleGetPostList"
      />

      <!--  添加岗位弹窗  -->
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
        <plk-form ref="jrf" :options="formDialog.options" :option-value="formDialog.optionValue" />

        <div style="text-align: right">
          <el-button size="small" @click="handleCloseDialog">取消</el-button>
          <el-button
            size="small"
            type="primary"
            @click="$refs.jrf.handleCheckData() && handleDetermine($refs.jrf.handleGetFormData())"
          >
            确定
          </el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import plkForm from '@/components/Form'
import PLKFormFunction from '@/components/Form/FormFunction'
import btnPermission from './btnPermission'
import { getCompetence as userCompetence } from '@/utils/auth'
import {
  getPostList,
  getPostDeatil,
  addPost,
  getRolesList,
  editPost,
  deletPost,
  batchDelete
} from '@/api/security/post'

export default {
  name: 'Index',

  components: {
    plkForm,
    Pagination
  },

  mixins: [PLKFormFunction],

  data() {
    return {
      searchPost: '', // 搜索
      title: '添加新岗位',
      operating: 'add', // add:新增 edit:编辑 post:分配角色
      postForm: { // 弹窗form表单数据
        postName: '',
        description: '',
        roles: []
      },
      rolesList: [], // 角色列表
      loadingData: false, // 加载列表时，表格loading
      currentPage: 1, // 当前页
      size: 30, // 每页显示多少条
      total: 0, // 总数
      postList: [], // 岗位列表
      selectDataList: [], // 勾选的岗位
      canBatchDelete: true
    }
  },

  computed: {
    btnPermission() {
      return btnPermission
    }
  },

  mounted() {
    this.handleGetPostList()
    this.handleGetRolesList()

    const btnPower = this.btnPermission.batchDeletePostion
    const power = userCompetence()[btnPower.action]
    const arr = []
    power.map(item => {
      arr.push(item.url)
    })
    arr.indexOf(btnPower.url) === -1 ? this.canBatchDelete = false : this.canBatchDelete = true
  },

  methods: {
    // 获取岗位列表
    handleGetPostList() {
      this.loadingData = true
      getPostList({
        postionName: this.searchPost,
        current: this.currentPage,
        size: this.size
      }).then(res => {
        this.loadingData = false
        if (res.code === '200') {
          res.data.list.map(v => {
            v.editName = false
            v.editDesc = false
            v.originalPostName = v.postionName
            v.originalDes = v.description
          })
          this.postList = res.data.list
          this.total = Number(res.data.total)
        }
      }).catch(err => {
        this.loadingData = false
        console.log(err)
      })
    },

    // 搜索
    handleSearch() {
      this.currentPage = 1
      this.handleGetPostList()
    },

    // 获取角色列表
    handleGetRolesList() {
      getRolesList().then(res => {
        this.rolesList = res.data.map(item => {
          item.label = item.roleName
          item.value = item.roleId
          return item
        })
      })
    },

    // form
    handleSetForm(item, roles) {
      this.handleGetRolesList()
      const operating = this.operating !== 'add'
      const formDialog = {
        title: this.operating === 'add' ? '新增岗位' : this.operating === 'edit' ? `修改岗位：${item.postionName}` : `分配角色：${item.postionName}`,
        optionValue: {
          postName: operating ? item.postionName : '',
          roles: this.operating === 'add' ? [] : roles,
          description: operating ? item.description : '',
          postId: operating ? item.postionId : ''
        },
        options: {
          postName: {
            label: '岗位',
            disabled: this.operating === 'post',
            rules: [
              { required: true, message: '岗位不能为空', trigger: 'blur' }
            ]
          },
          roles: {
            type: 'multiple',
            label: '角色',
            selectItems: this.rolesList,
            rules: [
              { required: true, message: '角色不能为空', trigger: 'change' }
            ]
          },
          description: {
            type: 'textarea',
            label: '岗位说明',
            disabled: this.operating === 'post'
          }
        }
      }
      this.formDialog = { show: true, ...formDialog }
    },

    // 添加岗位
    handleAddPost() {
      this.operating = 'add'
      this.handleSetForm()
    },

    // 弹窗
    handleDetermine(val) {
      if (this.operating === 'add') {
        this.handleSubmitPost(val)
      } else {
        this.handleSubmitEditPost(val)
      }
    },

    // 提交新增
    handleSubmitPost(val) {
      addPost({
        postionName: val.postName,
        description: val.description,
        roleIdList: val.roles
      }).then(res => {
        if (res.code === '200') {
          this.$message.success(res.message)
          this.formDialog.show = false
          this.handleGetPostList()
        }
      })
    },

    // 点击编辑按钮
    handleEditPost(item) {
      getPostDeatil(item.postionId).then(res => {
        if (res.code === '200') {
          const roles = []
          res.data.mesRbacRoleList.map(item => {
            roles.push(item.roleId)
          })
          this.operating = 'edit'
          this.handleSetForm(item, roles)
        }
      })
    },

    // 分配角色
    handleAssigningRoles(item) {
      getPostDeatil(item.postionId).then(res => {
        if (res.code === '200') {
          const roles = []
          res.data.mesRbacRoleList.map(item => {
            roles.push(item.roleId)
          })
          this.operating = 'post'
          this.handleSetForm(item, roles)
        }
      })
    },

    // 提交编辑、分配角色
    handleSubmitEditPost(val) {
      editPost({
        postionName: val.postName,
        description: val.description,
        roleIdList: val.roles
      }, val.postId).then(res => {
        this.formDialog.show = false
        if (res.code === '200') {
          this.$message.success(res.data)
          this.handleGetPostList()
        }
      })
    },

    // 行内编辑
    handleInlineEdit(index, item) {
      const btnPower = this.btnPermission.editPostion
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

    // 取消岗位行内编辑
    handleCancelPostName(item) {
      item.editName = false
      item.postionName = item.originalPostName
    },

    // 取消岗位说明行内说明
    handleCancelPostDesc(item) {
      item.editDesc = false
      item.description = item.originalDes
    },

    // 行内编辑岗位确定提交
    handleInSubmitlineEditPost(item) {
      if (!item.postionName.trim()) return
      editPost({
        postionName: item.postionName,
        description: item.description
      }, item.postionId).then(res => {
        if (res.code === '200') {
          this.$message.success(res.data)
          item.editName = false
        }
      })
    },

    // 行内编辑岗位说明确定提交
    handleInSubmitlineEditPostDesc(item) {
      editPost({
        postionName: item.postionName,
        description: item.description
      }, item.postionId).then(res => {
        if (res.code === '200') {
          this.$message.success(res.data)
          item.editDesc = false
        }
      })
    },

    // 删除单条岗位
    handleDeletePost(item) {
      this.$confirm(`确认删除${item.postionName}吗？`, '警告', {
        cancelButtonClass: '取消',
        confirmButtonClass: '确定',
        type: 'warning'
      }).then(() => {
        deletPost(item.postionId).then(res => {
          if (res.code === '200') {
            this.$message.success(res.data)
            this.handleGetPostList()
          }
        })
      })
    },

    // 勾选岗位
    handleSelectionChange(val) {
      this.selectDataList = val
    },

    // 删除多条岗位
    handleDeleteSelectPost() {
      if (!this.selectDataList.length) return
      this.$confirm('确认删除吗？', '警告', {
        cancelButtonClass: '取消',
        confirmButtonClass: '确定',
        type: 'warning'
      }).then(() => {
        const arr = []
        this.selectDataList.map(v => {
          arr.push(v.postionId)
        })
        batchDelete(arr).then(res => {
          if (res.code === '200') {
            this.$message.success(res.data)
            this.handleGetPostList()
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.post-container {
  .header-btn {
    display: flex;
    /*padding: 16px 16px;*/
    /*margin: 8px 0;*/
    padding-bottom: 16px;
    background-color: #fff;

    .search-post {
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
