<template>
  <div class="device-pipeline-fun">
    <el-cascader
      v-model="cascaderData"
      :options="cascaderOptions"
      :props="cascaderProps"
      size="medium"
      placeholder="请选择管道物料以及管道"
      clearable
      @change="handleChange"
    />
  </div>
</template>

<script>
import {
  getPipelineMaterial,
  getPipeline
} from '@/api/device/unit.js'
export default {
  name: 'DevicePipelineFun',

  props: {
    settingsData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },

  data() {
    return {
      cascaderProps: {
        multiple: true
        // lazy: true,
        // lazyLoad(node, resolve) {
        //   const { level, value: materialId } = node

        //   getPipeline({ materialId }).then(res => {
        //     const pipelineList = res.data.map(item => {
        //       const { pipelineId: value, pipelineName: label } = item
        //       return { label, value, leaf: level >= 1 }
        //     })
        //     resolve(pipelineList)
        //   })
        // }
      },
      cascaderOptions: [],
      cascaderData: [].concat(this.settingsData)
    }
  },

  mounted() {
    console.log('this.cascaderData', this.cascaderData)
    console.log('this.settingsData', this.settingsData)
    this.init()
  },

  methods: {
    async init() {
      await this.getPipelineMaterial()

      this.cascaderOptions.forEach((item) => {
        this.getPipeline(item.value).then(res => {
          item.children = res
        })
      })
    },

    /* 获取管道物料 */
    getPipelineMaterial() {
      return getPipelineMaterial().then(res => {
        this.cascaderOptions = res.data.map(item => {
          const { materialId: value, materialName: label } = item
          return {
            value,
            label,
            children: []
          }
        })
      })
    },

    /* 获取管道 */
    getPipeline(materialId) {
      return getPipeline({ materialId }).then(res => {
        return res.data.map(item => {
          const { pipelineId: value, pipelineName: label } = item
          return { label, value }
        })
      })
    },

    /* 处理值改变 */
    handleChange() {
      console.log('this.cascaderData', this.cascaderData)
      this.dispatch('DeviceUnitFunDialog', 'on-fun-settings', this.cascaderData)
    },

    /* 触发事件 */
    dispatch(componentName, eventName, params) {
      let parent = this.$parent
      while (parent !== this.$root) {
        if (parent.$options.name === componentName) {
          parent.$emit(eventName, params)
          return
        }
        parent = parent.$parent
      }
    }

  }
}
</script>
<style lang='scss' scoped>
.device-pipeline-fun {
  width: 100%;
  .el-cascader {
    width: 100%;
  }
}
</style>
