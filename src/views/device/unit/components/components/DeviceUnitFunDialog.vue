<template>
  <div class="device-unit-fun-dialog">
    <el-dialog title="设置" width="480px" :visible.sync="visible" :close-on-click-modal="false" append-to-body>
      <device-pipeline-fun :settings-data="settingsData" />
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleFormClose">取 消</el-button>
        <el-button type="primary" size="small" @click="handleFormCommit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import DevicePipelineFun from './components/DevicePipelineFun'
export default {
  name: 'DeviceUnitFunDialog',

  components: { DevicePipelineFun },

  props: {
    deviceUnitFunDialog: {
      type: Boolean,
      required: true
    },
    deviceUnitFunType: {
      type: String,
      required: true
    },
    currentDeviceUnitFunSettingData: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      settingsData: [].concat(this.currentDeviceUnitFunSettingData[this.deviceUnitFunType])
    }
  },

  computed: {
    visible: {
      get() {
        return this.deviceUnitFunDialog
      },
      set(value) {
        if (!value) {
          this.handleFormClose()
        }
      }
    }
  },

  mounted() {
    this.$on('on-fun-settings', (settingsData) => {
      this.settingsData = settingsData
    })
  },

  methods: {
    /* 提交管道*/
    handleFormCommit() {
      this.dispatch('DeviceUnitDialog', 'on-fun-settings', this.settingsData)
      this.handleFormClose()
    },

    // 取消
    handleFormClose() {
      this.$emit('close-dialog')
    },

    /* 触发事件 */
    dispatch(componentName, eventName, params) {
      let parent = this.$parent
      while (parent !== this.$root) {
        if (parent.$options.name === componentName) {
          parent.$emit(eventName, params)
          return
        }
        parent = parent.$parent
      }
    }
  }
}
</script>
<style lang='scss' scoped></style>
