<template>
  <div class="toolbar">
    <template v-for="item of toolbarList">
      <el-dropdown
        v-if="item.type === 'dropdown'"
        :key="item.id"
        trigger="click"
      >
        <span class="el-dropdown-link">
          {{ item.text }}
          <i class="el-icon-arrow-down el-icon--right" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="inner of item.dropdownList"
            :key="inner.id"
            v-permission-key="inner.btnPermission || []"
            :disabled="inner.disabled"
            :divided="inner.divided"
            @click.native="inner.click"
          >{{ inner.text }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-button
        v-if="item.type === 'button'"
        :key="item.id"
        v-permission-key="item.btnPermission || []"
        :class="{'el-button-link': !item.disabled}"
        type="text"
        :disabled="item.disabled"
        @click.native="item.click"
      >{{ item.text }}</el-button>
      <!-- <render-toolbar-item :key="item.id" :item="item" /> -->

      <el-divider v-if="item.divider" :key="item.id" direction="vertical" />
    </template>
  </div>
</template>

<script>
// import RenderToolbarItem from './render.js'
export default {
  name: 'Toolbar',
  // components: { RenderToolbarItem },
  props: {
    toolbarList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      // itemList: [
      //   { id: '1', type: 'button', text: '过滤', disabled: true, btnPermission: this.btnPermission.addBomWipVersion },
      //   { id: '2', type: 'button', text: '刷新', divider: true },
      //   { id: '3', type: 'dropdown', text: '新增', dropdownList: [{ id: '1', text: '新增', disabled: false }, { id: '2', text: '复制', disabled: true }] },
      //   { id: '4', type: 'button', text: '删除' },
      //   { id: '5', type: 'dropdown', text: '提交', dropdownList: [{ id: '1', text: '提交', disabled: true }, { id: '2', text: '撤销', disabled: false }] },
      //   { id: '6', type: 'dropdown', text: '审核', divider: true, dropdownList: [{ id: '1', text: '审核', disabled: true }, { id: '2', text: '反审核', disabled: false }] },
      //   { id: '7', type: 'button', text: '下推' },
      //   { id: '8', type: 'dropdown', text: '关联查询', dropdownList: [{ id: '1', text: '上查', disabled: true }, { id: '2', text: '下查', disabled: false }, { id: '3', text: '业务流程图', disabled: false, divided: true }, { id: '4', text: '全流程跟踪', disabled: false }] },
      //   { id: '9', type: 'dropdown', text: '业务操作', dropdownList: [{ id: '1', text: '应发修改' }] },
      //   { id: '10', type: 'dropdown', text: '业务查询', divider: true, dropdownList: [{ id: '1', text: '作废', disabled: true }, { id: '2', text: '条码打印', disabled: false, divided: true }] },
      //   { id: '11', type: 'dropdown', text: '行执行', dropdownList: [] },
      //   {
      //     id: '12',
      //     type: 'dropdown',
      //     text: '选项',
      //     dropdownList: [
      //       { id: '1', text: '选项', disabled: true },
      //       { id: '2', text: '打印', disabled: false, divided: true },
      //       { id: '3', text: '预览', disabled: false },
      //       { id: '4', text: '套打设置', disabled: false },
      //       { id: '5', text: '附件', disabled: false, divided: true },
      //       { id: '6', text: '分享（已停用）', disabled: false },
      //       { id: '7', text: '流式配置', disabled: false },
      //       { id: '8', text: '套打导出', disabled: false }
      //     ]
      //   },
      //   { id: '13', type: 'button', text: '退出' }
      // ]
    }
  },
  methods: {}
}
</script>
<style lang='scss' scoped>
.toolbar {
  // position: fixed;
  // top: 100px;
  // right: 16px;
  overflow: hidden;
  height: 48px;
  line-height: 48px;
  padding: 0 16px;
  margin-bottom: 16px;
  background: rgba(255,255,255,1);
  clear: both;

  .el-dropdown {
    padding: 0 8px;
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #555555;
    font-weight: bolder;

    &:hover {
      color: #146bb8;
    }
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }

  .el-button-link {
    color: #555555;
    font-weight: bolder;

    &:hover {
      color: #146bb8;
    }
  }
}

/deep/ .el-dropdown-menu__item {
  &:not(.is-disabled) {
    &:hover {
      color: #146bb8;
      background: rgba(20, 107, 184, .2);
    }
  }

  &:focus {
    color: #146bb8;
    background: rgba(20, 107, 184, .2);
  }
}
</style>
