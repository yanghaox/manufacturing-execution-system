<template>
  <div class="control-start-function">
    <plk-table
      table-height="calc(100vh - 400px)"
      col-min-width="160px"
      :table-header="innerPhaseListHeader"
      :table-data="innerPhaseListData"
      :table-selection="false"
    >
      <template v-slot:parentId="row">
        <el-radio v-model="radioValue" :label="row.scope.row.id" @change="handleRadioChange" />
      </template>
    </plk-table>
  </div>
</template>

<script>
const TYPE = {
  ADD: 'add',
  EDIT: 'edit'
}
import PlkTable from '@/components/Table'
import Emitter from '@/views/technology/info/components/js/Emitter'
import ControlStartFunctionPhase from './js/ControlStartFunctionPhase'
export default {
  name: 'ControlStartFunction',

  components: { PlkTable },

  mixins: [Emitter],

  inject: ['TechnologyWritingPage', 'PhaseStepPage'],

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
      /* table */
      innerPhaseListHeader: [
        { label: '控制启动相别', prop: 'parentId', type: 'slot', align: 'center', fixed: 'left' },
        { label: '相别名称', prop: 'phaseName' },
        { label: '描述', prop: 'describe' },
        { label: '设备编号', prop: 'deviceCode' },
        // { label: '设备id', prop: 'deviceId' },
        { label: '设备名称', prop: 'deviceName' },
        { label: '是否为产物', prop: 'isTarget' },
        { label: '产量下限', prop: 'quantityLowLimit' },
        { label: '产量上限', prop: 'quantityUpLimit' },
        { label: '最大步骤', prop: 'maxTep' },
        { label: '备注', prop: 'remark' },
        { label: '类型', prop: 'type' }
        // { label: '类型id', prop: 'typeId' }
      ],
      innerPhaseListData: [],

      /* 缓存选中内相id */
      radioValue: -1
    }
  },
  mounted() {
    console.log('TechnologyWritingPage', this.TechnologyWritingPage.phaseData)
    console.log('PhaseStepPage', this.PhaseStepPage.currentPhaseStepPageData)
    this.innerPhaseListData = this.getNotSelfOfInnerPhase()
    if (this.phaseStepType === TYPE.EDIT && this.functionalDomainData !== null) {
      this.radioValue = this.currentFunctionData.id
    }
  },
  methods: {
    /* 获取非自身的内相别 */
    getNotSelfOfInnerPhase() {
      const phaseData = this.TechnologyWritingPage.phaseData
      const currentPhase = this.PhaseStepPage.currentPhaseStepPageData

      return phaseData.filter(item => {
        return item !== currentPhase && item.phaseType === 'innerPhase'
      })
    },

    /* 根据id查找内相 */
    queryInnerPhase(id) {
      for (const item of this.innerPhaseListData) {
        if (item.id === id) {
          return item
        }
      }
    },

    /* 处理单选框改变 */
    handleRadioChange(value) {
      const innerPhase = this.queryInnerPhase(value)
      const controlStartFunctionPhase = new ControlStartFunctionPhase(innerPhase)
      this.dispatch('PhaseStepDialog', 'on-functional-domain-data', controlStartFunctionPhase)
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
