<template>
  <div class="app-container">
    <div v-if="!editDeviceGroup">
      <div class="header-btn">
        <el-input
          v-model="belongDepartment"
          size="small"
          class="search-role"
          placeholder="请输入部门"
          @keyup.enter.native="handleGetDeviceGroupList"
        />
        <el-input
          v-model="groupName"
          size="small"
          class="search-role"
          placeholder="请输入设备组名称"
          @keyup.enter.native="handleGetDeviceGroupList"
        />
        <el-select v-model="type" clearable size="small" class="search-role" placeholder="请选择类型">
          <el-option label="设备单元" value="device" />
          <el-option label="设备组" value="deviceGroup" />
        </el-select>
        <el-input
          v-model="workLocationCode"
          size="small"
          class="search-role"
          placeholder="请输入工位/库位"
          @keyup.enter.native="handleGetDeviceGroupList"
        />
        <el-button
          type="primary"
          size="mini"
          @click="handleSearch"
        >
          搜索
        </el-button>
        <el-button
          v-permission-key="btnPermission.addGroup"
          type="primary"
          size="small"
          @click="handleAddDeviceGroup"
        >
          新增
        </el-button>
      </div>
      <div class="device-group">
        <device-group-tag
          :btn-permission="btnPermission"
          :device-group="deviceGroupList"
          @editDeviceGroup="handleGetDeviceGroupDetail"
          @deleteDeviceGroup="handleDeleteDeviceGroup"
          @clickDeviceGroup="showEditDeviceGroup"
        />
        <div v-if="deviceGroupList.length===0" class="no-data">暂无数据</div>
      </div>

      <!--  分页  -->
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="currentPage"
        :limit.sync="size"
        @pagination="handleGetDeviceGroupList"
      />

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
        <plk-form
          ref="zrf"
          :options="formDialog.options"
          :option-value="formDialog.optionValue"
          :cp-file-list="cpFileList"
        />
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

    <!-- 编辑页面 -->
    <device-group-unit-list
      v-else
      :curr-device-group="currDeviceGroup"
      :btn-permission="btnPermission"
      @quit="editDeviceGroup= false"
    />
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import Pagination from '@/components/Pagination'
import plkForm from '@/components/Form'
import PLKFormFunction from '@/components/Form/FormFunction'
import DeviceGroupUnitList from './components/DeviceGroupUnitList'
import { validIp } from '@/utils/formRules'
import { getToken } from '@/utils/auth'
import {
  getDeviceGroupList,
  postDeviceGroup,
  getDepartment,
  getWorkLocation,
  getDeviceGroupDetail,
  putDeviceGroup,
  deleteDeviceGroup,
  getDeviceType
} from '@/api/device/deviceGroup'
import DeviceGroupTag from './components/DeviceGroupTag'
import btnPermission from './btnPermission'

export default {
  name: 'Index',

  components: {
    DeviceGroupTag,
    Pagination,
    plkForm,
    DeviceGroupUnitList
  },

  mixins: [PLKFormFunction],

  data() {
    return {
      belongDepartment: '',
      groupName: '',
      type: '',
      workLocationCode: '',
      currentPage: 1, // 当前页
      size: 30, // 每页显示多少条
      total: 1, // 总数
      deviceGroupList: [], // 设备组列表
      formOptions: {},
      editDeviceGroup: false, // 编辑设备组页面
      currDeviceGroup: {},
      cpFileList: []
    }
  },

  computed: {
    btnPermission() {
      return btnPermission
    }
  },

  mounted() {
    this.handleGetDeviceGroupList()
    this.initForm()
  },

  methods: {
    // 初始化form表单选项
    async initForm() {
      const deparmentList = await this.handleGetDeparmentList()
      const workLocationList = await this.handleGetWorkLocationList()
      const typeList = await this.handleGetDeviceType()
      this.formOptions = {
        groupCode: {
          label: '设备组编号',
          rules: [
            { required: true, message: '请输入设备组编号', trigger: 'blur' }
          ]
        },
        groupName: {
          label: '设备组名称',
          rules: [
            { required: true, message: '请输入设备组名称', trigger: 'blur' }
          ]
        },
        belongDepartment: {
          label: '所属部门',
          type: 'selectObj',
          selectItems: deparmentList,
          rules: [
            { required: true, message: '请选择所属部门', trigger: 'change' }
          ]
        },
        type: {
          label: '设备类型',
          type: 'selectObj',
          selectItems: typeList,
          rules: [
            { required: true, message: '请选择设备类型', trigger: 'change' }
          ]
        },
        workLocation: {
          label: '工位',
          type: 'selectObj',
          selectItems: workLocationList,
          rules: [
            { required: true, message: '请选择工位', trigger: 'change' }
          ]
        },
        ip: {
          label: 'IP地址',
          rules: [
            { message: '请输入IP地址', trigger: 'change', validator: validIp }
          ]
        },
        remark: {
          label: '备注'
        },
        fileList: {
          label: '附件',
          type: 'file',
          headers: {
            authorization: getToken()
          }
        }
      }
    },

    // 获取设备组列表
    handleGetDeviceGroupList() {
      const data = {
        belongDepartment: this.belongDepartment,
        groupName: this.groupName,
        type: this.type,
        workLocationCode: this.workLocationCode,
        current: this.currentPage,
        size: this.size
      }
      getDeviceGroupList(data).then(res => {
        if (res.code === '200') {
          this.deviceGroupList = res.data.list
          this.total = Number(res.data.total)
        }
      })
    },

    // 搜索
    handleSearch() {
      this.currentPage = 1
      this.handleGetDeviceGroupList()
    },

    // 添加设备组
    handleAddDeviceGroup() {
      this.handleGetDeviceType()
      this.cpFileList = []
      this.formDialog = {
        show: true,
        title: '新增设备组',
        optionValue: {
          belongDepartment: '',
          groupCode: '',
          groupName: '',
          ip: '',
          remark: '',
          type: '',
          workLocation: '',
          fileList: []
        },
        options: this.formOptions,
        submit: this.handlePostDeviceGroup
      }
    },

    // 获取部门列表
    async handleGetDeparmentList() {
      const deparment = await getDepartment()
      return deparment.data.map(item => ({
        ...item,
        label: item.departmentName,
        value: item.departmentId
      }))
    },

    // 获取工位
    async handleGetWorkLocationList() {
      const workLocation = await getWorkLocation()
      return workLocation.data.map(item => ({
        ...item,
        label: item.storageLocationCode,
        value: item.storageLocationId
      }))
    },

    // 获取类型列表
    async handleGetDeviceType() {
      const typeList = await getDeviceType()
      return typeList.data.map(item => ({
        ...item,
        label: item.typeName,
        value: item.typeId
      }))
    },

    // 提交设备组
    handlePostDeviceGroup({ groupCode, groupName, ip, remark, ...val }) {
      const fileList = cloneDeep(val.fileList)
      const arr = []
      fileList.map(item => {
        arr.push({
          fileName: item.name,
          path: item.response.data.path
        })
      })
      const data = {
        groupCode,
        groupName,
        ip,
        remark,
        fileList: arr,
        typeId: val.type.typeId,
        typeName: val.type.typeName,
        belongDepartmentId: val.belongDepartment.departmentId,
        belongDepartment: val.belongDepartment.departmentName,
        workLocationId: val.workLocation.value,
        workLocationCode: val.workLocation.label
      }
      postDeviceGroup(data).then(res => {
        if (res.code === '200') {
          this.formDialog.show = false
          this.$message.success(res.message)
          this.handleGetDeviceGroupList()
        }
      })
    },

    // 获取设备组详情
    handleGetDeviceGroupDetail(item) {
      this.cpFileList = []
      getDeviceGroupDetail(item).then(res => {
        if (res.code === '200') {
          if (res.data.fileList) {
            this.cpFileList = res.data.fileList.map(item => {
              return { name: item.fileName, url: item.path }
            })
          }
          this.formDialog = {
            show: true,
            title: `修改设备组：${res.data.groupName}`,
            optionValue: {
              fileList: [],
              groupId: res.data.groupId,
              groupCode: res.data.groupCode,
              groupName: res.data.groupName,
              ip: res.data.ip,
              remark: res.data.remark,
              type: { label: res.data.typeName, value: res.data.typeId },
              belongDepartment: { label: res.data.belongDepartment, value: res.data.belongDepartmentId },
              workLocation: { label: res.data.workLocationCode, value: res.data.workLocationId }
            },
            options: this.formOptions,
            submit: this.handleputDeviceGroup
          }
          console.log(this.formDialog)
        }
      })
    },

    // 提交修改设备组
    handleputDeviceGroup({ groupCode, groupName, ip, remark, ...val }) {
      console.log(val)
      const data = {
        groupCode,
        groupName,
        ip,
        remark,
        groupId: val.groupId,
        typeId: val.type.value,
        typeName: val.type.label,
        belongDepartmentId: val.belongDepartment.value,
        belongDepartment: val.belongDepartment.label,
        workLocationId: val.workLocation.value,
        workLocationCode: val.workLocation.label
      }
      putDeviceGroup(data).then(res => {
        if (res.code === '200') {
          this.$message.success(res.message)
          this.formDialog.show = false
          this.handleGetDeviceGroupList()
        }
      })
    },

    // 删除
    handleDeleteDeviceGroup(item) {
      this.$confirm(`确定删除${item.groupName}吗？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDeviceGroup(item).then(res => {
          if (res.code === '200') {
            this.$message.success(res.message)
            this.handleGetDeviceGroupList()
          }
        })
      })
    },

    // 显示编辑设备组
    showEditDeviceGroup(item) {
      this.currDeviceGroup = item
      this.editDeviceGroup = true
    }
  }
}
</script>

<style lang="scss" scoped>
.header-btn {
  display: flex;
  margin-bottom: 16px;
  padding: 16px 8px;
  background-color: #fff;

  .search-role {
    width: 160px;
    margin-right: 10px;
  }
}

.device-group {
  min-height: calc(100vh - 266px);
}

.no-data {
  margin-top: 30vh;
  color: #909399;
  font-size: 14px;
  text-align: center;
}
</style>
