<template>
  <div class="bom-wip">
    <toolbar :toolbar-list="toolbarList" />
    <plk-table
      row-key="id"
      col-min-width="160px"
      :table-header="bomWipHeader"
      :table-data="bomWipData"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :load="handleLoadBomWipVersion"
      @selectionChange="handleSelectionChange"
    >
      <template v-slot:btnSlot="row">
        <el-button
          v-permission-key="[btnPermission.editBomWip, btnPermission.editBomWipVersion]"
          type="primary"
          size="mini"
          @click="editBomWip(row.scope)"
        >
          编辑
        </el-button>
        <el-button
          v-permission-key="[btnPermission.deleteBomWip, btnPermission.deleteBomWipVersion]"
          type="danger"
          size="mini"
          @click="deleteBomWip(row.scope)"
        >
          删除
        </el-button>
        <el-button
          v-if="!row.scope.row.hasOwnProperty('bomVersionId')"
          v-permission-key="btnPermission.addBomWipVersion"
          type="success"
          size="mini"
          @click="addBomWipVersion(row.scope)"
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

    <!-- 半成品BOM -->
    <bom-wip-dialog
      v-if="bomDialog"
      v-el-drag-dialog
      :bom-dialog="bomDialog"
      :current-bom-data="currentBomData"
      :bom-type="bomType"
      @closeDialog="handleBomWipClose"
    />

    <!-- 半成品BOM版本 -->
    <bom-wip-version-dialog
      v-if="bomVersionDialog"
      v-el-drag-dialog
      :bom-version-dialog="bomVersionDialog"
      :current-bom-version-data="currentBomVersionData"
      :bom-version-type="bomVersionType"
      @closeDialog="handleBomWipVersionClose"
    />
  </div>
</template>

<script>
import btnPermission from './btnPermission.js'
import Toolbar from '@/components/Toolbar'
import {
  getBomWipList,
  deleteBomWipVersion,
  getBomWipVersion,
  deleteBomWip
} from '@/api/formula/bomWip.js'
import PlkTable from '@/components/Table'
import Pagination from '@/components/Pagination'
import BomWipDialog from './components/BomWipDialog'
import BomWipVersionDialog from './components/BomWipVersionDialog'
export default {
  name: 'BomWip',
  components: { Toolbar, PlkTable, Pagination, BomWipDialog, BomWipVersionDialog },
  data() {
    return {
      btnPermission,
      bomWipHeader: [],
      parentHeader: [
        { label: '序号', prop: 'index', width: '80px' },
        // { label: '配方id', prop: 'bomId' },
        { label: '配方名称', prop: 'bomName' },
        // { label: '创建人id', prop: 'createdId' },
        { label: '创建时间', prop: 'createdTime' },
        // { label: '删除人id', prop: 'deletedId' },
        // { label: '删除时间', prop: 'deletedTime' },
        // { label: '部门id', prop: 'departmentId' },
        { label: '域空间', prop: 'domain', width: '80px' },
        { label: '配方族群编码', prop: 'groupCode' },
        // { label: '是否删除', prop: 'isDeleted' },
        // { label: '组织id', prop: 'organizationId' },
        // { label: '类型', prop: 'type' },
        // { label: '更新人id', prop: 'updatedId' },
        { label: '更新时间', prop: 'updatedTime' }
      ],
      childHeader: [
        { label: '版本', prop: 'version', width: '80px' },
        // { label: '比例', prop: 'proportion', width: '80px' },
        // { label: '配方id', prop: 'bomId' },
        // { label: '配方版本id', prop: 'bomVersionId' },
        // { label: '配方版本名称', prop: 'bomVersionName' },
        // { label: '创建人id', prop: 'createdId' },
        { label: '创建时间', prop: 'createdTime' },
        // { label: '删除人id', prop: 'deletedId' },
        // { label: '删除时间', prop: 'deletedTime' },
        // { label: '部门id', prop: 'departmentId' },
        { label: '域空间', prop: 'domain', width: '80px' },
        { label: '配方族群编码', prop: 'groupCode' },
        // { label: '是否删除', prop: 'isDeleted' },
        // { label: '物料编码', prop: 'materialCode' },
        // { label: '物料id', prop: 'materialId' },
        // { label: '物料名称', prop: 'materialName' },
        // { label: '组织id', prop: 'organizationId' },
        // { label: '单位(%)', prop: 'unit', width: '80px' },
        // { label: '更新人id', prop: 'updatedId' },
        { label: '更新时间', prop: 'updatedTime' },
        { label: '操作', type: 'btn', fixed: 'right', width: '300px' }
      ],
      bomWipData: [],
      pagination: {
        total: 0,
        pageNum: 0,
        pageSize: 0
      },
      toolbarList: [],
      materialSelection: [],

      // 物料BOM弹出框
      currentBomData: {},
      bomDialog: false,
      bomType: '', // add/edit

      // 物料BOM弹出框
      currentBomVersionData: {},
      bomVersionDialog: false,
      bomVersionType: '', // add/edit

      bomIdMap: new Map()
    }
  },
  activated() { this.init() },
  mounted() { this.init() },
  methods: {
    init() {
      const res = []
      const set = new Set()
      for (const col of [...this.parentHeader, ...this.childHeader]) {
        if (!set.has(col.prop)) {
          set.add(col.prop)
          res.push(col)
        }
      }
      this.bomWipHeader = res
      this.initToolbar()
      this.getBomWipList()
    },

    /* 初始化工具栏 */
    initToolbar() {
      this.toolbarList = [
        {
          id: '3',
          type: 'dropdown',
          text: '新增',
          dropdownList: [
            { id: '1', text: '新增', disabled: false, click: this.addBomWip, btnPermission: this.btnPermission.addBomWip },
            { id: '2', text: '复制', disabled: true }
          ]
        },
        { id: '4', type: 'button', text: '删除', click: this.deleteBomWipVersion }
      ]
    },

    // 获取半成品BOM列表
    getBomWipList(params = {}) {
      getBomWipList(params).then(res => {
        const { list, total, pageNum, pageSize } = res.data
        this.bomWipData = list.map((item, index) => {
          return {
            ...item,
            index: index + 1,
            hasChildren: true,
            id: item.bomId
          }
        })
        this.pagination.total = Number(total)
        this.pagination.pageNum = Number(pageNum)
        this.pagination.pageSize = Number(pageSize)
      })
    },

    // 添加半成品BOM
    addBomWip() {
      this.bomType = 'add'
      this.bomDialog = true
    },

    // 处理选中框改变
    handleSelectionChange(value) {
      console.log(value)
      this.materialSelection = value
    },

    // 异步加载Bom版本
    handleLoadBomWipVersion(tree, treeNode, resolve) {
      const bomId = tree.bomId
      this.bomIdMap.set(bomId, { tree, treeNode, resolve })
      this.getBomWipVersion(bomId).then(data => {
        resolve(data)
      })
    },

    // 获取异步Bom版本数据
    getBomWipVersion(bomId) {
      return getBomWipVersion(bomId).then(res => {
        const data = res.data.map((item, index) => {
          return {
            ...item,
            id: item.bomId + (index + 1)
          }
        })
        return data
      })
    },

    // 添加物料BomVersion
    addBomWipVersion({ row }) {
      console.log('add', row)
      this.bomVersionType = 'add'
      this.currentBomVersionData = row
      this.bomVersionDialog = true
    },

    // 删除半成品BOM版本
    deleteBomWip({ row }) {
      this.$confirm('确认删除吗？', '警告', {
        cancelButtonClass: '取消',
        confirmButtonClass: '确定',
        type: 'warning'
      }).then(() => {
        if (row.hasOwnProperty('bomVersionId')) {
          return deleteBomWipVersion(row.bomVersionId)
        } else {
          return deleteBomWip(row.bomId)
        }
      }).then(res => {
        this.$message.success(res.message)
        return this.getBomWipVersion(row.bomId)
      }).then(data => {
        console.log('data', data)
        this.bomIdMap.get(row.bomId).resolve(data)
        this.init()
      })
    },

    // 编辑物料Bom和BomVersion
    editBomWip({ row }) {
      console.log('edit', row)
      if (row.hasOwnProperty('bomVersionId')) {
        this.bomVersionType = 'edit'
        this.currentBomVersionData = row
        this.bomVersionDialog = true
      } else {
        this.bomType = 'edit'
        this.currentBomData = row
        this.bomDialog = true
      }
    },

    // 处理半成品BOM弹窗关闭
    handleBomWipClose() {
      this.bomDialog = false
      this.init()
    },

    // 处理半成品BOM版本弹窗关闭
    handleBomWipVersionClose(bomId) {
      this.bomVersionDialog = false
      if (bomId !== undefined && this.bomIdMap.has(bomId)) {
        this.getBomWipVersion(bomId).then(data => {
          this.bomIdMap.get(bomId).resolve(data)
        })
      }
    },

    // 处理分页
    handlePagination({ page, limit }) {
      console.log(page, limit)
      this.pagination.pageNum = page
      this.pagination.pageSize = limit
      this.getBomWipList({ current: page, size: limit })
    }
  }
}
</script>
<style lang='scss' scoped>
.bom-wip {
  .el-table {
    height: calc(100vh - 250px)!important;
  }
}
</style>
