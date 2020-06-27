<template>
  <div class="phase-transfer-function">
    <plk-table
      table-height="calc(100vh - 400px)"
      col-min-width="150px"
      :table-header="phaseTransferHeader"
      :table-data="phaseTransferData"
      :table-selection="false"
    >
      <template v-slot:id="row">
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
import PhaseTransferFunction from './js/PhaseTransferFunction'
export default {
  name: 'PhaseTransferFunction',

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
      /* table */
      phaseTransferHeader: [
        { label: '相别id', prop: 'id', type: 'slot', align: 'center', fixed: 'left', width: '100px' },
        { label: '出料比例', prop: 'dischargeProportion' },
        { label: '描述', prop: 'describe' },
        { label: '设备编号', prop: 'deviceCode' },
        { label: '设备id', prop: 'deviceId' },
        { label: '设备名称', prop: 'deviceName' },
        { label: '是否为产物', prop: 'isTarget' },
        { label: '上级相别id', prop: 'parentId' },
        { label: '相别名称', prop: 'phaseName' },
        { label: '相别类型', prop: 'phaseType' },
        { label: '备注', prop: 'remark' },
        { label: '类型', prop: 'type' },
        { label: '类型id', prop: 'typeId' }
      ],
      phaseTransferData: [],

      radioValue: -1
    }
  },

  mounted() {
    console.log('TechnologyWritingPage', this.TechnologyWritingPage.currentPhaseStepPageData)
    console.log('currentFunctionData', this.currentFunctionData)
    if (this.phaseStepType === TYPE.EDIT && this.functionalDomainData !== null) {
      this.radioValue = this.currentFunctionData.id
      this.phaseTransferData = this.handleGetEditPhaseTransferList()
    } else {
      this.phaseTransferData = this.handleGetAddPhaseTransferList()
    }
  },

  methods: {
    /* 获取添加相转移列表 */
    handleGetAddPhaseTransferList() {
      const cachePhaseTransferPool = this.TechnologyWritingPage.currentPhaseStepPageData.cachePhaseTransferPool
      const alreadyCachePhaseTransferPool = this.TechnologyWritingPage.currentPhaseStepPageData.alreadyCachePhaseTransferPool
      return this.handleGetUnselectedPhaseTransfer(cachePhaseTransferPool, alreadyCachePhaseTransferPool)
    },

    /* 获取未出料的相转移相 */
    handleGetNotReadyPhaseTransFerList(cacheList, alreadyList) {
      for (const [index, cacheItem] of cacheList.entries()) {
        if (cacheItem.uuid === alreadyList[alreadyList.length - 1].uuid) {
          return cacheList[index + 1]
        }
      }
    },

    /* 获取编辑相转移列表 */
    handleGetEditPhaseTransferList() {
      const ret = []
      const cachePhaseTransferPool = this.TechnologyWritingPage.currentPhaseStepPageData.cachePhaseTransferPool
      const alreadyCachePhaseTransferPool = this.TechnologyWritingPage.currentPhaseStepPageData.alreadyCachePhaseTransferPool
      ret.push(this.handleGetSelectPhaseTransfer(alreadyCachePhaseTransferPool))
      return ret.concat(this.handleGetUnselectedPhaseTransfer(cachePhaseTransferPool, alreadyCachePhaseTransferPool))
    },

    /* 获取未选的相转移项 */
    handleGetUnselectedPhaseTransfer(cachePhaseTransferPool, alreadyCachePhaseTransferPool) {
      const ret = []
      for (const [cKey, cacheList] of Object.entries(cachePhaseTransferPool)) {
        if (this.phaseStepType === TYPE.EDIT && Number(cKey) === this.currentFunctionData.id) continue
        if (!alreadyCachePhaseTransferPool.hasOwnProperty(cKey) || alreadyCachePhaseTransferPool[cKey].length === 0) {
          for (const cacheItem of cacheList) {
            ret.push(cacheItem)
            break
          }
        } else {
          if (alreadyCachePhaseTransferPool[cKey].length === cacheList.length) continue
          ret.push(this.handleGetNotReadyPhaseTransFerList(cacheList, alreadyCachePhaseTransferPool[cKey]))
        }
      }
      return ret
    },

    /* 获取选中的转移项 */
    handleGetSelectPhaseTransfer(alreadyCachePhaseTransferPool) {
      const { id, uuid } = this.currentFunctionData
      for (const item of alreadyCachePhaseTransferPool[id] || []) {
        if (item.uuid === uuid) {
          return item
        }
      }
    },

    /* 根据id查找内相 */
    queryInnerPhase(id) {
      for (const item of this.phaseTransferData) {
        if (item.id === id) {
          return item
        }
      }
    },

    /* 处理单选框改变 */
    handleRadioChange(value) {
      const innerPhase = this.queryInnerPhase(value)
      const phaseTransferFunction = new PhaseTransferFunction(innerPhase)
      this.dispatch('PhaseStepDialog', 'on-functional-domain-data', phaseTransferFunction)
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
