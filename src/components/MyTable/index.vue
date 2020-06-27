<template>
  <div class="my-table">
    <el-table
      :class="{'hidden-pagination': hidden}"
      :data="tableData"
      fit
      border
      highlight-current-row
      style="width: 100%"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
    >
      <slot />
    </el-table>
    <el-pagination
      v-if="!hidden"
      class="pagination-container"
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  name: 'MyTable',
  props: {
    tableData: {
      type: Array,
      required: true
    },
    // 分页组件
    total: {
      type: Number,
      default: 0
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 30
    },
    pageSizes: {
      type: Array,
      default() {
        return [20, 30, 40, 60]
      }
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.page
      },
      set(val) {
        this.$emit('update:page', val)
      }
    },
    pageSize: {
      get() {
        return this.limit
      },
      set(val) {
        this.$emit('update:limit', val)
      }
    }
  },
  methods: {
    handleSelectionChange(value) {
      this.$emit('selection-change', value)
    },
    handleRowClick(row, column, event) {
      this.$emit('row-click', row, column, event)
    },
    handleSizeChange(val) {
      this.$emit('pagination', { page: this.currentPage, limit: val })
    },
    handleCurrentChange(val) {
      this.$emit('pagination', { page: val, limit: this.pageSize })
    }
  }
}
</script>
<style lang="scss" scoped>
.my-table {
  height: 100%;
  .el-table {
    height: calc(100% - 72px);
    /deep/ .el-table__body-wrapper {
      height: calc(100% - 44px);
      overflow: hidden;
      overflow-y: auto;
    }
  }
  .hidden-pagination {
    height: 100%;
  }
  .pagination-container {
    margin: 20px auto;
    text-align: center;
  }
}
</style>
