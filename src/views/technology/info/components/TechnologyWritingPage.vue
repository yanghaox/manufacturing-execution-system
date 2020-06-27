<template>
  <div class="technology-writing-page">
    <div class="page-warpper">
      <toolbar :toolbar-list="toolbarList" />

      <!-- 工艺母表信息header -->
      <technology-info-header
        :field-translate-chinese-map="FIELD_TRANSLATE_CHINESE_MAP"
        :field-data="currentTechnologyWritingData"
      />

      <!-- 相别表格 -->
      <plk-table
        table-height="calc(100vh - 300px)"
        col-min-width="160px"
        :table-header="phaseHeader"
        :table-data="phaseData"
        :table-selection="false"
      >
        <template v-slot:isTarget="row">
          <div
            :style="row.scope.row.isTarget ? 'color: red;' : 'color: green;'"
          >
            {{ row.scope.row.isTarget ? '是' : '否' }}
          </div>
        </template>

        <template v-slot:addPhase="column">
          <el-dropdown size="mini" trigger="click" split-button style="margin-right: 10px;">
            <span><i class="el-icon-menu el-icon--left" />相别</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                icon="el-icon-circle-plus"
                style="padding: 4px 16px;"
                @click.native="handleOpenInnerPhaseDialog"
              >
                添加<b>内相</b>
              </el-dropdown-item>
              <el-dropdown-item
                icon="el-icon-circle-plus-outline"
                style="padding: 4px 16px;"
                @click.native="handleOpenOuterPhaseDialog"
              >
                添加<b>外相</b>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-button
            size="mini"
            icon="el-icon-s-data"
            plain
            @click="handlePhaseChartShow(column.scope)"
          >
            图表
          </el-button>
          <el-button
            v-loading.fullscreen.lock="compileLoading"
            element-loading-text="编译中..."
            size="mini"
            icon="el-icon-s-opportunity"
            plain
            @click="handleTechCompile"
          >
            编译
          </el-button>
          <el-button
            size="mini"
            icon="el-icon-check"
            plain
            @click="handleTechCommit(column.scope)"
          >
            提交
          </el-button>
        </template>

        <template v-slot:btnSlot="row">
          <el-badge :value="200" :max="99" hidden class="danger-item">
            <el-button
              type="primary"
              size="mini"
              @click="handleTableRowEdit(row.scope)"
            >
              编辑
            </el-button>
          </el-badge>

          <el-badge
            :value="row.scope.row.phaseCompileWarnCount"
            :max="99"
            :hidden="row.scope.row.phaseCompileWarnCount === 0"
            class="danger-item"
          >
            <el-button
              type="primary"
              size="mini"
              @click="handleTableRowEditStep(row.scope)"
            >
              步骤
            </el-button>
          </el-badge>

          <el-badge :value="200" :max="99" hidden class="danger-item">
            <el-button
              type="danger"
              size="mini"
              @click="deletePhaseComfirm(row.scope)"
            >
              删除
            </el-button>
          </el-badge>
        </template>
      </plk-table>

    </div>

    <!-- 内相初始化 -->
    <el-drawer
      ref="innerPhasePage"
      :visible.sync="innerPhasePageDialog"
      direction="ttb"
      size="100%"
      destroy-on-close
    >
      <template slot="title"><span>添加设备</span></template>
      <inner-phase-page
        :current-inner-phase-page-data="currentInnerPhasePageData"
        @close="handleInnerPhasePageClose"
      />
    </el-drawer>

    <!-- 相别弹窗 -->
    <phase-dialog
      v-if="phaseDialog"
      v-el-drag-dialog
      :phase-type="phaseType"
      :phase-dialog="phaseDialog"
      :current-phase-data="currentPhaseData"
      @close="handlePhaseDialogClose"
    />

    <!-- 相别步骤 -->
    <el-drawer
      :visible.sync="phaseStepPageDialog"
      direction="ltr"
      size="100%"
      destroy-on-close
    >
      <template slot="title">
        <span>
          {{
            `相别步骤：${currentPhaseStepPageData.phaseName}
            (最大步骤数：${currentPhaseStepPageData.maxTep}) -
            当前步骤数：${currentPhaseStepPageData.hasOwnProperty('phaseStepList') && currentPhaseStepPageData.phaseStepList.length}`
          }}
        </span>
      </template>
      <phase-step-page :current-phase-step-page-data="currentPhaseStepPageData" />
    </el-drawer>

    <!-- 相别关系图 -->
    <el-drawer
      :visible.sync="phaseChartDialog"
      title="相别图表"
      size="80%"
      append-to-body
      destroy-on-close
    >
      <phase-chart />
    </el-drawer>

    <!-- 提交工艺 -->
    <submit-tech-dialog
      v-if="submitTechDialog"
      v-el-drag-dialog
      :submit-tech-dialog="submitTechDialog"
      @close="handleSubmitTechDialogClose"
      @submit="handleSubmitTechDialogSubmit"
    />

  </div>
</template>

<script>
const TYPE = {
  ADD: 'add',
  EDIT: 'edit'
}

const PHASE_TYPE = {
  INNER_PHASE: 'innerPhase',
  OUTER_PHASE: 'outerPhase'
}

import Toolbar from '@/components/Toolbar'
import TechnologyInfoHeader from './components/TechnologyInfoHeader'
import PlkTable from '@/components/Table'
import FnChain from './js/FnChain.js'
import Phase from './js/Phase.js'
import PhaseStep from './js/PhaseStep.js'
import PhaseTree from './js/PhaseTree.js'
import VirtualTree from './js/VirtualTree.js'
import PhaseDialog from './components/PhaseDialog'
import InnerPhasePage from './components/InnerPhasePage'
import PhaseStepPage from './components/PhaseStepPage'
import phaseChart from './components/PhaseChart'
import SubmitTechDialog from './components/SubmitTechDialog'
import Mixins from './mixins/index.js'
import Validator from './js/Validator'

import {
  getDeviceUnitList,
  getBomVersionDetail,
  getDeviceUnitOuterPhase,
  addTechVersion,
  addDraft
} from '@/api/technology/info'

import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('commonConfig')

export default {
  name: 'TechnologyWritingPage',

  components: { Toolbar, TechnologyInfoHeader, PlkTable, PhaseDialog, InnerPhasePage, PhaseStepPage, phaseChart, SubmitTechDialog },

  mixins: [...Mixins],

  provide() {
    return {
      TechnologyWritingPage: this
    }
  },

  props: {
    technologyWritingType: {
      type: String,
      required: true,
      validator: function(value) {
        return Object.values(TYPE).includes(value)
      }
    },

    currentTechnologyWritingData: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      toolbarList: [],

      FUNCTION_CODE_NAME_AND_METHOD_MAP: new Map([
        [
          'feedFunctionCode',
          {
            'add': 'handleFeedFunctionAddCommit',
            'edit': 'handleFeedFunctionEditCommit',
            'recovery': 'handleFeedFunctionRecoveryCommit',
            'del': 'handleFeedFunctionDelCommit'
          }
        ], [
          'pipelineMaterialFunctionCode',
          {
            'add': 'handlePipelineMaterialFunctionAddCommit',
            'edit': 'handlePipelineMaterialFunctionEditCommit',
            'recovery': 'handlePipelineMaterialFunctionRecoveryCommit',
            'del': 'handlePipelineMaterialFunctionDelCommit'
          }
        ], [
          'dischargeFunctionCode',
          {
            'add': 'handleDischargeFunctionAddCommit',
            'edit': 'handleDischargeFunctionEditCommit',
            'recovery': 'handleDischargeFunctionRecoveryCommit',
            'del': 'handleDischargeFunctionDelCommit'
          }
        ], [
          'phaseTransferFunctionCode',
          {
            'add': 'handlePhaseTransferFunctionAddCommit',
            'edit': 'handlePhaseTransferFunctionEditCommit',
            'recovery': 'handlePhaseTransferFunctionRecoveryCommit',
            'del': 'handlePhaseTransferFunctionDelCommit'
          }
        ]
      ]),
      FUNCTION_CODE_AND_METHOD_MAP: new Map(),

      FIELD_TRANSLATE_CHINESE_MAP: new Map([
        ['bomName', '配方名称'],
        ['bomVersion', '配方版本'],
        ['groupName', '设备组名称'],
        ['quantityLowLimit', '产量下限'],
        ['quantityUpLimit', '产量上限'],
        ['techCode', '工艺编号'],
        ['techName', '工艺名称'],
        ['techType', '工艺类型'],
        ['unit', '产物单位']
      ]),

      /* table */
      /* 相别表格Header */
      phaseHeader: [
        // ------------------------新工艺------------------------
        // { label: '上级相别编号', prop: 'parentPhaseCode' },
        // { label: '类型id', prop: 'typeId' },
        { label: '相别名称', prop: 'phaseName' },
        { label: '描述', prop: 'describe' },
        { label: '设备编号', prop: 'deviceCode' },
        { label: '设备名称', prop: 'deviceName' },
        { label: '是否为产物', prop: 'isTarget', type: 'slot' },
        { label: '产量下限', prop: 'quantityLowLimit', width: '80px' },
        { label: '产量上限', prop: 'quantityUpLimit', width: '80px' },
        { label: '最大步骤', prop: 'maxTep', width: '80px' },
        { label: '备注', prop: 'remark' },
        { label: '类型', prop: 'type', width: '80px' },
        { label: '', type: 'btn', fixed: 'right', width: '400px', slotHeader: true, slotHeaderName: 'addPhase' }
      ],

      /* 相别总数据 */
      phaseData: Phase.phaseData,

      /* 设备组 */
      deviceUnitList: [],
      deviceUnitOuterPhase: {},

      /* 配方 */
      formulaMaterialList: [],

      /* 内相页面 */
      currentInnerPhasePageData: [],
      innerPhasePageDialog: false,

      /* 相别新增、编辑 */
      currentPhaseData: {},
      phaseType: 'add', // add/edit
      phaseDialog: false,

      /* 相别步骤页面 */
      currentPhaseStepPageData: {},
      phaseStepPageDialog: false,

      /* 提交工艺 */
      submitTechDialog: false,

      /* phaseChart */
      phaseChartDialog: false,

      /* 编译 */
      compileLoading: false
    }
  },

  computed: {
    ...mapState(['deviceFunctionCodeMap'])
  },

  mounted() {
    this.$on('on-add-outer-phase-data', this.handleAddOuterPhaseData)
    this.$on('on-edit-phase-data', this.handleEditPhaseData)
    this.$on('on-add-inner-phase-data', this.handleAddInnerPhaseDataObjs)
    this.$on('on-add-phase-step', this.handleAddPhaseStep)
    this.$on('on-edit-phase-step', this.handleEditPhaseStep)
    this.$on('on-delete-phase-step', this.handleDeletePhaseStep)
    this.$on('on-move-up-phase-step', this.handlePhaseStepMoveUp)
    this.$on('on-move-down-phase-step', this.handlePhaseStepMoveDown)
    this.init()
  },

  methods: {
    // --------------------------------------初始化--------------------------------------
    init() {
      this.initToolbar()
      const {
        bomId,
        bomVersionId,
        departmentId,
        groupId,
        hasChildren,
        id,
        quantityLowLimit,
        quantityUpLimit,
        techCode,
        techData,
        techId,
        techName,
        techType,
        unit
      } = this.currentTechnologyWritingData
      console.log('this.currentTechnologyWritingData', this.currentTechnologyWritingData)
      Promise.all([
        this.getDeviceUnitList(groupId),
        this.getBomVersionDetail(bomVersionId),
        this.getDeviceUnitOuterPhase('ExtraPhaseDevice'),
        this.getFunctionCodeAndMethodMap()
      ]).then(() => {
        if (techData) this.initDraft(techData)
      })
    },

    /* 初始化草稿 */
    initDraft(techData) {
      const phaseData = JSON.parse(techData)
      const virtualTree = new VirtualTree(phaseData)
      console.log('this.handleDraftAddPhase', this.handleDraftAddPhase)
      virtualTree.treeListBefore(this.handleDraftAddPhase)
      virtualTree.treeListAfter(this.getPhaseAndAddPhaseStepData)
    },

    /* 处理草稿添加相别 */
    handleDraftAddPhase(phaseData, id) {
      for (const phase of phaseData) {
        if (phase.id === id) {
          if (phase.phaseType === PHASE_TYPE.INNER_PHASE) this.handleAddInnerPhaseData(phase)
          if (phase.phaseType === PHASE_TYPE.OUTER_PHASE) this.handleAddOuterPhaseData(phase)
          break
        }
      }
    },

    /* 获取相别并添加相别步骤 */
    getPhaseAndAddPhaseStepData(draftPhaseData, id) {
      for (const phase of this.phaseData) {
        if (phase.id === id) {
          this.currentPhaseStepPageData = phase
          for (const draftPhase of draftPhaseData) {
            if (draftPhase.id === id) {
              for (const phaseStep of draftPhase.phaseStepList) {
                this.handleAddPhaseStep(phaseStep)
              }
              break
            }
          }
          break
        }
      }
    },

    /* 初始化工具栏 */
    initToolbar() {
      this.toolbarList = [
        {
          id: '3',
          type: 'dropdown',
          text: '新增',
          dropdownList: [
            { id: '1', text: '新增', disabled: true },
            { id: '2', text: '复制', disabled: true }
          ]
        },
        {
          id: '14',
          type: 'dropdown',
          text: 'Excel',
          divider: true,
          dropdownList: [
            { id: '1', type: 'button', text: '导入', click: this.handleImportExcel, disabled: true },
            { id: '2', type: 'button', text: '导出', click: this.handleExportExcel, disabled: true }
          ]
        },
        {
          id: '15',
          type: 'dropdown',
          text: '草稿功能',
          divider: true,
          dropdownList: [
            { id: '1', type: 'button', text: '草稿列表', click: this.handleGetDraftList, disabled: true },
            { id: '2', type: 'button', text: '添加草稿', click: this.handleAddDraft }
          ]
        },
        { id: '13', type: 'button', text: '退出', click: this.quit }
      ]
    },

    // --------------------------------------获取数据，并处理--------------------------------------
    /* 获取设备组内相单元列表 */
    getDeviceUnitList(groupId) {
      return getDeviceUnitList(groupId).then(res => {
        console.log('getDeviceUnitList', res)
        this.deviceUnitList = res.data

        this.deviceUnitList.forEach(item => {
          this.handleAddCurrentInnerPhasePageData(item.deviceId)
        })
      })
    },

    /* 获取设备组外相单元列表 */
    getDeviceUnitOuterPhase(deviceCode) {
      return getDeviceUnitOuterPhase(deviceCode).then(res => {
        console.log('getDeviceUnitOuterPhase', res)
        this.deviceUnitOuterPhase = res.data
      })
    },

    /* 获取bom版本详情 */
    getBomVersionDetail(bomVersionId) {
      return getBomVersionDetail(bomVersionId).then(res => {
        console.log('getBomVersionDetail', res)
        this.formulaMaterialList = res.data.mesFormulaMaterialBomVersionMaterialList.map(item => {
          return {
            ...item,
            remainProportion: item.proportion,
            pipelineId: ''
          }
        })
      })
    },

    /* 获取功能编号和相别功能策略 */
    getFunctionCodeAndMethodMap() {
      for (const [key, value] of this.FUNCTION_CODE_NAME_AND_METHOD_MAP) {
        const functionCode = this.deviceFunctionCodeMap.get(key)
        this.FUNCTION_CODE_AND_METHOD_MAP.set(functionCode, value)
      }
    },

    // --------------------------------------相别操作--------------------------------------
    /* 添加相别控制器（内相） */
    handleOpenInnerPhaseDialog() {
      this.innerPhasePageDialog = true
    },

    /* 添加相别设备ID映射（内相） */
    handleAddInnerPhaseDataObjs(innerPhaseObj) {
      for (const [key, { phaseName, describe }] of Object.entries(innerPhaseObj)) {
        this.handleAddInnerPhaseData({ phaseName, describe, deviceId: key })
        // for (const item of this.currentInnerPhasePageData) {
        //   if (key === item.deviceId) {
        //     const phase = new Phase({ ...item, phaseName, describe }, PHASE_TYPE.INNER_PHASE)
        //     this.phaseData.push(phase)
        //     this.currentInnerPhasePageData.splice(this.currentInnerPhasePageData.indexOf(item), 1)
        //     break
        //   }
        // }
      }
    },

    /* 添加相别（内相） */
    handleAddInnerPhaseData(innerPhaseObj) {
      for (const item of this.currentInnerPhasePageData) {
        if (innerPhaseObj.deviceId === item.deviceId) {
          const phase = new Phase(Object.assign({}, item, innerPhaseObj), PHASE_TYPE.INNER_PHASE)
          if (innerPhaseObj.hasOwnProperty('parentId') && phase.checkHasParentPhase()) {
            phase.handleSetParentPhase(innerPhaseObj.parentId)
          }
          this.phaseData.push(phase)
          this.currentInnerPhasePageData.splice(this.currentInnerPhasePageData.indexOf(item), 1)
          return phase
        }
      }
    },

    /* 添加相别关闭（内相） */
    handleInnerPhasePageClose() {
      this.$refs.innerPhasePage.closeDrawer()
    },

    /* 处理相别添加数据（内相） */
    handleAddCurrentInnerPhasePageData(deviceId) {
      for (const item of this.deviceUnitList) {
        if (item.deviceId === deviceId) {
          this.currentInnerPhasePageData.push(Object.assign({}, item))
          break
        }
      }
    },

    /* 添加相别（外相） */
    handleOpenOuterPhaseDialog() {
      this.currentPhaseData = {}
      this.phaseType = 'add'
      this.phaseDialog = true
    },

    /* 添加相别（外相） */
    handleAddOuterPhaseData(outerPhaseObj) {
      const { phaseName, describe, isTarget, parentId } = outerPhaseObj
      const phase = new Phase(Object.assign({}, this.deviceUnitOuterPhase, outerPhaseObj), PHASE_TYPE.OUTER_PHASE)
      phase.handleSetParentPhase(parentId)
      if (isTarget) phase.setIsTarget()
      this.phaseData.push(phase)
      return phase
    },

    /* 编辑相别 */
    handleEditPhaseData(phaseObj) {
      const { phaseName, describe, isTarget, parentId } = phaseObj
      const phase = this.currentPhaseData
      // 注意，可以优化
      if (phase.parentId !== parentId) {
        phase.handleCleanParentPhaseTransferPool()
        const parentPhase = Phase.queryPhase(parentId)
        if (parentPhase) {
          for (const phaseStep of phase.phaseStepList) {
            const { functionData, functionalDomainData } = phaseStep
            if (this.deviceFunctionCodeMap.get('dischargeFunctionCode') === functionData.functionCode) {
              parentPhase.handleAddCachePhaseTransferPoolItem(functionalDomainData, phase.cacheDischargePool)
            }
          }
        }
      }
      Object.assign(phase, { phaseName, describe, isTarget, parentId })
      phase.handleSetParentPhase(parentId)
      if (isTarget) phase.setIsTarget()
    },

    /**
     * author 林工
     * dateTime 2020年5月26日13:13:49
     * 相别可以编辑相别名称
     */
    /* 编辑相别弹窗 */
    handleTableRowEdit({ row }) {
      this.currentPhaseData = row
      this.phaseType = 'edit'
      this.phaseDialog = true
    },

    /* 相别弹框关闭 */
    handlePhaseDialogClose() {
      this.phaseDialog = false
    },

    /* 删除相别校验 */
    deletePhaseComfirmCheck(row) {
      const validator = Validator.getInstance()
      validator.add(this.deletePhaseRules)
      return validator.execute(row)
    },

    /* 删除相别 */
    deletePhaseComfirm({ row }) {
      if (!this.deletePhaseComfirmCheck(row)) return

      this.$confirm('确认删除吗？', '警告', {
        cancelButtonClass: '取消',
        confirmButtonClass: '确定',
        type: 'warning'
      }).then(() => {
        const { deviceId, phaseType } = row
        if (phaseType === PHASE_TYPE.INNER_PHASE) {
          this.handleAddCurrentInnerPhasePageData(deviceId)
        }
        this.phaseData.splice(this.phaseData.indexOf(row), 1)
        this.$message.success('删除成功')
      })
    },

    // --------------------------------------显示图表操作--------------------------------------
    /* 显示图表 */
    handlePhaseChartShow({ column }) {
      console.log('column', column)
      this.phaseChartDialog = true
    },

    // --------------------------------------相别步骤操作--------------------------------------
    /* 相别步骤页面 */
    handleTableRowEditStep({ row }) {
      console.log('row', row)
      if (!row.isTarget && !row.checkHasParentPhase()) {
        this.notifyError('请先设置上级相别或设置为产物')
        return false
      }
      this.currentPhaseStepPageData = row
      this.phaseStepPageDialog = true
    },

    /* 添加相别步骤 */
    handleAddPhaseStep(phaseStepData) {
      const { describe, functionData, methodData, parameterDataList, functionalDomainData } = phaseStepData
      const { functionCode, functionId, functionName } = functionData

      if (this.FUNCTION_CODE_AND_METHOD_MAP.has(functionCode) && this.FUNCTION_CODE_AND_METHOD_MAP.get(functionCode)['add']) {
        this[this.FUNCTION_CODE_AND_METHOD_MAP.get(functionCode)['add']](phaseStepData)
      }

      const phaseStep = new PhaseStep(phaseStepData)
      const length = this.currentPhaseStepPageData.phaseStepList.push(phaseStep)
      phaseStep.step = length
      console.log('phaseStepList', this.currentPhaseStepPageData.phaseStepList)
    },

    /* 编辑相别步骤 */
    handleEditPhaseStep({ newPhaseStepData, oldPhaseStepData }) {
      const { describe, functionData, methodData, parameterDataList, functionalDomainData } = oldPhaseStepData
      const { functionCode, functionId, functionName } = functionData

      if (this.FUNCTION_CODE_AND_METHOD_MAP.has(functionCode) && this.FUNCTION_CODE_AND_METHOD_MAP.get(functionCode)['recovery']) {
        this[this.FUNCTION_CODE_AND_METHOD_MAP.get(functionCode)['recovery']](newPhaseStepData, oldPhaseStepData)
      }

      if (this.FUNCTION_CODE_AND_METHOD_MAP.has(newPhaseStepData.functionData.functionCode) && this.FUNCTION_CODE_AND_METHOD_MAP.get(newPhaseStepData.functionData.functionCode)['edit']) {
        this[this.FUNCTION_CODE_AND_METHOD_MAP.get(newPhaseStepData.functionData.functionCode)['edit']](newPhaseStepData, oldPhaseStepData)
      }

      const phaseStep = new PhaseStep(newPhaseStepData)
      const phaseStepList = this.currentPhaseStepPageData.phaseStepList
      const editPhaseStepIndex = phaseStepList.indexOf(oldPhaseStepData)
      phaseStep.step = editPhaseStepIndex + 1
      phaseStepList.splice(editPhaseStepIndex, 1, phaseStep)
      console.log('phaseStepList', phaseStepList)
    },

    /* 删除相别步骤 */
    handleDeletePhaseStep(phaseStepData) {
      const { describe, functionData, methodData, parameterDataList, functionalDomainData } = phaseStepData
      const { functionCode, functionId, functionName } = functionData

      if (this.FUNCTION_CODE_AND_METHOD_MAP.has(functionCode) && this.FUNCTION_CODE_AND_METHOD_MAP.get(functionCode)['del']) {
        this[this.FUNCTION_CODE_AND_METHOD_MAP.get(functionCode)['del']](phaseStepData)
      }

      const phaseStepList = this.currentPhaseStepPageData.phaseStepList
      const phaseStepIndex = phaseStepList.indexOf(phaseStepData)
      phaseStepList.splice(phaseStepIndex, 1)

      // TODO 维护step
      for (let i = phaseStepIndex, len = phaseStepList.length; i < len; i++) {
        phaseStepList[i].step--
      }
      console.log('phaseStepList', phaseStepList)
    },

    /* 相别步骤移动校验 */
    handlePhaseStepValidator(sortAry, moveType) {
      const validator = Validator.getInstance()
      validator.add(this.selectionStepIsNotEmptyRules)
      if (moveType === 'moveUp') {
        validator.add(this.selectionStepCanMoveUpRules)
      }
      if (moveType === 'moveDown') {
        validator.add(this.selectionStepCanMoveDownRules)
      }

      return validator.execute(sortAry)
    },

    /* 相别步骤上移处理  */
    handlePhaseStepMoveUp(phaseStepListSelection) {
      phaseStepListSelection.sort((e1, e2) => (e1.step - e2.step))
      if (!this.handlePhaseStepValidator(phaseStepListSelection, 'moveUp')) return

      const phaseData = this.currentPhaseStepPageData.phaseStepList
      for (const item of phaseStepListSelection) {
        const { step } = item
        for (let index = 0, len = phaseData.length; index < len; index++) {
          if (step === phaseData[index].step) {
            // [phaseData[index - 1], phaseData[index]] = [phaseData[index], phaseData[index - 1]]
            phaseData.splice(index - 1, 1, ...phaseData.splice(index, 1, phaseData[index - 1]))
            phaseData[index].step++
            phaseData[index - 1].step--
            break
          }
        }
      }
    },

    /* 相别步骤下移处理 */
    handlePhaseStepMoveDown(phaseStepListSelection) {
      phaseStepListSelection.sort((e1, e2) => (e2.step - e1.step))
      if (!this.handlePhaseStepValidator(phaseStepListSelection, 'moveDown')) return

      const phaseData = this.currentPhaseStepPageData.phaseStepList
      for (const item of phaseStepListSelection) {
        const { step } = item
        for (let index = 0, len = phaseData.length; index < len; index++) {
          if (step === phaseData[index].step) {
            phaseData.splice(index, 1, ...phaseData.splice(index + 1, 1, phaseData[index]))
            phaseData[index].step--
            phaseData[index + 1].step++
            break
          }
        }
      }
    },

    // --------------------------------------提交工艺操作--------------------------------------
    /* 工艺提交校验 */
    handleTechCommitValidator() {
      return new Promise((resolve, reject) => {
        const validator = Validator.getInstance()
        validator.add(this.hasTargetPhaseRules) // 校验是否有目标
        validator.add(this.notHasSurplusMaterialRules) // 判断是否已经用完物料
        validator.add(this.hasAllPhaseStructureRelationRules) // 所有相别已经构建关系
        validator.add(this.notHasSurplusOuterPhaseFeedRules) // 外相是否已投完
        validator.add(this.notHasSurplusInnerPhaseDischargeRules) // 内相是否已出料
        validator.add(this.notHasSurplusInnerPhaseTransferRules) // 内相是否已相转移
        return validator.execute() ? resolve() : reject()
      })
    },

    /* 提交工艺 */
    handleTechCommit() {
      const handleTechCompile = new FnChain(this.handleTechCompile)
      const handleTechCommitValidator = new FnChain(this.handleTechCommitValidator)
      const handleTechCommitRemark = new FnChain(this.handleTechCommitRemark)
      handleTechCompile.setNextFnChain(handleTechCommitValidator)
      handleTechCommitValidator.setNextFnChain(handleTechCommitRemark)
      handleTechCompile.startFnChain()
    },

    /* 打开工艺弹窗 */
    handleTechCommitRemark() {
      this.submitTechDialog = true
    },

    /* 关闭提交工艺弹窗 */
    handleSubmitTechDialogClose() {
      this.submitTechDialog = false
    },

    /* 提交工艺 */
    handleSubmitTechDialogSubmit(formData) {
      const { version, remark } = formData
      // TODO 处理不需要字段
      const techData = []
      for (const phase of this.phaseData) {
        const copyPhase = Object.assign({}, phase)
        Reflect.deleteProperty(copyPhase, 'attributeList')
        Reflect.deleteProperty(copyPhase, 'fileList')
        Reflect.deleteProperty(copyPhase, 'functionList')
        Reflect.deleteProperty(copyPhase, 'functionSetting')
        Reflect.deleteProperty(copyPhase, 'cacheDischargePool')
        Reflect.deleteProperty(copyPhase, 'cachePhaseTransferPool')
        Reflect.deleteProperty(copyPhase, 'alreadyCachePhaseTransferPool')
        Reflect.deleteProperty(copyPhase, 'phaseCompileWarnCount')
        techData.push(copyPhase)
      }

      const data = {
        remark,
        version,
        techData,
        techId: this.currentTechnologyWritingData.techId
      }

      return addTechVersion(data).then(res => {
        this.submitTechDialog = false
        this.$message.success(res.message)
      })
    },

    // --------------------------------------草稿--------------------------------------
    /* 添加草稿 */
    handleAddDraft() {
      this.handleTechCompile().then(() => {
        return this.$prompt('请输入备注', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
      }).then(({ value: remark }) => {
        // TODO 处理不需要字段
        const techData = []
        for (const phase of this.phaseData) {
          const copyPhase = Object.assign({}, phase)
          Reflect.deleteProperty(copyPhase, 'attributeList')
          Reflect.deleteProperty(copyPhase, 'fileList')
          Reflect.deleteProperty(copyPhase, 'functionList')
          Reflect.deleteProperty(copyPhase, 'functionSetting')
          Reflect.deleteProperty(copyPhase, 'cacheDischargePool')
          Reflect.deleteProperty(copyPhase, 'cachePhaseTransferPool')
          Reflect.deleteProperty(copyPhase, 'alreadyCachePhaseTransferPool')
          Reflect.deleteProperty(copyPhase, 'phaseCompileWarnCount')
          techData.push(copyPhase)
        }
        const data = {
          remark: remark || '',
          techData,
          techId: this.currentTechnologyWritingData.techId
        }
        return addDraft(data)
      }).then(res => {
        this.$message.success(res.message)
      })
    },

    // --------------------------------------编译--------------------------------------
    /* 开始编译 */
    handleTechCompile() {
      this.compileLoading = true
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const phaseTree = new PhaseTree(Phase.phaseData)
          const compileState = phaseTree.startCompilePhase()
          this.compileLoading = false
          if (compileState) {
            this.notifySuccess('编译成功')
            resolve()
          } else {
            this.notifyError('编译失败，请查看相别步骤')
            reject()
          }
        }, 5000)
      })
    },

    // --------------------------------------退出工艺编辑操作--------------------------------------
    /* 退出 */
    quit() {
      this.$confirm('确定退出工艺编写？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('close', this.currentTechnologyWritingData.techId)
        Phase.handleClean()
      })
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
$pageBg:#F2F2F2;

.technology-writing-page {
  .page-warpper {
    position: fixed;
    top: 56px;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px;
    background: $pageBg;
    z-index: 1001;

    /deep/.danger-item {
      margin-top: 8px;
      margin-right: 24px;
    }
  }
}

</style>
