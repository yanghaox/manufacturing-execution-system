export default {
  methods: {
    /* 校验当前比例不能为空 */
    handleCurrentProportionNotEmptyCheck() {
      if (!/^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/.test(this.cacheCurrentProportion)) {
        const h = this.$createElement
        this.$notify.error({
          title: '提示',
          message: h('span', { style: 'color: red' }, '请输入正确格式的当前比例'),
          position: 'bottom-right'
        })
        return false
      }
      return true
    },

    /* 校验是否选中管道 */
    handlePipelineIdNotEmpty() {
      if (this.cachePipelineId === '') {
        const h = this.$createElement
        this.$notify.error({
          title: '提示',
          message: h('span', { style: 'color: red' }, '请选择管道'),
          position: 'bottom-right'
        })
        return false
      }
      return true
    },

    /* 校验是否输入分度值 */
    handleScaleNotEmpty() {
      if (!/^[0-9]\.?[0-9]*$/.test(this.cacheScale)) {
        const h = this.$createElement
        this.$notify.error({
          title: '提示',
          message: h('span', { style: 'color: red' }, '请输入分度值'),
          position: 'bottom-right'
        })
        return false
      }
      return true
    }
  }
}
