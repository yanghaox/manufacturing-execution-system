<template>
  <div class="feed-material">
    <!-- 表格 -->
    <plk-table
      table-height="calc(100vh - 400px)"
      col-min-width="160px"
      :table-header="materialListHeader"
      :table-data="materialListData.filter(data => !searchCodeOrName ||
        data.materialCode.toLowerCase().includes(searchCodeOrName.toLowerCase()) ||
        data.materialName.toLowerCase().includes(searchCodeOrName.toLowerCase())
      )"
      :table-selection="false"
    >
      <!-- 重置 -->
      <template v-slot:resetProportion="column">
        <el-row :gutter="10">
          <el-col :span="16">
            <el-input
              v-model="searchCodeOrName"
              plain
              size="mini"
              placeholder="输入原料编号/名称搜索"
            />
          </el-col>
          <el-col :span="8">
            <el-button
              :disabled="resetButtonDisabled"
              size="mini"
              icon="el-icon-refresh-left"
              plain
              @click="handleResetProportion"
            >
              重置比例
            </el-button>
          </el-col>
        </el-row>
      </template>

      <!-- 剩余比例 -->
      <template v-slot:remainProportion="row">
        <h3
          :class="[row.scope.row.remainProportion === 0 ? 'remain-proportion-red': 'remain-proportion-green']"
        >
          {{ row.scope.row.remainProportion }}
        </h3>
      </template>

      <!-- 当前比例 -->
      <template v-slot:currentProportion="row">
        <el-input
          v-if="row.scope.row.displayEdit"
          v-model="cacheCurrentProportion"
          size="small"
          @input="handleCurrentProportionChange(row.scope)"
        >
          <template slot="prepend">
            <el-button size="mini" icon="el-icon-minus" @click="cacheCurrentProportion = 0" />
          </template>
          <template slot="append">
            <el-button size="mini" icon="el-icon-plus" @click="cacheCurrentProportion = row.scope.row.remainProportion" />
          </template>
        </el-input>
        <h3
          v-else
          :class="[row.scope.row.remainProportion === 0 ? 'remain-proportion-red': 'remain-proportion-green']"
        >
          {{ row.scope.row.currentProportion }}
        </h3>
      </template>

      <!-- 分度值 -->
      <template v-slot:scale="row">
        <el-input
          v-if="row.scope.row.displayEdit"
          v-model="cacheScale"
          size="small"
          @input="handleScaleChange"
        >
          <template slot="prepend">
            <el-button size="mini" icon="el-icon-minus" @click="cacheScale = 0" />
          </template>
          <template slot="append">
            <el-button size="mini" icon="el-icon-plus" @click="cacheScale = 100" />
          </template>
        </el-input>
        <h3
          v-else
        >
          {{ row.scope.row.scale }}
        </h3>
      </template>

      <!-- 管道id -->
      <template v-slot:pipelineId="row">
        <el-select v-if="row.scope.row.displayEdit" v-model="cachePipelineId" clearable placeholder="请选择管道">
          <el-option
            v-for="item in row.scope.row.pipelineIdList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <h3
          v-else
        >
          {{ filterPipelineIdToPipelineLabel(row.scope.row.pipelineId) }}
        </h3>
      </template>

      <!-- 操作 -->
      <template v-slot:btnSlot="row">
        <template v-if="row.scope.row.displayButtonGroup">
          <template v-if="row.scope.row.displayEdit">
            <el-button
              type="primary"
              size="mini"
              :loading="saveBtnLoading"
              @click="handleTableRowSaveCommit(row.scope)"
            >
              保存
            </el-button>
            <el-button
              type="danger"
              size="mini"
              @click="handleTableRowCancel(row.scope)"
            >
              取消
            </el-button>
          </template>
          <template v-else>
            <el-button
              type="primary"
              size="mini"
              @click="handleTableRowEdit(row.scope)"
            >
              编辑
            </el-button>
          </template>
        </template>
      </template>
    </plk-table>
  </div>
</template>

<script>
const TYPE = {
  ADD: 'add',
  EDIT: 'edit'
}
const DELAY = 1500
import PlkTable from '@/components/Table'
import Emitter from '@/views/technology/info/components/js/Emitter'
import FeedMaterial from '../js/FeedMaterial.js'
import { addCalc, subtractCalc } from '@/utils/float-calc'
import { getPipelineDetail } from '@/api/technology/info'
import Validator from '@/views/technology/info/components/js/Validator'
import FeedMaterialMixins from '../mixins/FeedMaterialMixins'
import { preventShake } from '@/utils/prevent-shake'
import { isNonnegativeNumber } from '@/utils/formRules'

export default {
  name: 'FeedMaterial',

  inject: ['TechnologyWritingPage'],

  components: { PlkTable },

  mixins: [Emitter, FeedMaterialMixins],

  props: {
    phaseStepType: {
      type: String,
      required: true,
      validator: function(value) {
        return Object.values(TYPE).includes(value)
      }
    },

    // eslint-disable-next-line vue/require-prop-types
    currentFunctionData: {
      required: true
    },

    // eslint-disable-next-line vue/require-prop-types
    functionalDomainData: {
      required: true
    }
  },

  data() {
    return {
      materialListHeader: [
        { label: '原料编号', prop: 'materialCode', sortable: true },
        { label: '原料名称', prop: 'materialName' },
        { label: '总占比', prop: 'proportion', align: 'center', width: '80px' },
        { label: '当前剩余占比', prop: 'remainProportion', type: 'slot', align: 'center' },
        { label: '当前分配占比', prop: 'currentProportion', type: 'slot', width: '180px', align: 'center', sortable: true },
        { label: '分度值', prop: 'scale', type: 'slot', width: '180px', align: 'center' },
        { label: '当前物料管道', prop: 'pipelineId', type: 'slot', width: '180px', align: 'center' },
        { label: '', type: 'btn', fixed: 'right', align: 'center', width: '320px', slotHeader: true, slotHeaderName: 'resetProportion' }
      ],
      materialListData: [],
      searchCodeOrName: '',
      PIPELINE_ID_PIPELINE_LABEL_MAP: new Map(),

      /* 保存按钮 */
      saveBtnLoading: false,

      /* 当前比例防抖 */
      preventShakeCurrentProportion: preventShake(),

      /* 分度值防抖 */
      preventShakeScale: preventShake(),

      /* 重置按钮 */
      resetButtonDisabled: false,
      cacheCurrentProportion: undefined,
      cacheScale: 0,
      cachePipelineId: '',
      currentMaterialData: null
    }
  },

  mounted() {
    this.$on('on-change-tab', this.handleTabChange)
    this.init()

    if (this.phaseStepType === TYPE.EDIT) {
      this.handleShowOtherNotSetButtonGroup()
    }
  },

  methods: {
    /* 处理Tab切换 */
    handleTabChange() {
      if (this.phaseStepType === TYPE.ADD) {
        this.handleCommitData(null)
        this.handleResetProportion()
      }

      if (this.phaseStepType === TYPE.EDIT) {
        this.handleChangeFeedTypeRecoveryData()
      }
    },

    /* 处理切换投料方式，恢复数据 */
    handleChangeFeedTypeRecoveryData() {
      this.$nextTick(() => {
        this.handleResetProportion()
        this.currentMaterialData = this.currentFunctionData
        this.resetButtonDisabled = false
        if (this.currentMaterialData.feedType === 'feedMaterial') {
          this.handleCommitData(this.currentFunctionData)
        }
        this.$nextTick(() => {
          this.init()
        })
      })
    },

    /* 处理编辑时初始化 */
    init() {
      const materialPipelineList = this.TechnologyWritingPage.currentPhaseStepPageData.functionSetting.functionMaterial.materialPipeLineList
      this.materialListData = this.handleGetFormulaMaterialList()
      this.handleGetMaterialPipelineList(materialPipelineList)

      if (this.phaseStepType === TYPE.EDIT &&
      this.functionalDomainData !== null &&
      this.currentFunctionData.feedType === 'feedMaterial') {
        this.currentMaterialData = this.currentFunctionData
        for (const material of this.currentFunctionData.feedData) {
          const { materialId, currentProportion, scale, pipelineId } = material

          for (const item of this.materialListData) {
            if (materialId === item.materialId) {
              item.currentProportion = currentProportion
              item.scale = scale
              item.pipelineId = pipelineId
              item.displayButtonGroup = false
              break
            }
          }
        }
      }
    },

    /* 处理获取物料管道列表 */
    handleGetMaterialPipelineList(materialPipelineList) {
      for (const { materialId, pipelineIdSet } of materialPipelineList) {
        for (const item of this.materialListData) {
          if (item.materialId === materialId) {
            for (const pipelineId of pipelineIdSet) {
              this.getPipelineDetail(pipelineId).then(res => {
                const { value, label } = res
                item.pipelineIdList.push({ value, label })
                this.PIPELINE_ID_PIPELINE_LABEL_MAP.set(value, label)
              })
            }
            break
          }
        }
      }
    },

    /* 获取管道详情 */
    getPipelineDetail(pipelineId) {
      return getPipelineDetail(pipelineId).then(res => {
        const { pipelineId: value, pipelineName: label } = res.data
        return {
          value,
          label
        }
      })
    },

    /* 处理获取配方物料数据 */
    handleGetFormulaMaterialList() {
      console.log('this.TechnologyWritingPage.formulaMaterialList', this.TechnologyWritingPage.formulaMaterialList)
      const displayEdit = false
      const displayButtonGroup = true

      return this.TechnologyWritingPage.formulaMaterialList.map(item => {
        return {
          ...item,
          displayEdit,
          displayButtonGroup,
          scale: 0,
          pipelineId: '',
          pipelineIdList: []
        }
      })
    },

    /* 重置比例 */
    handleResetProportion() {
      // TODO 比例恢复，按钮组显示
      if (this.currentMaterialData !== null) {
        this.handleResetMaterialData(this.currentMaterialData)
        this.currentMaterialData = null
        this.handleCommitData(null)
      }
    },

    /* 处理重置table物料数据 */
    handleResetMaterialData(currentMaterialData) {
      for (const material of currentMaterialData.feedData) {
        const { materialId, currentProportion } = material

        for (const item of this.materialListData) {
          if (item.materialId === materialId) {
            item.remainProportion = addCalc(item.remainProportion, currentProportion)
            item.displayButtonGroup = true
            item.currentProportion = 0
            item.scale = 0
            item.pipelineId = ''
            break
          }
        }
      }
    },

    /* 隐藏其他按钮组 */
    handleHideOtherButtonGroup(row) {
      for (const item of this.materialListData) {
        if (item !== row) item.displayButtonGroup = false
      }
    },

    /* 显示其他还未配置比例的按钮组 */
    handleShowOtherNotSetButtonGroup(row) {
      for (const item of this.materialListData) {
        console.log('currentProportion', item.currentProportion)
        if (!item.currentProportion) item.displayButtonGroup = true
        if (row) row.displayButtonGroup = false
      }
    },

    /* 处理表格编辑 */
    handleTableRowEdit({ row }) {
      console.log('row', row)
      this.handleHideOtherButtonGroup(row)
      row.displayEdit = true
      this.cacheCurrentProportion = row.currentProportion
      this.cacheScale = row.scale || 0
      this.cachePipelineId = row.pipelineId || ''
      this.resetButtonDisabled = true
    },

    /* 处理表格保存验证 */
    handleTableRowSaveCheck(row) {
      const validator = new Validator()
      validator.add(this.handleCurrentProportionNotEmptyCheck)
      validator.add(this.handleScaleNotEmpty)
      // validator.add(this.handlePipelineIdNotEmpty)
      return validator.execute(row)
    },

    /* 保存提交 */
    handleTableRowSaveCommit({ row }) {
      if (!this.handleTableRowSaveCheck(row)) return

      row.displayEdit = false
      row.currentProportion = this.cacheCurrentProportion
      row.scale = this.cacheScale
      row.pipelineId = this.cachePipelineId
      row.remainProportion = subtractCalc(row.remainProportion, this.cacheCurrentProportion)

      const feedType = 'feedMaterial'
      const feedData = []
      for (const item of this.materialListData) {
        if (item.currentProportion !== 0 && item.currentProportion !== undefined) {
          const material = new FeedMaterial(item)
          feedData.push(material)
        }
      }

      this.currentMaterialData = Object.assign({}, { feedType, feedData })
      this.resetButtonDisabled = false
      this.handleCommitData(this.currentMaterialData)
      this.handleShowOtherNotSetButtonGroup(row)
    },

    /* 处理表格取消 */
    handleTableRowCancel({ row }) {
      row.displayEdit = false
      this.resetButtonDisabled = false
      this.handleShowOtherNotSetButtonGroup(row)
      row.displayButtonGroup = true
    },

    /* 处理输入当前比例 */
    handleCurrentProportionChange({ row }) {
      this.saveBtnLoading = true
      this.preventShakeCurrentProportion(() => {
        const { remainProportion } = row
        if (isNonnegativeNumber(remainProportion)) {
          if (this.cacheCurrentProportion > remainProportion) {
            this.cacheCurrentProportion = remainProportion
          } else {
            this.cacheCurrentProportion = Number(this.cacheCurrentProportion)
          }
        } else {
          this.cacheCurrentProportion = 0
        }
        this.saveBtnLoading = false
      }, DELAY)
    },

    /* 处理输入当前分度值 */
    handleScaleChange(val) {
      this.saveBtnLoading = true
      this.preventShakeScale(() => {
        if (isNonnegativeNumber(val)) {
          val = Number(val)
          if (val > 100) {
            this.cacheScale = 100
          } else {
            this.cacheScale = val
          }
        } else {
          this.cacheScale = 0
        }
        this.saveBtnLoading = false
      }, DELAY)
    },

    /* 提交数据 */
    handleCommitData(data) {
      console.log('data', data)
      this.dispatch('PhaseStepDialog', 'on-functional-domain-data', data)
    },

    /* 过滤获取管道label */
    filterPipelineIdToPipelineLabel(value) {
      return this.PIPELINE_ID_PIPELINE_LABEL_MAP.get(value) || ''
    }
  }
}
</script>
<style lang='scss' scoped>
.feed-material {
  .toolbar {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 48px;
  }
}
.remain-proportion-red {
  color: red;
}
.remain-proportion-green {
  color: green;
}
</style>
