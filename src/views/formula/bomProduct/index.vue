<template>
  <div class="bom-product">
    <toolbar :toolbar-list="toolbarList" />
    <plk-table
      row-key="id"
      col-min-width="160px"
      :table-header="bomProductHeader"
      :table-data="bomProductData"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :load="handleLoadBomProductVersion"
      @selectionChange="handleSelectionChange"
    >
      <template v-slot:btnSlot="row">
        <el-button
          v-permission-key="[btnPermission.editBomProduct, btnPermission.editBomProductVersion]"
          type="primary"
          size="mini"
          @click="editBomProduct(row.scope)"
        >
          编辑
        </el-button>
        <el-button
          v-permission-key="[btnPermission.deleteBomProduct, btnPermission.deleteBomProductVersion]"
          type="danger"
          size="mini"
          @click="deleteBomProduct(row.scope)"
        >
          删除
        </el-button>
        <el-button
          v-if="!row.scope.row.hasOwnProperty('bomVersionId')"
          v-permission-key="btnPermission.addBomProductVersion"
          type="success"
          size="mini"
          @click="addBomProductVersion(row.scope)"
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

    <!-- 成品BOM -->
    <bom-product-dialog
      v-if="bomDialog"
      v-el-drag-dialog
      :bom-dialog="bomDialog"
      :current-bom-data="currentBomData"
      :bom-type="bomType"
      @closeDialog="handleBomProductClose"
    />

    <!-- 成品BOM版本 -->
    <bom-product-version-dialog
      v-if="bomVersionDialog"
      v-el-drag-dialog
      :bom-version-dialog="bomVersionDialog"
      :current-bom-version-data="currentBomVersionData"
      :bom-version-type="bomVersionType"
      @closeDialog="handleBomProductVersionClose"
    />
  </div>
</template>

<script>
import btnPermission from './btnPermission.js'
import Toolbar from '@/components/Toolbar'
import {
  getBomProductList,
  deleteBomProductVersion,
  getBomProductVersion,
  deleteBomProduct
} from '@/api/formula/bomProduct.js'
import PlkTable from '@/components/Table'
import Pagination from '@/components/Pagination'
import BomProductDialog from './components/BomProductDialog'
import BomProductVersionDialog from './components/BomProductVersionDialog'
export default {
  name: 'BomProduct',
  components: { Toolbar, PlkTable, Pagination, BomProductDialog, BomProductVersionDialog },
  data() {
    return {
      btnPermission,
      bomProductHeader: [],
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
      bomProductData: [],
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
      this.bomProductHeader = res
      this.initToolbar()
      this.getBomProductList()
    },

    /* 初始化工具栏 */
    initToolbar() {
      this.toolbarList = [
        {
          id: '3',
          type: 'dropdown',
          text: '新增',
          dropdownList: [
            { id: '1', text: '新增', disabled: false, click: this.addBomProduct, btnPermission: this.btnPermission.addBomProduct },
            { id: '2', text: '复制', disabled: true }
          ]
        },
        { id: '4', type: 'button', text: '删除', click: this.deleteBomProductVersion }
      ]
    },

    // 获取成品BOM列表
    getBomProductList(params = {}) {
      getBomProductList(params).then(res => {
        const { list, total, pageNum, pageSize } = res.data
        this.bomProductData = list.map((item, index) => {
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

    // 添加成品BOM
    addBomProduct() {
      this.bomType = 'add'
      this.bomDialog = true
    },

    // 处理选中框改变
    handleSelectionChange(value) {
      console.log(value)
      this.materialSelection = value
    },

    // 异步加载Bom版本
    handleLoadBomProductVersion(tree, treeNode, resolve) {
      const bomId = tree.bomId
      this.bomIdMap.set(bomId, { tree, treeNode, resolve })
      this.getBomProductVersion(bomId).then(data => {
        resolve(data)
      })
    },

    // 获取异步Bom版本数据
    getBomProductVersion(bomId) {
      return getBomProductVersion(bomId).then(res => {
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
    addBomProductVersion({ row }) {
      console.log('add', row)
      this.bomVersionType = 'add'
      this.currentBomVersionData = row
      this.bomVersionDialog = true
    },

    // 删除成品BOM版本
    deleteBomProduct({ row }) {
      this.$confirm('确认删除吗？', '警告', {
        cancelButtonClass: '取消',
        confirmButtonClass: '确定',
        type: 'warning'
      }).then(() => {
        if (row.hasOwnProperty('bomVersionId')) {
          return deleteBomProductVersion(row.bomVersionId)
        } else {
          return deleteBomProduct(row.bomId)
        }
      }).then(res => {
        this.$message.success(res.message)
        return this.getBomProductVersion(row.bomId)
      }).then(data => {
        console.log('data', data)
        this.bomIdMap.get(row.bomId).resolve(data)
        this.init()
      })
    },

    // 编辑物料Bom和BomVersion
    editBomProduct({ row }) {
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

    // 处理成品BOM弹窗关闭
    handleBomProductClose() {
      this.bomDialog = false
      this.init()
    },

    // 处理成品BOM版本弹窗关闭
    handleBomProductVersionClose(bomId) {
      this.bomVersionDialog = false
      if (bomId !== undefined && this.bomIdMap.has(bomId)) {
        this.getBomProductVersion(bomId).then(data => {
          this.bomIdMap.get(bomId).resolve(data)
        })
      }
    },

    // 处理分页
    handlePagination({ page, limit }) {
      console.log(page, limit)
      this.pagination.pageNum = page
      this.pagination.pageSize = limit
      this.getBomProductList({ current: page, size: limit })
    }
  }
}
</script>
<style lang='scss' scoped>
.bom-product {
  .el-table {
    height: calc(100vh - 250px)!important;
  }
}
</style>
