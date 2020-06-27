<template>
  <div class="tech-version-detail-page">
    <!-- 工艺信息header -->
    <technology-info-header
      ref="technologyInfoHeader"
      :field-translate-chinese-map="FIELD_TRANSLATE_CHINESE_MAP"
      :field-data="currentTechVersionDetailData"
    />

    <div class="table-warpper">
      <!-- 工艺相别表 -->
      <plk-table
        ref="phase"
        class="phase"
        col-min-width="120px"
        :table-header="phaseHeader"
        :table-data="phaseData"
        :table-selection="false"
      >
        <template v-slot:phaseName="row">
          <div
            class="tech-button"
            :class="{'tech-button-active': row.scope.row.phaseStepList === phaseStepData}"
            type="primary"
            size="medium"
            @click="handlePhaseStepDataDisplay(row.scope)"
          >
            {{ row.scope.row.phaseName }}
          </div>
        </template>
        <template v-slot:isTarget="row">
          <div
            :style="row.scope.row.isTarget ? 'color: red;' : 'color: green;'"
          >
            {{ row.scope.row.isTarget ? '是' : '否' }}
          </div>
        </template>
      </plk-table>

      <!-- 工艺相别步骤表 -->
      <plk-table
        ref="phaseStep"
        class="phase-step"
        col-min-width="120px"
        :table-header="phaseStepHeader"
        :table-data="phaseStepData"
        :table-selection="false"
      >
        <!-- 功能 -->
        <template v-slot:functionCode="row">
          <span>{{ row.scope.row.functionData.functionCode }}</span>
        </template>
        <template v-slot:functionName="row">
          <span>{{ row.scope.row.functionData.functionName }}</span>
        </template>

        <!-- 方式 -->
        <template v-slot:dataCode="row">
          <span>{{ row.scope.row.methodData.dataCode }}</span>
        </template>
        <template v-slot:description="row">
          <span>{{ row.scope.row.methodData.description }}</span>
        </template>
      </plk-table>
    </div>
  </div>
</template>

<script>
import TechnologyInfoHeader from './components/TechnologyInfoHeader'
import PlkTable from '@/components/Table'
export default {
  name: 'TechVersionDetailPage',

  components: { TechnologyInfoHeader, PlkTable },

  props: {
    currentTechVersionDetailData: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
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

      phaseHeader: [
        { label: '相别名称', prop: 'phaseName', fixed: 'left', type: 'slot', align: 'center', width: '160px' },
        { label: '描述', prop: 'describe', width: '160px' },
        { label: '设备编号', prop: 'deviceCode', width: '160px' },
        { label: '设备名称', prop: 'deviceName', width: '160px' },
        { label: '是否为产物', prop: 'isTarget', width: '100px', type: 'slot' },
        { label: '产量下限', prop: 'quantityLowLimit', width: '80px' },
        { label: '产量上限', prop: 'quantityUpLimit', width: '80px' },
        { label: '最大步骤', prop: 'maxTep', width: '80px' },
        { label: '备注', prop: 'remark', width: '160px' },
        { label: '类型', prop: 'type', width: '80px' }
      ],
      phaseData: [],

      phaseStepHeader: [
        { label: '步骤', prop: 'step', width: '80px' },
        { label: '描述', prop: 'describe', width: '160px' },
        { label: '功能编号', prop: 'functionCode', type: 'slot', width: '80px' },
        { label: '功能名称', prop: 'functionName', type: 'slot', width: '160px' },
        { label: '方式编号', prop: 'dataCode', type: 'slot', width: '80px' },
        { label: '方式描述', prop: 'description', type: 'slot', width: '160px' }
      ],
      phaseStepData: []
    }
  },

  mounted() {
    this.init()
    console.log('currentTechVersionDetailData', this.currentTechVersionDetailData)
    const techData = JSON.parse(this.currentTechVersionDetailData.techData)
    this.phaseData = techData
    this.phaseStepData = techData.length ? techData[0].phaseStepList : []
  },

  methods: {
    init() { this.handleTableHeight() },

    /* 处理表格高度 */
    handleTableHeight() {
      const technologyInfoHeaderHeight = this.$refs.technologyInfoHeader.$el.offsetHeight
      const bodyHeight = document.body.offsetHeight
      this.$nextTick(() => {
        this.$refs.phase.tableHeight = bodyHeight - 77 - technologyInfoHeaderHeight - 48 + 'px'
        this.$refs.phaseStep.tableHeight = bodyHeight - 77 - technologyInfoHeaderHeight - 48 + 'px'
      })
    },

    /* 显示相别步骤数据 */
    handlePhaseStepDataDisplay({ row }) {
      this.phaseStepData = row.phaseStepList
    }

  }
}
</script>
<style lang='scss' scoped>
.tech-version-detail-page {
  height: 100%;
  padding: 16px;
  background: #222222;

  .table-warpper {
    display: flex;

    .phase {
      flex: 1 0 400px;
      margin-right: 16px;

      .tech-button {
        padding: 8px 16px;
        background: white;
        border: 1px solid #222222;
        cursor: pointer;
        border-radius: 4px;
      }
      .tech-button-active {
        background: #222222;
        color: white;
      }
    }
    .phase-step {
      flex: 0 1 722px;
    }
  }
}
</style>
