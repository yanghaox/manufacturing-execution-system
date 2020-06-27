<template>
  <el-tabs v-model="feedType" class="feed-function" tab-position="left" :before-leave="handleBeforeLeave" @tab-click="handleTabClick">
    <el-tab-pane label="物料" name="feedMaterial">
      <feed-material
        :phase-step-type="phaseStepType"
        :current-function-data="currentFunctionData"
        :functional-domain-data="functionalDomainData"
      />
    </el-tab-pane>
    <el-tab-pane label="外相" name="feedOuterPhase">
      <feed-outer-phase
        :phase-step-type="phaseStepType"
        :current-function-data="currentFunctionData"
        :functional-domain-data="functionalDomainData"
      />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
const TYPE = {
  ADD: 'add',
  EDIT: 'edit'
}
import FeedMaterial from './components/FeedMaterial'
import Emitter from '@/views/technology/info/components/js/Emitter'
import FeedOuterPhase from './components/FeedOuterPhase'
export default {
  name: 'FeedFunction',

  components: { FeedMaterial, FeedOuterPhase },

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
      /* 标签位置 */
      feedType: 'feedMaterial'
    }
  },

  mounted() {
    if (this.phaseStepType === TYPE.EDIT && this.functionalDomainData !== null) {
      this.feedType = this.currentFunctionData.feedType
    }
  },

  methods: {
    /* 处理离开标签 */
    handleBeforeLeave(activeName, oldActiveName) {
      if (this.phaseStepType === TYPE.ADD) {
        return this.$confirm('切换模式会导致数据重置,是否继续？', '警告', {
          cancelButtonClass: '取消',
          confirmButtonClass: '确定',
          type: 'warning'
        })
      }
    },

    /* 处理标签点击 */
    handleTabClick({ name }) {
      if (name === 'feedMaterial') {
        this.broadcast('FeedMaterial', 'on-change-tab')
      }
      if (name === 'feedOuterPhase') {
        this.broadcast('FeedOuterPhase', 'on-change-tab')
      }
    }
  }
}
</script>
<style lang='scss' scoped></style>
