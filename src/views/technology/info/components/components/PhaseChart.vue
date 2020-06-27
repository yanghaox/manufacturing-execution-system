<template>
  <div class="phase-chart">
    <el-tree :data="treeData" :props="defaultProps" default-expand-all @node-click="handleNodeClick" />
    <!-- <div id="echarts" style="height: 80vh" /> -->
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'PhaseChart',

  inject: ['TechnologyWritingPage'],

  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },

  computed: {
    treeData() {
      const ret = []
      const phaseData = this.TechnologyWritingPage.phaseData
      const targetPhase = this.getTargetPhase(phaseData)
      if (targetPhase) {
        const { phaseName: name } = targetPhase
        const children = this.getSubPhase(targetPhase, phaseData)
        ret.push({ name, children })
      }
      console.log('ret', ret)
      return ret
    }
  },

  mounted() {
    // this.initChart()
  },

  methods: {
    /* 初始化图表 */
    initChart() {
      echarts.init(document.getElementById('echarts')).setOption({
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        series: [
          {
            type: 'tree',
            id: 0,
            name: 'tree1',
            data: this.treeData,

            top: '4%',
            left: '12%',
            bottom: '4%',
            right: '12%',
            orient: 'TB',

            symbol: 'emptyCircle',
            symbolSize: 7,

            edgeForkPosition: '63%',
            initialTreeDepth: -1,

            itemStyle: {
              normal: {
                color: '#EE0000',
                lineStyle: {
                  color: '#EE0000',
                  width: 3,
                  curveness: 0.5
                }
              }
            },

            label: {
              backgroundColor: '#11EE11',
              padding: [8, 16],
              fontSize: 16,
              borderRadius: 4,
              color: '#000000',
              position: 'left',
              verticalAlign: 'middle',
              align: 'right'
            },

            leaves: {
              label: {
                position: 'right',
                verticalAlign: 'middle',
                align: 'left'
              }
            },

            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750
          }
        ]
      })
    },

    /* 获取相别入口 */
    getTargetPhase(phaseData) {
      for (const phase of phaseData) {
        if (phase.isTarget) {
          return phase
        }
      }
    },

    /* 获取子相别 */
    getSubPhase(phase, phaseData) {
      const id = phase.id
      const ret = []

      for (const item of phaseData) {
        const { parentId, phaseName: name } = item
        if (id === parentId) {
          const children = this.getSubPhase(item, phaseData)
          ret.push({ name, children })
        }
      }
      return ret
    },

    /* 处理树节点 */
    handleNodeClick(data) {
      console.log(data)
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
