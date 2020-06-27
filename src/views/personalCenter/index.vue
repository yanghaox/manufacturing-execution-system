<template>
  <div class="personal-center">
    <div class="personal-data">
      <div class="personal-header">
        <span>个人资料</span>
      </div>
      <plk-form
        ref="userInfo"
        :xl="8"
        :lg="8"
        :md="8"
        :option-value="userInfo.optionValue"
        :options="userInfo.options"
        label-width="80px"
      />
    </div>
    <div class="edit-data">
      <div class="personal-header">
        <span>修改资料</span>
        <div>
          <el-button size="small" @click="handleBaseEdit">编辑资料</el-button>
          <el-button size="small" @click="handlePasswordEdit">修改密码</el-button>
        </div>
      </div>
      <plk-form ref="baseForm" :option-value="baseForm.optionValue" :options="baseForm.options" label-width="80px" />
      <div v-show="baseForm.show" class="personal-footer">
        <el-button size="small" @click="handleBaseClose">取 消</el-button>
        <el-button type="primary" size="small" @click="handleBaseCommit">确 定</el-button>
      </div>
    </div>

    <el-dialog
      v-if="passwordForm.show"
      :title="passwordForm.title"
      :close-on-click-modal="false"
      width="30%"
      :visible.sync="passwordForm.show"
      @close="handlePasswordClose"
    >
      <plk-form
        ref="passwordForm"
        :option-value="passwordForm.optionValue"
        :options="passwordForm.options"
        label-width="100px"
      />
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handlePasswordClose">取 消</el-button>
        <el-button type="primary" size="small" @click="handlePasswordCommit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import PlkForm from '@/components/Form'
import { getUserInfo, editUserInfo, editUserPassword } from '@/api/user/user'

export default {
  name: 'PersonalCenter',
  components: { PlkForm },
  data() {
    const validateComfirmpwd = (rule, value, callback) => {
      if (value !== this.passwordForm.optionValue.password) {
        callback(new Error('两次密码输入不同'))
      } else {
        callback()
      }
    }
    return {
      userInfo: {
        options: {
          username: { type: 'text', label: '员工账号:', isText: true },
          realName: { type: 'text', label: '姓名:', isText: true },
          mobile: { type: 'text', label: '手机号码:', isText: true },
          email: { type: 'text', label: '电子邮箱:', isText: true },
          departmentName: { type: 'text', label: '部门列表:', isText: true },
          postionList: { type: 'text', label: '岗位列表:', isText: true }
        },
        optionValue: {
          username: '',
          realName: '',
          mobile: '',
          email: '',
          departmentName: '',
          postionList: ''
        }
      },
      baseForm: {
        show: false,
        options: {
          username: { type: 'text', label: '员工账号', disabled: true },
          realName: { type: 'text', label: '姓名', disabled: true },
          mobile: { type: 'text', label: '手机号码', disabled: true },
          email: { type: 'text', label: '电子邮箱', disabled: true }
        },
        optionValue: {
          username: '',
          realName: '',
          mobile: '',
          email: ''
        }
      },
      passwordForm: {
        show: false,
        title: '修改密码',
        options: {
          oldPassword: {
            type: 'password',
            label: '原密码',
            rules: [
              { required: true, message: '请输入原密码', trigger: 'blur' }
            ]
          },
          password: {
            type: 'password',
            label: '新密码',
            rules: [
              { required: true, message: '请输入新密码', trigger: 'blur' }
            ]
          },
          confirmPassword: {
            type: 'password',
            label: '确认密码',
            rules: [
              { required: true, message: '请输入确认密码', trigger: ['blur', 'change'] },
              { required: true, message: '两次密码不同', trigger: ['blur', 'change'], validator: validateComfirmpwd }
            ]
          }
        },
        optionValue: {
          oldPassword: '',
          password: '',
          confirmPassword: ''
        }
      }
    }
  },
  activated() {
    this.init()
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.getUserInfo()
    },

    getUserInfo() {
      getUserInfo().then(res => {
        const { realName, username, mobile, email, departmentName, mesRbacPostionList } = res.data
        const postionList = mesRbacPostionList.reduce((accumulator, currentValue) => {
          return accumulator + currentValue.postionName + '/'
        }, '')
        this.userInfo.optionValue = Object.assign({}, {
          realName,
          username,
          mobile,
          email,
          departmentName,
          postionList
        })
        this.baseForm.optionValue = Object.assign({}, { realName, username, mobile, email })
      })
    },

    handleBaseEdit() {
      this.baseForm.show = true
      for (const key in this.baseForm.options) {
        if (key === 'username') continue
        this.baseForm.options[key].disabled = false
      }
    },

    handleBaseCommit() {
      editUserInfo(this.baseForm.optionValue).then(res => {
        this.$message.success(res.message)
        this.handleBaseClose()
      })
    },

    handleBaseClose() {
      for (const key in this.baseForm.options) {
        if (key === 'username') continue
        this.baseForm.options[key].disabled = true
      }
      this.baseForm.show = false
      this.init()
    },

    handlePasswordEdit() {
      this.passwordForm.show = true
    },

    handlePasswordCommit() {
      const { oldPassword, password } = this.passwordForm.optionValue
      console.log(this.$refs.passwordForm.handleCheckData())
      if (!this.$refs.passwordForm.handleCheckData()) return
      const data = { oldPassword, password }
      editUserPassword(data).then(res => {
        this.$message.success(res.message)
        this.handlePasswordClose()
      })
    },

    handlePasswordClose() {
      this.passwordForm.show = false
      this.passwordForm.optionValue = {
        oldPassword: '',
        password: '',
        confirmPassword: ''
      }
      this.init()
    }
  }
}
</script>

<style lang="scss" scoped>
.personal-center {
  padding: 16px;
  height: calc(100vh - 122px);
  background: #ffffff;
  overflow: auto;

  .edit-data {
    width: 30%;
  }

  .personal-header {
    padding: 20px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #F4F4F4;

    .header-title {
      font-size: 14px;
      color: #333333;
      font-weight: bold;
    }
  }

  .personal-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
