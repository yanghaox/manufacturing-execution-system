<template>
  <div class="technology-info-header">
    <div v-for="(value, key) in fieldFilterData" :key="key" class="info-content">
      <span class="info-key">{{ fieldTranslateChineseMap.get(key) }}：</span>
      <div class="info-value">{{ value }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TechnologyInfoHeader',

  props: {
    fieldTranslateChineseMap: {
      type: Map,
      required: true
    },

    fieldData: {
      type: Object,
      required: true
    }
  },

  computed: {
    fieldFilterData() {
      return this.fieldTranslateFilter(this.fieldData)
    }
  },

  methods: {
    fieldTranslateFilter(data) {
      const temp = Object.entries(data).filter(([key, value]) => {
        return this.fieldTranslateChineseMap.get(key) !== undefined
      })
      return Object.fromEntries(temp)
    }
  }
}
</script>
<style lang='scss' scoped>
$contentBg: #FFFFFF;

.technology-info-header {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    padding: 8px;
    margin-bottom: 16px;
    background: $contentBg;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);

    .info-content {
      width: 300px;
      height: 40px;

      .info-key {
        float: left;
        width: 120px;
        padding: 0 12px 0 0;
        text-align: right;
        line-height: 40px;
        font-size: 14px;

      }

      .info-value {
        position: relative;
        margin-left: 120px;
        line-height: 40px;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
</style>
