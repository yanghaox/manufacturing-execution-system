<template>
  <plk-table
    table-height="calc(100vh - 400px)"
    col-min-width="160px"
    :table-header="outerPhaseListHeader"
    :table-data="outerPhaseListData"
    :table-selection="false"
  >
    <template v-slot:id="row">
      <el-radio v-model="outerPhaseId" :label="row.scope.row.id" @change="handleRadioChange" />
    </template>
  </plk-table>
</template>

<script>
const TYPE = {
  ADD: 'add',
  EDIT: 'edit'
}
import PlkTable from '@/components/Table'
import Emitter from '@/views/technology/info/components/js/Emitter'
import FeedOuterPhase from '../js/FeedOuterPhase'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('commonConfig')
export default {
  name: 'FeedOuterPhase',

  inject: ['TechnologyWritingPage'],

  components: { PlkTable },

  mixins: [Emitter],

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
      outerPhaseListHeader: [
        { label: '投料外相', prop: 'id', type: 'slot', align: 'center', fixed: 'left', width: '100px' },
        { label: '外相名称', prop: 'phaseName' },
        { label: '描述', prop: 'describe' },
        { label: '设备编号', prop: 'deviceCode' },
        { label: '设备id', prop: 'deviceId' },
        { label: '设备名称', prop: 'deviceName' },
        { label: '是否为产物', prop: 'isTarget' },
        { label: '产量下限', prop: 'quantityLowLimit' },
        { label: '产量上限', prop: 'quantityUpLimit' },
        { label: '最大步骤', prop: 'maxTep' },
        { label: '备注', prop: 'remark' },
        { label: '类型', prop: 'type' },
        { label: '类型id', prop: 'typeId' }
      ],
      outerPhaseListData: [],

      /* 缓存选中内相id */
      outerPhaseId: -1
    }
  },

  computed: {
    ...mapState(['deviceFunctionCodeMap'])
  },

  mounted() {
    this.$on('on-change-tab', this.handleTabChange)
    this.init()
  },

  methods: {
    /* 处理Tab切换 */
    handleTabChange() {
      if (this.phaseStepType === TYPE.ADD) {
        this.handleCommitData(null)
        this.handleResetOuterPhaseId()
      }

      if (this.phaseStepType === TYPE.EDIT) {
        this.handleChangeFeedTypeRecoveryData()
      }
    },

    /* 重置 */
    handleResetOuterPhaseId() {
      this.outerPhaseId = -1
      this.handleCommitData(null)
    },

    /* 处理切换投料方式，恢复数据 */
    handleChangeFeedTypeRecoveryData() {
      this.$nextTick(() => {
        this.handleResetOuterPhaseId()
        this.outerPhaseId = this.currentFunctionData.id
        if (this.currentFunctionData.feedType === 'feedOuterPhase') {
          this.handleCommitData(this.currentFunctionData)
        }
        this.$nextTick(() => {
          this.init()
        })
      })
    },

    /* 初始化 */
    init() {
      this.outerPhaseListData = this.getNotFeedOfSubOuterPhase()
      if (this.phaseStepType === TYPE.EDIT &&
      this.functionalDomainData !== null &&
      this.currentFunctionData.feedType === 'feedOuterPhase') {
        this.outerPhaseListData.unshift(this.currentFunctionData)
        this.outerPhaseId = this.currentFunctionData.id
      }
    },

    /* 获取子外相 */
    getNotFeedOfSubOuterPhase() {
      const phaseData = this.TechnologyWritingPage.phaseData
      const currentPhase = this.TechnologyWritingPage.currentPhaseStepPageData
      console.log('currentPhase.phaseStepList', currentPhase.phaseStepList)

      const notSelfSubOuterPhase = phaseData.filter(item => {
        return item !== currentPhase && item.phaseType === 'outerPhase' && item.parentId === currentPhase.id
      })

      return this.getPhaseInCurrentPhaseStepListFeed(notSelfSubOuterPhase)
    },

    /* 获取未投的外相 */
    getPhaseInCurrentPhaseStepListFeed(notSelfSubOuterPhase) {
      const ret = []
      const phaseStepList = this.TechnologyWritingPage.currentPhaseStepPageData.phaseStepList
      for (const subOuterPhase of notSelfSubOuterPhase) {
        const flag = phaseStepList.some(phaseStep => {
          const { functionData, functionalDomainData } = phaseStep
          return functionData.functionCode === this.deviceFunctionCodeMap.get('feedFunctionCode') &&
          functionalDomainData.feedType === 'feedOuterPhase' &&
          subOuterPhase.id === functionalDomainData.id
        })
        if (!flag) { ret.push(subOuterPhase) }
      }
      return ret
    },

    /* 根据id查找内相 */
    queryOuterPhase(id) {
      for (const item of this.outerPhaseListData) {
        if (item.id === id) {
          return item
        }
      }
    },

    /* 处理单选框改变 */
    handleRadioChange(value) {
      const outerPhase = this.queryOuterPhase(value)
      const feedOuterPhase = new FeedOuterPhase(outerPhase)
      this.handleCommitData(feedOuterPhase)
    },

    /* 提交数据 */
    handleCommitData(data) {
      this.dispatch('PhaseStepDialog', 'on-functional-domain-data', data)
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
