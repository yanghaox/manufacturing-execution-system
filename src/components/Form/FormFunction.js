export default {
  data() {
    return {
      formDialog: {
        show: false,
        title: '',
        options: {},
        optionValue: {},
        rolling: Function,
        submit: Function
      }
    }
  },
  methods: {
    handleCloseDialog() {
      this.formDialog.show = false
      setTimeout(() => {
        this.formDialog = {
          show: false,
          title: '',
          options: {},
          optionValue: {},
          rolling: Function
        }
      }, 200)
    },

    handleSubmitFormDialog() {
      this.$refs.jrf.handleCheckData() && this.formDialog.submit(this.$refs.jrf.handleGetFormData())
      return true
    }
  }
}
