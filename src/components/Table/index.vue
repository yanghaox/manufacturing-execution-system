<template>
  <el-table
    ref="table"
    v-loading="loading"
    :cell-class-name="cellClassName"
    :row-class-name="rowClassName"
    :span-method="spanMethod"
    :data="tableData"
    :height="tableHeight"
    :border="tableBorder"
    :row-key="rowKey"
    :tree-props="treeProps"
    :stripe="tableStripe"
    :highlight-current-row="true"
    :default-expand-all="defaultExpandAll"
    lazy
    :load="load"
    style="width: 100%"
    @select="handleSelect"
    @select-all="handleSelectAll"
    @row-click="handleRowClick"
  >
    <el-table-column
      v-if="tableSelection"
      align="center"
      type="selection"
      width="50"
    />

    <el-table-column v-if="serial" type="index" label="序号" width="45" />

    <el-table-column
      v-for="(col, index) in cpTableHeader"
      :key="index"
      :fixed="col.fixed"
      :prop="col.prop"
      :label="col.label"
      :width="col.width"
      :align="col.align || colAlign"
      :min-width="col.minWidth || colMinWidth"
      :sortable="col.sortable"
      :show-overflow-tooltip="tooltip"
    >
      <template slot="header" slot-scope="scope">
        <span>{{ col.label }}</span>
        <slot v-if="col.slotHeader" :name="col.slotHeaderName" :scope="scope" />
      </template>

      <template slot-scope="scope">
        <!--    text      -->
        <span v-if="col.type === 'text' || !col.type">
          {{ scope.row[col.prop] }}
        </span>
        <!--    button      -->
        <slot v-else-if="col.type === 'btn'" name="btnSlot" :scope="scope" />
        <!--     switch     -->
        <slot v-else-if="col.type === 'slot'" :name="col.prop" :scope="scope" />
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'Index',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    tableData: { // 表格显示的数据
      type: Array,
      required: true
    },
    tableHeader: { // 表格头部数据
      type: Array,
      required: true
    },
    tableHeight: { // 表格高度
      type: String,
      default: 'auto'
    },
    tableStripe: { // 斑马纹
      type: Boolean,
      default: true
    },
    tableBorder: { // 表格边框
      type: Boolean,
      default: false
    },
    tableSelection: { // 表格多选
      type: Boolean,
      default: true
    },
    rowKey: { // 树结构的row-key
      type: String,
      default: 'id'
    },
    treeProps: { // 树结构子级
      type: Object,
      default: function() {
        return {}
      }
    },
    tooltip: { // 单元格内容过长显示省略号
      type: Boolean,
      default: true
    },
    colMinWidth: { // 单元格最小宽度
      type: String,
      default: 'auto'
    },
    serial: { // 是否显示序列号
      type: Boolean,
      default: false
    },
    colAlign: { // 单元格对齐方式
      type: String,
      default: ''
    },
    load: { // 异步加载树形表格
      type: Function,
      default: () => {}
    },
    defaultExpandAll: { // 是否默认展开树形表格
      type: Boolean,
      default: false
    },
    cellClassName: { // 自定义列类名
      type: Function,
      default: () => {}
    },
    rowClassName: { // 自定义行类名
      type: Function,
      default: () => {}
    },
    spanMethod: { // 合并单元格内容
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      cpTableHeader: []
    }
  },
  watch: {
    tableHeader: {
      handler(val) {
        this.cpTableHeader = val
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // 勾选数据
    toggleRowSelection(row, selected) {
      this.$refs.table.toggleRowSelection(row, selected)
    },

    // 勾选父级、子级也选择
    handleSelect(selection, row) {
      const rowSelect = selection.length && selection.indexOf(row) !== -1
      if (rowSelect) { // 如果选中状态
        if (row.children && row.children.length > 0) { // 判断是否有子级
          row.children.map(item => { // 先把子级全部设为不选择状态，再设为选择状态
            this.$refs.table.toggleRowSelection(item, false)
            this.$refs.table.toggleRowSelection(item)
          })
        }
      }
      this.handleGetSelection()
    },

    // 全选
    handleSelectAll(selection) {
      this.$refs.table.clearSelection()
      if (selection.length > 0 && selection[0] === this.tableData[0]) {
        this.tableData.map(item => {
          this.$refs.table.toggleRowSelection(item)
          if (item.children && item.children.length > 0) {
            item.children.map(child => {
              this.$refs.table.toggleRowSelection(child)
            })
          }
        })
      }
      this.handleGetSelection()
    },

    // 获取勾选的值
    handleGetSelection() {
      this.$emit('selectionChange', this.$refs.table.selection)
    },

    // 点击行
    handleRowClick(row) {
      this.$emit('rowClick', row)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
