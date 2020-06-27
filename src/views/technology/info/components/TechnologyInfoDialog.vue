<template>
  <div class="technology-info-dialog">
    <el-dialog :title="`${TITLE_MAP.get(technologyInfoType)}工艺`" width="480px" :visible.sync="visible" :close-on-click-modal="false">
      <plk-form
        ref="technologyInfoForm"
        :option-value="technologyInfoForm"
        :options="technologyInfoFormItems"
        label-width="120px"
        @rolling="handleFormRolling"
      />
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
  getBomList,
  getBomVersionList,
  getDepartmentList,
  getDeviceGroupList,
  addTech,
  editTech
} from '@/api/technology/info'
export default {
  name: 'TechnologyInfoDialog',

  components: { PlkForm },

  props: {
    technologyInfoDialog: {
      type: Boolean,
      required: true
    },

    technologyInfoType: {
      type: String,
      required: true,
      validator: function(value) {
        return Object.values(TYPE).includes(value)
      }
    },

    currentTechnologyInfoData: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      TITLE_MAP: new Map([['add', '添加'], ['edit', '编辑']]),
      FORM_COMMIT_TYPE_METHOD_MAP: new Map([['add', 'handleFormAdd'], ['edit', 'handleFormEdit']]),
      FORM_ROLLING_METHOD_MAP: new Map([['bomId', 'handleFormBomIdChange']]),

      technologyInfoForm: {
        bomVersionId: '',
        groupId: '',
        techCode: '',
        techName: '',
        techType: '',
        quantityLowLimit: '',
        quantityUpLimit: '',
        unit: ''
      },
      technologyInfoFormItems: {
        bomId: { type: 'select', label: '配方', selectItems: [], rolling: true, rules: [
          { required: true, message: '请选择配方', trigger: 'blur' }
        ] },
        bomVersionId: { type: 'select', label: '配方版本', disabled: true, selectItems: [], rules: [
          { required: true, message: '请选择配方版本', trigger: 'blur' }
        ] },
        groupId: { type: 'select', label: '设备组', selectItems: [], rules: [
          { required: true, message: '请选择设备组', trigger: 'blur' }
        ] },
        techCode: { type: 'text', label: '工艺编号', rules: [
          { required: true, message: '请输入工艺编号', trigger: 'blur' }
        ] },
        techName: { type: 'text', label: '工艺名称', rules: [
          { required: true, message: '请输入工艺名称', trigger: 'blur' }
        ] },
        techType: { type: 'text', label: '工艺类型', rules: [
          { required: true, message: '请输入工艺名称', trigger: 'blur' }
        ] },
        quantityLowLimit: { type: 'text', label: '最小产量', rules: [
          { required: true, message: '请输入最小产量', trigger: 'blur' }
        ] },
        quantityUpLimit: { type: 'text', label: '最大产量', rules: [
          { required: true, message: '请输入最大产量', trigger: 'blur' }
        ] },
        unit: { type: 'text', label: '产物单位', rules: [
          { required: true, message: '请输入产物单位', trigger: 'blur' }
        ] }
      },

      departmentList: []

    }
  },

  computed: {
    visible: {
      get() {
        return this.technologyInfoDialog
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
    if (this.technologyInfoType === TYPE.EDIT) {
      console.log('currentTechnologyInfoData', this.currentTechnologyInfoData)
      const { bomId, bomVersionId, departmentId, groupId, quantityLowLimit, quantityUpLimit, techCode, techData, techId, techName, techType, unit } = this.currentTechnologyInfoData
      this.technologyInfoForm = { bomId, bomVersionId, groupId, techCode, techName, techType, quantityLowLimit, quantityUpLimit, unit }
      this.technologyInfoFormItems.bomId.disabled = true
      this.technologyInfoFormItems.groupId.disabled = true
      this.getBomVersionList(bomId)
    }
  },

  methods: {
    init() {
      this.getBomList()
      this.getDepartmentList()
      this.getDeviceGroupList()
    },

    /* 获取bom列表 */
    getBomList() {
      getBomList().then(res => {
        this.technologyInfoFormItems.bomId.selectItems = res.data.map(item => {
          const { bomId: value, bomName: label } = item
          return { label, value }
        })
      })
    },

    /* 获取bom版本列表 */
    getBomVersionList(bomId) {
      getBomVersionList(bomId).then(res => {
        this.technologyInfoFormItems.bomVersionId.selectItems = res.data.map(item => {
          const { bomVersionId: value, version: label } = item
          return { label, value }
        })
      })
    },

    /* 获取部门列表 */
    getDepartmentList() {
      getDepartmentList().then(res => {
        this.departmentList = res.data.map(item => {
          const { departmentId: value, departmentName: label } = item
          return { label, value }
        })
      })
    },

    /* 获取设备组列表 */
    getDeviceGroupList() {
      getDeviceGroupList().then(res => {
        this.technologyInfoFormItems.groupId.selectItems = res.data.map(item => {
          const { groupId: value, groupName: label } = item
          return { label, value }
        })
      })
    },

    /* 处理表单选项改变 */
    handleFormRolling(name, optionValue) {
      console.log('name', name)
      console.log('optionValue', optionValue)
      this[this.FORM_ROLLING_METHOD_MAP.get(name)](optionValue)
    },

    /* 处理表单bomId改变 */
    handleFormBomIdChange(optionValue) {
      const { bomId } = optionValue
      this.getBomVersionList(bomId)
      this.technologyInfoFormItems.bomVersionId.disabled = false
      this.technologyInfoForm.bomVersionId = ''
    },

    /* 提交表单 */
    handleFormCommit() {
      this[this.FORM_COMMIT_TYPE_METHOD_MAP.get(this.technologyInfoType)]()
    },

    /* 关闭表单 */
    handleFormClose() {
      this.$emit('close')
    },

    /* 添加工艺 */
    handleFormAdd() {
      if (!this.$refs.technologyInfoForm.handleCheckData()) return

      const data = this.technologyInfoForm
      addTech(data).then(res => {
        this.$message.success(res.message)
        this.handleFormClose()
      })
    },

    /* 编辑工艺 */
    handleFormEdit() {
      if (!this.$refs.technologyInfoForm.handleCheckData()) return

      const data = this.technologyInfoForm
      const techId = this.currentTechnologyInfoData.techId
      editTech(data, techId).then(res => {
        this.$message.success(res.message)
        this.handleFormClose()
      })
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
