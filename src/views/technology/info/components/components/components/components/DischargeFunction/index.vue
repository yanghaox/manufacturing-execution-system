<template>
  <div class="discharge-function">
    <h2>出料比例</h2>
    <div v-if="disabledConfig" class="warpper">
      <h1>当前步骤不需要出料，请选择其他功能</h1>
    </div>
    <div v-else class="warpper">
      <el-progress type="dashboard" :percentage="percentageProportion" color="#5cb87a" />
      <div class="input-proportion">
        <el-input
          v-model="cacheCurrentProportion"
          size="small"
          @input="handleCurrentProportionChange"
        >
          <template slot="prepend">
            <el-button icon="el-icon-minus" @click="handleCacheCurrentProportionMin" />
          </template>
          <template slot="append">
            <el-button icon="el-icon-plus" @click="handleCacheCurrentProportionMax" />
          </template>
        </el-input>
      </div>
    </div>
  </div>
</template>

<script>
const TYPE = {
  ADD: 'add',
  EDIT: 'edit'
}
const DELAY = 1500
import DischargeFunction from './js/DischargeFunction'
import Emitter from '@/views/technology/info/components/js/Emitter'
import { preventShake } from '@/utils/prevent-shake'
import { isNonnegativeNumber } from '@/utils/formRules'
import { generateNotRepeatString } from '@/views/technology/info/components/util/generateNotRepeatString'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('commonConfig')

export default {
  name: 'DischargeFunction',

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
      currentPhase: {},
      disabledConfig: false,
      cacheCurrentProportion: 0,

      /* 当前比例防抖 */
      preventShakeCurrentProportion: preventShake()
    }
  },

  computed: {
    ...mapState(['deviceFunctionCodeMap']),
    percentageProportion() {
      return Number(this.cacheCurrentProportion)
    }
  },

  mounted() {
    console.log('this.TechnologyWritingPage.currentPhaseStepPageData', this.TechnologyWritingPage.currentPhaseStepPageData)
    this.currentPhase = this.TechnologyWritingPage.currentPhaseStepPageData
    this.disabledConfig = this.checkDisabledConfig()

    if (this.phaseStepType === TYPE.EDIT && this.functionalDomainData !== null) {
      this.cacheCurrentProportion = this.currentFunctionData.dischargeProportion
    }
  },

  methods: {
    /* 当前步骤是否可以出料 */
    checkDisabledConfig() {
      let _disabledConfig = true
      if (this.phaseStepType === TYPE.ADD) {
        const phaseStepList = this.TechnologyWritingPage.currentPhaseStepPageData.phaseStepList
        for (let i = 0, len = phaseStepList.length; i < len; i++) {
          const { functionData, functionalDomainData } = this.currentPhase.phaseStepList[i]
          const { functionCode } = functionData
          if (this.deviceFunctionCodeMap.get('feedFunctionCode') === functionCode) { _disabledConfig = false }
          if (this.deviceFunctionCodeMap.get('pipelineMaterialFunctionCode') === functionCode) { _disabledConfig = false }
          if (this.deviceFunctionCodeMap.get('dischargeFunctionCode') === functionCode && functionalDomainData.dischargeProportion === 100) { _disabledConfig = true }
        }
      }

      if (this.phaseStepType === TYPE.EDIT) {
        const step = this.PhaseStepPage.currentPhaseStepData.step
        for (let i = 0; i < step - 1; i++) {
          const { functionData, functionalDomainData } = this.currentPhase.phaseStepList[i]
          const { functionCode } = functionData
          if (this.deviceFunctionCodeMap.get('feedFunctionCode') === functionCode) { _disabledConfig = false }
          if (this.deviceFunctionCodeMap.get('pipelineMaterialFunctionCode') === functionCode) { _disabledConfig = false }
          if (this.deviceFunctionCodeMap.get('dischargeFunctionCode') === functionCode && functionalDomainData.dischargeProportion === 100) { _disabledConfig = true }
        }
      }
      return _disabledConfig
    },

    /* 处理输入当前比例 */
    handleCurrentProportionChange(val) {
      this.dispatch('PhaseStepDialog', 'on-commit-loading', true)
      this.preventShakeCurrentProportion(() => {
        if (isNonnegativeNumber(val)) {
          val = Number(val)
          if (val > 100) {
            this.cacheCurrentProportion = 100
          } else {
            this.cacheCurrentProportion = val
          }
        } else {
          this.cacheCurrentProportion = 0
        }
        console.log('this.cacheCurrentProportion', this.cacheCurrentProportion)
        this.handleGenerateAndCommitData(this.cacheCurrentProportion)
        this.dispatch('PhaseStepDialog', 'on-commit-loading', false)
      }, DELAY)
    },

    /* 处理输入最小比例 */
    handleCacheCurrentProportionMin() {
      this.cacheCurrentProportion = 0
      this.handleGenerateAndCommitData(this.cacheCurrentProportion)
    },

    /* 处理输入最大比例 */
    handleCacheCurrentProportionMax() {
      this.cacheCurrentProportion = 100
      this.handleGenerateAndCommitData(this.cacheCurrentProportion)
    },

    /* 生成数据对象, 提交数据 */
    handleGenerateAndCommitData(currentProportion) {
      const dischargeProportion = currentProportion || null
      const uuid = generateNotRepeatString(18)
      const data = dischargeProportion ? new DischargeFunction(Object.assign({}, this.currentPhase, { dischargeProportion, uuid })) : null
      this.handleCommitData(data)
    },

    /* 提交数据 */
    handleCommitData(data) {
      this.dispatch('PhaseStepDialog', 'on-functional-domain-data', data)
    }

  }
}
</script>
<style lang='scss' scoped>
.discharge-function{
  .warpper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .input-proportion {
      width: 320px;
      /deep/ .el-input__inner {
        text-align: center;
      }
    }
  }
}
</style>
