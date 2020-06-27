<template>
  <el-row :gutter="20" class="panel-group">
    <el-col
      v-for="(item,index) in deviceGroup"
      :key="index"
      :xs="24"
      :sm="24"
      :md="12"
      :lg="8"
      :xl="6"
      class="card-panel-col">
      <el-card class="box-card">
        <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
          <el-row :gutter="5">
            <el-col :xs="0" :sm="8" :md="10" :lg="10" :xl="10" class="device-img">
              <img src="../../../../assets/device/device-pic-001.jpg" alt="">
            </el-col>
            <el-col :xs="24" :sm="16" :md="14" :lg="14" :xl="14">
              <ul>
                <li v-for="(value,key) in deviceGroupInfo" :key="key" :title="item[key]">
                  <span class="label">{{value}}：</span>
                  {{item[key]}}
                </li>
              </ul>
            </el-col>
          </el-row>
          <div class="btn">
            <el-button
              v-permission-key="btnPermission.addUnit"
              type="primary"
              size="mini"
              @click="$emit('clickDeviceGroup',item)"
            >
              设备单元
            </el-button>
            <el-button
              v-permission-key="btnPermission.editGroup"
              type="primary"
              size="mini"
              @click="$emit('editDeviceGroup',item)"
            >
              编辑
            </el-button>
            <el-button
              v-permission-key="btnPermission.deleteGroup"
              type="danger"
              size="mini"
              @click="$emit('deleteDeviceGroup',item)"
            >
              删除
            </el-button>
          </div>
          <div class="group-info scrollbar">
            <ul>
              <li
                v-for="(value,key) in deviceGroupDetailInfo"
                :key="key"
                :title="item[key]"
              >
                <span class="label">{{value}}：</span>
                {{item[key]}}
              </li>
              <li>
                <span class="label">设备数量：</span> {{item.deviceUnitList.length}}
              </li>
              <li
                v-for="device in item.deviceUnitList"
                :key="device.deviceName"
                :title="device.deviceName"
              >
                <span class="label">设备单元：</span>{{device.deviceName}}
              </li>
            </ul>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>

export default {
  name: 'DeviceGroup',

  props: {
    deviceGroup: {
      type: Array,
      required: true
    },
    btnPermission: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      deviceGroupInfo: {
        groupName: '设备组名称',
        groupCode: '设备组编号',
        belongDepartment: '所属部门',
        storageLocationCode: '工位/库位',
        type: '类型'
      },
      deviceGroupDetailInfo: {
        groupName: '设备组名称',
        groupCode: '设备组编号',
        belongDepartment: '所属部门',
        storageLocationCode: '工位/库位',
        type: '类型',
        createdTime: '创建时间',
        createdBy: '创建人',
        updatedTime: '修改时间',
        updatedBy: '修改人'
      }
    }
  },

  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  .card-panel-col {
    margin-bottom: 32px;

    .card-panel {
      max-height: 212px;
      position: relative;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);
      overflow: hidden;
      color: #666;
      background: #fff;
      font-size: 15px;
      box-sizing: border-box;

      &:hover {
        .group-info {
          display: block;
        }
      }

      .group-info {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        max-height: calc(100% - 35px);
        width: 100%;
        overflow: auto;
        background-color: #fff;
      }

      ul {
        padding: 0;

        li {
          margin-top: 5px;
          list-style-type: none;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          .label {
            display: inline-block;
            width: 6em;
            text-align: right;
          }
        }
      }

      .device-img {
        position: relative;

        img {
          padding: 5px;
          max-width: 100%;
        }
      }
    }

    .btn {
      text-align: right;
    }
  }
}
</style>
