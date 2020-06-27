<template>
  <div class="app-container staff-container">
    <div class="warpper">
      <div class="header-filter">
        <el-input
          v-model="searchAccount"
          class="filter-input"
          size="small"
          placeholder="请输入账号"
          @keyup.enter.native="handleSearch"
        />
        <el-input
          v-model="searchName"
          class="filter-input"
          size="small"
          placeholder="请输入姓名"
          @keyup.enter.native="handleSearch"
        />
        <el-input
          v-model="searchPhone"
          class="filter-input"
          size="small"
          placeholder="请输入手机号"
          @keyup.enter.native="handleSearch"
        />
        <el-input
          v-model="searchEmail"
          class="filter-input"
          size="small"
          placeholder="请输入电子邮件"
          @keyup.enter.native="handleSearch"
        />
        <el-button type="primary" size="small" @click="handleSearch">搜索</el-button>
        <el-button
          v-permission-key="btnPermission.batchDeleteUser"
          type="danger"
          size="small"
          @click="handleBatchDeleteStaff"
        >
          批量删除
        </el-button>

      </div>
      <!--  数据表  -->
      <div class="staff-list">
        <plk-table
          :table-selection="true"
          :table-header="tableHeader"
          :table-data="staffList"
          col-align="center"
          table-height="calc(100vh - 266px)"
          @selectionChange="handleSelectionChange"
        >
          <template v-slot:enable="clo">
            <el-switch
              v-model="clo.scope.row.isEnabled"
              active-text="启用"
              inactive-text="禁用"
              active-color="#248FFF"
              inactive-color="#999999"
              :disabled="noCanEdit(clo.scope.row)"
              class="switch-style"
              @change="handleChangeState(clo.scope.row)"
            />
          </template>
          <template v-slot:btnSlot="clo">
            <el-button
              v-permission-key="btnPermission.userDetile"
              type="primary"
              size="mini"
              @click="handleDetail(clo.scope.row)"
            >
              详情
            </el-button>
            <el-button
              v-permission-key="btnPermission.deleteUser"
              type="danger"
              size="mini"
              icon="el-icon-circle-check-outline"
              @click="handleDeleteStaff(clo.scope.row)"
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
        @pagination="handleGetStaffList"
      />

      <!--  弹窗  -->
      <el-dialog
        v-el-drag-dialog
        modal
        lock-scroll
        :title="detailTitle"
        width="40%"
        :visible.sync="dialogVisible"
      >
        <staffDetails :staff-info="staffInfo" />
      </el-dialog>
    </div>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import plkTable from '@/components/Table'
import staffDetails from './components/staffDetails'
import btnPermission from './btnPermission'
import { getCompetence as userCompetence } from '@/utils/auth'
import {
  getStaffList,
  postDisableStaff,
  postEnableStaff,
  getStaffDetail,
  deleteStaff,
  batchDeleteStaff
} from '@/api/security/user'

export default {
  name: 'Index',

  components: {
    staffDetails,
    Pagination,
    plkTable
  },
  data() {
    return {
      searchAccount: '', // 搜索账号
      searchName: '',
      searchPhone: '',
      searchEmail: '',
      detailTitle: '',
      loadingData: false, // 加载列表时，表格loading
      dialogVisible: false, // 显示隐藏弹窗
      currentPage: 1, // 当前页
      size: 30, // 每页显示多少条
      total: 1, // 总数
      staffList: [], // 员工列表(表格显示的数据)
      selectDataList: [], // 勾选员工列表
      staffInfo: {}, // 员工详情
      canBatchDelete: true,
      tableHeader: [
        { label: '员工账号', prop: 'username' },
        { label: '姓名', prop: 'realName' },
        { label: '手机号', prop: 'mobile' },
        { label: '电子邮件', prop: 'email' },
        { label: '是否启用', prop: 'enable', type: 'slot' },
        { label: '操作', type: 'btn', minWidth: '100px' }
      ]
    }
  },

  computed: {
    btnPermission() {
      return btnPermission
    }
  },

  mounted() {
    this.handleGetStaffList()

    const btnPower = this.btnPermission.batchDeleteUser
    const power = userCompetence()[btnPower.action]
    const arr = []
    power.map(item => {
      arr.push(item.url)
    })
    arr.indexOf(btnPower.url) === -1 ? this.canBatchDelete = false : this.canBatchDelete = true
  },

  methods: {
    noCanEdit(item) {
      const power = userCompetence().put
      const arr = []
      power.map(item => {
        arr.push(item.url)
      })
      if (item.isEnabled) { // 启用
        const disBtnPower = this.btnPermission.disableUser
        if (arr.indexOf(disBtnPower.url) === -1) return true
      } else {
        const enBtnPower = this.btnPermission.enableUser
        if (arr.indexOf(enBtnPower.url) === -1) return true
      }
    },
    // 加载员工列表
    handleGetStaffList() {
      this.loadingData = true
      getStaffList({
        current: this.currentPage,
        size: this.size,
        email: this.searchEmail,
        loginName: this.searchAccount,
        mobile: this.searchPhone,
        realName: this.searchName
      }).then(res => {
        if (res.code === '200') {
          this.loadingData = false
          this.staffList = res.data.list
          this.total = Number(res.data.total)
        }
      }).catch(err => {
        console.log(err)
        this.loadingData = false
      })
    },

    // 搜索
    handleSearch() {
      this.loadingData = true
      this.currentPage = 1
      getStaffList({
        current: this.currentPage,
        size: this.size,
        email: this.searchEmail,
        loginName: this.searchAccount,
        mobile: this.searchPhone,
        realName: this.searchName
      }).then(res => {
        if (res.code === '200') {
          this.loadingData = false
          this.staffList = res.data.list
          this.total = Number(res.data.total)
        }
      }).catch(err => {
        console.log(err)
        this.loadingData = false
      })
    },

    // 员工启用/不启用(注意：如果请求修改失败，要把按钮状态改回来)
    handleChangeState(item) {
      if (item.isEnabled) { // 启用
        postEnableStaff(item.userId).then(res => {
          if (res.code === '200') {
            this.$message.success(res.message)
          } else {
            item.isEnabled = !item.isEnabled
          }
        }).catch(() => {
          item.isEnabled = !item.isEnabled
        })
      } else { // 不启用
        postDisableStaff(item.userId).then(res => {
          if (res.code === '200') {
            this.$message.success(res.message)
          } else {
            item.isEnabled = !item.isEnabled
          }
        }).catch(() => {
          item.isEnabled = !item.isEnabled
        })
      }
    },

    // 查看员工详情
    handleDetail(item) {
      getStaffDetail(item.userId).then(res => {
        this.dialogVisible = true
        this.detailTitle = `员工详情：${res.data.username}`
        this.staffInfo = res.data
      })
    },

    // 删除单条
    handleDeleteStaff(item) {
      this.$confirm(`确定删除${item.username}吗？`, '警告', {
        confirmButtonClass: '确定',
        cancelButtonClass: '取消',
        type: 'warning'
      }).then(() => {
        deleteStaff(item.userId).then(res => {
          if (res.code === '200') {
            this.$message.success(res.data)
            this.handleGetStaffList()
          }
        })
      })
    },

    // 勾选员工
    handleSelectionChange(val) {
      console.log(val)
      this.selectDataList = val
    },

    // 批量删除多条
    handleBatchDeleteStaff() {
      if (!this.selectDataList.length) return
      this.$confirm('确定删除吗？', '警告', {
        confirmButtonClass: '确定',
        cancelButtonClass: '取消',
        type: 'warning'
      }).then(() => {
        const staff = []
        this.selectDataList.map(item => {
          staff.push(item.userId)
        })
        batchDeleteStaff(staff).then(res => {
          if (res.code === '200') {
            this.$message.success(res.message)
            this.handleGetStaffList()
          }
        })
      })
    },

    // 关闭弹窗
    handleCloseDialog() {
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped lang="scss">
.staff-container {
  .header-filter {
    display: flex;
    /*padding: 16px 16px;*/
    /*margin: 8px 0;*/
    padding-bottom: 16px;
    background-color: #fff;

    .filter-input {
      width: 160px;
      margin-right: 10px;
    }
  }

  .header-btn {
    display: flex;
    padding-bottom: 10px;
  }
}
</style>

