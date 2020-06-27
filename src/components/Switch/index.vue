<template>
  <el-switch
    v-model="row[isEnabled]"
    class="switchStyle"
    :active-text="activeText"
    :inactive-text="inactiveText"
    :active-color="activeColor"
    :inactive-color="inactiveColor"
    @change="handleChangeState"
  />
</template>

<script>
export default {
  name: 'Index',
  props: {
    isEnabled: {
      type: String,
      default: ''
    },
    row: {
      type: Object,
      default: function() {
        return {}
      }
    },
    activeText: {
      type: String,
      default: '启用'
    },
    inactiveText: {
      type: String,
      default: '禁用'
    },
    activeColor: {
      type: String,
      default: '#248FFF'
    },
    inactiveColor: {
      type: String,
      default: '#999999'
    }
  },
  methods: {
    handleChangeState() {
      this.$emit('changeState', this.row)
    }
  }
}
</script>

<style lang="scss">

.switchStyle .el-switch__label {
  position: absolute;
  display: none;
  color: #fff;
  font-size: 12px;
}

/*打开时文字位置设置*/
.switchStyle .el-switch__label--right {
  z-index: 1;
  left: -19px;
}

/*关闭时文字位置设置*/
.switchStyle .el-switch__label--left {
  z-index: 1;
  left: 10px;
}

/*显示文字*/
.switchStyle .el-switch__label.is-active {
  display: block;
}

.switchStyle.el-switch .el-switch__core,
.el-switch .el-switch__label {
  width: 65px !important;
}
</style>
