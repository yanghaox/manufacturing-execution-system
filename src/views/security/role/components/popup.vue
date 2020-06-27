<template>
  <div>

    <el-form ref="roles" :model="roles" :rules="rules" label-width="80px">
      <el-form-item label="角色" prop="roleName">
        <el-input
          v-model="roles.roleName"
          size="small"
          :disabled="operating === 'add' ? false : operating === 'edit' ? false :true"
        />
      </el-form-item>
      <el-form-item label="权限范围">
        <el-button size="mini" type="primary" @click="handleSelectAll">全选</el-button>
        <el-button size="mini" type="primary" @click="handleUnselectAll">全不选</el-button>

        <div class="premisson-tree">
          <el-tree
            ref="tree"
            :data="permission"
            show-checkbox
            :check-strictly="false"
            node-key="resourceId"
            highlight-current
            :props="defaultProps"
            @check="handleCheck"
          />
        </div>

      </el-form-item>
      <el-form-item label="具体描述">
        <el-input
          v-model="roles.description"
          type="textarea"
          :disabled="operating === 'add' ? false : operating !== 'edit'"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">取 消</el-button>
      <el-button size="small" type="primary" @click="handleAddRole">确 定</el-button>
    </div>
  </div>
</template>

<script>

export default {

  props: {
    title: {
      type: String,
      default: '添加新角色'
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    roles: {
      type: Object,
      default: function() {
        return {
          roleName: '',
          description: ''
        }
      }
    },
    operating: {
      type: String,
      default: 'add'
    },
    permission: {
      type: Array,
      default: function() {
        return []
      }
    },
    checkedKeys: {
      type: Array,
      default: function() {
        return {}
      }
    }
  },

  data() {
    return {
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      defaultProps: {
        children: 'children',
        label: 'sourceName'
      },
      selectKeys: []
    }
  },

  watch: {
    // 编辑回显权限
    checkedKeys(val) {
      this.selectKeys = val
      // TODO 回显有时候不勾选权限
      setTimeout(() => { // 编辑权限回显
        val.forEach(value => {
          this.$refs.tree.setChecked(value, true)
        })
      }, 500)
    }
  },

  methods: {
    // 关闭弹窗
    close() {
      this.$emit('close')
    },

    // 勾选权限
    handleCheck(item, node) {
      const parentArr = this.$refs.tree.getHalfCheckedKeys() // 获取半选中状态的id
      const childArr = this.$refs.tree.getCheckedKeys() // 获取全选中的id
      this.selectKeys = parentArr.concat(childArr)
    },

    // 提交增加、编辑
    handleAddRole() {
      this.$refs['roles'].validate((val) => {
        if (val) {
          if (this.operating === 'add') {
            this.$emit('addRole', this.roles, this.selectKeys)
          } else if (this.operating === 'edit') {
            this.$emit('editRole', this.roles, this.selectKeys)
          } else if (this.operating === 'role') {
            this.$emit('editAuthority', this.roles, this.selectKeys)
          }
        } else {
          return false
        }
      })
    },

    // 全选权限
    handleSelectAll() {
      this.$refs.tree.setCheckedNodes(this.permission)
      // 获取全选中的id
      this.selectKeys = this.$refs.tree.getCheckedKeys()
    },

    // 全不选
    handleUnselectAll() {
      this.$refs.tree.setCheckedNodes([])
      this.selectKeys = []
    }
  }
}
</script>

<style scoped>
.premisson-tree {
  max-height: 30vh;
  overflow: auto
}

.dialog-footer {
  text-align: right;
}
</style>
