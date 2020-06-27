<template>
  <div class="info">
    <toolbar :toolbar-list="toolbarList" />

    <plk-table
      table-height="calc(100vh - 250px)"
      col-min-width="160px"
      :table-header="tableHeader"
      :table-data="tableData"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :load="handleLoad"
      @selectionChange="handleSelectionChange"
    >
      <template v-slot:btnSlot="row">
        <el-button
          v-if="!row.scope.row.hasOwnProperty('techVersionId')"
          v-permission-key="[btnPermission.editTech]"
          type="primary"
          size="mini"
          @click="handleTableRowEdit(row.scope)"
        >
          编辑工艺
        </el-button>
        <el-button
          v-else
          v-permission-key="[btnPermission.getTechVersionDetail]"
          type="primary"
          size="mini"
          @click="handleTechVersionDetailDisplay(row.scope)"
        >
          查看版本
        </el-button>
        <el-button
          v-permission-key="[btnPermission.delTech, btnPermission.delTechVersion]"
          type="danger"
          size="mini"
          @click="handleTableRowDelete(row.scope)"
        >
          删除
        </el-button>
        <el-button
          v-if="!row.scope.row.hasOwnProperty('techVersionId')"
          v-permission-key="[btnPermission.addTechVersion]"
          type="success"
          size="mini"
          @click="handleTableRowAddSub(row.scope)"
        >
          添加版本
        </el-button>
      </template>
    </plk-table>

    <pagination
      :total="pagination.total"
      :page="pagination.pageNum"
      :limit="pagination.pageSize"
      @pagination="handlePagination"
    />

    <!-- 工艺信息弹框 -->
    <technology-info-dialog
      v-if="technologyInfoDialog"
      v-el-drag-dialog
      :technology-info-dialog="technologyInfoDialog"
      :technology-info-type="technologyInfoType"
      :current-technology-info-data="currentTechnologyInfoData"
      @close="handleTechnologyInfoClose"
    />

    <!-- 工艺信息版本页面 -->
    <technology-writing-page
      v-if="technologyWritingDialog"
      :technology-writing-type="technologyWritingType"
      :current-technology-writing-data="currentTechnologyWritingData"
      @close="handleTechnologyWritingPageClose"
    />

    <!-- 工艺版本查看 -->
    <el-drawer
      :visible.sync="techVersionDetailDialog"
      direction="ltr"
      size="100%"
      destroy-on-close
    >
      <template slot="title">
        <div class="tech-version-detail-header">
          <span class="tech-version-detail-header-title">工艺版本查看</span>
          <div class="tech-version-detail-header-btn-group">
            <el-button
              v-permission-key="[btnPermission.examineTechVersionPassed]"
              :disabled="currentTechVersionDetailData.status !== 'pending'"
              size="mini"
              type="success"
              @click="examineTechVersionPassed"
            >
              审批通过
            </el-button>

            <el-button
              v-permission-key="[btnPermission.examineTechVersionFailure]"
              :disabled="currentTechVersionDetailData.status !== 'pending'"
              size="mini"
              type="danger"
              @click="examineTechVersionFailure"
            >
              审批失败
            </el-button>

            <el-button
              v-permission-key="[btnPermission.examineTechVersionInvalid]"
              :disabled="currentTechVersionDetailData.status !== 'pending'"
              size="mini"
              type="info"
              @click="examineTechVersionInvalid"
            >
              审批作废
            </el-button>
          </div>
        </div>
      </template>
      <tech-version-detail-page :current-tech-version-detail-data="currentTechVersionDetailData" />
    </el-drawer>

    <!-- 工艺草稿 -->
    <el-drawer
      ref="draftPage"
      :visible.sync="techDraftDialog"
      direction="ttb"
      size="100%"
      destroy-on-close
    >
      <template slot="title">
        <span>工艺草稿</span>
      </template>
      <technology-draft-page @handle-draft-loading="handleDraftLoading" />
    </el-drawer>

  </div>
</template>

<script>
import Toolbar from '@/components/Toolbar'
import PlkTable from '@/components/Table'
import Pagination from '@/components/Pagination'
import TechnologyInfoDialog from './components/TechnologyInfoDialog'
import TechnologyWritingPage from './components/TechnologyWritingPage'
import TechVersionDetailPage from './components/TechVersionDetailPage'
import TechnologyDraftPage from './components/TechnologyDraftPage'
import { downloadFile, uploadFile } from '@/utils'
import btnPermission from './btnPermission.js'

import {
  getTechList,
  delTech,
  getTechVersionList,
  getTechVersionDetail,
  delTechVersion,
  exportExcel,
  importExcel,
  exportExcelTemplate,
  examineTechVersionPassed,
  examineTechVersionFailure,
  examineTechVersionInvalid
} from '@/api/technology/info'
export default {
  name: 'Info',

  provide() {
    return {
      techInfo: this
    }
  },

  components: {
    Toolbar,
    PlkTable,
    Pagination,
    TechnologyInfoDialog,
    TechnologyWritingPage,
    TechVersionDetailPage,
    TechnologyDraftPage
  },

  data() {
    return {
      btnPermission,
      toolbarList: [],

      /* table */
      tableHeader: [
        // ------------------------母表------------------------
        { label: '工艺编号', prop: 'techCode' },
        { label: '工艺名称', prop: 'techName' },
        { label: '配方名称', prop: 'bomName' },
        { label: '配方版本', prop: 'bomVersion', width: '80px' },
        { label: '设备组名称', prop: 'groupName' },
        // ------------------------子表------------------------
        // { label: '工艺id', prop: 'techId' },
        // { label: '工艺版本id', prop: 'techVersionId' },
        { label: '工艺版本', prop: 'version' },
        { label: '审批状态', prop: 'statusText', width: '80px' },
        { label: '备注', prop: 'remark' },
        // ------------------------母表------------------------
        // { label: '部门id', prop: 'departmentId' },
        // { label: '配方id', prop: 'bomId' },
        // { label: '设备组id', prop: 'groupId' },
        { label: '工艺类型', prop: 'techType', width: '80px' },
        { label: '最小产量', prop: 'quantityLowLimit', width: '80px' },
        { label: '最大产量', prop: 'quantityUpLimit', width: '80px' },
        { label: '产物单位', prop: 'unit', width: '80px' },
        { label: '操作', type: 'btn', fixed: 'right', width: '300px' }
      ],
      tableData: [],
      tableSelection: [],

      pagination: {
        total: 0,
        pageNum: 0,
        pageSize: 0
      },

      techIdMap: new Map(),

      /* 添加、编辑弹出框 */
      currentTechnologyInfoData: {},
      technologyInfoType: 'add', // add/edit
      technologyInfoDialog: false,

      /* 添加、编辑工艺版本页面 */
      technologyWritingType: 'add',
      technologyWritingDialog: false,
      currentTechnologyWritingData: {
        bomId: '1257574221807423490',
        bomVersionId: '1257574476833689601',
        departmentId: '1248553339188826114',
        groupId: '1257961680382742529',
        hasChildren: null,
        id: '1258270453622136833',
        quantityLowLimit: 100,
        quantityUpLimit: 2000,
        techCode: 'oulaya-a-012',
        techData: '',
        techId: '1258270453622136833',
        techName: '欧莱雅护发精华2',
        techType: '1',
        unit: 'L'
      },

      /* 查看工艺版本 */
      techVersionDetailDialog: false,
      currentTechVersionDetailData: {},

      /* 查看工艺草稿 */
      techDraftDialog: false
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
      this.getTechList()
      this.initToolbar()
    },

    /* 初始化工具栏 */
    initToolbar() {
      this.toolbarList = [
        {
          id: '3',
          type: 'dropdown',
          text: '新增',
          dropdownList: [
            { id: '1', text: '新增', disabled: false, click: this.addTechnologyInfo, btnPermission: this.btnPermission.addTech },
            { id: '2', text: '复制', disabled: true }
          ]
        },
        {
          id: '14',
          type: 'dropdown',
          text: 'Excel',
          divider: true,
          dropdownList: [
            { id: '1', type: 'button', text: '导入', click: this.handleImportExcel, btnPermission: this.btnPermission.importExcel },
            { id: '2', type: 'button', text: '导出', click: this.handleExportExcel, btnPermission: this.btnPermission.exportExcel },
            { id: '3', type: 'button', text: '下载模板', click: this.handleExportExcelTemplate, disabled: true, btnPermission: this.btnPermission.exportExcelTemplate }
          ]
        },
        {
          id: '15',
          type: 'dropdown',
          text: '草稿功能',
          divider: true,
          dropdownList: [
            { id: '1', type: 'button', text: '草稿列表', click: this.handleDisplayDraftPage, btnPermission: this.btnPermission.getDraftList },
            { id: '2', type: 'button', text: '添加草稿', disabled: true }
          ]
        },
        { id: '13', type: 'button', text: '退出', click: this.quit, disabled: true }
      ]
    },

    /* 获取工艺列表 */
    getTechList(params = {}) {
      getTechList(params).then(res => {
        console.log('工艺列表', res)
        const { list, total, pageNum, pageSize } = res.data
        this.tableData = list.map(item => {
          return {
            ...item,
            id: item.techId
          }
        })

        this.pagination.total = Number(total)
        this.pagination.pageNum = Number(pageNum)
        this.pagination.pageSize = Number(pageSize)
      })
    },

    /* 添加工艺信息 */
    addTechnologyInfo() {
      this.technologyInfoType = 'add'
      this.technologyInfoDialog = true
    },

    /* 编辑弹窗 */
    handleTableRowEdit({ row }) {
      this.currentTechnologyInfoData = row
      this.technologyInfoType = 'edit'
      this.technologyInfoDialog = true
    },

    /* 查看工艺版本 */
    handleTechVersionDetailDisplay({ row }) {
      const { techVersionId } = row
      getTechVersionDetail(techVersionId).then(res => {
        for (const item of this.tableData) {
          if (row.techId === item.techId) {
            const statusText = this.$store.getters.status[res.data.status]
            this.currentTechVersionDetailData = Object.assign(res.data, item, { statusText })
            this.techVersionDetailDialog = true
            break
          }
        }
      })
    },

    /* 删除工艺 */
    handleTableRowDelete({ row }) {
      this.$confirm('确认删除吗？', '警告', {
        cancelButtonClass: '取消',
        confirmButtonClass: '确定',
        type: 'warning'
      }).then(() => {
        return row.hasOwnProperty('techVersionId') ? this.handleDeleteTechVersion(row) : this.handleDeleteTech(row)
      }).then(res => {
        this.$message.success(res.message)
        return this.getSubTableData(row.techId)
      }).then(data => {
        this.techIdMap.get(row.techId).resolve(data)
        // this.init()
      })
    },

    /* 处理删除工艺 */
    handleDeleteTech(row) {
      const techId = row.techId
      return delTech(techId)
    },

    /* 处理删除工艺版本 */
    handleDeleteTechVersion(row) {
      const techVersionId = row.techVersionId
      return delTechVersion(techVersionId)
    },

    /* 添加工艺版本 */
    handleTableRowAddSub({ row }) {
      console.log('row', row)
      this.currentTechnologyWritingData = row
      this.technologyWritingType = 'add'
      this.technologyWritingDialog = true
    },

    /* 处理分页 */
    handlePagination({ page, limit }) {
      console.log(page, limit)
      this.pagination.pageNum = page
      this.pagination.pageSize = limit
      this.getTechList({ current: page, size: limit })
    },

    /* 处理选中框改变 */
    handleSelectionChange(value) {
      this.tableSelection = value
    },

    /* 异步加载子表 */
    handleLoad(tree, treeNode, resolve) {
      const techId = tree.techId
      this.techIdMap.set(techId, { tree, treeNode, resolve })
      this.getSubTableData(techId).then(data => {
        resolve(data)
      })
    },

    /* 获取异步版本数据 */
    getSubTableData(techId) {
      return getTechVersionList(techId).then(res => {
        const data = res.data.map((item, index) => {
          return {
            ...item,
            id: item.techId + (index + 1),
            statusText: this.$store.getters.status[item.status]
          }
        })
        return data
      })
    },

    /* 处理工艺信息弹框关闭 */
    handleTechnologyInfoClose() {
      this.technologyInfoDialog = false
      this.init()
    },

    /* 处理工艺版本编写页面关闭 */
    handleTechnologyWritingPageClose(techId) {
      this.technologyWritingDialog = false
      this.getSubTableData(techId).then(data => {
        this.techIdMap.get(techId).resolve(data)
        // this.init()
      })
    },

    /* 处理excel导入 */
    handleImportExcel() {
      if (this.tableSelection.length !== 1 || this.tableSelection[0].hasOwnProperty('techVersionId')) {
        this.$message.error('请选择导入的工艺(单选)')
        return
      }

      uploadFile(importExcel, this.tableSelection[0]).then(res => {
        this.$message.success(res.message)
        this.getSubTableData(this.tableSelection[0].techId).then(data => {
          this.techIdMap.get(this.tableSelection[0].techId).resolve(data)
        })
      })
    },

    /* 处理excel导出 */
    handleExportExcel() {
      if (this.tableSelection.length !== 1 || !this.tableSelection[0].hasOwnProperty('techVersionId')) {
        this.$message.error('请选择导出的工艺版本（单选）')
        return
      }

      // const techVersionIdList = this.tableSelection.filter(element => {
      //   return element.hasOwnProperty('techVersionId')
      // }).map(element => {
      //   return element.techVersionId
      // })

      exportExcel(this.tableSelection[0].techVersionId).then(res => {
        const fileName = decodeURI(res.headers['content-disposition']).split('=')[1]
        downloadFile(res.data, fileName)
      })
    },

    /* 处理excel导出模板 */
    handleExportExcelTemplate() {
      exportExcelTemplate().then(res => {
        const fileName = decodeURI(res.headers['content-disposition']).split('=')[1]
        downloadFile(res.data, fileName)
      })
    },

    // -----------------------------草稿-----------------------------
    /* 获取草稿 */
    handleDisplayDraftPage() {
      this.techDraftDialog = true
    },

    /* 加载草稿 */
    handleDraftLoading(data) {
      this.handleDraftPageClose()
      this.currentTechnologyWritingData = data
      this.technologyWritingType = 'add'
      this.technologyWritingDialog = true
    },

    /* 关闭草稿 */
    handleDraftPageClose() {
      this.$refs.draftPage.closeDrawer()
    },

    // -----------------------------审批-----------------------------
    /* 审批通过 */
    examineTechVersionPassed() {
      const { techVersionId } = this.currentTechVersionDetailData
      examineTechVersionPassed(techVersionId).then(res => {
        this.$message.success(res.message)
        this.refreshTechVersionDetail()
      })
    },

    /* 审批失败 */
    examineTechVersionFailure() {
      const { techVersionId } = this.currentTechVersionDetailData
      examineTechVersionFailure(techVersionId).then(res => {
        this.$message.success(res.message)
        this.refreshTechVersionDetail()
      })
    },

    /* 审批作废 */
    examineTechVersionInvalid() {
      const { techVersionId } = this.currentTechVersionDetailData
      examineTechVersionInvalid(techVersionId).then(res => {
        this.$message.success(res.message)
        this.refreshTechVersionDetail()
      })
    },

    /* 审批后刷新工艺详情 */
    refreshTechVersionDetail() {
      const { techVersionId, techId } = this.currentTechVersionDetailData
      getTechVersionDetail(techVersionId).then(res => {
        for (const item of this.tableData) {
          if (techId === item.techId) {
            const statusText = this.$store.getters.status[res.data.status]
            this.currentTechVersionDetailData = Object.assign(res.data, item, { statusText })
            break
          }
        }
      })
      this.getSubTableData(techId).then(data => {
        this.techIdMap.get(techId).resolve(data)
        // this.init()
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.info {
  .tech-version-detail-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
  }
}
</style>
