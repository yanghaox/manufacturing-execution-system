<template>
  <div class="pipeline-dialog">
    <el-dialog
      :title="`${TITLE_MAP.get(pipelineType)}管道`"
      width="480px"
      :visible.sync="visible"
      :close-on-click-modal="false"
    >
      <plk-form ref="form" :option-value="form" :options="formItems" label-width="120px" />
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleFormClose">取 消</el-button>
        <el-button type="primary" size="small" @click="handleFormCommit">确 定</el-button>
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
  addPipeline,
  editPipeline,
  getPipelineMaterial
} from '@/api/device/pipeline.js'

export default {
  name: 'PipelineDialog',
  components: { PlkForm },
  props: {
    pipelineDialog: {
      type: Boolean,
      required: true
    },
    pipelineType: {
      type: String,
      required: true,
      validator: function(value) {
        return Object.values(TYPE).includes(value)
      }
    },
    currentPipelineData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      TITLE_MAP: new Map([['add', '添加'], ['edit', '编辑']]),
      form: {
        materialId: '',
        pipelineCode: '',
        pipelineName: '',
        remark: ''
      },
      formItems: {
        materialId: {
          type: 'select', label: '原料', selectItems: [], rules: [
            { required: true, message: '请输入原料', trigger: 'blur' }
          ]
        },
        pipelineCode: {
          type: 'text', label: '管道编号', rules: [
            { required: true, message: '请输入管道编号', trigger: 'blur' }
          ]
        },
        pipelineName: {
          type: 'text', label: '管道名称', rules: [
            { required: true, message: '请输入管道名称', trigger: 'blur' }
          ]
        },
        remark: {
          type: 'text', label: '备注', rules: [
            { message: '请输入备注', trigger: 'blur' }
          ]
        }
      }

    }
  },
  computed: {
    visible: {
      get() {
        return this.pipelineDialog
      },
      set(value) {
        if (!value) {
          this.handleFormClose()
        }
      }
    }
  },
  mounted() {
    this.init()
    if (this.pipelineType === TYPE.EDIT) {
      const { materialId, pipelineCode, pipelineName, remark } = this.currentPipelineData
      this.form = { materialId, pipelineCode, pipelineName, remark }
    }
  },
  methods: {
    init() {
      this.getPipelineMaterial()
    },

    /* 获取管道物料 */
    getPipelineMaterial() {
      getPipelineMaterial().then(res => {
        this.formItems.materialId.selectItems = res.data.map(item => {
          return {
            value: item.materialId,
            label: `${item.materialCode} - ${item.materialName}`
          }
        })
      })
    },

    /* 提交表单 */
    handleFormCommit() {
      if (!this.$refs.form.handleCheckData()) return
      this[this.pipelineType]()
    },

    /* 添加 */
    add() {
      const data = this.form
      addPipeline(data).then(res => {
        this.$message.success(res.message)
        this.handleFormClose()
      })
    },

    /* 编辑 */
    edit() {
      const data = this.form
      const id = this.currentPipelineData.pipelineId
      editPipeline(data, id).then(res => {
        this.$message.success(res.message)
        this.handleFormClose()
      })
    },

    /* 取消 */
    handleFormClose() {
      this.$emit('close-dialog')
    }
  }
}
</script>
<style lang='scss' scoped>
</style>

