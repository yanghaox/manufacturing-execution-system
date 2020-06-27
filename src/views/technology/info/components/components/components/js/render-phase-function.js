import Developing from '../components/Developing/'
import FeedFunction from '../components/FeedFunction/'
import ControlStartFunction from '../components/ControlStartFunction/'
import ControlledStartFunction from '../components/ControlledStartFunction/'
import PipelineMaterialFunction from '../components/PipelineMaterialFunction/'
import DischargeFunction from '../components/DischargeFunction/'
import PhaseTransferFunction from '../components/PhaseTransferFunction/'
import store from '@/store'
const deviceFunctionCodeMap = store.state.commonConfig.deviceFunctionCodeMap

const NEED_COMPONENT_OF_FUNCTION_CODE_NAME_AND_COMPONENT_MAP = new Map([
  ['feedFunctionCode', FeedFunction],
  ['controlStartFunctionCode', ControlStartFunction],
  ['controlledStartFunctionCode', ControlledStartFunction],
  ['pipelineMaterialFunctionCode', PipelineMaterialFunction],
  ['dischargeFunctionCode', DischargeFunction],
  ['phaseTransferFunctionCode', PhaseTransferFunction]
])

export const NEED_DATA_OF_FUNCTION_CODE_LIST = (function getNeedDataOfFunctionCodeList() {
  const NEED_DATA_OF_FUNCTION_CODE_LIST = []
  for (const key of NEED_COMPONENT_OF_FUNCTION_CODE_NAME_AND_COMPONENT_MAP.keys()) {
    NEED_DATA_OF_FUNCTION_CODE_LIST.push(deviceFunctionCodeMap.get(key))
  }
  return NEED_DATA_OF_FUNCTION_CODE_LIST
})()

export default {
  inject: ['PhaseStepDialog'],

  props: {
    phaseFunctionCode: {
      type: String,
      required: true
    }
  },

  methods: {
    getFunctionCodeName(functionCode) {
      for (const [key, value] of deviceFunctionCodeMap) {
        if (value === functionCode) {
          return key
        }
      }
    }
  },

  render(createElement) {
    console.log('phaseFunctionCode', this.phaseFunctionCode)
    const functionCodeName = this.getFunctionCodeName(this.phaseFunctionCode)
    return createElement(NEED_COMPONENT_OF_FUNCTION_CODE_NAME_AND_COMPONENT_MAP.has(functionCodeName)
      ? NEED_COMPONENT_OF_FUNCTION_CODE_NAME_AND_COMPONENT_MAP.get(functionCodeName) : Developing, {
      attrs: {
        phaseStepType: this.PhaseStepDialog.phaseStepType,
        currentFunctionData: this.PhaseStepDialog.currentPhaseStepData.functionalDomainData,
        functionalDomainData: this.PhaseStepDialog.functionalDomainData
      }
    })
  }
}

// blowdownFunctionCode
// blowdownWaterOilPotFunctionCode
// cleanDischargePipeFunctionCode
// cleanFeedPipeFunctionCode
// cleanSuctionPipeFunctionCode
// controlStartFunctionCode
// controlledStartFunctionCode
// dischargeFunctionCode
// feedFunctionCode
// innerStirFunctionCode
// materialCirculation030Or040FunctionCode
// materialCirculationFunctionCode
// outerStirFunctionCode
// phaseTransferFunctionCode
// pipelineMaterialFunctionCode
// pressureControlFunctionCode
// pressureJudgeFunctionCode
// sampleFunctionCode
// sprayFunctionCode
// temperatureControlFunctionCode
// temperatureJudgeFunctionCode
// tipFunctionCode
// waitFunctionCode
