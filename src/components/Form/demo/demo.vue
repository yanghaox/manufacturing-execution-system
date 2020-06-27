<template>
  <div>
    <el-button type="primary" @click="handleShow">添加</el-button>
    <el-dialog :visible.sync="formDialog.show" title="添加">
      <plk-form
        ref="jrf"
        :options="formDialog.options"
        :option-value="formDialog.optionValue"
        @checkTree="handleCheckTree"
        @rolling="formDialog.rolling"
      >
        <template slot="formSlot">
          测试测试
        </template>
      </plk-form>
      <div style="text-align: right">
        <el-button @click="handleCloseDialog">取消</el-button>
        <el-button type="primary" @click="$refs.jrf.handleCheckData() && handleSubmit($refs.jrf.handleGetFormData())">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import plkForm from '../index'
import PLKFormFunction from '../PLKFormFunction'

const checkAge = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('内容不能为空'))
  } else if (value.length < 6) {
    return callback(new Error('内容长度不能小于六个字符'))
  } else {
    callback()
  }
}

export default {
  components: { plkForm },

  mixins: [PLKFormFunction],

  methods: {
    handleShow() {
      const formDialog = {
        optionValue: {
          selectObj: { label: '222', value: '2' },
          plan: '计划。。。',
          location: '',
          food: '',
          mark: '',
          isUse: '',
          date: '',
          dateTime: ''
        },
        options: {
          selectObj: {
            label: '选择多个',
            type: 'selectObj',
            selectItems: [
              { label: '111', value: '1', id: '1', ceshi: 'ceshi11' },
              { label: '222', value: '2', id: '2', ceshi: 'ceshi22' },
              { label: '333', value: '3', id: '3', ceshi: 'ceshi33' }
            ]
          },
          plan: {
            label: '计划',
            type: 'text',
            rolling: true,
            append: 'kg',
            disabled: true,
            rules: [
              { required: true, message: '请输入计划', trigger: 'blur' }
            ]
          },
          title: {
            label: '标题',
            type: 'text',
            rolling: true,
            rules: [
              { required: true, validator: checkAge, trigger: 'blur' }
            ]
          },
          quantity: {
            label: '数量',
            type: 'number',
            rolling: true,
            rules: [
              { required: true, validator: checkAge, trigger: 'blur' }
            ]
          },
          location: {
            label: '活动区域',
            type: 'select',
            rolling: true,
            selectItems: [
              { label: '区域一', value: 1 },
              { label: '区域二', value: 2 }
            ]
          },
          food: {
            label: '食物',
            type: 'multiple',
            rolling: true,
            selectItems: [
              { label: '烤鸭', value: 1 },
              { label: '青菜', value: 2 }
            ]
          },
          mark: {
            label: '备注',
            type: 'textarea',
            rolling: true
          },
          isUse: {
            label: '是否使用',
            type: 'switch',
            rolling: true
          },
          date: {
            label: '日期',
            type: 'date',
            rolling: true
          },
          dateTime: {
            label: '时间',
            type: 'dateTime',
            rolling: true
          }
        },
        submit: this.handlePost,
        rolling: this.rolling
      }
      this.formDialog = { show: true, ...formDialog }
    },
    handlePost(val) {
      console.log(val)
    },
    handleCheckTree(val) {},
    rolling(val1, val2) {
      console.log(val1, val2)
    },
    handleSubmit(val) {
      console.log(val)
    }
  }
}
</script>

<style scoped>

</style>
