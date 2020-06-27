<template>
  <div class="bom-product-dialog">
    <el-dialog title="添加成品BOM" width="480px" :visible.sync="visible" :close-on-click-modal="false">
      <plk-form ref="bomForm" :option-value="bomForm" :options="bomFormItems" label-width="120px" />
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleBomFormClose">取 消</el-button>
        <el-button type="primary" size="small" @click="handleBomFormCommit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const TYPE = {
  ADD: 'add',
  EDIT: 'edit'
}
import PlkForm from '@/components/Form'
import {
  addBomProduct,
  editBomProduct
} from '@/api/formula/bomProduct.js'
export default {
  name: 'BomProductDialog',
  components: { PlkForm },
  props: {
    bomDialog: {
      type: Boolean,
      required: true
    },
    bomType: {
      type: String,
      required: true,
      validator: function(value) {
        return Object.values(TYPE).includes(value)
      }
    },
    currentBomData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      bomForm: {
        bomName: '',
        groupCode: ''
      },
      bomFormItems: {
        bomName: { type: 'text', label: '配方名称', rules: [
          { required: true, message: '请输入配方名称', trigger: 'blur' }
        ] },
        groupCode: { type: 'text', label: '配方族群编码', rules: [
          { required: true, message: '请输入配方族群编码', trigger: 'blur' }
        ] }
      }
    }
  },
  computed: {
    visible: {
      get() {
        return this.bomDialog
      },
      set(value) {
        if (!value) {
          this.handleBomFormClose()
        }
      }
    }
  },
  mounted() {
    if (this.bomType === TYPE.EDIT) {
      const { bomName, groupCode } = this.currentBomData
      this.bomForm = { bomName, groupCode }
    }
  },
  methods: {
    // 提交表单
    handleBomFormCommit() {
      if (!this.$refs.bomForm.handleCheckData()) return
      const data = this.bomForm
      if (this.bomType === TYPE.ADD) {
        addBomProduct(data).then(res => {
          this.$message.success(res.message)
          this.handleBomFormClose()
        })
      }

      if (this.bomType === TYPE.EDIT) {
        const id = this.currentBomData.bomId
        editBomProduct(data, id).then(res => {
          this.$message.success(res.message)
          this.handleBomFormClose()
        })
      }
    },

    // 取消
    handleBomFormClose() {
      this.$emit('closeDialog')
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
