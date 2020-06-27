export default {
  data() {
    return {
      currentPage: 1,
      pageSizes: [10, 20, 30, 40],
      size: 30,
      total: 0
    }
  },
  methods: {
    // 处理分页操作
    handlePaginationChange(val) {
      this.currentPage = val.page
      this.size = val.limit
      this.refreshPagination()
    },

    // 更新每页条数
    updateLimit(val) {
      this.size = val
      this.refreshPagination()
    },

    // 更新当前页
    updatePage(val) {
      this.currentPage = val
      this.refreshPagination()
    }
  }
}
