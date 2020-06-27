<template>
  <el-dialog
    class="bom-wip-version-dialog"
    :title="`${TITLE_MAP.get(bomVersionType)}半成品BOM版本`"
    width="80%"
    :visible.sync="visible"
    :close-on-click-modal="false"
  >
    <div class="container-warpper">
      <el-transfer
        v-model="materialSelectList"
        filterable
        :titles="['原料数据', '选中原料']"
        :filter-method="filterMethod"
        filter-placeholder="请输入原料编号/名称"
        :data="materialData"
        @change="handleTransferSelectChange"
      />
      <plk-table
        col-min-width="160px"
        :table-header="bomWipHeader"
        :table-data="bomWipData"
        :table-selection="false"
      >
        <!-- 比例 -->
        <template v-slot:proportion="row">
          <el-tooltip class="item" effect="light" :content="row.scope.row.proportion.toString() || ''" placement="top">
            <el-input
              v-model="row.scope.row.proportion"
              size="small"
              @input="handleProportionInput(row.scope)"
            >
              <template slot="append">%</template>
            </el-input>
          </el-tooltip>
        </template>

        <!-- 误差率 -->
        <template v-slot:errorRate="row">
          <el-tooltip class="item" effect="light" :content="row.scope.row.errorRate.toString() || ''" placement="top">
            <el-input
              v-model="row.scope.row.errorRate"
              size="small"
              @input="handleErrorRateInput(row.scope)"
            >
              <template slot="append">%</template>
            </el-input>
          </el-tooltip>
        </template>

        <!-- 备注 -->
        <template v-slot:remark="row">
          <el-tooltip class="item" effect="light" :content="row.scope.row.remark || ''" placement="top">
            <el-input
              v-model="row.scope.row.remark"
              size="small"
            />
          </el-tooltip>
        </template>
      </plk-table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-progress
        :text-inside="true"
        :stroke-width="24"
        :percentage="calcTotalProportion.totalProportion"
        :color="progressColorMethod"
      />
      <el-button size="small" @click="handleBomVersionClose(undefined)">取 消</el-button>
      <el-button type="primary" size="small" @click="handleBomVersionCommit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
const TYPE = {
  ADD: 'add',
  EDIT: 'edit'
}

import PlkTable from '@/components/Table'
import CalcTotalProportion from './CalcTotalProportion'
import { isNonnegativeNumber, isEmpty } from '@/utils/formRules'
import {
  editBomWipVersion,
  getBomWipInfo,
  addBomWipVersion,
  getBomWipVersionDetail
} from '@/api/formula/bomWip.js'
export default {
  name: 'BomWipVersionDialog',
  components: { PlkTable },
  props: {
    bomVersionDialog: {
      type: Boolean,
      required: true
    },
    bomVersionType: {
      type: String,
      required: true,
      validator: function(value) {
        return Object.values(TYPE).includes(value)
      }
    },
    currentBomVersionData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      TITLE_MAP: new Map([['add', '添加'], ['edit', '编辑']]),

      /* transfer */
      materialData: [],
      materialSelectList: [],
      materialSelectListOld: [],
      filterMethod(query, item) {
        return item.label.indexOf(query) > -1
      },

      /* talbe */
      bomWipHeader: [
        // { label: '序号', prop: 'index' },
        { label: '原料代码', prop: 'materialCode', sortable: true, width: '120px' },
        { label: '原料名称', prop: 'materialName', width: '240px' },
        { label: '单位', prop: 'unit', width: '60px' },
        { label: '比例', prop: 'proportion', type: 'slot' },
        { label: '误差率', prop: 'errorRate', type: 'slot' },
        { label: '备注', prop: 'remark', type: 'slot' },
        { label: '类型', prop: 'type', width: '80px' }
      ],
      bomWipData: [],

      /* calcTotalProportion */
      calcTotalProportion: new CalcTotalProportion(),

      /* progress */
      progressColorMethod(percentage) {
        if (percentage === 100) return '#67c23a'
        if (percentage >= 75 && percentage < 100) return '#f56c6c'
        if (percentage >= 50 && percentage < 75) return '#e6a23c'
        if (percentage >= 25 && percentage < 50) return '#6f7ad3'
        if (percentage >= 0 && percentage < 25) return '#409eff'
      }
    }
  },
  computed: {
    visible: {
      get() {
        return this.bomVersionDialog
      },
      set(value) {
        if (!value) {
          this.handleBomVersionClose(undefined)
        }
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      await this.getBomWipInfo()
      if (this.bomVersionType === TYPE.EDIT) {
        const bomVersionId = this.currentBomVersionData.bomVersionId
        this.getBomWipVersionDetail(bomVersionId)
      }
    },

    /* 获取成品BOM信息 */
    getBomWipInfo() {
      return getBomWipInfo().then(res => {
        this.materialData = res.data.map((item, index) => {
          return {
            ...item,
            label: `${item.materialCode} - ${item.materialName}`,
            key: item.materialId
          }
        })
      })
    },

    /* 获取成品BOM版本详情 */
    getBomWipVersionDetail(bomVersionId) {
      return getBomWipVersionDetail(bomVersionId).then(res => {
        const materialSelectList = []
        const mesFormulaMaterialBomVersionMaterialList = res.data.mesFormulaMaterialBomVersionMaterialList

        for (const item of mesFormulaMaterialBomVersionMaterialList) {
          const { materialId, proportion, errorRate, remark } = item
          materialSelectList.push(materialId)

          for (const material of this.materialData) {
            if (material.materialId === materialId) {
              const temp = Object.assign({}, material, { proportion, errorRate, remark })
              this.bomWipData.push(temp)
              const totalProportion = this.calcTotalProportion.handleTotalProportion(temp)
              console.log('totalProportion', totalProportion)
              break
            }
          }
        }
        this.materialSelectList = materialSelectList
        this.materialSelectListOld = materialSelectList
      })
    },

    /* 处理添加提交 */
    handleAddCommit(data) {
      const bomId = this.currentBomVersionData.bomId

      this.$prompt('请输入半成品bom版本', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^\S+$/,
        inputErrorMessage: '请输入半成品bom版本'
      }).then(({ value: version }) => {
        data['version'] = version
        return addBomWipVersion(data, bomId)
      }).then(res => {
        this.$message.success(res.data)
        this.handleBomVersionClose(bomId)
      })
    },

    /* 处理编辑提交 */
    handleEditCommit(data) {
      const { bomId, bomVersionId, version } = this.currentBomVersionData

      this.$prompt('请输入半成品bom版本', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^\S+$/,
        inputValue: version,
        inputErrorMessage: '请输入半成品bom版本'
      }).then(({ value: version }) => {
        data['version'] = version
        return editBomWipVersion(data, bomVersionId)
      }).then(res => {
        this.$message.success(res.data)
        this.handleBomVersionClose(bomId)
      })
    },

    /* 处理提交 */
    handleBomVersionCommit() {
      for (const item of this.bomWipData) {
        // 处理比例校验
        if (!item.hasOwnProperty('proportion') || !isNonnegativeNumber(item.proportion) || Number(item.proportion) <= 0) {
          this.notifyError(`请输入${item.materialCode} - ${item.materialName}的比例`)
          return
        }

        // 处理误差率校验
        if (!item.hasOwnProperty('errorRate') || isEmpty(item.errorRate)) {
          this.notifyError(`请输入${item.materialCode} - ${item.materialName}的误差率`)
          return
        }
      }

      /* 处理totalProportion校验 */
      if (!this.calcTotalProportion.handleTotalProportionCheck()) return

      const mesFormulaMaterialBomVersionMaterialList = this.bomWipData.map(item => {
        const { proportion, materialCode, materialId, materialName, type, unit, errorRate, remark } = item
        return { proportion: Number(proportion), materialCode, materialId, materialName, type, unit, errorRate: Number(errorRate), remark }
      })
      const data = { mesFormulaMaterialBomVersionMaterialList }

      if (this.bomVersionType === TYPE.ADD) this.handleAddCommit(data)
      else if (this.bomVersionType === TYPE.EDIT) this.handleEditCommit(data)
    },

    /* 处理关闭 */
    handleBomVersionClose(bomId) {
      this.$emit('closeDialog', bomId)
    },

    /* 处理输入比例 */
    handleProportionInput({ row }) {
      let { proportion } = row
      if (isNonnegativeNumber(proportion) || isEmpty(proportion)) {
        proportion = Number(proportion)
        if (proportion > 100) {
          row.proportion = ''
          this.notifyError('输入比例不能超过100%！')
        }
      } else {
        this.notifyError('请输入正确的数据格式！')
        return
      }

      const totalProportion = this.calcTotalProportion.handleTotalProportion(row)
      console.log('totalProportion', totalProportion)
      console.log('row.proportion', row.proportion)
    },

    /* 处理输入误差率 */
    handleErrorRateInput({ row }) {
      let { errorRate } = row
      if (isNonnegativeNumber(errorRate) || isEmpty(errorRate)) {
        errorRate = Number(errorRate)
        if (errorRate > 100) {
          row.errorRate = ''
          this.notifyError('输入误差率不能超过100%！')
        }
      } else {
        this.notifyError('请输入正确的数据格式！')
      }
    },

    /* 处理穿梭框删除left */
    handleTransferLeftRemove(materialSelectListNew) {
      const delMaterialKeys = this.materialSelectListOld.filter(value => {
        return !materialSelectListNew.includes(value)
      })

      for (const materialId of delMaterialKeys) {
        for (const [index, value] of this.bomWipData.entries()) {
          if (value.materialId === materialId) {
            this.bomWipData.splice(index, 1)
            break
          }
        }
      }
      this.materialSelectListOld = this.materialSelectList
    },

    /* 处理穿梭框添加right */
    handleTransferRightAdd(materialSelectListNew) {
      const addMaterialKeys = materialSelectListNew.filter(value => {
        return !this.materialSelectListOld.includes(value)
      })

      for (const materialId of addMaterialKeys) {
        for (const item of this.materialData) {
          if (item.materialId === materialId) {
            const material = { ...item, proportion: '', errorRate: '0', remark: '' }
            this.bomWipData.push(material)
            break
          }
        }
      }
      this.materialSelectListOld = this.materialSelectList
    },

    /* 处理穿梭框选中项改变 */
    handleTransferSelectChange(selections, direction) {
      if (direction === 'left') {
        const delMaterialIdList = this.materialSelectListOld.filter(value => {
          return !selections.includes(value)
        })
        this.calcTotalProportion.handleCalcTotalProportionMapDelete(delMaterialIdList)
        this.handleTransferLeftRemove(selections)
      } else if (direction === 'right') {
        this.handleTransferRightAdd(selections)
      }
    },

    // --------------------------------------通知提示--------------------------------------
    /* 成功通知 */
    notifySuccess(message) {
      const h = this.$createElement
      this.$notify.success({
        title: '提示',
        message: h('span', { style: 'color: green' }, message),
        position: 'bottom-right'
      })
    },

    /* 错误通知 */
    notifyError(message) {
      const h = this.$createElement
      this.$notify.error({
        title: '提示',
        message: h('span', { style: 'color: red' }, message),
        position: 'bottom-right'
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.bom-wip-version-dialog {
  // min-width: 1600px;
  .container-warpper {
    display: flex;
    justify-content: space-between;
    overflow: auto;
    .el-transfer {
      min-width: 582px;
      margin-right: 8px;
      /deep/ .el-transfer-panel__body {
        height: 480px;
        .el-transfer-panel__list {
          height: calc(100% - 32px - 15px);
          .el-checkbox__label {
            overflow: visible;
          }
        }
      }
    }
  }
  .dialog-footer {
    .el-progress {
      float: left;
      width: 480px;
    }
  }
}
</style>
