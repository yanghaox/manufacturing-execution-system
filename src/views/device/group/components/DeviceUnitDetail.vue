<template>
  <div class="device-unit-dialog">
    <el-dialog
      v-if="visible"
      :visible.sync="visible"
      :close-on-click-modal="false"
      top="3%"
      :title="deviceUnitType === 'add' ? '添加设备单元' : `设备单元详情：${currentDeviceUnitData.deviceName}`"
      width="90%">
      <div class="contaniner">
        <div v-if="deviceUnitType==='add'" class="divice-unit-list">
          <el-input
            v-model="filterText"
            size="mini"
            placeholder="输入关键字进行过滤"
            style="margin-bottom: 24px"
          />
          <div class="unit-tree scrollbar">
            <div class="btn-warpper">
              <el-button type="primary" size="mini" @click="handleSelectAllOrNotSelect('all')">全选</el-button>
              <el-button type="primary" size="mini" @click="handleSelectAllOrNotSelect('not')">全不选</el-button>
            </div>
            <el-tree
              ref="tree"
              :data="deviceUnitList"
              show-checkbox
              node-key="deviceId"
              :filter-node-method="filterNode"
              @check="handleCheckUnit"
            >
              <span slot-scope="{ node, data }" class="custom-tree-node">
                <span>{{ data.deviceName }}</span>
                <span>
                  <el-button
                    type="text"
                    size="mini"
                    @click="handleGetDeviceDetial(data)">
                    详情
                  </el-button>
                </span>
              </span>
            </el-tree>
          </div>
        </div>
        <div class="unit-detail" :class="{'view-detailt':deviceUnitType !== 'add'}">
          <el-tabs tab-position="left">
            <el-tab-pane label="设备功能">
              <plk-table
                class="data-table"
                row-key="id"
                table-height="calc(100vh - 350px)"
                :table-selection="false"
                :default-expand-all="true"
                :table-header="deviceFunHeader"
                :table-data="functionData"
                :tree-props="{ children: 'parameterList', hasChildren: 'hasChildren' }"
              />
            </el-tab-pane>
            <el-tab-pane label="设备属性">
              <plk-table
                class="data-table"
                row-key="id"
                table-height="calc(100vh - 350px)"
                :table-selection="false"
                :table-header="deviceAttributeHeader"
                :table-data="attributeData"
                :tree-props="{ children: 'parameterList', hasChildren: 'hasChildren' }"
              />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleDeviceUnitFormClose">取 消</el-button>
        <el-button type="primary" size="small" @click="handleDeviceUnitFormCommit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import PlkTable from '@/components/Table'
import { getDeviceUnit, getDeviceUnitDetail, addDeviceUnit } from '@/api/device/deviceGroup'

export default {
  name: 'DeviceUnitDialog',

  components: {
    PlkTable
  },

  props: {
    deviceUnitDialog: {
      type: Boolean,
      required: true
    },
    currDeviceGroup: {
      type: Object,
      required: true
    },
    deviceUnitType: {
      type: String,
      required: true
    },
    currentDeviceUnitData: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      filterText: '',
      rowKey: 'functionId',
      deviceUnitList: [], // 设备单元列表
      unitFunctionList: [], // 设备单元功能列表
      functionData: [], // 功能数据
      attributeData: [], // 属性数据
      selectUnit: [], // 勾选的设备单元
      treeProps: { children: 'parameterList', hasChildren: 'hasChildren' },
      deviceFunHeader: [
        { label: '功能名称', prop: 'functionName' },
        { label: '参数名称', prop: 'parameterName' },
        { label: '参数最小值', prop: 'valueMin' },
        { label: '参数最大值', prop: 'valueMax' },
        { label: '单位', prop: 'unit' }
      ],
      deviceAttributeHeader: [
        { label: '设备属性', prop: 'attributeName' },
        { label: '属性值', prop: 'value' }
      ]
    }
  },

  computed: {
    visible: {
      get() {
        return this.deviceUnitDialog
      },
      set(value) {
        if (!value) {
          this.handleDeviceUnitFormClose()
        }
      }
    }
  },

  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },

  mounted() {
    this.deviceUnitType === 'add' ? this.handleGetDeviceUnitList() : this.handleDealWithUnitDetail()
  },

  methods: {
    // 处理查看设备单元详情
    handleDealWithUnitDetail() {
      this.functionData = this.currentDeviceUnitData.functionList.map(fun => {
        const par = fun.parameterList.map(parameter => ({
          ...parameter,
          id: parameter.parameterId + 1
        }))
        return {
          ...fun,
          id: fun.functionId + 1,
          parameterList: par
        }
      })
      this.attributeData = this.currentDeviceUnitData.attributeList.map(attr => ({
        ...attr,
        id: attr.attributeId + 1
      }))
    },
    // 获取设备单元列表
    async handleGetDeviceUnitList() {
      const unitList = await getDeviceUnit()
      this.deviceUnitList = unitList.data
    },

    // 获取设备单元详情
    async handleGetDeviceDetial(deviceUnit) {
      const unitDetail = await getDeviceUnitDetail(deviceUnit.deviceId)
      this.functionData = unitDetail.data.functionList.map(fun => {
        const par = fun.parameterList.map(parameter => ({
          ...parameter,
          id: parameter.parameterId + 1
        }))
        return {
          ...fun,
          id: fun.functionId + 1,
          parameterList: par
        }
      })
      this.attributeData = unitDetail.data.attributeList.map(attr => ({
        ...attr,
        id: attr.attributeId + 1
      }))
    },

    // 过滤筛选设备单元
    filterNode(value, data) {
      if (!value) return true
      return data.deviceName.indexOf(value) !== -1
    },

    // 勾选设备单元
    handleCheckUnit() {
      this.selectUnit = this.$refs.tree.getCheckedKeys()
    },

    // 全选或全不选设备单元
    handleSelectAllOrNotSelect(mark) {
      let selectUnit
      if (mark === 'all') {
        this.$refs.tree.setCheckedNodes(this.deviceUnitList)
        selectUnit = this.$refs.tree.getCheckedKeys()
      } else {
        this.$refs.tree.setCheckedNodes([])
        selectUnit = this.$refs.tree.getCheckedKeys()
      }
      this.selectUnit = selectUnit
    },

    // 提交
    handleDeviceUnitFormCommit() {
      if (this.deviceUnitType !== 'add') {
        this.handleDeviceUnitFormClose()
        return
      }
      addDeviceUnit({ unitList: this.selectUnit }, this.currDeviceGroup.groupId).then(res => {
        if (res.code === '200') {
          this.$message.success(res.message)
          this.handleDeviceUnitFormClose()
        }
      })
    },

    // 取消
    handleDeviceUnitFormClose() {
      this.$emit('closeDialog')
    }
  }
}
</script>
<style lang='scss' scoped>
.contaniner {
  &:after {
    display: block;
    clear: both;
    content: '';
  }

  .divice-unit-list {
    float: left;
    width: 330px;

    .unit-tree {
      height: calc(100vh - 350px);
      overflow: auto;

      .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
      }
    }
  }

  .unit-detail {
    float: left;
    width: calc(100% - 352px);
    margin-left: 22px;
  }

  .view-detailt {
    width: 100%;
    margin-left: 0;
  }

  .btn-warpper {
    margin-bottom: 22px;
  }
}
</style>
