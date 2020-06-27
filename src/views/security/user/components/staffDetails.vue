<template>
  <div>
    <div class="staff-info">
      <ul>
        <li>
          <div>
            <span class="title">员工账号:</span>
            <span class="value">{{ staffInfo.username }}</span>
          </div>
          <div>
            <span class="title">姓名:</span>
            <span class="value">{{ staffInfo.realName }}</span>
          </div>
        </li>
        <li>
          <div>
            <span class="title">手机号:</span>
            <span class="value">{{ staffInfo.mobile }}</span>
          </div>
          <div>
            <span class="title">电子邮件:</span>
            <span class="value">{{ staffInfo.email }}</span>
          </div>
        </li>
        <li>
          <div>
            <span class="title">所在部门:</span>
            <span class="value">{{ staffInfo.departmentName }}</span>
          </div>
          <div>
            <span class="title">岗位列表:</span>
            <span
              v-for="item in staffInfo.mesRbacPostionList"
              :key="item.postionId"
              class="value"
            >
              {{ item.postionName }}
              &nbsp;&nbsp;
            </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

export default {
  name: 'StaffDetails',

  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '员工详细信息'
    },
    staffInfo: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="scss">
ul {
  padding: 0;

  li {
    display: flex;
    margin-bottom: 15px;

    div {
      flex: 1;

      .title {
        margin-right: 5px;
        color: #666;
        font-weight: bold;
      }

      .value {
        display: inline-block;
        margin-bottom: 5px;
      }
    }
  }
}
</style>
